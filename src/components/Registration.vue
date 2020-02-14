<template>
    <div id="registration">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
            <div class="col2" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
                <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
                    <h1>Get Started</h1>

                    <label for="name">Name</label>
                    <input v-model.trim="signupForm.name" type="text" placeholder="" id="name" />

                    <label for="title">Title</label>
                    <input v-model.trim="signupForm.title" type="text" placeholder="" id="title" />

                    <label for="email2">Email</label>
                    <input v-model.trim="signupForm.email" type="text" placeholder="" id="email2" />

                    <label for="password2">Password</label>
                    <input v-model.trim="signupForm.password" type="password" placeholder="" id="password2" />

                    <label for="confirmpassword">Confirm Password</label>
                    <input v-model.trim="signupForm.confirmpassword" type="password" placeholder="" id="confirmpassword" />

                    <label for="city">City</label>
                    <input v-model.trim="signupForm.city" type="text" placeholder="" id="city" />

                    <label for="state">State</label>
                    <input v-model.trim="signupForm.state" type="text" placeholder="" id="state" />

                    <label for="country">Country</label>
                    <input v-model.trim="signupForm.country" type="text" placeholder="" id="country" />

                    
                    <button @click="signup" class="button">Sign Up</button>
                    <div class="extras">
                        <a @click="toggleForm">Back to Log In</a>
                    </div>
                    
                </form>
                <transition name="fade">
                    <div v-if="errorMsg !== ''" class="error-msg">
                        <p>{{ errorMsg }}</p>
                    </div>
                </transition>
            </div>
            <div class="interests">
                <h1>Select an interest</h1>
                <p> 
                <button  class="button">Food Assitance</button>
                &nbsp;&nbsp;&nbsp;   
                <button  class="button">Education</button>
                </p>
                <p>
                <button class="button">Healthcare</button>
                &nbsp;&nbsp;&nbsp;
                <button  class="button">Jobs</button>
                </p>

                <div class="matched">
                <h4>Resources that matched your location and interests </h4>
                <p>
                <button  class="button">Seattle Food Bank</button>
                &nbsp;&nbsp;&nbsp;
                <button  class="button">Costco Free Food</button>
                </p>
                <p>
                <button class="button">Seattle Public Library</button>
                </p>
                </div>
            </div>
            

        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js')

    export default {
        data() {
            return {
                loginForm: {
                    email: '',
                    password: ''
                },
                signupForm: {
                    name: '',
                    title: '',
                    email: '',
                    password: '',
                    confirmpassword: '',
                    city: '',
                    state: '',
                    country: ''
                },
                passwordForm: {
                    email: ''
                },
                showLoginForm: false,
                showForgotPassword: false,
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: ''
            }
        },
        methods: {
            toggleForm() {
                this.errorMsg = ''
                this.$router.push('/login')
                //this.showLoginForm = !this.showLoginForm
            },
            togglePasswordReset() {
                if (this.showForgotPassword) {
                    this.showLoginForm = true
                    this.showForgotPassword = false
                    this.passwordResetSuccess = false
                } else {
                    this.showLoginForm = false
                    this.showForgotPassword = true
                }
            },
            login() {
                this.performingRequest = true

                fb.auth.signInWithEmailAndPassword(this.loginForm.email, this.loginForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)
                    this.$store.dispatch('fetchUserProfile')
                    this.performingRequest = false
                    this.$router.push('/dashboard')
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            signup() {
                this.performingRequest = true

                fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                    this.$store.commit('setCurrentUser', user.user)

                    // create user obj
                    fb.usersCollection.doc(user.user.uid).set({
                        name: this.signupForm.name,
                        title: this.signupForm.title,
                        city: this.signupForm.city,
                        state: this.signupForm.state,
                        country: this.signupForm.country

                    }).then(() => {
                        this.$store.dispatch('fetchUserProfile')
                        this.performingRequest = false
                        this.$router.push('/dashboard')
                    }).catch(err => {
                        console.log(err)
                        this.performingRequest = false
                        this.errorMsg = err.message
                    })
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            },
            resetPassword() {
                this.performingRequest = true

                fb.auth.sendPasswordResetEmail(this.passwordForm.email).then(() => {
                    this.performingRequest = false
                    this.passwordResetSuccess = true
                    this.passwordForm.email = ''
                }).catch(err => {
                    console.log(err)
                    this.performingRequest = false
                    this.errorMsg = err.message
                })
            }
        }
    }
</script>