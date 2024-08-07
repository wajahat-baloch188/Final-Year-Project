// import React, {useState, useEffect} from 'react';
// import {
//   Modal,
//   View,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Text,
//   Platform,
//   Alert,
//   ScrollView,
// } from 'react-native';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import cameraIcon from '../../images/camera.png'; // Update path as needed
// import galleryIcon from '../../images/image-gallery.png'; // Update path as needed
// import {PermissionsAndroid} from 'react-native';

// const CameraModal = ({isVisible, onClose, onImageSelected}) => {
//   const [images, setImages] = useState([]);

//   useEffect(() => {
//     if (images.length > 0) {
//       onImageSelected(images);
//       onClose(); // Close the modal after selecting images
//     }
//   }, [images]);

//   const requestCameraPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Camera Permission',
//             message: 'App needs camera permission',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           console.log('Camera permission granted');
//         } else {
//           console.log('Camera permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   };

//   const handleCamera = async () => {
//     await requestCameraPermission();
//     const result = await launchCamera({mediaType: 'photo', quality: 1});
//     if (!result.didCancel && result.assets) {
//       setImages(prevImages => [...prevImages, ...result.assets]);
//     }
//   };

//   const handleGallery = async () => {
//     try {
//       const result = await launchImageLibrary({mediaType: 'photo', quality: 1});
//       if (!result.didCancel && result.assets) {
//         setImages(prevImages => [...prevImages, ...result.assets]);
//       }
//     } catch (error) {
//       console.error('Error opening gallery:', error);
//       Alert.alert('Error', 'Unable to open gallery. Please check permissions.');
//     }
//   };

//   const handleDeleteImage = index => {
//     setImages(images.filter((_, i) => i !== index));
//   };

//   return (
//     <Modal animationType="slide" transparent={true} visible={isVisible}>
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
         
//           <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.modalButton} onPress={handleCamera}>
//               <Image source={cameraIcon} style={styles.icon} />
//               <Text style={styles.buttonText}>Camera</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.modalButton}
//               onPress={handleGallery}>
//               <Image source={galleryIcon} style={styles.icon} />
//               <Text style={styles.buttonText}>Gallery</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background
//   },
//   modalContent: {
//     height: 300, // Adjusted height
//     width: 350,
//     padding: 20,
//     backgroundColor: '#fff',
//     borderRadius: 15,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//     flexDirection: 'column',
//     alignItems: 'center', // Center content horizontally
//   },
//   imageContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignItems: 'center', // Center images vertically
//   },
//   imageWrapper: {
//     position: 'relative',
//     margin: 5,
//   },
//   image: {
//     width: 150,
//     height: 150,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },

//   buttonContainer: {
//     flexDirection: 'row', // Align buttons in a row
//     justifyContent: 'space-around',
//     width: '100%', // Ensure buttons use full width of modal content
//     marginTop: "25%",
//   },
//   modalButton: {
//     width: 100,
//     height: 100,
//     backgroundColor: '#fff',
//     borderRadius: 50,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 3,
//   },
//   icon: {
//     width: 60,
//     height: 60,
//   },
//   buttonText: {
//     marginTop: 5,
//     fontSize: 14,
//     color: '#000',
//   },
//   cancelButton: {
//     width: '90%',
//     padding: 15,
//     backgroundColor: '#FB2A84',
//     borderRadius: 10,
//     borderColor: '#ddd',
//     alignItems: 'center',
//     marginVertical: 10,
//     elevation: 3,
//   },
//   cancelButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default CameraModal;


// ----------------
import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  Platform,
  Alert,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import cameraIcon from '../../images/camera.png';
import galleryIcon from '../../images/image-gallery.png';
import { PermissionsAndroid } from 'react-native';
import { useImages } from '../context/imageContext';

const CameraModal = ({ isVisible, onClose }) => {
  const { setImages } = useImages();

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
          }
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
    if (!result.didCancel && result.assets) {
      const assets = Array.isArray(result.assets) ? result.assets : [result.assets];
      setImages(assets);
      onClose(); // Close the modal after selecting images
    }
  };

  const handleGallery = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 1 });
      if (!result.didCancel && result.assets) {
        const assets = Array.isArray(result.assets) ? result.assets : [result.assets];
        setImages(assets);
        onClose(); // Close the modal after selecting images
      }
    } catch (error) {
      console.error('Error opening gallery:', error);
      Alert.alert('Error', 'Unable to open gallery. Please check permissions.');
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.modalButton} onPress={handleCamera}>
              <Image source={cameraIcon} style={styles.icon} />
              <Text style={styles.buttonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleGallery}>
              <Image source={galleryIcon} style={styles.icon} />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    height: 330,
    width: 350,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: '25%',
  },
  modalButton: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  icon: {
    width: 60,
    height: 60,
  },
  buttonText: {
    marginTop: 5,
    fontSize: 14,
    color: '#000',
  },
  cancelButton: {
    width: '90%',
    padding: 15,

    backgroundColor: '#FB2A84',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 50,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CameraModal;
