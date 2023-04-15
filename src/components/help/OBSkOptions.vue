<template lang="pug">
.onboarding#SkotchOptions
	//.icon.trigger-help(@click="hasBeenTriggered =! hasBeenTriggered" :class="{'is-active' : hasBeenTriggered }")
	//    .icon-container
	//        i.ic-skotchinours
	//.test(v-if="hasBeenTriggered")
	.sep-triangle.rotate-180

	//.ob-header(v-if="tip === 0")
		.ob-icon
			i.ic-spot-info-32
		h3 Options des skotchs

	.ob-content

		.show-it(v-if="tip === 0")
			.illus-container.fl-st
				.illus.circular
					i.ic-options-b24
				div
					p.function.mt0.mb0 <b>Options</b><br> des skotchs

			.ob-info.flexVC.reverse
				p <b>cliquez sur cette icône</b> pour faire apparaitre les options et détails d'un skotch.
				i.ic-options-b24.fs24.ml8

		.show-it(v-if="tip === 1")
			.illus-container.fl-st
				.illus.circular
					i.ic-bin-2
				span.function <b>Supprimer</b> un skotch
			p.ob-info Note : Une confirmation vous sera demandée à chaque fois.

		.show-it(v-if="tip === 2")
			.illus-container.fl-st
				.illus.circular
					i.ic-pen
				span.function <b>Modifier</b> un skotch
			//p.mt16 Vous relancez alors le formulaire de saisie d'un skotch et pouvez modifier son nom, son tag (catégorie) et sa description.
			p.ob-info Note : Si vous avez partagé un skotch à un copain, toutes les modifications seront également visibles pour lui.

		.show-it(v-if="tip === 3")
			.illus-container.fl-st
				.illus.circular
					i.ic-star-24
				span.function <b>Mettre</b> en favoris
			//p.mt16 Une étoile apparait alors à côté du nom de votre skotch.
			p.ob-info Note : La liste <b>Favoris</b> s'ajoute alors à vos listes. Elle contient tous vos skotchs favoris. Lorsque la liste est vide, elle disparaît à nouveau.

		.show-it(v-if="tip === 4")
			.illus-container.fl-st
				.illus.circular
					i.ic-sktheque-add-24
				span.function Ranger dans <b>Ma Collection</b>

			p.mt16 Utilisez cette fonction pour archiver certains skotchs dans votre collection.
			p.ob-info Note : votre skotch passe de l'onglet <b>Skotchs</b> à l'onglet <b>Ma Collection</b>.


		.show-it(v-if="tip === 5")
			.illus-container.fl-st
				.illus.circular
					i.ic-search
				p.function Ça, c'est la recherche <b>magique</b> !

			p.mt16 Lancez une recherche à partir de votre skotch. Le premier clic ouvre deux options : à vous de choisir !
			p.ob-info Note : Les options varient selon le thème de la liste. On vous laisse découvrir tout ça ! :)

		.show-it(v-if="tip === 6")
			.illus-container.fl-st
				.illus.circular
					i.ic-skotch-and-share-6
				p.function <b>Envoyer le skotch</b> à des copains

			p.mt16 Choisissez les copains à qui vous souhaitez envoyer ce skotch, puis validez ! C'est skotché !
			p.ob-info Note : cette fonctionnalité s'active si vous avez au moins un copain sur Skotch.

		.show-it(v-if="tip === 7")
			.illus-container.fl-st
				.illus.circular.rotate-infinite
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mt0.mb0 C'est fini !
					p.ml16 Je reviendrai quand vous aurez 3 skotchs dans votre liste !
			.ob-info
				p En cliquant sur "J'ai tout compris", cette aide disparaîtra pour toujours.

	.ob-footer
		button.go-back(v-if="tip > 0", @click="previousTip()")
			i.ic-arrow
		button.final(v-if="tip === 0", @click="nextTip()") C'est bon, j'ai cliqué.

		.counter(v-if="tip > 0 && tip < 7")

			.dot(:class="{'active' : tip === 1}")
			.dot(:class="{'active' : tip === 2}")
			.dot(:class="{'active' : tip === 3}")
			.dot(:class="{'active' : tip === 4}")
			.dot(:class="{'active' : tip === 5}")
			.dot(:class="{'active' : tip === 6}")

		button.next(v-if="tip > 0 && tip < 7", @click="nextTip()")
			i.ic-arrow

		button.final(v-if="tip === 7", @click="hideHelp()")
			span Ok,&nbsp;j'ai&nbsp;tout&nbsp;compris&nbsp;!
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'OBSkOptions',
    data() {
        return {
            tip: 0,
            hasBeenTriggered: false
        }
    },
    computed: {
        ...mapGetters(['userInfo']),
    },
    methods: {
        ...mapActions(['updateParamsHelp']),
        hideHelp() {
			let updatedParams = _cloneDeep(this.userInfo.params)
            updatedParams.help['ob2'] = true
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
