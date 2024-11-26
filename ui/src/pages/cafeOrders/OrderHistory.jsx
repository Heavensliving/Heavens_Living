import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="font-semibold">{label}</span>
        <span>{value}</span>
    </div>
);

const OrderModal = ({ order, onClose }) => (
    <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        role="dialog"
        aria-modal="true"
    >
        <div className="bg-white rounded-lg p-6 max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Close modal"
                >
                    ✕
                </button>
            </div>

            <div className="space-y-4">
                <DetailRow label="Customer Name:" value={order.customerName} />
                <DetailRow label="Contact:" value={order.contact} />
                <DetailRow label="Property:" value={order.propertyName} />
                <DetailRow label="Room Number:" value={order.roomNumber} />
                <DetailRow
                    label="Order Items:"
                    value={
                        <ul className="list-disc list-inside">
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.itemName} x {item.quantity} - ₹{item.total}
                                </li>
                            ))}
                        </ul>
                    }
                />
                <DetailRow label="Total Amount:" value={`₹${order.total}`} />
                <DetailRow
                    label="Status:"
                    value={
                        <span
                            className={`font-medium ${order.status === "delivered"
                                ? "text-green-600"
                                : order.status === "cancelled"
                                    ? "text-red-600"
                                    : "text-yellow-600"
                                }`}
                        >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    }
                />
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
);

const OrderHistory = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedDate, setSelectedDate] = useState(""); // State for selected date
    const [totalAmountReceivedInSelectedDay, setTotalAmountReceivedInSelectedDay] = useState(0);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/cafeOrder/`);
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching order history:", error);
            }
        };

        fetchOrderHistory();
    }, []);

    const deliveredOrders = orders.filter(order => order.status === "delivered");
    const totalAmountReceived = deliveredOrders.reduce((sum, order) => sum + order.total, 0);
    // Filter orders by selected date (keeping all orders)
    const filteredOrders = selectedDate
        ? orders.filter(order => new Date(order.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString())
        : orders;

    useEffect(() => {
        if (selectedDate) {
            const total = filteredOrders
                .filter(order => order.status === "delivered") // Filter only delivered orders
                .reduce((sum, order) => sum + order.total, 0);
            setTotalAmountReceivedInSelectedDay(total);
        } else {
            setTotalAmountReceivedInSelectedDay(0); // Reset to 0 if no date is selected
        }
    }, [selectedDate, filteredOrders]);

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Navbar-like header */}
            <header className="bg-side-bar text-white py-4 px-6 fixed top-0 left-0 w-full z-10 shadow-md">
                <div className="flex justify-between items-center">
                    {/* Menu icon on the left */}
                    <FaArrowLeft className="text-xl cursor-pointer" onClick={() => navigate('/cafe-order-panel')} />

                    {/* Centered heading */}
                    <h1 className="text-2xl font-semibold text-center mx-auto">Heavens Cafe</h1>
                </div>
            </header>

            {/* Content Section */}
            <div className="pt-20 px-4 py-6"> {/* Add padding to offset the fixed header */}
                <h2 className="text-xl font-semibold mb-2 text-center text-gray-700">Order History</h2>
                <p className="mb-2">Total Amount Received: ₹{totalAmountReceived}</p>

                {/* Date Picker */}
                <div className="mb-2 text-center">
                    <label className="font-medium">Select Date: </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="ml-2 p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <p className="mb-2">Total Amount Received on selected day: ₹{totalAmountReceivedInSelectedDay}</p>

                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                                onClick={() => setSelectedOrder(order)} // Show modal on click
                            >
                                <h3 className="text-lg font-semibold text-black">{order.name}</h3>
                                <p className="text-sm text-black">
                                    Date: {new Date(order.date).toLocaleDateString()}
                                </p>
                                <p className="text-sm text-black">Total: ₹{order.total.toFixed(2)}</p>
                                <p
                                    className={`text-sm font-medium rounded-md px-2 py-1 inline-block ${order.status === "pending"
                                        ? "bg-amber-200 text-amber-800"
                                        : order.status === "cancelled"
                                            ? "bg-red-100 text-red-800"
                                            : order.status === "ongoing"
                                                ? "bg-blue-200 text-blue-800"
                                                : order.status === "delivered"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-gray-200 text-gray-800"
                                        }`}
                                >
                                    Status: {order.status}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600 text-lg mt-10">
                        No orders found for the selected date!
                    </p>
                )}
            </div>

            {/* Render Modal if an order is selected */}
            {selectedOrder && (
                <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
            )}
        </div>
    );
};

export default OrderHistory;
