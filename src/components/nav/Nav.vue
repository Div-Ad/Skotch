<template src="./nav.pug" lang="pug" />
<style src="./nav.sass" lang="sass" />
<script>
import QuickCreate from '../../views/skotch/QuickCreate'

export default {
	name: 'Nav',
	components: {
		QuickCreate
	},
	data() {
		return {}
	},

	methods: {
		goToQuickCreate() {
			if (this.$route.name === 'skotch-list') {
				this.$router.push({
					name: 'quick-create',
					params: { skotchList: this.$parent.skotchList.id, skTheque: this.$parent.sktheque }
				})
			} else if (this.$route.name === 'friend') {
				this.$router.push({ name: 'quick-create', params: { friend: this.$parent.id } })
			} else {
				this.$router.push({ name: 'quick-create', params: { skotchList: null } })
			}
		},
		goToFriends() {
			if (this.$route.name !== 'friends') {
				this.$router.push({ name: 'friends' })
			} else {
			}
		},
		goToLists() {
			if (this.$route.name !== 'dashboard') {
				this.$router.push({ name: 'dashboard' })
			} else {
			}
		}
	}
}
</script>
