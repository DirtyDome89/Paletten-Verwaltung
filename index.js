import express from 'express';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import Palette from './models/palette.js';

const app = express();
app.use(express.json()); // Middleware für JSON-Daten

const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://mongodb:27017/palettenDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB verbunden'))
  .catch((err) => console.log(err));

// POST: Neue Palette erstellen
app.post('/api/palettes', [
  // Validierung der Eingabefelder
  body('name').isLength({ min: 3 }).withMessage('Name muss mindestens 3 Zeichen lang sein'),
  body('type').isIn(['EUR', 'USD']).withMessage('Ungültiger Typ'),
  body('quantity').isInt({ gt: 0 }).withMessage('Quantity muss eine positive Zahl sein'),
  body('location').not().isEmpty().withMessage('Location darf nicht leer sein')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, type, quantity, location } = req.body;
  try {
    const newPalette = new Palette({ name, type, quantity, location });
    await newPalette.save();
    res.status(201).json(newPalette);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Alle Paletten mit Filter und Pagination
app.get('/api/palettes', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'asc', search = '' } = req.query;
    const palettes = await Palette.find({
      name: { $regex: search, $options: 'i' }, // Suchfilter für Name
    })
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json(palettes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Server starten
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
