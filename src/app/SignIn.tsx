import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const SignIn = () => {
  const [email, setEmail] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>


      {/* User Icon */}
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>👤</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>View your account</Text>
      <Text style={styles.subtitle}>Sign in or create an account to continue.</Text>

      {/* Email Label */}
      <Text style={styles.label}>Email</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#ccc"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Continue with Google */}
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.socialButtonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* Continue with Apple */}
      <TouchableOpacity style={styles.socialButton}>
        <Text style={styles.appleIcon}>🍎</Text>
        <Text style={styles.socialButtonText}>Continue with Apple</Text>
      </TouchableOpacity>

      {/* Terms and Conditions */}
      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          By continuing, I agree to Moonpig's{' '}
          <Text style={styles.link}>terms and conditions</Text>, have read the{' '}
          <Text style={styles.link}>privacy notice</Text>, and am at least 18 years old.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  icon: {
    fontSize: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001a4d',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'left',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001a4d',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#999',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  googleIcon: {
    fontSize: 18,
    marginRight: 10,
    fontWeight: 'bold',
    color: '#4285f4',
  },
  appleIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  socialButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  termsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    textAlign: 'center',
  },
  link: {
    color: '#0052cc',
    textDecorationLine: 'underline',
  },
});

export default SignIn;
