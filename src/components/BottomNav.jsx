import React, {useState} from 'react';
import {View, StyleSheet, Image, Modal} from 'react-native';
import home from '../../images/home.png';
import camera from '../../images/camera.png';
import user from '../../images/user.png';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import CameraModal from './CameraModal'; // Adjust path as needed

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
        <Image source={camera} style={styles.icon1} />
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
    height: 70,
    width: '90%',
    borderRadius: 10,
    marginHorizontal: '5%',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    marginHorizontal: 5,
  },
  icon1: {
    width: 35,
    height: 35,
    tintColor: '#fff',
    marginHorizontal: 5,
  },
});

export default BottomNav;
