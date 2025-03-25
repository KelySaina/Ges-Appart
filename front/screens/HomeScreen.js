import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { FAB, Card, IconButton } from "react-native-paper";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";

export default function HomeScreen({ navigation }) {
  const [appartements, setAppartements] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchAppartements();
    }, [])
  );

  const fetchAppartements = async () => {
    try {
      const response = await axios.get(API_URL);
      setAppartements(response.data);
    } catch (error) {
      Alert.alert("Erreur", "Échec du chargement des données");
    }
  };

  const deleteAppartement = async (id) => {
    Alert.alert(
      "Supprimer",
      "Voulez-vous vraiment supprimer cet appartement ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/${id}`);
              setAppartements(appartements.filter((item) => item.id !== id));
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer l'appartement");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Administrer un Appartement", { item })
        }
      >
        <Card.Title
          title={`Appartement ${item.numApp}`}
          subtitle={`${item.design}`}
          right={() => (
            <IconButton
              icon="delete"
              iconColor="red"
              onPress={() => deleteAppartement(item.id)}
            />
          )}
        />
        <Card.Content>
          <Text
            style={styles.statValue}
          >{`${item.loyer.toLocaleString()}€`}</Text>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  const getStats = () => {
    if (appartements.length === 0) return { total: 0, min: 0, max: 0 };
    const loyers = appartements.map((item) => parseFloat(item.loyer));
    return {
      total: loyers.reduce((acc, curr) => acc + curr, 0),
      min: Math.min(...loyers),
      max: Math.max(...loyers),
    };
  };

  const { total, min, max } = getStats();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Statistiques des Loyers</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{total.toLocaleString()}€</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>{min.toLocaleString()}€</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{max.toLocaleString()}€</Text>
        </View>
      </View>
      <FlatList
        data={appartements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <FAB
        icon="plus"
        label="Ajouter"
        style={styles.fab}
        onPress={() => navigation.navigate("Administrer un Appartement")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", paddingHorizontal: 10 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 5,
    elevation: 3,
    borderRadius: 8,
    height: 120,
  },
  statsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: "center",
    elevation: 3,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#007AFF",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
    width: "30%",
  },
  statLabel: { fontSize: 16, color: "#666" },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#007AFF" },
});
