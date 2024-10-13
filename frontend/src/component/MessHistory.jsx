import { useState } from 'react';

function OrderHistory() {
  // Sample order data
  const [orders, setOrders] = useState([
    {
      id: 1,
      orderDate: '2023-10-12',
      name: 'John Doe',
      contactNumber: '1234567890',
      email: 'john@example.com',
      mealType: ['Breakfast', 'Lunch'],
      totalAmount: 25.0,
    },
    {
      id: 2,
      orderDate: '2023-10-13',
      name: 'Jane Smith',
      contactNumber: '9876543210',
      email: 'jane@example.com',
      mealType: ['Dinner'],
      totalAmount: 15.0,
    },
    {
      id: 3,
      orderDate: '2023-10-14',
      name: 'Robert Brown',
      contactNumber: '5555555555',
      email: 'robert@example.com',
      mealType: ['Whole Meal'],
      totalAmount: 40.0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Order History</h2>

      {/* Search input */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Order History Table */}
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order Date</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Contact Number</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Meal Type</th>
              <th className="py-3 px-6 text-left">Total Amount</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{order.orderDate}</td>
                  <td className="py-3 px-6 text-left">{order.name}</td>
                  <td className="py-3 px-6 text-left">{order.contactNumber}</td>
                  <td className="py-3 px-6 text-left">{order.email || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{order.mealType.join(', ')}</td>
                  <td className="py-3 px-6 text-left">${order.totalAmount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderHistory;
