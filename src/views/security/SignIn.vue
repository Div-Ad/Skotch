<template src="src/templates/security/sign-in.pug" lang="pug" />
<style src="src/css/security/security.sass" lang="sass" />

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { required, minLength, email } from 'vuelidate/lib/validators'
import Password from 'vue-password-strength-meter'
import { FirebaseAuthentication } from '@capacitor-firebase/authentication'

export default {
	name: 'Signin',
	components: { Password },
	data() {
		return {
			inputOnFocus: false,
			loginDisplay: true,
			signIn: {
				email: null,
				password: null
			},
			signUp: {
				email: null,
				password: null,
				repeatPassword: null
			},
			error: {
				signIn: {
					code: '',
					message: ''
				},
				signUp: {
					code: '',
					message: ''
				}
			},
			clickedOnLogin: false,
			clickedOnRegister: false,
			hidePassword: false
		}
	},
	validations: {
		signIn: {
			email: {
				required,
				email
			},
			password: {
				required,
				minLength: minLength(8)
			}
		},
		signUp: {
			email: {
				required,
				email
			},
			password: {
				required,
				minLength: minLength(8)
			}
		}
	},
	computed: {
		isEnvProd() {
			return process.env.versionType === 'production'
		},
		skotchEnv() {
			return process.env.versionType
		},
		nextRoute() {
			return this.$route.query.redirect || '/'
		},
		isSignInValid() {
			return !this.$v.signIn.email.$invalid && !this.$v.signIn.password.$invalid
		},
		isSignUpValid() {
			return (
				!this.$v.signUp.email.$invalid &&
				!this.$v.signUp.password.$invalid &&
				this.signUp.password === this.signUp.repeatPassword
			)
		},
		signInErrorMessage() {
			if (this.error.signIn.code === 'auth/user-not-found') {
				return "L'adresse email n'existe pas chez nous"
			} else if (this.error.signIn.code === 'auth/wrong-password') {
				return 'Le mot de passe de correspond pas à cette adresse email'
			} else if (this.error.signIn.code.length > 0) {
				return "Erreur du service d'authentification" + '(' + error.signIn.message + ')'
			} else {
				return "Erreur inconnue du service d'authentification"
			}
		},
		signUpErrorMessage() {
			if (this.error.signUp.message === 'EMAIL_ALREADY_IN_USE') {
				return 'Cet email existe déjà dans notre base de données. Vous vous étiez peut-être déjà connecté avec Google, Facebook, Twitter ou Apple chez qui cette adresse email est utilisée.'
			} else if (this.error.signUp.code === 400) {
				return "Erreur du service d'authentification" + '(' + error.message + ')'
			} else {
				return "Erreur inconnue du service d'authentification"
			}
		},
		isRepeatPasswordSimilar() {
			if (
				this.signUp.password !== null &&
				this.signUp.repeatPassword !== null &&
				this.signUp.password.length >= 8 &&
				this.signUp.repeatPassword.length > 0
			) {
				if (this.signUp.password.startsWith(this.signUp.repeatPassword)) return 'valid'
				else return 'invalid'
			} else {
				return null
			}
		}
	},
	// created() {
	//     if (auth.currentUser) this.$router.push({ name: 'first-steps' })
	// },
	methods: {
		doLogin(provider) {
			if (this.$q.platform.is.capacitor) {
				this.capacitorSignin(provider)
			} else {
				this.firebaseLogin(provider)
			}
		},
		firebaseLogin(provider) {
			let authProvider = null
			let self = this
			switch (provider) {
				case 'email':
					this.clickedOnLogin = true
					if (this.isSignInValid) {
						new firebase.auth()
							.signInWithEmailAndPassword(this.signIn.email, this.signIn.password)
							.then((userCredential) => {
								// if (!userCredential.user.emailVerified) {
								// 	this.$router.push('/email-verification')
								// } else {
								// 	this.$router.push('/loading')
								// }
								this.$router.push('/loading')
							})
							.catch((error) => {
								this.error.signIn.code = error.code
								this.error.signIn.message = error.message
							})
					}
					break
				case 'google':
					authProvider = new firebase.auth.GoogleAuthProvider()
					break
				case 'facebook':
					authProvider = new firebase.auth.FacebookAuthProvider()
					break
				case 'apple':
					authProvider = new firebase.auth.OAuthProvider('apple.com')
					authProvider.addScope('email')
					authProvider.setCustomParameters({
						locale: this.$i18n.locale
					})
					break
				default:
					console.log('wrong provider')
			}
			if (authProvider !== null) {
				firebase
					.auth()
					.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
					.then(() => {
						return firebase
							.auth()
							.signInWithPopup(authProvider)
							.then((result) => {
								self.$router.push({ name: 'loading' })
							})
					})
					.catch((error) => {
						console.log(error.code)
						console.log(error.message)
					})
			}
		},
		async capacitorSignin(provider) {
			if (process.env.MODE === 'capacitor') {
				switch (provider) {
					case 'google':
						const result = await FirebaseAuthentication.signInWithGoogle()
						console.log(result.user)
						const credential = GoogleAuthProvider.credential(result.credential?.idToken)
						const auth = getAuth()
						await signInWithCredential(auth, credential)
						break
					case 'facebook':
						const facebook = await FirebaseAuthentication.signInWithFacebook()
						break
					case 'apple':
						const apple = await FirebaseAuthentication.signInWithApple()
						break
					default:
						console.log('wrong provider')
				}
			}
		},
		firebaseSignUp() {
			this.clickedOnRegister = true
			if (this.isSignUpValid) {
				auth.createUserWithEmailAndPassword(this.signUp.email, this.signUp.password)
					.then((userCredential) => {
						this.$router.push('/first-steps')
					})
					.catch((error) => {
						this.error.signUp.code = error.code
						this.error.signUp.message = error.message
					})
			}
		},
		focusPswdInput() {
			this.$refs.UserPassword.focus()
		},
		passwordDisplayToogle() {
			this.hidePassword = !this.hidePassword
		}
		// focusPswdCreate() {
		//   this.$refs.UserPasswordCreate.focus()
		// },
		//
		// focusPswdRepeat() {
		//   this.$refs.UserPasswordRepeat.focus()
		// },
	}
}
</script>
