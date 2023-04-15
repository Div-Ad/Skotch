<template src="src/components/loading/loading.pug" lang="pug" />
<style src="src/components/loading/loading.sass" lang="sass" />
<script>
export default {
    name: 'loading',
    props: ['color'],
    computed: {
        imgSrc() {
        	if (this.color === 'white') {
        		return 'img/spinner-lt.svg'
            } else if (this.color === 'black') {
				return 'img/spinner-dk.svg'
            } else {
                return 'img/spinner-dk.svg'
            }
        }
    }
}
</script>
