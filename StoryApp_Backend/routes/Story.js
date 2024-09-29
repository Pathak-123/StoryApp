const express = require('express');
const { createStory, likeSlide, unlikeSlide, bookmarkStory, unbookmarkStory, getBookmarkedStories, shareSlide, getStoryByLink, getStory, getStoriesBy, updateStory, getUserStories } = require('../controller/Story');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/createStory', authMiddleware ,createStory);
router.get('/getStory' ,getStory);
router.get('/getcategory/:categoryId', getStoriesBy);
router.get('/yourStory/:categoryId',authMiddleware, getUserStories);
router.put('/updateStory/:storyId', authMiddleware ,updateStory);

router.put('/like/:storyId/:slideId', authMiddleware, likeSlide);

router.put('/unlike/:storyId/:slideId', authMiddleware, unlikeSlide);

router.put('/bookmark/:storyId/:slideId', authMiddleware, bookmarkStory);

router.put('/unbookmark/:storyId/:slideId', authMiddleware, unbookmarkStory);

router.get('/bookmarkedStories', authMiddleware, getBookmarkedStories);

router.get('/sharelink/:storyId/:slideId', shareSlide);

router.get('/:storyId', getStoryByLink);



module.exports = router;