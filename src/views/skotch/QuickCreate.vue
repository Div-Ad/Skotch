<template src="src/templates/skotch/quick-create.pug" lang="pug"/>
<style src="src/css/skotchlist/quick-create.sass" lang="sass"/>

<script>
import {mapGetters} from 'vuex'
import _find from 'lodash/find'
import _filter from 'lodash/filter'
import {minLength, maxLength, required} from 'vuelidate/lib/validators'
import _orderBy from 'lodash/orderBy'
import _without from 'lodash/without'
import _pick from 'lodash/pick'
import _map from 'lodash/map'
import _merge from 'lodash/merge'
import _some from 'lodash/some'
import ContactThumbnail from 'src/composition/ContactThumbnail'
import Loading from 'src/components/loading/Loading'
import isURL from 'src/helpers/isUrl'
import OBSkCreate from "components/help/OBSkCreate";
import OBSkShare from "components/help/OBSkShare";

export default {
    name: 'QuickCreate',
    props: {
        action: {
            type: String,
            default: null
        },
        skotchList: {
            type: Number,
            default: null
        },
        skotchToEdit: {
            type: Object,
            default: null
        },
        friend: {
            type: String,
            default: null
        },
        title: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        },
        text: {
            type: String,
            default: null
        },
        skTheque: {
            type: Boolean,
            default: false
        }
    },
    components: {ContactThumbnail, Loading, OBSkCreate, OBSkShare},
    data() {
        return {
            skotch: {
                name: '',
                link: '',
                description: '',
                pin: false,
                archived: false,
                rk: 9999,
                tag_id: null,
                skotch_list_id: null,
                is_hidden: false
            },
            from: {},
            skotchToMe: true,
            skotchToFriendTrigger: false,
            showSelectFriend: false,
            filterFriendInput: '',
            selectedFriend: [],
            triggeredToast: false,
            toastMessage: '',
            isSuggesting: false,
            skotchListSelected: null,
            isMutating: false,
            isOnFocus: false
        }
    },

    validations: {
        skotch: {
            name: {
                required,
                minLength: minLength(2),
                maxLength: maxLength(150)
            },
            link: {
                maxLength: maxLength(2000)
            },
            description: {
                maxLength: maxLength(5000)
            },
            skotch_list_id: {
                required
            }
        },
        skotchListSelected: {
            required
        }
    },
    created() {
        if (this.skotchToEdit !== null) this.skotch = {...this.skotchToEdit}
        if (this.friend !== null) this.selectedFriend.push(this.friend)
        if (this.skTheque === true) this.skotch.archived = true
        if (this.action === 'share') this.showSelectFriend = true
        if (this.skotchList !== null) this.skotch.skotch_list_id = this.skotchList
        if (this.title !== null) this.skotch.name = this.title
        if (this.url !== null) this.skotch.link = this.url
        if (this.text !== null) {
            if (isURL(this.text)) this.skotch.link = this.text
            else this.skotch.description = this.text
        }
    },
    beforeRouteEnter(to, from, next) {
        next((vm) => {
            vm.from = from
            if (from.name === 'friends' || from.name === 'friend') vm.showSelectFriend = false
        })
    },
    mounted() {
        if (this.isShare === false && this.isEdit === false) this.focusInput()
    },
    computed: {
        ...mapGetters([
            'userInfo',
            'skotchLists',
            'skotchListsCatalog',
            'suggestions',
            'friends',
            'getFriend',
            'userActiveSkotchList',
            'friendCount'
        ]),
        getSkotchListSelected() {
            if (this.skotch.skotch_list_id !== null && this.skotch.skotch_list_id !== undefined) {
                return _find(this.userActiveSkotchList, {id: this.skotch.skotch_list_id})
            } else {
                return null
            }
        },
        isFormValid() {
            if (!this.showSelectFriend) {
                if (this.action === 'edit') {
                    return (
                        !this.$v.skotch.name.$invalid &&
                        !this.$v.skotch.skotch_list_id.$invalid &&
                        (this.skotch.name !== this.skotchToEdit.name ||
                            this.skotch.tag_id !== this.skotchToEdit.tag_id ||
                            this.skotch.description !== this.skotchToEdit.description ||
                            this.skotch.link !== this.skotchToEdit.link)
                    )
                } else {
                    return !this.$v.skotch.name.$invalid && !this.$v.skotch.skotch_list_id.$invalid
                }
            } else {
                return (
                    !this.$v.skotch.name.$invalid &&
                    !this.$v.skotch.skotch_list_id.$invalid &&
                    this.selectedFriend.length > 0
                )
            }
        },
        isSuggestionValid() {
            return (
                !this.$v.skotch.name.$invalid &&
                !this.$v.skotch.skotch_list_id.$invalid &&
                this.selectedFriend.length > 0
            )
        },
        filteredFriends() {
            let self = this
            let okFriends = _filter(this.friends, (f) => {
                if (!_some(this.suggestions, {skotch_id: this.skotch.id, user_id: f.id})) return f
            })
            if (this.filterFriendInput.length > 0) {
                return _filter(okFriends, (f) => {
                    if (
                        f.firstname.toLowerCase().includes(self.filterFriendInput.trim().toLowerCase()) ||
                        f.lastname.toLowerCase().includes(self.filterFriendInput.trim().toLowerCase())
                    ) {
                        return f
                    }
                })
            } else {
                return okFriends
            }
        },
        isSkotchToFriend() {
            return (
                (this.from.name === 'friends' && this.friend !== null) ||
                this.from.name === 'friend'
            )
        },
        isEdit() {
            return this.action === 'edit'
        },
        isShare() {
            return this.action === 'share'
        },
        suggested() {
            return _without(
                _map(this.suggestions, (s) => {
                    if (s.skotch_id === this.skotch.id) {
                        return s.friend_id
                    }
                }),
                undefined
            )
        },
        showOBSkCreate() {
            return !this.userInfo.params.help.ob0 &&
                !this.userInfo.params.help.ob4 &&
                !this.isEdit &&
                !this.isSkotchToFriend &&
                this.userInfo.accept_friend_request &&
                this.friendCount > 0 &&
                !this.isOnFocus
        }
    },
    methods: {
        toggleArchivedState() {
            this.skotch.archived =! this.skotch.archived
        },
        getSkotchListTitle(id) {
            if (this.skotchListsCatalog.length > 0 && id !== undefined && id !== null) {
                let skotchList = _find(this.skotchListsCatalog, {id: id})
                return skotchList['title'][this.$i18n.locale]
            } else {
                return ''
            }
        },
        getSkotchListTags(id) {
            if (this.skotchListsCatalog.length > 0 && id !== undefined) {
                let skotchList = _find(this.skotchListsCatalog, {id: id})
                return _orderBy(skotchList['tags'], ['rk'], ['asc'])
            } else {
                return ''
            }
        },
        selectTag(tagId) {
            if (this.skotch.tag_id === tagId) this.skotch.tag_id = null
            else this.skotch.tag_id = tagId
        },
        submitForm(again) {
            if (this.isFormValid && !this.isMutating) {
                this.isMutating = true
                if (this.action !== 'edit') {
                    this.createSkotch(again)
                } else {
                    this.editSkotch()
                }
            }
        },
        createSkotch(again) {
            this.$apollo
                .mutate({
                    mutation: require('../../gql/insert/insertUserSkotch.graphql'),
                    variables: {
                        newSkotch: this.skotch
                    }
                })
                .then((data) => {
                    this.$store.commit('addSkotch', data.data.insert_skotch_one)
                    if (again) {
                        this.triggerToast(
                            '"' +
                            this.skotch.name +
                            '" skotché avec succès ! Vous pouvez créer un nouveau skotch sereinement. '
                        )
                        this.skotch = {
                            name: '',
                            link: '',
                            description: '',
                            pin: false,
                            archived: false,
                            rk: 9999,
                            tag_id: null,
                            skotch_list_id: this.skotchList,
                            is_hidden: false
                        }
                        if (this.from.name !== 'skotchlist') this.skotch.skotch_list_id = null
                    } else {
                        this.goBack('to-me')

                    }
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    this.selectedSkotch = null
                    this.isMutating = false
                })
        },
        editSkotch() {
            this.$apollo
                .mutate({
                    mutation: require('../../gql/mutate/mutateUserSkotch.graphql'),
                    variables: {
                        id: this.skotch.id,
                        changes: _pick(this.skotch, ['description', 'link', 'name', 'tag_id'])
                    }
                })
                .then((data) => {
                    this.$store.commit('updateSkotch', data.data.update_skotch.returning[0])
                    this.goBack('to-me')
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    this.selectedSkotch = null
                    this.isMutating = false
                })
        },
        selectFriend() {
            if (this.isFormValid) {
                this.showSelectFriend = true
            }
        },
        toogleFriend(uid) {
            if (!this.suggested.includes(uid)) {
                if (this.selectedFriend.includes(uid)) {
                    this.selectedFriend = _without(this.selectedFriend, uid)
                } else {
                    this.selectedFriend.push(uid)
                }
            }
        },
        validateSuggestion() {
            if (this.isSuggestionValid && !this.isMutating) {
                this.isMutating = true
                if (this.action === 'share') {
                    if (this.skotch.hasOwnProperty('id')) this.suggestToFriends()
                    else this.createdAndSuggestToFriends()
                } else if (this.action === null) {
                    this.createdAndSuggestToFriends()
                } else {
                    this.isMutating = false
                }
            }
        },
        createdAndSuggestToFriends() {
            let suggestions = {suggestions: {data: []}}
            suggestions.suggestions.data = _map(this.selectedFriend, (sf) => {
                return {
                    friend_id: sf
                }
            })
            let skotchAndSuggestions = _merge(this.skotch, suggestions)
            skotchAndSuggestions.is_hidden = !this.skotchToMe
            this.$apollo
                .mutate({
                    mutation: require('../../gql/insert/insertUserSkotchAndSuggestion.graphql'),
                    variables: {
                        newSkotch: skotchAndSuggestions
                    }
                })
                .then((data) => {
                    this.$store.commit('addSuggestedSkotch', data.data.insert_skotch_one)
                    this.goBack('to-me')
                })
                .catch((error) => {
                    console.log(error)
                }).finally(() => {
                this.isMutating = false
            })
        },
        suggestToFriends() {
            let suggestions = _map(this.selectedFriend, (sf) => {
                return {
                    skotch_id: this.skotch.id,
                    friend_id: sf
                }
            })
            this.$apollo
                .mutate({
                    mutation: require('../../gql/insert/insertUserSuggestion.graphql'),
                    variables: {
                        newSuggestions: suggestions
                    }
                })
                .then((data) => {
                    this.$store.commit('addSuggestions', data.data.insert_suggestion)
                    this.goBack('to-me')
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(() => {
                    this.selectedSkotch = null
                    this.isMutating = false
                })
        },
        goBack(context) {
            if (context !== 'exit') {
                let msg = ''
                if (context === 'to-me') msg = "C'est Skotché !"
                else if (context === 'to-friends') msg = 'Skotch envoyé !'
                else msg = "C'est bon !"
                this.$toasted.show(msg)
            }
            if (this.from.name === 'friend') {
                this.$router.push({name: 'friend', params: {id: this.from.params.id}})
            } else if (this.from.name === 'friends') {
                this.$router.push({name: 'friends'})
            } else {
                this.$router.go(-1)
            }

            // if (this.context) this.$router.push(this.route)
            // else this.$router.go(-1)
        },
        triggerToast(msg) {
            this.toastMessage = msg
            this.triggeredToast = true
            setTimeout(() => {
                this.triggeredToast = false
                this.toastMessage = ''
            }, 2000)
        },
        imgError(id) {
            if (document.getElementById(id) !== null)
                document.getElementById(id).classList.add('dnd')
        },
        focusInput() {
            this.$refs.skotchName.focus()
        },
        unfocusInput() {
            this.$refs.outfocusButton.focus()
        }
    }
}
</script>
