import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
        < img src={assets.eatfit_logo} className="logo_size" alt="" />
             <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Modi, ut delectus. Illo, explicabo perferendis, voluptatibus cum molestiae accusamus blanditiis illum consequatur adipisci ab architecto asperiores praesentium maxime cupiditate facere? Quasi.</p>
             <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
             </div>

        </div>
        <div className="footer-content-center">
           <h2>COMPANY</h2>
           <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
           </ul>
        </div>

        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
             <ul>
                <li>+91-9856118555</li>
                <li>contact@eatfit.com</li>
             </ul>
        </div>
      </div>
      <hr />
      <div className="footer-copyright">Copyright 2025 eatFit.com - All Right Reserved.</div>
    </div>
  );
};

export default Footer;
