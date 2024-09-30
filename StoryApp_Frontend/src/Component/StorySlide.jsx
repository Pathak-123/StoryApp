import React ,{useState,useEffect,useContext,useRef} from 'react'
import '../Style/StorySlideStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faBookmark, faHeart ,faPaperPlane,faArrowDown}  from '@fortawesome/free-solid-svg-icons';

import '../Style/StoryCardsStyle.css';
import { useSearchParams } from 'react-router-dom';
import downloadImage from '../assets/download_2.png';
import downloadDone from '../assets/download_done.png'
import { toast } from 'react-toastify';
import { BookmarkedStories, getStorySlides, likeStory, unbookmarkStory, unlikeStory } from '../services/StoryAPIs';
import { PopupContext } from '../util/PopupContext';
import { isVideoUrl } from '../util/HelperFunction';
import Loader from './Loader';

const StorySlide = ({ storyID, slideId, onClose  }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0); 
  const { userId,toggleLoginPopup,isAuthenticated } = useContext(PopupContext);
  const [slides, setSlides] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [showClipboardMessage, setShowClipboardMessage] = useState(false);
  const videoRef = useRef(null);
  useEffect(() => {
    const loadSlides = async () => {
      if (!storyID) return;  

      try {
        const response = await getStorySlides(storyID);
       
        if (response.success) {
          setSlides(response.story.slides); 
          setLoading(false); 
        } else {
          console.error('Failed to load slides');
          setLoading(false); 
        }
      } catch (error) {
        console.error('Error fetching story slides:', error);
        setLoading(false); 
      }
    };

    loadSlides(); 
  }, [storyID]);
  
  useEffect(() => {

    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
    
      setCurrentSlideIndex((prevIndex) => {
        if (prevIndex < slides.length - 1) {
          return prevIndex + 1;
        } else {
          
          onClose();
          return prevIndex;
        }
      });
    }, 15000);
