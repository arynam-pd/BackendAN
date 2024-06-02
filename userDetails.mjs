const mongoose = require("mongoose");

const UserDetailsScehma = new mongoose.Schema(
  {
    movieid: String,
    userid: String,
  },
  {
    collection: "UserDetails",
  }
);

mongoose.model("UserDetails", UserDetailsScehma);
