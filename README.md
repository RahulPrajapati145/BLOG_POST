A simple blog application where users can sign up, log in, and create, read, update, and delete (CRUD) their blog posts. Built with Node.js, Express.js, MySQL, and EJS.

✨ Features

User Signup with password hashing using bcrypt
User Login/Logout with session management
Flash messages for success and error alerts using connect-flash
Create, view, edit, and delete blog posts (only by logged-in users)
Authorization: Users can only edit/delete their own posts
UI templating with EJS and layout engine ejs-mate
Basic styling with Bootstrap

🛠️ Technologies Used

Backend: Node.js, Express.js
Database: MySQL (via mysql2 package)
Templating: EJS, ejs-mate
Authentication: express-session, bcrypt, connect-flash
Styling: Bootstrap 5

📂 Project Structure

blog-post-app/
|
├── public/             # Static files (CSS, images)
├── views/              # EJS templates (login.ejs, signup.ejs, index.ejs, etc.)
|
├── index.js            # Main server file
├── package.json
└── README.md

⚙️ Setup Instructions

1. Clone the repository

git clone https://github.com/your-username/blog-post-app.git
cd blog-post-app

2. Install dependencies

npm install

3. Set up MySQL database

CREATE DATABASE postDB;

USE postDB;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE posts (
  id VARCHAR(255) PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  content TEXT NOT NULL
);

4. Start the app

node index.js
# or use nodemon
nodemon index.js

Visit http://localhost:3000 in your browser.

🧪 Test User (optional)

You can sign up directly on the app, or insert a test user manually:
