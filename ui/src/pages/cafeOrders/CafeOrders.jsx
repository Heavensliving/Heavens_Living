import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { socket } from '../../Utils/socket';
import notification from '../../assets/WhatsApp Audio 2024-11-25 at 19.03.55_0eb1052f.mp3'
import { FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CafeOrders = () => {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const audioRef = React.useRef(null);
  const [showTotal, setShowTotal] = useState(false);
  const toggleTotal = () => {
    setShowTotal((prev) => !prev); // Toggle the visibility
  };
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.error("Error playing notification sound:", err);
      });
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cafeOrder`);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight to ignore time part
        const filteredOrders = response.data.filter(order => {
          const orderDate = new Date(order.date); // Assuming 'date' is in ISO format
          orderDate.setHours(0, 0, 0, 0); // Normalize to midnight
          return orderDate.getTime() === today.getTime(); // Compare the date only
        });

        setOrders(filteredOrders.reverse());
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();

    socket.on("orderUpdated", (data) => {
      // console.log("Order update received:", data);

      const updatedOrder = data.order;
      playNotificationSound();
      const today = new Date();
      const orderDate = new Date(updatedOrder.date);
      if (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      ) {
        setOrders((prevOrders) => {
          const existingOrderIndex = prevOrders.findIndex(
            (order) => order._id === updatedOrder._id
          );

          if (existingOrderIndex !== -1) {
            const updatedOrders = [...prevOrders];
            updatedOrders[existingOrderIndex] = updatedOrder;
            return updatedOrders;
          }

          return [updatedOrder, ...prevOrders];
        });
      }
    });
    return () => {
      socket.off("orderUpdated");
    };
  }, []);

  const handleStatusChange = async (Id, newStatus) => {
    try {
      // console.log(Id, newStatus)
      if (audioRef.current) {
        console.log('Audio state before pause:', !audioRef.current.paused);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = ''; // Forcefully stop the audio
        setTimeout(() => {
          audioRef.current.src = notification; // Reset the source after stopping
        }, 100);
        console.log('Audio forcibly paused and reset');
      }
      const response = await axios.put(
        `${API_BASE_URL}/cafeOrder/orders/${Id}/status`,
        { status: newStatus }
      );
      // console.log(response.data)
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === Id ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  const totalOrders = orders.length;
  // const totalAmount = orders.reduce((acc, order) => acc + (order.total || 0), 0);
  const deliveredOrders = orders.filter(order => order.status === "delivered");
  const totalAmountReceived = deliveredOrders.reduce((sum, order) => sum + order.total, 0);

  const OrderCard = () => (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-lg p-4 flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 cursor-pointer hover:bg-gray-50"
          onClick={() => handleOrderClick(order)}
        >
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Order ID: {order.orderId}</h3>
            <p className="text-sm text-gray-600">
              {(order.items || []).map((item) => item.itemName).join(', ') || 'No items available'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">₹{order.total}</p>
            <p className="text-xs text-gray-500">
              {new Date(order.date).toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true,
              })}
            </p>
          </div>
          <div className="flex items-center justify-between w-full space-x-2 md:space-x-4">
            <div className="flex-1 text-left">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${order.status === 'pending' ? 'bg-amber-200 text-amber-800' :
                    order.status === 'accepted' ? 'bg-green-200 text-green-800' :
                      order.status === 'onGoing' ? 'bg-blue-200 text-blue-800' :
                        order.status === 'delivered' ? 'bg-green-200 text-green-800' :
                          'bg-red-100 text-red-800'}`}
              >
                {order.status}
              </span>
            </div>
            <div className="flex space-x-2 justify-end">
              {order.status === 'pending' && (
                <div className="flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(order._id, 'onGoing');
                    }}
                    className="text-green-600 hover:text-green-900 text-xs"
                  >
                    Accept
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(order._id, 'cancelled');
                    }}
                    className="text-red-600 hover:text-red-900 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {order.status === 'onGoing' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(order._id, 'delivered');
                  }}
                  className="text-green-600 hover:text-green-900 text-xs"
                >
                  Make Delivered!
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const OrderModal = () => (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <DetailRow label="Customer Name : " value={selectedOrder.customerName} />
          <DetailRow label="Contact : " value={selectedOrder.contact} />
          <DetailRow label="Property : " value={selectedOrder.propertyName} />
          <DetailRow label="Room Number : " value={selectedOrder.roomNumber} />
          <DetailRow
            label="Order Items"
            value={
              <ul className="list-disc list-inside">
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>
                    {item.itemName} x {item.quantity} - ₹{item.total}
                  </li>
                ))}
              </ul>
            }
          />
          <DetailRow label="Total Amount : " value={`₹${selectedOrder.total}`} />
          <DetailRow
            label="Status : "
            value={
              <span
                className={`font-medium ${selectedOrder.status === 'accepted'
                  ? 'text-green-600'
                  : selectedOrder.status === 'cancelled'
                    ? 'text-red-600'
                    : 'text-yellow-600'
                  }`}
              >
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
            }
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const DetailRow = ({ label, value }) => (
    <div>
      <span className="text-sm text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      {/* Navbar-like header */}
      <header className="bg-side-bar text-white py-4 px-6 fixed top-0 left-0 w-full z-10 shadow-md">
        <div className="flex justify-between items-center">
          {/* Menu icon on the left */}
          <FaBars className="text-xl cursor-pointer" onClick={toggleTotal} />

          {/* Centered heading */}
          <h1 className="text-2xl font-semibold text-center mx-auto">Heavens Cafe</h1>
        </div>
      </header>

      {/* Main content */}
      <div className="mt-14">
        {/* Add a second heading for orders */}
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">Today Orders</h2>

        {/* Display Today's Total */}
        {showTotal && (
          <div className="ml-4 mb-4">
            <h3 className="text-sm">Total Orders Today: {totalOrders}</h3>
            <h3 className="text-sm">Total Amount Received Today: ₹{totalAmountReceived}</h3>
            <h3 onClick={()=> navigate('/cafe-order-history')} className="text-sm underline cursor-pointer">Get Order History</h3>
          </div>
        )}

        {/* Hidden audio element for playing notification sounds */}
        <audio ref={audioRef} src={notification} preload="auto" />

        {/* Render Order Cards */}
        <OrderCard />
        {/* Render Order Modal if needed */}
        {showModal && selectedOrder && <OrderModal />}
      </div>
    </div>

  );
};

export default CafeOrders;
