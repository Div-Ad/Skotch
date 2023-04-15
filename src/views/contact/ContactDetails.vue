<template src="src/templates/contact/contact-details.pug" lang="pug" />
<style src="src/css/contact/contact-details.sass" lang="sass" />

<script>
import Nav from 'components/nav/Nav'
import Feedback from 'components/feedback/Feedback'
import { mapGetters } from 'vuex'
import _filter from 'lodash/filter'
import _orderBy from 'lodash/orderBy'
import _find from 'lodash/find'
import _reject from 'lodash/reject'
import _some from 'lodash/some'
import _map from 'lodash/map'
import { date } from 'quasar'
import ContactThumbnail from 'src/composition/ContactThumbnail'
import Autolinker from 'autolinker'

export default {
	name: 'ContactDetails',
	components: {
		Nav,
		Feedback,
		ContactThumbnail
	},
	data() {
		return {
			skotchOutTab: true,
			contactInfo: false,
			id: this.$route.params.id,
			selectedSkotch: null,
			feedbackDisplay: false,
			skotchFeedbackObject: null,
			from: {},
			animate: false
		}
	},
	beforeRouteEnter(to, from, next) {
		if (to.params.hasOwnProperty('id')) {
			next((vm) => {
				vm.from = from
			})
		} else {
			next({path:'/friends'})
		}
	},
	computed: {
		...mapGetters([
			'suggestions',
			'allSkotchs',
			'getSkotchListInfo',
			'feedbacks',
			'getSkotchListTag',
			'getAllTags'
		]),

		friend() {
			return this.$store.getters.getFriend(this.id)
		},
		skotchsOut() {
			let ss = this.suggestions
			return _orderBy(
				_map(
					_filter(_reject(ss, { is_accepted: false }), {
						friend_id: this.id
					}),
					(s) => {
						if (s.skotch_suggested === null) {
							let skotch = _find(this.allSkotchs, { id: s.skotch_id })
							return { ...s, skotch_suggested: skotch }
						} else {
							return s
						}
					}
				),
				['updated'],
				['desc']
			)
		},
		skotchsIn() {
			return _orderBy(
				_filter(_reject(this.suggestions, { skotch_suggested: null }), {
					user_id: this.id
				}),
				['updated'],
				['desc']
			)
		}
	},
	methods: {
		getUpdatedFormat(f) {
			let ts = null
			if (f.hasOwnProperty('request_from') && f.request_from !== null)
				ts = f.request_from.updated
			else if (f.hasOwnProperty('request_to') && f.request_to !== null)
				ts = f.request_to.updated
			return date.formatDate(ts, 'DD/MM/YYYY HH:mm')
		},
		getTimestamp(skotch) {
			if (skotch.updated !== null)
				return 'le ' + date.formatDate(skotch.created, 'DD/MM/YYYY HH:mm')
			else return ''
		},
		goToQuickCreate() {
			this.$router.push({ name: 'quick-create', params: { friend: this.uid } })
		},
		swipeHandler(direction) {
			if (direction === 'right') {
			    this.skotchOutTab = true
          this.animate = true
      }
			else if (direction === 'left') {
			    this.skotchOutTab = false
          this.animate = true
      }
		},
		toogleSkotch(timestamp) {
			if (this.selectedSkotch === timestamp) this.selectedSkotch = null
			else this.selectedSkotch = timestamp
		},
		toogleFeedback(skotch) {
			if (this.feedbackDisplay) this.skotchFeedbackObject = null
			else this.skotchFeedbackObject = skotch

			this.feedbackDisplay = !this.feedbackDisplay
		},
		getSuggestionFeedback(skotch) {
			let feedback = _find(this.feedbacks, {
				type: 'skotchback',
				by: skotch.friend,
				timestamp: skotch.timestamp
			})
			return feedback === undefined ? null : feedback.feedback
		},
		hasFeedback(id) {
			return _some(this.feedbacks, { suggestion_id: id })
		},
		suggestionsFeedback(id) {
			return _find(this.feedbacks, { suggestion_id: id })
		},
		getTagTranslation(tag_id) {
			let tagFound = _find(this.getAllTags, { id: tag_id })
			if (tagFound !== undefined) {
				return tagFound.title['fr']
			} else {
				return ''
			}
		},
		getAutolinktext(rawString) {
			let formatedString = Autolinker.link(rawString, {
				sanitizeHtml: true,
				truncate: { length: 42, location: 'smart' }
			})
			return formatedString
		}
	}
}
</script>
