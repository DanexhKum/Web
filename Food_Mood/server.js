require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({ dest: 'uploads/' });

// Mood-to-Recipe Mapping
const MOOD_RECIPE_MAP = {
  happy: 'dessert',
  sad: 'comfort food',
  stressed: 'tea',
  angry: 'spicy'
};

// Spoonacular API Fetch
app.get('/api/get-recipes', async (req, res) => {
  const { mood } = req.query;
  
  if (!process.env.SPOONACULAR_API_KEY) {
    return res.status(400).json({ error: 'API key not configured' });
  }

  try {
    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query: MOOD_RECIPE_MAP[mood] || 'pasta',
        apiKey: process.env.SPOONACULAR_API_KEY,
        number: 3,
        addRecipeInformation: true
      }
    });
    res.json(response.data.results);
  } catch (error) {
    console.error('Spoonacular error:', error.message);
    res.status(500).json({ error: 'Failed to fetch recipes. Try mock mode!' });
  }
});

// Mock voice analysis endpoint
app.post('/api/analyze-mood', upload.single('audio'), (req, res) => {
  const moods = ['happy', 'sad', 'stressed', 'angry'];
  const randomMood = moods[Math.floor(Math.random() * moods.length)];
  res.json({ mood: randomMood });
});

// Mock recipes endpoint
app.get('/api/mock-recipes', (req, res) => {
  const { mood } = req.query;
  const mockData = require('../public/mockRecipes.js');
  res.json(mockData[mood] || []);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));