import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import sha512 from 'crypto-js/sha512';
import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import env from '../../env.json';
import './login.css';
import { Link } from 'react-router-dom';

function decodeJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join('')
  );

  return JSON.parse(jsonPayload);
}

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: '',
    phoneNumber: '',
    location: '',
    birthdayDay: '',
    birthdayMonth: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isChecked) return;

    const hashedPassword = sha512(formData.password).toString();
    const data = {
      Username: formData.username,
      Email: formData.email,
      Password: sha256(formData.password).toString(),
      FirstName: formData.firstName || undefined,
      LastName: formData.lastName || undefined,
      Country: formData.country || undefined,
      PhoneNumber: formData.phoneNumber || undefined,
      Location: formData.location || undefined,
      Birthday: {
        Day: formData.birthdayDay || undefined,
        Month: formData.birthdayMonth || undefined,
      },
    };

    try {
      const response = await axios.post(`${env.api}/auth/register`, data);
      Cookie.set('signed_in_user', JSON.stringify(response.data));
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
      alert('Username exists or registration failed.');
    }
  };

  const handleGoogleLogin = (credentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = decodeJWT(credentialResponse.credential);
      const token = sha256(decoded.sub).toString();

      const googleData = {
        Username: decoded.name,
        Email: decoded.email,
        Password: token,
      };

      axios
        .post(`${env.api}/auth/register`, googleData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          Cookie.set('signed_in_user', JSON.stringify(response.data));
          navigate('/');
          window.location.reload();
        })
        .catch((error) => {
          console.log('Error:', error);
          alert('Google login failed or user already exists.');
        });
    }
  };

  return (
    <div className="login-background">
      <div className="login-container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">
              Username <span className="mandatory">*</span>:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">
              Email <span className="mandatory">*</span>:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">
              Password <span className="mandatory">*</span>:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          <button
            type="button"
            className="toggle-optional"
            onClick={() => setShowOptionalFields(!showOptionalFields)}
          >
            {showOptionalFields ? 'Hide Optional Fields' : 'Show Optional Fields'}
          </button>

          {showOptionalFields && (
            <div className="optional-fields">
              {/* Optional Fields */}
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="country">Country:</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Birthday:</label>
                <input
                  type="text"
                  placeholder="Day"
                  name="birthdayDay"
                  value={formData.birthdayDay}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Month"
                  name="birthdayMonth"
                  value={formData.birthdayMonth}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="agreeCheckbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              required
            />
            <label htmlFor="agreeCheckbox">
              I agree to the <span className="mandatory">*</span>:
            </label>
            <div className="links-column">
              <Link to="/privacy"> Privacy Policy</Link>
              <Link to="/termsofservice"> Terms of Service</Link>
              <Link to="/webdisclaimer"> Website Disclaimer</Link>
            </div>
          </div>

          <button type="submit" className="login-button" >
            Register
          </button>
        </form>

        <div className="legend">
          <span className="mandatory">*</span> Mandatory fields
        </div>

        <div className="separator">
          Or register with <strong>Google</strong>
        </div>
        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </div>

        <div className="terms">
          By clicking Register, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
        </div>
      </div>
    </div>
  );
}

export default Register;