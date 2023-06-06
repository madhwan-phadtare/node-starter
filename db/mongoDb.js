const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://madhwanphadtere123:madhwanphadtere123@cluster0.1ceawxm.mongodb.net/?retryWrites=true&w=majority";

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
