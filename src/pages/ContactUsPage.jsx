// frontend/src/pages/ContactUsPage.jsx
import React from 'react';

const ContactUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-apexDarkBlue mb-8">Contact Us</h1>
      <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
        Have questions, need support, or ready to discuss your automation needs? Reach out to us through the form below, or use our direct contact information.
      </p>

      <div className="flex flex-col md:flex-row gap-10 bg-white shadow-lg rounded-lg p-8">
        {/* Contact Form */}
        <div className="md:w-1/2">
          <h2 className="text-2xl font-semibold text-apexBlue mb-6">Send Us a Message</h2>
          <form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-apexBlue focus:border-apexBlue sm:text-sm"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-apexBlue focus:border-apexBlue sm:text-sm"
                placeholder="john.doe@example.com"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-apexBlue focus:border-apexBlue sm:text-sm"
                placeholder="Inquiry about products"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-apexBlue focus:border-apexBlue sm:text-sm"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-apexBlue text-white py-3 rounded-md text-lg font-semibold hover:bg-apexDarkBlue transition-colors"
            >
              Submit Message
            </button>
          </form>
        </div>

        {/* Direct Contact Info */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-apexBlue mb-6">Our Contact Details</h2>
            <div className="space-y-4 text-gray-800">
              <p>
                <span className="font-semibold block">Address:</span>
                H R Mahajani Rd, Matunga East <br />
                Mumbai, Maharashtra 400019, India
              </p>
              <p>
                <span className="font-semibold block">Phone:</span>
                +91 98765 43210
              </p>
              <p>
                <span className="font-semibold block">Email:</span>
                <a href="mailto:info@apexrobotics.com" className="text-apexBlue hover:underline">info@apexrobotics.com</a>
              </p>
              <p>
                <span className="font-semibold block">Business Hours:</span>
                Monday - Friday: 9:00 AM - 6:00 PM (IST)
              </p>
            </div>
          </div>
          {/* Google Maps Embed */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-apexBlue mb-3">Find Us on Map</h3>
            <iframe
              title="Google Maps - Mumbai"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.943342977422!2d72.8561212!3d19.022218100000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7cf26f4972d21%3A0x2c50185364aca4c1!2sVeermata%20Jijabai%20Technological%20Institute!5e0!3m2!1sen!2sin!4v1749730306882!5m2!1sen!2sin" 
              
            >
              
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;