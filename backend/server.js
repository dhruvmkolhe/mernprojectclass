require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');

const Watchlist = require('./models/Watchlist');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cineverse';

mongoose.connect(MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
// TMDB Proxy Route
app.use('/api/tmdb', async (req, res) => {
  try {
    const endpoint = req.url; // Contains the path after /api/tmdb
    const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
    // Add the API key securely from environment variable
    url.searchParams.set("api_key", process.env.TMDB_API_KEY);
    
    // Forward all other query parameters
    Object.keys(req.query).forEach(key => {
      url.searchParams.set(key, req.query[key]);
    });

    const response = await axios.get(url.toString());
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});
// Get Watchlist by User ID
app.get('/api/watchlist/:userId', async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ userId: req.params.userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId: req.params.userId, movies: [] });
      await watchlist.save();
    }
    res.json(watchlist.movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle Movie in Watchlist
app.post('/api/watchlist/:userId/toggle', async (req, res) => {
  try {
    const { userId } = req.params;
    const { movie } = req.body;

    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId, movies: [] });
    }

    const movieIndex = watchlist.movies.findIndex(m => m.id === movie.id);
    let added = false;
    
    if (movieIndex > -1) {
      watchlist.movies.splice(movieIndex, 1); // remove
    } else {
      watchlist.movies.push(movie); // add
      added = true;
    }

    await watchlist.save();
    res.json({ added, movies: watchlist.movies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
