// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   ActivityIndicator, // Import ActivityIndicator
// } from 'react-native';
// import { ArrowRight } from 'lucide-react-native';
// import { useNavigation } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import firestore from '@react-native-firebase/firestore';
// import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// const SignUp = () => {
//   const navigation = useNavigation();
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false); // State to manage loading

//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId: '483084569239-bi2cr163n1i84pp72g41oub3f0j58pq6.apps.googleusercontent.com',
//     });
//   }, []);

//   const createUser = () => {
//     if (!name || !email || !password) {
//       Alert.alert('Error', 'Please fill in all fields');
//       return;
//     }

//     setLoading(true); // Start loading

//     auth()
//       .createUserWithEmailAndPassword(email, password)
//       .then(response => {
//         const uid = response.user.uid;
//         const userData = {
//           id: uid,
//           email: email,
//           fullName: name,
//         };
//         return firestore().collection('users').doc(uid).set(userData);
//       })
//       .then(() => {
//         navigation.navigate('Home'); // Navigate to Home directly
//       })
//       .catch(error => {
//         Alert.alert('Error', `Failed to create account: ${error.message}`);
//       })
//       .finally(() => {
//         setLoading(false); // Stop loading
//       });
//   };

//   const googleSignUp = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
//       const userCredential = await auth().signInWithCredential(googleCredential);

//       const uid = userCredential.user.uid;
//       const userData = {
//         id: uid,
//         email: userCredential.user.email,
//         fullName: userCredential.user.displayName,
//       };

//       await firestore().collection('users').doc(uid).set(userData);

//       navigation.navigate('Home'); // Navigate to Home directly

//     } catch (error) {
//       switch (error.code) {
//         case statusCodes.SIGN_IN_CANCELLED:
//           Alert.alert('Error', 'Sign-in was cancelled by the user');
//           break;
//         case statusCodes.IN_PROGRESS:
//           Alert.alert('Error', 'Sign-in is in progress');
//           break;
//         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//           Alert.alert('Error', 'Play services not available or outdated');
//           break;
//         default:
//           Alert.alert('Error', `Google sign-in failed: ${error.message}`);
//           break;
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.innerContainer}>
//         <View style={styles.logoContainer}>
//           <TouchableOpacity style={styles.logoLink}>
//             <Image
//               source={require('../../images/logo.png')}
//               style={styles.logo}
//             />
//             <Text style={[styles.heading, styles.headingText]}>
//               Breast Cancer
//             </Text>
//           </TouchableOpacity>
//         </View>
//         <Text style={styles.title}>Sign up to create an account</Text>
//         <Text style={styles.subTitle}>
//           Already have an account?{' '}
//           <Text
//             style={styles.link}
//             onPress={() => navigation.navigate('SignIn')}>
//             Sign In
//           </Text>
//         </Text>
//         <View style={styles.form}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Full Name</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Full Name"
//               value={name}
//               onChangeText={setName}
//             />
//           </View>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Email address</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               keyboardType="email-address"
//               value={email}
//               onChangeText={setEmail}
//             />
//           </View>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Password</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>
//           <TouchableOpacity
//             style={styles.button}
//             onPress={createUser}
//             disabled={loading} // Disable button while loading
//           >
//             {loading ? (
//               <ActivityIndicator size="small" color="#fff" /> // Show loading indicator
//             ) : (
//               <>
//                 <Text style={styles.buttonText}>Create Account</Text>
//                 <ArrowRight style={styles.arrowIcon} size={16} />
//               </>
//             )}
//           </TouchableOpacity>
//         </View>
//         <View style={styles.socialLoginContainer}>
//           <TouchableOpacity style={styles.socialButton} onPress={googleSignUp}>
//             <Image
//               source={{
//                 uri: 'https://th.bing.com/th/id/OIP.HgH-NjiOdFOrkmwjsZCCfAHaHl?rs=1&pid=ImgDetMain',
//               }}
//               style={styles.socialIcon}
//             />
//             <Text style={styles.socialButtonText}>Sign up with Google</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// ---------------------------------------

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {ArrowRight, Eye, EyeOff} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [errorVisible, setErrorVisible] = useState(false);

  const validateEmail = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = password => {
    return password.length >= 6;
  };

  const createUser = () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 5000);
      return;
    }

    setLoading(true);
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        return firestore().collection('users').doc(user.uid).set({
          name,
          email,
        });
      })
      .then(() => {
        Alert.alert('Success', 'Account created successfully');
        navigation.navigate('SignIn');
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigation.navigate('Home')}>
          <Image
            source={require('../../images/logo.png')}
            style={styles.logo}
          />
          <Text style={[styles.heading, styles.headingText]}>
            Breast Cancer
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create a new account</Text>
        <Text style={styles.subTitle}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignIn')}>
            Sign in
          </Text>
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor="grey"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="grey"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passinput}
                placeholder="Password"
                placeholderTextColor="grey"
                secureTextEntry={!passwordVisible}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setPasswordVisible(!passwordVisible)}
                style={styles.eyeIconContainer}>
                {passwordVisible ? (
                  <EyeOff size={24} color="black" />
                ) : (
                  <Eye size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {errorVisible && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.button}
            onPress={createUser}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Sign Up</Text>
                <ArrowRight style={styles.arrowIcon} size={16} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  innerContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 36,
  },
  heading: {
    fontWeight: 'bold',
    color: '#FB2A84',
  },
  headingText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  subTitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#4b5563',
    textAlign: 'center',
  },
  link: {
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'underline',
  },
  form: {
    marginTop: 16,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  input: {
    height: 40,
    borderColor: '#d1d5db',

    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    marginTop: 8,
    color: 'black',
    borderWidth: 1,
  },

  passinput: {
    height: 40,
    borderColor: '#d1d5db',
    width: '88%',
    borderRadius: 8,
    // paddingHorizontal: 8,
    fontSize: 14,
    color: 'black',
  },
  passwordContainer: {
    flexDirection: 'row',

    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  eyeIconContainer: {
    marginLeft: 8,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FB2A84',
    paddingLeft: 15,
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default SignUp;
