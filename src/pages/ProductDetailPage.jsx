// frontend/src/pages/ProductDetailPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetailPage = () => {
  const { productId } = useParams();

  // Dummy data for a single product (in a real app, you'd fetch this from your backend)
  const product = {
    id: productId, // Use the ID from the URL
    name: `Product ${productId} Name`,
    description: `Detailed description for Product ${productId}. This would include specifications, features, benefits, and applications.`,
    price: `₹${(1000000 + (parseInt(productId) * 100000)).toLocaleString()}`, // Dynamic price
    imageUrl: `https://via.placeholder.com/600x400/0056b3/FFFFFF?text=Product+${productId}+Details`,
    details: [
      'Advanced Sensor Integration',
      'Modular Design for Customization',
      'Energy Efficient Operation',
      'Comprehensive Safety Features',
      '24/7 Technical Support'
    ]
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-red-600">Product Not Found</h1>
        <p className="mt-4 text-gray-600">The product you are looking for does not exist.</p>
        <Link to="/products" className="mt-6 inline-block bg-apexBlue text-white px-6 py-3 rounded hover:bg-apexDarkBlue transition-colors">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="text-apexBlue hover:underline flex items-center mb-6">
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Products
      </Link>

      <div className="flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-8">
        <div className="md:w-1/2">
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-md" />
        </div>
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-apexDarkBlue mb-4">{product.name}</h1>
            <p className="text-gray-800 text-lg mb-6">{product.description}</p>
            <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
          <div className="mt-auto">
            <span className="text-4xl font-extrabold text-apexBlue block mb-4">{product.price}</span>
            <button className="bg-apexBlue text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-apexDarkBlue transition-colors duration-300 w-full">
              Request a Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;