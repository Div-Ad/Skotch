<template src="./feedback.pug" lang="pug" />
<script>
import Feedback from '../../helpers/feedback-enum'

export default {
	name: 'Feedback',
	props: ['skotch'],
	data() {
		return {
			Feedback: Feedback
		}
	},
	methods: {
		close() {
			this.$parent.toogleFeedback(null)
		},
		sendFeedback(feedback) {
			if (
				feedback !== '' &&
				this.skotch !== null &&
				(this.skotch.hasOwnProperty('suggestion_id') ||
					this.skotch.hasOwnProperty('id'))
			) {
				let suggestion_id = this.$route.name === 'friend'
					? this.skotch.id
					: this.skotch.suggestion_id
				this.$apollo
					.mutate({
						mutation: require('../../gql/insert/upsertUserFeedback.graphql'),
						variables: {
							userFeedback: {
								suggestion_id: 	suggestion_id,
								feedback: feedback
							}
						}
					})
					.then((data) => {
						this.$store.commit('addFeedback', data.data.insert_feedback.returning[0])
					})
					.catch((error) => {
						console.log(error)
					})
					.finally(() => {
						this.close()
					})
			}
		},
		getContactName(s) {
			if (s !== null) {
				if (s.hasOwnProperty('user_id')) {
					return this.$store.getters.getFriend(s.user_id).firstname
				} else {
					return ''
				}
			} else {
				return ''
			}
		},
		getSkotchName(s) {
			if (s !== null && s.hasOwnProperty('name')) {
				return s.name
			} else if (s !== null && s.hasOwnProperty('skotch_suggested')) {
				return s.skotch_suggested.name
			} else {
				return ''
			}
		}
	}
}
</script>
