const admin = require("firebase-admin");
const serviceAccount = require("./esferasoft-test-firebase-adminsdk-fbsvc-c2b6634455.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // Firebase Storage Bucket URL
});

const bucket = admin.storage().bucket();

module.exports = { bucket };