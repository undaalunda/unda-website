// ContactClientComponent.tsx - Performance Optimized

'use client';

import { useState, useCallback } from 'react';
import AppClientWrapper from '@/components/AppClientWrapper';

// 🚀 Form validation types
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactClientComponent() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
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
    
    if (!data.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (data.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    return newErrors;
  }, []);

  // 🚀 Memoized input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      // Submit to Formspree
      const response = await fetch('https://formspree.io/f/mdkgodpr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
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
      <main className="contact-section">
        <h1 className="contact-title">Booking & Contact</h1>
        
        {submitted ? (
          <div className="w-full max-w-xl text-center space-y-4">
            <div className="text-[#dc9e63] text-xl font-semibold">
              ✓ Message sent successfully!
            </div>
            <p className="text-[#f8fcdc]/70">
              Thank you for reaching out. We'll get back to you soon.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-[#dc9e63] hover:text-[#f8fcdc] underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-[#dc9e63] text-sm sm:text-base">
                Your name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base ${
                  errors.name 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-[#dc9e63] focus:ring-[#dc9e63]'
                }`}
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-[#dc9e63] text-sm sm:text-base">
                Your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base ${
                  errors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-[#dc9e63] focus:ring-[#dc9e63]'
                }`}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block mb-2 text-[#dc9e63] text-sm sm:text-base">
                Your message
              </label>
              <textarea
                name="message"
                id="message"
                rows={5}
                value={formData.message}
                onChange={handleInputChange}
                required
                className={`w-full px-4 py-2 bg-transparent border rounded-md focus:outline-none focus:ring-2 text-sm sm:text-base resize-vertical ${
                  errors.message 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-[#dc9e63] focus:ring-[#dc9e63]'
                }`}
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
              <p className="text-xs text-[#f8fcdc]/50 mt-1">
                {formData.message.length}/500 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg transition text-sm sm:text-base ${
                isSubmitting
                  ? 'bg-[#dc9e63]/50 text-black/50 cursor-not-allowed'
                  : 'bg-[#dc9e63] text-black hover:bg-[#e6aa6f] cursor-pointer'
              }`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </main>
    </AppClientWrapper>
  );
}