import gtm from '../helpers/analytics';

export default ({ router }) => {

	router.afterEach((to, from) => {
		gtm.logPage(to.path);
	})
}