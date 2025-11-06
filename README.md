DreamDay is a modern, elegant, and user-friendly wedding planner web application built with React and Vite.
It helps couples organize every part of their wedding — from tasks and vendors to guests and schedules — all in one simple dashboard.

✨ Features

🕊️ Secure Authentication — Manage personal wedding plans safely.

🗓️ Task Management — Add, update, and track wedding tasks.

💌 Guest List Management — Keep an organized list of attendees.

💐 Vendor Coordination — Track services like catering, venue, and decoration.

🎨 Dual Theme — Switch between elegant light and romantic dark modes.

📱 Responsive Design — Looks perfect on all devices.

⚡ Fast Performance — Powered by Vite’s lightning-fast build system.

🧰 Tech Stack
Category	Technology
Frontend	React + Vite
Styling	Tailwind CSS
State Management	React Hooks / Context API
Routing	React Router DOM
Auth (optional)	Clerk
Build Tool	Vite
🏗️ Project Structure
dreamday/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── package.json
├── vite.config.js
└── README.md

⚙️ Installation & Setup

Follow these steps to run DreamDay on your local machine.

1️⃣ Clone the Repository
git clone https://github.com/<your-username>/dreamday.git
cd dreamday

2️⃣ Install Dependencies
npm install

3️⃣ Add Environment Variables

Create a .env file in the project root and include any necessary keys (e.g., Clerk, API URL):

VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5000


Check .env.example for reference.

4️⃣ Run the Development Server
npm run dev


Visit http://localhost:5173
 to view the app in your browser.

5️⃣ Build for Production
npm run build


To preview the production build locally:

npm run preview

🛡️ License

This project is licensed under the MIT License.

👩‍💻 Developer

Author: Takudzwa Kanokanga
GitHub: @Takudzwa-Kanokanga