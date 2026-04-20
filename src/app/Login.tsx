import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import Toast from 'react-native-toast-message';

import auth from '@react-native-firebase/auth';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onLogin: () => void;
  onNavigateToSignUp: () => void;
};

const Login: React.FC<Props> = ({ onLogin , onNavigateToSignUp}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const correctEmail = 'test@gmail.com';
  const correctpassword = '0123456';
  const isDisabled = !email || !password
   
  const handleLogin = async () => {
  if (!email || !password) {
    Toast.show({
      type: 'info',
      text1: 'Info missing',
      text2: 'Please enter email and password',
    });
    return;
  }

  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password
    );
    const user = userCredential.user
    console.log('User logged in:', userCredential.user);
    console.log('Logged in UID:', user.uid)

    Toast.show({
      type: 'success',
      text1: 'Login successful',
    });

    onLogin(); // navigate to home

  } catch (error: any) {
    console.log(error);

    if (error.code === 'auth/user-not-found') {
      Toast.show({
        type: 'error',
        text1: 'User not found',
      });
    } else if (error.code === 'auth/wrong-password') {
      Toast.show({
        type: 'error',
        text1: 'Wrong password',
      });
    } else if (error.code === 'auth/invalid-email') {
      Toast.show({
        type: 'error',
        text1: 'Invalid email',
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: error.message,
      });
    }
  }
};
  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={{
          uri: 'https://simplyboxed.co.uk/cdn/shop/files/Logo_1.png?v=1771982840&width=352',
        }}
      />
      <Text style={styles.title}>LOGIN</Text>
      <Text style={styles.subtitle}>Please sign in to continue</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter password"
          secureTextEntry={!showPassword} 
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, isDisabled && {backgroundColor : '#ccc'}]} onPress={handleLogin} disabled = {isDisabled}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onNavigateToSignUp}>
      <Text style={styles.signup}>
        Don’t have an account?{' '}
        <Text style={{ color: '#0e0c0c', fontWeight: 'bold' }}>Sign up</Text>
      </Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0e0c0c',
    textAlign: 'center',
  },

  subtitle: {
    textAlign: 'center',
    marginBottom: 50,
    color: '#666',
  },

  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    padding: 10,
  },

  logo: { alignSelf: 'center', width: 180, height: 90, resizeMode: 'contain', marginBottom: 20 },

  forgot: {
    textAlign: 'right',
    color: '#999',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#0e0c0c',
    padding: 15,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  or: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#999',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,
    padding: 10,
  },

  social: {
    backgroundColor: '#3b5998',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },

  signup: {
    textAlign: 'center',
    marginTop: 10,
    color: '#666',
  },
});
