import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';
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
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddToRentOnly, setShowAddToRentOnly] = useState(false);


  const handleMarkDelivered = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const updateOrderStatus = async (orderId, paymentType) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/messOrder/AddOnsStatus/${orderId}`, {
        bookingStatus: "Delivered",
        paymentType,
      }, { headers: { 'Authorization': `Bearer ${admin.token}` } },);

      if (response.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, bookingStatus: "Delivered", paymentType } : order
          )
        );
      }

    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setShowModal(false);
    }
  };

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
          const adOnsOrders = response.data.filter(order => {
            if (!order.deliverDate || !order.adOns || order.adOns.length === 0) return false;
            return true;
          });

          setOrders(adOnsOrders.reverse());
          console.log(adOnsOrders.reverse())

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
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = selectedDate
      ? new Date(order.deliverDate).toISOString().split('T')[0] === selectedDate
      : true;

    const matchesStatus = selectedStatus ? order.bookingStatus === selectedStatus : true;

    const matchesAddToRent = showAddToRentOnly
      ? order.paymentType === "AddToRent"
      : true;

    return matchesSearch && matchesStatus && matchesAddToRent && matchesDate;
  });

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

      {/* Search Bar and Status Filter */}
      <div className="flex items-center justify-between mb-4">
        {/* Search Box */}
        <div className="w-1/2 pr-2">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-side-bar"
          />
        </div>

        {/* Status Filter */}
        <div className="w-1/3 pl-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-side-bar"
          >
            <option value="">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="w-1/2 pl-2">
          <input
            type="date"
            value={selectedDate} // Add selectedDate to your state
            onChange={(e) => setSelectedDate(e.target.value)} // Update selectedDate on change
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-side-bar"
          />
        </div>

        {/* Pending Add-Ons Filter */}
        <div className="w-1/3 pl-2 flex items-center">
          <button
            onClick={() => setShowAddToRentOnly(!showAddToRentOnly)}
            className={`px-4 py-2 rounded-md border w-full transition ${showAddToRentOnly
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {showAddToRentOnly ? "Show All Orders" : "Pending Amount"}
          </button>
        </div>
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
                <th className="border p-2">Action</th>
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
                    {order.adOns.map((addon) => (
                      <div key={addon.name}>{`${addon.name} (${addon.quantity})`}</div>
                    ))}
                  </td>

                  {/* Booking Status with Conditional Colors */}
                  <td
                    className={`border p-2 
          ${order.bookingStatus === "Pending" ? "text-yellow-500" :
                        order.paymentType === "AddToRent" ? "text-purple-500" :
                          "text-green-500"}`}
                  >
                    {order.bookingStatus}
                  </td>

                  {/* Action Button with Conditional Colors */}
                  <td className="border border-gray-300 p-2 text-center">
                    {order.bookingStatus !== "Delivered" ? (
                      <button
                        onClick={() => {
                          if (order.paymentType !== "Paid") {
                            handleMarkDelivered(order);
                          }
                        }}
                        className={`flex items-center justify-center w-full transition 
      ${order.paymentType === "Paid"
                            ? "text-gray-400 cursor-not-allowed" // ❌ Disabled (Gray)
                            : order.paymentType === "AddToRent"
                              ? "text-purple-500 hover:text-purple-700 cursor-pointer" // ✅ Clickable (Purple)
                              : "text-blue-500 hover:text-blue-700 cursor-pointer" // ✅ Clickable (Blue)
                          }`}
                        disabled={order.paymentType === "Paid"} // ❌ Disabled for "Paid"
                      >
                        <FaCheckCircle size={20} />
                      </button>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <FaCheckCircle
                          onClick={() => {
                            if (order.paymentType !== "Paid") {
                              handleMarkDelivered(order);
                            }
                          }}
                          size={20}
                          className={`cursor-pointer ${order.paymentType === "AddToRent"
                            ? "text-purple-500 hover:text-purple-700" // ✅ Clickable (Purple)
                            : "text-green-500 cursor-not-allowed" // ❌ Disabled (Green)
                            }`}
                        />
                      </div>
                    )}
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

      {showModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Payment Confirmation</h2>
            <p>Has the payment for add-ons been received?</p>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => updateOrderStatus(selectedOrder._id, "Paid")}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Paid
              </button>
              <button
                onClick={() => updateOrderStatus(selectedOrder._id, "AddToRent")}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add to Rent
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddonPage;
