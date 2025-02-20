const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json()); // Middleware für JSON-Daten

mongoose.connect('mongodb://mongodb:27017/palettenDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB verbunden"))
  .catch(err => console.log(err));

// Beispiel Schema und Model für Paletten
const paletteSchema = new mongoose.Schema({
    name: String,
    type: String,
    quantity: Number
});

const Palette = mongoose.model('Palette', paletteSchema);

// API-Endpunkt für Paletten
app.get('/api/palettes', async (req, res) => {
    try {
        const palettes = await Palette.find();
        res.json(palettes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
