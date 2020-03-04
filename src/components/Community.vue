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
                    <div class="test">
                        hello
                    </div>
                    <el-card v-for="card in cards" class="box-card">
                        <div class="headerContainer">
                           <ul>
                               <li><i class="el-icon-user-solid"  style="color: gray"></i></li>
                                <li>
                                    <div class="userInfo">
                                        <div class="postInfo">
                                            <p>{{card.user}}</p>
                                            <p><i>{{card.date}}</i></p>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div class="title"><h3>{{card.title}}</h3></div>
                                </li>
<!--                                <li>-->
<!--                                    <div class="votes">{{card.votes}}</div>-->
<!--                                </li>-->
                            </ul>
                        </div>

<!--                        <div class="headerContainer">-->
<!--                            <div slot="header" class="clearfix">-->
<!--                                <div class="userInfo">-->
<!--                                    <i class="el-icon-user-solid"  style="color: gray"></i>-->
<!--                                    <div class="postInfo">-->
<!--                                        <p>{{card.user}}</p>-->
<!--                                        <p><i>{{card.date}}</i></p>-->
<!--                                    </div>-->
<!--                                </div>-->
<!--                                <div class="title"><h4>{{card.title}}</h4></div>-->
<!--                                <div class="votes">{{card.votes}}</div>-->
<!--                            </div>-->
<!--                        </div>-->

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
export default {
    beforeCreate() {
        this.looked = false;
        this.$store.commit('setCommunityProfile', false);
        this.$store.commit('setCurrentCommunity', this.$route.params.id);
        this.$store.dispatch('fetchCommunityProfile');
    },
    beforeUpdate() {
        this.looked = true;
    },
    computed: {
        ...mapState(['communityProfile'])
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
                    console.log(key);
                    this.home = true;
                    this.resources = false;
                    this.about = false;
                }
                else if(key === '#resources') {
                    this.home = false;
                    this.resources = true;
                    this.about = false;
                }
                else if(key === '#about') {
                    this.home = false;
                    this.resources = false;
                    this.about = true;
                }
            }
        },
    components: { VueperSlides, VueperSlide }

}
</script>
