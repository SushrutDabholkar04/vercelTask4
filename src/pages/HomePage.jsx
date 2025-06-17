// frontend/src/pages/HomePage.jsx
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom'; // Import Link for navigation

const HomePage = () => {
  const images = [
    'https://png.pngtree.com/background/20230410/original/pngtree-robot-blue-light-technology-artificial-intelligence-future-robot-picture-image_2380622.jpg',
    'https://s3u.tmimgcdn.com/800x0/2311509-1606671762635_azary.jpg',
    'https://cdn.motocms.com/src/868x580/72100/72176-original-1200.jpg',
    'https://tse4.mm.bing.net/th?id=OIP.g-A-nTQKw6oWjDzAH9JaHwHaDk&pid=Api&P=0&h=180',
  ];

  const gridItems = [
    {
      type: "NEWS",
      image: 'https://www.dignited.com/wp-content/uploads/2018/09/Robotic-Arm-1024x641.jpg',
      title: "Apex Robotics Develops Robotic Arm",
      description: "Apex develops robotic arm for Dexterity, a U.S. Unicorn Company.",
      link: null // No specific link for NEWS yet
    },
    {
      type: "BLOG",
      image: 'https://kawasakirobotics.com/tachyon/2022/06/header-image.jpg?resize=720%2C405&crop_strategy=smart',
      title: "Ready for a Robot? Get More information",
      description: "Integration insights for Welding Applications. Click here for more information",
      link: "/information" // Link for BLOG to information page
    },
    {
      type: "EVENTS",
      image: 'https://static.vecteezy.com/system/resources/previews/036/281/162/non_2x/international-women-s-day-inspire-inclusion-2024-campaign-group-of-women-of-different-ethnicity-age-body-type-hair-color-illustration-in-flat-style-vector.jpg',
      title: "International Women's Day 2025",
      description: "Celebrating International Women's Day 2025 with Apex Robotics.",
      link: null // No specific link for EVENTS yet
    },
    {
      type: "ONLINE EVENTS",
      image: 'https://i.pinimg.com/originals/c1/3b/c2/c13bc2009b83482b6dfd954ae8609592.jpg',
      title: "IREX2022 Event Website",
      description: "Discover the latest in robotics at the IREX2022 Online Event.",
      link: null // No specific link for ONLINE EVENTS yet
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    fade: true,
    cssEase: 'linear'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-apexDarkBlue mb-4">Welcome to Apex Robotics!</h1>
      <p className="text-lg text-center text-gray-700 mb-8">Innovating Tomorrow's Automation, Today.</p>

      <div className="max-w-4xl mx-auto mb-12">
        <Slider {...settings}>
          {images.map((img, index) => (
            <div key={index} className="px-2">
              <img
                src={img}
                alt={`Robotics Image ${index + 1}`}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          ))}
        </Slider>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {gridItems.map((item, index) => (
              // Conditionally wrap the entire card with Link if item.link exists
              <React.Fragment key={index}>
                {item.link ? (
                  <Link to={item.link} className="block"> {/* Using 'block' to make Link act like a block element */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-bl-lg">
                          {item.type}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col justify-between h-48">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-tight">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                        {/* The button itself might not be directly clickable within a Link,
                            but the whole card will be. For a clickable button inside a link,
                            you'd usually style the link to look like a button, or use an onClick handler.
                            Here, the whole card is the clickable area for simplicity. */}
                        
                      </div>
                    </div>
                  </Link>
                ) : (
                  // Render as a non-clickable div if no link
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded-bl-lg">
                        {item.type}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col justify-between h-48">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2 leading-tight">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Existing content: Our Vision */}
      <div className="text-center mt-12">
        <h2 className="text-3xl font-bold text-apexBlue mb-4">Our Vision</h2>
        <p className="text-gray-700 max-w-3xl mx-auto">
          At Apex Robotics, we envision a future where advanced automation seamlessly integrates with human potential,
          driving efficiency, safety, and innovation across every industry. We are dedicated to pioneering robotics
          that not only meet today's demands but also anticipate tomorrow's challenges.
        </p>
      </div>

      {/* Existing content: Why Choose Apex Robotics? */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-apexDarkBlue mb-6">Why Choose Apex Robotics?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-apexBlue mb-3">Cutting-Edge Technology</h3>
            <p className="text-gray-700">
              We leverage the latest advancements in AI, machine learning, and hardware to deliver superior robotic solutions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-apexBlue mb-3">Customized Solutions</h3>
            <p className="text-gray-700">
              Our team works closely with clients to design and implement robotic systems tailored to unique operational needs.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold text-apexBlue mb-3">Unmatched Support</h3>
            <p className="text-gray-700">
              From installation to ongoing maintenance, our dedicated support team ensures seamless operation and maximum uptime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;