<template>
    <div id="userinfo">
        <section>
            <div class="col1">
                <div class="profile">
                    <img height="150px" width="150px" src="../assets/user_icon.png"/>
                    <h5 style="float: right; margin-top: 60px;">{{ userProfile.name }}</h5>
                    <form @submit.prevent>
                        <p style=" margin-top: 20px;">
                            Name:<input v-model.trim="name" type="text" :placeholder="userProfile.name" id="name" />
                        </p>
                        <p>
                            City:<input v-model.trim="city" type="text" :placeholder="userProfile.city" id="city">
                        </p>
                        <p>
                            State:<input v-model.trim="state" type="text" :placeholder="userProfile.state" id="state">
                        </p>
                        <p>
                            Country:<input v-model.trim="country" type="text" :placeholder="userProfile.country" id="country">
                        </p>
                        <button @click="updateProfile" class="button">Update Profile</button>

                        <transition name="fade">
                            <img v-if="showSuccess" class="success" style="margin-left: 10px;" height="30px" width="33px" src="../assets/green_check.png"/>
                        </transition>
                    </form>
                </div>
            </div>
            <div class="col2">
                <div class="user-form">
                    <h5 style=" margin-bottom: 20px;">Current Interests</h5>
                        <p>
                            <button class="button">Books</button>
                            <button class="button">Career</button>
                        </p>
                        <p>
                            <button class="button">Legal</button>
                            <button class="button" style="background: lightgrey;">+</button>
                        </p>
                        <p>
                            <button class="button">Food Assistance</button>
                            <button class="button" style="background-color: white; pointer-events: none;"></button>
                        </p>
                        <p>
                            <button class="button">Photography</button>
                            <button class="button" style="background-color: white; pointer-events: none;"></button>
                            </p>
                </div>
                <div class="user-form">
                    <h5 style=" margin-bottom: 20px;">Communities you have joined:</h5>
                    <p>
                        <button class="button">Bellevue</button>
                        <button class="button">Renton</button>
                        <button class="button">Seattle</button>
                    </p>
                    <p>
                        <button class="button">Tacoma</button>
                        <button class="button" style="background: lightgrey;">+</button>
                    </p>

                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import { mapState } from 'vuex'

    export default {
        data() {
            return {
                name: '',
                title: '',
                city: '',
                state: '',
                country: '',
                showSuccess: false
            }
        },
        computed: {
            ...mapState(['userProfile'])
        },
        methods: {
            updateProfile() {
                this.$store.dispatch('updateProfile', {
                    name: this.name !== '' ? this.name : this.userProfile.name,
                    title: this.title !== '' ? this.title : this.userProfile.title
                });

                this.name = '';
                this.title = '';

                this.showSuccess = true;

                setTimeout(() => { this.showSuccess = false }, 2000)
            }
        }
    }
</script>
