const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Middleware für JSON-Daten

const PORT = process.env.PORT || 3000;

// 📌 MongoDB Verbindung
mongoose.connect('mongodb://mongodb:27017/palettenDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB verbunden"))
  .catch(err => console.log("❌ Fehler bei MongoDB:", err));

// 📌 Mongoose Schema für Paletten
const paletteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true, min: -9999 },
    location: { type: String, required: true },
    supplier: { type: String, required: false },
    carrier: { type: String, required: false },
    quality: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

const Palette = mongoose.model('Palette', paletteSchema);

// ➤ ✅ Alle Paletten abrufen
app.get('/api/palettes', async (req, res) => {
    try {
        const palettes = await Palette.find();
        res.json(palettes);
    } catch (err) {
        res.status(500).json({ message: "❌ Fehler beim Abrufen der Paletten", error: err.message });
    }
});

// ➤ ✅ Neue Palette hinzufügen (POST)
app.post('/api/palettes', async (req, res) => {
    try {
        const newPalette = new Palette(req.body);
        const savedPalette = await newPalette.save();
        res.status(201).json(savedPalette);
    } catch (err) {
        res.status(400).json({ message: "❌ Fehler beim Erstellen der Palette", error: err.message });
    }
});

// ➤ ✅ Standard-Route
app.get('/', (req, res) => {
    res.send('✅ Palettenverwaltung API ist aktiv!');
});

// ➤ Server starten
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));
