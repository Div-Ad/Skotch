<template src="src/templates/settings/first-steps.pug" lang="pug" />
<style src="src/css/config/config.sass" lang="sass" />

<script>
import { mapActions, mapGetters } from 'vuex'
import _orderBy from 'lodash/orderBy'
import { maxLength } from 'vuelidate/lib/validators'
import _without from "lodash/without"
import _forEach from "lodash/forEach"
import Loading from 'components/loading/Loading'

export default {
    name: 'firststeps',
    components: { Loading },
    data() {
        return {
            config: {
                id: null,
                firstname: '',
                lastname: '',
                accept_friend_request: true,
				is_male: null,
				nickname: null
            },
            step: 1,
            isUserLoaded: false,
            displayWarning: false,
            displayListIssue: false,
            isLoading: []
        }
    },
    validations: {
        config: {
            firstname: {
                maxLength: maxLength(20)
            },
            lastname: {
                maxLength: maxLength(20)
            }
        }
    },
    created() {
    	this.config.id = this.$store.getters.loginData.uid
        this.createUser()
	},
    computed: {
        ...mapGetters(['userConfig', 'orderedSkotchListCatalog', 'isSkotchListActive', 'userActiveSkotchList'])
    },
    methods: {
        focusLastnameInput() {
            this.$refs.lastName.focus()
        },
        focusNextButton() {
            this.$refs.next.focus()
        },
        createUser() {
            this.$apollo
                .mutate({
                    mutation: require('../../gql/insert/insertUser.graphql'),
                    variables: {
                        newUser: {
                            id: this.config.id
                        }
                    }
                })
                .then((data) => {})
                .catch((error) => {
                    console.log(error)
                })
        },
        updateUsernames() {
            this.updateUserInfo({
                firstname: this.config.firstname.trim(),
                lastname: this.config.lastname.trim(),
				is_male: this.config.is_male
            })
        },
        toogleFriendsRequest() {
            this.config.accept_friend_request = !this.config.accept_friend_request
            this.updateUserInfo({
                accept_friend_request: this.config.accept_friend_request
            })
        },
        updateUserInfo(changes) {
            this.$apollo
                .mutate({
                    mutation: require('../../gql/mutate/mutateUserInfo.graphql'),
                    variables: {
                        id: this.config.id,
                        changes: changes
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
		toogleAllSkotchList() {
			let usl = []
			_forEach(this.orderedSkotchListCatalog, (sl) => {
				usl.push({
					skotch_list_id: sl.id,
					active: true
				})
			})
			console.log(usl)
			this.$apollo.mutate({
				mutation: require('../../gql/insert/upsertUserSkotchList.graphql'),
				variables: {
					userSkotchList: usl
				}
			}).then((data) => {
				_forEach(data.data.insert_user_skotch_list.returning, (r) => {
					this.$store.commit('updateSkotchLists', r)
				})
			}).catch((error) => {
				console.log(error)
			})
		},
        toogleSkotchList(skotchListId) {
            if (!this.isLoading.includes(skotchListId)) {
                this.isLoading.push(skotchListId)
                this.$apollo.mutate({
                    mutation: require('../../gql/insert/upsertUserSkotchList.graphql'),
                    variables: {
                        userSkotchList: [{
                            skotch_list_id: skotchListId,
                            active: !this.isSkotchListActive(skotchListId)
                        }]
                    }
                }).then((data) => {
                    this.$store.commit('updateSkotchLists', data.data.insert_user_skotch_list.returning[0])
                }).catch((error) => {
                    console.log(error)
                }).finally(() => {
                    this.isLoading = _without(this.isLoading, skotchListId)
                })
            }
        },
        orderTags(tags) {
            return _orderBy(tags, ['rk'], ['asc'])
        },
        terminateFirstStep() {
            this.updateUserInfo({ first_step: true })
			this.toogleAllSkotchList()
            this.$router.push({ name: 'dashboard' })
        }
    }
}
</script>
