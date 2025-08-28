import { View, Button, StyleSheet, Image, ScrollView } from 'react-native';
import api from './src/services/api.js';
import { useState } from 'react';

export default function App() {


  const [cat, setCats] = useState([])

  async function buscar() {
    try {
      const result = await api.get('https://api.thecatapi.com/v1/images/search?limit=2');
      console.log(result.data);
      setCats(result.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const _render = () => {
    const vet = [];
    cat.map((item, index) => {
      vet.push(
        <View style={styles.card} key={index} >
          <Image
            source={{ uri: item.url }}
            width={400}
            height={400}
          />
        </View>
      )
    })
    return vet;
  }

  return (
    <View style={styles.container}>
      <Button
        title="Clique Aqui!"
        onPress={() => buscar()} />

      <ScrollView>
        {_render()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },

  card: {
    width: 400,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
