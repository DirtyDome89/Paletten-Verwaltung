// index.js

// Importiere benötigte Pakete
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Importiere das Palette-Modell
const Palette = require('./models/palette');

// Middleware für JSON-Daten
app.use(express.json());

// MongoDB-Verbindung
mongoose.connect('mongodb://mongodb:27017/palettenDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB verbunden"))
  .catch(err => console.log(err));

// API-Endpunkt zum Erstellen einer neuen Palette
app.post('/api/palettes', async (req, res) => {
    const { name, type, quantity, location } = req.body;
    try {
        // Neue Palette erstellen
        const newPalette = new Palette({ name, type, quantity, location });
        await newPalette.save();
        // Erfolg: Rückgabe der neuen Palette
        res.status(201).json(newPalette);
    } catch (err) {
        // Fehler: Rückgabe der Fehlermeldung
        res.status(400).json({ message: err.message });
    }
});

// API-Endpunkt zum Abrufen aller Paletten
app.get('/api/palettes', async (req, res) => {
    try {
        // Alle Paletten aus der Datenbank abrufen
        const palettes = await Palette.find();
        res.json(palettes);
    } catch (err) {
        // Fehler: Rückgabe der Fehlermeldung
        res.status(500).json({ message: err.message });
    }
});

// API-Endpunkt zum Abrufen von Paletten mit Paginierung, Sortierung und Suche
app.get('/api/palettes', async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc', search = '' } = req.query;
    try {
        const palettes = await Palette.find({
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ]
        })
        .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit);

        res.json(palettes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
