<template>
    <div id="newcomm">
        <div class="ncBanner">
            <div class="span">
                <h1>Create a Community</h1>
            </div>

        </div>
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
                            Moderator:<input placeholder="some@email.com">
                        </p>
                        <p>
                            City:<input placeholder="City">
                        </p>
                        <p>
                            State:<input placeholder="State">
                        </p>
                        <p>
                            Country:<input placeholder="Country">
                        </p>
                        <div>
                            <button @click="updateProfile" class="button">Create Community</button>
                            <br><br>
                            <button @click="updateProfile" class="button">Cancel</button>
                        </div>
                        <transition name="fade">
                            <img v-if="showSuccess" class="success" style="margin-left: 10px;" height="30px" width="33px" src="../assets/green_check.png"/>
                        </transition>
                    </form>
                </div>
            </div>
            <div class="col2">
                <div class="user-form">
                    <h5 style=" margin-bottom: 20px;">What does your community seek or provide?</h5>
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
<!--                            </p>-->
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
    export default {
        data() {
            return {
                name: '',
                title: '',
                showSuccess: false,
                interests: [
                    {id: 1, title:"Books", completed: false},
                    {id: 2, title:"Career", completed: false},
                    {id: 3, title:"Legal", completed: false},
                    {id: 4, title:"Food Assistance", completed: false},
                    {id: 5, title:"Photography", completed: false},
                ],
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
        },
        components: {
            ListInterests,
            AddInterest,
        }
    }
</script>
