const mongoose = require("mongoose");

const UpcomingMovieDetailsScehma = new mongoose.Schema(
  {
    Pid: String,
    name: String,
    image: String,
    formattedDate: String,
  },
  {
    collection: "UpcomingMovieDetails",
  }
);

mongoose.model("UpcomingMovieDetails", UpcomingMovieDetailsScehma);
