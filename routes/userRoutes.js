const express = require("express");
const {
    updateUser,
    deleteUser,
    getUser,
} = require("../controllers/userController");

const router = express.Router();

router.get("/", getUser);         // Get All Users
router.put("/", updateUser);    // Update User
router.delete("/", deleteUser); // Delete User

module.exports = router;
