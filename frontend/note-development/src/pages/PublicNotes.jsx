import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function PublicNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  let API_URL = import.meta.env.VITE_API_URL || "https://realtime-ai-notes.onrender.com/api";
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
    fetchPublicNotes();
  }, []);

  const fetchPublicNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/notes/public`);
      setNotes(res.data.notes);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notes.");
    } finally {
      setLoading(false);
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
        <Link to="/">
          <h1 className="text-3xl font-bold text-amber-900 dark:text-blue-400 cursor-pointer hover:text-blue-600 transition">
            📝 NoteFlow
          </h1>
        </Link>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-6 py-2.5 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Signup
          </Link>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📚 Public Notes Library
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            Explore shared notes from the community.
          </p>
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
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No public notes yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 font-medium">
              Check back later or login to create your own notes!
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md"
            >
              Create Your Note
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note, index) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition border border-gray-200 dark:border-slate-700 p-6 h-80"
              >
                {/* Note Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 flex-1 pr-4" title={note.title}>
                    {note.title}
                  </h3>
                  <div className="text-xs px-2 py-1 rounded-md bg-green-100 border border-green-300 text-green-700 font-bold">
                    PUBLIC
                  </div>
                </div>

                {/* Author Info */}
                {note.user && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-3">
                    By <span className="text-blue-600 font-bold">{note.user.name}</span>
                  </div>
                )}

                {/* Content Preview */}
                <div className="flex-1 overflow-hidden relative mt-2 mb-4">
                  <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed line-clamp-4">
                    {stripMarkdown(note.content)}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent"></div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                    {new Date(note.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default PublicNotes;
