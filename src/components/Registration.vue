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

                    <label for="country">Country</label>
                    <!--                    <input v-model.trim="signupForm.country" type="text" placeholder="" id="country" />-->
                    <select v-model="signupForm.country" id="country" >
                        <option v-for="country in countries" v-bind:value="country">
                            {{ country }}
                        </option>
                    </select>

                    <label for="state">State</label>
                    <!--                    <input v-model.trim="signupForm.state" type="text" placeholder="" id="state" />-->
                    <select v-model="signupForm.state" id="state" >
                        <option v-for="state in states[signupForm.country]" v-bind:value="state">
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
                <transition name="fade">
                    <div v-if="errorMsg !== ''" class="error-msg">
                        <p>{{ errorMsg }}</p>
                    </div>
                </transition>
            </div>
            <div class="interests">
                <h1>Select an interest</h1>
<!--                <p>-->
<!--                <button  class="button">Food Assitance</button>-->
<!--                &nbsp;&nbsp;&nbsp;-->
<!--                <button  class="button">Education</button>-->
<!--                </p>-->
<!--                <p>-->
<!--                <button class="button">Healthcare</button>-->
<!--                &nbsp;&nbsp;&nbsp;-->
<!--                <button  class="button">Jobs</button>-->
<!--                </p>-->
                <ListInterests v-bind:interests="interests"
                               @remove-interest="removeInterest" v-if="interests.length"
                />
                <p class="emptylist" v-else>How lonely... add try adding an interest.</p>
                <AddInterest @add-interest="addInterest"/>

<!--                <div class="matched">-->
<!--                -->
<!--            </div>-->
            <h4>Communities that matched your location and interests </h4>
<!--                <p>-->
<!--                <button  class="button">Seattle Community</button>-->
<!--                &nbsp;&nbsp;&nbsp;-->
<!--                <button  class="button">Tacoma Community</button>-->
<!--                </p>-->
<!--                <p>-->
<!--                <button class="button">Seatac Community</button>-->
<!--                </p>-->
                    <ListInterests v-bind:interests="communities"
                                   @remove-interest="removeCommunity" v-if="interests.length"
                    />
                    <p class="emptylist" v-else>How lonely... add try looking for a community.</p>
                    <AddCommunity @add-interest="addCommunity"/>
                </div>


        </section>
    </div>
</template>

<script>
    const fb = require('../firebaseConfig.js');
    import ListInterests from "@/components/ListInterests"
    import AddInterest from "@/components/AddInterest"
    import AddCommunity from "./AddCommunity";
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
                    state: false,
                    country: 'United States'
                },
                passwordForm: {
                    email: ''
                },
                showLoginForm: false,
                showForgotPassword: false,
                passwordResetSuccess: false,
                performingRequest: false,
                errorMsg: '',
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
                interests: [
                    {id: 1, title:"Food Assitance", completed: false},
                    {id: 2, title:"Education", completed: false},
                    {id: 3, title:"Healthcare", completed: false},
                    {id: 4, title:"Jobs", completed: false}
                ],
                communities: [
                    {id: 1, title:"Seattle Community", completed: false},
                ],
            }
        },
        methods: {
            toggleForm() {
                this.errorMsg = '';
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

                fb.auth.signInWithEmailAndPassword(this.loginForm.emai, this.loginForm.password).then(user => {
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
                } else if(this.signupForm.password !== this.signupForm.confirmpassword){
                    this.performingRequest = false;
                    this.errorMsg = "Password confirmation did not match."
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
            },
            removeInterest(id) {
                this.interests = this.interests.filter(t=> t.id !== id)
            },
            addInterest(interest) {
                this.interests.push(interest)
            },
            removeCommunity(id) {
                this.communities = this.communities.filter(t=> t.id !== id)
            },
            addCommunity(community) {
                this.communities.push(community)
            }
        },
        components: {
            ListInterests,
            AddInterest,
            AddCommunity
        }
    }
</script>
