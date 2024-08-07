import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import BottomNav from '../components/BottomNav';

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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileSection}>
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
          <Text style={styles.username}>{username}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNav style={styles.bottomNav} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80, // Adjust padding to avoid overlap with BottomNav
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
  },
  button: {
    padding: 15,
    backgroundColor: '#FB2A84',
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 5,
  },
});

export default Account;
