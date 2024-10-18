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
  FaCheckCircle,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function MessManagement() {
  const navigate = useNavigate();
  const [foodItems, setFoodItems] = useState({});
  const [newFoodItem, setNewFoodItem] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedAddon, setExpandedAddon] = useState(null);
  const [collectedOrders, setCollectedOrders] = useState([]);

  useEffect(() => {
    const fetchCollectedOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/messOrder/');
        setCollectedOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchCollectedOrders();
  }, []);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  const toggleExpandAddon = (addonId) => {
    setExpandedAddon(expandedAddon === addonId ? null : addonId);
  };

  const handleMarkAsDelivered = (orderId) => {
    console.log(`Order ${orderId} marked as delivered!`);
  };

  const totalOrders = collectedOrders.length;
  const totalAddons = collectedOrders.reduce((acc, order) => acc + order.adOns.length, 0);
  const breakfastCount = collectedOrders.filter(order => order.mealType === 'Breakfast').length;
  const lunchCount = collectedOrders.filter(order => order.mealType === 'Lunch').length;
  const dinnerCount = collectedOrders.filter(order => order.mealType === 'Dinner').length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      {/* Button Section */}
      <div className="flex justify-between flex-wrap mb-4">
        <div className="flex space-x-4">
          <button onClick={() => navigate('/meal-history')} className="text-black font-semibold hover:underline">
            View History
          </button>
          <button onClick={() => navigate('/manage-people')} className="text-black font-semibold hover:underline">
            Manage People
          </button>
        </div>

        <div className="flex space-x-4 mt-2 md:mt-0">
          <button onClick={() => navigate('/add-people')} className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-full flex items-center justify-center space-x-2 w-40">
            <FaUserPlus size={16} />
            <span className="text-sm font-semibold">Add People</span>
          </button>

          <button onClick={() => navigate('/add-food')} className="bg-white border-2 border-blue-500 text-blue-500 p-2 rounded-full flex items-center justify-center space-x-2 hover:bg-blue-50 w-40">
            <FaAppleAlt size={16} />
            <span className="text-sm font-semibold">Add Food</span>
          </button>

          <button onClick={() => navigate('/add-ons')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center space-x-2 w-40">
            <FaPlusCircle size={16} />
            <span className="text-sm font-semibold">Add Add-ons</span>
          </button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
        {/* Total Orders */}
        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-blue-500 p-2 rounded-full text-white">
            <FaUtensils size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Total Orders</h2>
            <p className="text-xl font-bold text-gray-800">{totalOrders}</p>
          </div>
        </div>

        {/* Total Add-ons */}
        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-green-500 p-2 rounded-full text-white">
            <FaConciergeBell size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Total Add-ons</h2>
            <p className="text-xl font-bold text-gray-800">{totalAddons}</p>
          </div>
        </div>

        {/* Meal Counts */}
        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-yellow-500 p-2 rounded-full text-white">
            <FaCoffee size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Breakfast</h2>
            <p className="text-xl font-bold text-gray-800">{breakfastCount}</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-red-500 p-2 rounded-full text-white">
            <FaHamburger size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Lunch</h2>
            <p className="text-xl font-bold text-gray-800">{lunchCount}</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-lg shadow flex items-center space-x-4">
          <div className="bg-purple-500 p-2 rounded-full text-white">
            <FaPizzaSlice size={20} />
          </div>
          <div>
            <h2 className="text-gray-500 text-xs">Dinner</h2>
            <p className="text-xl font-bold text-gray-800">{dinnerCount}</p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="mt-6 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Details</h2>
        
        <div className="flex flex-1 space-x-4">
          {/* Received Orders Column */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col">
  <h3 className="text-gray-600 text-md">Received Orders</h3>

  {/* Breakfast Orders */}
  <div className="mt-4">
    <h4 className="font-semibold text-lg">Breakfast Orders</h4>
    <ul className="list-disc ml-5 mt-2 flex-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
      {collectedOrders.filter(order => order.mealType === 'Breakfast').length === 0 ? (
        <li className="text-gray-500 text-center p-3">No breakfast orders.</li>
      ) : (
        collectedOrders.filter(order => order.mealType === 'Breakfast').map(order => (
          <li 
            key={order.orderId} 
            className="bg-yellow-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-yellow-200"
            onClick={() => toggleExpandOrder(order.orderId)}
          >
            <div className="flex justify-between">
              <span className="font-semibold">{order.name}</span>
              <button onClick={() => handleMarkAsDelivered(order.orderId)} className="text-green-500">
                <FaCheckCircle />
              </button>
            </div>
            {expandedOrder === order.orderId && (
              <div className="mt-2">
                <p>Order Id: {order.orderId}</p>
                <p>Room No: {order.roomNo}</p>
                <p>Contact No: {order.contact}</p>
              </div>
            )}
          </li>
        ))
      )}
    </ul>
  </div>

  {/* Lunch Orders */}
  <div className="mt-4">
    <h4 className="font-semibold text-lg">Lunch Orders</h4>
    <ul className="list-disc ml-5 mt-2 flex-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
      {collectedOrders.filter(order => order.mealType === 'Lunch').length === 0 ? (
        <li className="text-gray-500 text-center p-3">No lunch orders.</li>
      ) : (
        collectedOrders.filter(order => order.mealType === 'Lunch').map(order => (
          <li 
            key={order.orderId} 
            className="bg-yellow-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-yellow-200"
            onClick={() => toggleExpandOrder(order.orderId)}
          >
            <div className="flex justify-between">
              <span className="font-semibold">{order.name}</span>
              <button onClick={() => handleMarkAsDelivered(order.orderId)} className="text-green-500">
                <FaCheckCircle />
              </button>
            </div>
            {expandedOrder === order.orderId && (
              <div className="mt-2">
                <p>Order Id: {order.orderId}</p>
                <p>Room No: {order.roomNo}</p>
                <p>Contact No: {order.contact}</p>
              </div>
            )}
          </li>
        ))
      )}
    </ul>
  </div>

  {/* Dinner Orders */}
  <div className="mt-4">
    <h4 className="font-semibold text-lg">Dinner Orders</h4>
    <ul className="list-disc ml-5 mt-2 flex-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
      {collectedOrders.filter(order => order.mealType === 'Dinner').length === 0 ? (
        <li className="text-gray-500 text-center p-3">No dinner orders.</li>
      ) : (
        collectedOrders.filter(order => order.mealType === 'Dinner').map(order => (
          <li 
            key={order.orderId} 
            className="bg-yellow-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-yellow-200"
            onClick={() => toggleExpandOrder(order.orderId)}
          >
            <div className="flex justify-between">
              <span className="font-semibold">{order.name}</span>
              <button onClick={() => handleMarkAsDelivered(order.orderId)} className="text-green-500">
                <FaCheckCircle />
              </button>
            </div>
            {expandedOrder === order.orderId && (
              <div className="mt-2">
                <p>Order Id: {order.orderId}</p>
                <p>Room No: {order.roomNo}</p>
                <p>Contact No: {order.contact}</p>
              </div>
            )}
          </li>
        ))
      )}
    </ul>
  </div>
</div>

          {/* Add-on Orders Column */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col">
            <h3 className="text-gray-600 text-md">Add-on Orders</h3>
            <ul className="list-disc ml-5 mt-2 flex-1" style={{ maxHeight: '300px' }}>
              {totalAddons === 0 ? (
                <li className="text-gray-500 text-center p-3">No add-on orders.</li>
              ) : (
                collectedOrders.flatMap(order => 
                  order.adOns.map((addon, index) => (
                    <li 
                      key={`${order.orderId}-${index}`} 
                      className="bg-green-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-green-200"
                      onClick={() => toggleExpandAddon(`${order.orderId}-${index}`)} // Using a combination of orderId and index for unique key
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">{addon}</span>
                        <button onClick={() => handleMarkAsDelivered(order.orderId)} className="text-blue-500">
                          <FaCheckCircle />
                        </button>
                      </div>
                      {expandedAddon === `${order.orderId}-${index}` && ( // Match with combined key
                        <div className="mt-2">
                          <p>Order ID: {order.orderId}</p>
                          <p>Room No: {order.roomNo}</p>
                          <p>Quantity: {order.qty || 1}</p>
                        </div>
                      )}
                    </li>
                  ))
                )
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessManagement;

