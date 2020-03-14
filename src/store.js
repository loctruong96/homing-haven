import Vue from 'vue'
import Vuex from 'vuex'
const fb = require('./firebaseConfig.js')

Vue.use(Vuex)

// handle page reload
fb.auth.onAuthStateChanged(user => {

    // if there exist a user the following information are fetched and monitor for the rest of the session.
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
    } else {
        // realtime updates from our posts collection
        fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {

            // add new posts to hiddenPosts array after initial load
            if (querySnapshot.docChanges().length !== querySnapshot.docs.length
                && querySnapshot.docChanges()[0].type == 'added') {

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
        currentSearch: null,
        communityProfile: {},
        currentResource: null,
        resourceProfile: {},
        userProfile: {},
        posts: [],
        hiddenPosts: [],
        popularCommunities: [],
        resourceTable: null,
        commTable: null,
        notFoundCom: false,
        notFoundRes: false,
        looking: false,
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
            commit('setResourceProfile', {});
            commit('setResourceTable', null);
            commit('setCommTable', null);
            commit('setCurrentSearch', null);
            commit('setLooking', false);
        },
        async fetchSearchResults({commit, state}){
            commit('setResourceTable', null);
            commit('setCommTable', null);
            const communityResults = await fb.communityCollection.where("link",">=", `${state.currentSearch}`);
            const resourceResults = await fb.resourceCollection.where("link",">=", `${state.currentSearch}`);
            communityResults.get().then(function (querySnapshot) {
                if(querySnapshot.size > 0){
                    state.commTable = [];
                    state.notFoundCom = false;
                } else {
                    state.commTable = null;
                    state.notFoundCom = true;
                }
                querySnapshot.forEach(function (doc) {
                        state.commTable.push({
                            community: doc.id,
                            date: Date.parse(doc.data().createdOn.toDate()),
                            name: doc.data().name,
                        })
                });
                resourceResults.get().then(function (querySnapshot) {
                    if(querySnapshot.size > 0){
                        state.resourceTable = [];
                        state.notFoundRes = false;
                    } else {
                        state.resourceTable = null;
                        state.notFoundRes = true;
                    }
                    querySnapshot.forEach(function (doc) {
                        state.resourceTable.push({
                            resource: doc.id,
                            name: doc.data().link,
                            date: Date.parse(doc.data().createdOn.toDate()),
                        })
                    });
                    state.looking = false;
                });
            });
        },
        fetchResourceProfile({commit, state}){
          fb.resourceCollection.doc(state.currentResource).get().then(res => {
              commit('setResourceProfile', res.data());
          }).catch(err => {
              console.log(err)
          })
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
            let popComm;
            fb.communityCollection.orderBy('subscribers','desc').limit(5).get().then(res => {
                popComm = (res.docs.map((doc)=>{
                    return doc.data();
                }));
            }).then(()=>{
                commit('setPopularCommunities', popComm);
            }).catch(err => {
                console.log(err)
            })
        },
        updateCommunityProfile({ commit, state}, data){
            let name = data.name;
            let communityState = data.state;
            let city = data.city;
            let country = data.country;
            let interests = data.interests;
            let link = data.link;
            let subscribers = data.subscribers;
            let createdOn = data.createdOn;
            let moderators = data.moderators;
            let rules = data.rules;
            let description = data.description;
            let owner = data.owner;
            fb.communityCollection.doc(state.currentCommunity).update({name, communityState, city, country,
                interests, link, subscribers, createdOn, moderators, rules, description, owner}).catch(err => {
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
            let communities = data.communities;

            fb.usersCollection.doc(state.currentUser.uid).update({ name, title, interests ,city, state: userState, country, communities }).then(user => {
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
        setLooking(state,val){
            if (val){
                state.looking = true;
            } else {
                state.looking = false;
            }
        },
        setCurrentSearch(state, val){
            if(val){
                state.currentSearch = val.toLowerCase();
            } else {
                state.currentSearch = val;
            }
        },
        setCommTable(state, val){
            state.commTable = val;
        },
        setResourceTable(state, val){
            state.resourceTable = val;
        },
        setResourceProfile(state, val){
            state.resourceProfile = val;
        },
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
