import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import BirthdayCards from './BirthdayCards';
import MotherdayCards from './MotherdayCards';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Terms from './Terms';
import OfferDetails from './OfferDetails';
import AddReminders from './AddReminders';
import More from './More';
import Reminders from './Reminders';
import Login from './Login';
import { Alert } from 'react-native';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const Home = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const drawerAnim = useMemo(
    () => new Animated.Value(isDrawerOpen ? 0 : -width * 0.7),
    [isDrawerOpen],
  );
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoad, setIsLoad] = useState(false);
  
  React.useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: isDrawerOpen ? 0 : -width * 0.7,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDrawerOpen, drawerAnim]);

  const menuItems = [
    { label: "Mother's Day", icon: 'flower-tulip', screen: 'MotherdayCards' },
    { label: 'Birthday', icon: 'cake-variant', screen: 'birthdayCards' },
    { label: 'Valentine', icon: 'heart-outline', screen: 'valentineCards' },
    { label: 'My Cart', icon: 'cart-outline', screen: 'cart' },
    { label: 'Gift Vouchers', icon: 'ticket-percent' },
    { label: 'Reminder', icon: 'calendar-clock' },
    { label: 'SB Plus', icon: 'star-outline' },
    {
      label: 'Terms of Service',
      icon: 'file-document-outline',
      screen: 'terms',
    },
    { label: 'More', icon: 'dots-horizontal', screen: 'more' },
    { label: 'Logout', icon: 'logout' },
  ];

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedDate);
    const firstDay = getFirstDayOfMonth(selectedDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };
  const handleSend = () => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, message]);
    setMessage('');
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthYear = `${
    monthNames[selectedDate.getMonth()]
  } ${selectedDate.getFullYear()}`;
  const handleAddToCart = (items: any[]) => {
    setCartItems(prev => {
      const updated = [...prev];

      items.forEach(newItem => {
        const index = updated.findIndex(item => item.id === newItem.id);

        if (index !== -1) {
          // item exists → increase qty
          updated[index].qty = (updated[index].qty || 1) + 1;
        } else {
          // new item → add
          updated.push({ ...newItem, qty: 1 });
        }
      });

      return updated;
    });

    setCurrentScreen('cart');
  };

  useEffect(() => {
    if (!isLoad) return;
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem('apple', JSON.stringify(cartItems));
      } catch (error) {
        console.log('Error saving cart', error);
      }
    };
    saveCart();
    console.log('Saving:', cartItems);
  }, [cartItems]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const data = await AsyncStorage.getItem('apple');
        if (data !== null) {
          const parsed = JSON.parse(data);
          setCartItems(parsed);
          console.log('Loaded:', parsed);
        }
      } catch (error) {
        console.log('Error loading cart', error);
      } finally {
        setIsLoad(true);
      }
    };
    loadCart();
  }, []);

  if (currentScreen === 'login') {
    return <Login 
      onLogin={() => {
        setCurrentScreen('home')
        setIsDrawerOpen(false)  
      }}
      onNavigateToSignUp={()=> setCurrentScreen('signup')} />;
  }
  if(currentScreen === 'signup'){
    const SignUp = require('./SignUp').default;
    return <SignUp 
      onSignUp={()=> {
        setCurrentScreen('home')
        setIsDrawerOpen(false)
      }}
      onNavigateToLogin={()=> setCurrentScreen('login')}
      />
  }

  if (currentScreen === 'offer') {
    return <OfferDetails onBack={() => setCurrentScreen('home')} />;
  }
  if (currentScreen === 'more') {
    return <More onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'terms') {
    return <Terms onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'reminders') {
    return (
      <Reminders
        onAdd={() => setCurrentScreen('addReminder')}
        onBack={() => setCurrentScreen('home')}
      />
    );
  }

  if (currentScreen === 'addReminder') {
    return <AddReminders onBack={() => setCurrentScreen('reminders')} />;
  }

  if (currentScreen === 'birthdayCards') {
    return (
      <BirthdayCards
        type="birthday"
        onBack={() => setCurrentScreen('home')}
        onGoToCart={handleAddToCart}
      />
    );
  }

  if (currentScreen === 'valentineCards') {
    return (
      <BirthdayCards
        type="valentine"
        onBack={() => setCurrentScreen('home')}
        onGoToCart={handleAddToCart}
      />
    );
  }

  if (currentScreen === 'MotherdayCards') {
    return (
      <BirthdayCards
        type="mother"
        onBack={() => setCurrentScreen('home')}
        onGoToCart={handleAddToCart}
      />
    );
  }

  if (currentScreen === 'cart') {
    const Cart = require('./Cart').default;
    return (
      <Cart
        cartItems={cartItems}
        setCartItems={setCartItems}
        onBack={() => setCurrentScreen('home')}
        onCheckout={() => setCurrentScreen('checkout')}
      />
    );
  }

  if (currentScreen === 'checkout') {
    const Checkout = require('./Checkout').default;
    return (
      <Checkout
        onBack={() => setCurrentScreen('cart')}
        onOrderSuccess={() => setCurrentScreen('orderSuccess')}
      />
    );
  }

  if (currentScreen === 'orderSuccess') {
    const OrderSuccess = require('./OrderSuccess').default;
    return (
      <OrderSuccess
        onBackToHome={() => setCurrentScreen('home')}
        onViewOrder={() => setCurrentScreen('cart')}
      />
    );
  }
  return (
      (
        <View style={styles.mainContainer}>
          {/* Drawer Overlay */}
          {isDrawerOpen && (
            <TouchableOpacity
              style={styles.overlay}
              onPress={() => setIsDrawerOpen(false)}
              activeOpacity={0.8}
            />
          )}

          {/* Drawer Menu */}
          <Animated.View
            style={[
              styles.drawer,
              {
                transform: [{ translateX: drawerAnim }],
              },
            ]}
          >
            <View style={styles.drawerHeader}>
              <TouchableOpacity onPress={() => setIsDrawerOpen(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
              <Image
                style={styles.logo}
                source={{
                  uri: 'https://simplyboxed.co.uk/cdn/shop/files/Logo_1.png?v=1771982840&width=352',
                }}
              />
            </View>

            <ScrollView style={styles.drawerContent}>
              {/* <TextInput
            style={styles.drawerSearch}
            placeholder="Search for cards, gifts and...🌷"
            placeholderTextColor="#999"
          /> */}

              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => {
                    console.log('label clicked', item.label);
                    if (item.label === "Mother's Day") {
                      setCurrentScreen('MotherdayCards');
                    }
                    if (item.label === 'Birthday') {
                      setCurrentScreen('birthdayCards');
                    }
                    if (item.label === 'Valentine') {
                      setCurrentScreen('valentineCards');
                    }
                    if (item.label === 'My Cart') {
                      setCurrentScreen('cart');
                    }
                    if (item.label === 'Terms of Service') {
                      setCurrentScreen('terms');
                    }
                    if (item.label === 'More') {
                      setCurrentScreen('more');
                    }
                    if (item.label === 'Reminder') {
                      setCurrentScreen('reminders');
                    }
                    if (item.label === 'Logout'){
                      Alert.alert("Sign out", "Are you sure you want to logout?",
                        [{
                          text: "No",
                          style: "cancel",
                        },
                        {
                          text: "Yes",
                          onPress:() =>setCurrentScreen('login')
                        }
                      ]
                      )
                    }
                  }}
                >
                  <Icon
                    name={item.icon}
                    size={25}
                    color="#333"
                    style={{ marginRight: 10 }}
                  />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Text style={styles.menuArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Main Content */}
          <SafeAreaProvider style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
                  <Text style={styles.hamburger}>☰</Text>
                </TouchableOpacity>
                <Image
                  style={styles.logo}
                  source={{
                    uri: 'https://simplyboxed.co.uk/cdn/shop/files/Logo_1.png?v=1771982840&width=352',
                  }}
                />
                {/* AI Assistant in Header */}
                {/* <TouchableOpacity
          style={styles.aiAssistantContainer}
          onPress={() => setIsAIChatOpen(true)}
        >
          <Text style={styles.aiAssistantIcon}>🤖</Text>
          <Text style={styles.aiAssistantText}>AI Assistant</Text>
        </TouchableOpacity> */}

                <View style={styles.headerRight}>
                  {/* Globe */}
                  <TouchableOpacity>
                    <Icon name="earth" size={22} color="#333" />
                  </TouchableOpacity>

                  {/* Calendar */}
                  <TouchableOpacity onPress={() => setIsCalendarOpen(true)}>
                    <Icon
                      name="calendar-month-outline"
                      size={22}
                      color="#333"
                    />
                  </TouchableOpacity>

                  {/* Profile */}
                  <TouchableOpacity>
                    <Icon name="account-outline" size={22} color="#333" />
                  </TouchableOpacity>

                  {/* Cart */}
                  <TouchableOpacity onPress={() => setCurrentScreen('cart')}>
                    <Icon name="shopping-outline" size={22} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
              <Modal
                visible={isAIChatOpen}
                animationType="slide"
                onRequestClose={() => setIsAIChatOpen(false)}
              >
                <SafeAreaProvider style={styles.chatContainer}>
                  {/* Chat Header */}
                  <View style={styles.chatHeader}>
                    <TouchableOpacity onPress={() => setIsAIChatOpen(false)}>
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>

                    <Text style={styles.chatTitle}>AI Assistant</Text>

                    <View style={{ width: 60 }} />
                  </View>

                  {/* Chat Messages */}
                  <ScrollView style={styles.messagesContainer}>
                    {messages.length === 0 ? (
                      <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>
                          Start chatting with AI 🤖
                        </Text>
                        <Text style={styles.emptySubText}>
                          Ask about gifts, birthday reminders, cards, etc.
                        </Text>
                      </View>
                    ) : (
                      messages.map((msg, index) => (
                        <View key={index} style={styles.messageBubble}>
                          <Text style={styles.messageText}>{msg}</Text>
                        </View>
                      ))
                    )}
                  </ScrollView>

                  {/* Chat Input */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      placeholder="Type your message..."
                      value={message}
                      onChangeText={setMessage}
                      style={styles.input}
                    />

                    <TouchableOpacity
                      style={styles.sendButton}
                      onPress={handleSend}
                    >
                      <Text style={styles.sendText}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </SafeAreaProvider>
              </Modal>

              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search for cards, gifts and flowers🌷..."
                  placeholderTextColor="#999"
                />
                <Icon
                  name="magnify"
                  size={25}
                  color="#999"
                  style={styles.searchIcon}
                />
              </View>

              {/* Promotional Banner */}
              <TouchableOpacity onPress={() => setCurrentScreen('offer')}>
                <View style={styles.banner}>
                  <View>
                    <Text style={styles.bannerText}>
                      CODE: NEWAPP | Upto 5% off
                    </Text>
                    <Text style={styles.bannerCode}>On 1st App Order</Text>
                    <Text style={styles.terms}>
                      T&C Apply | Applicable only on your first App order
                    </Text>
                  </View>
                  <Text style={styles.bannerArrow}>›</Text>
                </View>
              </TouchableOpacity>

              {/* Category Cards */}
              <View style={styles.categoriesContainer}>
                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={() => setCurrentScreen('birthdayCards')}
                >
                  {/* <View style={[styles.categoryImage, styles.categoryImageBirthday]}> */}
                  {/* <Text >🎉</Text> */}
                  <Image
                    style={styles.logo}
                    source={{
                      uri: 'https://cdnnew.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-picture-perfect-wishes-423564-m.jpg',
                    }}
                  />
                  {/* </View> */}
                  <Text style={styles.categoryLabel}>Birthday{'\n'}Gift</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={() => setCurrentScreen('valentineCards')}
                >
                  <View
                    style={[styles.categoryImage, styles.categoryImageMother]}
                  >
                    <Image
                      style={styles.logo}
                      source={{
                        uri: 'https://cdnnew.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-heartfelt-wishes-duo-personalized-390882-m.jpg',
                      }}
                    />
                  </View>
                  <Text style={styles.categoryLabel}>
                    Valentine's{'\n'}Day Gift
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={() => setCurrentScreen('MotherdayCards')}
                >
                  <View
                    style={[styles.categoryImage, styles.categoryImageMother]}
                  >
                    <Image
                      style={styles.logo}
                      source={{
                        uri: 'https://cdnnew.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-i-heart-mom-box-278967-1.jpg',
                      }}
                    />
                  </View>
                  <Text style={styles.categoryLabel}>
                    Mother's{'\n'}Day Gift
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Featured Section */}
              <View style={styles.featuredSection}>
                <View style={styles.imageWrapper}>
                  <Image
                    source={require('../../src/assets/mothersday.jpg')}
                    style={styles.featuredImage}
                  />

                  {/* 🤖 Floating button ON IMAGE */}
                  <TouchableOpacity
                    style={styles.imageFloatingIcon}
                    onPress={() => setIsAIChatOpen(true)}
                  >
                    <Icon name="robot-outline" size={28} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.featuredTitle}>
                  Mother's Day is this Sunday!
                </Text>
                <Text style={styles.featuredDescription}>
                  Get your cards & gifts delivered in time. Order now!
                </Text>

                {/* Shop Button */}
                <TouchableOpacity style={styles.shopButton}>
                  <Text style={styles.shopButtonText}>
                    Shop Mother's Day Cards
                  </Text>
                </TouchableOpacity>

                {/* Secondary Button */}
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>
                    Shop Mother's Day Gifts & Flowers🌷
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </SafeAreaProvider>

          {/* Calendar Modal */}
          <Modal
            visible={isCalendarOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsCalendarOpen(false)}
          >
            <View style={styles.calendarOverlay}>
              <View style={styles.calendarModal}>
                <View style={styles.calendarHeader}>
                  <TouchableOpacity
                    onPress={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() - 1);
                      setSelectedDate(newDate);
                    }}
                  >
                    <Text style={styles.calendarNavButton}>‹</Text>
                  </TouchableOpacity>
                  <Text style={styles.calendarTitle}>{monthYear}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const newDate = new Date(selectedDate);
                      newDate.setMonth(newDate.getMonth() + 1);
                      setSelectedDate(newDate);
                    }}
                  >
                    <Text style={styles.calendarNavButton}>›</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.calendarWeekDays}>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                    (day, idx) => (
                      <Text key={idx} style={styles.weekDay}>
                        {day}
                      </Text>
                    ),
                  )}
                </View>

                <View style={styles.calendarDaysContainer}>
                  {calendarDays.map((day, idx) => {
                    const isSelectedDate =
                      day !== null && day === selectedDate.getDate();

                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.calendarDay,
                          day === null && styles.calendarDayEmpty,
                          isSelectedDate && styles.calendarDaySelected,
                        ]}
                        onPress={() => {
                          if (day !== null) {
                            const newDate = new Date(selectedDate);
                            newDate.setDate(day);
                            setSelectedDate(newDate);
                            setIsCalendarOpen(false);
                          }
                        }}
                      >
                        {day !== null && (
                          <Text
                            style={[
                              styles.calendarDayText,
                              isSelectedDate && styles.calendarDaySelectedText,
                            ]}
                          >
                            {day}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.calendarCloseButton}
                  onPress={() => setIsCalendarOpen(false)}
                >
                  <Text style={styles.calendarCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )
   
  );
};

