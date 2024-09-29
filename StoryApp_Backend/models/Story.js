const mongoose = require("mongoose");

const SlideSchema = new mongoose.Schema({
  heading: { 
    type: String, 
    required: true 
  },
  description: {
     type: String, 
     required: true 
    },
  mediaUrl: { 
    type: String,
    required: true 
  },  
  likes: [{
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User' 
    }], 
  likeCount: { 
    type: Number,
    default: 0 
  }, 
  bookmarked: [{
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User' 
    }], 
});

const storySchema = new mongoose.Schema(
  {
    slides: [SlideSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
  category: {
    type: String,
    enum: ['Food', 'Health and fitness', 'Travel', 'Education', 'Movies'],
     required: true 
    },
   
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model("Story", storySchema);

module.exports = Story;
