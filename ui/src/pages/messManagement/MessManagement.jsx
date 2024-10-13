import React, { useEffect, useState } from 'react';
import {
  FaUtensils,
  FaConciergeBell,
  FaCoffee,
  FaHamburger,
  FaPizzaSlice,
  FaAppleAlt,
  FaPlusCircle,
  FaUserPlus,
  FaCheckCircle, // Import the check icon for delivered
} from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';

function MessManagement() {
  const navigate = useNavigate()
  const [foodItems, setFoodItems] = useState({}); // State to hold added food items for each week
  const [newFoodItem, setNewFoodItem] = useState(''); // State for new food item input
  const [expandedOrder, setExpandedOrder] = useState(null); // State for expanded order
  const [expandedAddon, setExpandedAddon] = useState(null); // State for expanded add-on

  // Sample data for orders (You can replace this with actual data)
  const collectedOrders = [
    { slNo: 1, name: 'John Doe', roomNo: '101', orderId: 'O001', type: 'Breakfast', contactNumber: '123-456-7890', collectedStatus: 'Collected' },
    { slNo: 2, name: 'Jane Smith', roomNo: '102', orderId: 'O002', type: 'Breakfast', contactNumber: '234-567-8901', collectedStatus: 'Collected' },
    { slNo: 3, name: 'Alice Brown', roomNo: '103', orderId: 'O003', type: 'Lunch', contactNumber: '345-678-9012', collectedStatus: 'Collected' },
    { slNo: 4, name: 'Bob Johnson', roomNo: '104', orderId: 'O004', type: 'Dinner', contactNumber: '456-789-0123', collectedStatus: 'Collected' },
  ];

  const addOnOrders = [
    { id: 'A001', name: 'Extra Salad', orderId: 'A001', roomNo: '101', contactNumber: '123-456-7890', qty: 2 },
    { id: 'A002', name: 'Soda', orderId: 'A002', roomNo: '102', contactNumber: '234-567-8901', qty: 3 },
  ];
  
  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId); // Toggle expanded order
  };

  const toggleExpandAddon = (addonId) => {
    setExpandedAddon(expandedAddon === addonId ? null : addonId); // Toggle expanded add-on
  };

  const handleMarkAsDelivered = (orderId) => {
    // Implement your logic for marking the order as delivered
    console.log(`Order ${orderId} marked as delivered!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      {/* Button Section with Left and Right Buttons */}
      <div className="flex justify-between flex-wrap mb-4">
        {/* Left Side: View History and Manage People Buttons */}
        <div className="flex space-x-4">
          <button className="text-black font-semibold hover:underline">
            View History
          </button>
          <button
          onClick={()=>navigate('/manage-people')} 
          className="text-black font-semibold hover:underline">
            Manage People
          </button>
        </div>

        {/* Right Side: Add People, Add Food, Add Add-ons */}
        <div className="flex space-x-4 mt-2 md:mt-0">
          {/* Add People Button */}
          <button
          onClick={()=>navigate('/add-people')} 
          className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full flex items-center justify-center space-x-2 w-40">
            <FaUserPlus size={16} />
            <span className="text-sm font-semibold">Add People</span>
          </button>

          {/* Add Food Button with white background */}
          <button
          onClick={()=>navigate('/add-food')}
            className="bg-white border-2 border-blue-500 text-blue-500 p-2 rounded-full flex items-center justify-center space-x-2 hover:bg-blue-50 w-40"
          >
            <FaAppleAlt size={16} />
            <span className="text-sm font-semibold">Add Food</span>
          </button>

          {/* Add Add-ons Button with colored background */}
          <button
          onClick={()=>navigate('/add-ons')}
           className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center space-x-2 w-40">
            <FaPlusCircle size={16} />
            <span className="text-sm font-semibold">Add Add-ons</span>
          </button>
        </div>
      </div>

      {/* Responsive Cards for Total Orders, Add-ons, Breakfast, Lunch, and Dinner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {/* Total Orders Received */}
        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-blue-500 p-2 rounded-full text-white">
            <FaUtensils size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Total Orders</h2>
            <p className="text-xl font-bold text-gray-800">1,245</p>
          </div>
        </div>

        {/* Total Add-ons Received */}
        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-green-500 p-2 rounded-full text-white">
            <FaConciergeBell size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Total Add-ons</h2>
            <p className="text-xl font-bold text-gray-800">450</p>
          </div>
        </div>

        {/* Breakfast */}
        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-yellow-500 p-2 rounded-full text-white">
            <FaCoffee size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Breakfast</h2>
            <p className="text-xl font-bold text-gray-800">320</p>
          </div>
        </div>

        {/* Lunch */}
        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-red-500 p-2 rounded-full text-white">
            <FaHamburger size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Lunch</h2>
            <p className="text-xl font-bold text-gray-800">480</p>
          </div>
        </div>

        {/* Dinner */}
        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-purple-500 p-2 rounded-full text-white">
            <FaPizzaSlice size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Dinner</h2>
            <p className="text-xl font-bold text-gray-800">600</p>
          </div>
        </div>
      </div>

      {/* New Section for Received Orders and Add-on Orders */}
      <div className="mt-6 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Details</h2>
        
        {/* Flex container for side-by-side layout */}
        <div className="flex flex-1 space-x-4">
          {/* Received Orders Column */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col">
          <h3 className="text-gray-600 text-md">Received Orders</h3>
          <ul className="list-disc ml-5 mt-2 flex-1 overflow-y-auto" style={{ maxHeight: '300px' }}>
            {collectedOrders.length === 0 ? ( // Check if there are no received orders
              <li className="text-gray-500 text-center p-3">No received orders.</li>
            ) : (
              collectedOrders.map(order => (
                <li 
                  key={order.orderId} 
                  className="bg-yellow-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-yellow-200" // Light yellow color
                  onClick={() => toggleExpandOrder(order.orderId)}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="text-gray-800 font-semibold">{order.type}</div>
                    </div>
                    <button 
                      className="text-green-500 hover:text-green-600"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from bubbling up
                        handleMarkAsDelivered(order.orderId);
                      }}
                    >
                      <FaCheckCircle size={20} />
                    </button>
                  </div>
                  {expandedOrder === order.orderId && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Name: {order.name}</p>
                      <p>Order ID: {order.orderId}</p>
                      <p>Room No: {order.roomNo}</p>
                      <p>Contact: {order.contactNumber}</p>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
                  </div>


          {/* Add-on Orders Column */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col">
          <h3 className="text-gray-600 text-md">Add-on Orders</h3>
          <ul className="list-disc ml-5 mt-2 flex-1 overflow-y-auto" style={{ maxHeight: '300px' }}>
            {addOnOrders.length === 0 ? ( // Check if there are no add-on orders
              <li className="text-gray-500 text-center p-3">No add-on orders.</li>
            ) : (
              addOnOrders.map(order => (
                <li 
                  key={order.id} 
                  className="bg-yellow-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-yellow-200" // Light yellow color
                  onClick={() => toggleExpandAddon(order.id)}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <div className="text-gray-800 font-semibold">{order.name}</div>
                      <div className="text-gray-500 text-sm">Qty: {order.qty}</div>
                    </div>
                    <button 
                      className="text-green-500 hover:text-green-600"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent click event from bubbling up
                        handleMarkAsDelivered(order.id);
                      }}
                    >
                      <FaCheckCircle size={20} />
                    </button>
                  </div>
                  {expandedAddon === order.id && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Order ID: {order.orderId}</p>
                      <p>Room No: {order.roomNo}</p>
                      <p>Contact: {order.contactNumber}</p>
                    </div>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
        </div>
      </div>

      

    </div>
  );
}

export default MessManagement;
