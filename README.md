🛠 Tech Stack
Frontend: HTML5, CSS3 (Custom Variables & Flexbox), Vanilla JavaScript (ES6+).

Backend Simulator: JSON Server.

State Management: localStorage for cross-page data persistence (e.g., Campaign IDs).

💻 Installation & Setup
Clone the Repository:
git clone repoLink
Install Dependencies: Make sure you have Node.js installed, then install JSON Server globally:
npm install -g json-server
Run the Backend Server: Navigate to the project folder and start the server on port 3000:
json-server --watch db.json --port 3000
Launch the Frontend: Open index.html using a local server (like Live Server in VS Code) to avoid CORS issues.

📊 Database Structure
The project uses a db.json file with the following collections:

campaigns: Stores title, description, goal, currentAmount, and approval status.

pledges: Stores donation amounts linked by campaignId.

users: Stores user data
