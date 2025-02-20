import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());  // Middleware für JSON-Daten

const PORT = process.env.PORT || 3000;

// MongoDB-Verbindung herstellen
mongoose.connect('mongodb://mongodb:27017/palettenDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB verbunden"))
  .catch(err => console.log(err));

// Palette-Schema und Modell nur einmal definieren
const paletteSchema = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

// Überprüfe, ob das Modell bereits existiert, um doppelte Deklarationen zu vermeiden.
let Palette;
try {
  Palette = mongoose.model('Palette');
} catch (error) {
  Palette = mongoose.model('Palette', paletteSchema);  // Modell erstellen, wenn es noch nicht existiert
}

// API-Endpunkt für alle Paletten
app.get('/api/palettes', async (req, res) => {
  try {
    const palettes = await Palette.find();
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

// Starte den Server
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
