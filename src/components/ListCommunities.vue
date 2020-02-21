<template>
    <div>
        <ul>
            <CommunityItem v-for="(community, i) in communities" v-bind:community="community" v-bind:index="i" v-on:remove-community="removeCommunity"/>
        </ul>
    </div>
</template>

<script>
    import CommunityItem from "@/components/CommunityItem"
    export default {
        props: ['communities'],
        components: {
            CommunityItem
        },
        methods: {
            removeCommunity(id) {
                console.log(id);
                this.$emit('remove-community', id)
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
