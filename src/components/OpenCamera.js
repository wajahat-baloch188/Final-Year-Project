import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const OpenCamera = () => {
  const [images, setImages] = useState([]);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleCamera = async () => {
    await requestCameraPermission();
    const result = await launchCamera({ mediaType: 'photo', quality: 1 });
    if (result.assets) {
      setImages(prevImages => [...prevImages, ...result.assets]);
    }
  };

  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
      selectionLimit: 0,
    });
    if (result.assets) {
      setImages(prevImages => [...prevImages, ...result.assets]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imgBox}>
        {images.map((image, index) => (
          <Image
            key={index}
            resizeMode="contain"
            style={styles.img}
            source={{ uri: image.uri }}
          />
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.btn} onPress={handleCamera}>
          <Text style={styles.textBtn}>Open Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={handleGallery}>
          <Text style={styles.textBtn}>Open Gallery</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default OpenCamera;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
  },
  imgBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center images horizontally
  },
  img: {
    width: 150,
    height: 150,
    margin: 5, // Space between images
    borderWidth: 1,
    borderColor: '#ccc', // Border color
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10, // Space above buttons
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 40,
    borderRadius: 10,
    borderColor: '#FB2A84',
    borderWidth: 1,
    marginBottom: 10,
  },
  textBtn: {
    color: 'black',
  },
});
