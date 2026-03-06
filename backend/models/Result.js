const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    rollno: { type: String, required: true },
    studentName: { type: String, required: true },
    email: { type: String, required: true },
    exam: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [{
        questionText: { type: String, required: true },
        selectedOption: { type: String, required: true },
        correctAnswer: { type: String, required: true },
        isCorrect: { type: Boolean, required: true }
    }],
    submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);
