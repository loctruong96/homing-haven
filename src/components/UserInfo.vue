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
<!--                        <p>-->
<!--                            <button class="button">Books</button>-->
<!--                            <button class="button">Career</button>-->
<!--                        </p>-->
<!--                        <p>-->
<!--                            <button class="button">Legal</button>-->
<!--                            <button class="button" style="background: lightgrey;">+</button>-->
<!--                        </p>-->
<!--                        <p>-->
<!--                            <button class="button">Food Assistance</button>-->
<!--                            <button class="button" style="background-color: white; pointer-events: none;"></button>-->
<!--                        </p>-->
<!--                        <p>-->
<!--                            <button class="button">Photography</button>-->
<!--                            <button class="button" style="background-color: white; pointer-events: none;"></button>-->
<!--                        </p>-->
                    <ListInterests v-bind:interests="interests"
                                   @remove-interest="removeInterest" v-if="interests.length"
                    />
                    <p class="emptylist" v-else>How lonely... try adding an interest.</p>
                    <AddInterest @add-interest="addInterest"/>

                </div>
                <div class="user-form">
                    <h5 style=" margin-bottom: 20px;">Communities you have joined:</h5>
<!--                    <p>-->
<!--                        <button class="button">Bellevue</button>-->
<!--                        <button class="button">Renton</button>-->
<!--                        <button class="button">Seattle</button>-->
<!--                    </p>-->
<!--                    <p>-->
<!--                        <button class="button">Tacoma</button>-->
<!--                        <button class="button" style="background: lightgrey;">+</button>-->
<!--                    </p>-->
                    <ListCommunities v-bind:communities="communities"
                                   @remove-community="removeCommunity" v-if="communities.length"
                    />
                    <p class="emptylist" v-else>How lonely... try looking for a community.</p>
                    <AddCommunity @add-community="addCommunity"/>
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
                    {id: 1, title:"Food", completed: false},
                    {id: 2, title:"Game", completed: false},
                    {id: 3, title:"Legal", completed: false}
                ],
                communities: [
                    {id: 1, title:"Bellevue", completed: false},
                    {id: 2, title:"Renton", completed: false},
                    {id: 3, title:"Seattle", completed: false},
                    {id: 4, title:"Tacoma", completed: false}
                ],
            }
        },
        computed: mapState({
            ...mapState(['userProfile'])
        }),
        methods: {
            updateProfile() {
                this.$store.dispatch('updateProfile', {
                    name: this.name !== '' ? this.name : this.userProfile.name,
                    title: this.title !== '' ? this.title : this.userProfile.title,
                    city: this.city !== '' ? this.city: this.userProfile.city,
                    state: this.state !== '' ? this.state: this.userProfile.state,
                    country: this.country !== '' ? this.country: this.userProfile.country
                });

                this.name = '';
                this.title = '';
                this.city = '';

                this.showSuccess = true;

                setTimeout(() => { this.showSuccess = false }, 2000)
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
            AddCommunity,
            ListCommunities
        }
    }
</script>

