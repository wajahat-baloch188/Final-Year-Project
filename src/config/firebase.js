// firebase.js

import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBKIHB4ZO8fnh7uCQReIQt9KDBUAVlgrqU",
  authDomain: "breast-cancer-detection-53741.firebaseapp.com",
  projectId: "breast-cancer-detection-53741",
  storageBucket: "breast-cancer-detection-53741.appspot.com",
  messagingSenderId: "483084569239",
  appId: "1:483084569239:android:e1ef51652c81e02c9577d2",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
