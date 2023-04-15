<template lang="pug">
    div
        span zut
</template>

<script>
export default {
	name: "ShareTarget",
    props: {
		title: {
			type: String
        },
        text: {
			type: String
        },
        url: {
			type: String
        }
    }
}
</script>

<style scoped>

</style>