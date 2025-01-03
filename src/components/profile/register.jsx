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
          <div className="checkbox-container">
                    <input
                        type="checkbox"
                        id="agreeCheckbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                    />
                    <label htmlFor="agreeCheckbox">
                        I have read and agree to the <Link to="/privacy">Privacy Policy</Link>, <Link to="/termsofservice">Terms of Service</Link>, and <Link to="/webdisclaimer">Website Disclaimer</Link>.
                    </label>
          </div>
          <button type="submit" className="login-button" disabled={!canRegister}>Register</button>
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
