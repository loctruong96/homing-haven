import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {
    // if there exist a user the following information are fetched and monitor for the rest of the session.
    store.dispatch('fetchPopularCommunities');
    if (user) {
        store.commit('setCurrentUser', user);
        store.dispatch('fetchUserProfile');

        fb.usersCollection.doc(user.uid).onSnapshot(doc => {
            store.commit('setUserProfile', doc.data())
        });

        // realtime updates from our posts collection
        fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
            // check if created by currentUser
            let createdByCurrentUser
            if (querySnapshot.docs.length) {
                createdByCurrentUser = store.state.currentUser.uid == querySnapshot.docChanges()[0].doc.data().userId ? true : false
            }

            // add new posts to hiddenPosts array after initial load
            if (querySnapshot.docChanges().length !== querySnapshot.docs.length
                && querySnapshot.docChanges()[0].type == 'added' && !createdByCurrentUser) {

                let post = querySnapshot.docChanges()[0].doc.data()
                post.id = querySnapshot.docChanges()[0].doc.id

                store.commit('setHiddenPosts', post)
            } else {
                let postsArray = []

                querySnapshot.forEach(doc => {
                    let post = doc.data()
                    post.id = doc.id
                    postsArray.push(post)
                })

                store.commit('setPosts', postsArray)
            }
        })
    }
});

export const store = new Vuex.Store({
    state: {
        currentUser: null,
        currentCommunity: null,
        communityProfile: {},
        currentResource: null,
        userProfile: {},
        posts: [],
        hiddenPosts: [],
        popularCommunities: []
    },
    actions: {
        clearData({ commit }) {
            commit('setCurrentUser', null);
            commit('setCurrentCommunity', null);
            commit('setCommunityProfile', {});
            commit('setCurrentResource', null);
            commit('setUserProfile', {});
            commit('setPosts', null);
            commit('setHiddenPosts', null);
            commit('setPopularCommunities', []);
        },
        fetchUserProfile({ commit, state }) {
            fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
                commit('setUserProfile', res.data());
            }).catch(err => {
                console.log(err)
            })
        },
        fetchCommunityProfile({commit, state}) {
            fb.communityCollection.doc(state.currentCommunity).get().then(res => {
                commit('setCommunityProfile', res.data());
            }).catch(err => {
                console.log(err);
                commit('setCurrentCommunity', null);
            })
        }
        ,
        fetchPopularCommunities({commit, state}){
            fb.communityCollection.orderBy('subscribers','desc').limit(5).get().then(res => {
                const popComm = (res.docs.map((doc)=>{
                    return doc.data();
                }));
                commit('setPopularCommunities', popComm);
            }).catch(err => {
                console.log(err)
            })
        },
        updateProfile({ commit, state }, data) {
            let name = data.name;
            let title = data.title;
            let city = data.city;
            let userState = data.state;
            let country = data.country;
            let interests = data.interests;

            fb.usersCollection.doc(state.currentUser.uid).update({ name, title, interests ,city, state: userState, country }).then(user => {
                // update all posts by user to reflect new name
                fb.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.postsCollection.doc(doc.id).update({
                            userName: name
                        })
                    })
                });
                // update all comments by user to reflect new name
                fb.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
                    docs.forEach(doc => {
                        fb.commentsCollection.doc(doc.id).update({
                            userName: name
                        })
                    })
                })
            }).catch(err => {
                console.log(err)
            })
        }
    },
    mutations: {
        setCurrentUser(state, val) {
            state.currentUser = val
        },
        setCurrentCommunity(state, val){
            state.currentCommunity = val
        },
        setPopularCommunities(state, val){
            state.popularCommunities = val
        }
        ,
        setCommunityProfile(state, val){
            state.communityProfile = val
        },
        setCurrentResource(state, val){
          state.currentResource = val
        },
        setUserProfile(state, val) {
            state.userProfile = val
        },
        setPosts(state, val) {
            if (val) {
                state.posts = val
            } else {
                state.posts = []
            }
        },
        setHiddenPosts(state, val) {
            if (val) {
                // make sure not to add duplicates
                if (!state.hiddenPosts.some(x => x.id === val.id)) {
                    state.hiddenPosts.unshift(val)
                }
            } else {
                state.hiddenPosts = []
            }
        }
    }
})
