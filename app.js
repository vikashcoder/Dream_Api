const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const chance = require('chance').Chance();

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    console.log(`Incoming signal from the ether: ${req.method} ${req.url}`);
    next();
});

// MongoDB Connection
mongoose.connect("mongodb+srv://vikash29raj:mongodb@cluster0.iga7u.mongodb.net/dreams?retryWrites=true&w=majority", {
    serverSelectionTimeoutMS: 15000, // Increase timeout
    connectTimeoutMS: 15000, // Increase connection timeout
    socketTimeoutMS: 20000,  // Allow more time for requests
    useNewUrlParser: true, 
    useUnifiedTopology: true
})

.then(() => console.log('Connected to the subconscious mind...'))
.catch(err => console.error('Failed to connect to the dream realm:', err));

// Schema and Model
const dreamSchema = new mongoose.Schema({
    dreamer: { type: String, required: true, default: 'Anonymous Dreamer' },
    date: { type: Date, default: Date.now },
    description: { type: String, required: true },
    themes: [String],
    lucid: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5, default: 3 },
    dreamHash: { type: String, unique: true, index: true }
});

dreamSchema.pre('save', function(next) {
    if (!this.dreamHash) {
        this.dreamHash = chance.md5(this.dreamer + this.description + this.date.getTime());
    }
    next();
});

const Dream = mongoose.model('Dream', dreamSchema);

// Controllers
const dreamController = {
    getAllDreams: async (req, res) => {
        try {
            const dreams = await Dream.find().sort({ date: -1 });
            res.json(dreams);
        } catch (err) {
            res.status(500).json({ message: `The dreamscape wavers... ${err.message}` });
        }
    },

    createDream: async (req, res) => {
        try {
            const dream = new Dream(req.body);
            const newDream = await dream.save();
            res.status(201).json(newDream);
        } catch (err) {
            if (err.code === 11000) {
                res.status(409).json({ message: 'This dream already exists in your subconscious!' });
            } else {
                res.status(400).json({ message: `Dream creation falters... ${err.message}` });
            }
        }
    },

    getDreamById: async (req, res) => {
        try {
            const dream = await Dream.findById(req.params.id);
            if (!dream) {
                return res.status(404).json({ message: "That dream has faded from memory..." });
            }
            res.json(dream);
        } catch (err) {
            res.status(500).json({ message: `Lost in the labyrinth... ${err.message}` });
        }
    },

    updateDream: async (req, res) => {
        try {
            const dream = await Dream.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!dream) {
                return res.status(404).json({ message: "The dream eludes revision..." });
            }
            res.json(dream);
        } catch (err) {
            if (err.code === 11000) {
                res.status(409).json({ message: 'This dream already exists in your subconscious!' });
            }
            res.status(400).json({ message: `Reality distorts... ${err.message}` });
        }
    },

    deleteDream: async (req, res) => {
        try {
            const dream = await Dream.findByIdAndDelete(req.params.id);
            if (!dream) {
                return res.status(404).json({ message: "That dream has vanished..." });
            }
            res.json({ message: 'Dream released from the archives.' });
        } catch (err) {
            res.status(500).json({ message: `The dreamscape crumbles... ${err.message}` });
        }
    },

    analyzeDreamThemes: async (req, res) => {
        try {
            const dream = await Dream.findById(req.params.id);
            if (!dream) {
                return res.status(404).json({ message: "That dream has faded from memory..." });
            }
            const possibleThemes = ['Loss', 'Fear', 'Achievement', 'Anxiety', 'Confusion', 'Change'];
            const suggestedThemes = chance.pickset(possibleThemes, chance.integer({ min: 1, max: possibleThemes.length - 1 }));
            dream.themes = dream.themes.concat(suggestedThemes);
            dream.lucid = chance.bool({ likelihood: 30 });
            const ratingModifier = chance.integer({ min: -1, max: 1 });
            dream.rating = Math.max(1, Math.min(5, dream.rating + ratingModifier));
            await dream.save();

            res.json({ message: "Analysis complete!", suggestedThemes, newLucidity: dream.lucid, newRating: dream.rating });
        } catch (err) {
            res.status(500).json({ message: `Lost in the labyrinth... ${err.message}` });
        }
    },

    findDreamsByTheme: async (req, res) => {
        try {
            const theme = req.query.theme;
            const dreams = await Dream.find({ themes: theme });
            res.json(dreams);
        } catch (err) {
            res.status(500).json({ message: `Lost in the labyrinth... ${err.message}` });
        }
    }
};

// Routes
app.get('/dreams', dreamController.getAllDreams);
app.post('/dreams', dreamController.createDream);
app.get('/dreams/:id', dreamController.getDreamById);
app.put('/dreams/:id', dreamController.updateDream);
app.delete('/dreams/:id', dreamController.deleteDream);
app.put('/dreams/:id/analyze', dreamController.analyzeDreamThemes);
app.get('/dreams/theme/find', dreamController.findDreamsByTheme);

module.exports = app;
