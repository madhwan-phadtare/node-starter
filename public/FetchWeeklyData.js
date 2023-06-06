const WeeklyReport = require("../models/WeeklyReport");

async function fetchWeeklyReports() {
  try {
    const WeeklyReports = await WeeklyReport.find({
      menteeEmailId: "madhwan@quantiphi.com",
    });
    console.log("Weekly Reports:", WeeklyReports);
  } catch (error) {
    console.log("Error fetching project reports:", error);
  }
}

fetchWeeklyReports();
