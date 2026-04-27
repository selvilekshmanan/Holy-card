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

const Login: React.FC<Props> = ({ onLogin, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const correctEmail = 'test@gmail.com';
  const [selected, setSelected] = useState('');
  const correctpassword = '0123456';
  const isDisabled = !email || !password;
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [phone, setPhone] = useState('');
  const [confirm, setConfirm] = useState<any>(null);
  const [otp, setOtp] = useState('');

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
        password,
      );
      const user = userCredential.user;
      console.log('User logged in:', userCredential.user);
      console.log('Logged in UID:', user.uid);

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

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 30,
        }}
      >
        <TouchableOpacity
          style={[styles.option, loginType === 'email' && styles.selected]}
          onPress={() => setLoginType('email')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="email-outline" size={18} style={{ marginRight: 6 }} />
            <Text>Email</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, loginType === 'phone' && styles.selected]}
          onPress={() => setLoginType('phone')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="phone-outline" size={18} style={{ marginRight: 6 }} />
            <Text>Phone</Text>
          </View>
        </TouchableOpacity>
      </View>
      {loginType === 'email' && (
        <>
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

          <TouchableOpacity
            style={[styles.button, isDisabled && { backgroundColor: '#ccc' }]}
            onPress={handleLogin}
            disabled={isDisabled}
          >
            <Text style={styles.buttonText}>LOGIN</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNavigateToSignUp}>
            <Text style={styles.signup}>
              Don’t have an account?{' '}
              <Text style={{ color: '#0e0c0c', fontWeight: 'bold' }}>
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
        </>
      )}

      {loginType === 'phone' && (
        <>
          {!confirm ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter phone (+91...)"
                value={phone}
                onChangeText={setPhone}
              />

              <TouchableOpacity
                style={styles.button}
                // onPress={async () => {
                //   try {
                //     const confirmation = await auth().signInWithPhoneNumber(
                //       phone,
                //     );
                //     setConfirm(confirmation);
                //     Toast.show({ type: 'success', text1: 'OTP sent' });
                //   } catch (e) {
                //     console.log(e);
                //     Toast.show({ type: 'error', text1: 'Failed to send OTP' });
                //   }
                // }}

                onPress={async () => {
  try {
    console.log('Sending OTP to:', phone); // ← check phone format
    const confirmation = await auth().signInWithPhoneNumber(phone);
    console.log('OTP sent! Confirmation object:', confirmation); // ← if this logs, OTP was sent
    setConfirm(confirmation);
    Toast.show({ type: 'success', text1: 'OTP sent' });
  } catch (e: any) {
    console.log('Error code:', e.code);     // ← tells you exactly what failed
    console.log('Error message:', e.message);
    Toast.show({ type: 'error', text1: 'Failed to send OTP' });
  }
}}
              >
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="numeric"
                value={otp}
                onChangeText={setOtp}
              />

              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  try {
                    await confirm.confirm(otp);
                    Toast.show({ type: 'success', text1: 'Verified' });
                    onLogin(); // go to home
                  } catch (e) {
                    Toast.show({ type: 'error', text1: 'Invalid OTP' });
                  }
                }}
              >
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
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
  option: {
    width: '48%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    alignItems: 'center',
  },

  selected: {
    backgroundColor: '#00a79d',
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

  logo: {
    alignSelf: 'center',
    width: 180,
    height: 90,
    resizeMode: 'contain',
    marginBottom: 20,
  },

  forgot: {
    textAlign: 'right',
    color: '#999',
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#0e0c0c',
    padding: 15,
    borderRadius: 25,
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
