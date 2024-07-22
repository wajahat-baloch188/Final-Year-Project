import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Configure Google Sign-In on component mount
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '483084569239-bi2cr163n1i84pp72g41oub3f0j58pq6.apps.googleusercontent.com',
    });
  }, []);

  // Create a new user with email and password
  const createUser = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        const uid = response.user.uid;
        const userData = {
          id: uid,
          email: email,
          fullName: name,
        };
        firestore()
          .collection('users')
          .doc(uid)
          .set(userData)
          .then(() => {
            Alert.alert('Success', 'Account created successfully', [
              {
                text: 'OK',
                onPress: () => navigation.navigate('SignIn'),
              },
            ]);
          })
          .catch(error => {
            Alert.alert('Error', `Failed to save user data: ${error.message}`);
          });
      })
      .catch(error => {
        Alert.alert('Error', `Failed to create account: ${error.message}`);
      });
  };

  // Handle Google Sign-In
  const googleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);

      const uid = userCredential.user.uid;
      const userData = {
        id: uid,
        email: userCredential.user.email,
        fullName: userCredential.user.displayName,
      };

      await firestore().collection('users').doc(uid).set(userData);

      Alert.alert('Success', 'Signed in with Google successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home'),
        },
      ]);

    } catch (error) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          Alert.alert('Error', 'Sign-in was cancelled by the user');
          break;
        case statusCodes.IN_PROGRESS:
          Alert.alert('Error', 'Sign-in is in progress');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert('Error', 'Play services not available or outdated');
          break;
        default:
          Alert.alert('Error', `Google sign-in failed: ${error.message}`);
          break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.logoContainer}>
          <TouchableOpacity style={styles.logoLink}>
            <Image
              source={require('../../images/logo.png')}
              style={styles.logo}
            />
            <Text style={[styles.heading, styles.headingText]}>
              Breast Cancer
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Sign up to create an account</Text>
        <Text style={styles.subTitle}>
          Already have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('SignIn')}>
            Sign In
          </Text>
        </Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={createUser}>
            <Text style={styles.buttonText}>Create Account</Text>
            <ArrowRight style={styles.arrowIcon} size={16} />
          </TouchableOpacity>
        </View>
        <View style={styles.socialLoginContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={googleSignUp}>
            <Image
              source={{ uri: 'https://th.bing.com/th/id/OIP.HgH-NjiOdFOrkmwjsZCCfAHaHl?rs=1&pid=ImgDetMain' }}
              style={styles.socialIcon}
            />
            <Text style={styles.socialButtonText}>Sign up with Google</Text>
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
  logoLink: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: 'black',
    paddingHorizontal: 8,
    fontSize: 14,
    marginTop: 8,
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
  socialLoginContainer: {
    marginTop: 16,
    width: '100%',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 8,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
});

export default SignUp;
