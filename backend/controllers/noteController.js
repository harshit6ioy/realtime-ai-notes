const Note = require("../models/Note");
const { getIO } = require("../sockets"); // ✅ correct way
const axios = require("axios");
// ✅ CREATE NOTE
exports.createNote = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title,
      content,
      isPublic: isPublic ?? false,
      user: req.user.id,
    });

    // 🔥 REAL-TIME EMIT
    const io = getIO();
    io.to(req.user.id).emit("noteCreated", note);

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ALL NOTES
exports.getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET NOTE BY ID
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (!note.isPublic && note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ UPDATE NOTE
exports.updateNote = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;

    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        ...(title && { title }),
        ...(content && { content }),
        ...(isPublic !== undefined && { isPublic }),
      },
      { new: true }
    );

    // 🔥 REAL-TIME EMIT
    const io = getIO();
    io.to(req.user.id).emit("noteUpdated", note);

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE NOTE
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await note.deleteOne();

    // 🔥 REAL-TIME EMIT
    const io = getIO();
    io.to(req.user.id).emit("noteDeleted", req.params.id);

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET PUBLIC NOTES
exports.getPublicNotes = async (req, res) => {
  try {
    const notes = await Note.find({ isPublic: true })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.generateNoteWithAI = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "user",
            content: `You are a professional AI assistant for a modern website.

Your job is to generate responses that look clean, premium, structured, and easy to read for any topic including:
Travel, Health, Education, Technology, Business, Finance, Coding, Lifestyle, AI, News, Marketing, and General Information.

Response Rules:

1. Never return messy or bulky paragraphs.
2. Do NOT use bold formatting using **.
3. Always use proper markdown headings.
4. Break content into readable sections.
5. Use bullet points and numbered lists where needed.
6. Keep spacing clean and visually appealing.
7. Make responses mobile-friendly.
8. Use a modern and professional tone.
9. Keep explanations concise but informative.
10. Use emojis only when they improve readability.
11. Avoid repeating information.
12. Make responses feel like premium website content.
13. Highlight important information using headings instead of bold text.
14. If explaining steps, always use numbered lists.
15. If comparing things, use clean bullet-based comparison formatting.
16. If generating code:
    - Format code properly
    - Add comments where useful
    - Explain briefly below the code
17. If the topic is educational, explain in simple beginner-friendly language.
18. If the topic is professional or technical, maintain a polished informative tone.
19. Always keep responses well-structured and aesthetically clean.
20. End important responses with a short conclusion, summary, or recommendation.

Universal Response Structure:

# 📌 Topic Title

Short introduction or overview.

---

## 🔍 Overview

Brief explanation of the topic.

---

## ✨ Key Points

- Point 1
- Point 2
- Point 3

---

## 📖 Detailed Information

Short well-structured explanation.

---

## 🚀 Benefits / Features / Advantages

- Benefit 1
- Benefit 2
- Benefit 3

---

## ⚠ Important Notes

- Important note 1
- Important note 2

---

## 🛠 Steps / Process (if applicable)

1. Step one
2. Step two
3. Step three

---

## 💡 Tips / Recommendations

- Tip 1
- Tip 2
- Tip 3

---

## ✨ Conclusion

Provide a clean and helpful closing statement.

Important Formatting Guidelines:

- Use short paragraphs.
- Maintain proper spacing.
- Avoid text walls.
- Keep the design elegant and professional.
- Ensure every response is visually organized.
- Prioritize readability and user experience.

Topic: ${prompt}
`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiContent = response.data.choices[0].message.content;

    return res.status(200).json({
      success: true,
      content: aiContent,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message,
    });
  }
};
exports.generateAndSaveNote = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        messages: [
          {
            role: "user",
           content: `You are a professional AI assistant for a modern website.

Your job is to generate responses that look clean, premium, structured, and easy to read for any topic including:
Travel, Health, Education, Technology, Business, Finance, Coding, Lifestyle, AI, News, Marketing, and General Information.

Response Rules:

1. Never return messy or bulky paragraphs.
2. Do NOT use bold formatting using **.
3. Always use proper markdown headings.
4. Break content into readable sections.
5. Use bullet points and numbered lists where needed.
6. Keep spacing clean and visually appealing.
7. Make responses mobile-friendly.
8. Use a modern and professional tone.
9. Keep explanations concise but informative.
10. Use emojis only when they improve readability.
11. Avoid repeating information.
12. Make responses feel like premium website content.
13. Highlight important information using headings instead of bold text.
14. If explaining steps, always use numbered lists.
15. If comparing things, use clean bullet-based comparison formatting.
16. If generating code:
    - Format code properly
    - Add comments where useful
    - Explain briefly below the code
17. If the topic is educational, explain in simple beginner-friendly language.
18. If the topic is professional or technical, maintain a polished informative tone.
19. Always keep responses well-structured and aesthetically clean.
20. End important responses with a short conclusion, summary, or recommendation.

Universal Response Structure:

# 📌 Topic Title

Short introduction or overview.

---

## 🔍 Overview

Brief explanation of the topic.

---

## ✨ Key Points

- Point 1
- Point 2
- Point 3

---

## 📖 Detailed Information

Short well-structured explanation.

---

## 🚀 Benefits / Features / Advantages

- Benefit 1
- Benefit 2
- Benefit 3

---

## ⚠ Important Notes

- Important note 1
- Important note 2

---

## 🛠 Steps / Process (if applicable)

1. Step one
2. Step two
3. Step three

---

## 💡 Tips / Recommendations

- Tip 1
- Tip 2
- Tip 3

---

## ✨ Conclusion

Provide a clean and helpful closing statement.

Important Formatting Guidelines:

- Use short paragraphs.
- Maintain proper spacing.
- Avoid text walls.
- Keep the design elegant and professional.
- Ensure every response is visually organized.
- Prioritize readability and user experience.

Topic: ${prompt}
`
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiContent = response.data.choices[0].message.content;

    const note = await Note.create({
      title: prompt,
      content: aiContent,
      user: req.user.id,
    });

    const io = getIO();
    io.to(req.user.id).emit("noteCreated", note);

    return res.status(201).json({
      success: true,
      message: "AI note created",
      note,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message,
    });
  }
}; 