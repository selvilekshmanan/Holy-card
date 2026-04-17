import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Linking } from 'react-native';

type Props = {
  onBack: () => void;
};

const More: React.FC<Props> = ({ onBack }) => {
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log('Cannot open URL:', url);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>More</Text>
      </View>

      <ScrollView>
        {/* Our Apps */}
        <Text style={styles.sectionTitle}>Our Apps</Text>
        <View style={styles.row}>
          <Image
            source={{
              uri: 'https://tse1.mm.bing.net/th/id/OIP.75BHk0PclBkkQPsJFCy4lgHaCe?rs=1&pid=ImgDetMain&o=7&rm=3',
            }}
            style={styles.storeImg}
          />
          <Image
            source={{
              uri: 'https://tse3.mm.bing.net/th/id/OIP.WXlyGKSJz5SmhMpavFFc_AHaEc?rs=1&pid=ImgDetMain&o=7&rm=3',
            }}
            style={styles.storeImg}
          />
        </View>
        <View style={styles.divider} />

        {/* Social */}
        <Text style={styles.sectionTitle}>Keep in Touch</Text>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => openLink('https://www.facebook.com/login')}
          >
            <Icon name="facebook" size={50} color="#3b5998" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink('https://twitter.com/login')}
          >
            <Icon name="twitter" size={50} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink('https://www.instagram.com/accounts/login')}
          >
            <Icon name="instagram" size={50} color="#E1306C" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => openLink('https://www.pinterest.com/login')}
          >
            <Icon name="pinterest" size={50} color="#E60023" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openLink('https://www.youtube.com')}>
            <Icon name="youtube" size={50} color="#FF0000" />
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {/* Region */}
        <Text style={styles.sectionTitle}>Region</Text>
        <View style={styles.row}>
          <Text style={styles.flag}>🇬🇧 🇺🇸 🇦🇺 🇮🇪</Text>
        </View>
        <View style={styles.divider} />

        {/* Brands */}
        <Text style={styles.sectionTitle}>Our Brands</Text>
        <View style={styles.row}>
          <Image
            source={{
              uri: 'https://tse3.mm.bing.net/th/id/OIP.rRzigW3BLTFUyach5lMS0gHaB3?rs=1&pid=ImgDetMain&o=7&rm=3',
            }}
            style={styles.storeImg}
          />
          <Image
            source={{
              uri: 'https://play-lh.googleusercontent.com/44qQhYVwJCcc5TQWd3UI3mvYmbOgLgEaT-pVQyZ1sgVIoE-N5l3B3Rr96pq-h0-sd-sP',
            }}
            style={styles.storeImg}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default More;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },

  back: { color: '#0bb', fontSize: 16 },

  title: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#367588',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  storeImg: {
    width: 140,
    height: 50,
    resizeMode: 'contain',
  },

  brand: {
    fontSize: 18,
    marginRight: 15,
    color: '#ff4d6d',
  },
  flag: {
    fontSize: 40,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
});
