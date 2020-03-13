<template>
    <div id="resource" >
        <transition name="fade">
            <div v-if="!looked" class="loading">
                <p>Loading..</p>
            </div>
        </transition>
        <div v-if="resourceProfile">
            <div class="commBanner" v-if="resourceProfile">
                <h1 align="center"><span>{{resourceProfile.name}}</span></h1>
            </div>

            <div class="navInterests" v-if="resourceProfile">
                <el-menu class="el-menu"
                         mode="horizontal"
                         background-color="#5A61A6"
                         text-color="#fff"
                         active-text-color="#ffd04b"
                         @select="handleSelect">
                    <el-menu-item index="#home" style=" color: #FFFFFF"  ><i class="el-icon-s-home"  style="color: #FFFFFF"></i>Home</el-menu-item>
                    <el-menu-item index="#resources" style=" color: #FFFFFF"  ><i class="el-icon-chat-dot-round"  style="color: #FFFFFF"></i>Questions and Comments</el-menu-item>
<!--                    <el-menu-item index="#about" style=" color: #FFFFFF"  ><i class="el-icon-notebook-2"  style="color: #FFFFFF"></i>About</el-menu-item>-->
<!--                    <el-menu-item index="#admin" style=" color: #FFFFFF" v-if="admin" ><i class="el-icon-s-custom"  style="color: #FFFFFF"></i>Admin</el-menu-item>-->
<!--                    <el-menu-item index="#subscribe" style=" color: #FFFFFF;" v-if="userProfile.name !== undefined && !subscribed"><i class="el-icon-message-solid"  style="color: #FFFFFF"></i>Subscribe</el-menu-item>-->
<!--                    <el-menu-item index="#unsubscribe" style=" color: #FFFFFF" v-if="userProfile.name !== undefined && subscribed"><i class="el-icon-close-notification"  style="color: #FFFFFF"></i>Unsubscribe</el-menu-item>-->
                </el-menu>
            </div>
            <div v-if="home">
                <!--resource home page-->
                <div class="communityGuidelines" v-if="resourceProfile">
                    <div class="description" v-if="resourceProfile">
                        <h1>Description</h1>
                        <p><span>{{ resourceProfile.description }}</span></p>
                    </div>
                    <div class="commDetails" v-if="resourceProfile">
                        <div class="rules">
                            <h3>Resource Rules</h3>
                            <p><span>{{ resourceProfile.rules }}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="question" v-if="resources">
                <section>
                    <div class="col1">
                        <div class="profile">
                            <h5>{{ userProfile.name }}</h5>
                            <p>{{ userProfile.title }}</p>
                            <div class="create-post">
                                <p>create a post</p>
                                <form @submit.prevent>
                                    <textarea v-model.trim="post.content"></textarea>
                                    <button @click="createPost" :disabled="post.content == ''" class="button">post</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div class="col2">
                        <transition name="fade">
                            <div v-if="hiddenPosts.length" @click="showNewPosts" class="hidden-posts">
                                <p>
                                    Click to show <span class="new-posts">{{ hiddenPosts.length }}</span>
                                    new <span v-if="hiddenPosts.length > 1">posts</span><span v-else>post</span>
                                </p>
                            </div>
                        </transition>
                        <div v-if="posts.length">
                            <div v-for="post in posts" class="post">
                                <h5>{{ post.userName }}</h5>
                                <span>{{ post.createdOn | formatDate }}</span>
                                <p>{{ post.content | trimLength }}</p>
                                <ul>
                                    <li><a @click="openCommentModal(post)">comments {{ post.comments }}</a></li>
                                    <li><a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a></li>
                                    <li><a @click="viewPost(post)">view full post</a></li>
                                </ul>
                            </div>
                        </div>
                        <div v-else>
                            <p class="no-results">There are currently no posts</p>
                        </div>
                    </div>
                </section>

                <!-- comment modal -->
                <transition name="fade">
                    <div v-if="showCommentModal" class="c-modal">
                        <div class="c-container">
                            <a @click="closeCommentModal">X</a>
                            <p>add a comment</p>
                            <form @submit.prevent>
                                <textarea v-model.trim="comment.content"></textarea>
                                <button @click="addComment" :disabled="comment.content == ''" class="button">add comment</button>
                            </form>
                        </div>
                    </div>
                </transition>

                <!-- post modal -->
                <transition name="fade">
                    <div v-if="showPostModal" class="p-modal">
                        <div class="p-container">
                            <a @click="closePostModal" class="close">X</a>
                            <div class="post">
                                <h5>{{ fullPost.userName }}</h5>
                                <span>{{ fullPost.createdOn | formatDate }}</span>
                                <p>{{ fullPost.content }}</p>
                                <ul>
                                    <li><a>comments {{ fullPost.comments }}</a></li>
                                    <li><a>likes {{ fullPost.likes }}</a></li>
                                </ul>
                            </div>
                            <div v-show="postComments.length" class="comments">
                                <div v-for="comment in postComments" class="comment">
                                    <p>{{ comment.userName }}</p>
                                    <span>{{ comment.createdOn | formatDate }}</span>
                                    <p>{{ comment.content }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>


            <div v-if="about">

            </div>
            <div v-if="adminSelect">
                <div>
                    <section>
                        <div class="col1">
                            <div class="profile">
                                <!--                                <img height="150px" width="150px" src="../assets/user_icon.png"/>-->
                                <h5 style="float: right; margin-top: 20px;">{{ resourceProfile.name }}</h5>
                                <form @submit.prevent>
                                    <p style=" margin-top: 20px;">
                                        Name:<input v-model.trim="name" type="text" :placeholder="resourceProfile.name" id="name" />
                                    </p>
                                    <p>
                                        Description:<el-input
                                            type="textarea"
                                            :placeholder="resourceProfile.description"
                                            v-model="description"
                                            maxlength="500"
                                            show-word-limit
                                    >
                                    </el-input>
                                    </p>
                                    <p>
                                        Rules:<el-input
                                            type="textarea"
                                            :placeholder="resourceProfile.rules"
                                            v-model="rules"
                                            maxlength="500"
                                            show-word-limit
                                    >
                                    </el-input>
                                    </p>
                                    <p>
                                        Owner:<input v-model.trim="newOwner" type="text" :placeholder="resourceProfile.owner" id="Owner">
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
                                        City:<input v-model.trim="city" type="text" :placeholder="resourceProfile.city" id="city">
                                    </p>
                                    <p>
                                        State:<input v-model.trim="state" type="text" :placeholder="resourceProfile.state" id="state">
                                    </p>
                                    <p>
                                        Country:<input v-model.trim="country" type="text" :placeholder="resourceProfile.country" id="country">
                                    </p>
                                    <button @click="errorCheck" class="button">Update Resource Profile</button>

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

                                <ListInterests v-bind:interests="resourceProfile.interests"
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
                        </div>
                    </section>
                </div>
            </div>

        </div>
        <div class="commBanner" v-if="!resourceProfile && looked">
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
            this.$store.commit('setResourceProfile', false);
            this.$store.commit('setCurrentResource', this.$route.params.id);
            this.$store.dispatch('fetchResourceProfile');

        },
        beforeUpdate() {
            this.looked = true;
            // if logged in, find if the user is a owner and or moderator
            if(this.userProfile.name !== undefined){
                if(this.resourceProfile.owner === this.userProfile.email){
                    this.owner = true;
                }
                if(this.resourceProfile.moderators.indexOf(this.userProfile.email) !== -1){
                    this.admin = true;
                }
                this.userProfile.communities.map((com)=>{
                    if (com.title !== undefined){
                        if(com.title === this.resourceProfile.link){
                            this.subscribed = true;
                        }
                    }
                });
                if(!this.loadedMod){
                    this.moderators = this.resourceProfile.moderators.map((mod)=> {
                        return {text: mod}
                    });
                    this.loadedMod = true;
                }
            }
        },
        computed: {
            ...mapState(['resourceProfile', 'userProfile', 'currentUser', 'posts', 'hiddenPosts']),
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
                comment: {
                    postId: '',
                    userId: '',
                    content: '',
                    postComments: 0
                },
                showCommentModal: false,
                showPostModal: false,
                fullPost: {},
                postComments: [],
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
            errorCheck(){
                let error = false;
                let foundOwner = false;
                this.moderators.map((mod) => {
                    if(mod.text === this.resourceProfile.owner){
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
                } else if(this.moderators.length !== this.resourceProfile.moderators.length) {
                    this.$confirm('You are about to update moderators as an owner. Continue?', 'Warning', {
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(async () => {
                        const stat = await this.updateresourceProfile();
                    }).catch(() => {
                        error = true;
                        this.$message({
                            type: 'info',
                            message: 'Moderators update canceled'
                        });
                    })
                } else {
                    this.updateresourceProfile();
                }
            },
            async updateresourceProfile() {
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
                    await this.$store.dispatch('updateResourceProfile', {
                        name: this.name !== '' ? this.name : this.resourceProfile.name,
                        rules: this.rules !== '' ? this.rules: this.resourceProfile.rules,
                        description: this.description !== '' ? this.description: this.resourceProfile.description,
                        city: this.city !== '' ? this.city: this.resourceProfile.city,
                        state: this.state !== '' ? this.state: this.resourceProfile.state,
                        country: this.country !== '' ? this.country: this.resourceProfile.country,
                        interests: this.resourceProfile.interests,
                        link: this.resourceProfile.link,
                        createdOn: this.resourceProfile.createdOn,
                        moderators: finalMods,
                        subscribers: this.resourceProfile.subscribers,
                        owner: this.resourceProfile.owner,
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
                this.resourceProfile.interests = this.resourceProfile.interests.filter(t=> t.id !== id);
                this.updateCommunityInterestFirebase();
            },
            addInterest(interest) {
                this.resourceProfile.interests.push(interest);
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
                this.resourceProfile.interests.map((interest) => {
                    updatedInterest.push({id:counter, title: interest.title, completed: false});
                    counter += 1;
                });
                this.$store.dispatch('updateresourceProfile', {
                    name: this.resourceProfile.name,
                    rules: this.resourceProfile.rules,
                    description: this.resourceProfile.description,
                    city:  this.resourceProfile.city,
                    state: this.resourceProfile.state,
                    country: this.resourceProfile.country,
                    interests: updatedInterest,
                    createdOn: this.resourceProfile.createdOn,
                    subscribers: this.resourceProfile.subscribers,
                    link: this.resourceProfile.link,
                    moderators: this.resourceProfile.moderators,
                    owner: this.resourceProfile.owner,
                });
                this.showSuccessInt = true;

                setTimeout(() => { this.showSuccessInt = false }, 2000)
            },
            subscribe(){
                this.userProfile.communities.push({id:0, title: this.resourceProfile.link, completed: false});
                this.updateUserSubscription();
            },
            unsubscribe(){
                this.userProfile.communities = this.userProfile.communities.filter(t=> t.title !== this.resourceProfile.link);
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
            },
            createPost() {
                fb.postsCollection.add({
                    createdOn: new Date(),
                    content: this.post.content,
                    userId: this.currentUser.uid,
                    userName: this.userProfile.name,
                    comments: 0,
                    likes: 0
                }).then(ref => {
                    this.post.content = ''
                }).catch(err => {
                    console.log(err)
                })
            },
            showNewPosts() {
                let updatedPostsArray = this.hiddenPosts.concat(this.posts)
                // clear hiddenPosts array and update posts array
                this.$store.commit('setHiddenPosts', null)
                this.$store.commit('setPosts', updatedPostsArray)
            },
            openCommentModal(post) {
                this.comment.postId = post.id
                this.comment.userId = post.userId
                this.comment.postComments = post.comments
                this.showCommentModal = true
            },
            closeCommentModal() {
                this.comment.postId = ''
                this.comment.userId = ''
                this.comment.content = ''
                this.showCommentModal = false
            },
            addComment() {
                let postId = this.comment.postId
                let postComments = this.comment.postComments
                fb.commentsCollection.add({
                    createdOn: new Date(),
                    content: this.comment.content,
                    postId: postId,
                    userId: this.currentUser.uid,
                    userName: this.userProfile.name
                }).then(doc => {
                    fb.postsCollection.doc(postId).update({
                        comments: postComments + 1
                    }).then(() => {
                        this.closeCommentModal()
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            likePost(postId, postLikes) {
                let docId = `${this.currentUser.uid}_${postId}`
                fb.likesCollection.doc(docId).get().then(doc => {
                    if (doc.exists) { return }
                    fb.likesCollection.doc(docId).set({
                        postId: postId,
                        userId: this.currentUser.uid
                    }).then(() => {
                        // update post likes
                        fb.postsCollection.doc(postId).update({
                            likes: postLikes + 1
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            viewPost(post) {
                fb.commentsCollection.where('postId', '==', post.id).get().then(docs => {
                    let commentsArray = []
                    docs.forEach(doc => {
                        let comment = doc.data()
                        comment.id = doc.id
                        commentsArray.push(comment)
                    })
                    this.postComments = commentsArray
                    this.fullPost = post
                    this.showPostModal = true
                }).catch(err => {
                    console.log(err)
                })
            },
            closePostModal() {
                this.postComments = []
                this.showPostModal = false
            },
        },
        components: {
            VueperSlides,
            VueperSlide,
            ListInterests,
            AddInterest,
            AddCommunity,
            ListCommunities,
            VueTagsInput},
        filters: {
            formatDate(val) {
                if (!val) { return '-' }
                let date = val.toDate()
                return moment(date).fromNow()
            },
            trimLength(val) {
                if (val.length < 200) { return val }
                return `${val.substring(0, 200)}...`
            }
        }

    }
</script>
