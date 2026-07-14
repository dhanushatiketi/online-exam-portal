const Question = require("../models/Question");
const Exam = require("../models/Exam");
const Result = require("../models/Result");

/**
 * Get all available exams
 */
exports.getAllExams = async () => {
    try {
        return await Exam.find({ status: 'active' });
    } catch (error) {
        throw new Error(`Error fetching exams: ${error.message}`);
    }
};

/**
 * Get exam by name
 */
exports.getExamByName = async (examName) => {
    try {
        return await Exam.findOne({ name: examName });
    } catch (error) {
        throw new Error(`Error fetching exam: ${error.message}`);
    }
};

/**
 * Get questions for an exam
 */
exports.getExamQuestions = async (examName) => {
    try {
        const questions = await Question.find({ examName });
        return questions.map(q => ({
            _id: q._id,
            examName: q.examName,
            questionText: q.questionText,
            options: q.options
        }));
    } catch (error) {
        throw new Error(`Error fetching questions: ${error.message}`);
    }
};

/**
 * Evaluate exam answers and calculate score
 */
exports.evaluateExam = async (answers, examName, userId) => {
    try {
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

        const percentage = (score / totalQuestions) * 100;
        
        return {
            score,
            totalQuestions,
            percentage: Math.round(percentage),
            answersData,
            passed: percentage >= 40
        };
    } catch (error) {
        throw new Error(`Error evaluating exam: ${error.message}`);
    }
};
