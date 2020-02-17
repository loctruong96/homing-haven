<template>
    <div id="dashboard">
        <div class="banner">
            <div class="bannerStuff">
                <h1>Welcome to HomingHaven!!</h1>
                <p>Checkout local communities, or resources like scholarships, food, legal help, etc... </p>
                <button @click="register"  class="button">Get Started</button>
            </div>
        </div>
        <div class="filter">
            <ul>
                <li>
                    <h1>
                        Need help finding a community to join??
                    </h1>
                </li>
                <li>
                    <button @click=""  class="button">Click Here!</button>
                </li>
            </ul>

<!--            <button @click=""  class="button">Click Here!</button>-->
        </div>
        <div class="comms">
            <div class="popComms">
                <h1>Popular Communities</h1>
            </div>
            <vueper-slides
              class="no-shadow"
              :visible-slides="3"
              slide-multiple
              :gap="3"
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
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import moment from 'moment'
    const fb = require('../firebaseConfig.js')
    import { VueperSlides, VueperSlide } from 'vueperslides'
    import 'vueperslides/dist/vueperslides.css'

    export default {
        data() {
            return {
                post: {
                    content: ''
                },
                slides: [
                {
                  id: 'slide-0',
                  title: '<b style="font-size: 1.3em;color: ">Bellingham</b>',
                  content: 'This is the Bellingham community.'+
                   '<br><br><button @click="register"  class="button">View</button>'

                },
                {
                  id: 'slide-1',
                  title: '<b style="font-size: 1.3em;color: ">Everett</b>',
                  content: 'This is the Everett community.'+
                   '<br><br><button @click="register"  class="button">View</button>'
                },
                {
                  id: 'slide-2',
                  title: '<b style="font-size: 1.3em;color: ">Seattle</b>',
                  content: 'This is the Seattle community.'+
                   '<br><br><button @click="register"  class="button">View</button>'
                },
                 {
                  id: 'slide-3',
                  title: '<b style="font-size: 1.3em;color: ">Tacoma</b>',
                  content: 'This is the Tacoma community.'+
                   '<br><br><button @click="register"  class="button">View</button>'
                }
              ],
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
            ...mapState(['userProfile', 'currentUser', 'posts', 'hiddenPosts'])
        },
        methods: {
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
