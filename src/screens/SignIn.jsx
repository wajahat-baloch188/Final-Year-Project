// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import {ArrowRight} from 'lucide-react-native';
// import {useNavigation} from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';

// const SignIn = () => {
//   const navigation = useNavigation();

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [errorVisible, setErrorVisible] = useState(false);

//   const signIn = () => {
//     if (!email || !password) {
//       setError('Please write email and password');
//       setErrorVisible(true);
//       setTimeout(() => {
//         setErrorVisible(false);
//       }, 5000); // Hide the error message after 5 seconds
//       return;
//     }

//     setLoading(true);
//     auth()
//       .signInWithEmailAndPassword(email, password)
//       .then(() => {
//         navigation.navigate('Home');
//       })
//       .catch(error => {
//         Alert.alert('Error', error.message);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     GoogleSignin.configure({
//       webClientId:
//         '483084569239-bi2cr163n1i84pp72g41oub3f0j58pq6.apps.googleusercontent.com',
//     });
//   }, []);

//   const googleSignIn = async () => {
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       const googleCredential = auth.GoogleAuthProvider.credential(
//         userInfo.idToken,
//       );
//       await auth().signInWithCredential(googleCredential);
//       navigation.navigate('Home');
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         Alert.alert('Error', 'Play services not available or outdated');
//       } else {
//         Alert.alert('Error', error.message);
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.innerContainer}>
//         <TouchableOpacity
//           style={styles.logoContainer}
//           onPress={() => navigation.navigate('Home')}>
//           <Image
//             source={require('../../images/logo.png')}
//             style={styles.logo}
//           />
//           <Text style={[styles.heading, styles.headingText]}>
//             Breast Cancer
//           </Text>
//         </TouchableOpacity>

//         <Text style={styles.title}>Sign in to your account</Text>
//         <Text style={styles.subTitle}>
//           Don't have an account?{' '}
//           <Text
//             style={styles.link}
//             onPress={() => navigation.navigate('SignUp')}>
//             Create a free account
//           </Text>
//         </Text>

//         <View style={styles.form}>
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
//             <View style={styles.labelContainer}>
//               <Text style={styles.label}>Password</Text>
//               <Text
//                 style={styles.link}
//                 onPress={() => navigation.navigate('ForgetPassword')}>
//                 Forgot password?
//               </Text>
//             </View>
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               secureTextEntry
//               value={password}
//               onChangeText={setPassword}
//             />
//           </View>

//           {errorVisible && <Text style={styles.errorText}>{error}</Text>}

//           <TouchableOpacity
//             style={styles.button}
//             onPress={signIn}
//             disabled={loading}>
//             {loading ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <>
//                 <Text style={styles.buttonText}>Sign In</Text>
//                 <ArrowRight style={styles.arrowIcon} size={16} />
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         <View style={styles.socialLoginContainer}>
//           <TouchableOpacity style={styles.socialButton} onPress={googleSignIn}>
//             <Image
//               source={{
//                 uri: 'https://th.bing.com/th/id/OIP.HgH-NjiOdFOrkmwjsZCCfAHaHl?rs=1&pid=ImgDetMain',
//               }}
//               style={styles.socialIcon}
//             />
//             <Text style={styles.socialButtonText}>Sign in with Google</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

// ============================
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

const SignIn = () => {
  const navigation = useNavigation();
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

  const signIn = () => {
    if (!email || !password) {
      setError('Please enter email and password');
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

    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const username = userCredential.user.displayName;
        navigation.navigate('Home', {username});
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

        <Text style={styles.title}>Sign in to your account</Text>
        <Text style={styles.subTitle}>
          Don't have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignUp')}>
            Create a free account
          </Text>
        </Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email"
              keyboardType="email-address"
              placeholderTextColor="grey"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Password</Text>
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('ForgetPassword')}>
                Forgot password?
              </Text>
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passinput}
                placeholder="Enter your Password"
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
            onPress={signIn}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.buttonText}>Sign In</Text>
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    
    fontSize: 14,
    marginTop: 8,
    color: 'black',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  passinput: {
    height: 40,
    borderColor: '#d1d5db',
    width: '88%',
    borderRadius: 8,
    fontSize: 14,
    color: 'black',
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

export default SignIn;
