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

                    <ListInterests v-bind:interests="userProfile.interests"
                                   @remove-interest="removeInterest" v-if="currentInterestLen"
                    />
                    <p class="emptylist" v-else>How lonely... try adding an interest.</p>
                    <AddInterest @add-interest="addInterest"/>

                </div>
                <div class="user-form">
                    <h5 style=" margin-bottom: 20px;">Communities you have joined:</h5>

                    <ListCommunities v-bind:communities="userProfile.communities"
                                   @remove-community="removeCommunity" v-if="currentInterestLen"
                    />
                    <p class="emptylist" v-else>How lonely... try looking for a community.</p>
<!--                    <AddCommunity @add-community="addCommunity"/>-->
                </div>
            </div>
        </section>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import ListInterests from "@/components/ListInterests"
    import ListCommunities from "@/components/ListCommunities";
    import AddInterest from "@/components/AddInterest"
    import AddCommunity from "@/components/AddCommunity";
    export default {
        data() {
            return {
                name: '',
                title: '',
                city: '',
                state: '',
                country: '',
                showSuccess: false,
                interests: [
                ],
                communities: [
                ],
            }
        },
        computed: mapState({
            ...mapState(['userProfile']),
            currentInterestLen(state) {
                // return state.userProfile.interests.length;
                return 4;
            }
        }),

        methods: {
            updateProfile() {
                this.$store.dispatch('updateProfile', {
                    name: this.name !== '' ? this.name : this.userProfile.name,
                    title: this.title !== '' ? this.title : this.userProfile.title,
                    city: this.city !== '' ? this.city: this.userProfile.city,
                    state: this.state !== '' ? this.state: this.userProfile.state,
                    country: this.country !== '' ? this.country: this.userProfile.country,
                    interests: this.userProfile.interests,
                });

                this.name = '';
                this.title = '';
                this.city = '';

                this.showSuccess = true;

                setTimeout(() => { this.showSuccess = false }, 2000)
            },
            removeInterest(id) {
                this.userProfile.interests = this.userProfile.interests.filter(t=> t.id !== id);
                this.updateUserInterestFirebase();
            },
            addInterest(interest) {
                this.userProfile.interests.push(interest);
                this.updateUserInterestFirebase();
            },
            removeCommunity(id) {
                this.userProfile.communities = this.userProfile.communities.filter(t=> t.id !== id);
                this.updateUserInterestFirebase();
            },
            addCommunity(community) {
                this.communities.push(community);

            },
            updateUserInterestFirebase() {
                const updatedInterest = [];
                let counter = 0;
                this.userProfile.interests.map((interest) => {
                    updatedInterest.push({id:counter, title: interest.title, completed: false});
                    counter += 1;
                });
                const updatedCommunities = [];
                counter = 0;
                this.userProfile.communities.map((com) => {
                    updatedCommunities.push({id:counter, title: com.title, completed: false});
                    counter += 1;
                });
                this.$store.dispatch('updateProfile', {
                    name: this.userProfile.name,
                    title: this.userProfile.title,
                    city:  this.userProfile.city,
                    state: this.userProfile.state,
                    country: this.userProfile.country,
                    interests: updatedInterest,
                    communities: updatedCommunities,
                });
            }

        },
        components: {
            ListInterests,
            AddInterest,
            AddCommunity,
            ListCommunities
        }
    }
</script>

