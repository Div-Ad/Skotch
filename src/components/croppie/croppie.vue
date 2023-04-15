<template lang="pug">
#croppie
  label.custom-input(for="file-upload") Choisir une image
  //todo chargement image
  input(id="file-upload", type="file", ref="file", @change="uploadImage")
  vue-croppie( ref="croppieRef" :enableOrientation="false" :enableResize="false" :viewport="{ width:128, height:128, 'type':'circle' }")
  button.croppie-save(@click="crop()") Enregistrer
</template>

<script>
export default {
	name: "croppie",
	props: {
		userAvatar: {
			type: String,
			default: null
		}
	},
	data() {
		return {
			uploadedImage: null,
			cropped: null
		}
	},
	mounted() {
		if (!!this.userAvatar) {
			this.setCurrentPhoto()
		}
	},
	methods: {
		setCurrentPhoto() {
			this.$refs.croppieRef.bind({
				url: this.userAvatar
			})
		},
		uploadImage(event) {
			let files = event.target.files || event.dataTransfer.files;
			if (!files.length) return;

			let reader = new FileReader();
			reader.onload = event => {
				this.uploadedImage = event.target.result
				this.$refs.croppieRef.bind({
					url: event.target.result
				});
			}
			reader.readAsDataURL(files[0])
		},
		crop() {
			let options = {
				type: 'base64',
				size: { width: 128, height: 128 },
				format: 'jpg',
				circle: false
			}
			this.$refs.croppieRef.result(options, output => {
				this.$apollo
					.mutate({
						mutation: require('../../gql/mutate/mutateUserInfo.graphql'),
						variables: {
							id: this.$store.getters.userInfo.id,
							changes: {
								photobase64: output
							}
						}
					})
					.then((data) => {
						this.$store.commit('updateUserPhotoBase64', output)
					})
					.catch((error) => {
						console.log(error)
					})
					.finally(() => {
						this.$store.commit('updateUserPhotoBase64', output)
						this.$parent.updatePhoto(output)
						this.$parent.toogleCroppie()
					})
			})
		}
	}
}
</script>

<style scoped>

</style>