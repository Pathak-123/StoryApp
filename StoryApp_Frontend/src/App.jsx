import './Style/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/Home';
import Bookmarks from './Pages/Bookmarks';
import Header from './Component/Header';
import Avatar from './assets/avatar.png'
import YourStory from './Pages/YourStory';
import StorySlide from './Component/StorySlide';
import { PopupProvider } from './util/PopupContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './Component/ProtectedRoute';


function App() {
  return (
    <div className="App">
    <BrowserRouter>
   <PopupProvider>
    <Header avatarUrl={Avatar} />
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/bookmarks"  element={<ProtectedRoute element={Bookmarks} />}/>
      <Route path="/your-story" element={<ProtectedRoute element={YourStory} activeCategories={1}  />} />
    </Routes>
    </PopupProvider>
    </BrowserRouter>
    <ToastContainer />
  </div>
  );
}

export default App;
