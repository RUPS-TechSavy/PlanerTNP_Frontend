import './privacyPolicy.css'; // Use the same CSS file as Privacy Policy
import React, { useEffect} from 'react';

const WebsiteDisclaimer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="privacy-background">
  <div className="privacy-container">
    <h1>PlanWise Disclaimer</h1>
    <p>Please read this disclaimer carefully before using the PlanWise website operated by team TeachSavy.</p>
    <p>
      We are two teams of students at the Faculty of Electrical Engineering, Computer Science and Informatics, 
      attending the 2nd cycle of studies. We developed this website for the course Development and Management 
      of Software Systems.
    </p>
    <p>
      This website was developed with the intent to be used to help with time and activity management and only 
      for this purpose.
    </p>
    <p>
      Teams PlanWise and TeachSavy take no responsibility or liability for the improper use of this website. 
      Under no circumstances will Teams PlanWise and TeachSavy be held responsible or liable in any way for any 
      claims, damages, losses, expenses, costs, or liabilities whatsoever (including, without limitation, any 
      direct or indirect damages for loss of profits, business interruption, or loss of information) resulting 
      from or arising directly or indirectly from your use or inability to use this website or any websites 
      linked to it, or from your reliance on the information and materials on this website, even if Teams 
      PlanWise and TeachSavy had been advised in advance of the possibility of such damages.
    </p>
    <p>
      The content displayed on the website is the intellectual property of the teams TeachSavy and team PlanWise. 
      You may not reuse, republish, or reprint such content without our written consent.
    </p>
    <p>
      All information posted is merely for educational and informational purposes. It is not intended as a 
      substitute for professional advice. Should you decide to act upon any information on this website, 
      you do so at your own risk.
    </p>
    <p>
      While the information on this website has been verified to the best of our abilities, we cannot guarantee 
      that there are no mistakes or errors.
    </p>
    <p>
      We reserve the right to change this policy at any given time, of which you will be promptly updated. If you 
      want to make sure that you are up to date with the latest changes, we advise you to frequently visit this page.
    </p>
    <p>
      For any legal or performance issues please refer to our customer support at 
      planwise@gmail.com. Thank you for reading this disclaimer.
    </p>
  </div>
</div>

  );
};

export default WebsiteDisclaimer;
