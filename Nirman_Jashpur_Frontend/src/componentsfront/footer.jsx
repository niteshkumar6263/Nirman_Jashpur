import React from 'react';// Ensure you have
const Footer = () => {
  return (
    <footer className='footer'>
        <div className='footer-content'>
          <img src= "https://www.nirmanjashpur.in/web_assets/images/njsplogo.png" alt="jaspurlogo" className='logo'  />
          <div className='footer-contact'>
            <h1>
              महत्वपूर्ण संपर्क
            </h1>
            <ul>
                <p>
                <i class = 'fas fa-envelope'></i>
                  Email : <a href = "mailto:dplc-jashpur@cg.gov.in" >dplc-jashpur@cg.gov.in</a>
                </p>
                <p>
                <i class = 'fas fa-phone'></i>
                  Phone : <a href = "70497 90009" >7049790009</a>
                </p>
            </ul>
          </div>
          <div className='footer-links'>
            <h1>
              महत्वपूर्ण लिंक
            </h1>
            <ul>
              <li>
                <a href = "https://jashpur.nic.in/" target="_blank" >
                  <i class = 'fas-solid fa-chevron-right'></i>
                  जशपुर जिला आधिकारिक वेबसाइट
                </a>
              </li>
              <li>
                <a href = "https://jashpur.nic.in/" target="_blank" >
                  <i class = 'fas-solid fa-chevron-right'></i>
                  स्वास्थ्य जशपुर
                </a>
              </li>
              <li>
                <a href = "https://jashpur.nic.in/" target="_blank" >
                  <i class = 'fas-solid fa-chevron-right'></i>
                  समय-सीमा जशपुर
                </a>
              </li>
            </ul>
          </div>
          <div className='footer-social'>
            <h1>
              तकनीकी सहायता
            </h1>
            <p>
              निर्माण जशपुर वेबसाइट से संबंधित किसी भी सहायता हेतु:
            </p>
            <button >
               <a href = "70497 90009" >7049790009</a>
            </button>
          </div>
        </div>
        <div className='footer-bottom'>
          <p>
            Copyright © 2025. निर्माण जशपुर | Designed & Developed By 
            <a href = "https://www.linkedin.com/company/turing-club-of-programmers-nitrr/?originalSubdomain=in" className='turingclub' target="_blank" rel="noopener noreferrer">Turing Club of Programmers NIT Raipur</a>
          </p>
        </div>
    </footer>
    );      
}
export default Footer;