const mongoose = require('mongoose');

// Definiere das Schema für Paletten
const paletteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Erstelle das Modell für Paletten basierend auf dem Schema
const Palette = mongoose.model('Palette', paletteSchema);

// Exportiere das Modell, damit es in anderen Dateien verwendet werden kann
module.exports = Palette;
