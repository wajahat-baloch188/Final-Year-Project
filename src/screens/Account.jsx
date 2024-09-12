// import React, {useEffect, useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ScrollView,
//   SafeAreaView,
// } from 'react-native';
// import {useUser} from '../context/UserContext'; // Adjust path as needed
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import storage from '@react-native-firebase/storage';
// import {launchImageLibrary} from 'react-native-image-picker';
// import BottomNav from '../components/BottomNav'; // Adjust path as needed
// import {useNavigation} from '@react-navigation/native'; // Import useNavigation

// const Account = () => {
//   const {userData, updateUserData} = useUser();
//   const [avatarUri, setAvatarUri] = useState(userData?.avatarUri || null);
//   const navigation = useNavigation();

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(user => {
//       if (user) {
//         fetchUserData(user.uid);
//       } else {
//         // When user signs out, reset user data and navigate to SignIn screen
//         updateUserData(null);
//         navigation.navigate('SignIn');
//       }
//     });

//     return () => unsubscribe(); // Cleanup subscription on unmount
//   }, [updateUserData, navigation]);

//   const fetchUserData = async uid => {
//     try {
//       const userDoc = await firestore().collection('users').doc(uid).get();
//       if (userDoc.exists) {
//         const data = userDoc.data();
//         setAvatarUri(data.avatarUri || null);
//         updateUserData(data);
//       } else {
//         console.log('No user document found');
//       }
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await auth().signOut();
//       updateUserData(null); // Clear user data
//       navigation.navigate('SignIn'); // Navigate to SignIn screen
//     } catch (error) {
//       console.error('Error signing out:', error);
//       Alert.alert('Error', 'Failed to sign out');
//     }
//   };

//   const handleAvatarPick = async () => {
//     launchImageLibrary({mediaType: 'photo'}, async response => {
//       if (response.didCancel) return;
//       if (response.errorCode) {
//         Alert.alert('Image Picker Error', response.errorMessage);
//         return;
//       }

//       const {uri} = response.assets[0];
//       const fileName =
//         response.assets[0].fileName || `avatar_${Date.now()}.jpg`;

//       try {
//         const uploadUri = uri.replace('file://', '');
//         const storageRef = storage().ref(
//           `avatars/${auth().currentUser.uid}/${fileName}`,
//         );

//         const uploadTask = storageRef.putFile(uploadUri);

//         uploadTask.on(
//           'state_changed',
//           snapshot => {},
//           error => {
//             console.error('Upload Error:', error);
//             Alert.alert('Upload Error', error.message);
//           },
//           async () => {
//             try {
//               const downloadURL = await storageRef.getDownloadURL();
//               await firestore()
//                 .collection('users')
//                 .doc(auth().currentUser.uid)
//                 .update({avatarUri: downloadURL});
//               setAvatarUri(downloadURL);
//               updateUserData(prevData => ({
//                 ...prevData,
//                 avatarUri: downloadURL,
//               }));
//             } catch (error) {
//               console.error('Error updating user avatar URL:', error);
//               Alert.alert('Error', 'Failed to update avatar');
//             }
//           },
//         );
//       } catch (error) {
//         console.error('Error uploading image:', error);
//         Alert.alert('Error', 'Failed to upload image');
//       }
//     });
//   };

//   const handleNavigateToHistory = () => {
//     navigation.navigate('History');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Account</Text>
//       </View>
//       <ScrollView contentContainerStyle={styles.scrollView}>
//         <View style={styles.profileSection}>
//           <TouchableOpacity onPress={handleAvatarPick}>
//             <Image
//               source={
//                 avatarUri
//                   ? {uri: avatarUri}
//                   : require('../../images/default-avatar-profile.webp')
//               }
//               style={styles.avatar}
//             />
//           </TouchableOpacity>
//           <View>
//             <Text style={styles.username}>
//               Name:{' '}
//               {userData?.name ||
//                 userData?.fullName ||
//                 userData?.displayName ||
//                 'Loading...'}
//             </Text>
//             <Text style={styles.email}>
//               Email: {userData?.email || 'Loading...'}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={styles.checkButton}
//             onPress={handleNavigateToHistory}>
//             <Text style={styles.buttonText}>History</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//       <TouchableOpacity style={styles.button} onPress={handleSignOut}>
//         <Text style={styles.buttonText}>Sign Out</Text>
//       </TouchableOpacity>
//       <BottomNav style={styles.bottomNav} />
//     </SafeAreaView>
//   );
// };

// -----------new
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useUser } from '../context/UserContext';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import BottomNav from '../components/BottomNav';
import { useNavigation } from '@react-navigation/native';

const Account = () => {
  const { userData, updateUserData } = useUser();
  const [avatarUri, setAvatarUri] = useState(userData?.avatarUri || null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        if (!avatarUri) {
          fetchUserData(user.uid);
        }
      } else {
        updateUserData(null);
        navigation.navigate('SignIn');
      }
    });

    return () => unsubscribe();
  }, [updateUserData, navigation, avatarUri]);

  const fetchUserData = async uid => {
    try {
      const userDoc = await firestore().collection('users').doc(uid).get();
      if (userDoc.exists) {
        const data = userDoc.data();
        setAvatarUri(data.avatarUri || null);
        updateUserData(data);
      } else {
        console.log('No user document found');
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await auth().signOut();
      updateUserData(null);
      navigation.navigate('SignIn');
    } catch (error) {
      console.log('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarPick = async () => {
    launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Image Picker Error', response.errorMessage);
        return;
      }

      const { uri } = response.assets[0];
      const fileName = response.assets[0].fileName || `avatar_${Date.now()}.jpg`;

      try {
        setImageUploading(true);
        const uploadUri = uri.replace('file://', '');
        const storageRef = storage().ref(`avatars/${auth().currentUser.uid}/${fileName}`);
        await storageRef.putFile(uploadUri);
        const downloadURL = await storageRef.getDownloadURL();

        await firestore()
          .collection('users')
          .doc(auth().currentUser.uid)
          .update({ avatarUri: downloadURL });

        setAvatarUri(downloadURL);
        updateUserData(prevData => ({
          ...prevData,
          avatarUri: downloadURL,
        }));
        setImageUploading(false);
      } catch (error) {
        setImageUploading(false);
        console.log('Error uploading image:', error);
        Alert.alert('Error', 'Failed to upload image');
      }
    });
  };
console.log(userData)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Account</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={handleAvatarPick}>
            <View style={styles.avatar}>
              {imageUploading ? (
                <ActivityIndicator
                  size="large"
                  color="#FB2A84"
                  style={styles.activityIndicator}
                />
              ) : (
                <Image
                  source={
                    avatarUri
                      ? { uri: avatarUri }
                      : require('../../images/default-avatar-profile.webp')
                  }
                  style={styles.avatarImage}
                />
              )}
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.username}>
              Name: {userData?.fullName||userData?.name || userData?.displayName || 'Loading...'}
            </Text>
            <Text style={styles.email}>
              Email: {userData?.email || 'Loading...'}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={() => navigation.navigate('History')}>
            <Text style={styles.buttonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Out</Text>
        )}
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
    marginTop: 20,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
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
    padding: 18,
    backgroundColor: '#FB2A84',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    elevation: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  signOutButton: {
    position: 'absolute',
    bottom: 150,
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
  checkButton: {
    backgroundColor: '#FB2A84',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default Account;
