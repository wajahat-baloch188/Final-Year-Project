import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {images} = route.params;

  return (
    <ScrollView>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Result</Text>
        <View style={styles.placeholder}></View>
      </View>

      <View style={styles.imgBox}>
        {images.map((image, index) => (
          <Image
            key={index}
            resizeMode="contain"
            style={styles.img}
            source={{uri: image.uri}}
          />
        ))}
      </View>

      <View style={styles.resultText}>
        <Text style={{color: '#000', fontSize: 20}}>
          <Text style={{fontWeight: 'bold'}}>Prediction:</Text> Cancer
        </Text>
        <Text style={{color: '#000', fontSize: 20}}>
          <Text style={{fontWeight: 'bold'}}>Probability:</Text> 5%
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FB2A84',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 20,
    // fontSize:30,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FB2A84',
    marginTop: -4,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  placeholder: {
    width: 40,
  },
  imgBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  img: {
    width: 150,
    height: 150,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resultText: {
    paddingHorizontal: 25,
    gap: 10,
  },
});

export default Result;

// -----------------

// import React from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';

// const Result = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { images, results } = route.params;

//   return (
//     <ScrollView>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.navigate('Home')}
//         >
//           <Text style={styles.buttonText}>&lt;</Text>
//         </TouchableOpacity>
//         <Text style={styles.headerText}>Result</Text>
//         <View style={styles.placeholder}></View>
//       </View>

//       <View style={styles.imgBox}>
//         {images.map((image, index) => (
//           <View key={index} style={styles.resultItem}>
//             <Image
//               resizeMode="contain"
//               style={styles.img}
//               source={{ uri: image.uri }}
//             />
//             <Text style={styles.resultText}>
//               <Text style={{ fontWeight: 'bold' }}>Prediction:</Text> {results[index].overall_diagnosis}
//             </Text>
//             {Object.entries(results[index].predictions).map(([model, prediction]) => (
//               <Text key={model} style={styles.resultText}>
//                 <Text style={{ fontWeight: 'bold' }}>{model}:</Text> {prediction.diagnosis} ({(prediction.probability * 100).toFixed(2)}%)
//               </Text>
//             ))}
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   header: {
//     backgroundColor: '#FB2A84',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     justifyContent: 'space-between',
//     paddingHorizontal: 15,
//   },
//   backButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: 32,
//     height: 32,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//   },
//   buttonText: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#FB2A84',
//     marginTop: -4,
//   },
//   headerText: {
//     fontSize: 20,
//     color: '#fff',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     flex: 1,
//   },
//   placeholder: {
//     width: 40,
//   },
//   imgBox: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     marginVertical: 20,
//   },
//   img: {
//     width: 150,
//     height: 150,
//     margin: 5,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   resultText: {
//     color: '#000',
//     fontSize: 16,
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//   },
//   resultItem: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
// });

// export default Result;
