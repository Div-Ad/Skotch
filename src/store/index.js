import Vue from 'vue'
import Vuex from 'vuex'

import localforage from 'localforage'
import VuexPersistence from 'vuex-persist'

import _filter from 'lodash/filter'
import _some from 'lodash/some'
import _orderBy from 'lodash/orderBy'
import _find from 'lodash/find'
import _flatMap from 'lodash/flatMap'
import _concat from 'lodash/concat'
import _map from 'lodash/map'
import _merge from 'lodash/merge'
import _uniqBy from 'lodash/uniqBy'
import _reject from 'lodash/reject'
import _assign from 'lodash/assign'
import _compact from 'lodash/compact'
import _findIndex from 'lodash/findIndex'
import _omit from 'lodash/omit'
import _isEmpty from 'lodash/isEmpty'
import _xor from 'lodash/xor'
import _cloneDeep from 'lodash/cloneDeep'

import {firebase} from 'boot/firebase'
import 'firebase/auth'
import { apolloClient } from 'boot/apollo'
import initialState from "src/store/initialState"

Vue.use(Vuex)

const vuexForage = new VuexPersistence({
    key: 'skotch',
    storage: localforage,
    // reducer: (state) => ({
        // thumbnail: state.thumbnail,
        // messagingToken: state.messagingToken,
        // isLoggedIn: state.isLoggedIn,
    	// token: state.token
    // }),
    // filter: (mutation) => mutation.type === 'toogleThumbnail',
    asyncStorage: true
})

