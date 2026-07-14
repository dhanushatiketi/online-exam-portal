import React, { createContext, useState } from 'react';

export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
    const [currentExam, setCurrentExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [examStarted, setExamStarted] = useState(false);
    const [examSubmitted, setExamSubmitted] = useState(false);
    const [result, setResult] = useState(null);

    const startExam = (examName) => {
        setCurrentExam(examName);
        setExamStarted(true);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setExamSubmitted(false);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const selectAnswer = (questionId, selectedOption) => {
        setAnswers({
            ...answers,
            [questionId]: selectedOption
        });
    };

    const submitExam = (examResult) => {
        setExamSubmitted(true);
        setResult(examResult);
        setExamStarted(false);
    };

    const resetExam = () => {
        setCurrentExam(null);
        setQuestions([]);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setExamStarted(false);
        setExamSubmitted(false);
        setResult(null);
    };

    return (
        <ExamContext.Provider value={{
            currentExam,
            questions,
            setQuestions,
            currentQuestionIndex,
            answers,
            examStarted,
            examSubmitted,
            result,
            startExam,
            nextQuestion,
            previousQuestion,
            selectAnswer,
            submitExam,
            resetExam
        }}>
            {children}
        </ExamContext.Provider>
    );
};
