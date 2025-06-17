// frontend/src/pages/WhyChooseUsPage.jsx
import React from 'react';

const WhyChooseUsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h1>
      <p className="text-lg text-gray-700">
        Discover what makes Apex Robotics the preferred choice for advanced automation solutions.
      </p>
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-apexBlue mb-3">Our Core Strengths</h2>
        <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
          <li>Cutting-edge technology and continuous innovation.</li>
          <li>Customer-centric approach with tailored solutions.</li>
          <li>Expert team with extensive industry experience.</li>
          <li>Robust support and maintenance services.</li>
          <li>Proven track record of successful deployments.</li>
        </ul>
      </div>
    </div>
  );
};

export default WhyChooseUsPage;