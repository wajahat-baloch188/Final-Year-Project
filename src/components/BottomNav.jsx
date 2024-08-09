import React, { useState } from 'react';
import { View, StyleSheet, Image, Modal, Dimensions } from 'react-native';
import home from '../../images/home.png';
import camera from '../../images/camera.png';
import user from '../../images/user.png';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CameraModal from './CameraModal'; // Adjust path as needed

const { width, height } = Dimensions.get('window');

const BottomNav = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={home} style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleModal}>
        <View style={styles.cameraIcon}>
          <Image source={camera} style={styles.icon1} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <Image source={user} style={styles.icon} />
      </TouchableOpacity>

      {/* CameraModal */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FB2A84',
    height: height * 0.08, // Adjust height based on screen height
    width: '90%',
    borderRadius: 10,
    marginHorizontal: '5%',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
  icon: {
    width: width * 0.07, // Adjust width based on screen width
    height: width * 0.07, // Keep aspect ratio 1:1
    tintColor: '#fff',
    marginHorizontal: 5,
  },
  icon1: {
    width: width * 0.15, // Adjust width based on screen width
    height: width * 0.15, // Keep aspect ratio 1:1
    // tintColor: '#fff',
    marginHorizontal: 5,
    tintColor: "#FB2A84",
  },
  cameraIcon: {
    height: width * 0.22, // Adjust height based on screen width
    width: width * 0.22, // Keep aspect ratio 1:1
    borderRadius: (width * 0.23) / 2, // Half of width/height to make it circular
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -height * 0.032, // Adjust this value to move the icon up or down
    margin:3,
  }
});

export default BottomNav;
