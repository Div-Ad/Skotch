<template lang="pug">
.onboarding#SkotchCreate
	.sep-triangle.rotate-180
	.mask-overlay.show-it(@click="helpIsRead =! helpIsRead" :class="{'active' : helpIsRead}")
		p(v-if="helpIsRead") Terminez la lecture de l'aide s'il vous plait.
	.ob-content
		.show-it(v-if="tip === 0")
			.illus-container.fl-st.mb8
				.illus.circular.rotate-infinite.small
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mb0.mt0 <b>Parfait !</b><br> On a un skotch tout prêt.
					p.ml16.mt8 Laissez-moi vous détailler rapidement les options.
		.show-it(v-if="tip === 1")
			//p Vous le savez déjà, mais pour rappel :
			.ob-info.m-zero
				.flexVC
					.icon.share.mr8
						i.ic-close-24.fs24
					p.m-zero Annuler et quitter.

			.ob-info
				.flexVC
					.icon.share.mr8
						i.ic-skotch-and-share-6.fs24
					div
						p Sélectionner des copains à qui envoyer le skotch en cours de saisie.
			.ob-info
				.flexVC
					.icon.validate.mr8
						i.ic-check-24.fs24
					p.m-zero Enregistrer et quitter.
			//p.mt8 En cliquant, vous accéderez à un nouveau volet, mais  en conservant toutes les informations saisies.

		//.show-it(v-if="tip === 2")
			.ob-info.m-zero
				.flexVC
					.icon.share.mr16.ml8
						i.ic-skotch-and-share-6.fs24
					div
						p Et enfin, cette icône, c'est pour sélectionner des copains à qui envoyer le skotch en cours de saisie.
			p.mt8 En cliquant, vous accéderez à un nouveau volet, mais vous pourrez revenir en arrière à tout moment en conservant toutes les informations saisies.
			//p.mt8 Fonction très pratique lorsque plusieurs amis vous disent en même temps "tu me le skotchs ?"

		.show-it(v-if="tip === 2")
			.illus-container.fl-st
				.illus.circular.rotate-infinite.small
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mt0.mb0 C'est tout !
			.ob-info
				p Cliquez sur "J'ai compris", pour faire disparaîtra cette aide pour toujours.
			//.ob-info.reverse
				.flexVC.fl-en
					p.mr16 En cliquant, vous accéderez à un nouveau volet, mais vous pourrez revenir en arrière à tout moment en conservant toutes les informations saisies.
					i.ic-skotch-and-share-6.fs24

	.ob-footer
		button.go-back(@click="previousTip()", :class="{'no-go-back' : tip === 0 , 'ml0' : tip === 2}" )
			i.ic-arrow

		.counter(v-if="tip < 2")

			.dot(:class="{'active' : tip === 0}")
			.dot(:class="{'active' : tip === 1}")

		button.next(v-if="tip < 2", @click="nextTip()")
			i.ic-arrow

		button.final(v-if="tip === 2", @click="hideHelp()")
			span j'ai&nbsp;compris&nbsp;!
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'OBSkCreate',
    data() {
        return {
            tip: 0,
            helpIsRead: false
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
    },
    methods: {
        ...mapActions(['updateParamsHelp']),
		hideHelp() {
			let updatedParams = _cloneDeep(this.userInfo.params)
			updatedParams.help["ob4"] = true
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
