<template lang="pug">
    .ct-avatar(@click.stop="goToContactPage()" :id="contactId + objectId")
        img(v-if="hasPhotobase64" :src="contact.photobase64")
        img(v-else-if="hasPhotourl && !contact.photourl.startsWith('https://graph.facebook.com/') && !contact.photourl.endsWith('photo.jpg')" :src="contact.photourl")
        .background(v-else)
            .firstname-letter {{ contact.firstname.slice(0,1) }}
            .lastname-letter {{ contact.lastname.slice(0,1)}}
</template>

<script>
export default {
    name: "ContactThumbnail",
    props: {
        objectId: {
            type: String,
            required: false
        },
        contactId: {
            type: String,
            required: false
        },
        contact: {
            photobase64: {
                type: String,
                default: null,
                required: true
            },
            photourl: {
                type: String,
                default: null,
                required: true
            },
            firstname: {
                type: String,
                required: true
            },
            lastname: {
                type: String,
                required: true
            },
        },
        mainClass: {
            type: Array
        }
    },
    computed: {
        hasPhotourl() {
            if (this.contact.photourl !== undefined && this.contact.photourl !== null) {
                if (this.contact.photourl.length > 0) return true
                else return false
            } else {
                return false
            }
        },
        hasPhotobase64() {
            if (this.contact.photobase64 !== undefined && this.contact.photobase64 !== null) {
                if (this.contact.photobase64.length > 0) return true
                else return false
            } else {
                return false
            }
        },
        // mClass() {
        // 	let mClass = {}
        // 	this.mainClass.forEach((c) => {
        // 		mClass[c] = true
        // 	})
        //     return mClass
        // }
    },
    methods: {
        goToContactPage() {
            if (this.$route.name === 'friends' || this.$route.name === 'skotch-list') {
                this.$router.push({name: 'friend', params: {id: this.contact.id}})
            }
        }
    }
}
</script>

<style scoped>

</style>