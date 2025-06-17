// frontend/src/pages/InformationPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const InformationPage = () => {
  const infoSections = [
    {
      title: 'Blog & News',
      description: 'Stay updated with the latest trends, news, and insights in the world of robotics and automation from our experts.',
      link: '/information/blogs',
      icon: (
        <svg className="w-8 h-8 text-apexBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m-7 4H5m7 0h7"></path>
        </svg>
      ),
    },
    {
      title: 'Case Studies',
      description: 'Discover how Apex Robotics has successfully implemented automation solutions for various clients across different industries.',
      link: '/information/case-studies',
      icon: (
        <svg className="w-8 h-8 text-apexBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.55 23.55 0 0112 15c-1.606 0-3.155-.386-4.576-1.127M12 21v-3.75m-4.5-5.25H4.5m15 0h-3.75M12 3v2.25m4.5 4.5h3.75M12 21l-3 4.5m3-4.5l3 4.5M12 3l-3-4.5m3 4.5l3-4.5"></path>
        </svg>
      ),
    },
    {
      title: 'Deployment Steps',
      description: 'Understand our streamlined process for integrating robotic solutions into your existing operations, from consultation to launch.',
      link: '/information/deployment-steps',
      icon: (
        <svg className="w-8 h-8 text-apexBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
    },
    {
      title: 'Why Choose Us?',
      description: 'Learn about our unique value proposition, commitment to innovation, customer-centric approach, and what sets us apart.',
      link: '/why-choose-us',
      icon: (
        <svg className="w-8 h-8 text-apexBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
    },
    {
      title: 'Robotics Basics',
      description: 'A foundational guide to the principles of robotics, automation, and AI for those new to the field.',
      link: '/information/basics',
      icon: (
        <svg className="w-8 h-8 text-apexBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.523 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.523 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-apexDarkBlue mb-8">Information Hub</h1>
      <p className="text-center text-gray-700 mb-10 max-w-2xl mx-auto">
        Find resources, articles, and insights to deepen your understanding of robotics and Apex Robotics' capabilities.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {infoSections.map((section, index) => (
          <Link
            key={index}
            to={section.link}
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:scale-105 border border-apexBlue"
          >
            <div className="flex items-center mb-4">
              {section.icon}
              <h2 className="text-xl font-semibold text-apexBlue ml-3">{section.title}</h2>
            </div>
            <p className="text-gray-700 text-sm">{section.description}</p>
          </Link>
        ))}
      </div>

      {/* Note: For these links to work, you will need to uncomment their corresponding
          imports and routes in App.jsx when you decide to build out these sub-pages.
          For now, if you click them, they will lead to a blank page if not routed. */}
    </div>
  );
};

export default InformationPage;