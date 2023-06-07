# Fresher's Training Portal

The Fresher's Training Portal is a project that provides an API for managing and tracking the training progress and performance of interns. This platform allows interns to view their weekly ratings provided by mentors based on various performance factors. It aims to facilitate effective training and provide valuable feedback to interns for their professional development.

## Features

- **Weekly Ratings**: Interns can access their weekly ratings provided by mentors, reflecting their progress in performance factors such as Assessment, Attendance & Participation, Time Management, Communication Skills, Assignments, and Mentor's Feedback.
- **Insightful Feedback**: Interns gain insights into their strengths and areas for improvement, enabling them to track their progress and enhance their performance.
- **Secure Authentication**: User authentication is implemented to ensure secure access to the platform and protect the privacy of interns' data.
- **API Documentation**: The API is documented using Swagger, providing clear and comprehensive documentation for developers to understand and integrate the API into their applications.

## API Endpoints

The API provides the following endpoints:

- `GET /interns/{id}`: Retrieves the weekly ratings for a specific intern based on their ID.

## Technologies Used

- Node.js
- Express.js
- MongoDB (or any other preferred database)
- Swagger for API documentation

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB installed (or any other preferred database) and running locally or accessible remotely

### Installation

1. Clone the repository:

```shell
git clone <repository-url>

2. Install the dependencies:

cd fresher-training-portal
npm install

3. Set up the environment variables:

Create a .env file and configure the necessary environment variables (e.g., database connection details, port number).

4.Run the application:

npm start

The API will be accessible at http://localhost:<port>, where <port> is the configured port number.

### Installation

The API is documented using Swagger. To access the API documentation, start the application and navigate to http://localhost:<port>/api-docs.
