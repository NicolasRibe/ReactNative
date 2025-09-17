import React, {useState, useEffect} from "react";
import { View,Text,Button,FlatList, StyleSheet } from "react-native";
import api from "./src/devices/api.js"

//Declaração do componente principal da aplicação 

export default function App(){
  //usuarios como array de estado 
  const [users, setUsers]= useState([]);
  //Definir a Url da Api que será consumidacla

  const API = "http://10.110.12.26:3000/users";

  //funcao assincrona para buscar a lista de usuarios da Api
  const fetchUsers = async() => {
    try { 
    //Faz a reqisicão GET para a Url da API
    const response = await api.get(API);
    //Atualização da variavel do estado dos users 
    setUsers(response.data);
      
    } catch (error) {
      console.error("Error GET: ", error.message);
    }
  };

  //função para excluir um usuario por ID
  const deleteUSer = async (id) => {
    try {

      // Faz uma requisiçao de DELETE para a API,
      //incluido o ID do usuario a ser excluido
      await api.delete(`${API}/${id}`);
      //filtra uma lista de usuarios, removendo,
      // o usuario do respectivo ID informado 
      setUsers(users.filter((u)=>u.id !==id ));
      
    } catch (error) {
      console.error("Error DELETE: ", error.message);
    }
  }

  useEffect(() => {
      fetchUsers();
  }, []);

  return(
    <View style={styles.container}>
      <Text style={StyleSheet.title}>DELETE - Remover Usuario</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem = {({item }) => (
          <View>
            <Text>id: {item.id} {item.name} - {item.email}</Text>
            <Button title="Del" onPress={ ()=> deleteUSer(item.id)}></Button>
          </View>
        )}
      />
    </View>
  );
}

 const styles =StyleSheet.create({
    container: {flex:1, padding: 20, marginTop:40},
    title :{fontSize:22, fontWeight:"bold", marginBottom: 10},
    item: {marginVertical:10}
  });

