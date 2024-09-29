const express=require('express');
const cors=require('cors');
const dotenv = require('dotenv');
const connectDB  = require('./utils/features');

const userRoutes = require('./routes/User');
const storyRoutes = require('./routes/Story');

dotenv.config();

const app=express();
const port= process.env.PORT || 3000;
const mongoURI= process.env.MONGO_URI || "";

connectDB(mongoURI);
app.use(express.json());
app.use(cors());

app.get('/', (req,res)=>{
    res.send("Working");
})

app.use('/api/v1/user',userRoutes);
app.use('/api/v1/story',storyRoutes);

app.listen(port,()=>{
    console.log(`Server is working on localhost: ${port}`);
})