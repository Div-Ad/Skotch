<template lang="pug">
.onboarding#SkotchSkFilter
	.sep-triangle.rotate-180
	//.ob-header
		.ob-icon
			i.ic-spot-info-32
		h3 Ordonner ses skotchs

	.ob-content
		.show-it(v-if="tip === 0")
			.illus-container.fl-st
				.illus.circular
					i.ic-sort-b24
				div
					p.function.mb0.mt0
						span <b>Trier</b> et <b>filtrer </b>
					//p.ml16 Il est temps d'apprendre à Trier & Filtrer.
			.ob-info.reverse
				.flexVC
					p.mt0 Cliquez sur cette icône pour afficher le menu tris et filtres.
					i.ic-sort-b24.ml16.fs32

		.show-it(v-if="tip === 1")
			.illus-container.fl-st
				.illus.circular
					span A
					span Z
				.function Trier <b>de A à Z</b>
			//p.mt16 On ne vous fait pas un dessin pour cette option de tri.

		.show-it(v-if="tip === 2")
			.illus-container.fl-st
				.illus.circular
					i.ic-clock-b24
				.function Trier <b>du plus récent au plus ancien</b>
			p.ob-info Note : par défaut, vos skotchs sont triés des plus anciens aux plus récents.


		.show-it(v-if="tip === 3")
			.illus-container.fl-st
				.illus.circular
					i.ic-friend
				span.function N'afficher que les skotchs envoyés par vos <b>copains</b>.
			//p.mt16 Pratique pour ne visualiser que les skotchs envoyés par vos amis.
			//p.ob-info Note : ce filtre est cumulable avec le tri par date ou le tri par ordre alphabétique.

		.show-it(v-if="tip === 4")
			.illus-container.fl-st
				.illus.circular
					.skl-tag.m-zero tag
				span.function Filtrer par <b>tag</b> (catégorie)

			//p.mt16 Le filtre ultra pratique pour les listes avec plein de skotchs.
			//p.ob-info Note : les tris et filtres sont actifs à la fois dans les onglets "Skotchs" et "Skotchothèque".

		.show-it(v-if="tip === 5")
			.illus-container.fl-st
				.illus.circular.rotate-infinite
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mb0.mt0 On arrive au bout !
					p.ml16 Je n'ai presque plus rien à vous apprendre.
			.ob-info
				p En cliquant sur "J'ai tout compris", cette aide disparaîtra pour toujours.

	.ob-footer
		button.go-back(v-if="tip > 0", @click="previousTip()", :class="{'no-go-back' : tip === 0 , 'ml0' : tip === 5}" )
			i.ic-arrow

		button.final(v-if="tip === 0", @click="nextTip()") Ok, c'est activé.

		.counter(v-if="tip > 0 && tip < 5")

			.dot(:class="{'active' : tip === 1}")
			.dot(:class="{'active' : tip === 2}")
			.dot(:class="{'active' : tip === 3}")
			.dot(:class="{'active' : tip === 4}")

		button.next(v-if="tip > 0 && tip < 5", @click="nextTip()")
			i.ic-arrow

		button.final(v-if="tip === 5", @click="hideHelp()")
			span j'ai&nbsp;tout&nbsp;compris&nbsp;!
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'OBSkFilter',
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
			updatedParams.help["ob7"] = true
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
