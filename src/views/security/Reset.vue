<template src="src/templates/security/reset.pug" />
<style src="src/css/security/security.sass" lang="sass" />

<script>
import { firebase } from 'boot/firebase'
import { getAuth } from 'firebase/auth'
import { required, email } from 'vuelidate/lib/validators'
import Password from 'vue-password-strength-meter'

export default {
	name: 'Reset',
	components: { Password },
	data() {
		return {
			reset: {
				email: null,
				password: null,
				repeatPassword: null
			},
			error: {
				code: null,
				message: ''
			},
			clickedOnSendEmail: false,
			emailSent: false
		}
	},
	validations: {
		reset: {
			email: {
				required,
				email
			}
		}
	},
	computed: {
		sendEmailErrorMessage() {
			if (this.error.message === 'USER_NOT_FOUND') {
				return "L'adresse email n'existe pas chez nous"
			} else if (this.error.code === 400) {
				return "Erreur du service d'authentification" + '(' + error.message + ')'
			} else {
				return "Erreur inconnue du service d'authentification"
			}
		}
	},
	methods: {
		sendEmail() {
			this.clickedOnSendEmail = true
			let self = this
			const auth = getAuth(firebase)
			if (!this.$v.reset.email.$invalid) {
				auth.sendPasswordResetEmail(this.reset.email)
					.then(() => {
						self.emailSent = true
						setTimeout(() => {
							self.$router.push('/signin')
						}, 5000)
					})
					.catch((error) => {
						this.error.code = error.code
						this.error.message = error.message
					})
			}
		}
	}
}
</script>
