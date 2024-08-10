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

const DEFAULT_IMAGE = require('../../images/img.png'); // Correct path to default image

const HistoryScreen = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = firebase.auth().currentUser.uid; // Ensure user is authenticated and get user ID
        const snapshot = await firebase
          .firestore()
          .collection('users')
          .doc(userId)
          .collection('history')
          .get();

        const historyData = snapshot.docs.map(doc => ({
          id: doc.id, // Include document ID
          ...doc.data(),
        }));
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDeleteHistoryItem = async id => {
    try {
      const userId = firebase.auth().currentUser.uid;
      await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('history')
        .doc(id)
        .delete();

      // Update local state to remove deleted item
      setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      const userId = firebase.auth().currentUser.uid;
      await firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .collection('history')
        .get()
        .then(snapshot => {
          const batch = firebase.firestore().batch();
          snapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
          });
          return batch.commit();
        });

      setHistory([]);
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
                    onError={() => {}}
                  />
                  <TouchableOpacity
                    onPress={() => handleDeleteHistoryItem(item.id)}>
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
        <TouchableOpacity style={styles.clearButton} onPress={handleClearHistory}>
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
    padding: 15,
    justifyContent: 'space-between',
  },
  header: {
    backgroundColor: '#FB2A84',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
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
    alignSelf: 'center', // Centers the button horizontally
    width: '90%', // Set width as a percentage to center horizontally
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
});

export default HistoryScreen;
