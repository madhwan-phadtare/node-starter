const express = require("express");
const { fetchReports, calculateFinalReports } = require("../controllers/reportController");

const router = express.Router();

// API endpoint to fetch reports for a specific user
router.get("/report/:id", async (req, res) => {
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

module.exports = router;
