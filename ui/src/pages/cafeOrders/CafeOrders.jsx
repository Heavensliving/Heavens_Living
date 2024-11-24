import { useState, useEffect } from 'react';
import axios from 'axios';
import CheckAuth from '../auth/CheckAuth';
import API_BASE_URL from '../../config';

const CafeOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/cafeOrder`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Handle the status change and make the API call
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log(orderId, newStatus)
      const response = await axios.put(
        `${API_BASE_URL}/cafeOrder/orders/${orderId}/status`, 
        { status: newStatus }
      );
      console.log(response.data)
      if (response.data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const OrderTable = () => (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="table-auto min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {['Order ID', 'Items', 'Total Amount', 'Order Time', 'Status', 'Actions'].map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-medium text-center text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr
              key={order._id}
              onClick={() => handleOrderClick(order)}
              className="hover:bg-gray-50 cursor-pointer text-center"
            >
              <td className="px-4 py-4 whitespace-nowrap">{order.orderId}</td>
              <td className="px-4 py-4">{order.items.map((item) => item.itemName).join(', ')}</td>
              <td className="px-4 py-4 whitespace-nowrap">₹{order.total}</td>
              <td className="px-4 py-4 whitespace-nowrap">
                {new Date(order.date).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                  hour12: true,
                })}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}`}
                >
                  {order.status}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                {order.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order._id, 'onGoing');
                      }}
                      className="text-green-600 hover:text-green-900"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order._id, 'cancelled');
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
                className={`font-medium ${
                  selectedOrder.status === 'accepted'
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
      <h1 className="text-2xl font-semibold mb-6 text-center">Cafe Orders</h1>
      <OrderTable />
      {showModal && selectedOrder && <OrderModal />}
    </div>
  );
};

export default CheckAuth(CafeOrders);
