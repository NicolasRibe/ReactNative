import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../devices/api.js';

export default function EditScreen({ route, navigation }) {
  const { commitment } = route.params || {};

  if (!commitment) {
    return (
      <View style={styles.container}>
        <Text>Nenhum compromisso selecionado.</Text>
      </View>
    );
  }

  const [title, setTitle] = useState(commitment.title);
  const [notes, setNotes] = useState(commitment.notes);
  const [date, setDate] = useState(commitment.date);
  const [hour, setHour] = useState(commitment.hour);
  const [status, setStatus] = useState(
    (commitment.status === 'agendado' || commitment.status === 'concluído')
      ? commitment.status
      : 'agendado'
  );

  const API = "http://10.110.12.17:3000/commitments";

  const saveChanges = async () => {
    try {
      const payload = { ...commitment, title, notes, date, hour, status };
      await api.put(`${API}/${commitment.id}`, payload);
      navigation.goBack();
    } catch (error) {
      console.error('Error PUT:', error.message);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar compromisso</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Anotações</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Text style={styles.label}>Data</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Hora</Text>
      <TextInput
        style={styles.input}
        value={hour}
        onChangeText={setHour}
        placeholder="HH:MM"
      />

      <Text style={styles.label}>Status</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={status}
          onValueChange={(val) => setStatus(val)}
          mode="dropdown"
        >
          <Picker.Item label="Agendado" value="agendado" />
          <Picker.Item label="Concluído" value="concluído" />
        </Picker>
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Salvar" onPress={saveChanges} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
  label: { fontWeight: '600', marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginTop: 4
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 4
  }
});
