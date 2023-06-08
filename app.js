const express = require("express");
const dotenv = require("dotenv").config();
const { connectToDatabase } = require("./db/mongoDb");
const routes = require("./routes/routes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const cors = require('cors');


const app = express();
const port = process.env.port || 3001;


// Swagger configuration options
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Performance Report Management(Backend)",
      version: "1.0.0",
      description:
        "The project is a Fresher's Training Portal that provides an API for managing and tracking the training progress and performance of interns. Interns can access their weekly ratings provided by their mentors, which reflect their performance in various factors such as Assessment, Attendance & Participation, Time Management, Communication Skills, Assignments, and Mentor's Feedback. The API endpoint allows interns to retrieve their weekly ratings, providing them with valuable insights into their progress and areas for improvement throughout their training program.",
    },
  },
  apis: ["./routes/*.js"], // Path to the API routes files
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use("/", routes);

// Enable CORS for all routes
app.use(cors());

// Serve Swagger API documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
