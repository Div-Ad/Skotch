<template lang="pug">
.icon-ob-buddy(@click="toogleHelp()", :class="{'help-inactive' : userInfo.params.help.ob0 }")
	.buddy-bg
		i.ic-help-buddy
	.overlay
		i.ic-liked-b24(v-if="!userInfo.params.help.ob0")
		i.ic-meh-b24(v-if="userInfo.params.help.ob0")
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
    name: 'OBBuddy',
    data() {
        return {
            tip: 0,
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
    },
    methods: {
        ...mapActions(['updateParamsHelp']),
        toogleHelp() {
            let updatedParams = this.userInfo.params
            updatedParams.help["ob0"]  =! updatedParams.help["ob0"]
            this.$store.dispatch('updateParamsHelp', updatedParams)
        },
    }
}
</script>
