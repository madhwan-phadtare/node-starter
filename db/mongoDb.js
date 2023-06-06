const mongoose = require("mongoose");
require("dotenv").config();


const mongoURI = process.env.URL;

/**
 * Establishes the connection to the MongoDB database
 */
const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

// Export the connection function
module.exports = {
  connectToDatabase,
};
