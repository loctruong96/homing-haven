<template>
    <div id="newcomm">
        <div class="ncBanner">
            <div class="span">
                <h1>Create a Community</h1>
            </div>
        </div>
        <transition name="fade">
            <div v-if="performingRequest" class="loading">
                <p>Loading...</p>
            </div>
        </transition>
        <section>

            <div class="col1">

                <div class="profile">
<!--                    <img height="150px" width="150px" src="../assets/user_icon.png"/>-->

                    <h3 style="float: right; ">Help us know where to send people in need....</h3>
                    <form @submit.prevent>
                        <p style=" margin-top: 20px;">
                            Community:<input v-model.trim="name" type="text"  id="name" placeholder="Your community"/>
                        </p>
                        <p>
                            Moderator:
                            <vue-tags-input
                                    v-model="moderator"
                                    :tags="moderators"
                                    :validation="validation"
                                    placeholder="Add moderators by emails"
                                    @tags-changed="newTags => moderators = newTags"
                            />
                        </p>

                        <label for="country">Country</label>
                        <!--                    <input v-model.trim="signupForm.country" type="text" placeholder="" id="country" />-->
                        <select v-model="country" id="country" >
                            <option v-for="country in countries" v-bind:value="country">
                                {{ country }}
                            </option>
                        </select>
                        <label for="state">State</label>
                        <!--                    <input v-model.trim="signupForm.state" type="text" placeholder="" id="state" />-->
                        <select v-model="state" id="state" >
                            <option v-for="state in states[country]" v-bind:value="state">
                                {{ state }}
                            </option>
                        </select>
                        <p>
                            <label for="city">City</label>
                            <input v-model.trim="city" type="text" :disabled="state === ''" placeholder="" id="city" />
                        </p>
                        <div>
                            <button @click="createCommunity" class="button">Create Community</button>
                            <br><br>
                            <button @click="cancel" class="button">Cancel</button>
                        </div>
                        <transition name="fade">
                            <img v-if="showSuccess" class="success" style="margin-left: 10px;" height="30px" width="33px" src="../assets/green_check.png"/>
                        </transition>
                    </form>
                    <transition name="fade">
                        <div v-if="errorMsg !== ''" class="error-msg">
                            <p>{{ errorMsg }}</p>
                        </div>
                    </transition>
                </div>
            </div>
            <div class="col2">
                <div class="user-form">
                    <h5 style=" margin-bottom: 20px;">What does your community seek or provide?</h5>
                    <ListInterests v-bind:interests="interests"
                                   @remove-interest="removeInterest" v-if="interests.length"
                    />
                    <p class="emptylist" v-else>How lonely... add try adding an interest.</p>
                    <AddInterest @add-interest="addInterest"/>
                </div>
                <div class="user-form">
                    <h5 style=" margin-bottom: 20px;">Resources that matched your interests or location</h5>
                    <p>
                        <button class="button">Seatle Food Bank</button>
                        <button class="button">Seattle Public Library</button>
                        <button class="button">Costco Free Food</button>
                    </p>
                    <p>
                        <button class="button">Tacoma Free Food</button>
                        <button class="button" style="background: lightgrey;">+</button>
                    </p>

                </div>
            </div>
        </section>

    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import ListInterests from "@/components/ListInterests"
    import AddInterest from "@/components/AddInterest"
    import VueTagsInput from '@johmun/vue-tags-input';
    import {communityCollection} from "../firebaseConfig";
    const fb = require('../firebaseConfig.js');
    export default {
        data() {
            return {
                moderator: '',
                moderators: [],
                link: '',
                name: '',
                title: '',
                city: '',
                state: '',
                country: 'United States',
                showSuccess: false,
                performingRequest: false,
                errorMsg: '',
                interests: [
                    {id: 1, title:"Books", completed: false},
                    {id: 2, title:"Career", completed: false},
                    {id: 3, title:"Legal", completed: false},
                    {id: 4, title:"Food Assistance", completed: false},
                    {id: 5, title:"Photography", completed: false},
                ],
                properName: /^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
                properLink: /^[a-zA-Z0-9]*$/,
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
                validation: [{
                    classes: 'valid-email',
                    rule: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    disableAdd: true,
                }],
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

                this.name = ''
                this.title = ''

                this.showSuccess = true

                setTimeout(() => { this.showSuccess = false }, 2000)
            },
            removeInterest(id) {
                this.interests = this.interests.filter(t=> t.id !== id)
            },
            addInterest(interest) {
                this.interests.push(interest)
            },
            cancel(){
                this.$router.push('/dashboard');
            },
            creatorAsModerator(element) {
                return element.text === this.userProfile.email;
            }
            ,
            async createCommunity(){
                if(!this.name || !this.city || !this.state || !this.country){
                    this.performingRequest = false;
                    if(!this.name){
                        this.errorMsg = "Community name is required."
                    } else if(!this.city){
                        this.errorMsg = "City is required."
                    } else if(!this.state){
                        this.errorMsg = "State is required."
                    } else if(!this.country){
                        this.errorMsg = "Country is required."
                    }
                } else if(this.interests.length > 30){
                    this.performingRequest = false;
                    this.errorMsg = "We currently only allow a community to have up to 30 interests."
                } else if(this.moderators.findIndex(this.creatorAsModerator) < 0){
                    this.performingRequest = false;
                    this.errorMsg = `${this.userProfile.email} must be a moderator as the creator.`
                } else if(!this.properName.test(this.name)){
                    this.performingRequest = false;
                    this.errorMsg = "Invalid naming format."
                } else {
                    // check if all emails are actually valid
                    this.performingRequest = true;
                    const userRef = fb.usersCollection;
                    let valid = true;
                    const finalMods = [];
                    await Promise.all(this.moderators.map(async (mod) => {
                        finalMods.push(mod.text);
                        const query  = await userRef.where("email", "==", mod.text);
                        const querySnapshot = await query.get();
                        if(querySnapshot.size === 0){
                            valid = false;
                            this.performingRequest = false;
                            this.errorMsg = `Cannot find user associated with ${mod.text}.`
                        }
                    }));
                    // check if city is actually valid
                    const cityRef = fb.countryCollection.doc(this.country).collection(this.state).doc(this.city);
                    const city = await cityRef.get();
                    if (!city.exists){
                        valid = false;
                        this.performingRequest = false;
                        this.errorMsg = `${this.city} city is not current supported. Please select a nearby city.`
                    }
                    if(valid){
                        const communityRef = fb.communityCollection.doc(this.name);
                        communityRef.get().then((doc) => {
                            if(doc.exists){
                                this.performingRequest = false;
                                this.errorMsg = `Community name ${this.name} is already taken.`
                            } else {
                                // create the document
                                communityRef.set({
                                    createdOn: new Date(),
                                    subscribers: 0,
                                    moderators: finalMods,
                                    city: this.city,
                                    state: this.state,
                                    country: this.country,
                                    interests: this.interests,
                                    name: this.name,
                                    description: "Your community's description",
                                    rules: "Your community's guidelines.",
                                }).then(() => {
                                    // set the current community
                                    this.performingRequest = false;
                                    this.$store.commit('setCurrentCommunity', this.name);
                                    this.$store.dispatch('fetchCommunityProfile');
                                    this.$router.push('/community');
                                });
                            }
                        }).catch((err) => {
                            this.performingRequest = false;
                            this.errorMsg = err;
                        })
                    }
                }
            }
        },
        components: {
            ListInterests,
            AddInterest,
            VueTagsInput
        }
    }
</script>
