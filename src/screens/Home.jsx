import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useImages} from '../context/imageContext';
import BottomNav from '../components/BottomNav';

const Home = () => {
  const {images} = useImages();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false); // State to manage loading

  const handleCheckPress = async () => {
    if (images.length > 0) {
      setLoading(true); // Show loading indicator
      try {
        const formData = new FormData();
        images.forEach((image, index) => {
          formData.append('file', {
            uri: image.uri,
            name: `image_${index}.jpg`,
            type: 'image/jpeg',
          });
        });

        const response = await fetch(
          'https://1edb0715-fe6a-44a7-b0aa-fac0eb503fa7-00-28yl5ky0prdtx.pike.replit.dev:8000/predict',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          },
        );

        const result = await response.json();
        setLoading(false); // Hide loading indicator
        navigation.navigate('Result', {images, result});
      } catch (error) {
        setLoading(false); // Hide loading indicator
        Alert.alert('Error', 'Failed to get prediction');
      }
    } else {
      Alert.alert('No Images Selected', 'Please select images');
    }
  };

  // useEffect(()=>{
  //   handleCheckPress()
  // }, [images])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.imageBox}>
          {images.length > 0 && (
            <Image source={{uri: images[0].uri}} style={styles.image} />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={handleCheckPress}
            disabled={loading} // Disable button when loading
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Check</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <BottomNav style={styles.bottomNav} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    marginTop: 60,
    justifyContent: 'space-between',
  },
  imageBox: {
    height: '40%',
    width: '90%',
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 30,
    borderColor: 'grey',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Ensures the image stays within the box
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensures the image covers the box
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  bottomButton: {
    backgroundColor: '#FB2A84',
    padding: 10,
    borderRadius: 10,
    paddingVertical: 14,
    width: '50%',
    alignItems: 'center',
    flexDirection: 'row', // To center the ActivityIndicator and Text
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Home;
