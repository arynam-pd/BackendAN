const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors({origin: 'http://localhost:3000'}));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
require('dotenv').config();

const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./imageDetails");
require("./movieDetails")
require("./userDetails")
const deleteImage = require('./deleteImage');

// Parse JSON request bodies
app.use(express.json());

const Images = mongoose.model("ImageDetails");
const Movie = mongoose.model("MovieDetails");
const User = mongoose.model("UserDetails");

app.listen(5000, () => {
  console.log("Server Started");
});

// Define the route for deleting an image
app.post('/delete-image', deleteImage);

// Get Single Movie Data
app.post("/singleMovieData/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const movie = await Movie.findOne({ _id: _id });
    if (movie) {
      res.send({ status: "ok", data: movie });
    } else {
      res.send({ status: "not found", data: null });
    }
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Post the count of Movies, Web Series, and Anime by category
app.post("/categoryCounts", async (req, res) => {
  const { userid } = req.body;
  try {
    const favouriteMovieIds = await User.distinct("movieid", { userid: userid });
    const movieCount = await Movie.find({ _id: { $in: favouriteMovieIds } }).countDocuments({ category: "Movies" });
    const webSeriesCount = await Movie.find({ _id: { $in: favouriteMovieIds } }).countDocuments({ category: "Web-Series" });
    const animeCount = await Movie.find({ _id: { $in: favouriteMovieIds } }).countDocuments({ category: "Anime" });
    res.send({
      status: "ok",
      data: {
        movies: movieCount,
        webSeries: webSeriesCount,
        anime: animeCount,
      },
    });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Get Web Series by Category
app.post("/webSeriesByCategory", async (req, res) => {
  const { category } = req.body; // Assuming the category is sent in the request body
  try {
    const Movies = await Movie.find({ category: category });
    if (Movies.length > 0) {
      res.send({ status: "ok", data: Movies });
    } else {
      res.send({ status: "not found", data: null });
    }
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Post All Movie Data
app.post("/movieData", async (req, res) => {
  try {
    const allMovies = await Movie.find().sort({ _id: -1 }); // Sort by _id in descending order
    res.send({ status: "ok", data: allMovies });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Get All Movie Data
app.get("/allMovieData", async (req, res) => {
  try {
    const allMovies = await Movie.find().sort({ _id: -1 }); // Sort by _id in descending order
    res.send({ status: "ok", data: allMovies });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Upload Movie
app.post("/upload-movie", async (req, res) => {
  const { Pid, name, information, trailerLink, downloadLink, language, image, genre, category, formattedDate } = req.body;
  try {
    await Movie.create({
      Pid,
      name,
      information,
      trailerLink,
      downloadLink,
      language,
      image,
      genre,
      category,
      formattedDate,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Delete Movie
app.post("/deleteMovie", async (req, res) => {
  const { movie_id } = req.body;
  try {
    Movie.deleteOne({ _id: movie_id }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

//Update Movie Details
app.post("/movieUpdate", (req,res) => {
  Movie.findByIdAndUpdate(req.body._id, {downloadLink:req.body.downloadLink},(err, data) =>{
    if(err){
      return res.status(500).send(err)
    }else{
      return res.status(200).send(data)
    }
  })
});

// API endpoint to add a movie to the user's favorites
app.post("/favourate-movie", async (req, res) => {
  const { movieid, userid } = req.body;
  try {
    const existingFavorite = await User.findOne({ movieid, userid });
    if (existingFavorite) {
      res.send({ status: "already_in_favorites", data: existingFavorite });
    } else {
      await User.create({
        movieid,
        userid,
      });
      res.send({ status: "ok" });
    }
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Get all favorites movie data of user
app.post("/allFavoritesMovie", async (req, res) => {
  const { userid } = req.body;
  try {
    const favouriteMovieIds = await User.distinct("movieid", { userid: userid });
    const favouriteMovies = await Movie.find({ _id: { $in: favouriteMovieIds } }).sort({ _id: -1 });
    res.send({ status: "ok", data: favouriteMovies });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

// Remove movie from favourite list
app.post("/removeMovie", async (req, res) => {
  const { movie_id, userid } = req.body;

  try {
    // Remove the movie from the User collection
    await User.deleteOne({ movieid: movie_id, userid: userid });

    res.send({ status: "ok", data: "Deleted" });
  } catch (error) {
    res.send({ status: "error", data: error.message });
  }
});
