<template>
    <header>
        <section>
            <div class="col1">
<!--                <router-link to="dashboard"><h3>HomingHaven</h3></router-link>-->
                <ul class="top">
                    <li class="title">
                        <router-link to="udashboard"><h3>HomingHaven</h3></router-link>
                    </li>
                    <li class="search">
                        <input type="search" placeholder="Search">
<!--                <i class="searchbar-icon"></i>-->
<!--                <span class="input-clear-button"></span>-->
                    </li>
                    <li class="button1">
                    <button @click="register"  class="button">Register</button>

                    </li>
                    <li class="button2">
                        <button @click="login"  class="button">Sign in</button>
                    </li>

                </ul>

<!--                <div class="navBar">-->
<!--                    <ul class="inline">-->
<!--                        <li><router-link to="dashboard">Dashboard</router-link></li>-->
<!--                        <li><router-link to="settings">Settings</router-link></li>-->

<!--                    </ul>-->
<!--                </div>-->

            </div>
        </section>
    </header>
</template>

<script>
    const fb = require('../firebaseConfig.js')

    export default {
        methods: {
            login() {
                this.$router.push('/login')
            },
            register() {
                this.$router.push('/registration')
            }
        }
    }
</script>
