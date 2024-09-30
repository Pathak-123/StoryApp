import React, { useState,useContext, useEffect } from 'react';
import {  useNavigate } from "react-router-dom";
import { PopupContext } from '../util/PopupContext';
import FilterCards from "../Component/FilterCards";
import StoryCards from "../Component/StoryCards";
import StorySlide from "../Component/StorySlide";
import LoginRegisterForm from '../Component/LoginRegisterForm';
import CreateStoryPopUp from '../Component/CreateStoryPopUp';
import { getStory, getStoryByCategory, getStorySlides } from '../services/StoryAPIs';

function Home() {

  const {isAuthenticated, isRegisterPopupOpen, isLoginPopupOpen ,isCreateStoryPopupOpen,editingStory,searchParams, setSearchParams} = useContext(PopupContext);
  const navigate=useNavigate();
  
  const [shimmer, setShimmer] = useState(true);

  const [categories, setCategories] = useState([{name:'',stories:[]}]);
  const [activeCategories, setActiveCategories] = useState(1);

  

  useEffect(() => {
    const loadStories = async () => {
      try {
          const fetchStories = await getStory();
          if(fetchStories.success){
          setCategories(fetchStories.stories);
        }
          else{
            setCategories([{name:'',stories:[]}]);
          }
          setShimmer(false);
      } catch (error) {
          console.error('Failed to fetch categories:', error);
      }
  };
  loadStories();

  },[]);
  const storyID = searchParams.get('story');
  const slideId = searchParams.get('slide');
  const closePopup = () => {
    searchParams.delete('story');
    searchParams.delete('slide');
    setSearchParams(searchParams);
  };

  const handleCategoryChange = async (label,categoryID) => {
    setShimmer(true); 
    if (categoryID !== activeCategories) {
      setActiveCategories(categoryID); 
      try {
        if (categoryID === 1) {
          const fetchStories = await getStory();
          if(fetchStories.success)
          setCategories(fetchStories.stories);
        else
          setCategories([{name:'',stories:[]}]);
        
        } else {
          const fetchFilteredStories = await getStoryByCategory(label);
          if(fetchFilteredStories.success){
          setCategories(fetchFilteredStories.stories);
          }
          else{
            setCategories([{name:'',stories:[]}]);
          }
        }
      } catch (error) {
        console.error('Failed to fetch stories for the category:', error);
      }
    }
      setShimmer(false);
     
  };
  
  useEffect(() => {
    const hasPopupOpen = storyID || isRegisterPopupOpen || isLoginPopupOpen || isCreateStoryPopupOpen;
    
    if (hasPopupOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll'); 
    };
  }, [storyID, isRegisterPopupOpen, isLoginPopupOpen, isCreateStoryPopupOpen]);

  

  return (
    <>
    <div className={`home-content ${storyID || isRegisterPopupOpen || isLoginPopupOpen || isCreateStoryPopupOpen ? 'background-blurred' : ''}`}>
    <FilterCards onCategoryChange={handleCategoryChange} />
    <StoryCards isAuthenticate={isAuthenticated} setSearchParams={setSearchParams} categories={categories} setCategories={setCategories}  shimmer = {shimmer} activeCategories = {activeCategories} />
    </div>
   
    
    
      
    {storyID &&  (
        <StorySlide 
          storyID={storyID} 
          slideId={slideId} 
          onClose={closePopup}
        />
      )}
    
   
    
  {isRegisterPopupOpen&&(
     
      <LoginRegisterForm popupHeading="Register"/>
  )}
  {isLoginPopupOpen&&(
    
      <LoginRegisterForm popupHeading="Login"/>
  )}
  {isCreateStoryPopupOpen && (
    
      <CreateStoryPopUp editingStory={editingStory}/>
  )}
    </>

  )
}

export default Home;
