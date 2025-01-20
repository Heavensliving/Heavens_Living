import { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';

const MessOrderHistory = () => {
  const admin = useSelector(store => store.auth.admin);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mealFilter, setMealFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

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
    if (searchQuery === '' && !mealFilter && !dateFilter && !statusFilter) {
      // If no filters are applied, show all orders
      setFilteredOrders(orders);
    } else {
      let filtered = [...orders];

      // Search Filter
      if (searchQuery !== '') {
        filtered = filtered.filter(order =>
          order.orderId.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          order.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
      }

      // Meal Filter
      if (mealFilter) {
        filtered = filtered.filter(order => order.mealType === mealFilter);
      }

      // Status Filter
      if (statusFilter) {
        filtered = filtered.filter(order => order.bookingStatus === statusFilter);
      }

      // Date Filter
      if (dateFilter) {
        filtered = filtered.filter(order =>
          new Date(order.deliverDate).toLocaleDateString('en-CA') === dateFilter
        );
      }

      // Update the filtered orders state
      setFilteredOrders(filtered);
    }
  }, [searchQuery, orders, mealFilter, statusFilter, dateFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update search query state on input change
  };

  const handleMealFilterChange = e => {
    setMealFilter(e.target.value);
  };

  const handleStatusFilterChange = e => {
    setStatusFilter(e.target.value);
  };

  const handleDateFilterChange = e => {
    setDateFilter(e.target.value);
  };

  // Count metrics for pending and delivered orders
  const pendingCount = filteredOrders.filter(order => order.bookingStatus === 'Pending').length;
  const deliveredCount = filteredOrders.filter(order => order.bookingStatus === 'delivered').length;

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
      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Delivered Metric Card */}
        <div className="p-4 bg-green-100 border border-green-300 rounded-lg">
          <h3 className="text-lg font-semibold text-green-700">Delivered Orders</h3>
          <p className="text-2xl font-bold text-green-800">{deliveredCount}</p>
        </div>
        {/* Pending Metric Card */}
        <div className="p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-700">Pending Orders</h3>
          <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="mb-4 flex flex-wrap sm:flex-nowrap gap-4">
        {/* Search Input */}
        <div className="w-full sm:w-1/2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by Name or Order ID"
            value={searchQuery}
            onChange={handleSearchChange}
            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-side-bar"
          />
        </div>

        {/* Date Filter */}
        <div className="w-full sm:w-1/2">
          <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            id="dateFilter"
            type="date"
            value={dateFilter}
            onChange={handleDateFilterChange}
            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-side-bar"
          />
        </div>

      </div>
      {/* Search and Filter Row */}
      <div className="mb-4 flex flex-wrap sm:flex-nowrap gap-4">
        {/* Meal Filter */}
        <div className="w-full sm:w-1/2">
          <label htmlFor="mealFilter" className="block text-sm font-medium text-gray-700">Meal Type</label>
          <select
            id="mealFilter"
            value={mealFilter}
            onChange={handleMealFilterChange}
            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-side-bar"
          >
            <option value="">Filter by Meal</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-1/2">
          <label htmlFor="bookingStatus" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="bookingStatus"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-side-bar"
          >
            <option value="">Filter by Status</option>
            <option value="delivered">Delivered</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

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
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4">No orders found.</td>
            </tr>
          ) : (
            filteredOrders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{order.name}</td>
                <td className="border p-2">{order.orderId}</td>
                <td className="border p-2">{order.roomNo}</td>
                <td className="border p-2">{order.mealType}</td>
                <td className="border p-2">{new Date(order.deliverDate).toLocaleDateString('en-GB')}</td>
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
    </div>
  );
};

export default CheckAuth(MessOrderHistory);
