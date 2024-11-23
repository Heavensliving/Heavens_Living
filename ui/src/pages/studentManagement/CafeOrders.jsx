import { useState } from 'react';
import CheckAuth from '../auth/CheckAuth';

const CafeOrders = () => {
  // Dummy data for orders
  const dummyOrders = [
    {
      _id: '1',
      orderId: 'ORD001',
      customerName: 'John Doe',
      phoneNumber: '9876543210',
      items: [
        { name: 'Coffee', quantity: 2, price: 40 },
        { name: 'Sandwich', quantity: 1, price: 80 }
      ],
      totalAmount: 160,
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      orderId: 'ORD002',
      customerName: 'Jane Smith',
      phoneNumber: '9876543211',
      items: [
        { name: 'Tea', quantity: 3, price: 30 },
        { name: 'Cookies', quantity: 2, price: 25 }
      ],
      totalAmount: 140,
      status: 'accepted',
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      orderId: 'ORD003',
      customerName: 'Mike Johnson',
      phoneNumber: '9876543212',
      items: [
        { name: 'Burger', quantity: 1, price: 120 },
        { name: 'Coke', quantity: 1, price: 40 }
      ],
      totalAmount: 160,
      status: 'cancelled',
      createdAt: new Date().toISOString()
    }
  ];

  const [orders, setOrders] = useState(dummyOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleAcceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order._id === orderId 
        ? { ...order, status: 'accepted' }
        : order
    ));
  };

  const handleCancelOrder = (orderId) => {
    setOrders(orders.map(order => 
      order._id === orderId 
        ? { ...order, status: 'cancelled' }
        : order
    ));
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Cafe Orders</h1>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr 
                key={order._id} 
                onClick={() => handleOrderClick(order)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  {order.orderId}
                </td>
                <td className="px-6 py-4">
                  {order.items.map(item => item.name).join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{order.totalAmount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {order.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptOrder(order._id);
                        }}
                        className="text-green-600 hover:text-green-900"
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelOrder(order._id);
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

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="font-medium">{selectedOrder.customerName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium">{selectedOrder.phoneNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Order Items</p>
                <ul className="list-disc list-inside">
                  {selectedOrder.items.map((item, index) => (
                    <li key={index} className="font-medium">
                      {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-medium">₹{selectedOrder.totalAmount}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${
                  selectedOrder.status === 'accepted' ? 'text-green-600' :
                  selectedOrder.status === 'cancelled' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                </p>
              </div>
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
      )}
    </div>
  );
};

export default CheckAuth(CafeOrders);