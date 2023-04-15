<template src="src/templates/skotch/skotch-list.pug" lang="pug"/>
<style src="src/css/skotchlist/skotch-list.sass" lang="sass"/>

<script>
import Nav from 'components/nav/Nav'
import ContactThumbnail from "src/composition/ContactThumbnail"
import Feedback from 'components/feedback/Feedback'
import OBSkOptions from "components/help/OBSkOptions"
import OBSkOrder from "components/help/OBSkOrder"
import OBSkFilter from "components/help/OBSkFilter"
import Autolinker from 'autolinker'
import draggable from 'vuedraggable'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import _map from 'lodash/map'
import _some from 'lodash/some'
import _reject from 'lodash/reject'
import {date} from 'quasar'
import _merge from 'lodash/merge'
import gql from 'graphql-tag'


export default {
    name: 'skotchlist',
    props: ['skotchListName'],
    components: {
        draggable,
        Nav, Feedback, ContactThumbnail,
        OBSkOptions, OBSkOrder, OBSkFilter
    },
    data() {
        return {
            skotchList: {
                id: '',
                icon: '',
                title: {
                    fr: '',
                    en: ''
                },
                skotch_list_tags: []
            },
            from: {},
            sktheque: false,
            selectedSkotch: null,
            filterDisplay: false,
            bookmark: false,
            animate: false,
            triggeredToast: false,
            toastMessage: '',
            filterTag: null,
            sortList: null,
            feedbackDisplay: false,
            skotchFeedbackObject: null,
            searchOpened: null,
            friendFilter: false,
            skthequeHelpDisplay: false,
            bkHelpDisplay: false

        }
    },
    computed: {
        ...mapGetters([
            'skotchListsCatalog',
            'getFriend',
            'friendCount',
            'skotchLists',
            'skotchs',
            'hasFeedback',
            'getFeedback',
            'suggestions',
            'userInfo'
        ]),
        draggableSkotchs: {

            get() {
                return this.orderedSkotchs
            },
            set(skotchs) {
                let newOrder = _map(skotchs, (s, i) => {
                    if (s.hasOwnProperty('suggestion_id') && s.hasOwnProperty('user_id')) {
                        return {
                            id: s.suggestion_id,
                            rk: i,
                            type: 'suggestion',
                            toUpdate: i !== s.rk,
                            name: s.name
                        }
                    } else {
                        return {
                            id: s.id,
                            rk: i,
                            type: 'skotch',
                            toUpdate: i !== s.rk,
                            name: s.name
                        }
                    }
                })
                this.reorderSkotch(newOrder)
            }
        },
        dragOptions() {
            return {
                animation: 250,
                //disabled: this.bookmark || this.sktheque,
                ghostClass: 'ghost', // Class name for the drop placeholder
                handle: '.skotch', // Drag handle selector within list items
                delay: 200, // time in milliseconds to define when the sorting should start
                delayOnTouchOnly: false, // only delay if user is using touch
                touchStartThreshold: 16, // px, how many pixels the point should move before cancelling a delayed drag event
            }
        },
        skotchsInList() {
            return _filter(this.skotchs, {skotch_list_id: this.skotchList.id})
        },
        skotchsFiltered() {
            let predicateFilter = {}
            if (this.filterTag !== null) predicateFilter['tag_id'] = this.filterTag
            let filteredSkotchs = _filter(this.skotchsInList, predicateFilter)
            if (this.friendFilter) {
                return _reject(filteredSkotchs, (s) => {
                    return !s.hasOwnProperty('user_id' )
                })
            } else {
                return filteredSkotchs
            }
        },
        skotchsOrdered() {
            let iterateesToSort = []
            let iterateesOrder = []
            if (this.sortList === 'az') {
                iterateesToSort = ['name']
                iterateesOrder = ['asc']
            } else if (this.sortList === 'date') {
                iterateesToSort = ['created']
                iterateesOrder = ['desc']
            } else {
                iterateesToSort = ['rk']
                if (!this.sktheque) iterateesOrder = ['asc']
                else iterateesOrder = ['asc']
            }
            return _orderBy(this.skotchsFiltered, iterateesToSort, iterateesOrder)
        },
        currentSkotchs() {
            return _filter(this.skotchsOrdered, {archived: false})
        },
        archivedSkotchs() {
            return _filter(this.skotchsOrdered, {archived: true})
        },
        orderedSkotchs() {
            if (!this.bookmark) return this.skotchsOrdered
            else return _orderBy(_filter(this.skotchs, 'pin'), ['rk'], ['asc'])
        },
        orderedTags() {
            let skotchsInList = _filter(this.skotchs, {skotch_list_id: this.skotchList.id})
            let usedTags = _filter(this.skotchList.skotch_list_tags, (t) => {
                if (_some(skotchsInList, {tag_id: t.id})) {
                    return t
                }
            })
            return _orderBy(usedTags, ['rk'], ['asc'])
        },
        suggestedSkotchs() {
            return _filter(
                _map(this.suggestions, (s) => {
                    if (s.skotch_suggested !== null && s.is_accepted && !s.archived) {
                        return _merge(s.skotch_suggested, {
                            archived: s.archived,
                            pin: s.pin,
                            rk: s.rk,
                            user_id: s.user_id,
                            suggestion_id: s.id
                        })
                    }
                }),
                {skotch_list_id: this.skotchList.id}
            )
        }
    },
    // beforeRouteEnter(to, from, next) {
    // 	next(vm => {
    // 		console.log(to.name)
    // 		if (to.name === 'bookmarked') {
    // 			vm.bookmark = true
    // 		}
    // 	})
    // },
    watch: {
        skotchListsCatalog: function (newC, oldC) {
            if (newC.length > 0) {
                this.skotchList = _find(newC, {old_id: this.skotchListName})
            }
        }
    },
    created() {
        if (this.$route.name === 'bookmarked') {
            this.bookmark = true
        } else {
            this.skotchList = _find(this.skotchListsCatalog, {old_id: this.skotchListName})
        }
    },
    methods: {
        ...mapActions(['updateUserTodoLists', 'updateParamsHelp']),
        onMove(evt) {
            console.log('onmove')
        },
        getAutolinktext(rawString) {
            let formatedString = Autolinker.link(rawString, {
                sanitizeHtml: true,
                truncate: {length: 42, location: 'middle'}
            })
            return formatedString
        },
        getSkotchCount(skotchList, isArchive) {
            return (
                '0' +
                _filter(this.skotchs, {
                    skotch_list_id: skotchList,
                    archived: isArchive
                }).length.toString()
            ).slice(-2)
        },
        // getArchivedSkotchCount(skotchList) {
        // 	return (
        // 		'0' +
        // 		_filter(this.skotchs, {
        // 			skotch_list_id: skotchList,
        // 			archived: true
        // 		}).length.toString()
        // 	).slice(-2)
        // },
        selectTagFilter(tag) {
            if (this.filterTag === tag) this.filterTag = null
            else this.filterTag = tag
        },
        selectSkotch(timestamp) {
            if (this.selectedSkotch === timestamp) this.selectedSkotch = null
            else this.selectedSkotch = timestamp
        },
        searchOpen(timestamp) {
            if (this.searchOpened === timestamp) this.searchOpened = null
            else this.searchOpened = timestamp
        },
        archiveSkotch(s) {
            let ts = Math.trunc(Date.now() / 1000)
            if (s.hasOwnProperty('user_id')) {
                this.$apollo
                    .mutate({
                        mutation: require('../../gql/mutate/mutateSuggestion.graphql'),
                        variables: {
                            id: s.suggestion_id,
                            changes: {
                                archived: !s.archived,
                                rk: s.archived ? (0 - ts) : ts
                            }
                        }
                    })
                    .then((data) => {
                        this.$store.commit(
                            'updateSuggestion',
                            data.data.update_suggestion.returning[0]
                        )
                        this.triggerToast()
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                    .finally(() => {
                        this.selectedSkotch = null
                    })
            } else {
                this.$apollo
                    .mutate({
                        mutation: require('../../gql/mutate/mutateUserSkotch.graphql'),
                        variables: {
                            id: s.id,
                            changes: {
                                archived: !s.archived,
                                rk: s.archived ? (0 - ts) : ts
                            }
                        }
                    })
                    .then((data) => {
                        this.$store.commit('updateSkotch', data.data.update_skotch.returning[0])
                        this.triggerToast('Hop, dans votre Collection.')
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                    .finally(() => {
                        this.selectedSkotch = null
                    })
            }
        },
        editSkotch(skotch) {
            this.$router.push({
                name: 'quick-create',
                params: {action: 'edit', skotchToEdit: skotch}
            })
        },
        deleteSkotchDialog(skotch) {
            let self = this
            this.$dialog
                .confirm('Voulez-vous supprimer définitivement ce skotch ?', {
                    okText: 'Supprimer',
                    cancelText: 'conserver'
                })
                .then(() => {
                    if (skotch.hasOwnProperty('user_id')) {
                        self.$apollo
                            .mutate({
                                mutation: require('../../gql/mutate/mutateSuggestion.graphql'),
                                variables: {
                                    id: skotch.suggestion_id,
                                    changes: {
                                        is_hidden: true
                                    }
                                }
                            })
                            .then((data) => {
                                this.$store.commit(
                                    'updateSuggestion',
                                    data.data.update_suggestion.returning[0]
                                )
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                            .finally(() => {
                                this.selectedSkotch = null
                            })
                    } else {
                        self.$apollo
                            .mutate({
                                mutation: require('../../gql/mutate/mutateUserSkotch.graphql'),
                                variables: {
                                    id: skotch.id,
                                    changes: {
                                        is_hidden: true
                                    }
                                }
                            })
                            .then((data) => {
                                this.$store.commit('updateSkotch', data.data.update_skotch.returning[0])
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                            .finally(() => {
                                this.selectedSkotch = null
                            })
                    }

                })
                .catch(() => {
                })
        },
        pinSkotch(s) {
            if (s.hasOwnProperty('user_id')) {
                this.$apollo
                    .mutate({
                        mutation: require('../../gql/mutate/mutateSuggestion.graphql'),
                        variables: {
                            id: s.suggestion_id,
                            changes: {
                                pin: !s.pin
                            }
                        }
                    })
                    .then((data) => {
                        this.$store.commit(
                            'updateSuggestion',
                            data.data.update_suggestion.returning[0]
                        )
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                    .finally(() => {
                        this.selectedSkotch = null
                    })
            } else {
                this.$apollo
                    .mutate({
                        mutation: require('../../gql/mutate/mutateUserSkotch.graphql'),
                        variables: {
                            id: s.id,
                            changes: {
                                pin: !s.pin
                            }
                        }
                    })
                    .then((data) => {
                        this.$store.commit('updateSkotch', data.data.update_skotch.returning[0])
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                    .finally(() => {
                        this.selectedSkotch = null
                    })
            }

        },
        reorderSkotch(newOrder) {
            this.$store.commit('updateSkotchAndSuggestionRank', newOrder)
            newOrder.forEach((n, i) => {
                if (n.type === 'skotch' && n.toUpdate) {
                    this.$apollo
                        .mutate({
                            mutation: gql`
								mutation update_skotch_order($skotchId: uuid!, $rank: Int) {
									update_skotch_by_pk(
										pk_columns: { id: $skotchId }
										_set: { rk: $rank }
									) {
										id
									}
								}
							`,
                            variables: {
                                skotchId: n.id,
                                rank: n.rk
                            }
                        })
                        .then((data) => {
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                } else if (n.type === 'suggestion' && n.toUpdate) {
                    this.$apollo
                        .mutate({
                            mutation: gql`
								mutation update_suggestion_order($suggestionId: uuid!, $rank: Int) {
									update_suggestion_by_pk(
										pk_columns: { id: $suggestionId }
										_set: { rk: $rank }
									) {
										id
									}
								}
							`,
                            variables: {
                                suggestionId: n.id,
                                rank: n.rk
                            }
                        })
                        .then((data) => {
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
            })
        },
        shareSkotch(skotch) {
            this.$router.push({
                name: 'quick-create',
                params: {action: 'share', skotchToEdit: skotch}
            })
        },
        triggerToast(msg) {
            this.toastMessage = msg
            this.triggeredToast = true
            setTimeout(() => {
                this.triggeredToast = false
                this.toastMessage = ''
            }, 750)
        },
        getTimestamp(skotch) {
            return 'le ' + date.formatDate(skotch.created, 'DD/MM/YYYY HH:mm')
        },
        getTagTranslation(tag_id) {
            let tagFound = _find(this.$store.getters.getAllTags, {id: tag_id})
            if (tagFound !== undefined) {
                return tagFound.title['fr']
            } else {
                return ''
            }
        },
        swipeHandler(direction) {
            if (this.$route.name === 'skotch-list') {
                if (direction === 'right') {
                    this.sktheque = false
                    this.animate = true
                } else if (direction === 'left') {
                    this.sktheque = true
                    this.animate = true
                }
            }
        },
        toogleFeedback(skotch) {
            if (this.feedbackDisplay) this.skotchFeedbackObject = null
            else this.skotchFeedbackObject = skotch

            this.feedbackDisplay = !this.feedbackDisplay
        },
        toogleSortList(sort) {
            if (this.sortList === sort) this.sortList = null
            else this.sortList = sort
        },
        hideHelp(ob) {
            let updatedParams = this.userInfo.params
            updatedParams.help[ob] = true
            this.$store.dispatch('updateParamsHelp', updatedParams)
        },
        showHelp(ob) {
            let updatedParams = this.userInfo.params
            updatedParams.help[ob] = false
            this.$store.dispatch('updateParamsHelp', updatedParams)
        }
    }
}
</script>
