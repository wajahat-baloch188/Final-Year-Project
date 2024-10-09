import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import { useHistory } from '../context/historyContext';

const Result = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { images, result } = route.params;
  const { addHistory } = useHistory();

  useEffect(() => {
    if (images && result) {
      const date = new Date().toLocaleDateString(); // Get current date
      images.forEach((image) => {
        addHistory({
          uri: image.uri,
          result: result.result,
          confidence: result.confidence,
          future_risk: result.future_risk,
          date, // Add date to history
        });
      });
    }
  }, [images, result, addHistory]);

  return (
    <>
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
              source={{ uri: image.uri }}
            />
          ))}
        </View>

        <View style={styles.resultText}>
          <Text style={{ color: '#000', fontSize: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Prediction:</Text>{' '}
            {result.result === 'Healthy' ? 'Healthy' : 'Cancer'}
          </Text>
          <Text style={{ color: '#000', fontSize: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Probability:</Text>{' '}
            {(result.confidence).toFixed(2)}%
          </Text>
          <Text style={{ color: '#000', fontSize: 20 }}>
            <Text style={{ fontWeight: 'bold' }}>Future Risk:</Text>
            {result.result === 'Healthy' ? result.future_risk : result.result}
          </Text>
        </View>
      </ScrollView>

      <View>
        <BottomNav />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FB2A84',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    elevation: 50, // For Android shadow
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 5 }, // Shadow offset
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 10, // Shadow blur radius
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 20,
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

