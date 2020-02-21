<template>
    <li>
       <span v-bind:class="{done: interest.completed}">
           <p v-on:change="interest.completed = !interest.completed">
           {{interest.title}}
           </p>
       </span>
        <el-button type="danger" icon="el-icon-delete" class="btn-remove"  v-on:click="$emit('remove-interest', interest.id)"></el-button>
    </li>
</template>

<script>
    export default {
        props:{
            interest: {
                type: Object,
                required: true
            },
            index: Number
        }
    }
</script>

<style scoped>
    li {
        transition: transform 1s;
        display:inline-flex;
        /*margin:0px -3rem 18px;*/
        /*margin: inherit;*/
        margin: 4px;
        padding:0.2rem 0.2rem;
        align-items:center;
        color: #838383;
        background-color: #FFFFFF;
        -webkit-box-shadow: 0px 11px 33px -9px rgba(0,0,0,0.75);
        -moz-box-shadow: 0px 11px 33px -9px rgba(0,0,0,0.75);
        box-shadow: 0px 11px 33px -9px rgba(0,0,0,0.75);
        border-radius: 10px;
    }
    .done{
        opacity: .6;
        text-decoration: line-through;
    }
    input{
        margin-right:1.5em;
    }
    .btn-remove {
        background-color: #FF4B50;
    }
    input{
        margin-right: 5px;
    }
    .btn-remove{
        margin-left: 5px;
    }
</style>
