<template lang="pug">
.onboarding#SkotchSwipe
	.sep-triangle.rotate-180
	.ob-content(v-if="tip === 0")
		.illus-container.fl-st.mb16
			.illus.circular.rotate-infinite
				i.ic-liked.rotate-infinite-reverse
			div
				p.function.mb0.mt0 <b>Me revoilà !</b>
				p.ml16 Ne râlez pas, je vais vous apprendre à naviguer comme un pro.

	.ob-content(v-if="tip === 1")
		.illus-container.fl-st.show-it
			.illus.circular.big
				.swipe-animation
			.function.small Sur Skotch, s'il y a des onglets en haut, c'est que vous pouvez swiper&nbsp;!
		p.ob-info Swipez <b>n'importe où dans la zone des listes</b> pour aller de l'onglet "Mes Listes" à l'onglet "Mes copains" puis inversement.


	.ob-content(v-if="tip === 2")
		.illus-container.fl-st.menu-order.ml16.show-it
			.illus.circular
				.icon-menu
					.bar
					.bar
					.bar
			.function Ouvrir le Menu<br> <b>Testez le swipe !</b>

		.explanation.ml32
			p.mt16 Vous voyez les 2 zones clignotantes ?
			p.mt8 Placez votre doigt quelque part dessus et swipez vers la droite. Moi, je suis plus à l'aise avec mon pouce sur le rectangle du bas, mais chacun son style.

		.swipe-handler.menu-sh
		.swipe-handler.menu-sh-2

	.illus-container.try-swipe.show-it(v-if="tip === 2")
		.illus.circular.big
			.swipe-left-animation
		.function Et Swipez n'importe où pour fermer !

	.ob-content(v-if="tip === 3")
		.illus-container.fl-st.notif-order.show-it
			.illus.circular
				i.ic-notification-bell
			.function Ouvrir les Notifications<br> <b>Testez le swipe !</b>

		.explanation
			p.mt16 Et ici, c'est l'inverse.<br>Swipez de l'extrémité droite de l'écran vers la gauche&nbsp;!

		.swipe-handler.notif-sh.

	.illus-container.try-swipe-notif.show-it(v-if="tip === 3")
		.illus.circular.big.shadow
			.swipe-right-animation-w
		.function Et swipez n'importe où pour fermer

	.ob-content(v-if="tip === 4")
		.illus-container.fl-st
			.illus.circular.rotate-infinite
				i.ic-liked.rotate-infinite-reverse
			div
				p.function.mt0.mb0 Pas mal hein ?
				p.ml16 Allez, à la prochaine.
		.ob-info
			p En cliquant sur "J'ai tout compris", cette aide disparaîtra pour toujours (c'est triste, mais c'est comme ça).

	.ob-footer
		button.go-back(@click="previousTip()", :class="{'no-go-back' : tip === 0 , 'ml0' : tip === 4}")
			i.ic-arrow

		.counter(v-if="tip < 4")
			.dot(:class="{'active' : tip === 0}")
			.dot(:class="{'active' : tip === 1}")
			.dot(:class="{'active' : tip === 2}")
			.dot(:class="{'active' : tip === 3}")

		button.next(v-if="tip < 4", @click="nextTip()")
			i.ic-arrow

		button.final(v-if="tip === 4", @click="hideHelp()")
			span J'ai&nbsp;tout&nbsp;compris&nbsp;!
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'OBSwipe',
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
			updatedParams.help["ob8"] = true
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
