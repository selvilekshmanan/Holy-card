import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';

import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ref, get } from 'firebase/database';
import { db } from '../../Firebase';

interface BirthdayCardsProps {
  onBack: () => void;
  onGoToCart?: (items: any[]) => void;
  type: 'birthday' | 'valentine' | 'mother';
}

const BirthdayCards: React.FC<BirthdayCardsProps> = ({
  onBack,
  onGoToCart,
  type,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [birthdayCards, setBirthdayCards] = useState<any[]>([]); //  from Firebase
  const [selectedCards, setSelectedCards] = useState<String[]>([]);
  const categories = ['Adult', 'For Her', 'For Him'];

  const toggleSelect = (id: string) => {
    if (selectedCards.includes(id)) {
      setSelectedCards(selectedCards.filter(item => item !== id));
      console.log('selected card:', setSelectedCards);
    } else {
      if (selectedCards.length >= 3) {
        Toast.show({
          type: 'info',
          text1: 'Oops! 😅',
          text2: '❤️ Only 3 gifts allowed!',
        });
        return;
      }
      setSelectedCards([...selectedCards, id]);
    }
  };

  const getTitle = () => {
    if (type === 'birthday') return 'Birthday Gifts';
    if (type === 'valentine') return 'Valentine Gifts';
    if (type === 'mother') return 'Mother Gifts';
    return 'Cards';
  };
  //Fetch from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        let path = '';
        if (type === 'birthday') path = 'birthday_gifts';
        if (type === 'valentine') path = 'valentine_gifts';
        if (type === 'mother') path = 'mother_gifts';
        console.log('TYPE VALUE ', type);

        const snapshot = await get(ref(db, `Gifts/${path}`));

        if (snapshot.exists()) {
          const data = snapshot.val();

          const formatted = Object.keys(data).map(key => ({
            ...data[key],
          }));

          setBirthdayCards(formatted);
        } else {
          console.log('No data found');
        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [type]);

  //  Filter logic
  const filteredCards = birthdayCards.filter(card => {
    const matchesSearch = card.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory || card.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>{getTitle()}</Text>

          <Text style={styles.cardCount}>({birthdayCards.length})</Text>
        </View>

        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Category Tags */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTagsContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() =>
                setSelectedCategory(
                  selectedCategory === category ? null : category,
                )
              }
              style={[
                styles.categoryTag,
                selectedCategory === category && styles.categoryTagActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryTagText,
                  selectedCategory === category && styles.categoryTagTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${getTitle().toLowerCase()}....`}
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Icon
            name="magnify"
            size={25}
            color="#999"
            style={styles.searchIcon}
          />
        </View>

        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {filteredCards.map(card => (
            <TouchableOpacity
              key={card.id}
              style={styles.cardItem}
              onPress={() => toggleSelect(card.id)}
            >
              <View style={styles.checkbox}>
                {selectedCards.includes(card.id) && (
                  <Text style={styles.tick}>♥</Text>
                )}
              </View>
              <View style={styles.cardImageContainer}>
                <Image
                  source={
                    card.image
                      ? { uri: card.image } // Firebase image
                      : require('../assets/birth_1.png') // fallback
                  }
                  style={styles.bdayIcon}
                />
              </View>

              <Text style={styles.cardTitle}>{card.title}</Text>

              <Text style={styles.cardPrice}>${card.price}</Text>

              {/* <TouchableOpacity
                style={styles.addButton}
                onPress={onGoToCart}>
                <Text style={styles.addButtonText}>
                  Add to Basket
                </Text>
              </TouchableOpacity> */}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          const selectedItems = birthdayCards.filter(card =>
            selectedCards.includes(card.id),
          );

          onGoToCart && onGoToCart(selectedItems);
        }}
      >
        <Text style={styles.addButtonText}>Add to Basket</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default BirthdayCards;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
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
  backButton: {
    fontSize: 16,
    color: '#001a4d',
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001a4d',
  },
  cardCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  spacer: {
    width: 60,
  },
  categoryTagsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  categoryTag: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryTagActive: {
    backgroundColor: '#f0f0f0',
    borderColor: '#333',
  },
  categoryTagText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  categoryTagTextActive: {
    color: '#001a4d',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginVertical: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#0f1114',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  searchIcon: {
    fontSize: 25,
    marginLeft: 8,
  },
  scrollContent: {
    padding: 12,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001a4d',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0052cc',
    marginBottom: 10,
  },
  addButton: {
    width: '100%',
    height: '7%',
    backgroundColor: '#00a79d',
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '600',
  },
  bdayIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#e9edf1',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },

  tick: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});
