import React, { useState,useContext, useEffect} from 'react'
import '../Style/BookmarksStyle.css';
import '../Style/StoryCardsStyle.css';
import { getBookmarkedStories } from '../services/StoryAPIs';
import { isVideoUrl } from '../util/HelperFunction';
import Loader from '../Component/Loader';
import CreateStoryPopUp from '../Component/CreateStoryPopUp';
import { PopupContext } from '../util/PopupContext';

function Bookmarks() {
  const [loader, setLoader] = useState(true);
  const {isCreateStoryPopupOpen} = useContext(PopupContext);
    const [bookmarkedStories, setBookmarkedStories] = useState([
      ]);
      useEffect(() => {

        const bookmarkedStories = async () => {
          try {
              const fetchStories = await getBookmarkedStories();
              setBookmarkedStories(fetchStories.stories);
          } catch (error) {
              console.error('Failed to fetch categories:', error);
          }
          setLoader(false);
      };
      bookmarkedStories();

      },[]);

      useEffect(() => {
        const hasPopupOpen =  isCreateStoryPopupOpen;
        
        if (hasPopupOpen) {
          document.body.classList.add('no-scroll');
        } else {
          document.body.classList.remove('no-scroll');
        }
        return () => {
          document.body.classList.remove('no-scroll'); 
        };
      }, [isCreateStoryPopupOpen]);
  return (
    <>
    <div className={`bookmarks-container ${isCreateStoryPopupOpen ? 'background-blurred' : ""}`}>
    <h2 className="heading">Your Bookmarked </h2>
    <div className='story-cards-container'>
    <div className='category-cards'>
    {loader ? <Loader/>  :
    (bookmarkedStories.map((slide) => (
              
              <div key={slide._id} className="story-card">
                {isVideoUrl(slide.mediaUrl) ? ( <video src={slide.mediaUrl}  loop muted playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',  }} /> ) : ( <div style={{ backgroundImage: `url(${slide.mediaUrl})`, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center',   }} /> )} 
                <div className="card-overlay">
                  <h3>{slide.heading}</h3>
                  <p className="text">{slide.description}</p>
                </div>
              </div>
            )))}
      </div>
      </div>
    </div>
  {isCreateStoryPopupOpen&&(
    <CreateStoryPopUp/>
  )}
    </>
  )
}

export default Bookmarks
