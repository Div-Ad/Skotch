import ga from '../helpers/analytics.js'

export default ({ router }) => {
	router.afterEach((to, from) => {
		ga.logPage(to.path, to.name)
	})
}