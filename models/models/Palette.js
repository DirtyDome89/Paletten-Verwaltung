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
    quantity: { type: Number, required: true, min: -9999 }, // ✅ Negative Werte erlaubt
    location: { type: String, required: true },
    supplier: { type: String, required: false }, // Lieferant
    carrier: { type: String, required: false },  // Spedition
    quality: { type: String, required: false },  // Qualität
    createdAt: { type: Date, default: Date.now }
});

const Palette = mongoose.model('Palette', paletteSchema);

// 📌 API-Endpunkte für CRUD-Operationen

// ➤ ✅ Alle Paletten abrufen (inkl. Filter, Paginierung, Sortierung)
app.get('/api/palettes', async (req, res) => {
    try {
        let { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', search = '' } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        
        const query = search
            ? { $or: [{ name: new RegExp(search, 'i') }, { location: new RegExp(search, 'i') }] }
            : {};

        const palettes = await Palette.find(query)
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Palette.countDocuments(query);

        res.json({ total, page, pages: Math.ceil(total / limit), palettes });
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

// ➤ ✅ Palette aktualisieren (PUT)
app.put('/api/palettes/:id', async (req, res) => {
    try {
        const updatedPalette = await Palette.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPalette) return res.status(404).json({ message: "❌ Palette nicht gefunden" });
        res.json(updatedPalette);
    } catch (err) {
        res.status(400).json({ message: "❌ Fehler beim Aktualisieren", error: err.message });
    }
});

// ➤ ✅ Palette löschen (DELETE)
app.delete('/api/palettes/:id', async (req, res) => {
    try {
        const deletedPalette = await Palette.findByIdAndDelete(req.params.id);
        if (!deletedPalette) return res.status(404).json({ message: "❌ Palette nicht gefunden" });
        res.json({ message: "✅ Palette gelöscht" });
    } catch (err) {
        res.status(500).json({ message: "❌ Fehler beim Löschen", error: err.message });
    }
});

// ➤ ✅ Standard-Route
app.get('/', (req, res) => {
    res.send('✅ Palettenverwaltung API ist aktiv!');
});

// ➤ Server starten
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));
