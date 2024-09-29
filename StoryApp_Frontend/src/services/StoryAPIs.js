import axios from 'axios';

const API_URL  = 'http://localhost:3000/api/v1/story';

export const createStory = async (createStoryData) => {
    try {
      const response = await axios.post(`${API_URL}/createStory`, createStoryData,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const getStory = async () => {
    try {
      const response = await axios.get(`${API_URL}/getStory`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const BookmarkedStories = async (storyId,slideId) => {
    try {
      const response = await axios.put(`${API_URL}/bookmark/${storyId}/${slideId}`, null, {
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };
  export const unbookmarkStory = async (storyId,slideId) => {
    try {
      const response = await axios.put(`${API_URL}/unbookmark/${storyId}/${slideId}`, null, {
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const getBookmarkedStories = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookmarkedStories`,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const checkIfBookmarked = async () => {
    try {
      const response = await axios.get(`${API_URL}/bookmarkedStories`,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const likeStory = async (storyId,slideId) => {
    try {
      const response = await axios.put(`${API_URL}/like/${storyId}/${slideId}`, null, {
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };
  export const unlikeStory = async (storyId,slideId) => {
    try {
      const response = await axios.put(`${API_URL}/unlike/${storyId}/${slideId}`, null, {
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };
  export const updateStory = async (updateStoryData) => {
    try {
      const response = await axios.put(`${API_URL}/updateStory/${updateStoryData.storyid}`, updateStoryData,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const getStorySlides = async (storyId) => {
    try {
      const response = await axios.get(`${API_URL}/${storyId}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const getStoryByCategory = async (label) => {
    try {
      const response = await axios.get(`${API_URL}/getcategory/${label}`);
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };

  export const getUserStories = async (activeCategories) => {
    try {
      const response = await axios.get(`${API_URL}/yourStory/${activeCategories}`,{
        headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
      });
      return response.data;
    } catch (error) {
      return error.response?.data || { success: false, message: 'Server Error' };
    }
  };