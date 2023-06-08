const ProjectReport = require("../models/ProjectReport");
const WeeklyReports = require("../models/WeeklyReport");

/**
 * Fetch project reports and weekly reports based on emailId
 * @param {string} emailId - Mentee's email ID
 * @returns {Object} - Object containing projectReports and weeklyReports
 */
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

/**
 * Calculate aggregated reports for each week
 * @param {Array} weeklyReports - Array of weekly reports
 * @returns {Array} - Array of calculated weekly reports
 */
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
    singleWeekTotalReports.timeManagement = Math.round(timeManagement*100)/100;
    singleWeekTotalReports.overallAssessment = Math.round(overallAssessment*100)/100;
    singleWeekTotalReports.communicationSkill = Math.round(communicationSkill*100)/100;
    singleWeekTotalReports.attendanceParticipation = Math.round(attendanceParticipation*100)/100;
    singleWeekTotalReports.assignment = Math.round(assignment*100)/100;
    singleWeekTotalReports.startingDate = oneWeekReports[0].weekStartDate;
    singleWeekTotalReports.endingDate = oneWeekReports[0].weekEndDate;

    actualReports.push(singleWeekTotalReports);
  });

  return actualReports;
}

/**
 * Calculate average score for project reports
 * @param {Array} projectReports - Array of project reports
 * @returns {number} - Average score
 */
function calculateMockProject(projectReports) {
  let totalScore = 0;
  const numReports = projectReports.length;

  for (let i = 0; i < numReports; i++) {
    const report = projectReports[i];
    totalScore +=
      report.useCaseUnderstandingInterpretation +
      report.logicApplied +
      report.techLearnedVsImplemented +
      report.solutionExplanationClarity;
  }

  const averageScore = totalScore / (numReports * 4);
  return averageScore;
}

/**
 * Get score description based on the score value
 * @param {number} score - Score value
 * @returns {string} - Score description
 */
function getScoreDescription(score) {
  if (score >= 0 && score <= 2.5) {
    return "Below Threshold";
  } else if (score > 2.5 && score <= 3.0) {
    return "Threshold";
  } else if (score > 3.0 && score <= 3.25) {
    return "Mostly Target";
  } else if (score > 3.25 && score <= 3.5) {
    return "Always Target";
  } else if (score > 3.5 && score <= 3.8) {
    return "Mostly Outstanding";
  } else if (score > 3.8 && score <= 4.0) {
    return "Always Outstanding";
  } else {
    return "Invalid score";
  }
}



/**
 * Calculate final reports
 * @param {Array} projectReports - Array of project reports
 * @param {Array} weeklyReports - Array of weekly reports
 * @returns {Object} - Object containing final reports
 */
function calculateFinalReports(projectReports, weeklyReports) {
  if (projectReports.length === 0 && weeklyReports.length === 0) {
    return {
      success: false,
      message: "Bad request. Invalid email ID provided or intern not found.",
      data: null,
    };
  }

  const finalReports = {
    success: true,
    message: "Success. Returns the Performance Report Management data.",
  };

  const data = {
    name: weeklyReports[0].menteeName,
    grade: "",
    emailId: weeklyReports[0].menteeEmailId,
    attendanceParticipation: 0,
    communicationSkill: 0,
    timeManagement: 0,
    mockProject: Math.round(calculateMockProject(projectReports) * 100) / 100,
    averageScore: 0,
    assessment: 0,
    weeks: calculateWeeklyReports(weeklyReports),
  };

  data.weeks.forEach((report) => {
    data.communicationSkill += report.communicationSkill;
    data.attendanceParticipation += report.attendanceParticipation;
    data.timeManagement += report.timeManagement;
    data.assessment += report.assignment;
  });

  data.communicationSkill /= data.weeks.length;
  data.attendanceParticipation /= data.weeks.length;
  data.timeManagement /= data.weeks.length;
  data.assessment /= data.weeks.length * 25;

  data.communicationSkill = Math.round(data.communicationSkill * 100) / 100;
  data.attendanceParticipation = Math.round(data.attendanceParticipation * 100) / 100;
  data.timeManagement = Math.round(data.timeManagement * 100) / 100;
  data.assessment = Math.round(data.assessment * 100) / 100;

  data.averageScore =
    data.communicationSkill +
    data.attendanceParticipation +
    data.timeManagement +
    data.assessment +
    data.mockProject;
  data.averageScore /= 5;

  data.averageScore = Math.round(data.averageScore * 100) / 100;

  data.grade = getScoreDescription(data.averageScore);

  finalReports.data = data;

  return finalReports;
}


module.exports = { fetchReports, calculateFinalReports };
