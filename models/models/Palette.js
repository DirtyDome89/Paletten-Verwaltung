const mongoose = require('mongoose');

const paletteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true, min: -9999 }, // ✅ Erlaubt negative Werte
    location: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Palette = mongoose.model('Palette', paletteSchema);

module.exports = Palette;
