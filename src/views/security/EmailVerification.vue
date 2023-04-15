<template src="src/templates/security/email-verification.pug" />
<style src="src/css/security/security.sass" lang="sass" />

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import localforage from "localforage"

export default {
	name: 'EmailVerification',
    created() {
	    this.sendVerification()
    },
	methods: {
		sendVerification() {
			let actionCodeSettings = {
				url: 'https://' + window.location.hostname,
				handleCodeInApp: true
			}
			firebase
				.auth()
				.currentUser.sendEmailVerification(actionCodeSettings)
				.then(() => {
					console.log('sent')
				})
				.catch((error) => {
					console.log(error)
                })
		},
		logout() {
			this.$store.dispatch('signOut')
			this.$store.commit('reset')
			localforage.clear().then()
		}
	}
}
</script>
