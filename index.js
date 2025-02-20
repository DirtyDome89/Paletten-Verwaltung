import express from 'express';
import mongoose from 'mongoose';
import { Palette } from './models/palette.js';  // Importiere das Palette-Modell

const app = express();
app.use(express.json()); // Middleware für JSON-Daten

const PORT = process.env.PORT || 3000;

// MongoDB-Verbindung herstellen
mongoose.connect('mongodb://mongodb:27017/palettenDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB verbunden"))
  .catch(err => console.log(err));

// Beispiel Schema und Model für Paletten
const paletteSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

const Palette = mongoose.model('Palette', paletteSchema);

// API-Endpunkt für alle Paletten
app.get('/api/palettes', async (req, res) => {
  try {
    const { page = 1, limit = 5, sortBy = 'createdAt', order = 'asc', search = '' } = req.query;
    const sortOrder = order === 'asc' ? 1 : -1;

    const palettes = await Palette.find({ name: new RegExp(search, 'i') })
      .sort({ [sortBy]: sortOrder })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(palettes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API-Endpunkt zum Erstellen einer neuen Palette
app.post('/api/palettes', async (req, res) => {
  const { name, type, quantity, location } = req.body;

  const newPalette = new Palette({
    name,
    type,
    quantity,
    location,
  });

  try {
    const savedPalette = await newPalette.save();
    res.status(201).json(savedPalette);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// API-Endpunkt zum Aktualisieren einer Palette (PUT)
app.put('/api/palettes/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, quantity, location } = req.body;

  try {
    const updatedPalette = await Palette.findByIdAndUpdate(id, {
      name,
      type,
      quantity,
      location,
    }, { new: true });

    if (!updatedPalette) {
      return res.status(404).json({ message: "Palette nicht gefunden" });
    }

    res.json(updatedPalette);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API-Endpunkt zum Löschen einer Palette (DELETE)
app.delete('/api/palettes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPalette = await Palette.findByIdAndDelete(id);

    if (!deletedPalette) {
      return res.status(404).json({ message: "Palette nicht gefunden" });
    }

    res.json({ message: "Palette erfolgreich gelöscht" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Filter-Endpunkt (nach Location und Datum)
app.get('/api/palettes/filter', async (req, res) => {
  const { location, startDate, endDate } = req.query;

  let filter = {};
  if (location) filter.location = location;
  if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  try {
    const palettes = await Palette.find(filter);
    res.json(palettes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Starten des Servers
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
