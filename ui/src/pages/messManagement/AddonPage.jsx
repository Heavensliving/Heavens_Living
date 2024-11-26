import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';

const AddonPage = () => {
  const admin = useSelector(store => store.auth.admin);
  const [orders, setOrders] = useState([]);
  const [addonSummary, setAddonSummary] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/messOrder/`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        // console.log(response.data)
        if (Array.isArray(response.data)) {
          // Get today's date in 'YYYY-MM-DD' format
          const today = new Date().toISOString().split('T')[0];

          // Filter orders to include only today's orders
          const todayOrders = response.data.filter(order => {
            if (!order.deliverDate) return false; // Skip if date is missing
            const orderDate = new Date(order.deliverDate);
            return !isNaN(orderDate) && orderDate.toISOString().split('T')[0] === today;
          });

          setOrders(todayOrders);

          // Calculate total quantity for each unique add-on item
          const summary = todayOrders.reduce((acc, order) => {
            order.adOns.forEach(addon => {
              if (acc[addon.name]) {
                acc[addon.name] += addon.quantity;
              } else {
                acc[addon.name] = addon.quantity;
              }
            });
            return acc;
          }, {});

          setAddonSummary(
            Object.entries(summary).map(([name, quantity]) => ({ name, quantity }))
          );
        } else {
          throw new Error('Unexpected response structure');
        }
      } catch (err) {
        console.error('Error fetching mess orders:', err);
        setError("Failed to fetch mess orders. Please try again later.");
      }
    };

    fetchOrders();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Add-on summary */}
      {addonSummary.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {addonSummary.map(addon => (
            <div key={addon.name} className="bg-blue-100 p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold text-blue-700">{addon.name}</h3>
              <p className="text-2xl font-bold">{addon.quantity}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mb-6">No add-ons found for today.</p>
      )}

      {/* Orders table */}
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Room No</th>
                <th className="border border-gray-300 p-2">Contact</th>
                <th className="border border-gray-300 p-2">Meal Type</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Add-Ons</th>
                <th className="border border-gray-300 p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="text-center">
                  <td className="border border-gray-300 p-2">{order.name}</td>
                  <td className="border border-gray-300 p-2">{order.roomNo}</td>
                  <td className="border border-gray-300 p-2">{order.contact}</td>
                  <td className="border border-gray-300 p-2">{order.mealType}</td>
                  <td className="border border-gray-300 p-2">
                    {order.bookingStatus}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {order.adOns.map(addon => (
                      <div key={addon.name}>{`${addon.name} (${addon.quantity})`}</div>
                    ))}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {new Date(order.deliverDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">No orders found for today.</p>
      )}
    </div>
  );
};

export default AddonPage;
