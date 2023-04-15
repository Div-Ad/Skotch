import { Platform } from 'quasar'
import store from 'src/store'
import { FirebaseMessaging } from '@capacitor-firebase/messaging'

export default function notificationApi() {
	// const notificationsPermissions = ref(false)
	async function initPushNotification(self: any) {
		if (!isMac()) {
			if (store.getters.notificationPermission === 'granted') {
				await getMessagingToken()
				if (Platform.is.capacitor) {
					initNotificationListener()
				}
			}
		}
	}

	function initNotificationListener() {
		FirebaseMessaging.removeAllListeners().then(() => {
			FirebaseMessaging.addListener('tokenReceived', (event) => {
				console.log(`tokenReceived`, { event })
			})
			FirebaseMessaging.addListener('notificationReceived', (event) => {
				console.log(`notificationReceived`, { event })
			})
			FirebaseMessaging.addListener('notificationActionPerformed', (event) => {
				console.log(`notificationActionPerformed`, { event })
			})
		})
	}

	async function getMessagingToken() {
		await FirebaseMessaging.getToken({
			vapidKey: process.env.VAPID_KEY
		})
			.then((token) => {
				store.dispatch('setMessagingToken', token.token)
			})
			.catch((err) => {
				console.log('getMessagingToken', err)
			})
	}

	async function requestPermissions() {
		if (!Platform.is.capacitor) {
			if (!('Notification' in window)) {
				console.log('This browser does not support desktop notification')
			}
			// Otherwise, we need to ask the user for permission
			else if (Notification.permission === 'default') {
				Notification.requestPermission().then((permission) => {
					// If the user accepts, let's create a notification
					if (permission === 'granted') {
						window.location.reload()
					}
				})
			}
		} else {
			await FirebaseMessaging.requestPermissions()
		}
	}

	async function checkPermissionsStatus() {
		if (!Platform.is.capacitor) {
			store.commit('setNotificationsPermissionsStatus', Notification.permission)
		} else {
			await FirebaseMessaging.checkPermissions().then((result) => {
				store.commit('setNotificationsPermissionsStatus', result.receive)
			})
		}
	}

	function isMac() {
		return Platform.is.mac || Platform.is.safari
	}

	return {
		checkPermissionsStatus,
		requestPermissions,
		initPushNotification,
		isMac
	}
}
