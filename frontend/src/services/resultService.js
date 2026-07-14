import api from './api';

/**
 * Get exam result for a user
 */
export const getResult = async (email) => {
    try {
        const response = await api.get(`/result/${email}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch result' };
    }
};

/**
 * Get all results (admin only)
 */
export const getAllResults = async () => {
    try {
        const response = await api.get('/results');
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Failed to fetch results' };
    }
};
