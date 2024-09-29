import React, { createContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

export const PopupContext = createContext();

export const PopupProvider = ({ children }) => {
  const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isCreateStoryPopupOpen, setIsCreateStoryPopupOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate=useNavigate();
  const [editingStory, setEditingStory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();


  const toggleRegisterPopup = () => {
    setIsRegisterPopupOpen(prev => !prev);

  };
  const toggleCreateStoryPopup = (story = null) => {
    setEditingStory(story);
    setIsCreateStoryPopupOpen(prev => !prev);

  };
  const toggleLoginPopup = () => {
    setIsLoginPopupOpen(prev => !prev);

  };

  const closePopup = () => {
    setIsRegisterPopupOpen(false);
    setIsLoginPopupOpen(false);

  };
const closeCreateStoryPopup=(isEditing)=>{
  setIsCreateStoryPopupOpen(false);
  if(isEditing==='close')
  {
    // navigate('/your-story')
    //  window.location.reload();
  }else{
   window.location.reload();
  }
}

const AuthUser = (token,userName) => {
  setIsAuthenticated(true);  
  setUserName(userName);  
};

useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      setUserName(decodedToken.username); 
      setUserId(decodedToken._id); 
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to decode token:', error);
      setIsAuthenticated(false); 
      setUserName('');
      setUserId('');
    }
  }
}, []);

const logout = () => {
  setIsAuthenticated(false);
  setUserName('');
};

  return (
    <PopupContext.Provider value={{isModalOpen,setIsModalOpen, isRegisterPopupOpen, isLoginPopupOpen, toggleRegisterPopup, toggleLoginPopup,closePopup,closeCreateStoryPopup,isCreateStoryPopupOpen,toggleCreateStoryPopup,isAuthenticated, userName, AuthUser, logout, userId, editingStory,selectedStory, setSelectedStory,searchParams, setSearchParams }}>
      {children}
    </PopupContext.Provider>
  );
};
