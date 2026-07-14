import api from './api';

/**
 * Get all questions for an exam
 */
export const getQuestions = async () => {
    try {
        const response = await api.get('/questions');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch questions' };
    }
};

/**
 * Submit exam answers
 */
export const submitExam = async (answers, examName) => {
    try {
        const response = await api.post('/submitExam', {
            answers,
            examName
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to submit exam' };
    }
};
