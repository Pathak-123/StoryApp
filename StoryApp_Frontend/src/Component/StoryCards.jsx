import React, { useState,useContext, useEffect } from 'react';
import '../Style/StoryCardsStyle.css';
import YourStory from '../Pages/YourStory';
import { PopupContext } from '../util/PopupContext';
import { isVideoUrl, truncateDescription } from '../util/HelperFunction';
import Loader from './Loader';

function StoryCards({isAuthenticate,categories,setCategories ,shimmer,activeCategories}) {
  const {userId,setSelectedStory, setSearchParams} = useContext(PopupContext);
  const [showAllStories, setShowAllStories] = useState(false);
  const categoryMapping = {
    1: 'All', 
    2: 'Education',
    3: 'Food',
    4: 'Health and fitness',
    5: 'Movies',
    6: 'Travel'
  };
  const allCategories = [
    { name: 'Food', stories: [] },
    { name: 'Movies', stories: [] },
    { name: 'Health and fitness', stories: [] },
    { name: 'Education', stories: [] },
    { name: 'Travel', stories: [] }
  ];
  const mergedCategories = activeCategories === 1 ? allCategories.map(category => {
    const backendCategory = categories.find(cat => cat.name === category.name);
    return backendCategory ? backendCategory : category;
  }) : categories ;


  const toggleSeeMore = () => {
    setShowAllStories(!showAllStories);
  };
  const handleCardClick = (story) => {
    setSelectedStory(story);

    setSearchParams({ story: story._id, slide: story.slides[0]._id });
  };
  const getUserStories = () => {
    
    return categories.reduce((acc, category) => {
      const userSpecificStories = category.stories.filter(story => story.user.toString() === userId);
      if (userSpecificStories.length > 0) {
        acc.push(...userSpecificStories); 
      }
      return acc;
    }, []);  
  };
let showYourStory = false;
  let userStories = [];
  if(isAuthenticate){
     userStories = getUserStories();
     showYourStory = userStories.length > 0
  }
  return (
  <>
    {isAuthenticate && showYourStory && (
        <YourStory activeCategories={activeCategories}/>
      )}
      {shimmer ? (
        <Loader />
      ) : (
     
    <div className='story-cards-container'>
      {mergedCategories.map((category, index) => (
        <div key={index} className="category-section">
          <h2 className="category-heading"> {activeCategories !== 1
    ? `Top Stories about ${categoryMapping[activeCategories]}`
    : `Top Stories about ${category.name}`}</h2>
          <div className="category-cards">
          {category.stories.length > 0 ? (
            category.stories
              .slice(0, showAllStories ? category.stories.length : 4) 
              .map((story) => (
               
                <div key={story._id} className="story-card"   onClick={() => handleCardClick(story)}>
                {isVideoUrl(story.slides[0].mediaUrl) ? ( <video src={story.slides[0].mediaUrl}  loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1000, }} /> ) : ( <div style={{ backgroundImage: `url(${story.slides[0].mediaUrl})`, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1000,  }} /> )}  
                  <div className="card-overlay">
                    <h3>{truncateDescription(story.slides[0].heading,35)}</h3>
                    <p className='text'>{truncateDescription(story.slides[0].description,100)}</p>
                  </div>
                </div>
              ))
          ) : (
            <div className="no-stories-message">
            {activeCategories !== 1
    ? `No  Stories found for ${categoryMapping[activeCategories]}`
    : `No Stories found for ${category.name}`}
                </div>
          
        )}
          </div>
          {category.stories.length>4&&(
          <button className="btn see-more-button" onClick={() => toggleSeeMore()}>
          {showAllStories ? 'See Less' : 'See More'}
          </button>
        )}
        </div>
      ))}
    </div>
      )}
    </>
  );
}

export default StoryCards;
