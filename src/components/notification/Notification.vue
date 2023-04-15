<template src="./notification.pug" lang="pug" />
<style src="./notification.sass" lang="sass" />

<script>
import { mapGetters } from 'vuex'
import _without from 'lodash/without'
import _find from 'lodash/find'
import Feedback from '../../helpers/feedback-enum'
import Loading from 'components/loading/Loading'
import ContactThumbnail from 'src/composition/ContactThumbnail'
import {Platform} from "quasar"
import Autolinker from 'autolinker'
import notificationApi from "src/composition/setupPushNotification";

export default {
	name: 'Notification',
	components: { Loading, ContactThumbnail },
	data() {
		return {
			isLoadingRequest: [],
			isLoadingSuggestion: [],
			isLoadingIsRead: [],
			showDescription: []
		}
	},
	computed: {
		...mapGetters([
			'notifications',
			'unreadCount',
			'friends',
			'getSkotchListInfo',
			'getSkotchListTag',
			'getFriend',
			'feedbacks',
			'skotchLists',
			'notificationPermission'
		])
	},
	created() {
		console.log(this.notificationPermission)
	},
	methods: {
		acceptFriendRequest(n, isAccepted) {
			if (!this.isLoadingRequest.includes(n.user_id)) {
				this.isLoadingRequest.push(n.user_id)
				this.$apollo
					.mutate({
						mutation: require('../../gql/mutate/mutateRequest.graphql'),
						variables: {
							user_id: n.user_id,
							friend_id: this.$store.getters.userInfo.id,
							changes: {
								is_accepted: isAccepted
							}
						}
					})
					.then((data) => {
						this.$store.dispatch('fetchFriends')
					})
					.catch((error) => {
						console.log(error)
					})
					.finally(() => {
						this.isLoadingRequest = _without(this.isLoadingRequest, n.id)
						if (isAccepted) this.$toasted.show('Ok, ajouté !')
					})
			}
		},
		acceptFriendSuggestion(n, isAccepted) {
			if (!this.isLoadingSuggestion.includes(n.id)) {
				this.isLoadingSuggestion.push(n.id)
				this.$apollo
					.mutate({
						mutation: require('../../gql/mutate/acceptSuggestion.graphql'),
						variables: {
							id: n.id,
							changes: {
								is_accepted: isAccepted
							}
						}
					})
					.then((data) => {
						if (isAccepted) {
							let s = data.data.update_suggestion.returning[0]
							this.$store.commit('addSuggestions', s)
							this.toogleSkotchList(s)
						}
					})
					.catch((error) => {
						console.log(error)
					})
					.finally(() => {
						this.isLoadingSuggestion = _without(this.isLoadingSuggestion, n.id)
						if (isAccepted) this.$toasted.show("Suggestion acceptée, c'est skotché ! ")
					})
			}
		},
		getFeedbackText(f) {
			switch (f.feedback) {
				case Feedback.HATED:
					return 'a totalement détesté <b>' + f.skotch_name + '</b>'
				case Feedback.DISLIKED:
					return "n'a pas aimé <b>" + f.skotch_name + '</b>'
				case Feedback.MEH:
					return 'ne sait pas trop quoi penser de <b>' + f.skotch_name + '</b>'
				case Feedback.LIKED:
					return 'a aimé <b>' + f.skotch_name + '</b>'
				case Feedback.LOVE:
					return 'a adoré <b>' + f.skotch_name + '</b>'
				default:
					return 'vous a envoyé un feedback concernant <b>' + f.skotch_name + '</b>'
			}
		},
		toogleDescription(s) {
			if (this.showDescription.includes(s.timestamp)) {
				this.showDescription = _without(this.showDescription, s.timestamp)
			} else {
				this.showDescription.push(s.timestamp)
			}
		},
		swipeHandler(direction) {
			if (direction === 'right') {
				this.$emit('close')
			}
		},
		setSuggestionHintRead(h) {
			if (!this.isLoadingIsRead.includes(h.id)) {
				this.isLoadingIsRead.push(h.id)
				this.$apollo
					.mutate({
						mutation: require('../../gql/mutate/readSuggestionHint.graphql'),
						variables: {
							id: h.id,
							changes: {
								is_read_by_user: true
							}
						}
					})
					.then((data) => {})
					.catch((error) => {
						console.log(error)
					})
					.finally(() => {
						this.isLoadingIsRead = _without(this.isLoadingIsRead, h.id)
					})
			}
		},
		toogleSkotchList(suggestion) {
			let skl = _find(this.skotchLists, (skl) => {
				return skl.skotch_list.id === suggestion.skotch_suggested.skotch_list_id
			})
			if (skl === undefined || !skl.active) {
				this.$apollo
					.mutate({
						mutation: require('../../gql/insert/upsertUserSkotchList.graphql'),
						variables: {
							userSkotchList: {
								skotch_list_id: suggestion.skotch_suggested.skotch_list_id,
								active: true
							}
						}
					})
					.then((data) => {
						this.$store.commit(
							'updateSkotchLists',
							data.data.insert_user_skotch_list.returning[0]
						)
					})
					.catch((error) => {
						console.log(error)
					})
			}
		},
		setFeedbackRead(f) {
			if (!this.isLoadingIsRead.includes(f.suggestion_id)) {
				this.isLoadingIsRead.push(f.suggestion_id)
				this.$apollo
					.mutate({
						mutation: require('../../gql/mutate/readFeedback.graphql'),
						variables: {
							id: f.suggestion_id
						}
					})
					.then((data) => {})
					.catch((error) => {
						console.log(error)
					})
					.finally(() => {
						this.isLoadingIsRead = _without(this.isLoadingIsRead, f.suggestion_id)
					})
			}
		},
		setRequestStatusRead(n) {
			if (!this.isLoadingIsRead.includes(n.id)) {
				this.isLoadingIsRead.push(n.id)
				this.$apollo
					.mutate({
						mutation: require('../../gql/mutate/readRequestAccepted.graphql'),
						variables: {
							friend_id: n.id,
							user_id: this.$store.getters.userInfo.id,
							changes: {
								is_read: true
							}
						}
					})
					.then((data) => {
						this.$store.dispatch('fetchFriends')
					})
					.catch((error) => {
						console.log(error)
					})
					.finally(() => {
						this.isLoadingIsRead = _without(this.isLoadingIsRead, n.id)
					})
			}
		},
        isMac() {
		    return Platform.is.mac || Platform.is.safari
        },
		async isNotificationDefault() {
			if (this.$q.platform.is.capacitor) {
				return await notificationApi().isNotificationDefault()
			} else {
				return (
					!(Platform.is.mac || Platform.is.safari) &&
					Notification.permission === 'default' &&
					'Notification' in window
				)
			}
		},
		async isNotificationGranted() {
			if (this.$q.platform.is.capacitor) {
				return await notificationApi().isNotificationGranted()
			} else {
				return (
					!(Platform.is.mac || Platform.is.safari) &&
					Notification.permission === 'granted' &&
					'Notification' in window
				)
			}

		},
		async isNotificationDenied() {
			if (this.$q.platform.is.capacitor) {
				return await notificationApi().isNotificationDenied()
			} else {
				return (
					!(Platform.is.mac || Platform.is.safari) &&
					Notification.permission === 'denied' &&
					'Notification' in window
				)
			}
		},
		getAutolinktext(rawString) {
		  let formatedString = Autolinker.link(rawString, { sanitizeHtml: true, truncate: { length: 42, location: 'smart' }})
		  return formatedString
		},
		requestPermissionNotifications() {
			if (this.isNotificationDefault()) {
				return notificationApi().requestPermissions()
			}
		}
	}
}
</script>
