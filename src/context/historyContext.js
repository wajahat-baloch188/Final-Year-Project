import React, { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const userId = auth().currentUser.uid; // Get user ID dynamically
        const userHistoryRef = firestore().collection('users').doc(userId).collection('history');
        const snapshot = await userHistoryRef.get();
        const fetchedHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setHistory(fetchedHistory);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };

    fetchHistory();
  }, []);

  const addHistory = async (newItem) => {
    try {
      const userId = auth().currentUser.uid; // Get user ID dynamically
      const userHistoryRef = firestore().collection('users').doc(userId).collection('history');

      // Validate newItem to ensure no field is undefined
      const validatedItem = {
        uri: newItem.uri || '', // Default to empty string if undefined
        result: newItem.result || 'Unknown', // Default to 'Unknown' if undefined
        confidence: newItem.confidence || 0, // Default to 0 if undefined
        future_risk: newItem.future_risk || 'N/A', // Default to 'N/A' if undefined
        date: newItem.date || new Date().toISOString(), // Default to current date if undefined
      };

      // Check if the item already exists
      const exists = (await userHistoryRef.where('uri', '==', validatedItem.uri).get()).size > 0;

      if (!exists) {
        await userHistoryRef.add(validatedItem);
        setHistory(prevHistory => [...prevHistory, validatedItem]);
      }
    } catch (error) {
      console.error('Error adding history:', error);
    }
  };

  const clearHistory = async () => {
    try {
      const userId = auth().currentUser.uid; // Get user ID dynamically
      const userHistoryRef = firestore().collection('users').doc(userId).collection('history');
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
    <HistoryContext.Provider value={{ history, addHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
