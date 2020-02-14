<template>
    <div id="login">
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>
            <div class="col1">
                <h1>Homing Haven</h1>
                <p>Look for Resources! Have resources to give out? Post them on here!</p>
            </div>
            <div class="col2" :class="{ 'signup-form': !showLoginForm && !showForgotPassword, }">
                <form v-if="showLoginForm" @submit.prevent>
                    <h1>Welcome Back</h1>

                    <label for="email1">Email</label>
                    <input v-model.trim="loginForm.email" type="text" placeholder="" id="email1" />

                    <label for="password1">Password</label>
                    <input v-model.trim="loginForm.password" type="password" placeholder="" id="password1" />

                    <button @click="login" class="button">Log In</button>

                    <div class="extras">
                        <a @click="togglePasswordReset">Forgot Password</a>
                        <a @click="toggleForm">Create an Account</a>
                    </div>
                </form>
                <form v-if="!showLoginForm && !showForgotPassword" @submit.prevent>
                    <h1>Get Started</h1>

                    <label for="name">Name</label>
                    <input v-model.trim="signupForm.name" type="text" placeholder="Savvy Apps" id="name" />

                    <label for="title">Title</label>
                    <input v-model.trim="signupForm.title" type="text" placeholder="Company" id="title" />

                    <label for="email2">Email</label>
                    <input v-model.trim="signupForm.email" type="text" placeholder="you@email.com" id="email2" />

                    <label for="password2">Password</label>
                    <input v-model.trim="signupForm.password" type="password" placeholder="min 6 characters" id="password2" />

                    <label for="country">Country</label>
<!--                    <input v-model.trim="signupForm.country" type="text" placeholder="" id="country" />-->
                    <select v-model="selectedCountry" id="country" >
                        <option v-for="country in countries" v-bind:value="country">
                            {{ country }}
                        </option>
                    </select>

                    <label for="state">State</label>
<!--                    <input v-model.trim="signupForm.state" type="text" placeholder="" id="state" />-->
                    <select v-model="selectedState" id="state" >
                        <option v-for="state in states[selectedCountry]" v-bind:value="state">
                            {{ state }}
                        </option>
                    </select>


                    <label for="city">City</label>
                    <input v-model.trim="signupForm.city" type="text" placeholder="" id="city" />

                    <button @click="signup" class="button">Sign Up</button>

                    <div class="extras">
                        <a @click="toggleForm">Back to Log In</a>
                    </div>
                </form>
                <form v-if="showForgotPassword" @submit.prevent class="password-reset">
                    <div v-if="!passwordResetSuccess">
                        <h1>Reset Password</h1>
                        <p>We will send you an email to reset your password</p>

                        <label for="email3">Email</label>
                        <input v-model.trim="passwordForm.email" type="text" placeholder="" id="email3" />

                        <button @click="resetPassword" class="button">Submit</button>

                        <div class="extras">
                            <a @click="togglePasswordReset">Back to Log In</a>
                        </div>
                    </div>
                    <div v-else>
                        <h1>Email Sent</h1>
                        <p>check your email for a link to reset your password</p>
                        <button @click="togglePasswordReset" class="button">Back to login</button>
                    </div>
                </form>
                <transition name="fade">
                    <div v-if="errorMsg !== ''" class="error-msg">
                        <p>{{ errorMsg }}</p>
                    </div>
                </transition>
            </div>
        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js');
    import { required, minLength } from 'vuelidate/lib/validators';
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
                    password: ''
                },
                passwordForm: {
                    email: ''
                },
                showLoginForm: true,
                showForgotPassword: false,
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: '',
                interests: ["education","legal", "food"],
                countries: ["United States"],
                states: {"United States": ["Alabama",
                    "Alaska",
                    "Arizona",
                    "Arkansas",
                    "California",
                    "Colorado",
                    "Connecticut",
                    "Delaware",
                    "Florida",
                    "Georgia",
                    "Hawaii",
                    "Idaho",
                    "Illinois",
                    "Indiana",
                    "Iowa",
                    "Kansas",
                    "Kentucky",
                    "Louisiana",
                    "Maine",
                    "Maryland",
                    "Massachusetts",
                    "Michigan",
                    "Minnesota",
                    "Mississippi",
                    "Missouri",
                    "Montana",
                    "Nebraska",
                    "Nevada",
                    "New Hampshire",
                    "New Jersey",
                    "New Mexico",
                    "New York",
                    "North Carolina",
                    "North Dakota",
                    "Ohio",
                    "Oklahoma",
                    "Oregon",
                    "Pennsylvania",
                    "Rhode Island",
                    "South Carolina",
                    "South Dakota",
                    "Tennessee",
                    "Texas",
                    "Utah",
                    "Vermont",
                    "Virginia",
                    "Washington",
                    "West Virginia",
                    "Wisconsin",
                    "Wyoming"]},
                selectedCountry: false,
                selectedState: false,
            }
        },
        validations: {
            form: {
                name: { required },
            }
        },
        methods: {
            toggleForm() {
                this.errorMsg = ''
                //this.showLoginForm = !this.showLoginForm
                this.$router.push('/registration')
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
                if(!this.signupForm.name || !this.signupForm.city || !this.signupForm.state || !this.signupForm.country){
                    this.performingRequest = false;
                    if(!this.signupForm.name){
                        this.errorMsg = "Name is required."
                    } else if(!this.signupForm.city){
                        this.errorMsg = "City is required."
                    } else if(!this.signupForm.state){
                        this.errorMsg = "State is required."
                    } else if(!this.signupForm.country){
                        this.errorMsg = "Country is required."
                    }
                    // this.errorMsg = "one of the missing fields are required."
                } else {
                    this.performingRequest = true;

                    fb.auth.createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password).then(user => {
                        this.$store.commit('setCurrentUser', user.user);

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
                }

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