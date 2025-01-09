import React, { useState, useEffect } from "react";
import { FaMoneyBillWave, FaTools, FaBoxes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InsightSection = () => {
  const admin = useSelector((store) => store.auth.admin);
  const navigate = useNavigate();

  const [lowStockCount, setLowStockCount] = useState(0);
  const [pendingMaintenanceCount, setPendingMaintenanceCount] = useState(0); 
  const [paymentPendingCount, setPaymentPendingCount] = useState(0); // State for payment pending students
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students
  useEffect(() => {
    if (!admin) return;
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/students`, {
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });
        setStudents(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };
    fetchStudents();
  }, [admin]);

  // Fetch pending maintenance count
  useEffect(() => {
    if (!admin || !admin.token) return;
    const fetchPendingMaintenanceCount = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/get`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });

        const records = response.data;

        // Filter records for pending maintenance tasks
        const pendingCount = records.filter(record => record.Status === 'pending' && !record.AssignedTo).length;
        setPendingMaintenanceCount(pendingCount);
      } catch (error) {
        console.error("Error fetching maintenance data:", error);
      }
    };
    fetchPendingMaintenanceCount();
  }, [admin]);

  // Function to fetch low stock count
  const fetchLowStockCount = async () => {
    if (!admin || !admin.token) {
      console.error("Admin token is missing!");
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/stocks/get`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      const stockData = response.data;

      // Filter stock items based on the admin role
      let filteredStockData = stockData;
      if (admin.role === "Property-Admin") {
        filteredStockData = stockData.filter(stock =>
          stock.propertyName.some(property =>
            admin.properties.some(adminProperty =>
              adminProperty.name === property.name
            )
          )
        );
      }
      // Calculate low stock items
      const lowStockItems = filteredStockData.filter(stock => {
        const availableStock = (stock.stockQty || 0) - (stock.usedQty || 0); // Ensure valid numeric values
        return availableStock <= (stock.lowAlertQty || 0); // Check low stock condition
      });

      setLowStockCount(lowStockItems.length);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  // Count of pending payments
  useEffect(() => {
    const paymentPending = students.filter(student => 
      student.paymentStatus === 'Pending' && 
      student.vacate === false && 
      new Date(student.joinDate) <= new Date()
    ).length;

    setPaymentPendingCount(paymentPending);
  }, [students]);

  useEffect(() => {
    fetchLowStockCount();
  }, [admin]); // Ensure that the admin object is available

  return (
    <div className="p-4 rounded-lg mt-3">
      <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
        Insights
      </h2>
      <div className="flex gap-4">
        {/* Box 1: Pending Payment */}
        <div className="bg-white w-44 h-32 rounded-lg shadow cursor-pointer flex flex-col p-4"
        onClick={() => navigate("/paymentPending")}
        >
          <div className="flex items-center gap-2">
            <FaMoneyBillWave className="text-green-500 text-lg" />
            <span className="text-sm font-medium">Pending Payment</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span className="text-2xl font-bold text-gray-700">{paymentPendingCount}</span> {/* Display Pending Payment Count */}
          </div>
        </div>
        {/* Box 2: Pending Maintenance */}
        <div className="bg-white w-44 h-32 rounded-lg shadow cursor-pointer flex flex-col p-4"
        onClick={() => navigate("/maintanance")}
        >
          <div className="flex items-center gap-2">
            <FaTools className="text-blue-500 text-lg" />
            <span className="text-sm font-medium">Maintenance Pending</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span className="text-2xl font-bold text-gray-700">{pendingMaintenanceCount}</span>
          </div>
        </div>
        {/* Box 3: Low Stock */}
        <div
          className="bg-white w-44 h-32 rounded-lg shadow cursor-pointer flex flex-col p-4"
          onClick={() => navigate("/low-stock")}
        >
          <div className="flex items-center gap-2">
            <FaBoxes className="text-red-500 text-lg" />
            <span className="text-sm font-medium">Low Stock items</span>
          </div>
          <div className="flex-1 flex justify-center items-center">
            <span className="text-2xl font-bold text-gray-700">
              {lowStockCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightSection;
