import React, { useState,useContext, useEffect} from 'react'
import '../Style/BookmarksStyle.css';
import '../Style/StoryCardsStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { PopupContext } from '../util/PopupContext';
import StorySlide from '../Component/StorySlide';
import CreateStoryPopUp from '../Component/CreateStoryPopUp';
import { isVideoUrl } from '../util/HelperFunction';
import { getUserStories } from '../services/StoryAPIs';
import Loader from '../Component/Loader';

function YourStory({activeCategories}) {
  const {toggleCreateStoryPopup,isCreateStoryPopupOpen,isModalOpen,setIsModalOpen,setSelectedStory,setSearchParams,searchParams,isRegisterPopupOpen,isLoginPopupOpen} = useContext(PopupContext);
  const [showAllStories, setShowAllStories] = useState(false);
  const [userStories, setUserStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    const loadYourStories = async () => {
      try {
          const fetchStories = await getUserStories(activeCategories);
          if(fetchStories.success){
            setUserStories(fetchStories.stories);
        }
          else{
            setUserStories([]);
          }
      } catch (error) {
          console.error('Failed to fetch categories:', error);
      }
      finally {
        setLoading(false);  
      }
  };
  loadYourStories();

  },[activeCategories]);
    
      const handleSeeMore = () => {
        setShowAllStories(!showAllStories);
      };
      
      const displayedStories = showAllStories ? userStories : userStories.slice(0, 4);

      const handleCardClick = (story) => {
        setSelectedStory(story);
        setSearchParams({ story: story._id, slide: story.slides[0]._id });
        setIsModalOpen(true);
      };

      const handleEditClick = (story) => {
        toggleCreateStoryPopup(story); 
        setEdit(story);
      };

      const storyID = searchParams.get('story');
  const slideId = searchParams.get('slide');
  const closePopup = () => {
    searchParams.delete('story');
    searchParams.delete('slide');
    setSearchParams(searchParams);
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
    <div className={`bookmarks-container ${isCreateStoryPopupOpen || storyID ? 'background-blurred' : ""}`}>
    <h2 className="heading">Your Stories </h2>
    {loading ? (  
          <div className="loading">{<Loader/>}</div>
        ) :userStories.length === 0 ? (
          <div className="no-stories-found">No stories found. <br />
          Please create your story first to see it here!</div>
        ) : (
          <>
    <div className='story-cards-container'>
    <div className='category-cards'>
        {displayedStories.map((story) => (
          <div className='your-story-edit-cards' key={story._id}>
          <div key={story._id} className="story-card"   onClick={() => handleCardClick(story)}>
                {isVideoUrl(story.slides[0].mediaUrl) ? ( <video src={story.slides[0].mediaUrl}  loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',  }} /> ) : ( <div style={{ backgroundImage: `url(${story.slides[0].mediaUrl})`, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center',  }} /> )} 
            <div className="card-overlay">
            <h3>{story.slides[0].heading}</h3>
            <p className="text">{story.slides[0].description}</p>
            </div>
          </div>
          <button className="edit-button" onClick={() => handleEditClick(story)}>
                  <FontAwesomeIcon icon={faEdit} className="edit-icon" /> Edit
                </button>
          </div>
          
        ))}
      </div>
      </div>
      <button className="btn see-more-button" onClick={handleSeeMore}>
        {showAllStories ? 'See Less' : 'See More'}
      </button>
      </>
        )}
    </div>
    {isCreateStoryPopupOpen&&(
      <CreateStoryPopUp editingStory={edit}/>
  )}
    {storyID && (
      <StorySlide 
          storyID={storyID} 
          slideId={slideId} 
          onClose={closePopup}
        />
      )}
    </>
  )
}

export default YourStory
