import { useEffect, useState } from 'react';
import { FaUtensils, FaConciergeBell, FaCoffee, FaHamburger, FaPizzaSlice, FaAppleAlt, FaPlusCircle, FaUserPlus, FaCheckCircle, FaBoxes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import MetricCard from './MetricCard';
import ActionButton from './ActionButton';
import ListItem from './ListItem';
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';

function MessManagement() {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedAddon, setExpandedAddon] = useState(null);
  const [todayOrders, setTodayOrders] = useState([]);
  const [todayAddons, setTodayAddons] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Check current time to determine if orders should be displayed
    const now = new Date();
    const isAfter11PM = now.getHours() >= 22;

    // Fetch tomorrow's orders if it's after 11 pm
    const fetchOrdersAndAddons = async () => {
      if (!admin) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/messOrder/`, {
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });
        const allOrders = response.data;
        const today = new Date(now);
        const todayDate = today.toISOString().split('T')[0];

        const filteredTodayAddons = allOrders.filter(order => {
          if (!order.deliverDate) return false;
          const orderDate = new Date(order.deliverDate);
          return orderDate.toISOString().split('T')[0] === todayDate;
        });
        setTodayAddons(filteredTodayAddons);

        if (isAfter11PM) {
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          const tomorrowDate = tomorrow.toISOString().split('T')[0];
          const filteredTomorrowOrders = allOrders.filter(order => {
            if (!order.deliverDate) return false;
            const orderDate = new Date(order.deliverDate);
            return (
              orderDate.toISOString().split('T')[0] === tomorrowDate &&
              (!order.adOns || order.adOns.length === 0) // Check if adOns is empty or not present
            );
          });

          setTodayOrders(filteredTomorrowOrders);
        } else {
          const today = new Date(now);
          const todayDate = today.toISOString().split('T')[0];
          const filteredTodayOrders = allOrders.filter(order => {
            if (!order.deliverDate) return false;
            const orderDate = new Date(order.deliverDate);
            return (
              orderDate.toISOString().split('T')[0] === todayDate &&
              (!order.adOns || order.adOns.length === 0) // Check if adOns is empty or not present
            );
          });
          // console.log(filteredTodayOrders);
          setTodayOrders(filteredTodayOrders);
        }

      } catch (error) {
        console.error('Error fetching orders and addons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndAddons();
  }, [admin]);


  const toggleExpandOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  const toggleExpandAddon = (addonId) => {
    setExpandedAddon(expandedAddon === addonId ? null : addonId);
  };
  const handleAddonsClick = () => {
    navigate('/addonPage');
  };
  // Today's statistics
  const totalTodayOrders = todayOrders.length;
  const totalTodayAddons = todayAddons.reduce((acc, order) => acc + order.adOns.length, 0);
  const todayBreakfastCount = todayOrders.filter(order => order.mealType === 'Breakfast').length;
  const todayLunchCount = todayOrders.filter(order => order.mealType === 'Lunch').length;
  const todayDinnerCount = todayOrders.filter(order => order.mealType === 'Dinner').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      {/* Button Section */}
      <div className="flex justify-between flex-wrap mb-4">
        {/* Left side buttons */}
        <div className="flex space-x-4">
          <button onClick={() => navigate('/meal-history')} className="text-black font-semibold hover:underline">
            View History
          </button>
          <button onClick={() => navigate('/manage-people')} className="text-black font-semibold hover:underline">
            Manage People
          </button>
        </div>
        {/* Right side buttons */}
        <div className="flex space-x-4 mt-2 md:mt-0">
        <ActionButton
    icon={FaBoxes} label="Inventory" bgColor="bg-white" borderColor="border-2 border-yellow-500" textColor="text-yellow-500" hoverColor="bg-yellow-50" navigateTo="/inventory"/>
          <ActionButton icon={FaUserPlus} label="Add People" bgColor="bg-purple-500" hoverColor="bg-purple-600" textColor="text-white" navigateTo="/add-people" />
          <ActionButton icon={FaAppleAlt} label="Add Food" bgColor="bg-white" borderColor="border-2 border-blue-500" textColor="text-blue-500" hoverColor="bg-blue-50" navigateTo="/add-food" />
          <ActionButton icon={FaPlusCircle} label="Add Add-ons" bgColor="bg-green-500" hoverColor="bg-green-600" textColor="text-white" navigateTo="/add-ons" />
        </div>
      </div>
      {/* Metrics Section */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-6 mt-4">
        <MetricCard icon={FaUtensils} bgColor="bg-blue-500" title="Total Orders" value={totalTodayOrders} />
        {/* Add clickable div for "Total Add-ons" card */}
        <div onClick={handleAddonsClick} className="cursor-pointer">
          <MetricCard icon={FaConciergeBell} bgColor="bg-green-500" title="Total Add-ons" value={totalTodayAddons} />
        </div>
        <MetricCard icon={FaCoffee} bgColor="bg-yellow-500" title="Breakfast" value={todayBreakfastCount} />
        <MetricCard icon={FaHamburger} bgColor="bg-red-500" title="Lunch" value={todayLunchCount} />
        <MetricCard icon={FaPizzaSlice} bgColor="bg-purple-500" title="Dinner" value={todayDinnerCount} />
      </div>
      {/* Orders Section */}
      <div className="mt-2 flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Order Details</h2>
        <div className="flex flex-1 space-x-4">
          {/* Received Orders Column */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col">
            <h3 className="text-gray-600 text-md">Received Orders</h3>
            {/* Breakfast Orders */}
            <div className="mt-4">
              <h4 className="font-semibold text-lg">Breakfast Orders</h4>
              <ul className="list-disc ml-5 mt-2 flex-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {todayOrders.filter(order => order.mealType === 'Breakfast').length === 0 ? (
                  <li className="text-gray-500 text-center p-3">No breakfast orders.</li>
                ) : (
                  todayOrders.filter(order => order.mealType === 'Breakfast').map((order, index) => (
                    <ListItem
                      key={index}
                      order={order}
                      expandedOrder={expandedOrder}
                      onExpand={toggleExpandOrder}
                    // onMarkAsDelivered={handleMarkAsDelivered}
                    />
                  ))
                )}
              </ul>
            </div>

            {/* Lunch Orders */}
            <div className="mt-4">
              <h4 className="font-semibold text-lg">Lunch Orders</h4>
              <ul className="list-disc ml-5 mt-2 flex-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {todayOrders.filter(order => order.mealType === 'Lunch').length === 0 ? (
                  <li className="text-gray-500 text-center p-3">No lunch orders.</li>
                ) : (
                  todayOrders.filter(order => order.mealType === 'Lunch').map((order, index) => (
                    <ListItem
                      key={index}
                      order={order}
                      expandedOrder={expandedOrder}
                      onExpand={toggleExpandOrder}
                    />
                  ))
                )}
              </ul>
            </div>

            {/* Dinner Orders */}
            <div className="mt-4">
              <h4 className="font-semibold text-lg">Dinner Orders</h4>
              <ul className="list-disc ml-5 mt-2 flex-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {todayOrders.filter(order => order.mealType === 'Dinner').length === 0 ? (
                  <li className="text-gray-500 text-center p-3">No dinner orders.</li>
                ) : (
                  todayOrders.filter(order => order.mealType === 'Dinner').map((order, index) => (
                    <ListItem
                      key={index}
                      order={order}
                      expandedOrder={expandedOrder}
                      onExpand={toggleExpandOrder}
                    />
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Add-on Orders Column */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow flex flex-col" style={{ maxHeight: '660px', overflowY: 'auto' }}>
            <h3 className="text-gray-600 text-md">Add-on Orders</h3>
            <ul className="list-disc ml-5 mt-2 flex-1">
              {totalTodayAddons === 0 ? (
                <li className="text-gray-500 text-center p-3">No add-on orders.</li>
              ) : (
                todayAddons.flatMap(order =>
                  order.adOns.map((addon, index) => (
                    <li
                      key={`${order.orderId}-${index}`}
                      className="bg-green-100 p-3 rounded-lg mb-2 cursor-pointer hover:bg-green-200"
                      onClick={() => toggleExpandAddon(`${order.orderId}-${index}`)} // Using a combination of orderId and index for unique key
                    >
                      <div className="flex justify-between">
                        {/* Display the add-on name and quantity */}
                        <span className="font-semibold">{addon.name} - Qty: {addon.quantity}</span>
                        <button onClick={() => handleMarkAsDelivered(order.orderId)} className="text-blue-500">
                          <FaCheckCircle />
                        </button>
                      </div>
                      {expandedAddon === `${order.orderId}-${index}` && ( // Match with combined key
                        <div className="mt-2">
                          <p>Order ID: {order.orderId}</p>
                          <p>Room No: {order.roomNo}</p>
                          <p>Quantity: {addon.quantity}</p>
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

export default CheckAuth(MessManagement);



