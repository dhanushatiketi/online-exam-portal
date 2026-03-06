const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    rollno: { type: String, required: true },
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: "student"
    }
});

module.exports = mongoose.model("User", userSchema);