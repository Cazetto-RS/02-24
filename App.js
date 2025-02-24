import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from 'react';
import CardFilme from './components/card_filme';
import filmes from './components/filmes';

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(filmes);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titulo}>Lista de Filmes</Text>
      <View style={styles.view_lista}>
        <FlashList
          data={data}
          renderItem={({ item }) => <CardFilme filme={item} />}
          estimatedItemSize={50}
          contentContainerStyle={styles.lista}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  view_lista: {
    flex: 1, //Garante que view_lista ocupe todo o espaço disponível
    width: '100%',
    paddingHorizontal: 10,
  },
  lista: {
    paddingBottom: 20,
  },
});