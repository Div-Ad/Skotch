<template src="src/templates/contact/contact.pug" lang="pug" />

<script>
import { mapGetters } from 'vuex'
import ContactThumbnail from "src/composition/ContactThumbnail"
import OBFriend from "components/help/OBFriend";
import Nav from "components/nav/Nav";
import OBSwipe from "components/help/OBSwipe";

export default {
	name: 'Contact',
	components: { ContactThumbnail, OBFriend, Nav, OBSwipe },
	data() {
		return {
		  from: {}
    }
	},
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.from = from
      if (from.name === 'friends' || from.name === 'friend') vm.showSelectFriend = false
    })
  },
	computed: {
		...mapGetters(['friends', 'friendCount', 'userInfo'])
	},
	methods: {
		swipeHandler(direction) {
			if (direction === 'right') {
				this.$router.push('/dashboard')
			}
		},
		imgError(id) {
			document.getElementById(id).classList.add("dnd")
		}
	}
}
</script>

<style scoped></style>
