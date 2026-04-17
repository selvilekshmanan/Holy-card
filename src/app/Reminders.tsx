import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  onAdd: () => void;
  onBack: () => void;
};
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Reminders: React.FC<Props> = ({ onAdd, onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Reminders</Text>
      <Text style={styles.subtitle}>
        Never miss loved ones' special days with our reminders
      </Text>
      <View style={styles.content}>
        <View style={styles.grid}>
          <View style={styles.card}>
            <Icon name="bell-ring-outline" size={40} color="#ff6b6b" />
            <Text style={styles.cardTitle}>Special Prompts</Text>
            <Text style={styles.cardDesc}>
              Never forget birthdays or anniversaries
            </Text>
          </View>

          <View style={styles.card}>
            <Icon name="cards-outline" size={40} color="#4dabf7" />
            <Text style={styles.cardTitle}>Curated Catalogue</Text>
            <Text style={styles.cardDesc}>
              Discover personalised gift collections
            </Text>
          </View>

          <View style={styles.card}>
            <Icon name="sale" size={40} color="#f59f00" />
            <Text style={styles.cardTitle}>Personalised Offers</Text>
            <Text style={styles.cardDesc}>Get offers for your loved ones</Text>
          </View>

          <View style={styles.card}>
            <Icon name="lock-open-outline" size={40} color="#845ef7" />
            <Text style={styles.cardTitle}>Unlock Possibilities</Text>
            <Text style={styles.cardDesc}>Add a reminder now!!</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onAdd}>
        <Text style={styles.buttonText}>+ ADD A REMINDER</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Reminders;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  back: { marginBottom: 10 },

  card: {
    width: '48%',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },

  cardTitle: {
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },

  cardDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00a79d',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  content: {
    flex: 1,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  //   card: {
  //     width: '48%',
  //     height: 120,
  //     borderRadius: 12,
  //     justifyContent: 'center',
  //     alignItems: 'center',
  //     marginBottom: 15,
  //     backgroundColor: '#f7eef0'
  //   },

  //   cardTitle: {
  //     fontWeight: 'bold',
  //     textAlign: 'center',
  //   },

  button: {
    backgroundColor: '#00a79d',
    padding: 16,
    borderRadius: 10,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
