const express = require("express");
const dotenv = require("dotenv").config();
const { connectToDatabase } = require("./db/mongoDb");
const routes = require("./routes/routes");

const app = express();
const port = process.env.port || 3001;

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use("/", routes);

// Connect to the database and start the server
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
