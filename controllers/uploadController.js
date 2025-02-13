const { bucket } = require("../config/firebase");
const User = require("../models/User");
const path = require('path');

// Upload Avatar 
exports.uploadAvatar = async (req, res) => {
    try {
        const { id } = req.user;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const file = req.file;
        const filename = `uploads/${id}-avatar${path.extname(file.originalname)}`;
        const fileUpload = bucket.file(filename);

        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });

        stream.on("error", (err) => {
            console.error("Upload Error:", err);
            res.status(500).json({ message: "File upload failed", error: err.message });
        });

        stream.on("finish", async () => {
            // Make the file publicly accessible (Optional)
            await fileUpload.makePublic();

            // Get the public URL
            const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
            user.avatar = fileUrl;
            await user.save();
            res.status(200).json({ statusCode: 200, status: 'success', message: "File uploaded successfully", avatar: fileUrl });

        });
        stream.end(file.buffer);
    } catch (error) {
        res.status(500).json({ message: "File upload failed", error: error.message });
    }
};
