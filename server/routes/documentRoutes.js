const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createDocument,
  getDocument,
  updateDocument,
  getUserDocuments,
  updateTitle,
  shareDocument,
  deleteDocument,
  getHistory,
  addComment,
  getComments,
} = require("../controllers/documentController");

router.post("/", authMiddleware, createDocument);
router.get("/", authMiddleware, getUserDocuments);
router.get("/:id", authMiddleware, getDocument);
router.put("/:id", authMiddleware, updateDocument);
router.put("/:id/title", authMiddleware, updateTitle);
router.post("/:id/share", authMiddleware, shareDocument);
router.delete("/:id", authMiddleware, deleteDocument);
router.get("/:id/history", authMiddleware, getHistory);
router.post("/:id/comment", authMiddleware, addComment);
router.get("/:id/comments", authMiddleware, getComments);

module.exports = router;
