const ProjectReport = require("./models/WeeklyReport"); // Correct the import statement

const fs = require("fs");

// Create a function to insert the dummy data
async function insertDummyData() {
  try {
    let rawData = fs.readFileSync("DummyDataWeekly.json");
    // let rawData = {};
    const data = JSON.parse(rawData);

    // Insert the dummy data into the database
    const insertedData = await ProjectReport.create(data);

    console.log("Dummy data inserted successfully:", insertedData);
  } catch (error) {
    console.error("Error inserting dummy data:", error);
  }
}

// Call the function to insert the dummy data
insertDummyData();
