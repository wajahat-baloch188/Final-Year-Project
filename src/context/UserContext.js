// import React, {createContext, useContext, useState, useEffect} from 'react';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const UserContext = createContext();

// export const UserProvider = ({children}) => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const user = auth().currentUser;
//         if (user) {
//           const userDoc = await firestore()
//             .collection('users')
//             .doc(user.uid)
//             .get();
//           if (userDoc.exists) {
//             const data = userDoc.data();
//             setUserData(data);
//             await AsyncStorage.setItem('userData', JSON.stringify(data));
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const updateUserData = async newData => {
//     try {
//       setUserData(newData);
//       if (newData) {
//         await AsyncStorage.setItem('userData', JSON.stringify(newData));
//       } else {
//         await AsyncStorage.removeItem('userData');
//       }
//     } catch (error) {
//       console.error('Error updating user data:', error);
//     }
//   };

//   return (
//     <UserContext.Provider value={{userData, updateUserData}}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

// // --------------
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged(async (user) => {
//       if (user) {
//         try {
//           const userDoc = await firestore().collection('users').doc(user.uid).get();
//           if (userDoc.exists) {
//             const data = userDoc.data();
//             setUserData(data);
//             await AsyncStorage.setItem('userData', JSON.stringify(data));
//           }
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//           // Fallback to cached data if Firestore fetching fails
//           const cachedUserData = await AsyncStorage.getItem('userData');
//           if (cachedUserData) {
//             setUserData(JSON.parse(cachedUserData));
//           }
//         }
//       } else {
//         // Clear user data if no user is authenticated
//         setUserData(null);
//         await AsyncStorage.removeItem('userData');
//       }
//     });

//     return () => unsubscribe(); // Cleanup on unmount
//   }, []);

//   const updateUserData = async (newData) => {
//     try {
//       setUserData(newData);
//       if (newData) {
//         await AsyncStorage.setItem('userData', JSON.stringify(newData));
//       } else {
//         await AsyncStorage.removeItem('userData');
//       }
//     } catch (error) {
//       console.error('Error updating user data:', error);
//     }
//   };

//   return (
//     <UserContext.Provider value={{ userData, updateUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

// -----------
import React, {createContext, useContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth().currentUser;

        // Check if the user is logged in
        if (user) {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.uid)
            .get();

          if (userDoc.exists) {
            const data = userDoc.data();
            setUserData(data);

            // Ensure you're not saving null or undefined
            if (data) {
              await AsyncStorage.setItem('userData', JSON.stringify(data));
            }
          }
        } else {
          console.log('No user is logged in.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const updateUserData = async newData => {
    try {
      setUserData(newData);

      // Only save valid data, remove if newData is null/undefined
      if (newData) {
        await AsyncStorage.setItem('userData', JSON.stringify(newData));
      } else {
        await AsyncStorage.removeItem('userData');
      }
    } catch (error) {
      console.log('Error updating user data:', error);
    }
  };

  return (
    <UserContext.Provider value={{userData, updateUserData}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
