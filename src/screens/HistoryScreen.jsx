import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import '@react-native-firebase/auth';
import '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import BottomNav from '../components/BottomNav';
import Icon from 'react-native-vector-icons/FontAwesome';

const DEFAULT_IMAGE = require('../../images/img.png'); // Correct path to default image

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigation = useNavigation();

  // Check authentication state on mount
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      console.log('Auth State Changed:', user); // Debug log to check the user object
      if (user) {
        setAuthenticated(true);
        setUserId(user.uid);
      } else {
        setAuthenticated(false);
        setUserId(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchHistory = async userId => {
    if (!userId) return; // Prevent fetching if userId is not available

    try {
      const snapshot = await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('history')
        .get();

      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(historyData);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  useEffect(() => {
    if (authenticated && userId) {
      fetchHistory(userId);
    }
  }, [authenticated, userId]);

  const handleDeleteHistoryItem = async id => {
    try {
      if (userId) {
        await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .collection('history')
          .doc(id)
          .delete();

        setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      if (userId) {
        const snapshot = await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .collection('history')
          .get();

        const batch = firebase.firestore().batch();
        snapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();

        setHistory([]);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FB2A84" />
      </View>
    );
  }

  if (!authenticated) {
    return (
      <View style={styles.noAuthContainer}>
        <Text style={styles.noAuthText}>
          You are not logged in. Please log in to view history.
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>&lt;</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>History</Text>
        <View style={styles.placeholder}></View>
      </View>
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          {history.length > 0 ? (
            history.map(item => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Image
                    source={{uri: item.uri || DEFAULT_IMAGE}}
                    style={styles.historyImage}
                    onError={err => {
                      console.log(err);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => handleDeleteHistoryItem(item.id)}
                    style={{overflow: 'hidden'}}>
                    <Text style={styles.deleteText}>×</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.historyText}>
                  Prediction: {item.result || 'Unknown'}
                </Text>
                <Text style={styles.historyText}>
                  Confidence: {(item.confidence || 0) * 100}%
                </Text>
                {item.result === 'Healthy' && (
                  <Text style={styles.historyText}>
                    Future Risk: {item.future_risk || 'N/A'}
                  </Text>
                )}
                <Text style={styles.historyText}>
                  Date: {item.date || 'No date available'}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noHistoryText}>No history available</Text>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClearHistory}>
          <Text style={styles.clearButtonText}>Clear History</Text>
        </TouchableOpacity>
        <BottomNav />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '15 10',
    justifyContent: 'space-between',
  },
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
    marginBottom:20,
  },
  headerText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  historyItem: {
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 9,
    backgroundColor: '#fff', // Ensure background color is set
    marginHorizontal: 10,
    marginVertical: 10,
  },
  
  historyItem: {
    padding: 15,
    backgroundColor: '#fff', // Required for elevation to work
    marginHorizontal: 10,
    marginVertical: 10,
    elevation: 20, // Adjust this value to change the shadow depth on Android
    shadowColor: '#ccc', // This can be optional for Android
    borderRadius:12,
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
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  deleteText: {
    color: '#FB2A84',
    fontWeight: 'bold',
    fontSize: 32,
 
  marginTop:-12,
  },
  historyText: {
    color: '#000',
    fontSize: 16,
  },
  noHistoryText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 18,
    marginTop: 20,
  },
  clearButton: {
    backgroundColor: '#FB2A84',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    marginBottom: 40,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAuthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAuthText: {
    fontSize: 18,
    color: '#888',
  },
});

export default HistoryScreen;
