<template src="./help.pug" lang="pug"/>
<script>
import {mapActions, mapGetters} from "vuex";

export default {
  name: 'Help',
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  methods: {
  }
}
</script>