export default new Vuex.Store({
	state: {
		user: {
			id: null,
			acceptFriendsRequest: true,
			email: '',
			firstname: '',
			lastname: '',
			photobase64: '',
			photourl: '',
			first_step: false,
			devices: { tokens: [] },
			is_loading: false,
			params: {
				help: {
					ob0: false,
					ob1: false,
					ob2: false,
					ob3: false,
					ob4: false,
					ob5: false,
					ob6: false,
					ob7: false,
					ob8: false,
					ob9: false
				}
			}
		},
		skotchs: [],
		suggestions: [],
		feedbacks: [],
		skotchLists: [],
		skotchListsCatalog: [],
		friends: [],
		notifications: {
			feedback: [],
			request: [],
			requested: [],
			suggestion: [],
			hint: []
		},
		thumbnail: false,
		loginData: null,
		token: '',
		authTokenExpirationTime: null,
		notificationDisplay: false,
		messagingToken: '',
		isLoggedIn: false,
		isLoadingUser: true,
		notificationPermission: null
	},
	mutations: {
		reset: (state) => {
			Object.keys(state).forEach((key) => {
				state[key] = initialState[key]
			})
			localforage.clear().then()
		},
		setSkotchs: (state, skotchs) => {
			state.skotchs = skotchs
		},
		updateSkotch: (state, skotch) => {
			if (_some(state.skotchs, { id: skotch.id })) {
				let sks = _map(state.skotchs, (sk) => {
					if (sk.id === skotch.id) {
						_assign(sk, skotch)
					}
					return sk
				})
				state.skotchs = sks
			}
		},
		addSkotch: (state, skotch) => {
			state.skotchs.push(skotch)
		},
		removeSkotch: (state, skotchId) => {
			let skotchs = _cloneDeep(state['skotchs'])
			state.skotchs = _reject(skotchs, { id: skotchId })
		},
		setSuggestions: (state, suggestions) => {
			state.suggestions = suggestions
		},
		updateSuggestion: (state, suggestion) => {
			if (_some(state.suggestions, { id: suggestion.id })) {
				let ss = _map(state.suggestions, (s) => {
					if (s.id === suggestion.id) {
						_assign(s, suggestion)
					}
					return s
				})
				state.suggestions = ss
			}
		},
		addSuggestions: (state, newSuggestions) => {
			let s = _cloneDeep(state['suggestions'])
			state.suggestions = s.concat(newSuggestions)
		},
		addSuggestedSkotch: (state, newSkotch) => {
			let skotch = _omit(newSkotch, ['suggestions'])
			if (newSkotch.is_hidden) {
				newSkotch.suggestions.forEach((s) => {
					s.skotch_suggested = skotch
					state.suggestions.push(s)
				})
			} else {
				newSkotch.suggestions.forEach((s) => {
					s.skotch_suggested = null
					state.suggestions.push(s)
				})
				state.skotchs.push(skotch)
			}
		},
		updateSkotchAndSuggestionRank: (state, newOrder) => {
			let toUpdateSkotchs = _cloneDeep(state['skotchs'])
			let toUpdateSuggestions = _cloneDeep(state['suggestions'])
			newOrder.forEach((n) => {
				if (n.type === 'skotch') {
					let index = _findIndex(toUpdateSkotchs, function(s) {
						return s['id'] === n.id
					})
					if (index > -1) toUpdateSkotchs[index]['rk'] = n.rk
				} else if (n.type === 'suggestion') {
					let index = _findIndex(toUpdateSuggestions, function(s) {
						return s['id'] === n.id
					})
					if (index > -1) toUpdateSuggestions[index]['rk'] = n.rk
				}
			})
			state['skotchs'] = toUpdateSkotchs
			state['suggestions'] = toUpdateSuggestions
		},
		setFeedbacks: (state, feedbacks) => {
			state.feedbacks = feedbacks
		},
		addFeedback: (state, feedback) => {
			if (_some(state.feedbacks, { suggestion_id: feedback.suggestion_id })) {
				state.feedbacks = _map(state.feedbacks, (f) => {
					if (f.suggestion_id === feedback.suggestion_id) {
						f.feedback = feedback.feedback
					}
					return f
				})
			} else {
				state.feedbacks.push(feedback)
			}
		},
		setSkotchLists: (state, skotchLists) => {
			state.skotchLists = skotchLists
		},
		updateSkotchLists: (state, data) => {
			if (_some(state.skotchLists, { skotch_list: { id: data.skotch_list.id } })) {
				state.skotchLists = _map(state.skotchLists, (sl) => {
					if (sl.skotch_list.id === data.skotch_list.id) {
						sl.active = data.active
					}
					return sl
				})
			} else {
				state.skotchLists.push(data)
			}
		},
		setSkotchListsCatalog: (state, skotchListsCatalog) => {
			state.skotchListsCatalog = skotchListsCatalog
		},
		setFriends: (state, friends) => {
			let ff = friends.filter((f) => {
				if (f.hasOwnProperty('request_from') && f.request_from !== null) {
					return f
				}
			})
			state.friends = ff
		},
		addFriends: (state, friends) => {
			friends.forEach((f) => {
				if (!_some(state.friends, { id: f.id })) {
					if (f.hasOwnProperty('request_to') && f.request_to !== null) {
						state.friends.push(f)
					}
				}
			})
		},
		addRequest: (state, request) => {
			state.friends.push(request)
		},
		updateUser: (state, updatedUser) => {
			if (updatedUser.params == null || !updatedUser.hasOwnProperty('params')) {
				let defaultParams = {help: {ob0: false,	ob1: false,	ob2: false, ob3: false, ob4: false, ob5: false, ob6: false, ob7: false, ob8: false, ob9: false}}
				updatedUser.params = defaultParams
			}
			state.user = updatedUser
			state.isLoadingUser = false
		},
		updateUserPhotoBase64: (state, photobase64) => {
			state.user.photobase64 = photobase64
		},
		toogleThumbnail: (state, thumbnail) => {
			state.thumbnail = thumbnail
		},
		setToken: (state, token) => {
			state.token = token
		},
		setNewToken: (state, token) => {
			state.token = token
			state.authTokenExpirationTime = Date.now() + 1000 * 60 * 60
		},
		setLoginData: (state, data) => {
			state.loginData = data
			state.authTokenExpirationTime = data['stsTokenManager']['expirationTime']
		},
		setMessagingToken: (state, token) => {},
		setNotifications: (state, n) => {
			state.notifications[n[0]] = []
			state.notifications[n[0]] = n[1]
		},
		toogleNotification: (state, display) => {
			state.notificationDisplay = display
		},
		setIsLoggedIn: (state, bool) => {
			state.isLoggedIn = bool
		},
		toogleSkipSubscription: (state, bool) => {
			state.skipSubscriptions = bool
		},
		SET_USER: (state) => {
			// useless mutation but still needed...
		},
		setNotificationsPermissionsStatus: (state, status) => {
			state.notificationPermission = status
		}
	},
	actions: {
		fetchUserInfo(context) {
			return new Promise((resolve, reject) => {
				apolloClient
					.query({
						query: require('../gql/select/user.graphql')
					})
					.then((res) => {
						if (res.data.user.length > 0) {
							context.commit('updateUser', res.data.user[0])
							resolve(res.data.user[0])
						} else {
							reject('gnn')
						}
					})
			})
		},
		async fetchFeedbacks(context) {
			const res = await apolloClient.query({
				query: require('../gql/select/feedback.graphql')
			})
			context.commit('setFeedbacks', res.data.feedback)
		},
		async fetchFriends(context) {
			const res = await apolloClient.query({
				query: require('../gql/select/friends_from.graphql')
			})
			context.commit('setFriends', res.data.friend_data)
			const res2 = await apolloClient.query({
				query: require('../gql/select/friends_to.graphql')
			})
			context.commit('addFriends', res2.data.friend_data)
		},
		async fetchSuggestions(context) {
			const res = await apolloClient.query({
				query: require('../gql/select/suggestions.graphql')
			})
			context.commit('setSuggestions', res.data.suggestion)
		},
		async fetchSkotchs(context) {
			const res = await apolloClient.query({
				query: require('../gql/select/skotchs.graphql')
			})
			context.commit('setSkotchs', res.data.skotch)
		},
		async fetchSkotchLists(context) {
			const res = await apolloClient.query({
				query: require('../gql/select/skotchLists.graphql')
			})
			context.commit('setSkotchLists', res.data.user_skotch_list)
		},
		async skotchListsCatalog(context) {
			const res = await apolloClient.query({
				query: require('../gql/select/skotchListsCatalog.graphql')
			})
			context.commit('setSkotchListsCatalog', res.data.skotch_list_catalog)
		},
		async setMessagingToken({ state, commit }, token) {
			let tokens = null
			if (state.user.devices === null) {
				tokens = []
			} else {
				tokens = [...state.user.devices.tokens]
			}

			tokens.push(token)

			let uniqed = _uniqBy(tokens, (t) => {
				return t.split(':')[0]
			})

			if (_isEmpty(_xor(tokens, uniqed))) {
				let ds = {...state.user.devices}
				if (ds === null) ds = { tokens: [] }
				ds.tokens = uniqed
				const res = await apolloClient.mutate({
					mutation: require('../gql/mutate/mutateUserInfo.graphql'),
					variables: {
						id: state.user.id,
						changes: {
							devices: ds
						}
					}
				})
				commit('updateUser', res.data.update_user.returning[0])
			}
		},
		async updateParamsHelp({state, commit}, params) {
			const res = await apolloClient.mutate({
				mutation: require('../gql/mutate/mutateUserInfo.graphql'),
				variables: {
					id: state.user.id,
					changes: { params }
				}
			})
			commit('updateUser', res.data.update_user.returning[0])
		}
	},
	getters: {
		//
		// SKOTCHLISTS GETTERS
		//
		skotchLists: (state) => state.skotchLists,
		skotchListsCatalog: (state) => state.skotchListsCatalog,
		orderedSkotchListCatalog: (state) => _orderBy(state.skotchListsCatalog, ['rk'], ['asc']),
		isSkotchListActive: (state) => (id) => {
			return _some(state.skotchLists, (sl) => {
				return sl.skotch_list.id === id && sl.active
			})
		},
		userActiveSkotchList: (state) => {
			return _orderBy(
				_filter(state.skotchListsCatalog, function (slc) {
					return _some(state.skotchLists, (sl) => {
						return sl.skotch_list.id === slc.id && sl.active
					})
				}),
				['rk'],
				['asc']
			)
		},
		getSkotchListTag: (state) => (skotch) => {
			let skotchList = _find(state.skotchListsCatalog, { id: skotch.skotch_list_id })
			return _find(skotchList['skotch_list_tags'], { id: skotch.tag_id })
		},
		getAllTags: (state) => {
			return _flatMap(state.skotchListsCatalog, (slc) => {
				return slc.skotch_list_tags
			})
		},
		getSkotchListInfo: (state) => (id) => {
			return _find(state.skotchListsCatalog, { id: id })
		},
		//
		// SKOTCHS GETTERS
		//
		allSkotchs: (state) => state.skotchs,
		skotchs: (state) => {
			let mySkotchs = _filter(state.skotchs, { is_hidden: false })
			let suggestedSkotchs = _map(_filter(state.suggestions, { is_hidden: false }), (s) => {
				if (s.skotch_suggested !== null && s.is_accepted && s.user_id !== state.user.id) {
					return _merge(s.skotch_suggested, {
						archived: s.archived,
						pin: s.pin,
						rk: s.rk,
						user_id: s.user_id,
						suggestion_id: s.id
					})
				}
			})
			return _compact(_uniqBy(_concat(mySkotchs, suggestedSkotchs), 'id'))
		},
		//
		// SUGGESTIONS GETTERS
		//
		suggestions: (state) => state.suggestions,
		//
		// FEEDBACK GETTERS
		//
		feedbacks: (state) => state.feedbacks,
		hasFeedback: (state) => (s) => {
			return (
				s.hasOwnProperty('suggestion_id') &&
				_some(state.feedbacks, { suggestion_id: s.suggestion_id })
			)
		},
		getFeedback: (state) => (s) => {
			if (s.hasOwnProperty('suggestion_id'))
				return _find(state.feedbacks, { suggestion_id: s.suggestion_id })
			else return { feedback: '' }
		},
		//
		// FRIEND GETTERS
		//
		allFriends: (state) => state.friends,
		friends: (state) => {
			return _orderBy(
				_filter(state.friends, (f) => {
					if (f.request_from !== null && f.request_from !== undefined) {
						if (f.request_from.is_accepted) return f
					} else if (f.request_to !== null && f.request_to !== undefined) {
						if (f.request_to.is_accepted) return f
					}
				}),
				['firstname', 'lasttname'],
				['asc', 'asc']
			)
		},
		getFriend: (state) => (id) => {
			if (_some(state.friends, { id: id })) {
				return _find(state.friends, { id: id })
			} else {
				return {
					firstname: '',
					lastname: '',
					photobase64: '',
					photourl: ''
				}
			}
		},
		friendCount: (state) => {
			return _filter(state.friends, (f) => {
				if (f.request_from !== null && f.request_from !== undefined) {
					if (f.request_from.is_accepted) return f
				} else if (f.request_to !== null && f.request_to !== undefined) {
					if (f.request_to.is_accepted) return f
				}
			}).length.toString()
		},
		//
		// NOTIFICATIONS GETTERS
		//
		notifications: (state, getters) => {
			let unreadFeedback = _filter(state.notifications.feedback, (f) => {
				let s = _find(state.suggestions, { id: f.suggestion_id })
				let skotch = {}
				if (s.hasOwnProperty('skotch_suggested') && s.skotch_suggested !== null) {
					skotch = s.skotch_suggested
				} else {
					skotch = _find(state.skotchs, { id: s.skotch_id })
				}
				return Object.assign(f, {
					type: 'feedback',
					user_id: s.friend_id,
					skotch_name: skotch.name,
					skotch_id: skotch.id
				})
			})
			let unreadSuggestions = _map(state.notifications.suggestion, (s) => {
				return Object.assign(s, { type: 'suggestion' })
			})
			let unreadSuggestionHint = _map(state.notifications.hint, (h) => {
				let skotch = { name: '' }
				if (_some(getters.skotchs, { id: h.skotch_id })) {
					skotch = _find(getters.skotchs, { id: h.skotch_id })
				}
				return Object.assign(h, {
					type: 'suggestion_hint',
					skotch_name: skotch.name,
					friend_id: h.friend_id
				})
			})
			let unreadRequest = _map(state.notifications.request, (f) => {
				if (f.hasOwnProperty('user') && f.user != null) {
					return {
						lastname: f.user.lastname,
						firstname: f.user.firstname,
						photobase64: f.user.photobase64,
						photourl: f.user.photourl,
						user_id: f.user_id,
						type: 'request'
					}
				}
			})
			let unreadRequested = _map(state.notifications.requested, (r) => {
				if (r.hasOwnProperty('friend') && r.friend != null) {
					return {
						lastname: r.friend.lastname,
						firstname: r.friend.firstname,
						photobase64: r.friend.photobase64,
						photourl: r.friend.photourl,
						id: r.friend.id,
						type: 'requested'
					}
				}
			})
			return _orderBy(
				_concat(
					unreadFeedback,
					unreadSuggestions,
					unreadSuggestionHint,
					unreadRequest,
					unreadRequested
				),
				['created'],
				['desc']
			)
		},
		unreadCount: (state, getters) => {
			let notifNumber = getters.notifications.length
			if (!isNaN(notifNumber)) {
				return ('0' + notifNumber.toString()).slice(-2)
			} else {
				return 0
			}
		},
		//
		// USER INFO GETTERS
		//
		loginData: (state) => state.loginData,
		userInfo: (state) => state.user,
		// userInfo: (state) => {
		// 	return {
		// 		uid: state.user.uid,
		// 		firstname: state.user.config.firstname,
		// 		lastname: state.user.config.lastname,
		// 		photoBase64: state.user.config.photoBase64,
		// 		photoUrl: state.user.config.photoUrl
		// 	}
		// },
		userConfig: (state) => {
			if (state.user !== null && state.user.config !== undefined) {
				return state.user
			}
			return {
				id: null,
				acceptFriendsRequest: true,
				email: '',
				firstname: '',
				lastname: '',
				photobase64: '',
				notification_permission: false,
				photourl: '',
				first_step: false
			}
		},
		//
		// UX GETTERS
		//
		thumbnail: (state) => state.thumbnail,
		notificationDisplay: (state) => state.notificationDisplay,
		//
		// AUTH GETTERS
		//
		token: (state) => {
			return state.token
		},
		isLoggedIn: (state) => state.isLoggedIn,
		isAuthTokenExpired: (state) => {
			return state.authTokenExpirationTime === null
		},
		isLoadingUser: (state) => state.isLoadingUser,
		messagingToken: (state) => state.messagingToken,
		notificationPermission: (state) => state.notificationPermission
	},
	plugins: [vuexForage.plugin],
	strict: process.env.NODE_ENV !== 'production'
})
