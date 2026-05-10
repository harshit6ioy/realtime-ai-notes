import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NoteEditor from "./pages/NoteEditor";
import PublicNotes from "./pages/PublicNotes";
import ThemeToggle from "./components/ThemeToggle";

function App() {
  return (
    <Router>
      <ThemeToggle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/public-notes" element={<PublicNotes />} />

        {/* Dashboard and Note Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<NoteEditor />} />
        <Route path="/edit/:id" element={<NoteEditor />} />
      </Routes>
    </Router>
  );
}

export default App;