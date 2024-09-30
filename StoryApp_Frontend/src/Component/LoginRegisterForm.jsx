import React, { useState,useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../Style/LoginRegisterFormStyle.css';
import '../Style/App.css'
import '../Style/Header.css'
import { PopupContext } from '../util/PopupContext';
import Loader from './Loader';
import { loginUser, registerUser } from '../services/UserService';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function LoginRegisterForm({popupHeading}) {
  const navigate = useNavigate();
  const { closePopup ,AuthUser,toggleRegisterPopup, toggleLoginPopup } = useContext(PopupContext);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
      });
      const [errors, setErrors] = useState({});
      const [loading, setLoading] = useState(false);

    const togglePasswordVisibility = () => {
      setPasswordVisible(!passwordVisible);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      
    
      const validateForm = () => {
        const newErrors = {};
        if(!formData.username && !formData.password)
        {
            newErrors.allfiled = 'Enter all valid value';
            return newErrors;
        }
        if (!formData.username) {
          newErrors.username = 'Username is required';
        }
        if (!formData.password) {
          newErrors.password = 'Password is required';
        }
        return newErrors;
      };
      const formSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);

          return;
        }
        setErrors({});
        setLoading(true); 
        toast.dismiss();
        try {
          let response;
          if(popupHeading == 'Register'){
           response = await registerUser(formData);
          }
        else {
           response = await loginUser(formData);
        }
        if(response.success == true){
          localStorage.setItem('token', response.token);
          AuthUser(response.token, formData.username);
          toast.success(response.message,{ autoClose: 2000 });
          setFormData({ username: '', password: ''});
          if(popupHeading == 'Register'){
            toggleRegisterPopup();
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            }
          else{
            toggleLoginPopup();
            setTimeout(() => {
              window.location.reload();
            }, 1000);

          }
        }
        else {
          toast.error(response.message);
        }

        } catch (error) {
          console.log(error);
          toast.error('Internal Server Error. Please try again later');
        }
        finally {
          setLoading(false); 
        }
    
      };
  return (
    <div className="login-register-popup-overlay">
    <div className="login-register-popup">
      <button className='popup-close-icon' onClick={closePopup}>X</button>
      <h2>{popupHeading}</h2>
      <form onSubmit={formSubmit}>
      <div className='form-fields'> 
      <div className="form-row">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter your username" 
            name='username'
              value={formData.username}
              onChange={handleFormChange}
              error={errors.username}
              disabled={loading}
               />
          </div>
          <div className="form-row">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                     name='password'
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleFormChange}
                error={errors.password}
                disabled={loading}
              />
              <span className="toggle-password" onClick={togglePasswordVisibility}>
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </span>
            </div>
          </div>
          </div>
          {errors.allfiled && <p className="error-message">{errors.allfiled}</p>}
          {errors.username && <p className="error-message">{errors.username}</p>}
          {errors.password && <p className="error-message">{errors.password}</p>}

          <div className="form-row-button">
          <button type="submit" className='btn' style={{'marginTop':'30px',cursor: loading ? 'not-allowed' : 'pointer',opacity: loading ? 0.6 : 1}}  disabled={loading}>{popupHeading}</button>
          </div>
          {loading && <div> <Loader /> </div>}
      </form>
    </div>
  </div>
  )
}

export default LoginRegisterForm
