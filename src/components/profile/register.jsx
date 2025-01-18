import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import env from '../../env.json';
import './login.css';

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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [birthdayDay, setBirthdayDay] = useState('');
  const [birthdayMonth, setBirthdayMonth] = useState('');

  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [canRegister, setCanRegister] = useState(false);

  useEffect(() => {
    document.body.classList.add('no-scroll');

    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    setCanRegister(event.target.checked); // Allow registration only if checked
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isChecked) {
    const hashedPassword = sha256(password).toString();
    const data = {
      Username: username,
      Email: email,
      Password: hashedPassword,
      FirstName: firstName || undefined,
      LastName: lastName || undefined,
      Country: country || undefined,
      PhoneNumber: phoneNumber || undefined,
      Location: location || undefined,
      Birthday: {
        Day: birthdayDay || undefined,
        Month: birthdayMonth || undefined,
      },
    };

    axios
      .post(`${env.api}/auth/register`, data, {
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
        alert('Username exists.');
      });
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
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Optional Fields */}
          <div className="form-group">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="form-group birthday-group">
            <label>Birthday:</label>
            <input
              type="text"
              placeholder="Day"
              value={birthdayDay}
              onChange={(e) => setBirthdayDay(e.target.value)}
            />
            <input
              type="text"
              placeholder="Month"
              value={birthdayMonth}
              onChange={(e) => setBirthdayMonth(e.target.value)}
            />
          </div>

          <button type="submit" className="login-button">Register</button>
        </form>

        <div className="separator">
          Or register with <strong>Google</strong>
        </div>
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() => {
            console.log('Login Failed');
          }}
        />

        <div className="terms">
          By clicking Register, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
        </div>
      </div>
    </div>
  );
}

export default Register;
