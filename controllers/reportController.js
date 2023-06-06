
const ProjectReport = require("../models/ProjectReport");
const WeeklyReports = require("../models/WeeklyReport");

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

  console.log(weeklyReports[0]);

  const data = {
    name: weeklyReports[0].menteeName,
    grade: "Always Target",
    emailId: weeklyReports[0].menteeEmailId,
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

module.exports = { fetchReports, calculateFinalReports };
