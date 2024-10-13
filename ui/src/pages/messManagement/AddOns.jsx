import React, { useState } from 'react';
import { FaHamburger, FaArrowLeft } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

function AddOns() {
  const [isToggled, setIsToggled] = useState({}); 
  const navigate = useNavigate()

  const products = [
    {
      id: 1,
      name: 'Burger',
      price: '₹129', 
      image: 'data:image/jpeg;base64,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', // Placeholder image for burger
    },
    {
      id: 2,
      name: 'Pizza',
      price: '₹259', 
      image: 'https://img.freepik.com/free-photo/top-view-pepperoni-pizza-with-mushroom-sausages-bell-pepper-olive-corn-black-wooden_141793-2158.jpg', 
    },
    {
      id: 3,
      name: 'Sandwich',
      price: '₹30', 
      image: 'https://static.vecteezy.com/system/resources/previews/022/513/459/non_2x/grilled-and-sandwich-with-bacon-fried-egg-tomato-and-lettuce-served-on-wooden-cutting-board-by-ai-generated-free-photo.jpg', 
    },
    {
      id: 4,
      name: 'Pasta',
      price: '₹29', 
      image: 'https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19744.jpg', 
    },
    {
      id: 5,
      name: 'Salad',
      price: '₹59', 
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh5d-ZLSzGRF6HDdYEyo0X6YhEd08hmo6Rdg&s', 
    },
    {
      id: 6,
      name: 'Fries',
      price: '₹79', 
      image: 'https://static.vecteezy.com/system/resources/thumbnails/027/536/411/small/delicious-french-fries-on-a-white-background-photo.jpg', 
    },
    {
      id: 7,
      name: 'Tacos',
      price: '₹129', 
      image: 'https://www.onceuponachef.com/images/2023/08/Beef-Tacos.jpg', 
    },
    {
      id: 8,
      name: 'Steak',
      price: '₹450', 
      image: 'https://media.istockphoto.com/id/1371751060/photo/grilled-medium-rare-top-sirloin-beef-steak-or-rump-steak-on-a-steel-tray-dark-background-top.jpg?s=612x612&w=0&k=20&c=svqnTZV_l7DP0QPCG8L_-f6k7LuBUA-cH9wiL8eJqUs=', 
    },
  ];

  const handleToggle = (productId) => {
    setIsToggled((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId], // Toggle the state for each product
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
    {/* Top Section with Back and Add Item Buttons */}
    <div className="flex justify-between">
      {/* Back Button */}
      <button 
      onClick={()=>navigate('/mess')}
      className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full w-32 flex items-center justify-center space-x-2">
        <FaArrowLeft size={16} /> {/* Back icon */}
        <span>Back</span>
      </button>

      {/* Add Item Button */}
      <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-40 flex items-center justify-center space-x-2">
        <FaHamburger size={16} /> {/* Burger icon */}
        <span>Add Item</span>
      </button>
    </div>

    {/* Available Menu Title */}
    <h2 className="text-2xl font-semibold mt-6 mb-4">Available Menu</h2>

    {/* New Section for Product Cards */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-8"> {/* Responsive grid layout */}
      {products.map((product) => (
        <div 
          key={product.id} 
          className="bg-white p-4 rounded-lg shadow-md flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300" // Pointer cursor and hover effect
          style={{ width: '160px', height: '220px' }} // Fixed width and height
        >
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className="h-28 w-full object-cover rounded-md mb-2" // Adjusted image height
          />

          {/* Product Name and Price */}
          <div className="flex justify-between items-center"> {/* Flex container for name, price, and toggle */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold">{product.name}</h3> {/* Smaller text */}
              <span className="text-red-600 text-lg font-bold">{product.price}</span> {/* Highlighted price */}
            </div>
            {/* Toggle Button */}
            <button
              className={`${
                isToggled[product.id] ? 'bg-green-500' : 'bg-red-500'
              } text-white px-2 py-1 rounded-full text-xs`} // Smaller button
              onClick={() => handleToggle(product.id)}
            >
              {isToggled[product.id] ? 'Added' : 'Add'}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  );
}

export default AddOns;
