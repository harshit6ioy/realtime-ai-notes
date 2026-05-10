# NoteFlow (Note Development)

NoteFlow is a modern, full-stack note-taking web application built with a focus on real-time collaboration, artificial intelligence integration, and a premium UI design.

## Features

- **Real-Time Collaboration**: Edit notes with others simultaneously using WebSockets (Socket.io). You can even see live cursors of collaborators.
- **AI Note Generation**: Generate professional notes, project plans, and journals instantly using integrated AI.
- **Modern Premium UI**: Beautiful, fully responsive design powered by Tailwind CSS featuring glassmorphism and modern aesthetics.
- **Rich Organization**: Sort notes by category, tags, priority, and toggle public/private visibility.
- **Public Note Sharing**: Share your notes globally with a single click.
- **Secure Authentication**: Secure JWT-based user authentication system.

## Tech Stack

### Frontend
- **React.js** (via Vite)
- **Tailwind CSS** (Styling & Design System)
- **Framer Motion** (Smooth Page Animations)
- **Socket.io-client** (Real-time synchronization)
- **Axios** (API requests)
- **React Router** (Navigation)

### Backend
- **Node.js & Express** (RESTful API)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **Socket.io** (WebSocket server for collaboration)
- **JWT** (Authentication)

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Add your AI API Key here (e.g., GEMINI_API_KEY)
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend/note-development
npm install
```

Create a `.env` file in the `frontend/note-development` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

## Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Sign up for a new account or log in.
3. Start creating, organizing, and collaborating on your notes!

## License
MIT
