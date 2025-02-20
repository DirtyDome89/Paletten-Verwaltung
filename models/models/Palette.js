code models/Palette.js
const mongoose = require('mongoose');

const paletteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantity: { type: Number, required: true },
    location: String,
    reference: { type: String, default: null },  // Neue Referenz für Ausgleichsbuchungen
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'Carrier' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    createdAt: { type: Date, default: Date.now }
});

const Palette = mongoose.model('Palette', paletteSchema);
module.exports = Palette;
