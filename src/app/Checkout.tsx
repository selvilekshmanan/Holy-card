import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';

import { useStripe } from '@stripe/stripe-react-native';
import { StripeProvider } from '@stripe/stripe-react-native';

type CheckoutProps = {
  onBack: () => void;
  onOrderSuccess: () => void;
};

const Checkout: React.FC<CheckoutProps> = ({ onBack, onOrderSuccess }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [cardNumber, setCardNumber] = useState('1234 5678 8901 2345');
  const [name, setName] = useState('Elliot Alderson');
  const [expiry, setExpiry] = useState('01/20');
  const [cvv, setCvv] = useState('123');
  const [paymentMethod, setPaymentMethod] = useState('apple-pay');

  const handlePayment = async () => {
    console.log('button clicked');
    try {
      // 🔥 1. Call backend
      const response = await fetch(
        'http://192.168.1.3:3000/create-payment-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 100 }), // replace with your subtotal
        },
      );
      console.log('backend called');

      const { clientSecret } = await response.json();
      const data = await response.json;
      console.log('response', data);

      // 🔥 2. Initialize Stripe
      await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Holy Card',
      });

      // 🔥 3. Open Stripe UI
      const { error } = await presentPaymentSheet();

      if (error) {
        console.log('Payment error:', error);
      } else {
        console.log('Payment success ✅');
        onOrderSuccess(); // 👉 move to success screen
      }
    } catch (e) {
      console.log('Payment failed:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* Step Progress */}
      <View style={styles.stepContainer}>
        <View style={styles.stepRow}>
          <View style={styles.stepDotActive} />
          <View style={styles.stepLineActive} />
          <View style={styles.stepDotActive} />
          <View style={styles.stepLineInactive} />
          <View style={styles.stepDotInactive} />
        </View>

        <View style={styles.stepLabels}>
          <Text style={styles.stepLabel}>PERSONAL INFO</Text>
          <Text style={styles.stepLabelActive}>PAYMENT</Text>
          <Text style={styles.stepLabel}>CONFIRMATION</Text>
        </View>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PAYMENT METHOD</Text>

        <View style={styles.paymentMethods}>
          <TouchableOpacity
            style={
              paymentMethod === 'credit-card'
                ? styles.cardActive
                : styles.cardInactive
            }
            onPress={() => setPaymentMethod('credit-card')}
          >
            <Image
              source={require('../assets/credit_card.png')}
              style={styles.paymentIcon}
            />
            {/* <Text style={styles.cardText}>Credit Card</Text> */}
          </TouchableOpacity>

          <TouchableOpacity
            style={
              paymentMethod === 'apple-pay'
                ? styles.cardActive
                : styles.cardInactive
            }
            onPress={() => setPaymentMethod('apple-pay')}
          >
            <Image
              source={require('../assets/apple_pay.png')}
              style={styles.paymentIcon}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Credit Card Details */}
      {paymentMethod === 'credit-card' ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CREDIT CARD DETAILS</Text>

          <Text style={styles.inputLabel}>NAME ON CARD</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} />

          <Text style={styles.inputLabel}>CREDIT CARD NUMBER</Text>
          <TextInput
            value={cardNumber}
            onChangeText={setCardNumber}
            style={styles.input}
            keyboardType="numeric"
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>EXPIRATION DATE</Text>
              <TextInput
                value={expiry}
                onChangeText={setExpiry}
                style={styles.input}
              />
            </View>

            <View style={{ width: 20 }} />

            <View style={{ flex: 1 }}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                value={cvv}
                onChangeText={setCvv}
                style={styles.input}
                keyboardType="numeric"
                secureTextEntry
              />
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APPLE PAY</Text>

          <TouchableOpacity style={styles.applePayButton}>
            <Image
              source={require('../assets/apple_pay.png')} // 👈 add this image
              style={styles.applePayImage}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handlePayment}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f7',
    paddingTop: 40,
  },

  applePayButton: {
    backgroundColor: '#000',
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },

  applePayImage: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },

  backButton: {
    fontSize: 22,
    color: '#333',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  stepContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#20c4b2',
  },

  stepDotInactive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
  },

  stepLineActive: {
    width: 60,
    height: 2,
    backgroundColor: '#20c4b2',
    marginHorizontal: 6,
  },

  stepLineInactive: {
    width: 60,
    height: 2,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },

  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  stepLabel: {
    fontSize: 10,
    color: '#999',
  },

  stepLabelActive: {
    fontSize: 10,
    color: '#20c4b2',
    fontWeight: '600',
  },

  section: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777',
    marginBottom: 14,
  },

  paymentMethods: {
    flexDirection: 'row',
  },

  cardActive: {
    backgroundColor: '#a4e7e2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginRight: 10,
    elevation: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardInactive: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 16,
    marginRight: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    flexDirection: 'row',
    elevation: 20,
    alignItems: 'center',
  },

  paymentIcon: {
    width: 80,
    height: 60,
    marginRight: 10,
    resizeMode: 'contain',
  },

  cardText: {
    color: '#fff',
    fontWeight: '600',
  },

  paypalText: {
    color: '#666',
    fontWeight: '600',
  },

  inputLabel: {
    fontSize: 11,
    color: '#888',
    marginTop: 12,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 8,
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
  },

  footer: {
    padding: 16,
  },

  continueButton: {
    backgroundColor: '#20c4b2',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },

  continueText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  paypalButton: {
    backgroundColor: '#003087',
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
  },

  paypalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default Checkout;
