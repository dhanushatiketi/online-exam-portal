const Question = require("../models/Question");
const Result = require("../models/Result");
const User = require("../models/User");

exports.getQuestions = async (req, res) => {
    try {
        // Fetch all questions or optionally filter by exam query
        const questions = await Question.find({});
        // Depending on requirements, we shouldn't send 'correctAnswer' to frontend, but for simplicity we will handle evaluation here.
        // Send questions without answers to front end
        const safeQuestions = questions.map(q => ({
            _id: q._id,
            examName: q.examName,
            questionText: q.questionText,
            options: q.options
        }));
        res.json(safeQuestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.submitExam = async (req, res) => {
    try {
        const { answers, examName } = req.body;
        // answers is expected to be an array of objects: [{ questionId, selectedOption }]

        let score = 0;
        const questions = await Question.find({ examName });
        const totalQuestions = questions.length;
        const answersData = [];

        for (const ans of answers) {
            const question = questions.find(q => q._id.toString() === ans.questionId);
            if (question) {
                const isCorrect = question.correctAnswer === ans.selectedOption;
                if (isCorrect) score++;

                answersData.push({
                    questionText: question.questionText,
                    selectedOption: ans.selectedOption,
                    correctAnswer: question.correctAnswer,
                    isCorrect
                });
            }
        }

        const user = await User.findById(req.user.id);

        const resultData = {
            rollno: user.rollno,
            studentName: user.name,
            email: user.email,
            exam: examName || "General",
            score,
            totalQuestions,
            answers: answersData,
            submittedAt: new Date().toISOString()
        };

        const newResult = new Result({
            ...resultData
        });

        await newResult.save();

        res.json({ message: "Exam submitted successfully", score, totalQuestions });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
