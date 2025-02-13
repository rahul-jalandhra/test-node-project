const jwt = require("jsonwebtoken");

//Generate Access Token (short-lived)
const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" }); // Expires in 15 minutes
};

//Generate Refresh Token (long-lived)
const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }); // Expires in 7 days
};

//Verify Refresh Token
const verifyRefreshToken = (token) => {
    return jwt.verify(token.replace("Bearer ", ""), process.env.JWT_REFRESH_SECRET);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };
