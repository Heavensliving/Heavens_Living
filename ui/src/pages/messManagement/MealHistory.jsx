import { useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';

const MessOrderHistory = () => {
  const admin = useSelector(store => store.auth.admin);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!admin) return;
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/messOrder/`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setOrders(response.data);
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Sl No</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Room No</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Meal Type</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Add-ons</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4">No orders found.</td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr key={order._id} className="hover:bg-gray-100">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{order.name}</td>
                <td className="border p-2">{order.roomNo}</td>
                <td className="border p-2">{order.contact}</td>
                <td className="border p-2">{order.mealType}</td>
                <td className="border p-2">{order.status ? 'Completed' : 'Pending'}</td>
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
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CheckAuth(MessOrderHistory);
