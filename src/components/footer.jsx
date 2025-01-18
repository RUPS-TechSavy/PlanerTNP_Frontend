import React from 'react';
import { Link } from 'react-router-dom'; // If you're using React Router
import './footer.css';
import '../App.css';

const Footer = () => {
    return (
      <footer className="footer">
        <div className="footer-text">
        <p>PlanWise / TeachSavy © All rights reserved</p>
      </div>
        <nav>
          <ul className="footer-list">
            <li className="footer-item">
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li className="footer-item">
              <Link to="/termsofservice">Terms of Service</Link>
            </li>
            <li className="footer-item">
              <Link to="/webdisclaimer">Website Disclaimer</Link>
            </li>
          </ul>
        </nav>
      </footer>
    );
  };
  
  export default Footer;