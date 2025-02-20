const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Middleware für JSON-Daten

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://mongodb:27017/palettenDB')
  .then(() => console.log("MongoDB verbunden"))
  .catch(err => console.log(err));

// Schema & Model
const paletteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  location: String,
  createdAt: { type: Date, default: Date.now }
});

const Palette = mongoose.model('Palette', paletteSchema);

// ✅ GET: Alle Paletten abrufen
app.get('/api/palettes', async (req, res) => {
  try {
    const palettes = await Palette.find();
    res.json(palettes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ POST: Neue Palette erstellen
app.post('/api/palettes', async (req, res) => {
  try {
    const { name, type, quantity, location } = req.body;
    const palette = new Palette({ name, type, quantity, location });
    await palette.save();
    res.status(201).json(palette);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ PUT: Palette aktualisieren
app.put('/api/palettes/:id', async (req, res) => {
  try {
    const palette = await Palette.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!palette) return res.status(404).json({ message: "Palette nicht gefunden" });
    res.json(palette);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ DELETE: Palette löschen
app.delete('/api/palettes/:id', async (req, res) => {
  try {
    const palette = await Palette.findByIdAndDelete(req.params.id);
    if (!palette) return res.status(404).json({ message: "Palette nicht gefunden" });
    res.json({ message: "Palette gelöscht" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Server starten
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));

