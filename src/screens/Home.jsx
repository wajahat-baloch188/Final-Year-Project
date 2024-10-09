import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ImageBackground,
  Modal,
  Dimensions,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useImages} from '../context/imageContext';
import BottomNav from '../components/BottomNav';
import uploadImage from '../../images/upload-image.jpg';
import CameraModal from '../components/CameraModal';
import CustomCarousel from '../components/Carousel';

const {width, height} = Dimensions.get('window');

const Home = () => {
  const {images, setImages} = useImages();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
          'https://029b74c7-0ce2-43df-9c11-4f168103f222-00-21vq5jopmzgzd.sisko.replit.dev/predict',
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
        navigation.navigate('Result', {images, result});
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

  useEffect(() => {
    if (images.length > 0) {
      navigation.navigate('Home');
    }
  }, [images]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>

      <View style={styles.carouselContainer}>
        <CustomCarousel />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.imageBox} onPress={toggleModal}>
          {images.length === 0 ? (
            <ImageBackground
              source={uploadImage}
              style={styles.imageBackground}
              imageStyle={styles.image}>
              <Text style={styles.placeholderText}>Upload Image</Text>
            </ImageBackground>
          ) : (
            <Image
              source={{uri: images[0].uri}}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          {images.length > 0 && (
            <TouchableOpacity
              style={styles.crossBtn}
              onPress={handleClearImages}>
              <Text style={styles.crossText}>×</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleCheckPress}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Check</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent={true}
        animationType="none"
        visible={isModalVisible}
        onRequestClose={toggleModal}>
        <CameraModal
          isVisible={isModalVisible}
          onClose={toggleModal}
          onImageSelected={assets => {
            console.log(assets); // Handle selected images
          }}
        />
      </Modal>

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
    paddingVertical: height * 0.03,
    backgroundColor: '#FB2A84',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerText: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
  },
  carouselContainer: {
    height: height * 0.2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  imageBox: {
    width: '100%',
    height: height * 0.25,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: height * 0.02,
    elevation: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '90%',
    resizeMode: 'contain',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 10,
    borderRadius: 5,
  },
  crossBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FB2A84',
    borderRadius: 20,
    paddingHorizontal: 8,
  },
  crossText: {
    color: '#fff',
    fontSize: width * 0.06,
    marginTop: -2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  checkButton: {
    backgroundColor: '#FB2A84',
    paddingVertical: height * 0.02,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
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
