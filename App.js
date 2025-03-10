import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, ActivityIndicator, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { TMDB_API_KEY } from '@env';
import CardFilme from './components/card_filme';

const API_URL = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&query=`;
const POPULAR_MOVIES_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR`;
const MOVIE_DETAILS_URL = (movieId) => `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=credits`;

export default function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);

  // Função para buscar filmes populares
  const buscarFilmesPopulares = async () => {
    setLoading(true);
    try {
      const response = await fetch(POPULAR_MOVIES_URL);
      const json = await response.json();
      setData(json.results);
    } catch (error) {
      console.error('Erro ao buscar filmes populares:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar filmes
  const buscarFilmes = async (termo = null) => {
    if (termo.length === 0) {
      buscarFilmesPopulares();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}${encodeURIComponent(termo)}`);
      const json = await response.json();
      setData(json.results);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar detalhes do filme
  const buscarDetalhesFilme = async (movieId) => {
    try {
      const response = await fetch(MOVIE_DETAILS_URL(movieId));
      const json = await response.json();
      setMovieDetails(json); // Armazena os detalhes do filme
    } catch (error) {
      console.error('Erro ao buscar detalhes do filme:', error);
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
      buscarFilmesPopulares();
    }
  }, [searchTerm]);

  // Função para abrir o modal com as informações do filme
  const openModal = async (filme) => {
    setSelectedMovie(filme);
    setModalVisible(true);
    await buscarDetalhesFilme(filme.id); // Busca os detalhes do filme
  };

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
          renderItem={({ item }) => <CardFilme filme={item} onPress={() => openModal(item)} />}
          estimatedItemSize={200}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={styles.textoVazio}>
              {searchTerm.length > 0 ? "Nenhum filme encontrado." : "Carregando filmes..."}
            </Text>
          }
        />
      </View>

      {/* Modal com detalhes do filme */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              {selectedMovie && movieDetails && (
                <>
                  <Text style={styles.modalTitle}>{selectedMovie.title}</Text>
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}` }}
                    style={styles.modalPoster}
                  />
                  <Text style={styles.modalOverview}>{selectedMovie.overview}</Text>
                  <Text style={styles.modalRating}>⭐ {selectedMovie.vote_average.toFixed(1)}</Text>
                  <Text style={styles.modalReleaseDate}>Data de Lançamento: {selectedMovie.release_date}</Text>

                  {/* Informações adicionais */}
                  <Text style={styles.modalSectionTitle}>Atores Principais</Text>
                  <View style={styles.modalSection}>
                    {movieDetails.credits.cast.slice(0, 5).map((ator, index) => (
                      <Text key={index} style={styles.modalText}>
                        {ator.name} como {ator.character}
                      </Text>
                    ))}
                  </View>

                  <Text style={styles.modalSectionTitle}>Diretor</Text>
                  <View style={styles.modalSection}>
                    {movieDetails.credits.crew
                      .filter((member) => member.job === 'Director')
                      .map((diretor, index) => (
                        <Text key={index} style={styles.modalText}>
                          {diretor.name}
                        </Text>
                      ))}
                  </View>

                  <Text style={styles.modalSectionTitle}>País de Origem</Text>
                  <View style={styles.modalSection}>
                    {movieDetails.production_countries.map((pais, index) => (
                      <Text key={index} style={styles.modalText}>
                        {pais.name}
                      </Text>
                    ))}
                  </View>
                </>
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%', // Define uma altura máxima para o modal
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 20,
  },
  scrollViewContent: {
    flexGrow: 1, // Permite que o ScrollView ocupe todo o espaço disponível
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  modalPoster: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalOverview: {
    fontSize: 16,
    color: '#BBB',
    marginBottom: 10,
  },
  modalRating: {
    fontSize: 18,
    color: '#FFD700',
    marginBottom: 10,
  },
  modalReleaseDate: {
    fontSize: 16,
    color: '#BBB',
    marginBottom: 10,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    marginBottom: 5,
  },
  modalSection: {
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: '#BBB',
    marginBottom: 5,
  },
  closeButton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});