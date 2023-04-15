<template lang="pug">
  #q-app(:class="{'is-mobile': $q.platform.is.mobile , 'dark' : userInfo.params.help.ob5}")
    user-bar(v-if="!noUserBar.includes($route.name)")
    router-view
</template>

<style src="./css/main.sass" lang="sass" />

<script>
import { mapGetters, mapActions } from 'vuex'
import UserBar from './components/userbar/UserBar'

import 'firebase/auth'
import { wsClient } from 'boot/apollo'
import notificationApi from 'src/composition/setupPushNotification'
import { firebase } from 'boot/firebase'
import { getMessaging } from 'firebase/messaging'
import { getAuth } from 'firebase/auth'

export default {
	name: 'skotch',
	components: {
		UserBar
	},
	data() {
		return {
			noUserBar: [
				'tos',
				'privacy',
				'signin',
				'reset',
				'loading',
				'first-steps',
				'hello',
				'email-verification'
			],
			refreshToken: null
		}
	},
	computed: {
		...mapGetters(['messagingToken', 'token', 'userInfo'])
	},
	created() {
		let self = this
		this.refreshToken = setInterval(() => {
			if (this.$route.name !== 'signin' && this.$route.name !== 'hello') {
				if (Date.now() > this.$store.state.authTokenExpirationTime - 1000 * 60 * 10) {
					console.log('set interval token expired')
					const auth = getAuth(firebase)
					let currentUser = auth.currentUser
					if (currentUser) {
						self.$store.commit('setLoginData', currentUser.toJSON())
						currentUser
							.getIdToken(true)
							.then((idToken) => {
								self.$store.commit('setToken', idToken)
							})
							.catch(function (error) {})
						wsClient.close(true, true)
						wsClient.connect()
						Object.keys(wsClient.operations).forEach((id) => {
							wsClient.sendMessage(
								id,
								MessageTypes.GQL_START,
								wsClient.operations[id].options
							)
						})
					} else {
						return ''
					}
				}
			}
		}, 300000)
	},
	methods: {
		...mapActions(['createUserCollection'])
	},
	beforeDestroy() {
		clearInterval(this.refreshToken)
	}
}
</script>
