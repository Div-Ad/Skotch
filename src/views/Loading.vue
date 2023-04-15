<template lang="pug">
	#firstSteps
		section.spinner.big#loading
			.icon.spin-it
				img.big(src="~assets/img/spinner-lt.svg")
</template>

<script>

export default {
	name: 'Loading',
	data() {
		return {
			from: null
        }
	},
	beforeRouteEnter(to, from, next) {
		next((vm) => {
			vm.from = from
		})
	},
	created() {
		if (this.$store.getters.token !== null) {
			this.$store.dispatch('fetchUserInfo').then((user) => {
				if (user.first_step) {
					if (this.from !== null && this.from.name === 'share-target') {
						this.$router.push({name: 'quick-create', params: this.from.query})
					} else {
						this.$router.push('/dashboard')
					}
				} else {
					this.$router.push('/first-steps')
				}
			}).catch((err) => {
				this.$router.push('/first-steps')
			}).finally(() => {
				this.$store.commit('toogleSkipSubscription', false)
				this.$store.dispatch('fetchFeedbacks')
				this.$store.dispatch('fetchFriends')
				this.$store.dispatch('fetchSkotchLists')
				this.$store.dispatch('fetchSkotchs')
				this.$store.dispatch('fetchSuggestions')
				this.$store.dispatch('skotchListsCatalog')
			})
            // }
		}
	}
}
</script>

<style scoped></style>