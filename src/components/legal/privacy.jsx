import './privacyPolicy.css';
import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="privacy-background">
      <div className="privacy-container">
        <h1 className="spacing">PlanWise Privacy Policy</h1>
        <p className="spacing2">
          This privacy policy will help you understand how teams PlanWise and TeachSavy are using and protecting the data you provide to us when
          you visit and use https://www.planwise.com.
        </p>
        <p className="spacing2">
          We reserve the right to change this policy at any given time, of which you will be promptly updated. If you want to make sure that you are up
          to date with the latest changes, we advise you to frequently visit this page.
        </p>

        <h2>What User Data We Collect</h2>
        <p>When you visit the blog, we may collect the following data:</p>
        <ul className="spacing2">
          <li>Your contact information and email address.</li>
          <li>Other information such as interests and preferences.</li>
        </ul>

        <h2>Why We Collect Your Data</h2>
        <p>We are collecting your data for several reasons:</p>
        <ul
          className="spacing2">
          <li>To enable account creation and customization.</li>
          <li>To customize our blog according to your online behavior and personal preferences.</li>
        </ul>

        <h2>Safeguarding and Securing the Data</h2>
        <p
          className="spacing2">
          Teams TeachSavy and PlanWise are committed to securing your data and keeping it confidential. Teams TeachSavy and PlanWise have done all in
          our power to prevent data theft, unauthorized access, and disclosure by implementing the latest technologies and software, which help us
          safeguard all the information we collect online (such as the MongoDB Atlas database).
        </p>

        <h2>Our Cookie Policy</h2>
        <p className="spacing2">
          Once you agree to allow our blog to use cookies, you also agree to use the data it collects regarding your online behavior (analyze web
          traffic, web pages you visit and spend the most time on).
        </p>
        <p className="spacing2">
          The data we collect by using cookies is used to customize our blog to your needs. After we use the data for statistical analysis, the data
          is completely removed from our systems.
        </p>
        <p className="spacing2">
          Please note that cookies don't allow us to gain control of your computer in any way. They are strictly used for page functionality.
        </p>
        <p className="spacing2">
          If you want to disable cookies, you can do it by accessing the settings of your internet browser. You can visit
          <a href="https://www.internetcookies.com" target="_blank" rel="noopener noreferrer">https://www.internetcookies.com</a>, which contains
          comprehensive information on how to do this on a wide variety of browsers and devices, but this might prevent some features from working.
        </p>

        <h2>Restricting the Collection of Your Personal Data</h2>
        <p>At some point, you might wish to restrict the use and collection of your personal data. You can achieve this by doing the following:</p>
        <ul className="spacing2">
          <li>
            When you are filling the forms on the website, make sure to check if there is a box that you can leave unchecked, if you don't want to disclose
            your personal information.
          </li>
          <li>
            If you have already agreed to share your information with us, feel free to contact us via email, and we will be more than happy to change this
            for you.
          </li>
        </ul>
        <p className="spacing2">
          Teams TeachSavy and PlanWise will not lease, sell, or distribute your personal information to any third parties, unless we have your permission.
          We might do so if the law forces us.
        </p>
      </div>
    </div>

  );
};

export default PrivacyPolicy;
