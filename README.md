# Tune-Nest Music Player
🎵 Tunenext

Tunenext is a music streaming web application built with ASP.NET (C#) for the backend, React.js for the frontend, and MongoDB Atlas as the database. The project is deployed on AWS for scalability and performance.

🚀 Implemented Features

🎶 Browse and play songs in real-time

📂 Store and fetch music data from MongoDB Atlas

🔐 User authentication using JWT

🔑 Social login with Google Sign-In

📂 Playlist creation and management

🌐 Responsive frontend with React.js

☁️ Deployment on AWS
----------------------------------------------------------------------------------------------
🛠️ Tech Stack

Frontend:

  React.js

  HTML, CSS, JavaScript

Backend:

  ASP.NET Web API (C#)

  RESTful API architecture

Database:

  MongoDB Atlas (cloud-hosted NoSQL database)

Deployment & Tools:

  AWS (EC2 / S3 / Lambda, depending on setup)

GitHub for version control

⚙️ Installation & Setup
    1. Clone the Repository
    git clone https://github.com/chetan-thorat/Tune-Nest-Music-Player
    cd tunenext

    2. Backend Setup (ASP.NET)
    
    Navigate to the backend folder:
    
    cd backend


Configure appsettings.json with your MongoDB Atlas URI:

"ConnectionStrings": {
  "MongoDB": "your-mongodb-connection-uri"
}


Run the project:

dotnet run


Backend will be available at http://localhost:5000 (or configured port).

-----------------------------------------------------------------------------------------

3. Frontend Setup (React.js)

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Configure API endpoint in .env:

REACT_APP_API_URL=http://localhost:5000/api


Start the frontend:

npm start


App runs at http://localhost:3000.
----------------------------------------------------------------------------------
☁️ Deployment on AWS

Frontend deployed on AWS (e.g., S3 + CloudFront or EC2).

Backend deployed on AWS (EC2 / Elastic Beanstalk).

Database hosted on MongoDB Atlas.
----------------------------------------------------------------------------------------
📌 Project Structure
Tunenext/
│── backend/         # ASP.NET Web API (C#)
│── frontend/        # React.js frontend
│── README.md        # Project documentation
-----------------------------------------------------------------------------------
🔮 Future Enhancements

📱 Mobile-friendly UI/UX improvements

🌍 Global CDN integration for faster streaming

🎼 Recommendation system using AI
