import firebase from 'firebase/app'
import 'firebase/auth'

export default ({ app, router, Vue, store }) => {
    router.beforeEach((to, from, next) => {
        // Check to see if the route has the meta field "authRequired" set to true
        let authRequired = to.matched.some((route) => route.meta.requiresAuth)

        let isAuthenticated = async () => (await firebase.auth().currentUser) !== null

        if (authRequired) {
            if (isAuthenticated) {
                // User is already signed in. Continue on.
                if (store.getters.notificationDisplay) {
                    store.commit('toogleNotification', false)
                } else {
                    next()
                }
            } else {
                // Not signed in. Redirect to login page.
                next({
                    name: 'signin'
                })
            }
        } else {
            // Doesn't require authentication. Just continue on.
            next()
        }
    })
}
