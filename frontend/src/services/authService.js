import api from './api';

/**
 * Register a new user
 */
export const registerUser = async (formData) => {
    try {
        const response = await api.post('/auth/register', formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Registration failed' };
    }
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response?.data || { message: 'Login failed' };
    }
};

/**
 * Validate token
 */
export const validateToken = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return { valid: true };
    } catch (error) {
        return null;
    }
};
