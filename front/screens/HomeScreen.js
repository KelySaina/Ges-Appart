import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "@env";

export default function HomeScreen({ navigation }) {
  const [appartements, setAppartements] = useState([]);

  // Fetch data on screen focus
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
      Alert.alert("Error", "Failed to load data");
    }
  };

  const deleteAppartement = async (id) => {
    // Show confirmation alert before proceeding
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this apartment?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion canceled"),
          style: "cancel", // This will add a cancel button
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/${id}`);
              setAppartements(appartements.filter((item) => item.id !== id)); // Optimistic update
            } catch (error) {
              Alert.alert("Error", "Failed to delete item");
            }
          },
        },
      ],
      { cancelable: false } // Prevents closing the alert by clicking outside
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={appartements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AddEdit", { item })}
            >
              <Text style={styles.text}>
                {item.numApp} - {item.loyer}€
              </Text>
              <Text style={styles.text}>
                {item.loyer < 1000
                  ? "Bas"
                  : item.loyer > 5000
                  ? "Eleve"
                  : "Moyen"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteAppartement(item.id)}>
              <Text style={styles.delete}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="Add Appartement"
        onPress={() => navigation.navigate("AddEdit")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#ddd",
    marginBottom: 5,
  },
  text: { fontSize: 18 },
  delete: { fontSize: 20, color: "red" },
});