return () => clearInterval(timer);
  }, [slides,onClose]);

  const handleClose = () => {
    onClose();
  };
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const slideFromParams = searchParams.get('slide');
    console.log(slideFromParams);
    if (slideFromParams && slides.length) {
      const slideIndex = slides.findIndex(slide => slide._id === slideFromParams);
      if (slideIndex !== -1 && slideIndex !== currentSlideIndex) {
      setCurrentSlideIndex(slideIndex);  
    }
      
    }
  }, [slides]);
  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      const nextSlideId = slides[currentSlideIndex + 1]._id;
      setCurrentSlideIndex(currentSlideIndex + 1);
      setSearchParams({ story: storyID, slide: nextSlideId });
    }
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      const prevSlideId = slides[currentSlideIndex - 1]._id;
      setCurrentSlideIndex(currentSlideIndex - 1);
      setSearchParams({ story: storyID, slide: prevSlideId });

    }
  };
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const currentSlide = slides[currentSlideIndex];
    const isUserLiked = currentSlide.likes.includes(userId);
    const isUserBookmarked = currentSlide.bookmarked.includes(userId);
    setIsBookmarked(isUserBookmarked);
    setIsLiked(isUserLiked);
    setLikeCount(currentSlide.likeCount);
    setDownloadComplete(false);
    setShowClipboardMessage(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
   
    const slideId = currentSlide._id;
    setSearchParams({ story: storyID, slide: slideId });
    
  }, [currentSlideIndex, slides, userId, storyID, setSearchParams]);

  const handleBookmarkClick = async () => {
    if(isAuthenticated){
     
      try {
        const currentSlideId = slides[currentSlideIndex]._id;
      let updatedSlides = [...slides];
      if(isBookmarked){
        const response = await unbookmarkStory(storyID, currentSlideId);
        if (response.success) {
          setIsBookmarked(false);
          updatedSlides[currentSlideIndex] = {
            ...updatedSlides[currentSlideIndex],
            bookmarked: updatedSlides[currentSlideIndex].bookmarked.filter(id => id !== userId)
        };
        setSlides(updatedSlides); 
        }

      }
      else {
        const response = await BookmarkedStories(storyID, currentSlideId);
        if (response.success) {
          setIsBookmarked(true);
          updatedSlides[currentSlideIndex] = {
            ...updatedSlides[currentSlideIndex],
            bookmarked: [...updatedSlides[currentSlideIndex].bookmarked, userId]
        };
        setSlides(updatedSlides); 
      }
    }
          
          
      } catch (error) {
          console.error('Failed to fetch categories:', error);
      }
    }
    else{
      toggleLoginPopup();
    }
 
  };
  


  const handleLikeClick = async () => {
    if(isAuthenticated){
    try {
      const currentSlideId = slides[currentSlideIndex]._id;
      let updatedSlides = [...slides];
      if (isLiked) {
        const response = await unlikeStory(storyID, currentSlideId);
        if (response.success) {
          setIsLiked(false);
          setLikeCount(likeCount - 1);
          updatedSlides[currentSlideIndex] = {
            ...updatedSlides[currentSlideIndex],
            likes: updatedSlides[currentSlideIndex].likes.filter(id => id !== userId),
            likeCount: updatedSlides[currentSlideIndex].likeCount - 1
        };
        setSlides(updatedSlides); 
        } 
      } else {
        const response = await likeStory(storyID, currentSlideId);
        if (response.success) {
          setIsLiked(true);
          setLikeCount(likeCount + 1);
          updatedSlides[currentSlideIndex] = {
            ...updatedSlides[currentSlideIndex],
            likes: [...updatedSlides[currentSlideIndex].likes, userId],
            likeCount: updatedSlides[currentSlideIndex].likeCount + 1
        };
        setSlides(updatedSlides); 
          
        } 
      }
    } catch (error) {
      toast.error('Failed to update like status');
    }
  }
  else{
    toggleLoginPopup();
  }
  };
 
  const handleDownloadClick = async () => {
    if (!isAuthenticated) {
      toggleLoginPopup();
      return;
    }
    const currentSlide = slides[currentSlideIndex];
    const fileUrl = currentSlide.mediaUrl;
    try {
      const response = await fetch(fileUrl, {
        mode: 'cors',
      });
      if (!response.ok) throw new Error('File could not be downloaded');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', currentSlide.heading || 'downloaded_file'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDownloadComplete(true);
    } catch (error) {
      console.error('Error while downloading the file', error);
    }
  
  };

  const handleShareClick = async () => {
    const currentUrl = window.location.href;
    const modifiedUrl = currentUrl.replace(/\your-story/, '');
  
    try {
      await navigator.clipboard.writeText(modifiedUrl);
      setShowClipboardMessage(true);
      setTimeout(() => {
        setShowClipboardMessage(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy the URL to clipboard:', err);
    }
  };

  

  if (loading || !slides) {
    return <div> <Loader/> </div>; 
  }


  return (
    <div className="story-modal">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="slide-navigation">
          <button 
            className="nav-button" 
            onClick={handlePrevious} 
            disabled={currentSlideIndex === 0}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          <div className="slide-container">
            
            {/* <div className='slide'
             style={{ backgroundImage: `url(${slides[currentSlideIndex].mediaUrl})` }}
             > */}
             <div className='slide' >
             
             {isVideoUrl(slides[currentSlideIndex].mediaUrl) ? ( <video src={slides[currentSlideIndex].mediaUrl} ref={videoRef} autoPlay  loop  playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1, }} /> ) : ( <div style={{ backgroundImage: `url(${slides[currentSlideIndex].mediaUrl})`, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: -1,  }} /> )} 
             
               <div className='slides-container'>
                    <div className='slides-line-container'>
                        {slides.map((slide, index) => (
                           <div key={index} className="slide-line-wrapper">
                           <div
                             className={`slide-line ${currentSlideIndex === index ? 'active' : ''}`}
                           ></div>
                         </div>

                        ))}
                    </div>
                    <div className="slide-close-share-container">
                        <div className='slide-close-icon' onClick={handleClose}>
                          X
                        </div>
                        <FontAwesomeIcon icon={faPaperPlane} 
                        style={{ color: 'white', cursor: 'pointer' }}
                        onClick={handleShareClick}
                        />       
                    </div>
               </div>
               <div className='empty-div-slide' >
                <div className='left-empty-div' onClick={handlePrevious}></div>
                <div className='right-empty-div' onClick={handleNext}></div>
               </div>
              <div className='card-overlay slide-overlay'>
              {showClipboardMessage && (
                  <div style={{
                    position: 'absolute',
                    top:'62%',
                    width:'75%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    color: 'red',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    zIndex: 10,
                    fontWeight: 'bold',
                  }}>
                    Link copied to clipboard !
                  </div>
                )}
                    <div>
                        <h4 className='slide-title'>{slides[currentSlideIndex].heading}</h4>
                        <p className='slide-text'>{slides[currentSlideIndex].description}</p>
                    </div>
                    <div className="slide-bookmark-like-action-container">
                        <div className='fa-bookmark-icon'>
                          <FontAwesomeIcon icon={faBookmark} 
                          style={{ color: isBookmarked ? 'blue' : 'white', cursor: 'pointer' }}
                          onClick={handleBookmarkClick}
                           />
                        </div>
                        <div className='downloadClick' onClick={!downloadComplete ? handleDownloadClick : null}>
                        <img src={downloadComplete ? downloadDone : downloadImage} alt="Download" style={{ width: '20px', height: '20px', cursor: downloadComplete ? 'not-allowed' : 'pointer'  }} />
                        </div>
                        <div >
                          <FontAwesomeIcon icon={faHeart} className='fa-heart'
                          style={{ color: isLiked ? 'red' : 'white', cursor: 'pointer' }}
                          onClick={handleLikeClick}
                           />{' '} {likeCount > 0 && ` ${likeCount}`}
                        </div>
                    </div>
               </div>
          
           </div>
          </div>
          <button 
            className="nav-button" 
            onClick={handleNext} 
            disabled={currentSlideIndex === slides.length - 1}
          >
              <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorySlide;

