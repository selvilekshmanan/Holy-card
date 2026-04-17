import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  onBack: () => void;
};

const AddReminder: React.FC<Props> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.label}>Enter their name(s):</Text>
        <TextInput
          style={styles.input}
          placeholder="Eg: Anant, Raghav & Mohini"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Choose Occasion:</Text>

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.option, selected === 'birthday' && styles.selected]}
            onPress={() => setSelected('birthday')}
          >
            <Text>🎂 Birthday</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.option,
              selected === 'anniversary' && styles.selected,
            ]}
            onPress={() => setSelected('anniversary')}
          >
            <Text>🥂 Anniversary</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Choose Date:</Text>
        <TextInput style={styles.input} placeholder="Eg: 22 Oct" />
      </View>
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>SAVE & ADD</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AddReminder;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },

  back: { marginBottom: 10 },

  label: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  content: {
    flex: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  option: {
    width: '48%',
    padding: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
  },

  selected: {
    backgroundColor: '#d4e6e8',
    elevation: 10,
  },

  saveBtn: {
    backgroundColor: '#00a79d',
    padding: 16,
    borderRadius: 10,
    marginTop: 30,
  },

  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
