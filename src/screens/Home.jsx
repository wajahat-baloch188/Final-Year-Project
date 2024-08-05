import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Home = () => {
  const [images, setImages] = useState([]);
  const [username, setUsername] = useState('');
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    const fetchUsername = async () => {
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
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    if (route.params?.images) {
      setImages(route.params.images);
    }
  }, [route.params?.images]);

  const handleCheckPress = () => {
    if (images.length > 0) {
      navigation.navigate('Result', {images});
    } else {
      Alert.alert('No Images Selected', 'Please select images');
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      <ScrollView>
        <Text style={styles.welcomeText}>Welcome, {username}</Text>
        {images.map((image, index) => (
          <Image key={index} source={{uri: image.uri}} style={styles.image} />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={{backgroundColor: 'red', padding: 20}}
        onPress={() => navigation.navigate('Account')}>
        <Text style={{color: '#000'}}>Account</Text>
      </TouchableOpacity>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={handleCheckPress}>
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  welcomeText: {
    textAlign: 'center',
    fontSize: 18,
    margin: 20,
  },
  bottomButton: {
    backgroundColor: '#007bff',
    padding: 10,
    margin: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

export default Home;

// ---------------------

// import React, {useState} from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import OpenCamera from '../components/OpenCamera';
// import {useNavigation} from '@react-navigation/native';

// const Home = () => {
//   const [images, setImages] = useState([]);
//   const navigation = useNavigation();

//   const handleUpdateImages = newImages => {
//     setImages(newImages);
//   };

//   const handleCheckPress = async () => {
//     if (images.length > 0) {
//       try {
//         const predictions = await sendImagesForPrediction(images);
//         navigation.navigate('Result', {images, results: predictions});
//       } catch (error) {
//         Alert.alert('Error', 'Failed to get predictions');
//       }
//     } else {
//       Alert.alert('No Images Selected', 'Please select images');
//     }
//   };

//   const sendImagesForPrediction = async images => {
//     const formData = new FormData();
//     images.forEach((image, index) => {
//       formData.append('files', {
//         uri: image.uri,
//         name: `image_${index}.jpg`,
//         type: 'image/jpeg',
//       });
//     });

//     try {
//       const response = await fetch('http://127.0.0.1:8000/predict', {
//         // Use 10.0.2.2 for Android emulator
//         // Use your machine's IP address if running on a real device or different machine
//         method: 'POST',
//         body: formData,
//       });
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const result = await response.json();
//       return result;
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw new Error('Failed to upload image');
//     }
//   };

//   return (
//     <>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Home</Text>
//       </View>
//       <ScrollView>
//         <OpenCamera updateImages={handleUpdateImages} />
//       </ScrollView>

//       <View style={{justifyContent: 'center', alignItems: 'center'}}>
//         <TouchableOpacity
//           style={styles.bottomButton}
//           onPress={handleCheckPress}>
//           <Text style={styles.buttonText}>Check</Text>
//         </TouchableOpacity>
//       </View>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: '#FB2A84',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 10,
//   },
//   headerText: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   bottomButton: {
//     position: 'absolute',
//     bottom: 15,
//     borderRadius: 10,
//     width: '90%',
//     backgroundColor: '#FB2A84',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 15,
//   },
//   buttonText: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//   },
// });

// export default Home;
