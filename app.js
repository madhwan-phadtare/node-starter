const express = require("express");
const ProjectReport = require("./models/ProjectReport");
const WeeklyReports = require("./models/WeeklyReport");
const { connectToDatabase } = require("./db/mongoDb");

const app = express();
const port = 3000;

// Fetch project reports and weekly reports based on emailId
async function fetchReports(emailId) {
  try {
    const projectReports = await ProjectReport.find({ menteeEmailId: emailId });
    const weeklyReports = await WeeklyReports.find({ menteeEmailId: emailId });
    return { projectReports, weeklyReports };
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
}

// Calculate aggregated reports for each week
function calculateWeeklyReports(weeklyReports) {
  let weekWiseReports = {};

  weeklyReports.forEach((report) => {
    if (!weekWiseReports[report.weekNumber]) {
      weekWiseReports[report.weekNumber] = [];
    }
    weekWiseReports[report.weekNumber].push(report);
  });

  const actualReports = [];

  weekWiseReports = Object.keys(weekWiseReports).map((key) => {
    const singleWeekTotalReports = {};
    const oneWeekReports = weekWiseReports[key];

    let mentorFeedbacks = [];
    let timeManagement = 0;
    let overallAssessment = 0;
    let communicationSkill = 0;
    let attendanceParticipation = 0;
    let assignment = 0;

    const len = oneWeekReports.length;

    oneWeekReports.forEach((report) => {
      mentorFeedbacks.push(report.remarks);
      timeManagement += report.timeManagement;
      overallAssessment += report.overallAssessment;
      communicationSkill += report.communicationSkills;
      attendanceParticipation += report.attendanceParticipation;
      assignment += report.overallAssessment;
    });

    timeManagement = timeManagement / len;
    overallAssessment = overallAssessment / len;
    communicationSkill = communicationSkill / len;
    attendanceParticipation = attendanceParticipation / len;
    assignment = assignment / len;

    singleWeekTotalReports.weekId = key;
    singleWeekTotalReports.mentorFeedbacks = mentorFeedbacks;
    singleWeekTotalReports.timeManagement = timeManagement;
    singleWeekTotalReports.overallAssessment = overallAssessment;
    singleWeekTotalReports.communicationSkill = communicationSkill;
    singleWeekTotalReports.attendanceParticipation = attendanceParticipation;
    singleWeekTotalReports.assignment = assignment;
    singleWeekTotalReports.startingDate = oneWeekReports[0].weekStartDate;
    singleWeekTotalReports.endingDate = oneWeekReports[0].weekEndDate;

    actualReports.push(singleWeekTotalReports);
  });

  return actualReports;
}

// Calculate final reports
function calculateFinalReports(weeklyReports) {
  const finalReports = {
    status: "success",
    message: "success",
  };

  const data = {
    name: weeklyReports[0].name,
    grade: "Always Target",
    emailId: weeklyReports[0].emailId,
    attendanceParticipation: 0,
    communicationSkill: 0,
    timeManagement: 0,
    mockProject: 0,
    averageScore: 0,
    assessment: 0,
    weeks: calculateWeeklyReports(weeklyReports),
  };

  data.weeks.forEach((report) => {
    data.communicationSkill += report.communicationSkill;
    data.attendanceParticipation += report.attendanceParticipation;
    data.timeManagement += report.timeManagement;
  });

  data.communicationSkill /= data.weeks.length;
  data.attendanceParticipation /= data.weeks.length;
  data.timeManagement /= data.weeks.length;

  finalReports.data = data;
  return finalReports;
}

// API endpoint to fetch reports for a specific user
app.get("/report/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const { projectReports, weeklyReports } = await fetchReports(userId);
    const result = calculateFinalReports(weeklyReports);
    // console.log(JSON.stringify(result));
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Error fetching project reports" });
  }
});

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });
