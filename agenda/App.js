import React, { useState, useEffect } from 'react';
import {
  View, Text, Button, FlatList, StyleSheet, TextInput,
  TouchableOpacity, SafeAreaView, ScrollView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import api from './src/devices/api.js';
import EditScreen from './src/screens/EditScreen';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  const [commitments, setCommitments] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newHour, setNewHour] = useState("");

  const API = "http://10.110.12.17:3000/commitments";

  const addCommitments = async () => {
    try {
      const response = await api.post(API, {
        title: newTitle,
        notes: newNotes,
        date: newDate,
        hour: newHour,
        status: "pendente"
      });
      setCommitments(prev => [...prev, response.data]);
      setNewTitle(""); setNewNotes(""); setNewDate(""); setNewHour("");
    } catch (error) {
      console.error("Error POST:", error.message);
    }
  };

  const deleteCommitment = async (id) => {
    try {
      await api.delete(`${API}/${id}`);
      setCommitments(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error DELETE:", error.message);
    }
  };

  async function fetchCommitments() {
    try {
      const response = await api.get(API);
      setCommitments(response.data);
    } catch (error) {
      console.error("Error GET:", error.message);
    }
  }

  useEffect(() => {
    fetchCommitments();
    const unsubscribe = navigation.addListener('focus', fetchCommitments);
    return unsubscribe;
  }, [navigation]);

  const statusBadgeStyle = (status) => {
    if (status === 'pendente') return styles.badgePending;
    if (status === 'agendado') return styles.badgeScheduled;
    if (status === 'concluído') return styles.badgeDone;
    return styles.badgePending;
  };

  const renderHeader = () => (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.cellSmall, styles.header]}>ID</Text>
      <Text style={[styles.cell, styles.header]}>Título</Text>
      <Text style={[styles.cellLarge, styles.header]}>Notas</Text>
      <Text style={[styles.cellSmall, styles.header]}>Data</Text>
      <Text style={[styles.cellSmall, styles.header]}>Hora</Text>
      <Text style={[styles.cellSmall, styles.header]}>Status</Text>
      <Text style={[styles.cell, styles.header]}>Ações</Text>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cellSmall}>{item.id}</Text>
      <Text style={styles.cell}>{item.title}</Text>
      <Text style={styles.cellLarge}>{item.notes}</Text>
      <Text style={styles.cellSmall}>{item.date}</Text>
      <Text style={styles.cellSmall}>{item.hour}</Text>
      <View style={[styles.cellSmall, { alignItems: 'center' }]}>
        <View style={[styles.badge, statusBadgeStyle(item.status)]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
      <View style={[styles.cell, styles.actions]}>
        <TouchableOpacity
          style={[styles.btn, styles.btnEdit]}
          onPress={() => navigation.navigate('Editar', { commitment: item })}
        >
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.btnDelete]}
          onPress={() => deleteCommitment(item.id)}
        >
          <Text style={styles.btnText}>Deletar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Agenda</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={newTitle}
        onChangeText={setNewTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Anotações"
        value={newNotes}
        onChangeText={setNewNotes}
      />
      <TextInput
        style={styles.input}
        placeholder="Data (YYYY-MM-DD)"
        value={newDate}
        onChangeText={setNewDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora (HH:MM)"
        value={newHour}
        onChangeText={setNewHour}
      />

      <Button title="Adicionar Compromisso" onPress={addCommitments} />

      <Text style={[styles.title, { marginTop: 20 }]}>Lista de Compromissos</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {renderHeader()}
          <FlatList
            data={commitments}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Agenda" component={HomeScreen} />
        <Stack.Screen name="Editar" component={EditScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  title: { fontSize: 20, fontWeight: '700', marginVertical: 8, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 6, minWidth: 200 },
  row: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center', minWidth: 800 },
  headerRow: { backgroundColor: '#fafafa' },
  cell: { flex: 2, textAlign: 'left', paddingHorizontal: 6 },
  cellLarge: { flex: 3, textAlign: 'left', paddingHorizontal: 6 },
  cellSmall: { flex: 1, textAlign: 'center' },
  header: { fontWeight: '700' },
  actions: { justifyContent: 'center', flexDirection: 'row' },
  btn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginHorizontal: 4 },
  btnEdit: { backgroundColor: '#2E8B57' },
  btnDelete: { backgroundColor: '#C0392B' },
  btnText: { color: '#fff', fontWeight: '700' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: 12 },
  badgePending: { backgroundColor: 'orange' },
  badgeScheduled: { backgroundColor: '#1976D2' },
  badgeDone: { backgroundColor: '#388E3C' },
});
