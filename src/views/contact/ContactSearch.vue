<template src="src/templates/contact/contact-search.pug" lang="pug" />
<style src="src/css/contact/contact-search.sass" lang="sass" />

<script>
import { mapGetters, mapMutations } from 'vuex'
import _some from 'lodash/some'
import _deburr from 'lodash/deburr'
import _without from 'lodash/without'
import _find from 'lodash/find'
import ContactThumbnail from "src/composition/ContactThumbnail"
import Nav from "components/nav/Nav";

export default {
    name: 'ContactSearch',
    components: {
        Nav, ContactThumbnail
    },
    data() {
        return {
            searchInput: '',
            searchQuery: '',
            searchResult: null,
            ctDemoResults: false,
            isLoadingSearch: false,
            isLoadingRequest: [],
            isLoadingRequestAccept: [],
            noFriendHelp: false
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'friends', 'notifications', 'allFriends', "friendCount"])
    },
    methods: {
        ...mapMutations(['toogleNotification']),
        focusSearchButton() {
            this.$refs.search.focus()
        },
        searchRequest() {
            if (this.searchInput.length > 2) {
                this.searchQuery = ''
                this.isLoadingSearch = true
                this.$apollo.mutate({
                    mutation: require('../../gql/select/friend_search.graphql'),
                    variables: {
                        term: '%' + _deburr(this.searchInput)
                            .toLowerCase()
                            .normalize('NFC')
                            .replace(/\s/g, '') + '%'
                    }
                }).then((data) => {
                    this.searchResult = data.data.search_users
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.isLoadingSearch = false
                    this.searchQuery = this.searchInput
                })
            } else {
                this.searchResult = null
            }
        },
        applyFriendshipRequest(idx) {
            // let self = this
            // let timestamp = new Date().getTime()
            let friendId = this.searchResult[idx].id
            this.isLoadingRequest.push(friendId)
            this.$apollo.mutate({
                mutation: require('../../gql/insert/insertUserRequest.graphql'),
                variables: {
                    friend_id: friendId
                }
            }).then((data) => {
                this.$store.commit('addRequest', data.data.insert_friend_one)
            }).catch((error) => {
                console.log(error)
            }).finally(() => {
                this.isLoadingRequest = _without(this.isLoadingRequest, friendId)
            })
            // const options = {
            //     method: 'POST',
            //     headers: {
            //         Accept: 'application/json',
            //         'Content-Type': 'application/json;charset=UTF-8',
            //         Authorization: `Bearer ${store.state.token}`
            //     },
            //     body: JSON.stringify({
            //         data: {
            //             ts: timestamp,
            //             to: friendUid
            //         }
            //     })
            // }
            // fetch(process.env.VUE_APP_FETCH_URL_SEND_FRIENDSHIP_REQUEST, options).then(res => {
            //     if (res.ok) {
            //         self.$toasted.show("Hop ! Une petite demande d'amie envoyée.")
            //     } else {
            //         self.$toasted.error(
            //             "Erreur Serveur. Essayez de rafraichir Skotch ou fermer et relancer l'appli"
            //         )
            //     }
            //     self.isLoadingRequest = _without(self.isLoadingRequest, friendUid)
            // })
        },
        requestAlreadySent(id) {
            let f = _find(this.allFriends, {id: id})
            let ff = _find(this.allFriends, {friend_id: id})
            if (f !== undefined && f !== null) {
                if (f.request_from !== undefined && f.request_from !== null) return f.request_from.is_accepted === null
                else if (f.request_to !== undefined && f.request_to !== null) return f.request_to.is_accepted === null
                else return false
            } else if (ff !== undefined && ff !== null) {
				return ff.is_accepted === null
			} else {
                return false
            }
            // return _some(this.friends, { id: id, request: {is_accepted: null }})
        },
        isFriend(id) {
            let f = _find(this.allFriends, {id: id})
            if (f !== undefined && f !== null) {
                if (f.request_from !== undefined && f.request_from !== null) return f.request_from.is_accepted
                else return true
            } else {
                return false
            }
            // return _some(this.friends, { id: id, request: {is_accepted: true }})
        },
        hasSentRequest(id) {
            return _some(this.notifications, { user_id: id, type: 'request'})
            // return _some(this.user.notifications, { id: id, type: 'request' })
        },
        openNotificationDisplay() {
            this.toogleNotification(true)
        }
    }
}
</script>

<style scoped></style>
