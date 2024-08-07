// import firebase from '@react-native-firebase/app';
// // Import other Firebase services if needed
// import '@react-native-firebase/storage';
// import React, {useEffect} from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import SignUp from './src/screens/SignUp';
// import SignIn from './src/screens/SignIn';
// import ForgetPassword from './src/screens/ForgetPassword';
// import Home from './src/screens/Home';
// import BootSplash from 'react-native-bootsplash';
// import Result from './src/screens/Result';
// import Account from './src/screens/Account';
// const Stack = createStackNavigator();

// const App = () => {
//   useEffect(() => {
//     const init = async () => {
//       // …do multiple sync or async tasks
//     };

//     init().finally(async () => {
//       await BootSplash.hide({fade: true});
//       console.log('BootSplash has been hidden successfully');
//     });
//   }, []);

// // Initialize Firebase app
// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     // Your Firebase config
//   });
// }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="SignIn">
//         <Stack.Screen
//           name="SignIn"
//           options={{headerShown: false}}
//           component={SignIn}
//         />
//         <Stack.Screen
//           name="Home"
//           options={{headerShown: false}}
//           component={Home}
//         />
//         <Stack.Screen
//           name="Account"
//           options={{headerShown: false}}
//           component={Account}
//         />
//         <Stack.Screen
//           name="SignUp"
//           options={{headerShown: false}}
//           component={SignUp}
//         />
//         <Stack.Screen
//           name="ForgetPassword"
//           options={{headerShown: false}}
//           component={ForgetPassword}
//         />
//         <Stack.Screen
//           name="Result"
//           options={{headerShown: false}}
//           component={Result}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;

// ---checking code

import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import ForgetPassword from './src/screens/ForgetPassword';
import Home from './src/screens/Home';
import BootSplash from 'react-native-bootsplash';
import Result from './src/screens/Result';
import Account from './src/screens/Account';
import auth from '@react-native-firebase/auth';
import CameraModal from './src/components/CameraModal';
import {ImageProvider} from './src/context/imageContext';

const Stack = createStackNavigator();

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const onAuthStateChanged = user => {
      setUser(user);
      if (initializing) setInitializing(false);
    };

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    return () => subscriber(); // unsubscribe on unmount
  }, [initializing]);

  useEffect(() => {
    const init = async () => {
      // Perform any async tasks here if needed
    };

    init().finally(async () => {
      try {
        await BootSplash.hide({fade: true});
        console.log('BootSplash has been hidden successfully');
      } catch (error) {
        console.error('Failed to hide BootSplash:', error);
      }
    });
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FB2A84" />
      </View>
    ); // Show a loading spinner while initializing
  }

  return (
    <ImageProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? 'Home' : 'SignIn'}>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Account"
            component={Account}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ForgetPassword"
            component={ForgetPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Result"
            component={Result}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="CameraModal"
            component={CameraModal}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ImageProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
