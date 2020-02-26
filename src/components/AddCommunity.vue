<template>
    <form @submit.prevent="onSubmit">
        <input type="text" v-model="title">
        <button type="submit">Add community</button>
    </form>
</template>

<script>
    export default {
        data() {
            return {
                title: ""
            }
        },
        methods: {
            onSubmit() {
                if (this.title.trim()) {
                    const newInterest = {
                        id: Date.now(),
                        title: this.title,
                        completed: false
                    };
                    this.$emit('add-interest', newInterest);
                    this.title=""
                }
            }
        }
    }
</script>

<style scoped>
    form {
        margin-top:3rem;
        display:flex;
        flex-wrap:wrap;
    }
    form input {
        /*width: 40%;*/
        flex-grow:1;
        border:none;
        background:#f7f1f1;
        padding:0 1.5em;
        font-size:initial;
        padding: 5px 0px 20px 0px;
        line-height: 10px;
    }
    form button {
        padding:0 1.3rem;
        border:none;
        background:#007EFC;
        border-radius: 5px;
        color:white;
        text-transform:uppercase;
        font-weight:bold;
        border:1px solid rgba(255,255,255,.3);
        margin-left:5px;
        cursor:pointer;
        transition:background .2s ease-out;
    }
</style>
