// import React, { useState } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
// import OpenCamera from '../components/OpenCamera';
// import { useNavigation } from '@react-navigation/native';

// const Home = () => {
//   const [images, setImages] = useState([]);
//   const navigation = useNavigation();

//   const handleUpdateImages = (newImages) => {
//     setImages(newImages); // Update the state with the new images array
//   };

//   const handleCheckPress = () => {
//     if (images.length > 0) {
//       navigation.navigate('Result', { images });
//     } else {
//       Alert.alert('No Images Selected', 'Please select images');
//     }
//   };

//   return (
//     <>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Home</Text>
//       </View>
//       <OpenCamera updateImages={handleUpdateImages} />

//       <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//         <TouchableOpacity style={styles.bottomButton} onPress={handleCheckPress}>
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

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import OpenCamera from '../components/OpenCamera';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const [images, setImages] = useState([]);
  const navigation = useNavigation();

  const handleUpdateImages = (newImages) => {
    setImages(newImages); // Update the state with the new images array
  };

  const handleCheckPress = () => {
    if (images.length > 0) {
      navigation.navigate('Result', { images });
    } else {
      Alert.alert('No Images Selected', 'Please select images');
    }
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      <OpenCamera updateImages={handleUpdateImages} />

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={styles.bottomButton} onPress={handleCheckPress}>
          <Text style={styles.buttonText}>Check</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FB2A84',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomButton: {
    position: 'absolute',
    bottom: 15,
    borderRadius: 10,
    width: '90%',
    backgroundColor: '#FB2A84',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Home;
