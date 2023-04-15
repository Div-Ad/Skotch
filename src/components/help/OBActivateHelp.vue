<template lang="pug">
.onboarding.centered#ActivateHelp
	.ob-content
		.function.big Bienvenue <br>sur Skotch!
		.point-help
			i.ic-arrow-24
		p.mt16 Activez ou désactivez les Aides à la découverte de Skotch en cliquant sur cette icône.
		p.mt8
			i.ic-skotchinours.fs32

	.ob-footer
		button.final(@click="hideHelp()")
			span J'ai&nbsp;compris&nbsp;!
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'OBActivateHelp',
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
        hideHelp() {
            let updatedParams = _cloneDeep(this.userInfo.params)
            updatedParams.help["ob9"] = true
            this.$store.dispatch('updateParamsHelp', updatedParams)
        },
        nextTip () {
            this.tip += 1
        },
        previousTip () {
            if(this.tip > 0){
                this.tip -= 1
            }
        }
    }
}
</script>
