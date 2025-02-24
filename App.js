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
      <View style={styles.view_lista}>
        <FlashList
          data={data}
          renderItem={({item}) => <CardFilme filme={item}/>}
          estimatedItenSize={50}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
