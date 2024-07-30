import React, {useState, useEffect} from 'react';
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const OpenCamera = ({updateImages}) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    updateImages(images);
  }, [images]);

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
    const result = await launchCamera({mediaType: 'photo', quality: 1});
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

  const handleDeleteImage = index => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imgBox}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              resizeMode="contain"
              style={styles.img}
              source={{uri: image.uri}}
            />

            <TouchableOpacity
              style={styles.deleteIcon}
              onPress={() => handleDeleteImage(index)}>
              <Text style={styles.deleteIconText}>✖</Text>
              {/* <Icon name="close" size={20} color="#FB2A84" /> */}
            </TouchableOpacity>
          </View>
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
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center contents vertically
  },
  imgBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    margin: 5, // Space between images
  },
  img: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc', // Border color
  },
  deleteIcon: {
    position: 'absolute',
    height: 30,
    width: 30,
    top: -5,
    fontSize: 6,
    right: -5,

    backgroundColor: '#010101',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIconText: {
    color: '#FFFFFF',
    fontSize: 10,
   
    fontWeight: 'bold',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center', // Center buttons vertically
    marginTop: 10,
    marginBottom: 90,
  },
  btn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#FB2A84',
    borderWidth: 1,
    marginBottom: 10,
    borderColor: '#FFFFFF',
  },
  textBtn: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
