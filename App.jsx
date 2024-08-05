import firebase from '@react-native-firebase/app';
// Import other Firebase services if needed
import '@react-native-firebase/storage';
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignUp from './src/screens/SignUp';
import SignIn from './src/screens/SignIn';
import ForgetPassword from './src/screens/ForgetPassword';
import Home from './src/screens/Home';
import BootSplash from 'react-native-bootsplash';
import Result from './src/screens/Result';
import Account from './src/screens/Account';
const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);


// Initialize Firebase app
if (!firebase.apps.length) {
  firebase.initializeApp({
    // Your Firebase config
  });
}

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          options={{headerShown: false}}
          component={SignIn}
        />
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={Home}
        />
        <Stack.Screen
          name="Account"
          options={{headerShown: false}}
          component={Account}
        />
        <Stack.Screen
          name="SignUp"
          options={{headerShown: false}}
          component={SignUp}
        />
        <Stack.Screen
          name="ForgetPassword"
          options={{headerShown: false}}
          component={ForgetPassword}
        />
        <Stack.Screen
          name="Result"
          options={{headerShown: false}}
          component={Result}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
