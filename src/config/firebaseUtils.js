// firebaseUtils.js

import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export const uploadImage = async (uri, path) => {
  const reference = storage().ref(path);
  await reference.putFile(uri);
  return reference.getDownloadURL();
};

export const saveImageToFirestore = async (uri) => {
  const imageUrl = await uploadImage(uri, `images/${Date.now()}`);
  await firestore().collection('images').add({
    uri: imageUrl,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });
};
