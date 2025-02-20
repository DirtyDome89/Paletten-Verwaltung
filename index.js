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

app.get('/api/palettes', async (req, res) => {
    try {
        const { location, type, sort, page = 1, limit = 10 } = req.query;

        let filter = {};
        if (location) filter.location = location;
        if (type) filter.type = type;

        let query = Palette.find(filter);

        // ✅ Sortierung hinzufügen
        if (sort) {
            const sortField = sort === "quantity" ? { quantity: 1 } : { createdAt: -1 };
            query = query.sort(sortField);
        }

        // ✅ Paginierung
        const skip = (page - 1) * limit;
        const palettes = await query.skip(skip).limit(parseInt(limit));

        res.json(palettes);
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Abrufen der Paletten!", error: err.message });
    }
});


app.post('/api/palettes', async (req, res) => {
    try {
        const { name, type, quantity, location } = req.body;

        // ✅ Validierung: Pflichtfelder prüfen
        if (!name || !type || quantity === undefined) {
            return res.status(400).json({ message: "Name, Typ und Menge sind erforderlich!" });
        }

        // ✅ Regel: Negativbuchung nur mit type "Ausgleichsbuchung"
        if (quantity < 0 && type !== "Ausgleichsbuchung") {
            return res.status(400).json({ message: "Negative Mengen sind nur für Ausgleichsbuchungen erlaubt!" });
        }

        // ✅ Neues Paletten-Objekt erstellen
        const palette = new Palette({ name, type, quantity, location });
        await palette.save();
        res.status(201).json(palette);
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Erstellen der Palette!", error: err.message });
    }
});


// ✅ PUT: Palette aktualisieren
app.put('/api/palettes/:id', async (req, res) => {
    try {
        const { quantity } = req.body;

        // ✅ Validierung: ID-Format prüfen
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Ungültige ID! Bitte eine gültige MongoDB-ObjectId nutzen." });
        }

        // ✅ Regel: Negativbuchungen prüfen
        if (quantity < 0) {
            const palette = await Palette.findById(req.params.id);
            if (!palette || palette.type !== "Ausgleichsbuchung") {
                return res.status(400).json({ message: "Negative Mengen sind nur für Ausgleichsbuchungen erlaubt!" });
            }
        }

        const updatedPalette = await Palette.findByIdAndUpdate(
            req.params.id,
            { quantity },
            { new: true, runValidators: true }
        );

        if (!updatedPalette) {
            return res.status(404).json({ message: "Palette nicht gefunden!" });
        }

        res.json(updatedPalette);
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Aktualisieren der Palette!", error: err.message });
    }
});


app.delete('/api/palettes/:id', async (req, res) => {
    try {
        // ✅ Validierung: ID prüfen
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Ungültige ID! Bitte eine gültige MongoDB-ObjectId nutzen." });
        }

        const deletedPalette = await Palette.findByIdAndDelete(req.params.id);
        if (!deletedPalette) {
            return res.status(404).json({ message: "Palette nicht gefunden!" });
        }

        res.json({ message: "Palette erfolgreich gelöscht!", deletedPalette });
    } catch (err) {
        res.status(500).json({ message: "Fehler beim Löschen der Palette!", error: err.message });
    }
});


// Server starten
app.listen(PORT, () => console.log(`✅ Server läuft auf Port ${PORT}`));

