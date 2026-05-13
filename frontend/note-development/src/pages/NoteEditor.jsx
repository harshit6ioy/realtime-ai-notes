import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

function NoteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showAiGenerator, setShowAiGenerator] = useState(false);

  const [aiTitle, setAiTitle] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);

  const [socket, setSocket] = useState(null);
  const [cursors, setCursors] = useState({});
  const editorRef = useRef(null);

  const token = localStorage.getItem("token");
  let API_URL = import.meta.env.VITE_API_URL || "https://realtime-ai-notes.onrender.com/api";
  if (API_URL && API_URL.includes("localhost")) {
    API_URL = API_URL.replace("localhost", window.location.hostname);
  }

  useEffect(() => {
    if (location.state?.note) {
      const note = location.state.note;
      setTitle(note.title);
      setContent(note.content);
      setCategory(note.category || "General");
      setPriority(note.priority || "Medium");
      setTags(note.tags?.join(", ") || "");
      setIsPublic(note.isPublic || false);
    }
  }, [location.state]);


  useEffect(() => {
    if (!id) {
      const draft = { title, content, category, priority, tags };
      localStorage.setItem("noteDraft", JSON.stringify(draft));
    }
  }, [title, content, category, priority, tags, id]);

  useEffect(() => {
    if (!id) {
      const handleStorageChange = (e) => {
        if (e.key === "noteDraft" && e.newValue) {
          const draft = JSON.parse(e.newValue);
          setTitle(draft.title || "");
          setContent(draft.content || "");
          setCategory(draft.category || "General");
          setPriority(draft.priority || "Medium");
          setTags(draft.tags || "");
        }
      };

      const initialDraftStr = localStorage.getItem("noteDraft");
      if (initialDraftStr && !title && !content) {
        const draft = JSON.parse(initialDraftStr);
        setTitle(draft.title || "");
        setContent(draft.content || "");
        setCategory(draft.category || "General");
        setPriority(draft.priority || "Medium");
        setTags(draft.tags || "");
      }

      window.addEventListener("storage", handleStorageChange);
      return () => window.removeEventListener("storage", handleStorageChange);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const socketUrl = API_URL.replace("/api", "");
      const newSocket = io(socketUrl);
      setSocket(newSocket);

      newSocket.emit("joinNoteRoom", id);

      newSocket.on("cursorMove", (data) => {
        setCursors((prev) => ({ ...prev, [data.socketId]: data }));
      });

      newSocket.on("noteContentChange", (newContent) => {
        setContent(newContent);
      });

      newSocket.on("userDisconnected", (socketId) => {
        setCursors((prev) => {
          const newCursors = { ...prev };
          delete newCursors[socketId];
          return newCursors;
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [id, API_URL]);

  const handleMouseMove = (e) => {
    if (!socket || !id) return;
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};
    
    socket.emit("cursorMove", {
      roomId: id,
      x: e.clientX,
      y: e.clientY,
      userId: user._id,
      userName: user.name || "Anonymous",
    });
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (socket && id) {
      socket.emit("noteContentChange", { roomId: id, content: newContent });
    }
  };

  const saveNote = async () => {
    if (!title.trim()) {
      setMessage("⚠️ Title is required!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setSaving(true);
      const noteData = {
        title,
        content,
        category,
        priority,
        isPublic,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      };

      if (id) {
        await axios.put(
          `${API_URL}/notes/update/${id}`,
          noteData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMessage("✅ Note updated successfully!");
      } else {
        await axios.post(
          `${API_URL}/notes/create`,
          noteData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        localStorage.removeItem("noteDraft");
        setMessage("✅ Note created successfully!");
      }

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMessage("❌ Error saving note: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const generateNoteWithAI = async () => {
    if (!aiTitle.trim() || !aiDescription.trim()) {
      setMessage("⚠️ Please enter both title and description!");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    try {
      setAiLoading(true);

      const userMsg = `Title: ${aiTitle}\nDescription: ${aiDescription}`;
      setAiMessages([...aiMessages, { role: "user", text: userMsg }]);

      const res = await axios.post(
        `${API_URL}/notes/generate`,
        { 
          prompt: `Title: ${aiTitle}\nDescription: ${aiDescription}`
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const aiContent = res.data.content || res.data.message;

      setAiMessages((prev) => [...prev, { role: "assistant", text: aiContent }]);

      setTitle(aiTitle);
      setContent(aiContent);
      setMessage("✅ Note generated by AI! Review and save it.");
      setAiTitle("");
      setAiDescription("");
    } catch (err) {
      console.log("🔥 FULL ERROR:", err.response?.data || err);

      setMessage("❌ AI Error: " + (err.response?.data?.message || err.message));
      setAiMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          text: "Sorry, I couldn't generate the note. Please try again with a different prompt." 
        },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const applyGeneratedNote = () => {
    if (title && content) {
      setShowAiGenerator(false);
      setMessage("✅ Generated note loaded! Now you can edit and save it.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 dark:from-slate-950 dark:to-slate-900 p-8 transition-colors duration-300"
      onMouseMove={handleMouseMove}
      ref={editorRef}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          {id ? "✏️ Edit Note" : "📝 Create Note"}
        </h1>
        <div className="flex gap-3 relative z-10">
          <button
            onClick={() => setShowAiGenerator(!showAiGenerator)}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-md"
          >
            🤖 {showAiGenerator ? "Close AI" : "Generate with AI"}
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-bold rounded-lg transition"
          >
            ← Back
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg font-semibold ${
          message.includes("✅") ? "bg-green-100 border-2 border-green-300 text-green-700" :
          message.includes("❌") ? "bg-red-100 border-2 border-red-300 text-red-700" :
          "bg-yellow-100 border-2 border-yellow-300 text-yellow-700"
        }`}>
          {message}
        </div>
      )}

      {showAiGenerator && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto border-2 border-gray-200 dark:border-slate-700">
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b-2 border-gray-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">🤖 Generate Note with AI</h2>
                <button
                  onClick={() => setShowAiGenerator(false)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl font-bold transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-900 dark:text-white font-bold text-lg mb-3">
                    📌 Note Title
                  </label>
                  <input
                    type="text"
                    value={aiTitle}
                    onChange={(e) => setAiTitle(e.target.value)}
                    placeholder="e.g., How to Build a Successful Startup"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 transition-all text-lg"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 dark:text-white font-bold text-lg mb-3">
                    📝 Description / Topic
                  </label>
                  <textarea
                    value={aiDescription}
                    onChange={(e) => setAiDescription(e.target.value)}
                    placeholder="Describe what you want the AI to write about..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-blue-500 transition-all resize-none h-28 text-lg"
                  />
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg border-2 border-gray-300 p-4 h-64 overflow-y-auto space-y-4">
                {aiMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-center text-lg">
                      💬 Enter a title and description, then click Generate
                    </p>
                  </div>
                ) : (
                  aiMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-md px-4 py-3 rounded-lg text-base leading-relaxed ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={generateNoteWithAI}
                  disabled={aiLoading}
                  className="flex-1 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 text-lg shadow-md"
                >
                  {aiLoading ? "⏳ Generating..." : "✨ Generate Note"}
                </button>
                <button
                  onClick={applyGeneratedNote}
                  disabled={!title || !content}
                  className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 text-lg shadow-md"
                >
                  ✅ Apply & Edit
                </button>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 border-2 border-gray-300">
                <p className="text-gray-700 text-sm font-bold mb-3">💡 Quick Templates:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { title: "Meeting Notes", desc: "Create professional meeting notes" },
                    { title: "Project Plan", desc: "Outline a new project plan" },
                    { title: "Daily Journal", desc: "Write today's journal entry" },
                    { title: "Learning Guide", desc: "Create a tutorial or guide" },
                  ].map((template, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setAiTitle(template.title);
                        setAiDescription(template.desc);
                      }}
                      className="text-left px-3 py-2 bg-white hover:bg-gray-50 text-gray-900 rounded-lg transition-all text-sm border-2 border-gray-300 hover:border-blue-500"
                    >
                      <p className="font-semibold">{template.title}</p>
                      <p className="text-xs text-gray-600">{template.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        <div className="lg:col-span-3 space-y-4">
          <div className="card">
            <label className="label">📌 Note Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="input-field text-lg"
            />
          </div>

          <div className="card">
            <label className="label">📄 Content</label>
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start typing your note... or use AI to generate content!"
              className="input-field h-96 resize-none"
            />
            <div className="mt-3 text-slate-500 dark:text-slate-400 text-sm font-semibold">
              {content.length} characters • {content.split("\n").length} lines
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={saveNote}
              disabled={saving}
              className="flex-1 px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 text-lg shadow-md"
            >
              {saving ? "💾 Saving..." : "💾 Save Note"}
            </button>
            <button
              onClick={() => {
                setTitle("");
                setContent("");
                setCategory("General");
                setPriority("Medium");
                setTags("");
              }}
              className="flex-1 px-6 py-4 bg-gray-300 dark:bg-slate-700 hover:bg-gray-400 dark:hover:bg-slate-600 text-gray-900 dark:text-white font-bold rounded-lg transition-all duration-300 text-lg"
            >
              🔄 Clear All
            </button>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <div className="card sticky top-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-5">⚙️ Options</h3>

            <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700/50">
              <label className="flex items-center cursor-pointer gap-3">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 rounded accent-blue-600 cursor-pointer"
                />
                <span className="text-slate-900 dark:text-white font-bold text-sm">
                  {isPublic ? "🌍 PUBLIC" : "🔒 PRIVATE"}
                </span>
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 ml-8">
                {isPublic ? "✅ Visible on Public Notes" : "✅ Only you can see"}
              </p>
            </div>

            <div className="mb-4">
              <label className="label">📂 Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Ideas">Ideas</option>
                <option value="Todo">Todo</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="label">🚀 Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="input-field"
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟡 Medium</option>
                <option value="High">🔴 High</option>
              </select>
            </div>

            <div>
              <label className="label">🏷️ Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="tag1, tag2..."
                className="input-field"
              />
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">📊 Stats</h3>
            <div className="space-y-2 text-slate-600 dark:text-slate-400 text-sm font-semibold">
              <p>Words: {content.split(/\s+/).filter(w => w).length}</p>
              <p>Characters: {content.length}</p>
              <p>Paragraphs: {content.split("\n\n").filter(p => p).length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;