const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/auth");
const { signUpSchema } = require("../utils/schema");
const refreshTokensStore=[]
// Signup Controller
const signup = async (req, res) => {
    try {
        await signUpSchema.validate(req.body, { abortEarly: false });
        const { name, email, password } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "Email already in use" });

        // Create user
        const newUser = new User({ name, email, password });
        await newUser.save();

        // Generate tokens
        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);
        refreshTokensStore.push(refreshToken)
        res.status(201).json({
            status: "success",
            statusCode: 200,
            data: {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res.status(400).json({ 
                status: "failed",
                errors: error.inner.map(err => ({ field: err.path, message: err.message }))
            });
        }

        res.status(500).json({ message: error.message });
    }
};

// Login Controller
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user in DB
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email!" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        refreshTokensStore.push(refreshToken)
        res.json({
            status: "success",
            statusCode: 200,
            data: {
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Refresh Token Controller
const refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token is required" });

    if (!refreshTokensStore.includes(refreshToken)) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

module.exports = { signup, login, refreshToken };
