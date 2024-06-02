const mongoose = require("mongoose");

const MovieFeedbackDetailsScehma = new mongoose.Schema(
  {
    feedback: String,
    rating: Number,
  },
  {
    collection: "MovieFeedbackDetails",
  }
);

mongoose.model("MovieFeedbackDetails", MovieFeedbackDetailsScehma);
