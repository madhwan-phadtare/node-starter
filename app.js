const express = require("express");
const { connectToDatabase } = require("./db/mongoDb");
const { fetchReports, calculateFinalReports } = require("./controllers/reportController");

const app = express();
const port = 3000;

// API endpoint to fetch reports for a specific user
app.get("/report/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const { projectReports, weeklyReports } = await fetchReports(userId);
    const result = calculateFinalReports(projectReports, weeklyReports);
    // console.log(JSON.stringify(result));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching project reports" });
  }
});

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
