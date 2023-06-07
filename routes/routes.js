const express = require("express");
const {
  fetchReports,
  calculateFinalReports,
} = require("../controllers/reportController");

const router = express.Router();

/**
 * @swagger
 * /report/{id}:
 *   get:
 *     summary: Fetch Performance Report Management of an intern by email ID.
 *     description: Retrieve the Performance Report Management for a specific intern in the Fresher's Training Portal by providing their email ID as a parameter. This API endpoint fetches the relevant data and delivers it to the frontend for display and analysis.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Email ID of the intern.
 *         schema:
 *           type: string
 *           format: email
 *     responses:
 *       200:
 *         description: Success. Returns the Performance Report Management data.
 *       400:
 *         description: Bad request. Invalid email ID provided or intern not found.
 *       401:
 *         description: Unauthorized. User authentication required.
 *       500:
 *         description: Internal server error. Failed to fetch the Performance Report Management data.
 */

router.get("/report/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const { projectReports, weeklyReports } = await fetchReports(userId);
    const result = calculateFinalReports(projectReports, weeklyReports);

    if (result.data == null) {
      res.status(400).json(result);
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching project reports" });
  }
});

module.exports = router;
