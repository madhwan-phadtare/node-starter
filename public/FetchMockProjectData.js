const ProjectReport = require("../models/ProjectReport");

// Fetch data from the "projectreports" collection
async function fetchProjectReports() {
  try {
    // Find all documents in the collection
    const projectReports = await ProjectReport.find({
      menteeEmailId: "madhwan@quantiphi.com",
    });
    console.log("Project Reports:", projectReports);
  } catch (error) {
    console.error("Error fetching project reports:", error);
  }
}

// Call the function to fetch project reports
fetchProjectReports();
