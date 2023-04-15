<template src="src/templates/skotch/skotch-list-catalog.pug" lang="pug"/>
<style src="src/css/skotchlist/skotch-list-catalog.sass" lang="sass"/>

<script>
import {mapGetters} from 'vuex'
import _orderBy from 'lodash/orderBy'
import _without from 'lodash/without'
import Loading from 'components/loading/Loading'
import Nav from 'components/nav/Nav'

export default {
  name: 'SkotchListCatalog',
  components: { Loading, Nav },
  data() {
    return {
      helpDisplay: false,
      isLoading: []
    }
  },
  computed: {
    ...mapGetters(['orderedSkotchListCatalog', 'isSkotchListActive'])
  },
  methods: {
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
      orderTags(tags)
      {
        return _orderBy(tags, ['rk'], ['asc'])
      }
    }
  }
</script>
