import React, { createContext, useContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check AsyncStorage for existing user data
        const storedData = await AsyncStorage.getItem('userData');
        if (storedData) {
          setUserData(JSON.parse(storedData));
        } else {
          // Fetch user data from Firestore if not in AsyncStorage
          const user = auth().currentUser;
          if (user) {
            const userDoc = await firestore().collection('users').doc(user.uid).get();
            if (userDoc.exists) {
              const data = userDoc.data();
              setUserData(data);
              await AsyncStorage.setItem('userData', JSON.stringify(data));
            } else {
              console.log('No user document found');
            }
          } else {
            console.log('No current user');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const updateUserData = async (newData) => {
    try {
      setUserData(newData);
      await AsyncStorage.setItem('userData', JSON.stringify(newData));
      // Optionally update Firestore as well
      const user = auth().currentUser;
      if (user) {
        await firestore().collection('users').doc(user.uid).update(newData);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
