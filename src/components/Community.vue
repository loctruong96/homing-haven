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
                    <el-menu class="el-menu"
                 mode="horizontal"
                 background-color="#5A61A6"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 @select="handleSelect">
            <el-menu-item index="#home" style=" color: #FFFFFF"  ><i class="el-icon-s-home"  style="color: #FFFFFF"></i>Home</el-menu-item>
            <el-menu-item index="#resources" style=" color: #FFFFFF"  ><i class="el-icon-present"  style="color: #FFFFFF"></i>Resources</el-menu-item>
            <el-menu-item index="#about" style=" color: #FFFFFF"  ><i class="el-icon-notebook-2"  style="color: #FFFFFF"></i>About</el-menu-item>
            <el-menu-item index="#admin" style=" color: #FFFFFF" v-if="admin" ><i class="el-icon-s-custom"  style="color: #FFFFFF"></i>Admin</el-menu-item>
            <el-menu-item index="#subscribe" style=" color: #FFFFFF;" v-if="userProfile.name !== undefined && !subscribed"><i class="el-icon-message-solid"  style="color: #FFFFFF"></i>Subscribe</el-menu-item>
            <el-menu-item index="#unsubscribe" style=" color: #FFFFFF" v-if="userProfile.name !== undefined && subscribed"><i class="el-icon-close-notification"  style="color: #FFFFFF"></i>Unsubscribe</el-menu-item>
        </el-menu>
            </div>
            <div v-if="home">
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
                        :breakpoints="{ 1200: { slideRatio: 1 / 5 },800: { visibleSlides: 2, slideMultiple: 2, slideRatio:1/3 }, 600: { visibleSlides: 1, slideMultiple: 2, slideRatio:1/2 } }">
                    <vueper-slide v-for="(slide, i) in slides"
                                  :key="i"
                                  :title="slide.title"
                                  :content="slide.content"
                                  :style="'background-color: ' + ['#C3C7E7', '#C3C7E7'][i % 2]" />
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
                        :breakpoints="{ 1200: { slideRatio: 1 / 5 },800: { visibleSlides: 2, slideMultiple: 2, slideRatio:1/3 }, 600: { visibleSlides: 1, slideMultiple: 2, slideRatio:1/2 } }">
                    <vueper-slide v-for="(slide, i) in slides_recc"
                                  :key="i"
                                  :title="slide.title"
                                  :content="slide.content"
                                  :style="'background-color: ' + ['#C3C7E7', '#C3C7E7'][i % 2]" />
                </vueper-slides>
            </div>
            </div>

            <div v-if="resources" class="resources">
                <div class="resourceCategories" v-if="communityProfile">
                    <div class="filterRecources">
                        <select style="float: right; margin-right: 7%;">
                            <option value="" disabled selected hidden>Sort by...</option>
                            <option v-for="interest in sortby">{{interest}}</option>
                        </select>
                    </div>
                    <div class="popCategories">
                        <h1>Resources</h1>
                    </div>

                    <el-button @click="clearFilter">Reset All Filters</el-button>
                    <el-table
                        ref="filterTable"
                        :data="tableData"
                        style="width: 85%">
                        <el-table-column
                            width=90>
                            <template slot-scope="scope">
                                <el-button class="viewButton"
                                           size="mini"
                                           @click="viewCommunity(scope.$index, scope.row)"
                                           round>
                                    View
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="date"
                            label="Date"
                            sortable
                            width="180"
                            column-key="date"
                            :filter-method="filterHandler"
                        >
                        </el-table-column>
                        <el-table-column
                            prop="userName"
                            label="Username"
                            width="180"
                            sortable>
                        </el-table-column>
                        <el-table-column
                            prop="title"
                            label="Title"
                            sortable>
                        </el-table-column>
                        <el-table-column
                            prop="upvotes"
                            label="Upvotes"
                            sortable>
                            
                        </el-table-column>
                        <el-table-column
                            prop="tag"
                            label="Tag"
                            width="112"
                            :filters="[
                                { text: 'Food', value: 'Food' }, 
                                { text: 'Education', value: 'Education' },
                                { text: 'Documentation', value: 'Documentation' }, 
                                { text: 'Healthcare', value: 'Healthcare' }
                            ]"
                            :filter-method="filterTag"
                            filter-placement="bottom-end">
                            <template slot-scope="scope">
                                <el-tag
                                :type="scope.row.tag === 'Home' ? 'primary' : 'success'"
                                disable-transitions>{{scope.row.tag}}</el-tag>
                            </template>
                        </el-table-column>
                    </el-table>





                    
                    <!-- <el-card v-for="card in cards" class="box-card">
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
                                    <div class="title"><h2>{{card.title}}</h2></div>
                                </li>
                               <!-- <li>
                                   <div class="votes">{{card.votes}}</div>
                               </li> -->
                            <!-- </ul>
                        </div>

                        <div class="text item">
                            {{card.description}}
                            <br><br><button v-on:click="postInfo=true" class="button" style="float: right; margin-bottom: 20px">View</button>
                        </div>
                    </el-card> --> -->
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
                               <!-- <img height="150px" width="150px" src="../assets/user_icon.png"/> -->
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
                                        Owner:<input v-model.trim="newOwner" type="text" :placeholder="communityProfile.owner" id="Owner">
                                    </p>
                                    <p v-if="owner">
                                        Moderators: <vue-tags-input
                                            v-model="moderator"
                                            :tags="moderators"
                                            :validation="validation"
                                            placeholder="Add moderators by emails"
                                            @tags-changed="newTags => moderators = newTags"
                                    />
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
                                    <button @click="errorCheck" class="button">Update Community Profile</button>

                                    <el-alert
                                            title="Your changes has been saved."
                                            type="success"
                                            v-if="showSuccess">
                                    </el-alert>
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
                                <h5 style=" margin-bottom: 20px;">Community Interests</h5>

                                                        <ListInterests v-bind:interests="communityProfile.interests"
                                                                       @remove-interest="removeInterest" v-if="currentInterestLen"
                                                        />
                                                        <p class="emptylist" v-else>How lonely... try adding an interest.</p>
                                                        <AddInterest @add-interest="addInterest"/>
                                <el-alert
                                        title="Your changes has been saved."
                                        type="success"
                                        v-if="showSuccessInt">
                                </el-alert>

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
    import VueTagsInput from '@johmun/vue-tags-input';
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
        // if logged in, find if the user is a owner and or moderator
        if(this.userProfile.name !== undefined){
            if(this.communityProfile.owner === this.userProfile.email){
                this.owner = true;
            }
            if(this.communityProfile.moderators.indexOf(this.userProfile.email) !== -1){
                this.admin = true;
            }
            this.userProfile.communities.map((com)=>{
                if (com.title !== undefined){
                    if(com.title === this.communityProfile.link){
                        this.subscribed = true;
                    }
                }
            });
            if(!this.loadedMod){
                this.moderators = this.communityProfile.moderators.map((mod)=> {
                    return {text: mod}
                });
                this.loadedMod = true;
            }
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
            tableData: [{
                userName: 'user1999',
                date: '2016-05-03',
                title: 'Food Bank in West Seattle',
                upvotes: 45,
                tag: 'Food'
            }, 
                {
                userName: 'loctruong12',
                date: '2016-05-06',
                title: 'Master list of links for immigrant documentation',
                upvotes: 15,
                tag: 'Documentation'
            }, 
            {
                userName: 'felixTran44',
                date: '2016-09-03',
                title: 'Looking for scholarships? Go to Cappex.com',
                upvotes: 88,
                tag: 'Education'
            }, 
            {
                userName: 'kidabrea48',
                date: '2019-12-04',
                title: 'FYI: This drug store is doing a 15% off deal on all items right now!',
                upvotes: 99,
                tag: 'Healthcare'
            },
            {
                userName: 'esperia97',
                date: '2017-05-21',
                title: 'This clinic downtown offers free STD testing!',
                upvotes: 69,
                tag: 'Healthcare'
            }
            ],
            subscribed: false,
            loadedMod: false,
            newOwner: '',
            looked: false,
            home: true,
            resources: false,
            postInfo: false,
            about: false,
            admin: false,
            adminSelect: false,
            owner: false,
            properName: /^[a-zA-Z]+(([\',. -][a-zA-Z ])?[a-zA-Z]*)*$/,
            name: '',
            title: '',
            city: '',
            state: '',
            country: '',
            rules: '',
            description: '',
            errorMsg: '',
            moderator: '',
            moderators: [],
            showSuccess: false,
            showSuccessInt: false,
            interests: [
            ],
            communities: [
            ],
            validation: [{
                classes: 'valid-email',
                rule: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                disableAdd: true,
            }],
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
                    this.postInfo = false;
                }
                else if(key === '#resources') {
                    this.home = false;
                    this.resources = true;
                    this.about = false;
                    this.adminSelect = false;
                    this.postInfo = false;
                    if(key === '#postInfo') {
                        this.resources = false;
                        this.postInfo = true;
                    }
                }
                else if(key === '#about') {
                    this.home = false;
                    this.resources = false;
                    this.about = true;
                    this.adminSelect = false;
                    this.postInfo = false;
                } else if(key === '#admin'){
                    this.home = false;
                    this.resources = false;
                    this.about = false;
                    this.adminSelect = true;
                    this.postInfo = false;
                } else if(key === '#subscribe'){
                    this.subscribed = true;
                    this.subscribe()
                } else if(key === '#unsubscribe'){
                    this.subscribed = false;
                    this.unsubscribe();
                }
            },


            resetDateFilter() {
                this.$refs.filterTable.clearFilter('date');
            },
            clearFilter() {
                this.$refs.filterTable.clearFilter();
            },
            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },





           
         errorCheck(){
            let error = false;
            let foundOwner = false;
            this.moderators.map((mod) => {
                if(mod.text === this.communityProfile.owner){
                    foundOwner = true;
                }
            });
            if(!foundOwner){
                error = true;
                this.errorMsg = "Can not remove owner from admin."
            } else if(this.interests.length > 30){
                error = true;
                this.errorMsg = "We currently only allow a community to have up to 30 interests."
            } else if(!this.properName.test(this.name) && this.name !== ''){
                error = true;
                this.errorMsg = "Invalid naming format. Alpha characters and space only."
            } else if(this.moderators.length !== this.communityProfile.moderators.length) {
                this.$confirm('You are about to update moderators as an owner. Continue?', 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(async () => {
                    const stat = await this.updateCommunityProfile();
                }).catch(() => {
                    error = true;
                    this.$message({
                        type: 'info',
                        message: 'Moderators update canceled'
                    });
                })
            } else {
                this.updateCommunityProfile();
            }
        },
        async updateCommunityProfile() {
            this.errorMsg = "";
            // check if all emails are actually valid
            this.looked = false;
            const userRef = fb.usersCollection;
            let valid = true;
            const finalMods = [];
            await Promise.all(this.moderators.map(async (mod) => {
                finalMods.push(mod.text);
                const query  = await userRef.where("email", "==", mod.text);
                const querySnapshot = await query.get();
                if(querySnapshot.size === 0){
                    valid = false;
                    this.looked = true;
                    this.errorMsg = `Cannot find user associated with ${mod.text}.`
                }
            }));
            if(valid){
                await this.$store.dispatch('updateCommunityProfile', {
                    name: this.name !== '' ? this.name : this.communityProfile.name,
                    rules: this.rules !== '' ? this.rules: this.communityProfile.rules,
                    description: this.description !== '' ? this.description: this.communityProfile.description,
                    city: this.city !== '' ? this.city: this.communityProfile.city,
                    state: this.state !== '' ? this.state: this.communityProfile.state,
                    country: this.country !== '' ? this.country: this.communityProfile.country,
                    interests: this.communityProfile.interests,
                    link: this.communityProfile.link,
                    createdOn: this.communityProfile.createdOn,
                    moderators: finalMods,
                    subscribers: this.communityProfile.subscribers,
                    owner: this.communityProfile.owner,
                });
                this.name = '';
                this.title = '';
                this.city = '';
                this.state = '';
                this.showSuccess = true;
                setTimeout(() => { this.showSuccess = false }, 2000)
            }
            return valid;
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
            this.showSuccessInt = true;

            setTimeout(() => { this.showSuccessInt = false }, 2000)
        },
        subscribe(){
            this.userProfile.communities.push({id:0, title: this.communityProfile.link, completed: false});
            this.updateUserSubscription();
        },
        unsubscribe(){
            this.userProfile.communities = this.userProfile.communities.filter(t=> t.title !== this.communityProfile.link);
            this.updateUserSubscription();
        }
        ,
        updateUserSubscription() {
            const updatedCommunities = [];
            let counter = 0;
            this.userProfile.communities.map((community) => {
                updatedCommunities.push({id:counter, title: community.title, completed: false});
                counter += 1;
            });
            this.$store.dispatch('updateProfile', {
                name: this.userProfile.name,
                title: this.userProfile.title,
                city:  this.userProfile.city,
                state: this.userProfile.state,
                country: this.userProfile.country,
                interests: this.userProfile.interests,
                communities: updatedCommunities,
            });
        }
        },
    components: {
        VueperSlides,
        VueperSlide,
        ListInterests,
        AddInterest,
        AddCommunity,
        ListCommunities,
        VueTagsInput}

}
</script>
