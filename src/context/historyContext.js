import React, {createContext, useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({children}) => {
  const [history, setHistory] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setAuthenticated(true);
        fetchHistory(user.uid);
      } else {
        setAuthenticated(false);
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchHistory = async userId => {
    try {
      const userHistoryRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('history');
      const snapshot = await userHistoryRef.get();
      const fetchedHistory = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(fetchedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const addHistory = async newItem => {
    if (!authenticated) return; // Prevent adding history if not authenticated

    try {
      const userId = auth().currentUser.uid; // Get user ID dynamically
      const userHistoryRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('history');

      const validatedItem = {
        uri: newItem.uri || '',
        result: newItem.result || 'Unknown',
        confidence: newItem.confidence || 0,
        future_risk: newItem.future_risk || 'N/A',
        date: newItem.date || new Date().toISOString(),
      };

      const exists =
        (await userHistoryRef.where('uri', '==', validatedItem.uri).get())
          .size > 0;

      if (!exists) {
        await userHistoryRef.add(validatedItem);
        setHistory(prevHistory => [...prevHistory, validatedItem]);
      }
    } catch (error) {
      console.error('Error adding history:', error);
    }
  };

  const clearHistory = async () => {
    if (!authenticated) return; // Prevent clearing history if not authenticated

    try {
      const userId = auth().currentUser.uid;
      const userHistoryRef = firestore()
        .collection('users')
        .doc(userId)
        .collection('history');
      const snapshot = await userHistoryRef.get();
      const batch = firestore().batch();
      snapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      setHistory([]);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <HistoryContext.Provider value={{history, addHistory, clearHistory}}>
      {children}
    </HistoryContext.Provider>
  );
};
