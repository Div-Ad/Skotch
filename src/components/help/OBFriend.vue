<template lang="pug">
.onboarding#Friend
	.sep-triangle.rotate-180
	.ob-content
		.show-it(v-if="tip === 0")
			.illus-container.fl-st.mb16
				.illus.circular.rotate-infinite
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mb0.mt0 <b>Skoukou !</b>
					p.ml16 Je vous apprends l'essentiel sur l'onglet "Mes Copains".

		//.show-it(v-if="tip === 1")
			.illus-container.fl-st
				.illus.circular
					i.ic-friend
				.function Vos copains Skotch, <br>c'est ici !
			p.mt16 Dès qu'un copain a accepté votre demande ou que vous avez accepté la demande d'un copain, il s'affiche ici.
			p.ob-info Pour l'instant, Skotch ne gère pas la suppression de copain.

		.show-it(v-if="tip === 1")
			.illus-container.fl-st
				.illus.circular
					i.ic-friend-profile1
				.function Le <b>journal de bord <br>des copains</b>
			p.mt16 Cliquez sur cette icône pour retrouvez tous les skotchs que vous vous êtes échangés.
			//.ob-info.flexVC
				i.ic-tip-24.fs24.mr8
				p Note : En cliquant sur l'image de profil d'un copain, vous accédez à son journal !

		.show-it(v-if="tip === 2")
			.illus-container.fl-st
				.illus.circular
					i.ic-skotch-and-share-6
				.function <b>Skotcher mon copain / ma copine</b>
			p.mt16 Créez directement un skotch pour votre copain ou votre copine.
			.ob-info.flexVC
				i.ic-tip-24.fs24.mr8
				p Note : vous pourrez décider de conserver le skotch dans votre liste également.

		.show-it(v-if="tip === 3")
			.illus-container.fl-st
				.illus.circular.rotate-infinite
					i.ic-liked.rotate-infinite-reverse
				div
					p.function.mt0.mb0 C'est tout !
					p.ml16 À Bientôt.
			.ob-info
				p En cliquant sur "J'ai compris", cette aide disparaîtra pour toujours.
	.ob-footer
		button.go-back(@click="previousTip()", :class="{'no-go-back' : tip === 0 , 'ml0' : tip === 3}")
			i.ic-arrow
		.counter(v-if="tip < 3")
			.dot(:class="{'active' : tip === 0}")
			.dot(:class="{'active' : tip === 1}")
			.dot(:class="{'active' : tip === 2}")

		button.next(v-if="tip < 3", @click="nextTip()")
			i.ic-arrow

		button.final(v-if="tip === 3", @click="hideHelp()")
			span J'ai&nbsp;compris&nbsp;!
</template>


<script>
import {mapActions, mapGetters} from 'vuex'
import _cloneDeep from 'lodash/cloneDeep'

export default {
    name: 'OBFriend',
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
			updatedParams.help["ob3"] = true
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
