// authUtils.js

import auth from '@react-native-firebase/auth';

export const signIn = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw new Error('Failed to sign in');
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    throw new Error('Failed to sign out');
  }
};