const styles = StyleSheet.create({
  // aiAssistantContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginLeft: 8,
  //   backgroundColor: '#e6f7ff',
  //   borderRadius: 12,
  //   paddingHorizontal: 8,
  //   paddingVertical: 2,
  //   marginRight: 8,
  //   height: 28,
  // },
  // aiAssistantIcon: {
  //   fontSize: 16,
  //   marginRight: 4,
  // },
  // aiAssistantText: {
  //   fontSize: 13,
  //   color: '#007aff',
  //   fontWeight: '600',
  // },
  imageWrapper: {
    position: 'relative',
  },

  imageFloatingIcon: {
    position: 'absolute',
    right: 15,
    bottom: 15,
    backgroundColor: '#20c4b2',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',

    // shadow
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mainContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: '#fff',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeIcon: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
  drawerLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4',
    flex: 1,
    textAlign: 'center',
  },
  drawerContent: {
    flex: 1,
  },
  drawerSearch: {
    marginHorizontal: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#0052cc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 16,
    color: '#001a4d',
    fontWeight: '500',
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: '#999',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hamburger: {
    fontSize: 24,
    color: '#333',
  },
  logo: {
    flex: 1,
    textAlign: 'center',
    borderRadius: 10,
    width: 120, // adjust based on your UI
    height: 90,
    resizeMode: 'contain',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    fontSize: 14,
  },
  headerIconCalender: {
    fontSize: 14,
    backgroundColor: '#5bd8dc',
    padding: 2,
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 11,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    fontSize: 30,
    marginLeft: 8,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#20c4b2',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004953',
  },
  bannerCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004953',
  },
  terms: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#008080',
    marginTop: 10,
  },
  bannerArrow: {
    fontSize: 24,
    color: '#004953',
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 8,
  },
  categoryCard: {
    alignItems: 'center',
    flex: 1,
  },
  categoryImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 40,
  },
  categoryImageBirthday: {
    backgroundColor: '#2d5f3f',
  },
  categoryImagePhoto: {
    backgroundColor: '#b3d9f2',
  },
  categoryImageMother: {
    backgroundColor: '#d4a5a5',
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#001a4d',
    textAlign: 'center',
    lineHeight: 18,
  },
  featuredSection: {
    marginHorizontal: 16,
    marginVertical: 14,
  },
  featuredImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 10,
  },
  bdayIcon: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#001a4d',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  shopButton: {
    backgroundColor: '#20c4b2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  secondaryButtonText: {
    color: '#090d14',
    fontSize: 16,
    fontWeight: '600',
  },
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarModal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarNavButton: {
    fontSize: 28,
    color: '#0052cc',
    fontWeight: 'bold',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001a4d',
  },
  calendarWeekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekDay: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  calendarDaysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
    borderRadius: 8,
  },
  calendarDayEmpty: {
    backgroundColor: 'transparent',
  },
  calendarDaySelected: {
    backgroundColor: '#0052cc',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#001a4d',
    fontWeight: '500',
  },
  calendarDaySelectedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  calendarCloseButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  calendarCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  welcome: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },

  aiAssistantContainer: {
    // backgroundColor: '#20c4b2',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  aiAssistantIcon: {
    fontSize: 26,
  },

  aiAssistantText: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 5,
  },

  /* CHAT SCREEN */

  chatContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },

  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  closeText: {
    fontSize: 16,
    color: '#0052cc',
    fontWeight: '600',
  },

  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001a4d',
  },

  messagesContainer: {
    flex: 1,
    padding: 16,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 120,
  },

  emptyText: {
    fontSize: 16,
    color: '#666',
  },

  emptySubText: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },

  messageBubble: {
    backgroundColor: '#20c4b2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },

  messageText: {
    color: '#fff',
    fontSize: 14,
  },

  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },

  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: '#20c4b2',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 20,
  },

  sendText: {
    color: '#fff',
    fontWeight: '600',
  },

  floatingIcon: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#20c4b2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  floatingIconText: {
    fontSize: 28,
    color: '#fff',
  },
});

export default Home;
