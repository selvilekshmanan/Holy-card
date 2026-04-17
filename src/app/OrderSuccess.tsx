import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

type OrderSuccessProps = {
  onBackToHome: () => void;
  onViewOrder: () => void;
};

const OrderSuccess: React.FC<OrderSuccessProps> = ({
  onBackToHome,
  onViewOrder,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Success Icon */}
      <View style={styles.iconContainer}>
        <View style={styles.successCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Order Placed Successfully!</Text>

      {/* Message */}
      <Text style={styles.message}>
        Thank you for your purchase. Your order has been placed successfully and
        will be delivered soon.
      </Text>

      {/* Order Info Box */}
      <View style={styles.orderBox}>
        <Text style={styles.orderTitle}>Order Details</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Order ID</Text>
          <Text style={styles.value}>#ORD123456</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Payment Method</Text>
          <Text style={styles.value}>Credit Card</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total Amount</Text>
          <Text style={styles.value}>$34.50</Text>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton} onPress={onViewOrder}>
          <Text style={styles.primaryText}>View Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={onBackToHome}>
          <Text style={styles.secondaryText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  iconContainer: {
    marginTop: 80,
    marginBottom: 30,
  },

  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#20c4b2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkIcon: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },

  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 10,
  },

  orderBox: {
    width: '100%',
    backgroundColor: '#f7f7f7',
    borderRadius: 10,
    padding: 16,
    marginTop: 30,
  },

  orderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  label: {
    color: '#777',
    fontSize: 13,
  },

  value: {
    color: '#333',
    fontWeight: '600',
    fontSize: 13,
  },

  buttonContainer: {
    width: '100%',
    marginTop: 40,
  },

  primaryButton: {
    backgroundColor: '#20c4b2',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },

  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#20c4b2',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#20c4b2',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default OrderSuccess;
