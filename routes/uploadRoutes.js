const express = require("express");
const multer = require("multer");
const { uploadAvatar } = require("../controllers/uploadController");

const router = express.Router();

// Configure Multer for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload avatar & update user
router.post("/upload/avatar/", upload.single("file"), uploadAvatar);

module.exports = router;