
const firebase = require('firebase/app');
require ('firebase/firestore');
require ('firebase/analytics');
require ('firebase/auth');
require ('firebase/firestore');
const config = require('../config')['firebase-api'];

firebase.initializeApp(config);
firebase.analytics();

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

// date issue fix according to firebase
const settings = {
  // timestampsInSnapshots: true
};
db.settings(settings);

// firebase collections
const usersCollection = db.collection('users');
const postsCollection = db.collection('posts');
const commentsCollection = db.collection('comments');
const likesCollection = db.collection('likes');
const communityCollection = db.collection('communities');
const resourceCollection = db.collection('resources');
const countryCollection = db.collection('countries');
export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  communityCollection,
  resourceCollection,
  countryCollection
};
