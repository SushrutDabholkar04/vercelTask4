// frontend/src/pages/ProductsPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const ProductsPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  // State to hold the items currently selected (acting as a mini-cart)
  // Each item in this array will be the full product category object
  const [selectedItems, setSelectedItems] = useState([]);

  // Function to add an item to the selected items list
  const addItemToCart = (product) => {
    const existingItemIndex = selectedItems.findIndex(item => item.name === product.name);

    if (existingItemIndex > -1) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: (updatedItems[existingItemIndex].quantity || 1) + 1
      };
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { ...product, quantity: 1 }]);
    }
  };

  // Function to remove an item from the selected items list
  const removeItemFromCart = (productName) => {
    setSelectedItems(selectedItems.filter(item => item.name !== productName));
  };

  // Function to calculate the total price of selected items
  const calculateTotalPrice = () => {
    return selectedItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  // Modified "Proceed to Checkout" action to navigate
  const handleCheckout = () => {
    const total = calculateTotalPrice();
    if (selectedItems.length === 0) {
      alert("Your cart is empty. Please select some items first!");
      return;
    }
    
    // Navigate to the CheckoutPage, passing selected items and total in state
    navigate('/checkout', { state: { selectedItems: selectedItems, total: total } });
  };


  // Define the product categories with their image URLs and external links
  // Added random prices for each item
  const productCategories = [
    {
      name: "SPECIAL DISCOUNT",
      imageUrl: "https://img.robokits.co.in/d/d572d23bea84071f96975c9c49a9a911.image.250x187.jpg",
      url: "https://robokits.co.in/special-discount",
      price: parseFloat((Math.random() * (150 - 50) + 50).toFixed(2)) // Random price between $50 and $150
    },
    {
      name: "MULTIROTOR SPARE PARTS",
      imageUrl: "https://img.robokits.co.in/0/01dfdb600dc4b7a25d13a396252ffe93.image.250x187.jpg",
      url: "https://robokits.co.in/multirotor-spare-parts",
      price: parseFloat((Math.random() * (300 - 100) + 100).toFixed(2)) // Random price between $100 and $300
    },
    {
      name: "BATTERIES & CHARGERS",
      imageUrl: "https://img.robokits.co.in/0/075825e3195cc7859824ac97a787a742.image.250x187.jpg",
      url: "https://robokits.co.in/batteries-chargers",
      price: parseFloat((Math.random() * (100 - 20) + 20).toFixed(2))
    },
    {
      name: "T-MOTOR PARTS",
      imageUrl: "https://img.robokits.co.in/1/1c50de45ef65eb8af3210d20a1fc8209.image.250x187.jpg",
      url: "https://robokits.co.in/t-motor-parts",
      price: parseFloat((Math.random() * (250 - 80) + 80).toFixed(2))
    },
    {
      name: "MOTORS",
      imageUrl: "https://img.robokits.co.in/e/e3f001e38f9b96e8f726c9d65721d3ac.image.250x187.jpg",
      url: "https://robokits.co.in/motors",
      price: parseFloat((Math.random() * (400 - 150) + 150).toFixed(2))
    },
    {
      name: "MECHANICAL PARTS",
      imageUrl: "https://img.robokits.co.in/2/2f518359a47f22732d30411ac55aad4d.image.250x187.jpg",
      url: "https://robokits.co.in/mechanical-parts",
      price: parseFloat((Math.random() * (80 - 10) + 10).toFixed(2))
    },
    {
      name: "E-BIKE PARTS",
      imageUrl: "https://img.robokits.co.in/f/fde39c5025f99d31573d8969725edcfe.image.250x187.jpg",
      url: "https://robokits.co.in/e-bike",
      price: parseFloat((Math.random() * (800 - 300) + 300).toFixed(2))
    },
    {
      name: "AUTOMATION, LASER ENGRAVER, CNC",
      imageUrl: "https://img.robokits.co.in/d/d4d40bc8b16b1462100c9fabdd0e2394.image.250x187.jpg",
      url: "https://robokits.co.in/automation-control-cnc",
      price: parseFloat((Math.random() * (2000 - 800) + 800).toFixed(2))
    },
    {
      name: "SOLAR PANEL CLEANING ROBOT PARTS",
      imageUrl: "https://img.robokits.co.in/9/9770ddce54f905f2b09e1078e643c6e3.image.250x187.jpg",
      url: "https://robokits.co.in/solar-panel-cleaning-robot-parts",
      price: parseFloat((Math.random() * (150 - 40) + 40).toFixed(2))
    },
    {
      name: "SOLAR VFD AND PUMP",
      imageUrl: "https://img.robokits.co.in/5/544e3a1be7850cb307fe2b96d0947d7c.image.250x187.jpg",
      url: "https://robokits.co.in/solar-vfd-and-pump",
      price: parseFloat((Math.random() * (1000 - 500) + 500).toFixed(2))
    },
    {
      name: "ROBOT PARTS",
      imageUrl: "https://img.robokits.co.in/0/032df5efaf3188ca9640a1d594ffaee4.image.250x187.jpg",
      url: "https://robokits.co.in/robot-parts",
      price: parseFloat((Math.random() * (100 - 20) + 20).toFixed(2))
    },
    {
      name: "IOT - WIRELESS SOLUTIONS",
      imageUrl: "https://img.robokits.co.in/7/7ab0f87e0b0cbc296a05795de21a1bb7.image.250x187.jpg",
      url: "https://robokits.co.in/wireless-solutions",
      price: parseFloat((Math.random() * (120 - 30) + 30).toFixed(2))
    },
    {
      name: "DEVELOPMENT BOARD",
      imageUrl: "https://img.robokits.co.in/5/52b6875de43db8e8b85b0e82cbc8ca00.image.250x187.jpg",
      url: "https://robokits.co.in/development-board",
      price: parseFloat((Math.random() * (60 - 15) + 15).toFixed(2))
    },
    {
      name: "RASPBERRY PI",
      imageUrl: "https://img.robokits.co.in/2/2bfccf03831a032b4faa97a8f15c28fd.image.250x187.jpg",
      url: "https://robokits.co.in/raspberry-pi",
      price: parseFloat((Math.random() * (100 - 40) + 40).toFixed(2))
    },
    {
      name: "PROGRAMMERS",
      imageUrl: "https://img.robokits.co.in/b/bf7fe4ad4b46d2843fe099f70aead0df.image.250x187.jpg",
      url: "https://robokits.co.in/programmers",
      price: parseFloat((Math.random() * (80 - 25) + 25).toFixed(2))
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row">
      {/* Left Column: Product Grid */}
      <div className="lg:w-3/4 pr-0 lg:pr-8 mb-8 lg:mb-0">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Products</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {productCategories.map((category, index) => (
            <div key={index} className="
                bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 overflow-hidden
                flex flex-col {/* Make the card a flex container, column direction */}
              ">
              {/* This entire block (image + text) will flex-grow to push the button down */}
              <a
                href={category.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-grow" // Add flex-grow here
              >
                <div className="w-full h-40 flex items-center justify-center p-2">
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="p-3 text-center">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase leading-tight">
                    {category.name}
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">
                    Price: ${category.price.toFixed(2)}
                  </p>
                </div>
              </a>

              {/* "Buy Kit" Button - will stick to the bottom because the content above flex-grows */}
              <div className="p-3 pt-0 text-center mt-auto"> {/* mt-auto pushes it to the bottom */}
                <button
                  onClick={() => addItemToCart(category)}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Buy Kit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Selected Items / Cart Summary */}
      <div className="lg:w-1/4 bg-gray-50 p-6 rounded-lg shadow-lg sticky top-8 h-fit">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">Selected Items</h2>

        {selectedItems.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No items selected yet.</p>
        ) : (
          <>
            <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {selectedItems.map((item, index) => (
                <li key={item.name + index} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{item.name}</p>
                    <p className="text-gray-600 text-xs">${item.price.toFixed(2)} {item.quantity > 1 && `(x${item.quantity})`}</p>
                  </div>
                  <button
                    onClick={() => removeItemFromCart(item.name)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold ml-4 p-1 rounded-full hover:bg-red-100 transition-colors"
                    title="Remove item"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800 mb-4">
                <span>Total:</span>
                <span>${calculateTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;