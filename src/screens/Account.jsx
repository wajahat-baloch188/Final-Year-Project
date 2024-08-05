import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

const Account = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();
          const userData = userDoc.data();
          if (userData) {
            setUsername(userData.fullName);
            setEmail(userData.email);
            if (userData.avatarUri) {
              setAvatarUri(userData.avatarUri);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('SignIn');
      })
      .catch(error => {
        console.error('Error signing out:', error);
        Alert.alert('Error', 'Failed to sign out');
      });
  };

  const handleAvatarPick = async () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) return;

      if (response.errorCode) {
        Alert.alert('Image Picker Error', response.errorMessage);
        return;
      }

      const {uri, fileName} = response.assets[0];

      try {
        const uploadUri = uri;
        const uploadTask = storage()
          .ref(`avatars/${fileName}`)
          .putFile(uploadUri);

        uploadTask.on(
          'state_changed',
          snapshot => {
            // Optional: handle progress
          },
          error => {
            console.error('Upload Error:', error);
            Alert.alert('Upload Error', error.message);
          },
          async () => {
            try {
              const downloadURL =
                await uploadTask.snapshot.ref.getDownloadURL();
              await firestore()
                .collection('users')
                .doc(auth().currentUser.uid)
                .update({avatarUri: downloadURL});
              setAvatarUri(downloadURL);
            } catch (error) {
              console.error('Error updating user avatar URL:', error);
              Alert.alert('Error', 'Failed to update avatar');
            }
          },
        );
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image');
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleAvatarPick}>
        <Image
          source={
            avatarUri
              ? {uri: avatarUri}
              : require('../../images/default-avatar-profile.webp') // Add a default avatar image in your project
          }
          style={styles.avatar}
        />
      </TouchableOpacity>
      <Text style={styles.label}>Username</Text>
      <Text style={styles.value}>{username}</Text>
      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{email}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#FB2A84',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Account;
