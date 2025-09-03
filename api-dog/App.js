import { useState, useEffect } from "react";
import { View, Button, StyleSheet, ScrollView, Image, TextInput } from "react-native";
import api from "./src/services/api.js";

export default function App() {
  const [dogs, setDogs] = useState([]); 
  const [quantidade, setQuantidade] = useState("1");

  useEffect(()=>{
    buscar()
  }, [])

  async function buscar() {
    try {
      const result = await api.get(`https://dog.ceo/api/breeds/image/random/${quantidade}`);
      console.log("Resposta da API: ", result.data);

      if (Array.isArray(result.data.message)) {
        setDogs(result.data.message);
      } else {
        setDogs([result.data.message]);
      }
    } catch (error) {
      console.log("Erro ao buscar imagem:", error.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
        placeholder="Digite a quantidade"
      />
      <Button title="Buscar cachorros" onPress={buscar} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {dogs.map((url, index) => (
          <View style={styles.card} key={index}>
            <Image
              source={{ uri: url }}
              style={{ width: 300, height: 300, borderRadius: 12 }}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    width: "60%",
    textAlign: "center",
  },
  scroll: {
    alignItems: "center",
    paddingBottom: 20,
  },
  card: {
    marginTop: 20,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
});
