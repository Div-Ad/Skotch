<template lang="pug">
.onboarding#SkotchShare
	.sep-triangle.rotate-180
	.ob-content
		.show-it(v-if="tip === 0")
			.illus-container.fl-st.mb8
				.illus.circular.rotate-infinite.small
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mb0.mt0 <b>Envoyer un skotch</b>
					p.ml16.mt8 Laissez-moi vous détailler vos options en quelques secondes.

		.show-it(v-if="tip === 1")
			p.invalid-send Il vous suffit de cocher le ou les copains à qui vous souhaitez envoyer ce skotch.
			p.valid-send.show-it Parfait, vous avez le feu vert !

			.ob-info.flexVCB.invalid-send.show-it.reverse
				p.invalid-send.show-it Cocher un ami pour faire un essai s'il vous plaît.
				.contact-select.ml8

			.ob-info.flexVC.valid-send.show-it
				.icon.send.mr8
					i.ic-send.fs24.
				p.valid-send.show-it Dès que vous avez fini votre sélection de copains, vous pouvez cliquer pour envoyer votre skotch.

		.show-it(v-if="tip === 2")
			p En haut, l'option "Enregistrer dans ma liste également" est activée par défaut.
			p.mt8 Ainsi, vous skotchez vos copains et vous-même en même temps.
			.ob-info.flexVC
				.switch.mr8.active.animate-switch
					.sw-dot.animate-dot
				p Il suffit de cliquer sur l'interrupteur pour ne pas enregistrer ce skotch dans votre propre liste.

		.show-it(v-if="tip === 3")

			.ob-info.back-explanation.m-zero
				.flexVC
					.icon.share.mr8.rotate-180
						i.ic-arrow-24.fs24
					p.m-zero Et ça, c'est pour revenir au formulaire Skotch.
			p.mt16 Notez que les copains sélectionnés sont gardés en mémoire. Vous pouvez ainsi naviguer de la sélection des copains à votre formulaire skotch sans risque.

			.ob-info.quit-explanation
				.flexVC
					.icon.share.mr8
						i.ic-close-24.fs24
					p.m-zero Quitter cette fenêtre.

		.show-it(v-if="tip === 4")
			.illus-container.fl-st
				.illus.circular.rotate-infinite.small
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mt0.mb0 À vous de skotcher !
					p.ml16 À très bientôt !
			.ob-info
				p En cliquant sur "J'ai compris", cette aide disparaîtra pour toujours.

	.ob-footer
		button.go-back(@click="previousTip()", :class="{'no-go-back' : tip === 0 , 'ml0' : tip === 4}" )
			i.ic-arrow

		button.go-back.no-go(v-if="tip < 3")
			i.ic-arrow

		button.go-back.final(v-if="tip === 4", @click="previousTip()", :class="{'ml0' : tip === 4}" )
			i.ic-arrow

		.counter(v-if="tip < 4")

			.dot(:class="{'active' : tip === 0}")
			.dot(:class="{'active' : tip === 1}")
			.dot(:class="{'active' : tip === 2}")
			.dot(:class="{'active' : tip === 3}")

		button.next(v-if="tip < 4", @click="nextTip()")
			i.ic-arrow


		button.final(v-if="tip === 4", @click="hideHelp()")
			span j'ai&nbsp;compris&nbsp;!
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'OBSkShare',
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
			updatedParams.help["ob5"] = true
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
