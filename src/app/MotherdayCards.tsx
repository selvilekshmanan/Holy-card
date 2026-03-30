import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Image } from 'react-native';

import card1 from '../assets/birth_1.png';
import card2 from '../assets/birth_2.png';
import card3 from '../assets/birth_3.png';
import card4 from '../assets/birth_4.png';
import card5 from '../assets/birth_5.png';
import card6 from '../assets/birth_6.png';


interface MotherdayCardsProps {
  onBack: () => void;
}

const MotherdayCards: React.FC<MotherdayCardsProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const birthdayCards = [
    {
      id: 1,
      title: 'Happy Birthday',
      category: 'Adult',
      image: card1,
      price: '$4.99',
      liked: false,
    },
    {
      id: 2,
      title: 'Birthday Wishes',
      category: 'For Her',
      image: card2,
      price: '$4.99',
      liked: false,
    },
    {
      id: 3,
      title: 'Have a Great Day',
      category: 'For Him',
      image: card3,
      price: '$4.99',
      liked: false,
    },
    {
      id: 4,
      title: 'Celebrate You',
      category: 'Adult',
      image: card4,
      price: '$4.99',
      liked: false,
    },
    {
      id: 5,
      title: 'Make a Wish',
      category: 'For Her',
      image: card5,
      price: '$4.99',
      liked: false,
    },
    {
      id: 6,
      title: 'Birthday Fun',
      category: 'For Him',
      image: card6,
      price: '$4.99',
      liked: false,
    },
  ];

  const categories = ['Adult', 'For Her', 'For Him'];

  const filteredCards = birthdayCards.filter((card) => {
    const matchesSearch = card.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || card.category === selectedCategory;
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
          <Text style={styles.title}>Birthday Cards</Text>
          <Text style={styles.cardCount}>(500+)</Text>
        </View>
        <View style={styles.spacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Filter Bar */}
        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterIcon}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterDropdown}>
            <Text style={styles.filterDropdownText}>Who's it for? ▼</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterDropdown}>
            <Text style={styles.filterDropdownText}>Photos ▼</Text>
          </TouchableOpacity>
        </View>

        {/* Category Tags */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTagsContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              style={[
                styles.categoryTag,
                selectedCategory === category && styles.categoryTagActive,
              ]}>
              <Text
                style={[
                  styles.categoryTagText,
                  selectedCategory === category && styles.categoryTagTextActive,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search birthday cards..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

        {/* Cards Grid */}
        <View style={styles.cardsGrid}>
          {filteredCards.map((card) => (
            <TouchableOpacity key={card.id} style={styles.cardItem}>
              <View style={styles.cardImageContainer}>
                {/* <Text style={styles.cardEmoji}>{card.image} */}
                 <Image
  source={card.image}
  style={styles.bdayIcon}
/>
                {/* </Text> */}
              </View>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardPrice}>{card.price}</Text>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>Add to Basket</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    color: '#0052cc',
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
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  filterButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  filterIcon: {
    fontSize: 18,
  },
  filterDropdown: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
  },
  filterDropdownText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
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
  cardEmoji: {
    fontSize: 50,
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
    backgroundColor: '#0052cc',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  bdayIcon: {
  width: '100%',
  height: '100%',
  resizeMode: 'contain',
}
});

export default MotherdayCards;
