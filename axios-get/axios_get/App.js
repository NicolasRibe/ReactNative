import React, {useEffect, useState} from "react";
import { View, Text, ScrollView, StyleSheet, Button } from "react-native";
import api from './src/devices/api.js';

//Declaraçãp de componente principal da aplicaçãp "App"
export default function App() {
  // 'users' e 'setUsers' são  a varável e a função de atualização res´pectivamente.
  const[users, setUsers] = useState([]);

  const API = "http://10.110.12.26:3000/users";

  // Função assícrona para buscar os usuários da API
  // 'async/await - simplifica acesso ao serviço de API'
  async function fetchUsers() {
    try {
      // Faz uma requisição GET para a URL da API
      const response = await api.get(API);
      //Se bem-sucedida a chamada da api carrega a lista 
      //dos dados.
      setUsers(response.data);
    } catch (error) {
      // Se ocorrer o erro (ex:falha de conexao), exibe no console
      console.error("Error GET:", error.message);
      
    }
  };

  useEffect(()=> {
    fetchUsers();
  },[]);

  const _render = () => {
    const vet=[];
    users.map((item, index)=> {
      vet.push(
        <View key = {index}>
          <Text style={styles.item}>ID:{item.id} Nome:{item.name} Email:{item.email}</Text>
        </View>
      )
    });
    return vet;

  }

  return (
    <View style={styles.container}>
      <Text style = {styles.title}>GET - Listar Usuarios</Text>
      <Button title= "Recarregar Lista" onPress={fetchUsers}></Button>
      <ScrollView>
        {_render()}
      </ScrollView>
    </View>
  );

}
const styles = StyleSheet.create({
  container : {flex: 1, padding: 20, marginTop: 40},
  title: {fontSize: 22, fontWeight: "bold", marginBottom: 10},
  item: {fontSize: 12, marginTop: 10}
});