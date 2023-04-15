<template lang="pug">
.onboarding#SkotchSkOrder
	.sep-triangle.rotate-180

	.ob-content
		.show-it(v-if="tip === 0")
			.illus-container.fl-st
				.illus.circular.rotate-infinite
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mb0.mt0
						span.more-mention <b>Classez</b>&nbsp;
						span <br>vos skotchs
			p.ml16.mt8 Il est temps de vous montrer comment ordonner vos skotchs librement.

		.show-it(v-if="tip === 1")
			.illus-container.fl-st
				.illus.circular.small.mr16
					i.ic-drag
				div
					.function.m-zero Le <b>Drag and Drop</b>

			p.mt16 Maintenez votre doigt sur un skotch puis sans relâcher, déplacez-le à la position désirée.
			//.ob-info
				p Note : .

		.show-it(v-if="tip === 2")
			p L'ordre de vos skotchs après utilisation du Drag and Drop est alors gardé en mémoire.

		.show-it(v-if="tip === 3")
			.illus-container.fl-st
				.illus.circular.rotate-infinite
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mb0.mt0 Ça vous plaît ?
					p.ml16.mt4 On se revoit pour fêter <br>vos 10 skotchs.
			.ob-info
				p En cliquant sur "J'ai tout compris", cette aide disparaîtra pour toujours.

	.ob-footer
		button.go-back(@click="previousTip()", :class="{'no-go-back' : tip === 0 , 'ml0' : tip === 3}" )
			i.ic-arrow

		.counter(v-if="tip < 3")

			.dot(:class="{'active' : tip === 1}")
			.dot(:class="{'active' : tip === 2}")

		button.next(v-if="tip < 3", @click="nextTip()")
			i.ic-arrow

		button.final(v-if="tip === 3", @click="hideHelp()")
			span j'ai&nbsp;tout&nbsp;compris&nbsp;!
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'OBSkOrder',
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
			updatedParams.help["ob6"] = true
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
