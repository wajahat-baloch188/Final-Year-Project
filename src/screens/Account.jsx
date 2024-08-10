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
import {useUser} from '../context/UserContext'; // Adjust path as needed
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import BottomNav from '../components/BottomNav'; // Adjust path as needed
import {useNavigation} from '@react-navigation/native'; // Import useNavigation

const Account = () => {
  const {userData, updateUserData} = useUser();
  const [avatarUri, setAvatarUri] = useState(null);
  const navigation = useNavigation(); // Use the hook to get navigation object

  useEffect(() => {
    // Log userData to verify its structure
    console.log('User Data:', userData);

    if (userData) {
      setAvatarUri(userData.avatarUri);
    }
  }, [userData]);

  const handleSignOut = () => {
    const currentUser = auth().currentUser;

    if (currentUser) {
      auth()
        .signOut()
        .then(() => {
          navigation.navigate('SignIn');
        })
        .catch(error => {
          console.error('Error signing out:', error);
          Alert.alert('Error', 'Failed to sign out');
        });
    } else {
      Alert.alert('Sign Out Error', 'No user currently signed in');
    }
  };

  const handleAvatarPick = async () => {
    launchImageLibrary({mediaType: 'photo'}, async response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Image Picker Error', response.errorMessage);
        return;
      }

      const {uri} = response.assets[0];
      const fileName =
        response.assets[0].fileName || `avatar_${Date.now()}.jpg`;

      try {
        const uploadUri = uri.replace('file://', '');
        const storageRef = storage().ref(
          `avatars/${auth().currentUser.uid}/${fileName}`,
        );
        console.log(
          'Uploading file to:',
          `avatars/${auth().currentUser.uid}/${fileName}`,
        );

        const uploadTask = storageRef.putFile(uploadUri);

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
              const downloadURL = await storageRef.getDownloadURL();
              console.log('Download URL:', downloadURL);

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

  const handleNavigateToHistory = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Account</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleAvatarPick}>
            <Image
              source={
                avatarUri
                  ? {uri: avatarUri}
                  : require('../../images/default-avatar-profile.webp')
              }
              style={styles.avatar}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.username}>
              Name: {userData?.name || userData?.fullname || 'Loading...'}
            </Text>
            <Text style={styles.email}>
              Email: {userData?.email || 'Loading...'}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleNavigateToHistory}>
            <Text style={styles.buttonText}>History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
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
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  buttonContainer: {
    alignItems: 'center',  // Center horizontally
    marginVertical: 20,    // Add some vertical margin if needed
  },
  checkButton: {
    backgroundColor: '#FB2A84',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%', // Adjust width as needed
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
    shadowOffset: { width: 0, height: 2 },
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
  header: {
    padding: 15,
    backgroundColor: '#FB2A84',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  button: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    padding: 15,
    backgroundColor: '#FB2A84',
    borderRadius: 5,
    alignItems: 'center',
    zIndex: 2,
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
