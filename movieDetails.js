const mongoose = require("mongoose");

const MovieDetailsScehma = new mongoose.Schema(
  {
    Pid: String,
    name: String,
    information: String,
    trailerLink: String,
    downloadLink: String,
    image: String,
    language: String,
    genre: String,
    category: String,
    formattedDate: String,
  },
  {
    collection: "MovieDetails",
  }
);

mongoose.model("MovieDetails", MovieDetailsScehma);
