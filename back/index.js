require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connexion à la base de données
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à la base de données :", err);
    return;
  }
  console.log("Connecté à MySQL");
});

// CRUD

// 1. Ajouter un appartement
app.post("/appartements", (req, res) => {
  const { numApp, design, loyer } = req.body;
  const sql =
    "INSERT INTO Appartement (numApp, design, loyer) VALUES (?, ?, ?)";
  db.query(sql, [numApp, design, loyer], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, numApp, design, loyer });
  });
});

// 2. Lire tous les appartements
app.get("/appartements", (req, res) => {
  db.query("SELECT * FROM Appartement", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. Lire un appartement par ID
app.get("/appartements/:id", (req, res) => {
  db.query(
    "SELECT * FROM Appartement WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.length === 0)
        return res.status(404).json({ message: "Appartement non trouvé" });
      res.json(result[0]);
    }
  );
});

// 4. Mettre à jour un appartement
app.put("/appartements/:id", (req, res) => {
  const { numApp, design, loyer } = req.body;
  const sql =
    "UPDATE Appartement SET numApp = ?, design = ?, loyer = ? WHERE id = ?";
  db.query(sql, [numApp, design, loyer, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Appartement non trouvé" });
    res.json({ message: "Appartement mis à jour" });
  });
});

// 5. Supprimer un appartement
app.delete("/appartements/:id", (req, res) => {
  db.query(
    "DELETE FROM Appartement WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      if (result.affectedRows === 0)
        return res.status(404).json({ message: "Appartement non trouvé" });
      res.json({ message: "Appartement supprimé" });
    }
  );
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
