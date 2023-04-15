import Toasted from 'vue-toasted'

export default ({ Vue }) => {
	Vue.use(Toasted, {
		position: 'top-left',
		duration: '2500',
		className: 'skotch-toast',
		containerClass: 'skotch-toast-container'
	})
}
