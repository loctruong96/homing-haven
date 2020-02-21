<template>
    <div>
        <ul>
            <InterestItem v-for="(interest, i) in interests" v-bind:interest="interest" v-bind:index="i" v-on:remove-interest="removeInterest"/>
        </ul>
    </div>
</template>

<script>
    import InterestItem from "@/components/InterestItem"
    export default {
        props: ['interests'],
        components: {
            InterestItem
        },
        methods: {
            removeInterest(id) {
                this.$emit('remove-interest', id)
            }
        },
    }
</script>

<style scoped>
    ul {
        list-style: none;
        margin-top:2.6rem;
        padding: 0;
        margin: 0;
    }
</style>
