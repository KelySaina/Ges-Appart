import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";
import { API_URL } from "@env";

export default function AddEditScreen({ route, navigation }) {
  const [form, setForm] = useState({
    numApp: "",
    design: "",
    loyer: "",
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.item) {
      setForm({
        numApp: route.params.item.numApp,
        design: route.params.item.design,
        loyer: route.params.item.loyer.toString(),
      });
      setEditId(route.params.item.id);
    }
  }, [route.params]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveAppartement = async () => {
    if (!form.numApp || !form.design || !form.loyer) {
      Alert.alert("Erreur", "Tous les champs sont requis !");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, {
          ...form,
          loyer: parseFloat(form.loyer),
        });
      } else {
        await axios.post(API_URL, { ...form, loyer: parseFloat(form.loyer) });
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erreur", "Échec de l'enregistrement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Numéro d'Appartement"
        value={form.numApp}
        onChangeText={(value) => handleChange("numApp", value)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Désignation"
        value={form.design}
        onChangeText={(value) => handleChange("design", value)}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Loyer (€)"
        value={form.loyer}
        onChangeText={(value) => handleChange("loyer", value)}
        keyboardType="numeric"
        mode="outlined"
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={saveAppartement}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});
