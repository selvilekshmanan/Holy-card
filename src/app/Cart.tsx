import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

type CartProps = {
  onBack: () => void;
  onCheckout: () => void;
};

const initialCart = [
  {
    id: 1,
    name: 'Hint Water Variety Pack',
    description: '12 x 16 oz',
    price: 19.99,
    image: require('../assets/birth_6.png'),
    qty: 1,
  },
  {
    id: 2,
    name: 'Charmin Ultra Strong Double Roll',
    description: '36 Count',
    price: 19.99,
    image: require('../assets/birth_1.png'),
    qty: 1,
  },
  {
    id: 3,
    name: 'Vaseline Petroleum Jelly Original',
    description: '2 x 13 oz',
    price: 7.99,
    image: require('../assets/birth_4.png'),
    qty: 1,
  },
];

const Cart: React.FC<CartProps> = ({ onBack, onCheckout }) => {
  const [cart, setCart] = useState(initialCart);

  const increaseQty = (id: number) => {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: item.qty + 1 } : item)),
    );
  };

  const decreaseQty = (id: number) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.qty > 1
          ? { ...item, qty: item.qty - 1 }
          : item,
      ),
    );
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
            <Image source={item.image} style={styles.itemImage} />

            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>

            <View style={styles.qtyContainer}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => decreaseQty(item.id)}>
                <Text style={styles.qtyText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{item.qty}</Text>

              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => increaseQty(item.id)}>
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

        <TouchableOpacity style={styles.checkoutButton} onPress={onCheckout}>
          <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
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
