const express = require("express");
const Story = require('../models/Story');
const User = require('../models/User');

const createStory = async (req, res) => {
    try {
      const { slides, category } = req.body;
  
      slides.forEach(slide => {
        if (!slide.heading || !slide.description || !slide.mediaUrl) {
        return res.status(400).json({
            success : false,
             message: 'All fields are required'
             });
            }
        });
        if(!category){
          return res.status(400).json({
            success : false,
             message: 'Category is required'
             });
        }
      if (slides.length < 3 || slides.length > 6) {
        return res.status(400).json({
            success : false,
             message: 'Story must have minimum 3 and maximum 6 slides.'
             });
      }
      const newStory = new Story({
        slides,
        user: req.user._id,
        category
      });
  
      await newStory.save();
      return res.status(201).json({
        success: true,
         message: 'Story created successfully!',
          story: newStory 
        });
    } catch (error) {
      res.status(500).json({
        success: false,
         message: error
        });
    }
  };

  const updateStory = async (req, res) => {

    const { slides, category,storyid } = req.body;

    try {
      slides.forEach(slide => {
        if (!slide.heading || !slide.description || !slide.mediaUrl) {
        return res.status(400).json({
            success : false,
             message: 'All fields are required'
             });
            }
        });
        if(!category){
          return res.status(400).json({
            success : false,
             message: 'Category is required'
             });
        }
      if (slides.length < 3 || slides.length > 6) {
        return res.status(400).json({
            success : false,
             message: 'Story must have minimum 3 and maximum 6 slides.'
             });
      }

        const story = await Story.findById(storyid);

        if (!story)
            return res.status(404).json({
                success: false,
                message: 'Story not found'
            });

            story.slides = slides;
            story.category = category;

        await story.save();

        return res.status(200).json({
            success: true,
            message: "Story Updated Successfully",
            story
        });

    }
    catch (e) {

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }


};

  const getStory = async (req, res) => {
    try {
      const categorizedStories = await Story.aggregate([
        {
          $group: {
            _id: "$category",  
            stories: { $push: "$$ROOT" }  
          }
        },
        {
          $project: {
            _id: 0,
            name: "$_id",  
            stories: 1 , 
            showAll: { $literal: false }
          }
        }
      ]);
      if (!categorizedStories.length) {
        return res.status(200).json({
          success: false,
          message: 'No stories found',
        });
      }
      return res.status(200).json({
        success: true,
        stories: categorizedStories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
         message: error
        });
    }
  };


  const likeSlide = async (req, res) => {
    try {
      const { storyId, slideId } = req.params;
      const story = await Story.findById(storyId);
  
      if (!story) {
        return res.status(404).json({
            success: false,
             message: 'Story not found.'
             });
      }
  
      const slide = story.slides.id(slideId);
      if (!slide) {
        return res.status(404).json({
            success: false,
             message: 'Slide not found.' 
            });
      }
      if (slide.likes.includes(req.user._id)) {
        return res.status(400).json({ 
            success: false,
            message: 'You already liked this slide.' });
      }
  
      
      slide.likes.push(req.user._id);
      slide.likeCount += 1;
      await story.save();
  
      return res.status(200).json({
        success: true,
         message: 'Slide liked successfully!', 
         likeCount: slide.likeCount 
        });
    } catch (error) {
      return res.status(500).json({
        success: false,
         message: 'Internal Server Error'
         });
    }
  };

  const unlikeSlide = async (req, res) => {
    try {
      const { storyId, slideId } = req.params;
  
      const story = await Story.findById(storyId);
      if (!story) return res.status(404).json({ 
        success: false,
        message: 'Story not found' 
    });
  
      const slide = story.slides.id(slideId);
      if (!slide) return res.status(404).json({
        success: false,
         message: 'Slide not found' 
        });
  
      const userIndex = slide.likes.indexOf(req.user._id);
      if (userIndex === -1) {
        return res.status(400).json({ 
            success: false,
            message: 'You have not liked this slide yet.'
         });
      }
  
      slide.likes.splice(userIndex, 1);
      slide.likeCount -= 1;
  
      await story.save();
      return res.status(200).json({
        success: true,
         message: 'Slide unliked successfully', 
         likeCount: slide.likeCount 
        });
    } catch (error) {
      return res.status(500).json({
        success: false, 
        message: 'Internal Server Error' 
    });
    }
  };


  const bookmarkStory = async (req, res) => {
    try {
      const { storyId, slideId } = req.params;
      const story = await Story.findById(storyId);
  
      if (!story) {
        return res.status(404).json({
            success: false,
             message: 'Story not found.'
             });
      }
  
      const slide = story.slides.id(slideId);
      if (!slide) {
        return res.status(404).json({
            success: false,
             message: 'Slide not found.' 
            });
      }
      if (slide.bookmarked.includes(req.user._id)) {
        return res.status(400).json({ 
            success: false,
            message: 'You already bookmarked this slide.' });
      }
  
      
      slide.bookmarked.push(req.user._id);
    await story.save();
  
      return res.status(200).json({
        success: true,
         message: 'Story bookmarked successfully!' 
        });
    } catch (error) {
     return res.status(500).json({
        success: false,
         message: 'Internal Server Error'
        });
    }
  };

  const unbookmarkStory = async (req, res) => {
    try {
      const { storyId, slideId } = req.params;
      const story = await Story.findById(storyId);
  
      if (!story) {
        return res.status(404).json({
            success: false,
             message: 'Story not found.'
             });
      }
  
      const slide = story.slides.id(slideId);
      if (!slide) {
        return res.status(404).json({
            success: false,
             message: 'Slide not found.' 
            });
      }
      const userIndex = slide.bookmarked.indexOf(req.user._id);
      if (userIndex === -1) {
        return res.status(400).json({ 
            success: false,
            message: 'You have not bookmarked this slide yet.'
         });
      }
  
      slide.bookmarked.splice(userIndex, 1);
      await story.save();
  
      res.status(200).json({ 
        success: true,
        message: 'Story unbookmarked successfully'
     });
    } catch (error) {
      res.status(500).json({
        successs: true,
         message: 'Internal Server Error' 
        });
    }
  };


  const getBookmarkedStories = async (req, res) => {
    try {
      const userId = req.user._id;
      const bookmarkedStories = await Story.find();

        let bookmarkedSlides = [];
    bookmarkedStories.forEach(story => {
      const userBookmarkedSlides = story.slides.filter(slide => slide.bookmarked.includes(userId));
      bookmarkedSlides = bookmarkedSlides.concat(userBookmarkedSlides);
    });
  
      res.status(200).json({ 
        success: true,
        stories: bookmarkedSlides });
    } catch (error) {
      res.status(500).json({
        success: false,
         message: 'Internal Server Error' });
    }
  };


  const getStoriesBy = async (req, res) => {
    const categoryMapping = {
      1: 'All', 
      2: 'Education',
      3: 'Food',
      4: 'Health and fitness',
      5: 'Movies',
      6: 'Travel'
      
    };
    try {
      const { categoryId } = req.params;
      const category = categoryMapping[categoryId];

     
      const categorizedStories = await Story.aggregate([
        {
          $match: {
            category: category
          }
        },
        {
          $group: {
            _id: "$category",  
            stories: { $push: "$$ROOT" }  
          }
        },
        {
          $project: {
            _id: 0,  
            name: "$_id",  
            stories: 1 
          }
        }
      ]);
      
      
      if (!categorizedStories.length) {
        return res.status(200).json({
            success: false,
             message: 'No stories found in this category .' });
      }
  
     return res.status(200).json({
        success: true,
        stories:categorizedStories
    });
    } catch (error) {
      res.status(500).json({
        success: false,
         message: 'Internal Server Error' });
    }
  };

  const shareSlide = async (req, res) => {
    try {
      const { storyId, slideId } = req.params;
      const story = await Story.findById(storyId);
  
      if (!story) {
        return res.status(404).json({
            success: false,
             message: 'Story not found.' });
      }
  
      const storyLink = `story/${storyId}/slide/${slideId}`;
      return res.status(200).json({
        success: true,
         message: 'Link generated successfully!', 
         storyLink });
    } catch (error) {
      res.status(500).json({
        success: false,
         message: 'Internal Server Error' });
    }
  };

  const getStoryByLink = async (req, res) => {
    try {
      const { storyId} = req.params;
      const story = await Story.findById(storyId);
  
      if (!story) {
        return res.status(404).json({ message: 'Story not found.' });
      }
      
  
      return res.status(200).json({ 
        success: true,
        story });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getUserStories = async (req, res) => {
    const categoryMapping = {
      1: 'All',
      2: 'Education',
      3: 'Food',
      4: 'Health and fitness',
      5: 'Movies',
      6: 'Travel'
    };
    try {
      const  userId  = req.user._id;
      const { categoryId } = req.params;
      const category = categoryMapping[categoryId];
      let userStories;
      if (categoryId && category == 'All') {
         userStories = await Story.find({ user: userId });
      }
      else{
        let query = { user: userId };
        query.category = category;
       
         userStories = await Story.find(query);
      }
      
      
      
      if (!userStories.length) {
        return res.status(200).json({
            success: false,
             message: 'No stories found in this category .' });
      }
  
     return res.status(200).json({
        success: true,
        stories:userStories
    });
    } catch (error) {
      res.status(500).json({
        success: false,
         message: error });
    }
  };
  
  
  



  module.exports = { createStory,getStory, likeSlide, unlikeSlide, bookmarkStory, getBookmarkedStories, unbookmarkStory, getStoriesBy, shareSlide, getStoryByLink,updateStory,getUserStories };