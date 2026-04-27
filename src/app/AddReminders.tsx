import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import database from '@react-native-firebase/database';

type Props = {
  onBack: () => void;
};

const AddReminder: React.FC<Props> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [relation, setRelation] = useState('');

  const relations = ['Friend', 'Mom', 'Dad', 'Brother', 'Sister', 'Girl friend', 'Boy Friend', 'Love', 'Son', 'Daughter', 'Others'];
  // Validation
  const isFormValid = 
   name.trim() !== ''&&
   selected !== '' &&
   (selected === 'anniversary' || relation !== '') &&
   date !== null

   const handleSave = async ()=>{
     try {
      const newRef = database().ref('/reminder').push();

      await newRef.set({
        name,
        occasion: selected,
        relation,
        date: date.toISOString
      })
     console.log("Saved to Firebase")

     setName('')
     setRelation('');
     setSelected('');
      
     } catch (error) {
      console.log("Error saving:", error);
     }
   }
  return (
    <SafeAreaView style={styles.container}>
      {/* Back */}
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>‹ Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* Name */}
        <Text style={styles.label}>Enter their name(s):</Text>
        <TextInput
          style={styles.input}
          placeholder="Eg: Anant, Raghav & Mohini"
          value={name}
          onChangeText={setName}
        />

        {/* Occasion */}
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

        {/* Date */}
        <Text style={styles.label}>Choose Date:</Text>

        <TouchableOpacity onPress={() => setShowPicker(true)}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
              })}
            </Text>

            <Icon name="calendar-month-outline" size={22} color="#555" />
          </View>
        </TouchableOpacity>
        {selected === 'birthday' && (
          <>
            <Text style={styles.label}>Select Relation: </Text>
            <View style={styles.relationRow}>
              {relations.map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.relationBox,
                    relation === item && styles.selectedRelation,
                  ]}
                  onPress={() => setRelation(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Calendar */}
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      {/* Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={()=>{
          if (!isFormValid){
            Toast.show({
              type: 'error',
              text1: 'Missing Info',
              text2: 'Please fill all fields',
            })
            return
          } 
        handleSave()
        } 
        }>
          <Text style={styles.saveText}>SAVE & ADD</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddReminder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  relationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  relationBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },

  selectedRelation: {
    backgroundColor: '#dfe8ec',
    borderColor: '#ddd',
  },

  content: {
    flex: 1,
  },

  back: {
    fontSize: 16,
    marginBottom: 10,
  },

  dateContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    color: '#333',
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontWeight: '500',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  option: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },

  selected: {
    backgroundColor: '#dfe8ec',
  },

  footer: {
    paddingVertical: 10,
  },

  saveBtn: {
    backgroundColor: '#0bb',
    padding: 15,
    borderRadius: 10,
  },

  saveText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});
