<template src="../templates/dashboard.pug" lang="pug" />
<style src="../css/dashboard/dashboard.sass" lang="sass" />

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Nav from '../components/nav/Nav'
import _filter from 'lodash/filter'
import OBSwipe from 'components/help/OBSwipe'
import notificationApi from "src/composition/setupPushNotification";
import {getMessaging} from "firebase/messaging";
import {firebase} from "boot/firebase";

export default {
	name: 'dashboard',
	components: {
		Nav,
		OBSwipe
	},
	data() {
		return {
			from: {}
		}
	},
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.from = from
		})
	},
	created() {
		notificationApi().checkPermissionsStatus()
		notificationApi().initPushNotification()
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((registration) => {
					if (!this.$q.platform.is.capacitor) {
						const messaging = getMessaging(firebase)
						if (messaging != null) {
							messaging.useServiceWorker(registration)
						}
					}
				})
				.catch((err) => {
					console.log(err)
				})
		}
	},
	computed: {
		...mapGetters(['userActiveSkotchList', 'thumbnail', 'friendCount', 'skotchs', 'userInfo']),
		getPinCount() {
			return ('0' + _filter(this.skotchs, { pin: true }).length.toString()).slice(-2)
		}
	},
	methods: {
		...mapMutations(['toogleThumbnail']),

		hideHelp(ob) {
			let updatedParams = this.userInfo.params
			updatedParams.help[ob] = true
			this.$store.dispatch('updateParamsHelp', updatedParams)
		},
		getSkotchCount(skotchList) {
			return (
				'0' +
				_filter(this.skotchs, {
					skotch_list_id: skotchList,
					archived: false
				}).length.toString()
			).slice(-2)
		},
		swipeHandler(direction) {
			if (direction === 'left') {
				this.$router.push({ name: 'friends' })
			}
		}
	}
}
</script>
