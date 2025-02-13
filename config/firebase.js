const admin = require("firebase-admin");

admin.initializeApp({
    credential: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY
    },
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Firebase Storage Bucket URL
});

const bucket = admin.storage().bucket();

module.exports = { bucket };