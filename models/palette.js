// models/palette.js

import mongoose from 'mongoose';

const paletteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['EUR', 'USD'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Erstellt automatisch `createdAt` und `updatedAt` Felder
});

// Das Palette-Modell exportieren
const Palette = mongoose.model('Palette', paletteSchema);
export default Palette;
