<template>
    <header>
        <section>
            <div class="col1">
<!--                <router-link to="dashboard"><h3>HomingHaven</h3></router-link>-->
                <ul class="top">
                    <li class="title">
                        <router-link to="dashboard"><h3>HomingHaven</h3></router-link>
                    </li>
                    <li class="search">
                        <input type="search" placeholder="Search">
<!--                <i class="searchbar-icon"></i>-->
<!--                <span class="input-clear-button"></span>-->
                    </li>
                    <li>
                        <ul class="topButton">
                            <li>

                                <select v-model="selectedView" id="country" >
                                    <option v-for="view in views" v-bind:value="view">
                                        {{ view }}
                                    </option>
                                </select>
                            </li>
                            <li><a href="userinfo">{{ userProfile.name }}</a></li>
<!--                            <h5 style="float: right; margin-top: 60px;">{{ userProfile.name }}</h5>-->
<!--                            button-->
                        </ul>
                        <ul class="bottomButtons">
                            <li><button @click=""  class="button">New Community</button></li>
                            <li><button @click=""  class="button">New Resource</button></li>
                        </ul>
                    </li>

                </ul>

                <div class="navBar">
                    <ul class="inline">
                        <li><router-link to="dashboard">Dashboard</router-link></li>
                        <li><router-link to="userinfo">Settings</router-link></li>
<!--                        <li><router-link to="">Documentation</router-link></li>-->
<!--                        <li><router-link to="">Healthcare</router-link></li>-->
<!--                        <li><router-link to="">Lifestyle</router-link></li>-->
<!--                        <li><router-link to="">Wait Time</router-link></li>-->
                        <li><a @click="logout">Logout</a></li>
                    </ul>
                </div>

            </div>
        </section>
    </header>
</template>

<script>
    const fb = require('../firebaseConfig.js')
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                views: ["Popular Communities"],
                 selectedView: "Popular Communities",
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        methods: {
            logout() {
                fb.auth.signOut().then(() => {
                    this.$store.dispatch('clearData')
                    this.$router.push('/login')
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>
