import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'react-native';

const CardFilme = ({filme}) => {
    const limitarTexto = (overview) => {
        return overview.length > 150 ? overview.substring(0, 150) + '...' : overview;
    };

    return (
        <View style={styles.card}>
            <Image source={{ uri: filme.poster_path }} style={styles.poster} />
            <View style={styles.info}>
                <Text style={styles.title}>
                    {filme.title}
                </Text>
                <Text style={styles.overview}>
                    {limitarTexto(filme.overview)}
                </Text>
            </View>
        </View>
    );
};
export default CardFilme;

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        padding: 10,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    poster: {
        width: 140,
        height: 140,
        borderRadius: 70,
    },
    info: {
        flex: 1,
        marginLeft: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    overview: {
        fontSize: 14,
        color: '#666',
    },
});


