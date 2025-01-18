import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import Cookie from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import env from '../../env.json';
import './login.css';
import { Link } from 'react-router-dom'; // If you're using React Router

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [canRegister, setCanRegister] = useState(false);

  useEffect(() => {
    // Disable scrolling when on the register page
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
      Password: hashedPassword
    };

    axios.post(`${env.api}/auth/register`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) => {
      Cookie.set("signed_in_user", JSON.stringify(response.data));
      navigate("/");
      window.location.reload();
    }).catch((error) => {
      console.log('Error:', error);
      alert('Username exists.');
    });
  } else {
      alert("You must agree to the terms and conditions.");
    }
  };

  const handleGoogleLogin = async (googleData) => {
    const { tokenObj } = googleData;
    try {
      const response = await axios.post(`${env.api}/users/googleRegister`, {
        token: tokenObj.id_token
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.data && response.status === 200) {
        Cookie.set("signed_in_user", response.data);
        console.log("Response Data:", response.data); // Print the response data to the console
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.log('Error:', error);
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

        <div className="separator">Or register with <strong>Google</strong></div>
        <GoogleLogin
          clientId="YOUR_GOOGLE_CLIENT_ID"
          buttonText="Register with Google"
          onSuccess={handleGoogleLogin}
          onFailure={handleGoogleLogin}
          cookiePolicy={'single_host_origin'}
        />

        <div className="terms">
          By clicking Register, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.
        </div>
      </div>
    </div>
  );
}

export default Register;
