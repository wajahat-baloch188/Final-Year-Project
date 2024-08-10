import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useImages } from '../context/imageContext';
import BottomNav from '../components/BottomNav';
import uploadImage from '../../images/upload-image.jpg';

const Home = () => {
  const { images, setImages } = useImages();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleCheckPress = async () => {
    if (images.length > 0) {
      setLoading(true);
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
        setLoading(false);
        navigation.navigate('Result', { images, result });
      } catch (error) {
        setLoading(false);
        Alert.alert('Error', 'Failed to get prediction');
      }
    } else {
      Alert.alert('No Images Selected', 'Please select images');
    }
  };

  const handleClearImages = () => {
    setImages([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.imageBox}>
          {images.length === 0 ? (
            <ImageBackground
              source={uploadImage}
              style={styles.imageBackground}
              imageStyle={styles.image}
            >
              <Text style={styles.placeholderText}>Upload Image</Text>
            </ImageBackground>
          ) : (
            <Image
              source={{ uri: images[0].uri }}
              style={styles.image}
            />
          )}

          {images.length > 0 && (
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={handleClearImages}
            >
              <Text style={styles.crossText}>×</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleCheckPress}
            disabled={loading}
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
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingVertical: 15,
    backgroundColor: '#FB2A84',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageBox: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 20,
    elevation: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent background for better text visibility
    padding: 10,
    borderRadius: 5,
  },
  crossBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FB2A84',
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  crossText: {
    color: '#fff',
    fontSize: 24,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center', // Center horizontally
    marginVertical: 20,
  },
  checkButton: {
    backgroundColor: '#FB2A84',
    paddingVertical: 15,
    borderRadius: 10,
    width: '80%', // Adjust width as needed
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
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
