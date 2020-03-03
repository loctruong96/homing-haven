<template>
    <div id="community" >
        <transition name="fade">
            <div v-if="!looked" class="loading">
                <p>Loading..</p>
            </div>
        </transition>
        <div v-if="communityProfile">
            <div class="commBanner" v-if="communityProfile">
                <h1 align="center"><span>{{communityProfile.name}}</span></h1>
            </div>

            <div class="navInterests" v-if="communityProfile">
<!--                <a class="active" href="#home" >Home</a>-->
<!--                <a href="#news">News</a>-->
<!--                <a href="#contact">Contact</a>-->
<!--                <a href="#about">About</a>-->
<!--                <a class="active" href="#home" index="4-1">Home</a>-->
<!--                <a href="#resources" index="4-2">Resources</a>-->
<!--                <a href="#about" index="4-3">About</a>-->
                    <el-menu class="el-menu"
                 mode="horizontal"
                 background-color="#5A61A6"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 @select="handleSelect">
            <el-menu-item index="#home" style=" color: #FFFFFF"  ><i class="el-icon-s-home"  style="color: #FFFFFF"></i>Home</el-menu-item>
            <el-menu-item index="#resources" style=" color: #FFFFFF"  ><i class="el-icon-present"  style="color: #FFFFFF"></i>Resources</el-menu-item>
            <el-menu-item index="#about" style=" color: #FFFFFF"  ><i class="el-icon-notebook-2"  style="color: #FFFFFF"></i>About</el-menu-item>
            <el-menu-item index="#admin" style=" color: #FFFFFF" v-if="admin" ><i class="el-icon-notebook-2"  style="color: #FFFFFF"></i>Admin</el-menu-item>
        </el-menu>
            </div>
            <div v-if="home">
<!--            sliders-->
            <div class="resourceCategories" v-if="communityProfile">
                <div class="popCategories">
                    <h1>Popular Resource Categories</h1>
                </div>
                <vueper-slides
                        class="no-shadow"
                        :visible-slides="3"
                        slide-multiple
                        :gap="3"
                        :arrows="false"
                        :slide-ratio="1 / 8"
                        :dragging-distance="200"
                        :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
                    <!--              <div class="slide2">-->
                    <vueper-slide v-for="(slide, i) in slides"
                                  :key="i"
                                  :title="slide.title"
                                  :content="slide.content"
                                  :style="'background-color: ' + ['#C3C7E7', '#C3C7E7'][i % 2]" />
                    <!--              </div>-->
                </vueper-slides>

                <div class="recCategories">
                    <h1>Recommended Resource Categories</h1>
                </div>
                <vueper-slides
                        class="no-shadow"
                        :visible-slides="3"
                        slide-multiple
                        :arrows="false"
                        :gap="3"
                        :slide-ratio="1 / 8"
                        :dragging-distance="200"
                        :breakpoints="{ 800: { visibleSlides: 2, slideMultiple: 2 } }">
                    <!--              <div class="slide2">-->
                    <vueper-slide v-for="(slide, i) in slides_recc"
                                  :key="i"
                                  :title="slide.title"
                                  :content="slide.content"
                                  :style="'background-color: ' + ['#C3C7E7', '#C3C7E7'][i % 2]" />
                    <!--              </div>-->
                </vueper-slides>
            </div>
            </div>
            <div v-if="resources">
                <div class="resourceCategories" v-if="communityProfile">
                    <div class="popCategories">
                        <h1>Resources</h1>
                    </div>
                    <div class="filterRecources">
                        <select >
                            <option value="" disabled selected hidden>Sort by...</option>
                            <option v-for="interest in sortby">{{interest}}</option>
                        </select>
                    </div>
                    <el-card v-for="card in cards" class="box-card">
                        <div slot="header" class="clearfix">
                            <div class="userInfo">
                                <i class="el-icon-user-solid"  style="color: gray"></i>
                                <div class="postInfo">
                                    <p>{{card.user}}</p>
                                    <p><i>{{card.date}}</i></p>
                                </div>
                            </div>
                            <div class="title">{{card.title}}</div>
                            <div class="votes">{{card.votes}}</div>
                        </div>
                        <div class="text item">
                            {{card.description}}
                            <br><br><button class="button" style="float: right; margin-bottom: 20px">View</button>
                        </div>
                    </el-card>
                </div>
            </div>

            <div v-if="about">
                <div class="communityGuidelines" v-if="communityProfile">
                    <div class="description" v-if="communityProfile">
                        <h1>Description</h1>
                        <p><span>{{ communityProfile.description }}</span></p>
                    </div>
                    <div class="commDetails" v-if="communityProfile">
                        <div class="rules">
                            <h3>Community Rules</h3>
                            <p><span>{{ communityProfile.rules }}</span></p>
                        </div>
                        <div class="activity" v-if="communityProfile">
                            <h3>Community Activity</h3>
                            <p>[number] new posts today</p>
                            <p>[number] members</p>
                            <p><i>Created [number] years ago</i></p>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="adminSelect">
                <div>
                    <section>
                        <div class="col1">
                            <div class="profile">
                                <img height="150px" width="150px" src="../assets/user_icon.png"/>
                                <h5 style="float: right; margin-top: 20px;">{{ communityProfile.name }}</h5>
                                <form @submit.prevent>
                                    <p style=" margin-top: 20px;">
                                        Name:<input v-model.trim="name" type="text" :placeholder="communityProfile.name" id="name" />
                                    </p>
                                    <p>
                                        Description:<el-input
                                            type="textarea"
                                            :placeholder="communityProfile.description"
                                            v-model="description"
                                            maxlength="500"
                                            show-word-limit
                                    >
                                    </el-input>
                                    </p>
                                    <p>
                                        Rules:<el-input
                                            type="textarea"
                                            :placeholder="communityProfile.rules"
                                            v-model="rules"
                                            maxlength="500"
                                            show-word-limit
                                    >
                                    </el-input>
                                    </p>
                                    <p>
                                        City:<input v-model.trim="city" type="text" :placeholder="communityProfile.city" id="city">
                                    </p>
                                    <p>
                                        State:<input v-model.trim="state" type="text" :placeholder="communityProfile.state" id="state">
                                    </p>
                                    <p>
                                        Country:<input v-model.trim="country" type="text" :placeholder="communityProfile.country" id="country">
                                    </p>
                                    <button class="button">Update Community Profile</button>

                                    <transition name="fade">
                                        <img v-if="showSuccess" class="success" style="margin-left: 10px;" height="30px" width="33px" src="../assets/green_check.png"/>
                                    </transition>
                                </form>
                            </div>
                        </div>
                        <div class="col2">
                            <div class="user-form">
                                <h5 style=" margin-bottom: 20px;">Community Interests</h5>

                                                        <ListInterests v-bind:interests="communityProfile.interests"
                                                                       @remove-interest="removeInterest" v-if="currentInterestLen"
                                                        />
                                                        <p class="emptylist" v-else>How lonely... try adding an interest.</p>
                                                        <AddInterest @add-interest="addInterest"/>

                            </div>
