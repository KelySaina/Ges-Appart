import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";
import { BarChart } from "react-native-chart-kit";

export default function DashboardScreen({ navigation }) {
  const [appartements, setAppartements] = useState([]);

  // Fetch data on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchAppartements();
    }, [])
  );

  const formatNumberWithSpaces = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const fetchAppartements = async () => {
    try {
      const response = await axios.get(API_URL);
      setAppartements(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load data");
    }
  };

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
  const screenWidth = Dimensions.get("window").width;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Statistiques des Loyers</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>
            {formatNumberWithSpaces(total)} €
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Min</Text>
          <Text style={styles.statValue}>{formatNumberWithSpaces(min)} €</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{formatNumberWithSpaces(max)} €</Text>
        </View>
      </View>

      <Text style={styles.chartTitle}>📈 Répartition des Loyers</Text>

      <BarChart
        data={{
          labels: ["Total", "Min", "Max"],
          datasets: [{ data: [total, min, max] }],
        }}
        width={screenWidth - 40}
        height={250}
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: () => "#333",
        }}
        style={styles.chart}
      />

      <TouchableOpacity
        style={styles.manageButton}
        onPress={() => navigation.navigate("Liste des appartements")}
      >
        <Text style={styles.manageButtonText}>🛠️ Gérer les Appartements</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
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
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  chart: { borderRadius: 10, alignSelf: "center" },
  // Style for "Gérer Appartement" Button
  manageButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  manageButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
