const mongoose = require("mongoose");
const Question = require("./models/Question");

const mongoURI = "mongodb://localhost:27017/examDB";

const sampleQuestions = [
    {
        examName: "General Knowledge",
        questionText: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        examName: "General Knowledge",
        questionText: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
    },
    {
        examName: "General Knowledge",
        questionText: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correctAnswer: "Pacific"
    },
    {
        examName: "JavaScript Basics",
        questionText: "Which company developed JavaScript?",
        options: ["Netscape", "Microsoft", "Sun Microsystems", "Oracle"],
        correctAnswer: "Netscape"
    },
    {
        examName: "JavaScript Basics",
        questionText: "Which symbol is used for single-line comments in JavaScript?",
        options: ["//", "/*", "#", "<!--"],
        correctAnswer: "//"
    },
    {
        examName: "JavaScript Basics",
        questionText: "Inside which HTML element do we put the JavaScript?",
        options: ["<script>", "<javascript>", "<scripting>", "<js>"],
        correctAnswer: "<script>"
    },
    {
        examName: "Python Basics",
        questionText: "What is the correct file extension for Python files?",
        options: [".pt", ".pyth", ".py", ".pyt"],
        correctAnswer: ".py"
    },
    {
        examName: "Python Basics",
        questionText: "How do you create a variable with the numeric value 5?",
        options: ["x = 5", "x = int(5)", "Both are correct", "None of the above"],
        correctAnswer: "Both are correct"
    },
    {
        examName: "HTML & CSS",
        questionText: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Tool Markup Language"],
        correctAnswer: "Hyper Text Markup Language"
    },
    {
        examName: "HTML & CSS",
        questionText: "What is the correct HTML element for inserting a line break?",
        options: ["<break>", "<lb>", "<br>", "<b>"],
        correctAnswer: "<br>"
    }
];

mongoose.connect(mongoURI)
    .then(async () => {
        console.log("Connected to MongoDB at " + mongoURI);

        try {
            await Question.deleteMany({});
            console.log("Cleared existing questions.");

            await Question.insertMany(sampleQuestions);
            console.log("Sample questions inserted successfully.");
        } catch (error) {
            console.error("Error inserting questions:", error);
        } finally {
            mongoose.disconnect();
            console.log("Disconnected from MongoDB.");
        }
    })
    .catch(err => {
        console.error("MongoDB Connection Error:", err);
    });
