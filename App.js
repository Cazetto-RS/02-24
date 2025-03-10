import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ActivityIndicator } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useState } from 'react';
import { TMDB_API_KEY } from '@env';
import CardFilme from './components/card_filme';

const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&query=`;
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR`;

export default function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para buscar filmes populares
  const buscarFilmesPopulares = async () => {
    setLoading(true);
    try {
      const response = await fetch(POPULAR_MOVIES_URL);
      const json = await response.json();
      setData(json.results); // Atualiza os filmes
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar filmes
  const buscarFilmes = async (termo = null) => {
    if (termo.length === 0) {
      buscarFilmesPopulares(); // Volta a mostrar filmes populares se o termo estiver vazio
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${encodeURIComponent(termo)}`);
      const json = await response.json();
      setData(json.results); // Atualiza os filmes
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar filmes populares quando o componente é montado
  useEffect(() => {
    buscarFilmesPopulares();
  }, []);

  // Efeito para buscar filmes quando o termo de pesquisa muda
  useEffect(() => {
    if (searchTerm.length > 0) {
      buscarFilmes(searchTerm);
    } else {
      buscarFilmesPopulares(); // Volta a mostrar filmes populares se o termo estiver vazio
    }
  }, [searchTerm]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.titulo}>Lista de Filmes</Text>

      {/* Barra de pesquisa */}
      <TextInput
        style={styles.barraPesquisa}
        placeholder="Pesquisar filmes..."
        placeholderTextColor="#999"
        value={searchTerm}
        onChangeText={setSearchTerm}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {/* Indicador de carregamento */}
      {loading && <ActivityIndicator size="large" color="#FFD700" style={styles.loading} />}

      {/* Lista de filmes */}
      <View style={styles.view_lista}>
        <FlashList
          data={data}
          renderItem={({ item }) => <CardFilme filme={item} />}
          estimatedItemSize={200}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>
              {searchTerm.length > 0 ? "Nenhum filme encontrado." : "Carregando filmes..."}
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#303030',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  barraPesquisa: {
    width: '90%',
    height: 40,
    backgroundColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: 'white',
    marginBottom: 20,
  },
  view_lista: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
  },
  lista: {
    paddingBottom: 20,
  },
  loading: {
    marginVertical: 20,
  },
  textoVazio: {
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
});