<!--                            <div class="user-form">-->
<!--                                <h5 style=" margin-bottom: 20px;">Resources in your community.</h5>-->

<!--                                                        <ListCommunities v-bind:communities="communities"-->
<!--                                                                         @remove-community="removeCommunity" v-if="communities.length"-->
<!--                                                        />-->
<!--                                                        <p class="emptylist" v-else>How lonely... try looking for a community.</p>-->
<!--                                                        <AddCommunity @add-community="addCommunity"/>-->
<!--                            </div>-->
                        </div>
                </section>
                </div>
            </div>

        </div>
        <div class="commBanner" v-if="!communityProfile && looked">
            <h1 align="center">Community Not Found</h1>
        </div>


    </div>

</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'
    import { VueperSlides, VueperSlide } from 'vueperslides'
    import 'vueperslides/dist/vueperslides.css'
    const fb = require('../firebaseConfig.js');
    import ListInterests from "@/components/ListInterests"
    import ListCommunities from "@/components/ListCommunities";
    import AddInterest from "@/components/AddInterest"
    import AddCommunity from "@/components/AddCommunity";
export default {
    beforeCreate() {
        this.looked = false;
        this.$store.commit('setCommunityProfile', false);
        this.$store.commit('setCurrentCommunity', this.$route.params.id);
        this.$store.dispatch('fetchCommunityProfile');
    },
    beforeUpdate() {
        this.looked = true;
        if(this.communityProfile.moderators.indexOf(this.userProfile.email) !== -1){
            this.admin = true;
        }
    },
    computed: {
        ...mapState(['communityProfile', 'userProfile']),
        currentInterestLen(state) {
            // return state.userProfile.interests.length;
            return 4;
        }
    },
    data(){
        return{
            post: {
                    content: ''
                },

                slides: [
                {
                  id: 'slide-0',
                  title: '<b style="font-size: 1.3em;color: ">Food Assistance</b>',
                  content: 'This is the Food Assistance intererst.'+
                   '<br><br><button @click="foodAssistance_card"  class="button">View</button>'
                },
                {
                  id: 'slide-1',
                  title: '<b style="font-size: 1.3em;color: ">Health Care</b>',
                  content: 'This is the Healthcare interest.'+
                   '<br><br><button @click="healthcare_card"  class="button">View</button>'
                },
                {
                  id: 'slide-2',
                  title: '<b style="font-size: 1.3em;color: ">Education</b>',
                  content: 'This is the Education Interest.'+
                   '<br><br><button @click="education_card"  class="button">View</button>'
                },
                 {
                  id: 'slide-3',
                  title: '<b style="font-size: 1.3em;color: ">Legal Assistance</b>',
                  content: 'This is the Legal Assistance.'+
                   '<br><br><button @click="legalAssistance_card"  class="button">View</button>'
                }
              ],
              slides_recc: [
                {
                  id: 'slide-0',
                  title: '<b style="font-size: 1.3em;color: ">Recommended Category 1</b>',
                  content: 'This is a description'+
                   '<br><br><button @click="recc1_card"  class="button">View</button>'

                },
                {
                  id: 'slide-1',
                  title: '<b style="font-size: 1.3em;color: ">Recommended Category 2</b>',
                  content: 'This is a description'+
                   '<br><br><button @click="recc2_card"  class="button">View</button>'
                },
                {
                  id: 'slide-2',
                  title: '<b style="font-size: 1.3em;color: ">Recommended Category 3</b>',
                  content: 'This is a description'+
                   '<br><br><button @click="recc3_card"  class="button">View</button>'
                },
                 {
                  id: 'slide-3',
                  title: '<b style="font-size: 1.3em;color: ">Recommended Category 4</b>',
                  content: 'This is a description'+
                   '<br><br><button @click="recc4_card"  class="button">View</button>'
                }
              ],
            looked: false,
            home: true,
            resources: false,
            about: false,
            admin: false,
            adminSelect: false,
            properName: /^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
            name: '',
            title: '',
            city: '',
            state: '',
            country: '',
            rules: '',
            description: '',
            errorMsg: '',
            showSuccess: false,
            interests: [
            ],
            communities: [
            ],
            userInfo: "User 12345",
            postDate: "April 20, 2018",
            postTitle: "Food Drive at Westfield Food Bank",
            postDesc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
            postVotes: 68,
            sortby: ["Food", "Education", "Documentation","Healthcare"],
            cards: [{title: "Food Drive at Westfield Food Bank",
            description: "stuff", votes: 68, date: "April 20, 2018", user: "User 12345"},{title: "Food Drive at Westfield Food Bank",
            description: "stuff", votes: 68, date: "April 20, 2018", user: "User 6789"}]

        }
    },
    methods: {
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
                if(key === '#home'){
                    this.home = true;
                    this.resources = false;
                    this.about = false;
                    this.adminSelect = false;
                }
                else if(key === '#resources') {
                    this.home = false;
                    this.resources = true;
                    this.about = false;
                    this.adminSelect = false;
                }
                else if(key === '#about') {
                    this.home = false;
                    this.resources = false;
                    this.about = true;
                    this.adminSelect = false;
                } else if(key === '#admin'){
                    this.home = false;
                    this.resources = false;
                    this.about = false;
                    this.adminSelect = true;
                }
            },
        updateProfile() {
            this.$store.dispatch('updateCommunityProfile', {
                name: this.name !== '' ? this.name : this.communityProfile.name,
                rules: this.rules !== '' ? this.rules: this.communityProfile.rules,
                description: this.description !== '' ? this.description: this.communityProfile.description,
                city: this.city !== '' ? this.city: this.communityProfile.city,
                state: this.state !== '' ? this.state: this.communityProfile.state,
                country: this.country !== '' ? this.country: this.communityProfile.country,
                interests: this.communityProfile.interests,
                link: this.communityProfile.link,
                createdOn: this.communityProfile.createdOn,
                moderators: this.communityProfile.moderators,
                subscribers: this.communityProfile.subscribers,
                owner: this.communityProfile.owner,
            });

            this.name = '';
            this.title = '';
            this.city = '';
            this.state = '';


            this.showSuccess = true;

            setTimeout(() => { this.showSuccess = false }, 2000)
        },
        removeInterest(id) {
            this.communityProfile.interests = this.communityProfile.interests.filter(t=> t.id !== id);
            this.updateCommunityInterestFirebase();
        },
        addInterest(interest) {
            this.communityProfile.interests.push(interest);
            this.updateCommunityInterestFirebase();
        },
        removeCommunity(id) {
            this.communities = this.communities.filter(t=> t.id !== id)
        },
        addCommunity(community) {
            this.communities.push(community)
        },
        updateCommunityInterestFirebase() {
            const updatedInterest = [];
            let counter = 0;
            this.communityProfile.interests.map((interest) => {
                updatedInterest.push({id:counter, title: interest.title, completed: false});
                counter += 1;
            });
            this.$store.dispatch('updateCommunityProfile', {
                name: this.communityProfile.name,
                rules: this.communityProfile.rules,
                description: this.communityProfile.description,
                city:  this.communityProfile.city,
                state: this.communityProfile.state,
                country: this.communityProfile.country,
                interests: updatedInterest,
                createdOn: this.communityProfile.createdOn,
                subscribers: this.communityProfile.subscribers,
                link: this.communityProfile.link,
                moderators: this.communityProfile.moderators,
                owner: this.communityProfile.owner,
            });
        }
        },
    components: {
        VueperSlides,
        VueperSlide,
        ListInterests,
        AddInterest,
        AddCommunity,
        ListCommunities }

}
</script>
