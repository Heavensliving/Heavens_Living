import { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const MessOrderHistory = () => {
  const admin = useSelector(store => store.auth.admin);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [ordersPerPage] = useState(10); // Number of orders per page

  useEffect(() => {
    if (!admin) return;
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/messOrder/`, {
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });
        const filteredData = response.data.filter(order => order.status === "true");
        setOrders(filteredData.reverse());
        setFilteredOrders(filteredData);
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [admin]);

  // Filter orders based on search query
  useEffect(() => {
    if (searchQuery === '') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(order => order.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
  }, [searchQuery, orders]);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage); // Total number of pages

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state on input change
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-side-bar"
        />
      </div>

      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="text-center">
            <th className="border p-2">#</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">OrderId</th>
            <th className="border p-2">Room</th>
            <th className="border p-2">Meal</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Add-ons</th>
            <th className="border p-2">Status</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentOrders.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4">No orders found.</td>
            </tr>
          ) : (
            currentOrders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="border p-2">{index + 1 + indexOfFirstOrder}</td>
                <td className="border p-2">{order.name}</td>
                <td className="border p-2">{order.orderId}</td>
                <td className="border p-2">{order.roomNo}</td>
                <td className="border p-2">{order.mealType}</td>
                <td className="border p-2">{new Date(order.bookingDate).toLocaleDateString('en-GB')}</td>
                <td className="border p-2">
                  {order.adOns.length > 0
                    ? order.adOns.map((addon, i) => (
                      <div key={i}>
                        {addon.name} (x{addon.quantity})
                      </div>
                    ))
                    : 'None'}
                </td>
                <td
                  className={`border p-2 ${order.bookingStatus === 'Pending' ? 'text-yellow-500' : 'text-green-500'
                    }`}
                >
                  {order.bookingStatus}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
        >
          <FiChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 ml-2 py-2 border rounded-md ${currentPage === i + 1 ? 'bg-side-bar text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 ml-2"
        >
          <FiChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default CheckAuth(MessOrderHistory);
