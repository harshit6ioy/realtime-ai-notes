import { Link } from "react-router-dom";
import banner from "../assets/banner.png";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 dark:from-slate-950 dark:to-slate-900 text-gray-900 dark:text-white transition-colors duration-300">
      {/* NAVBAR */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-between items-center px-12 py-6 bg-white dark:bg-slate-900 shadow-sm border-b border-gray-200 dark:border-slate-800 sticky top-0 z-20"
      >
        <h1 className="text-3xl font-bold text-amber-900 dark:text-blue-400">
          📝 NoteFlow
        </h1>

        <div className="flex gap-4 items-center">
          <Link
            to="/public-notes"
            className="px-6 py-2.5 font-bold rounded-lg transition text-gray-700 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            📚 Public Notes
          </Link>

          <Link
            to="/login"
            className="px-6 py-2.5 font-bold rounded-lg transition text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-6 py-2.5 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded-lg transition shadow-md"
          >
            Signup
          </Link>
        </div>
      </motion.nav>

      {/* HERO */}
      <div className="min-h-[calc(100vh-80px)] flex items-center px-12 py-20">
        <div className="grid md:grid-cols-2 items-center gap-16 w-full max-w-6xl mx-auto">
          {/* LEFT */}
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center"
          >
            {/* BADGE */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <span className="px-4 py-2 text-sm font-bold rounded-full inline-block bg-amber-100 dark:bg-blue-900 text-amber-900 dark:text-blue-200">
                🚀 Smart Note Taking
              </span>
            </motion.div>

            {/* HEADING */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-gray-900 dark:text-white"
            >
              Your Ideas,{" "}
              <span className="text-blue-600">
                Beautifully Organized
              </span>
            </motion.h2>

            {/* SUBTEXT */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg mb-10 max-w-lg leading-relaxed font-bold text-gray-600 dark:text-gray-400"
            >
              Capture, organize, and share your notes with elegance. A professional note-taking experience designed for clarity and productivity.
            </motion.p>

            {/* BUTTONS */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-5"
            >
              <Link
                to="/signup"
                className="bg-blue-600 px-8 py-3.5 rounded-lg text-lg font-bold hover:bg-blue-700 transition text-white shadow-md"
              >
                Get Started
              </Link>

              <Link
                to="/login"
                className="border-2 px-8 py-3.5 rounded-lg text-lg font-bold transition border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center items-center"
          >
            <motion.img
              src={banner}
              alt="Note Taking"
              className="w-full max-w-md rounded-2xl shadow-lg dark:shadow-2xl border border-gray-200 dark:border-slate-700"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;