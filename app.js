const express = require("express");
// const ProjectReport = require("./models/ProjectReport");
const WeeklyReports = require("./models/WeeklyReport");
// const {connectToDatabase} = require("./db/mongoDb");
const WeeklyReport = require("./models/WeeklyReport");

const app = express();
const port = 3000;

async function fetchProjectReports(emailId) {
  try {
    const projectReports = await ProjectReport.find({ menteeEmailId: emailId });
    const weeklyReports = await WeeklyReports.find({ menteeEmailId: emailId });
    // console.log("Project Reports:", projectReports);
    // console.log("Weekly Reports:", weeklyReports);
    return { projectReports, weeklyReports };
  } catch (error) {
    console.error("Error fetching project reports:", error);
    throw error;
  }
}

app.get("/report/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const { projectReports, weeklyReports } = await fetchProjectReports(userId);

    console.log(weeklyReports);

    let useCaseUnderstandingTotal = 0;
    let logicAppliedTotal = 0;
    let techLearnedImplementedTotal = 0;
    let solutionExplanationClarityTotal = 0;

    projectReports.forEach((report) => {
      useCaseUnderstandingTotal += report.useCaseUnderstandingInterpretation;
      logicAppliedTotal += report.logicApplied;
      techLearnedImplementedTotal += report.techLearnedVsImplemented;
      solutionExplanationClarityTotal += report.solutionExplanationClarity;
    });

    const averageScores = {
      useCaseUnderstanding: useCaseUnderstandingTotal / projectReports.length,
      logicApplied: logicAppliedTotal / projectReports.length,
      techLearnedImplemented:
        techLearnedImplementedTotal / projectReports.length,
      solutionExplanationClarity:
        solutionExplanationClarityTotal / projectReports.length,
    };

    res.json(averageScores);
  } catch (error) {
    res.status(500).json({ error: "Error fetching project reports" });
  }
});

// connectToDatabase()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Server listening on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Error connecting to the database:", error);
//   });
