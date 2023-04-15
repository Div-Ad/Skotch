<template src="../../templates/settings/config.pug" lang="pug" />
<style src="src/css/config/config.sass" lang="sass" />

<script>
import Nav from 'components/nav/Nav'
import ContactThumbnail from "src/composition/ContactThumbnail"
import Croppie from 'src/components/croppie/croppie.vue'
import {mapActions, mapGetters} from 'vuex'
import { maxLength } from 'vuelidate/lib/validators'
import _omit from 'lodash/omit'
import notificationApi from '../../composition/setupPushNotification'
import {Platform} from "quasar";

export default {
    name: 'Config',
    components: {
        Nav, ContactThumbnail, Croppie
    },
    data() {
        return {
            config: {
                accept_friend_request: true,
                email: '',
                firstname: '',
                lastname: '',
                photobase64: '',
                photourl: '',
                params: {}
            },
            nameEdit: false,
			showCroppie: false,
			renderThumbnail: true
        }
    },
    setup: notificationApi,
    validations: {
        userInfo: {
            firstname: {
                maxLength: maxLength(20)
            },
            lastname: {
                maxLength: maxLength(20)
            }
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'userConfig', 'token', 'loginData', 'notificationPermission']),
		getUserPhoto() {
			if (this.config.photobase64 !== undefined && this.config.photobase64 !== null &&this.config.photobase64.length > 0) {
				return this.config.photobase64
			} else if (this.config.photourl !== undefined && this.config.photobase64 !== null && this.config.photourl.length > 0) {
				return this.config.photourl
			} else {
				return ''
			}
		}
    },
    created() {
        this.config = { ...this.userInfo}
    },
    methods: {
        ...mapActions(['updateParamsHelp']),
        toogleTheme() {
          let updatedParams = this.userInfo.params
          updatedParams.help["ob5"]  =! updatedParams.help["ob5"]
          this.$store.dispatch('updateParamsHelp', updatedParams)
        },
        toogleFriendsRequest() {
            this.config.accept_friend_request = !this.config.accept_friend_request
            this.updateUserInfo()
        },
        updateUserInfo() {
            this.$apollo
                .mutate({
                    mutation: require('../../gql/mutate/mutateUserInfo.graphql'),
                    variables: {
                        id: this.config.id,
                        changes: _omit(this.config, ['id', '__typename'])
                    }
                })
                .then((data) => {
                    this.$store.commit('updateUser', data.data.update_user.returning[0])
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    this.nameEdit = false
                })
        },
        toogleNotification() {
            if (this.notificationPermission === 'default' || this.notificationPermission === null) {
                this.requestPermissions()
            }
        },
		toogleCroppie() {
			this.showCroppie = !this.showCroppie
		},
		updatePhoto(pb64) {
			this.config.photobase64 = pb64
		}
    }
}
</script>
