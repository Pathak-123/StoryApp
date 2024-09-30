import React, { useState, useContext, useEffect } from "react";
import "../Style/CreateStoryPopupStyle.css";
import { PopupContext } from "../util/PopupContext";
import { createStory, updateStory } from "../services/StoryAPIs";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { checkVideoDuration, isVideoUrl } from "../util/HelperFunction";
function CreateStoryPopUp({ editingStory }) {
  const [addSlider, setAddSlider] = useState([
    { heading: "", description: "", mediaUrl: "", category: "" },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const { closeCreateStoryPopup } = useContext(PopupContext);
  const [loading, setLoading] = useState(false);
  const isEditing = !!editingStory;
  useEffect(() => {
    if (editingStory) {
      const category = editingStory.category;
      const filteredSlides = editingStory.slides.map((slide) => ({
        heading: slide.heading || "",
        description: slide.description || "",
        mediaUrl: slide.mediaUrl || "",
        category: category || "",
      }));
      setAddSlider(filteredSlides);
    }
  }, [editingStory]);

  const handleAddSlider = () => {
    const currentSlideValid =
      addSlider[currentSlide].heading.trim() !== "" &&
      addSlider[currentSlide].description.trim() !== "" &&
      addSlider[currentSlide].mediaUrl.trim() !== "" &&
      addSlider[currentSlide].category.trim() !== "";
    if (!currentSlideValid) {
      toast.error(
        "Please fill all fields for the current slide before adding a new one."
      );
      return;
    }
    if (addSlider.length < 6) {
      const newSlide = {
        heading: "",
        description: "",
        mediaUrl: "",
        category: addSlider[currentSlide].category,
      };
      setAddSlider([...addSlider, newSlide]);
      setCurrentSlide(addSlider.length);
    }
  };
  const handleRemoveSlider = (indexToRemove) => {
    setAddSlider(addSlider.filter((_, index) => index !== indexToRemove));
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedSlides = [...addSlider];
    updatedSlides[currentSlide][name] = value;
    if (name === "category") {
      updatedSlides.forEach((slide) => (slide.category = value));
    }

    setAddSlider(updatedSlides);
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };

  const handleNextSlide = () => {
    if (currentSlide < addSlider.length - 1) setCurrentSlide(currentSlide + 1);
  };

  const handleCreateStoryDataSubmit = async () => {
    const isValid = addSlider.every(
      (slide) =>
        slide.heading.trim() !== "" &&
        slide.description.trim() !== "" &&
        slide.mediaUrl.trim() !== "" &&
        slide.category.trim() !== ""
    );
    if (!isValid) {
      toast.dismiss();
      toast.error("Please fill all fields for each slide.");
      return;
    }
    setLoading(true);
    toast.dismiss();
    const checkAllSlides = async () => {
      for (let i = 0; i < addSlider.length; i++) {
        const { mediaUrl } = addSlider[i];
        const isVideo = isVideoUrl(mediaUrl);
        if (isVideo) {
          const isValid = await checkVideoDuration(mediaUrl);
          if (!isValid) {
            toast.error(`Video duration exceeds 15 seconds at slide ${i + 1}`);
            return false;
          }
        }
      }
      return true;
    };

    try {
      const isValidSlides = await checkAllSlides();
      if (!isValidSlides) {
        setLoading(false);
        return;
      }
      const storyCategory = addSlider[0]?.category;
      const slidesToSend = addSlider.map(({ category, ...rest }) => rest);
      let response;
      if (isEditing) {
        response = await updateStory({
          slides: slidesToSend,
          category: storyCategory,
          storyid: editingStory._id,
        });
      } else {
        response = await createStory({
          slides: slidesToSend,
          category: storyCategory,
        });
      }
      if (response.success) {
        toast.success(response.message);
        closeCreateStoryPopup();
        window.location.reload();
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      toast.error("Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-story-popup-overlay">
      <div className="create-story-popup">
        <button
          className="close-icon"
          onClick={() => closeCreateStoryPopup(isEditing ? "close" : "close")}
        >
          X
        </button>
        <p className="text popup-text">Add upto 6 slides</p>
        <p className="text popup-mobile-text">Add Story to feed</p>
        <div className="create-story-form-container">
          <div className="add-slider-container">
            {addSlider.map((slider, index) => (
              <div className="add-slider">
                {addSlider.length>3  && (
                  <button
                    className="add-slider-close-icon"
                    onClick={() => handleRemoveSlider(index)}
                  >
                    X
                  </button>
                )}
                <div className="add-slider-button" key={index}>
                  <p>Slide</p>
                  <p>{`${index + 1}`}</p>
                </div>
              </div>
            ))}
            {addSlider.length < 6 && (
              <div className="add-slider-button" onClick={handleAddSlider} style={{ cursor: "pointer" }}>
                <p>Add</p>
                <p>+</p>
              </div>
            )}
          </div>
          <form className="create-story-form">
            <div className="create-story-form-row">
              <label htmlFor="heading">Heading:</label>
              <input
                type="text"
                id="heading"
                placeholder="Your Heading"
                name="heading"
                value={addSlider[currentSlide]?.heading}
                onChange={handleInputChange}
              />
            </div>
            <div className="create-story-form-row">
              <label htmlFor="description">Description:</label>
              <textarea
                type="text"
                id="description"
                placeholder="Story Description"
                name="description"
                value={addSlider[currentSlide].description}
                onChange={handleInputChange}
              />
            </div>
            <div className="create-story-form-row">
              <label htmlFor="image">Image / Video:</label>
              <input
                type="text"
                id="mediaUrl"
                placeholder="Add Image Url"
                name="mediaUrl"
                value={addSlider[currentSlide].mediaUrl}
                onChange={handleInputChange}
              />
            </div>
            <div className="create-story-form-row">
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                name="category"
                value={addSlider[currentSlide]?.category}
                onChange={handleInputChange}
              >
                <option value="" disabled defaultValue hidden>
                  Select Category
                </option>
                <option value="Food">Food</option>
                <option value="Health and fitness">Health and fitness</option>
                <option value="Travel">Travel</option>
                <option value="Education">Education</option>
                <option value="Movies">Movies</option>
              </select>
            </div>
            <div className="create-story-form-buttons-container">
              <div className="create-story-form-buttons">
                <button
                  className="btn previous-button"
                  type="button"
                  onClick={handlePreviousSlide}
                  disabled={currentSlide === 0}
                  style={{
                    cursor:
                      currentSlide === 0 || loading ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>

                <button
                  className="btn next-button"
                  type="button"
                  onClick={handleNextSlide}
                  disabled={currentSlide === addSlider.length - 1}
                  style={{
                    cursor:
                      currentSlide === addSlider.length - 1 || loading
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
              <button
                className="btn post-button"
                type="button"
                onClick={handleCreateStoryDataSubmit}
                disabled={loading}
                style={{ cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading
                  ? isEditing
                    ? "Updating..."
                    : "Posting..."
                  : isEditing
                  ? "Update"
                  : "Post"}
              </button>
            </div>
            {loading && (
              <div>
                <Loader />
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateStoryPopUp;
