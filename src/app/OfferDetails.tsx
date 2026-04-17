import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

type Props = {
  onBack: () => void;
};

const OfferDetails: React.FC<Props> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Offer Details</Text>
      </View>

      <ScrollView>
        {/* Title */}
        <Text style={styles.mainTitle}>5% Off on Your First App Order</Text>

        <Text style={styles.subTitle}>
          Minimum purchase ₹199 • Valid on App
        </Text>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.heading}>OFFER DETAILS</Text>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>
              Get 5% off on minimum purchase of ₹199
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>Max discount ₹200</Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>Valid till 31st March 2026</Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>First-time users only</Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>Valid once per user</Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>Applicable on all products</Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>
              Cannot combine with other offers
            </Text>
          </View>
        </View>

        {/* <Image
            style={styles.offer}
            source={{ uri: 'https://static.vecteezy.com/system/resources/previews/034/477/708/non_2x/abstract-shape-with-special-offer-text-vector.jpg' }}
            /> */}

        {/* Highlight Box */}

        <View style={styles.termsCard}>
          <Text style={styles.heading}>TERMS & CONDITIONS</Text>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>
              Offer valid only on your first app order
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>
              Discount applied automatically at checkout
            </Text>
          </View>

          <View style={styles.bulletRow}>
            <View style={styles.dot} />
            <Text style={styles.bulletText}>
              Company reserves the right to modify or cancel the offer
            </Text>
          </View>
        </View>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>
            Welcome aboard! Your first order via the app unlocks this exclusive
            offer — don’t miss it! 😜
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OfferDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },

  termsCard: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  back: { fontSize: 16, color: '#001a4d', fontWeight: '600' },

  title: { fontSize: 21, fontWeight: 'bold', marginLeft: 70, marginBottom: 20 },

  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
  },
  offer: {
    width: '100%',
    height: 240,
    borderRadius: 4,
    marginBottom: 10,
  },

  subTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 1,
  },

  card: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
  },

  heading: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#001a4d',
  },

  bullet: {
    marginBottom: 20,
    fontSize: 14,
  },

  highlightBox: {
    backgroundColor: '#20c4b2',
    padding: 15,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },

  highlightText: {
    fontWeight: 'bold',
    color: '#004953',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#20c4b2',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
  },

  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 10,
  },
});
