function Footer() {
  return (
    <footer className="border-t-2 border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white px-12 py-12 mt-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold mb-3 dark:text-white">
            📝 NoteFlow
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Smart note-taking app to organize your thoughts, boost productivity,
            and manage ideas efficiently.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Quick Links</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
            <li className="hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium">
              Home
            </li>
            <li className="hover:text-blue-600 transition cursor-pointer font-medium">
              Features
            </li>
            <li className="hover:text-blue-600 transition cursor-pointer font-medium">
              Contact
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Connect</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 font-medium">
            support@noteflow.com
          </p>
          <div className="flex gap-4 text-gray-600 text-lg">
            <span className="hover:text-blue-600 cursor-pointer transition">🌐</span>
            <span className="hover:text-blue-600 cursor-pointer transition">🐦</span>
            <span className="hover:text-blue-600 cursor-pointer transition">💼</span>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-200 pt-6">
        © {new Date().getFullYear()} NoteFlow. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;