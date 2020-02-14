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

                </ul>

                <div class="navBar">
                    <ul class="inline">
                        <li><router-link to="dashboard">Dashboard</router-link></li>
                        <li><router-link to="settings">Settings</router-link></li>
                        <li><a @click="logout">Logout</a></li>
                    </ul>
                </div>>

            </div>
        </section>
    </header>
</template>

<script>
    const fb = require('../firebaseConfig.js')

    export default {
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
