import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingPublic, setTogglingPublic] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let API_URL = import.meta.env.VITE_API_URL;
  if (API_URL && API_URL.includes("localhost")) {
    API_URL = API_URL.replace("localhost", window.location.hostname);
  }

  const stripMarkdown = (text) => {
    if (!text) return "";
    return text
      .replace(/[#*_~`>]/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/\n+/g, " ")
      .trim();
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotes();
  }, [token, navigate]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/notes/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data.notes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`${API_URL}/notes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete note.");
    }
  };

  const togglePublic = async (id, currentStatus) => {
    try {
      setTogglingPublic(id);
      await axios.put(
        `${API_URL}/notes/update/${id}`,
        { isPublic: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotes(notes.map((note) =>
        note._id === id ? { ...note, isPublic: !currentStatus } : note
      ));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update note.");
    } finally {
      setTogglingPublic(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 border-red-300";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
      {/* Header */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-20 flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-slate-800"
      >
        <h1 className="text-3xl font-bold text-amber-900 dark:text-white">📝 NoteFlow</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/public-notes")}
            className="px-6 py-2.5 border-2 border-green-500 text-green-700 font-bold rounded-lg hover:bg-green-50 transition"
          >
            📚 Public Notes
          </button>
          <button
            onClick={() => navigate("/create")}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            + New Note
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-white font-bold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-700 transition"
          >
            Logout
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Your Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-semibold">Manage and organize your notes seamlessly.</p>
        </motion.div>

        {error && (
          <div className="bg-red-100 border-2 border-red-300 text-red-700 px-6 py-4 rounded-lg mb-8 font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-blue-600"></div>
          </div>
        ) : notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No notes yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">Create your first note to get started.</p>
            <button
              onClick={() => navigate("/create")}
              className="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Create First Note
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 dark:border-slate-700 p-6 flex flex-col h-80 group"
              >
                {/* Note Header */}
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 flex-1" title={note.title}>
                    {note.title}
                  </h3>
                  <div className={`text-xs px-3 py-1 rounded-md border-2 font-bold whitespace-nowrap ${getPriorityColor(note.priority)}`}>
                    {note.priority}
                  </div>
                </div>

                {/* Public Badge */}
                {note.isPublic && (
                  <div className="inline-block w-fit text-xs px-3 py-1 rounded-md bg-green-100 border border-green-300 text-green-700 font-bold mb-3">
                    🌍 PUBLIC
                  </div>
                )}

                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {note.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-md font-semibold">
                        #{tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-medium">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Content Preview */}
                <div className="flex-1 overflow-hidden relative mt-2 mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed line-clamp-5">
                    {stripMarkdown(note.content)}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    {new Date(note.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePublic(note._id, note.isPublic)}
                      disabled={togglingPublic === note._id}
                      className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 text-sm rounded-lg transition font-bold disabled:opacity-50"
                      title={note.isPublic ? "Make Private" : "Make Public"}
                    >
                      {note.isPublic ? "🌍" : "🔒"}
                    </button>
                    <button
                      onClick={() => navigate(`/edit/${note._id}`, { state: { note } })}
                      className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm rounded-lg transition font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-sm rounded-lg transition font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
