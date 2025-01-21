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

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submit behavior
    const hashedPassword = sha256(password).toString();
    const data = {
      Email: email,
      Password: hashedPassword,
    };

    try {
      const response = await axios.post(`${env.api}/auth/login`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      Cookie.set('signed_in_user', JSON.stringify(response.data));
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('Invalid email or password');
      console.error(error);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    if (credentialResponse.credential) {
      const decoded = decodeJWT(credentialResponse.credential);
      const token = sha256(decoded.sub).toString();

      const googleData = {
        Username: decoded.name,
        Email: decoded.email,
        Password: token,
      };

      try {
        const response = await axios.post(`${env.api}/auth/login`, googleData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        Cookie.set('signed_in_user', JSON.stringify(response.data));
        navigate('/');
        window.location.reload();
      } catch (error) {
        alert('Invalid email or password');
        console.error(error);
      }
    };

  };

  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div className="login-background">
      <div className="login-container">
        <h1>Login</h1>
        <div className="login-form">
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
          <button
            type="submit"
            className="login-button"
            onClick={handleSubmit}
          >
            Login
          </button>
          <div className="separator">Do you want to continue with Google?</div>
          <div className="google-login-container">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.error('Google Login Failed');
              }}
            />
          </div>
          <div className="terms">
            By clicking continue, you agree to our{' '}
            <strong>Terms of Service</strong> and <strong>Privacy policy</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
