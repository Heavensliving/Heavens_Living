import React, { useState, useEffect } from "react";
import axios from "axios";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useSelector } from "react-redux";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QRScanner = () => {
  const admin = useSelector((store) => store.auth.admin);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState(null);
  const [scannerActive, setScannerActive] = useState(true);

  // Initialize QR Scanner
  useEffect(() => {
    if (scannerActive) {
      const qrScanner = new Html5QrcodeScanner("qr-scanner", {
        fps: 10,
        qrbox: 250,
      });

      qrScanner.render(onScanSuccess, onScanError);

      return () => {
        qrScanner.clear();
      };
    }
  }, [scannerActive]);

  // Handle successful QR code scan
  const onScanSuccess = async (decodedText) => {
    console.log(`Scanned Result: ${decodedText}`);
    await handleScan(decodedText);
  };

  // Handle QR code scan error
  const onScanError = (errorMessage) => {
    console.warn("QR Scan Error:", errorMessage);
  };

  // Handle scan result (API call to process the order)
  const handleScan = async (orderId) => {
    setLoading(true);
    setMessage("");
    setDetails(null);

    try {
      const response = await axios.put(
        `${API_BASE_URL}/messOrder/bookingStatus`,
        { orderId },
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );

      if (response.status === 200) {
        setMessage(response.data.message || "Order confirmed successfully!");
        await fetchStudentDetails(orderId);
      } else if (response.data.orderStatus === "delivered") {
        setMessage("This order has already been delivered.");
        await fetchStudentDetails(orderId);
      } else {
        setMessage("Error: Failed to confirm order.");
      }
    } catch (error) {
      setMessage("Network error while confirming order.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch student details based on the order ID
  const fetchStudentDetails = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messOrder/order/${orderId}`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      if (response.status === 200) {
        const { student, order } = response.data;
        setDetails({
          category: student?.category || "N/A",
          mealType: order?.mealType || "N/A",
          name: order?.name || "N/A",
          orderId,
        });
        setScannerActive(false);
      } else {
        setMessage("Error: Failed to fetch student details.");
      }
    } catch (error) {
      setMessage("Error while fetching student details.");
      console.error(error);
    }
  };

  // Reset scanner and clear details
  const handleReset = () => {
    setScannerActive(false);
    setDetails(null);
    setMessage("");
    setTimeout(() => setScannerActive(true), 500);
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="bg-side-bar text-white text-center py-4">
        <h1 className="text-2xl font-bold">QR Scanner</h1>
      </div>

      <p className="text-lg mt-2 text-center">Scan QR Code Below</p>

      {scannerActive && (
        <div
          id="qr-scanner"
          style={{ width: "100%", height: "60vh", marginBottom: "20px" }}
        ></div>
      )}

      {!scannerActive && details && (
        <div className="p-4 bg-gray-100 rounded shadow-md w-11/12 mx-auto mt-4">
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
            Category: {details.category}
          </h2>
          <div className="text-center">
            <p><strong>Name:</strong> {details.name}</p>
            <p><strong>Meal Type:</strong> {details.mealType}</p>
            <p><strong>Order ID:</strong> {details.orderId}</p>
          </div>
        </div>
      )}

      {message && <div className="text-center text-lg text-green-500 mt-4">{message}</div>}
      {loading && <div className="text-center text-lg text-gray-700 mt-4">Processing...</div>}

      <div className="relative w-full flex justify-center mt-4">
        <button
          className="px-4 py-2 bg-side-bar text-white rounded-md shadow-md"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default QRScanner;
