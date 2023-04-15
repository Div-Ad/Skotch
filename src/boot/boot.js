import firebase from 'firebase/app'
import { getAuth } from 'firebase/auth'

export default ({ app, router, Vue, store }) => {
	const auth = getAuth(firebase)
	// Register the Firebase authentication listener
	auth.onAuthStateChanged((user) => {
		if (user) {
			signingIn(user)
		} else {
			signingOut()
		}
	})

	auth.onIdTokenChanged(function (user) {
		if (user) {
			user.getIdTokenResult(false).then((result) => {
				if (store.getters.token !== result.token) store.commit('setToken', result.token)
			})
		}
	})

	function signingIn(user) {
		store.commit('setLoginData', user.toJSON())
		// Signed in. Let Vuex know.
		user.getIdToken()
			.then(function (idToken) {
				store.commit('setToken', idToken)
			})
			.then(() => {
				// router.replace({ name: 'loading' }).catch(() => {})
				new Vue(app)
			})
	}

	function signingOut() {
		store.commit('setToken', null)
		router.replace({ name: 'signin' }).catch(() => {})
		new Vue(app) /* eslint-disable-line no-new */
	}
}
