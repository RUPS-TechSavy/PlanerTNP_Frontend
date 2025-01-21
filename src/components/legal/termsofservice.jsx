import './privacyPolicy.css';
import { Link } from "react-router-dom";
import React, { useEffect} from 'react';


const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="privacy-background">
  <div className="privacy-container">
    <h1 className="spacing">PlanWise Terms and Conditions</h1>
    <p className="spacing2">Please read these terms and conditions carefully before using https://www.planwise.com website operated by teams TeachSavy and PlanWise.</p>
    
    <h2>Conditions of Use</h2>
    <p className="spacing2">
      By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. 
      If you do not want to be bound by the terms of this Agreement, you are advised to stop using the website accordingly. 
      Teams TeachSavy and PlanWise only grant use and access of this website, its products, and its services to those who have accepted its terms.
    </p>

    <h2>Privacy Policy</h2>
    <p className="spacing2">
      Before you continue using our website, we advise you to read our
      <Link to="/privacy"> privacy policy </Link>
       regarding our user data collection. It will help you better understand our practices.
    </p>

    <h2>Intellectual Property</h2>
    <p className="spacing2">
      You agree that all materials, products, and services provided on this website are the property of teams TeachSavy and PlanWise, 
      their affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, 
      and other intellectual property. You also agree that you will not reproduce or redistribute the teams TeachSavy and PlanWise’s intellectual 
      property in any way, including electronic, digital, or new trademark registrations.
    </p>
    <p className="spacing2">
      You grant teams TeachSavy and PlanWise a royalty-free and non-exclusive license to display, use, copy, transmit, and broadcast the content 
      you upload and publish. For issues regarding intellectual property claims, you should contact the company in order to come to an agreement.
    </p>

    <h2>User Accounts</h2>
    <p className="spacing2">
      As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring the 
      accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information. 
      You are also responsible for all activities that occur under your account or password.
    </p>
    <p className="spacing2">
      If you think there are any possible issues regarding the security of your account on the website, inform us immediately so we may address them accordingly.
    </p>
    <p className="spacing2">
      We reserve all rights to terminate accounts, edit or remove content, and cancel orders at our sole discretion.
    </p>

    <h2>Applicable Law</h2>
    <p className="spacing2">
      By using this website, you agree that the laws of Slovenia, without regard to principles of conflict laws, will govern these terms and 
      conditions, or any dispute of any sort that might come between teams TeachSavy and PlanWise and you, or its business partners and associates.
    </p>

    <h2>Disputes</h2>
    <p className="spacing2">
      Any dispute related in any way to your use of this website or to products you purchase from us shall be arbitrated by Slovenian courts, 
      and you consent to exclusive jurisdiction and venue of such courts.
    </p>

    <h2>Indemnification</h2>
    <p className="spacing2">
      You agree to indemnify teams TeachSavy and PlanWise and its affiliates and hold teams TeachSavy and PlanWise harmless against legal 
      claims and demands that may arise from your use or misuse of our services. We reserve the right to select our own legal counsel.
    </p>

    <h2>Limitation on Liability</h2>
    <p className="spacing2">
      Teams TeachSavy and PlanWise is not liable for any damages that may occur to you as a result of your misuse of our website.
    </p>
    <p className="spacing2">
      Teams TeachSavy and PlanWise reserves the right to edit, modify, and change this Agreement at any time. We shall let our users know of 
      these changes through electronic mail. This Agreement is an understanding between teams TeachSavy and PlanWise and the user, 
      and this supersedes and replaces all prior agreements regarding the use of this website.
    </p>

    <h2>Contacts</h2>
    <p className="spacing2">E-mail: planwise@gmail.com</p>
  </div>
</div>

  );
};

export default TermsOfService;
