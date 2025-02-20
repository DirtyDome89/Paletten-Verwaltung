const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Middleware für JSON-Daten

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://mongodb:27017/palettenDB', {
}).then(() => console.log("MongoDB verbunden"))
  .catch(err => console.log(err));

// Schema und Model für Paletten
const paletteSchema = new mongoose.Schema({
    name: String,
    type: String,
    quantity: Number,
    location: String,
    createdAt: { type: Date, default: Date.now }
});

const Palette = mongoose.model('Palette', paletteSchema);

// **1. GET: Alle Paletten abrufen**
app.get('/api/palettes', async (req, res) => {
    try {
        const palettes = await Palette.find();
        res.json(palettes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// **2. POST: Neue Palette hinzufügen**
app.post('/api/palettes', async (req, res) => {
    try {
        const { name, type, quantity, location } = req.body;
        const newPalette = new Palette({ name, type, quantity, location });
        await newPalette.save();
        res.status(201).json(newPalette);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// **3. GET: Einzelne Palette per ID abrufen**
app.get('/api/palettes/:id', async (req, res) => {
    try {
        const palette = await Palette.findById(req.params.id);
        if (!palette) return res.status(404).json({ message: "Palette nicht gefunden" });
        res.json(palette);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// **4. PUT: Palette aktualisieren**
app.put('/api/palettes/:id', async (req, res) => {
    try {
        const updatedPalette = await Palette.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPalette) return res.status(404).json({ message: "Palette nicht gefunden" });
        res.json(updatedPalette);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// **5. DELETE: Palette löschen**
app.delete('/api/palettes/:id', async (req, res) => {
    try {
        const deletedPalette = await Palette.findByIdAndDelete(req.params.id);
        if (!deletedPalette) return res.status(404).json({ message: "Palette nicht gefunden" });
        res.json({ message: "Palette gelöscht" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// **Start des Servers**
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));

app.get('/', (req, res) => {
    res.send('Palettenverwaltung API ist aktiv!');
});
