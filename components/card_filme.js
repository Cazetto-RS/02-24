import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const CardFilme = ({ filme, onPress }) => {
  const limitarTexto = (texto, limite) => {
    return texto.length > limite ? texto.substring(0, limite) + '...' : texto;
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${filme.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{limitarTexto(filme.title, 30)}</Text>
        <Text style={styles.overview}>{limitarTexto(filme.overview, 100)}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>⭐{filme.vote_average.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    // Substitua as propriedades shadow* por boxShadow
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)', // Exemplo de sombra
    elevation: 5, // Mantenha o elevation para Android
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444', // Borda mais clara
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  overview: {
    fontSize: 12,
    color: '#BBB', // Texto cinza mais claro
    lineHeight: 16,
    marginBottom: 8,
  },
  ratingContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700', // Dourado para destaque
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000', // Texto preto para contraste
  },
});

export default CardFilme;