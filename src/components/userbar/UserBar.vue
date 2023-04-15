<template src="./userbar.pug" lang="pug"/>
<style src="./userbar.sass" lang="sass"/>
<script>
import QuickCreate from '../../views/skotch/QuickCreate'
import Notification from '../notification/Notification'
import {mapActions, mapGetters, mapMutations} from 'vuex'
import * as localforage from 'localforage'
import {apolloClient} from "boot/apollo"
import OBSwipe from "components/help/OBSwipe";
import OBUserInterface from "components/help/OBUserInterface";
import OBBuddy from "components/help/OBBuddy";
import Help from "components/help/Help";
import OBActivateHelp from "components/help/OBActivateHelp";
import firebase from 'firebase/app'
import { getAuth } from "firebase/auth"

export default {
    name: 'UserBar',
    components: {
        QuickCreate,
        Notification,
        OBSwipe,
        OBUserInterface,
        OBBuddy,
        OBActivateHelp,
        Help
    },
    data() {
        return {
            menuDisplay: false,
            helpDisplay: false,
            descriptionDisplay: null,
            //- 1. modifier les deux numéros de version pour qu'ils matchent (css unité, dev dizaine)
            //- 2. Déployer
            //- 3. Modifier dans la base de donnée
            actualVersion: 102,
            recentVersion: 102
        }
    },
    apollo: {
        $subscribe: {
            feedbackNotifications: {
                query: require('../../gql/subscription/feedback_notifications.graphql'),
                variables() {
                    return {
                        id: this.userId
                    }
                },
                result(data) {
                    this.$store.commit('setNotifications', ['feedback', data.data.feedback])
                }
            },
            requestNotifications: {
                query: require('../../gql/subscription/request_notifications.graphql'),
                result(data) {
                    this.$store.commit('setNotifications', ['request', data.data.request])
                }
            },
            requestStatusNotifications: {
                query: require('../../gql/subscription/request_status_notifications.graphql'),
                result(data) {
                    this.$store.commit('setNotifications', ['requested', data.data.request_accepted])
                }
            },
            suggestionNotifications: {
                query: require('../../gql/subscription/suggestion_notifications.graphql'),
                variables() {
                    return {
                        id: this.userId
                    }
                },
                result(data) {
                    this.$store.commit('setNotifications', ['suggestion', data.data.suggestion])
                }
            },
            hintNotifications: {
                query: require('../../gql/subscription/hint_notifications.graphql'),
                variables() {
                    return {
                        id: this.userId
                    }
                },
                result(data) {
                    this.$store.commit('setNotifications', ['hint', data.data.suggestion])
                }
            }
        }
    },
    watch: {
        $route(to, from) {
            this.menuDisplay = false
        }
    },
    computed: {
        ...mapGetters(['unreadCount', 'userInfo', 'notificationDisplay', 'loginData', 'userConfig']),
        isVersionOutdated() {
            return this.recentVersion > this.actualVersion
        },
        actualVersionText() {
            return (
                this.actualVersion.toString().slice(0, 1) +
                '.' +
                this.actualVersion.toString().slice(1)
            )
        },
        recentVersionText() {
            return (
                this.recentVersion.toString().slice(0, 1) +
                '.' +
                this.recentVersion.toString().slice(1)
            )
        },
        userId() {
            if (this.loginData !== null && this.loginData.hasOwnProperty('uid')) {
                return this.loginData.uid
            } else {
                return ''
            }
        }
    },
    created() {
        let resData = null
        if (this.$route.name === 'dashboard') {
            apolloClient.query({
                query: require('../../gql/select/skotchVersion.graphql')
            }).then((data) => {
                resData = data.data
                if (resData !== undefined && resData.hasOwnProperty('skotch_version')) this.recentVersion = resData.skotch_version[0].number
            })
        }
    },
    methods: {
        ...mapMutations(['toogleNotification']),
        ...mapActions(['updateParamsHelp']),
        logout() {
			const auth = getAuth(firebase)
			auth.signOut().then(() => {
				this.$store.commit('SET_USER', {})
				this.$store.commit('reset')
			})
        },
        goToQuickCreate() {
            if (this.$route.name === 'skotch-list') {
                this.$router.push({name: 'quick-create', params: {skotchList: this.$parent.id}})
            } else {
                this.$router.push({name: 'quick-create', params: {skotchList: null}})
            }
        },
        clickOnMenuIcon() {
            this.menuDisplay = !this.menuDisplay
            this.toogleNotification(false)
            this.descriptionDisplay = false
        },
        clickOnNotificationIcon() {
            this.toogleNotification(!this.notificationDisplay)
            this.menuDisplay = false
        },
        routerPush(route) {
            if (this.$route.name === route) {
                this.menuDisplay = false
                this.toogleNotification(false)
            } else {
                this.$router.push({name: route})
            }
        },
        swipeHandler(direction) {
            if (direction === 'left') {
                this.clickOnMenuIcon()
            } else if (direction === 'right') {
                this.clickOnMenuIcon()
            }
        },
        notificationSwipeHandler(direction) {
            if (direction === 'right') {
                this.clickOnNotificationIcon()
            } else if (direction === 'left') {
                this.clickOnNotificationIcon()
            }
        },
        // quickcreateSwipeHandler(direction) {
        //     if (direction === 'bottom') {
        //         this.goToQuickCreate()
        //     } else if (direction === 'top') {
        //         this.goToQuickCreate()
        //     }
        // },

        reload() {
            window.location.reload()
        }
    }
}
</script>
