// ContactClientComponent.tsx - Final Version with Button + Modal

'use client';

import { useState, useCallback } from 'react';
import AppClientWrapper from '@/components/AppClientWrapper';

// 🚀 Form validation types
interface FormData {
  name: string;
  email: string;
  contactType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  contactType?: string;
  message?: string;
}

export default function ContactClientComponent() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    contactType: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 🚀 Memoized validation function
  const validateForm = useCallback((data: FormData): FormErrors => {
    const newErrors: FormErrors = {};
    
    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!data.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!data.contactType) {
      newErrors.contactType = 'Please select a contact type';
    }
    
    if (!data.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (data.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (data.message.trim().length > 1200) {
      newErrors.message = 'Message must be less than 1200 characters';
    }
    
    return newErrors;
  }, []);

  // 🚀 Memoized input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  // 🚀 Memoized submit handler
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit to Formspree with contact type
      const response = await fetch('https://formspree.io/f/mdkgodpr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _subject: `Contact Form: ${formData.contactType}`,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', contactType: '', message: '' });
        setErrors({});
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return (
    <AppClientWrapper>
      {/* 🚀 Responsive Container */}
      <div className="min-h-screen flex flex-col justify-center items-center text-[#f8fcdc] font-[Cinzel] px-4 md:px-6 pt-32">
        
        {/* Container for all content */}
        <div className="w-full max-w-3xl md:max-w-5xl pb-24">
          
          {/* 🚀 Main Content Wrapper */}
          <div className="flex flex-col items-center justify-center text-center">
            
            {/* 🚀 Title - 1 responsive only */}
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-[#dc9e63] mb-4 tracking-wide">
              CONTACT
            </h1>
            
            {/* 🚀 Description - 1 responsive only */}
            <p className="text-[#f8fcdc]/80 mb-8 max-w-lg md:max-w-2xl mx-auto leading-relaxed text-xs md:text-base">
              Get in touch for bookings, collaborations, <br className="md:hidden" />
              press inquiries, website support, or general questions.
            </p>
            
            {/* 🚀 Form/Success Message Container */}
            {submitted ? (
              <div className="w-full max-w-sm md:max-w-xl text-center space-y-4">
                <div className="text-[#dc9e63] text-xl font-semibold">
                  ✓ Message sent successfully!
                </div>
                <p className="text-[#f8fcdc]/70 text-sm">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[#dc9e63] hover:text-[#f8fcdc] underline text-sm cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="w-full max-w-sm md:max-w-xl space-y-6">
                
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block mb-2 text-[#dc9e63] text-left text-sm md:text-base">
                    Your name {errors.name && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 text-sm md:text-base ${
                      errors.name 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-[#dc9e63] focus:ring-[#dc9e63]'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-[#dc9e63] text-left text-sm md:text-base">
                    Your email {errors.email && <span className="text-red-400">*</span>}
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 text-sm md:text-base ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-[#dc9e63] focus:ring-[#dc9e63]'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Contact Type Field - DROPDOWN VERSION */}
                <div>
                  <label htmlFor="contactType" className="block mb-2 text-[#dc9e63] text-left text-sm md:text-base">
                    Contact Type {errors.contactType && <span className="text-red-400">*</span>}
                  </label>
                  <div className="relative">
                    <select
                      name="contactType"
                      id="contactType"
                      value={formData.contactType}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-4 py-2 pr-10 bg-transparent border rounded-md focus:outline-none focus:ring-2 text-sm md:text-base cursor-pointer appearance-none ${
                        errors.contactType 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-[#dc9e63] focus:ring-[#dc9e63]'
                      }`}
                    >
                      <option value="" className="bg-[#1a1a2e] text-[#f8fcdc]">- Please select -</option>
                      <option value="booking" className="bg-[#1a1a2e] text-[#f8fcdc]">Booking Inquiry (Live Performance, Events, Tours)</option>
                      <option value="collaboration" className="bg-[#1a1a2e] text-[#f8fcdc]">Collaboration Request (Features, Studio Work)</option>
                      <option value="press" className="bg-[#1a1a2e] text-[#f8fcdc]">Press/Media Inquiry (Interviews, Reviews)</option>
                      <option value="support" className="bg-[#1a1a2e] text-[#f8fcdc]">Website/Order Support (Digital/Physical Shop)</option>
                      <option value="general" className="bg-[#1a1a2e] text-[#f8fcdc]">General Question</option>
                    </select>
                    {/* Custom Arrow */}
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-4 h-4 text-[#dc9e63]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  {errors.contactType && <p className="text-red-400 text-xs mt-1">{errors.contactType}</p>}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block mb-2 text-[#dc9e63] text-left text-sm md:text-base">
                    Your message {errors.message && <span className="text-red-400">*</span>}
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    maxLength={1200}
                    className={`w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 text-sm md:text-base resize-vertical ${
                      errors.message 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-[#dc9e63] focus:ring-[#dc9e63]'
                    }`}
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  <p className={`text-xs mt-1 text-right ${
                    formData.message.length > 1100 ? 'text-yellow-400' : 'text-[#f8fcdc]/50'
                  }`}>
                    {formData.message.length}/1200 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-lg transition font-semibold text-sm md:text-base ${
                    isSubmitting
                      ? 'bg-[#dc9e63]/50 text-black/50 cursor-not-allowed'
                      : 'bg-[#dc9e63] text-black hover:bg-[#e6aa6f] cursor-pointer'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppClientWrapper>
  );
}