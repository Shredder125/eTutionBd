import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen pt-32 pb-16 bg-base-100">
      <div className="max-w-4xl mx-auto px-4">
        
        <h1 className="text-4xl font-bold text-center text-primary mb-4">Get in Touch</h1>
        <p className="text-lg text-center text-base-content/80 max-w-2xl mx-auto mb-12">
          We’re here to help! Send us a message or contact us directly using the details below.
        </p>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-base-200 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Contact Details */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-base-content mb-4">Contact Information</h2>
            
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-primary" />
              <div>
                <p className="font-medium">Email Support</p>
                <a href="mailto:support@etuitionbd.com" className="text-sm text-blue-500 hover:underline">support@etuitionbd.com</a>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-primary" />
              <div>
                <p className="font-medium">Phone/WhatsApp</p>
                <a href="tel:+8801XXXXXXXXX" className="text-sm text-blue-500 hover:underline">+880 1XXXXXXXXX</a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-primary mt-1" />
              <div>
                <p className="font-medium">Office Location</p>
                <p className="text-sm text-base-content/70">Dhaka, Bangladesh</p>
              </div>
            </div>
          </div>
          
          {/* Simple Message Form (Placeholder) */}
          <div className="border-l border-base-200 md:pl-8">
            <h2 className="text-2xl font-semibold text-base-content mb-4">Send a Message</h2>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="input input-bordered w-full" required />
              <input type="email" placeholder="Your Email" className="input input-bordered w-full" required />
              <textarea placeholder="Your Message" className="textarea textarea-bordered w-full" rows="4" required></textarea>
              <button type="submit" className="btn btn-primary w-full text-white">
                <Send size={18} /> Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;