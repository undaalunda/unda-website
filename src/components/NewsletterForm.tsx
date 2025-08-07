/* NewsletterForm.tsx - Fixed Accessibility Issues */

'use client';

import React from 'react';
// ถ้าใช้ Lucide React (ติดตั้งด้วย: npm install lucide-react)
// import { Instagram, Youtube, Facebook, Twitter, Music } from 'lucide-react';

export default function NewsletterForm() {
  return (
    <section className="newsletter-container">
      <h2 className="newsletter-title">NEWSLETTER SIGN UP</h2>

      <form
        action="https://unda-alunda.us1.list-manage.com/subscribe/post?u=3b4e88384cbe530945e9a9cfd&amp;id=835cafe901&amp;f_id=0070cce0f0"
        method="post"
        name="mc-embedded-subscribe-form"
        target="_blank"
        noValidate
        className="newsletter-form"
      >
        <div className="newsletter-grid">
          {/* ✅ เพิ่ม label และ id สำหรับ email input */}
          <label htmlFor="newsletter-email" className="sr-only">Email Address</label>
          <input
            id="newsletter-email"
            type="email"
            name="EMAIL"
            required
            placeholder="Email Address"
            className="newsletter-input"
            aria-describedby="email-help"
          />
          
          {/* ✅ เพิ่ม label และ aria-label สำหรับ country select */}
          <label htmlFor="country-select" className="sr-only">Select your country</label>
          <select 
            id="country-select"
            name="MMERGE7" 
            className="newsletter-select"
            aria-label="Select your country"
          >
            <option value="">Select a country...</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Germany">Germany</option>
            <option value="France">France</option>
            <option value="Italy">Italy</option>
            <option value="Spain">Spain</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Sweden">Sweden</option>
            <option value="Norway">Norway</option>
            <option value="Denmark">Denmark</option>
            <option value="Finland">Finland</option>
            <option value="Ireland">Ireland</option>
            <option value="New Zealand">New Zealand</option>
            <option value="Japan">Japan</option>
            <option value="South Korea">South Korea</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="Brazil">Brazil</option>
            <option value="Mexico">Mexico</option>
            <option value="Argentina">Argentina</option>
            <option value="South Africa">South Africa</option>
            <option value="Russia">Russia</option>
            <option value="Ukraine">Ukraine</option>
            <option value="Poland">Poland</option>
            <option value="Austria">Austria</option>
            <option value="Belgium">Belgium</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Portugal">Portugal</option>
            <option value="Greece">Greece</option>
            <option value="Turkey">Turkey</option>
            <option value="Thailand">Thailand</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Singapore">Singapore</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Philippines">Philippines</option>
            <option value="Vietnam">Vietnam</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
            <option value="Egypt">Egypt</option>
            <option value="Israel">Israel</option>
            <option value="Chile">Chile</option>
            <option value="Colombia">Colombia</option>
            <option value="Peru">Peru</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Kenya">Kenya</option>
            <option value="Morocco">Morocco</option>
            <option value="Czech Republic">Czech Republic</option>
            <option value="Romania">Romania</option>
            <option value="Hungary">Hungary</option>
            <option value="Slovakia">Slovakia</option>
            <option value="Slovenia">Slovenia</option>
            <option value="Bulgaria">Bulgaria</option>
            <option value="Croatia">Croatia</option>
            <option value="Serbia">Serbia</option>
            <option value="Estonia">Estonia</option>
            <option value="Latvia">Latvia</option>
            <option value="Lithuania">Lithuania</option>
            <option value="Pakistan">Pakistan</option>
            <option value="Bangladesh">Bangladesh</option>
            <option value="Sri Lanka">Sri Lanka</option>
            <option value="Nepal">Nepal</option>
            <option value="Myanmar">Myanmar</option>
            <option value="Cambodia">Cambodia</option>
            <option value="Laos">Laos</option>
            <option value="Mongolia">Mongolia</option>
            <option value="Kazakhstan">Kazakhstan</option>
            <option value="Uzbekistan">Uzbekistan</option>
            <option value="Qatar">Qatar</option>
            <option value="Kuwait">Kuwait</option>
            <option value="Oman">Oman</option>
            <option value="Bahrain">Bahrain</option>
            <option value="Jordan">Jordan</option>
            <option value="Lebanon">Lebanon</option>
            <option value="Iceland">Iceland</option>
            <option value="Luxembourg">Luxembourg</option>
            <option value="Malta">Malta</option>
            <option value="Cyprus">Cyprus</option>
            <option value="Georgia">Georgia</option>
            <option value="Armenia">Armenia</option>
            <option value="Azerbaijan">Azerbaijan</option>
            <option value="Panama">Panama</option>
            <option value="Costa Rica">Costa Rica</option>
            <option value="Uruguay">Uruguay</option>
            <option value="Paraguay">Paraguay</option>
            <option value="Bolivia">Bolivia</option>
            <option value="Ecuador">Ecuador</option>
            <option value="Guatemala">Guatemala</option>
            <option value="Honduras">Honduras</option>
            <option value="El Salvador">El Salvador</option>
            <option value="Nicaragua">Nicaragua</option>
            <option value="Jamaica">Jamaica</option>
            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
            <option value="Barbados">Barbados</option>
            <option value="Bahamas">Bahamas</option>
            <option value="Dominican Republic">Dominican Republic</option>
            <option value="Cuba">Cuba</option>
            <option value="Zimbabwe">Zimbabwe</option>
            <option value="Zambia">Zambia</option>
            <option value="Ghana">Ghana</option>
            <option value="Uganda">Uganda</option>
            <option value="Tanzania">Tanzania</option>
            <option value="Algeria">Algeria</option>
            <option value="Tunisia">Tunisia</option>
            <option value="Libya">Libya</option>
            <option value="Sudan">Sudan</option>
            <option value="Ethiopia">Ethiopia</option>
            <option value="Cameroon">Cameroon</option>
            <option value="Ivory Coast">Ivory Coast</option>
            <option value="Senegal">Senegal</option>
            <option value="Madagascar">Madagascar</option>
            <option value="Mozambique">Mozambique</option>
            <option value="Namibia">Namibia</option>
            <option value="Botswana">Botswana</option>
            <option value="Rwanda">Rwanda</option>
          </select>
        </div>

        <div className="newsletter-grid">
          {/* ✅ เพิ่ม label สำหรับ first name */}
          <label htmlFor="first-name" className="sr-only">First Name</label>
          <input
            id="first-name"
            type="text"
            name="FNAME"
            placeholder="First Name"
            className="newsletter-input"
          />
          
          {/* ✅ เพิ่ม label สำหรับ last name */}
          <label htmlFor="last-name" className="sr-only">Last Name</label>
          <input
            id="last-name"
            type="text"
            name="LNAME"
            placeholder="Last Name"
            className="newsletter-input"
          />
        </div>

        {/* ✅ เพิ่ม aria-label สำหรับ submit button */}
        <button 
          type="submit" 
          name="subscribe" 
          className="newsletter-button"
          aria-label="Subscribe to newsletter"
        >
          SUBSCRIBE
        </button>

        {/* ✅ เพิ่ม hidden text สำหรับ screen readers */}
        <div id="email-help" className="sr-only">
          We'll never share your email with anyone else
        </div>
      </form>

    </section>
  );
}