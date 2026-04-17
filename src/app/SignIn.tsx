import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from 'react-native';
import auth from '@react-native-firebase/auth';

type OtpDigit = string;

type SignInProps = {
  onLogin: () => void;
};

const SignIn = ({ onLogin }: SignInProps) => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<OtpDigit[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [confirmResult, setConfirmResult] = useState<auth.PhoneAuthSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputs = useRef<Array<TextInput | null>>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        setError('');
        onLogin();
      }
    });
    return unsubscribe;
  }, [onLogin]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const formattedPhone = phone.replace(/[^0-9]/g, '');
  const displayPhone = formattedPhone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');

  const getE164Phone = (value: string): string => {
    const digits = value.replace(/[^0-9]/g, '');
    if (digits.length < 10) return '';
    
    if (digits.startsWith('0')) {
      return `+91${digits.slice(1, 11)}`;
    }
    if (digits.startsWith('91') && digits.length >= 12) {
      return `+${digits.slice(0, 12)}`;
    }
    if (digits.startsWith('+')) {
      return digits.slice(0, 13);
    }
    return `+91${digits.slice(0, 10)}`;
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer management
  useEffect(() => {
    if (step !== 'otp' || timerSeconds === 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [step, timerSeconds]);

  const showError = useCallback((message: string) => {
    setError(message);
    Alert.alert('Error', message);
  }, []);

  const handleContinue = async () => {
    if (formattedPhone.length < 10) {
      showError('Enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setIsLoading(true);
    const phoneNumber = getE164Phone(formattedPhone);

    try {
      // Configure for production (Android/iOS SMS only, no app verification)
      const confirmation = await auth().signInWithPhoneNumber(
  phoneNumber,
  Platform.OS === 'android' // second arg is boolean, not object
);
      setConfirmResult(confirmation);
      setStep('otp');
      setTimerSeconds(60); // Standard 60s timer
    } catch (err: any) {
      console.error('Phone auth error:', err);
      const errorMessage = err.code === 'auth/invalid-phone-number' 
        ? 'Please enter a valid Indian phone number'
        : err.message || 'Unable to send verification code. Please try again.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timerSeconds > 0 || !phone) return;

    setError('');
    setIsLoading(true);
    const phoneNumber = getE164Phone(formattedPhone);

    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirmResult(confirmation);
      setTimerSeconds(60);
    } catch (err: any) {
      showError(err.message || 'Unable to resend code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(0, 1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);

    if (digit && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('').replace(/[^0-9]/g, '');
    if (code.length !== 6) {
      showError('Please enter full 6-digit code');
      return;
    }

    if (!confirmResult) {
      showError('No verification in progress. Please request a new code.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await confirmResult.confirm(code);
      // onLogin() will be called via onAuthStateChanged
    } catch (err: any) {
      console.error('OTP verification error:', err);
      const errorMessage = err.code === 'auth/invalid-verification-code'
        ? 'Invalid or expired code. Please request a new one.'
        : err.message || 'Verification failed';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.brandHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.brandIcon}>💌</Text>
            </View>
            <Text style={styles.brandTitle}>Login</Text>
          </View>

          {step === 'phone' ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Enter your phone number</Text>
              <Text style={styles.sectionSubTitle}>
                We will send a 6-digit verification code via SMS.
              </Text>

              <View style={styles.fieldLabelRow}>
                <Text style={styles.label}>Phone Number</Text>
              </View>
              <TextInput
                style={[
                  styles.phoneInput,
                  formattedPhone.length < 10 && phone ? styles.phoneInputError : null
                ]}
                placeholder="9012345678"
                placeholderTextColor="#bbb"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                maxLength={14}
                editable={!isLoading}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <TouchableOpacity 
                style={[
                  styles.primaryButton, 
                  isLoading && styles.primaryButtonDisabled
                ]} 
                onPress={handleContinue}
                disabled={isLoading || formattedPhone.length < 10}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Sending...' : 'Continue'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.footerText}>
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </Text>
            </View>
          ) : (
            <View style={styles.card}>
              <TouchableOpacity 
                style={styles.backRow} 
                onPress={() => {
                  setStep('phone');
                  setOtp(['', '', '', '', '', '']);
                  setConfirmResult(null);
                }}
              >
                <Text style={styles.backArrow}>‹</Text>
                <Text style={styles.backText}>Change number</Text>
              </TouchableOpacity>

              <Text style={styles.sectionTitle}>Enter verification code</Text>
              <Text style={styles.phoneHint}>{displayPhone || formattedPhone}</Text>

              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      otpInputs.current[index] = ref;
                    }}
                    style={[
                      styles.otpInput,
                      otp[index] ? styles.otpInputFilled : styles.otpInputEmpty
                    ]}
                    keyboardType="number-pad"
                    maxLength={1}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    editable={!isLoading}
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Text style={styles.timerText}>
                {timerSeconds > 0
                  ? `Resend in ${formatTime(timerSeconds)}`
                  : 'Didn\'t receive code?'}
              </Text>

              <TouchableOpacity
                style={[
                  styles.secondaryButton, 
                  timerSeconds > 0 && styles.secondaryButtonDisabled
                ]}
                onPress={handleResend}
                disabled={timerSeconds > 0 || isLoading}
              >
                <Text style={styles.secondaryButtonText}>Resend Code</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.primaryButton, 
                  isLoading && styles.primaryButtonDisabled
                ]} 
                onPress={handleVerify}
                disabled={isLoading || otp.join('').length !== 6}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Verifying...' : 'Verify'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ff4f8b',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#ff4f8b',
  },
  brandHeader: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIcon: {
    fontSize: 32,
  },
  brandTitle: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1c1c1c',
    marginBottom: 8,
  },
  sectionSubTitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#1c1c1c',
    fontWeight: '600',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 18,
    color: '#1c1c1c',
    marginBottom: 16,
  },
  phoneInputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    marginBottom: 16,
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#ff4f8b',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonDisabled: {
    backgroundColor: '#ff6b9d',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    fontSize: 13,
    color: '#777',
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 16,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backArrow: {
    fontSize: 20,
    color: '#ff4f8b',
    marginRight: 8,
  },
  backText: {
    fontSize: 14,
    color: '#ff4f8b',
    fontWeight: '600',
  },
  phoneHint: {
    color: '#444',
    marginBottom: 32,
    fontSize: 16,
    fontWeight: '600',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  otpInput: {
    width: 56,
    height: 64,
    borderWidth: 2,
    borderRadius: 16,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#1c1c1c',
  },
  otpInputEmpty: {
    borderColor: '#e6e6e6',
    backgroundColor: '#f9f9f9',
  },
  otpInputFilled: {
    borderColor: '#ff4f8b',
    backgroundColor: '#fff',
  },
  timerText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#ff4f8b',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryButtonDisabled: {
    borderColor: '#ccc',
    opacity: 0.5,
  },
  secondaryButtonText: {
    color: '#ff4f8b',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default SignIn;