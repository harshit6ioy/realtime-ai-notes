const express=require("express");
const router=express.Router();
const {createNote,getAllNotes,getNoteById,updateNote,deleteNote,getPublicNotes,generateNoteWithAI,generateAndSaveNote}=require("../controllers/noteController");
const authMiddleware=require("../middleware/authMiddleware");

// Public route - must come BEFORE :id route
router.get("/public",getPublicNotes);

// Protected routes
router.post("/create",authMiddleware,createNote);
router.get("/all",authMiddleware,getAllNotes);
router.get("/:id",authMiddleware,getNoteById);
router.put("/update/:id",authMiddleware,updateNote);
router.delete("/delete/:id",authMiddleware,deleteNote);
router.post("/generate",authMiddleware,generateNoteWithAI);
router.post("/generate-save",authMiddleware,generateAndSaveNote);

module.exports=router;
