<template lang="pug">
	.onboarding.centered-alt#SkotchUI(:class="{'lift-up' : tip === 1 , 'frame' : tip === 3 , 'point-top' : tip === 2}")
		//.sep-triangle.rotate-180
		.ob-content
			//.flexVC
				i.ic-sk-add-2.gold
				.function Cette icone, c'est pour créer un nouveau Skotch

			.illus-container.fl-st.mb8
				.illus.circular
					i.ic-sk-add-2.skotch-create-color
				div
					p.function.mb0.mt0 Cette icone, c'est pour créer un nouveau Skotch


			button.final.mt16(@click="hideHelp()")
				span Compris !

		//.nope-bar(v-if="tip === 2" @click="usertriedtoshutmedown =! usertriedtoshutmedown")
		//.ob-content(v-if="tip === 0")
			.illus-container.fl-st.show-it
				.illus.circular
					i.ic-liked
				.function Bienvenue Jeune Skotcheur !
			p.mt16 Quand j'apparais, c'est pour vous donner des trucs et astuces pour bien utiliser Skotch.
			p.mt8 Je vous prends quelques secondes et je disparais !
			.ob-info.flexVC
				i.ic-arrow.mr8.fs24
				p Cliquez sur les flèches en bas de cette aide pour afficher le conseil suivant ou le précédent .

		//.ob-content(v-if="tip === 1")
			.function.m-zero Ci-dessous, <br>la <b>barre de raccourcis</b>.
			.ob-info
				.flexVC
					i.ic-tdl-24-2.fs24
					p.ml8 Accés rapide à vos listes.
			.ob-info
				.flexVC.reverse.fl-en
					p.mr8 Accés rapide à vos copains.
					i.ic-friend.fs24
			.ob-info
				.center.mt16
					i.ic-sk-create-f-24.fs32.gold
					p.ml8.mt8 Et cette icône, c'est pour créer un nouveau Skotch !

		//.ob-content(v-if="tip === 2")

			.function.m-zero Ci-dessus, <br>la <b>barre menu, aide</b> et <b>notif</b>.
			.ob-info
				.flexVC
					.icon-menu.small-menu.mr12
						.bar
						.bar
						.bar
					p Ça, c'est pour ouvrir le menu et accéder entre autres aux <b>paramètres</b>, à la <b>sélection des listes</b> et à quelques autres éléments.
			.ob-info.reverse
				.flexVCB
					p.mr8 Ça, c'est pour ouvrir le panneau de notifications. Un petit numéro s'affiche dès que vous avez des notifications.
					i.ic-notification-bell.fs24.ml8.mr8


			.flexVC.mt8(v-if="!usertriedtoshutmedown")
				.icon-ob-buddy.scale-1-5
					.buddy-bg
						i.ic-help-buddy
					.overlay
						i.ic-liked-b24
				.function.ml16 Ça c'est moi, Skotchinours !

			.flexVC.mt8(v-if="usertriedtoshutmedown")
				.icon-ob-buddy.scale-1-5
					.buddy-bg
						i.ic-help-buddy
					.overlay.meow
						i.ic-meow-b24
				.function.ml8.show-it Bien tenté !
			p(v-if="!usertriedtoshutmedown") Si je suis activé, alors j'interviens au début de votre aventure pour vous aider à découvrir Skotch et vous aiguiller.
			p.show-it(v-if="usertriedtoshutmedown")  Il faudra me supporter le temps de cette aide au moins. Après, vous pourrez faire ce que vous voulez de moi.
			.ob-info(v-if="!usertriedtoshutmedown")
				.flexVC
					.icon-ob-buddy.scale-1.help-inactive.mr8
						.buddy-bg
							i.ic-help-buddy
						.overlay.on-help
							i.ic-meh-b24
					p Si vous souhaitez <b>désactiver</b> les aides, cliquez sur skotchinours dans la barre.
				p Vous pourrez les reactiver en cliqant dessus à nouveau.


		//.ob-content(v-if="tip === 3")
			.frame-list
			.function.m-zero Ça, ce sont vos listes.
			p.mt8 Quand vous cliquerez dessus, vous accéderez aux skotchs qu'elles contiennent.
			.ob-info
				.flexVC

					i.ic-display-thumbnail.fs24.mr8.ml8
					p.ml8 Au clic sur cette icône, vous affichez les listes sous forme de vignettes.
			.ob-info
				.flexVC
					i.ic-list-add.fs24.mr8.ml8
					p.ml8 Pour ajouter ou retirer des listes, passez par le menu, puis "Sélection des listes".

		//.ob-content(v-if="tip === 4")
			.show-it
				.illus-container.fl-st
					.illus.circular.rotate-infinite
						i.ic-liked.rotate-infinite-reverse
					div
						p.function.mb0.mt0 Voilà, c'est fini !
						p.ml16 À la Prochaine.
				.ob-info
					p En cliquant sur "J'ai tout compris", cette aide disparaîtra pour toujours.

		//.ob-footer
			button.go-back(@click="previousTip()", :class="{'no-go-back' : tip === 0 , 'ml0' : tip === 4}")
				i.ic-arrow

			.counter(v-if="tip < 4")
				.dot(:class="{'active' : tip === 0}")
				.dot(:class="{'active' : tip === 1}")
				.dot(:class="{'active' : tip === 2}")
				.dot(:class="{'active' : tip === 3}")

			button.next(v-if="tip < 4", @click="nextTip()", :class="{'pulsate' : tip === 0}")
				i.ic-arrow

			button.final(@click="hideHelp('ob1')")
				span Ok

		//.square(v-if="tip === 1")
</template>
<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'
export default {
    name: 'OBUserInterface',
    data() {
        return {
            tip: 0,
            usertriedtoshutmedown: false
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
    },
    methods: {
        ...mapActions(['updateParamsHelp']),
		hideHelp() {
			let updatedParams = _cloneDeep(this.userInfo.params)
			updatedParams.help["ob1"] = true
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
