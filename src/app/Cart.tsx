import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { ref, push } from 'firebase/database';
import { db } from '../../Firebase';

type CartProps = {
  onBack: () => void;
  onCheckout: () => void;
  cartItems: any[];
  setCartItems: (items: any[]) => void;
};

const Cart: React.FC<CartProps> = ({
  onBack,
  onCheckout,
  cartItems,
  setCartItems,
}) => {
  const [cart, setCart] = useState<any[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    setCart(
      cartItems.map(item => ({
        ...item,
        name: item.title,
        qty: item.qty || 1,
      })),
    );
  }, [cartItems]);

  const increaseQty = (id: string) => {
    setCart(prev => {
      const updated = prev.map(item =>
        item.id === id && item.qty < 5 ? { ...item, qty: item.qty + 1 } : item,
      );

      setCartItems(updated); // update parent here
      return updated;
    });
  };

  const decreaseQty = (id: string) => {
    setCart(prev => {
      const updated = prev
        .map(item => (item.id === id ? { ...item, qty: item.qty - 1 } : item))
        .filter(item => item.qty > 0);

      setCartItems(updated); // 🔥 update parent here
      return updated;
    });
  };

  const handleCheckout = async () => {
    if (cart.length == 0) {
      Alert.alert(
        'Oops! 🛍️',
        'Your cart feels lonely... add some gifts first!',
      );
      return;
    }
    setIsCheckingOut(true);

    try {
      const cartref = ref(db, 'carts');
      const cartData = {
        createdAt: Date.now(),
        status: 'pending',
        userId: null, // 📌 replace with auth user ID later
        subtotal: subtotal,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image || null,
          description: item.description || null,
        })),
      };
      const newCartRef = await push(cartref, cartData);
      console.log('Cart pushed to Firebase with ID:', newCartRef.key);

      setCartItems([]);

      onCheckout();
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert('Checkout Failed', 'Something went wrong. Please try again.');
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Your Cart</Text>

        <View style={styles.spacer} />
      </View>

      {/* Delivery Info */}
      <View style={styles.deliveryContainer}>
        <Text style={styles.deliveryText}>Standard Delivery (3)</Text>
        <Text style={styles.deliveryPrice}>${subtotal.toFixed(2)}</Text>
      </View>

      <View style={styles.freeShippingBox}>
        <Text style={styles.freeShippingText}>
          Add $2.03 for free shipping!
        </Text>
      </View>

      {/* Cart Items */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {cart.map(item => (
          <View key={item.id} style={styles.itemContainer}>
            <Image
              source={
                item.image
                  ? { uri: item.image }
                  : require('../assets/birth_1.png')
              }
              style={styles.itemImage}
            />

            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => decreaseQty(item.id)}
              >
                <Text style={styles.qtyText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => increaseQty(item.id)}
              >
                <Text style={styles.qtyText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Subtotal */}
      <View style={styles.footer}>
        <View style={styles.subtotalRow}>
          <Text style={styles.subtotalText}>SUBTOTAL</Text>
          <Text style={styles.subtotalPrice}>${subtotal.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, isCheckingOut && { opacity: 0.6 }]}
          onPress={handleCheckout}
          disabled={isCheckingOut}
        >
          {isCheckingOut ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  backButton: {
    fontSize: 16,
    color: '#0052cc',
    fontWeight: '600',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001a4d',
  },

  spacer: {
    width: 60,
  },

  deliveryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  deliveryText: {
    fontSize: 14,
    color: '#555',
  },

  deliveryPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00a79d',
  },

  freeShippingBox: {
    backgroundColor: '#e7f7f5',
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },

  freeShippingText: {
    color: '#00a79d',
    textAlign: 'center',
    fontSize: 13,
  },

  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },

  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },

  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },

  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  itemDesc: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },

  itemPrice: {
    fontSize: 14,
    color: '#00a79d',
    fontWeight: 'bold',
    marginTop: 4,
  },

  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ff5a7d',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qtyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  qtyValue: {
    marginHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginBottom: 24,
  },

  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  subtotalText: {
    fontSize: 14,
    color: '#666',
  },

  subtotalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00a79d',
  },

  checkoutButton: {
    backgroundColor: '#00a79d',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },

  checkoutText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Cart;
