<template>
    <div id="udashboard">
        <transition name="fade">
            <div v-if="!looked" class="loading">
                <p>Loading..</p>
            </div>
        </transition>
<!--        <el-main class="help">-->
            <div class="banner">
                <div class="bannerStuff">
                    <h1>Welcome to HomingHaven!!</h1>
                    <p>Checkout local communities, or resources like scholarships, food, legal help, etc... </p>
                    <button @click="register"  class="button">Get Started</button>
                </div>
            </div>
<!--            <div class="line"></div>-->
            <br>
            <h1 style="margin-left: 2%; color:#3D4381">Popular Communities</h1>
            <div v-if="popularCommunities && looked">


                <vueper-slides
                        class="no-shadow"
                        :slide-ratio="1 / 8"
                               :visible-slides="3"
                               :arrows="false"
                               :gap="3"
                               :dragging-distance="20"
                               :breakpoints="{ 1200: { slideRatio: 1 / 5 },800: { visibleSlides: 2, slideMultiple: 2, slideRatio:1/3 }, 600: { visibleSlides: 1, slideMultiple: 2, slideRatio:1/2 } }">
                    <vueper-slide
                            v-for="(slide, i) in slides"
                            :key="i"
                            :style="'background-color: ' + ['#C3C7E7', '#C3C7E7'][i % 2]">
                        <template v-slot:content>
                            <div class="vueperslide__content-wrapper" style="font-size: 1.3em;flex-direction: row; text-decoration-color: #007EFC">
                                <p><span>{{ slide.title }}<br>{{slide.description}}<br><button class="button" v-on:click="navigateToCommunity(slide.link)">View</button></span></p>
                            </div>
                        </template>
                    </vueper-slide>
                </vueper-slides>
            </div>
<!--        </el-main>-->


    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'
    import { VueperSlides, VueperSlide } from 'vueperslides'
    import 'vueperslides/dist/vueperslides.css'
    import {store} from "../store";
    const fb = require('../firebaseConfig.js');

    export default {
        beforeCreate() {
            this.$store.dispatch('fetchPopularCommunities');
        },
        beforeUpdate() {
            if(this.slides.length < 5 && !this.looked){
                for(let i =0; i <  this.popularCommunities.length;i++){
                    const community = {};
                    community.title = this.popularCommunities[i].name;
                    community.link = this.popularCommunities[i].link;
                    community.description = this.popularCommunities[i].description;
                    this.slides.push(community);
                }
            }
            this.looked= true;
        },
        data() {
            return {
                post: {
                    content: ''
                },
                popularComm: [],
                looked: false,
                slides: [],
                comment: {
                    postId: '',
                    userId: '',
                    content: '',
                    postComments: 0
                },
                showCommentModal: false,
                showPostModal: false,
                fullPost: {},
                postComments: []
            }
        },
        components: { VueperSlides, VueperSlide },
        computed: {
            ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts', 'popularCommunities'])
        },
        methods: {
            navigateToCommunity(link) {
                this.$router.push(`/community/${link}`)
            },
            register() {
                this.$router.push('/registration')
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
            }
        },
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
