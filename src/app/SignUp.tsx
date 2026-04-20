import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Image,
  View,
  ActivityIndicator,
} from 'react-native';

import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  onSignUp: () => void;
  onNavigateToLogin: () => void;
};

const SignUp: React.FC<Props> = ({ onSignUp, onNavigateToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const isDisabled = !email || !password || !confirm;
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirm) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    if (!email.endsWith("@gmail.com")){
      Alert.alert('Error', 'Email must end with @gmail.com')
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      onSignUp(); // navigate to home
    } catch (error: any) {
      const msg =
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered.'
          : error.code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : error.code === 'auth/weak-password'
          ? 'Password is too weak.'
          : 'Sign up failed. Please try again.';
      Alert.alert('Sign Up Failed', msg);
    } finally {
      setLoading(false);
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
      <Text style={styles.title}>SIGN UP</Text>
      <Text style={styles.subtitle}>Create a new account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
            name={!showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm password"
          secureTextEntry={!showPassword}
          value={confirm}
          onChangeText={setConfirm}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={!showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, isDisabled && { backgroundColor: '#ccc' }]}
        onPress={handleSignUp}
        disabled={isDisabled || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>SIGN UP</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.login}>
        Already have an account?{' '}
        <Text style={styles.loginLink} onPress={onNavigateToLogin}>
          Login
        </Text>
      </Text>
    </SafeAreaView>
  );
};

export default SignUp;

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
  passwordInput: {
    flex: 1,
    padding: 10,
  },
  subtitle: { textAlign: 'center', marginBottom: 50, color: '#666' },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    padding: 10,
  },

  logo: {
    alignSelf: 'center',
    width: 180,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  button: { backgroundColor: '#0e0c0c', padding: 15, borderRadius: 10 },

  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  login: { textAlign: 'center', marginTop: 20, color: '#666' },

  loginLink: { color: '#0e0c0c', fontWeight: 'bold' },
});
