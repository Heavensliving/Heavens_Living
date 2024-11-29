import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const AddonPage = () => {
  const admin = useSelector(store => store.auth.admin);
  const [orders, setOrders] = useState([]);
  const [addonSummary, setAddonSummary] = useState([]);
  const [error, setError] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search input

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/messOrder/`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });

        if (Array.isArray(response.data)) {
          const today = new Date().toISOString().split('T')[0];
          const todayOrders = response.data.filter(order => {
            if (!order.deliverDate || !order.adOns || order.adOns.length === 0) return false;
            const orderDate = new Date(order.deliverDate);
            return !isNaN(orderDate) && orderDate.toISOString().split('T')[0] === today;
          });

          setOrders(todayOrders.reverse());

          const summary = todayOrders.reduce((acc, order) => {
            order.adOns.forEach(addon => {
              if (acc[addon.name]) {
                acc[addon.name].price = addon.price;
                acc[addon.name].quantity += addon.quantity;
                acc[addon.name].totalPrice += addon.price || 0;
              } else {
                acc[addon.name] = {
                  price: addon.price,
                  quantity: addon.quantity,
                  totalPrice: addon.price || 0,
                };
              }
            });
            return acc;
          }, {});

          setAddonSummary(
            Object.entries(summary).map(([name, data]) => ({ name, quantity: data.quantity, price: data.price }))
          );

          const total = todayOrders
            .filter(order => order.bookingStatus === 'delivered')
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0);
          setTotalAmount(total);

        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (err) {
        console.error('Error fetching mess orders:', err);
        setError("Failed to fetch mess orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page on a new search
  };

  const filteredOrders = orders.filter(order =>
    order.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    <div className="container mx-auto p-4">
      {addonSummary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {addonSummary.map(addon => (
            <div key={addon.name} className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-blue-700">{addon.name}</h3>
                <span className="text-sm text-gray-600">₹{addon.price.toFixed(2)}</span>
              </div>
              <p className="text-base text-gray-700 mb-1">
                <span className="font-medium">Total Price</span> ₹{(addon.price * addon.quantity).toFixed(2)}
              </p>
              <p className="text-lg font-bold text-gray-900">
                Quantity: {addon.quantity}
              </p>
            </div>
          ))}
        </div>
      )}

      {totalAmount > 0 && (
        <div className="text-lg font-bold text-gray-700 mb-4">
          Today's collection<span className='text-xs font-semibold'>(delivered)</span>: ₹{totalAmount.toFixed(2)}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchQuery}
          onChange={handleSearchChange}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-side-bar w-full"
        />
      </div>

      {currentOrders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
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
            <tbody>
              {currentOrders.map((order, index) => (
                <tr key={order._id} className="text-center">
                  {/* Calculate the correct index */}
                  <td className="border p-2">{indexOfFirstOrder + index + 1}</td>
                  <td className="border border-gray-300 p-2">{order.name}</td>
                  <td className="border border-gray-300 p-2">{order.orderId}</td>
                  <td className="border border-gray-300 p-2">{order.roomNo}</td>
                  <td className="border border-gray-300 p-2">{order.mealType}</td>
                  <td className="border border-gray-300 p-2">
                    {new Date(order.deliverDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {order.adOns.map(addon => (
                      <div key={addon.name}>{`${addon.name} (${addon.quantity})`}</div>
                    ))}
                  </td>
                  <td
                    className={`border p-2 ${order.bookingStatus === 'Pending' ? 'text-yellow-500' : 'text-green-500'
                      }`}
                  >
                    {order.bookingStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No orders found for today.</p>
      )}

      {filteredOrders.length > ordersPerPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50"
          >
            <FiChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          {[...Array(Math.ceil(filteredOrders.length / ordersPerPage))].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-4 ml-2 py-2 border rounded-md ${currentPage === i + 1
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredOrders.length / ordersPerPage)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md disabled:opacity-50 ml-2"
          >
            <FiChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddonPage;
