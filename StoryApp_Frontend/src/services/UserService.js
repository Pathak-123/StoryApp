import axios from 'axios';

// const API_URL  = 'http://localhost:3000/api/v1/user';
const API_URL  = 'https://storyapp-rptt.onrender.com/api/v1/user';

export const registerUser = async (registerData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, registerData);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Signup failed' };
    }
  };

  export const loginUser = async (loginData) => {
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Login failed' };
    }
  };