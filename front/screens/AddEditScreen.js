import React, { useState, useEffect } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { API_URL } from "@env";

export default function AddEditScreen({ route, navigation }) {
  const [numApp, setNumApp] = useState("");
  const [design, setDesign] = useState("");
  const [loyer, setLoyer] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    if (route.params?.item) {
      setNumApp(route.params.item.numApp);
      setDesign(route.params.item.design);
      setLoyer(route.params.item.loyer.toString());
      setEditId(route.params.item.id);
    }
  }, [route.params]);

  const saveAppartement = async () => {
    if (!numApp || !design || !loyer) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    const appartement = { numApp, design, loyer: parseFloat(loyer) };

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, appartement);
      } else {
        await axios.post(API_URL, appartement);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to save data");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={numApp}
        onChangeText={setNumApp}
        placeholder="Apartment Number"
      />
      <TextInput
        style={styles.input}
        value={design}
        onChangeText={setDesign}
        placeholder="Design"
      />
      <TextInput
        style={styles.input}
        value={loyer}
        onChangeText={setLoyer}
        placeholder="Loyer (€)"
        keyboardType="numeric"
      />
      <Button title="Save" onPress={saveAppartement} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderBottomWidth: 1, marginBottom: 20, fontSize: 18, padding: 10 },
});
