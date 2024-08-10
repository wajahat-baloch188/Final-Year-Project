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
      setTimeout(() => setErrorVisible(false), 5000);
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      setErrorVisible(true);
      setTimeout(() => setErrorVisible(false), 5000);
      return;
    }

    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => navigation.navigate('Home'))
      .catch(error => Alert.alert('Error', error.message))
      .finally(() => setLoading(false));
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
    marginBottom: 7,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 40,
  },
  passinput: {
    flex: 1,
    fontSize: 14,
    color: 'black',
  },
  eyeIconContainer: {
    padding: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#FB2A84',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 8,
  },
});

export default SignIn;
