import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  SafeAreaView,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import BirthdayCards from './BirthdayCards';
import MotherdayCards from './MotherdayCards';
const { width } = Dimensions.get('window');

const Home = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const drawerAnim = useMemo(() => new Animated.Value(isDrawerOpen ? 0 : -width * 0.7), [isDrawerOpen]);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  React.useEffect(() => {
    Animated.timing(drawerAnim, {
      toValue: isDrawerOpen ? 0 : -width * 0.7,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDrawerOpen, drawerAnim]);

  const menuItems = [
    { label: "Mother's Day", icon: '🎁' },
    { label: 'Birthday', icon: '🎂' },
    { label: 'Cards', icon: '🎴' },
    { label: 'Flowers & Plants', icon: '🌸' },
    { label: 'Gifts', icon: '🎁' },
    { label: 'Balloons', icon: '🎈' },
    { label: 'Gift Vouchers', icon: '💳' },
    { label: 'SB Plus', icon: '✨' },
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
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthYear = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  // Show Birthday Cards screen if selected
  if (currentScreen === 'birthdayCards') {
    return (
      <BirthdayCards 
        onBack={() => setCurrentScreen('home')} 
        onGoToCart={() => setCurrentScreen('cart')} 
      />
    );
  }
  if (currentScreen === 'MotherdayCards') {
    return <MotherdayCards onBack={() => setCurrentScreen('home')} />;
  }
  if (currentScreen === 'cart') {
    const Cart = require('./Cart').default;
    return <Cart onBack={() => setCurrentScreen('birthdayCards')} onCheckout={() => setCurrentScreen('checkout')} />;
  }

  if (currentScreen === 'checkout') {
    const Checkout = require('./Checkout').default;
    return <Checkout onBack={() => setCurrentScreen('cart')} onOrderSuccess={() => setCurrentScreen('orderSuccess')} />;
  }

  if (currentScreen === 'orderSuccess') {
    const OrderSuccess = require('./OrderSuccess').default;
    return <OrderSuccess onBackToHome={() => setCurrentScreen('home')} onViewOrder={() => setCurrentScreen('cart')} />;
  }

  return (
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
        ]}>
        <View style={styles.drawerHeader}>
          <TouchableOpacity onPress={() => setIsDrawerOpen(false)}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.drawerLogo}>sb</Text>
        </View>

        <ScrollView style={styles.drawerContent}>
          <TextInput
            style={styles.drawerSearch}
            placeholder="Search for cards, gifts and flowers..."
            placeholderTextColor="#999"
          />

          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Main Content */}
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsDrawerOpen(true)}>
              <Text style={styles.hamburger}>☰</Text>
            </TouchableOpacity>
            <Text style={styles.logo}>sb</Text>
            {/* AI Assistant in Header */}
           {/* <TouchableOpacity
          style={styles.aiAssistantContainer}
          onPress={() => setIsAIChatOpen(true)}
        >
          <Text style={styles.aiAssistantIcon}>🤖</Text>
          <Text style={styles.aiAssistantText}>AI Assistant</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
  style={styles.floatingIcon}
  onPress={() => setIsAIChatOpen(true)}
>
  <Text style={styles.floatingIconText}>🤖</Text>
</TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity>
                <Text style={styles.headerIcon}>🌐</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsCalendarOpen(true)}>
                <Text style={styles.headerIconCalender}>
                  {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.headerIcon}>👤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setCurrentScreen('cart')}>
                <Text style={styles.headerIcon}>🛍️</Text>
              </TouchableOpacity>
            </View>
          </View>
<Modal
        visible={isAIChatOpen}
        animationType="slide"
        onRequestClose={() => setIsAIChatOpen(false)}
      >
        <SafeAreaView style={styles.chatContainer}>

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
                <Text style={styles.emptyText}>Start chatting with AI 🤖</Text>
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

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for cards, gifts and flowers..."
            placeholderTextColor="#999"
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Promotional Banner */}
        <View style={styles.banner}>
          <View>
            <Text style={styles.bannerText}>App only: 30% off first card with</Text>
            <Text style={styles.bannerCode}>APPWELCOME</Text>
          </View>
          <Text style={styles.bannerArrow}>›</Text>
        </View>

        {/* Category Cards */}
        <View style={styles.categoriesContainer}>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => setCurrentScreen('birthdayCards')}>
            {/* <View style={[styles.categoryImage, styles.categoryImageBirthday]}> */}
              {/* <Text >🎉</Text> */}
               <Image
            source={require('../assets/birday.png')}
            style={styles.bdayIcon}
          />
            {/* </View> */}
            <Text style={styles.categoryLabel}>Birthday{'\n'}Gift</Text>
          </TouchableOpacity>

         

             <TouchableOpacity style={styles.categoryCard}
            onPress={() => setCurrentScreen('birthdayCards')}>
            <View style={[styles.categoryImage, styles.categoryImageMother]}>
             <Image
            source={require('../../src/assets/valentineday.png')}
            style={styles.bdayIcon}
          />
            </View>
            <Text style={styles.categoryLabel}>Valentine's{'\n'}Day Gift</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.categoryCard}
            onPress={() => setCurrentScreen('birthdayCards')}>
            <View style={[styles.categoryImage, styles.categoryImageMother]}>
             <Image
            source={require('../../src/assets/motherday.png')}
            style={styles.bdayIcon}
          />
            </View>
            <Text style={styles.categoryLabel}>Mother's{'\n'}Day Gift</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Image
            source={require('../../src/assets/birthday.jpg')}
            style={styles.featuredImage}
          />

          <Text style={styles.featuredTitle}>Mother's Day is this Sunday!</Text>
          <Text style={styles.featuredDescription}>
            Get your cards & gifts delivered in time. Order now!
          </Text>

          {/* Shop Button */}
          <TouchableOpacity style={styles.shopButton}>
            <Text style={styles.shopButtonText}>Shop Mother's Day Cards</Text>
          </TouchableOpacity>

          {/* Secondary Button */}
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Shop Mother's Day Gifts & Flowers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>

    {/* Calendar Modal */}
    <Modal
      visible={isCalendarOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsCalendarOpen(false)}>
      <View style={styles.calendarOverlay}>
        <View style={styles.calendarModal}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
            }}>
              <Text style={styles.calendarNavButton}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>{monthYear}</Text>
            <TouchableOpacity onPress={() => {
              const newDate = new Date(selectedDate);
              newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
            }}>
              <Text style={styles.calendarNavButton}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.calendarWeekDays}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <Text key={idx} style={styles.weekDay}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarDaysContainer}>
            {calendarDays.map((day, idx) => {
              const isSelectedDate = day !== null && 
                day === selectedDate.getDate();
              
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
                  }}>
                  {day !== null && <Text style={[styles.calendarDayText, isSelectedDate && styles.calendarDaySelectedText]}>{day}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.calendarCloseButton}
            onPress={() => setIsCalendarOpen(false)}>
            <Text style={styles.calendarCloseButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff69b4',
    flex: 1,
    textAlign: 'center',
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
    padding:2,
    color:'#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#0052cc',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    fontSize: 18,
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
    color: '#001a4d',
  },
  bannerCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#001a4d',
  },
  bannerArrow: {
    fontSize: 24,
    color: '#0052cc',
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
    color: '#0052cc',
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
