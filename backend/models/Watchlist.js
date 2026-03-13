const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  overview: { type: String },
  poster_path: { type: String },
  backdrop_path: { type: String },
  vote_average: { type: Number },
  release_date: { type: String },
  genre_ids: [{ type: Number }],
});

const WatchlistSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  movies: [MovieSchema],
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
