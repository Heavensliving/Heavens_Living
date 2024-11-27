import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Import Axios
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');  // State to store message from backend
  const qrCodeRef = useRef(null); // To hold the scanner reference

  useEffect(() => {
    // Initialize the QR code scanner
    const scanner = new Html5QrcodeScanner("qr-scanner", {
      fps: 10,  // Scan frame rate (frames per second)
      qrbox: 250, // Size of the scanning box
    });

    // Start the scanner
    scanner.render(onScanSuccess, onScanError);

    // Cleanup the scanner when the component unmounts
    return () => {
      scanner.clear();
    };
  }, []);

  // Callback when a QR code is successfully scanned
  const onScanSuccess = (decodedText, decodedResult) => {
    setScanResult(decodedText);
    console.log(`Scanned Result: ${decodedText}`);
    // Process the scanned data, for example, API call
    handleScan(decodedText);
  };

  // Callback when there is an error with the scan
  const onScanError = (errorMessage) => {
    console.error('QR Scan error:', errorMessage);
    setError(errorMessage);
  };

  const handleScan = async (scannedData) => {
    setLoading(true);
    try {
      // Replace the fetch API with axios
      const response = await axios.put(`${process.env.VITE_API_BASE_URL}/bookingStatus`, {
        orderId: scannedData,
      });

      if (response.status === 200) {
        // Set the message from the backend
        setMessage(response.data.message || 'Order confirmed successfully!');
      } else {
        setMessage('Error: Failed to confirm order');
      }
    } catch (error) {
      console.error('Network error:', error);
      setMessage('Network error while confirming order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Confirm Your Order</h1>

      <div id="qr-scanner" style={{ width: '100%', height: 250 }}></div>

      {scanResult && (
        <p className="mt-4 text-lg font-medium text-green-600 text-center">
          Scanned Code: {scanResult}
        </p>
      )}
      {error && (
        <p className="mt-4 text-lg font-medium text-red-600 text-center">{error}</p>
      )}
      {loading && (
        <div className="mt-4 text-lg font-medium text-blue-600 text-center">
          Processing...
        </div>
      )}
      {message && (
        <div className="mt-4 text-lg font-medium text-center">
          <p>{message}</p>
        </div>
      )}
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md focus:ring-2 focus:ring-blue-300"
        onClick={() => {
          setScanResult('');
          setError('');
          setMessage('');  // Reset message
        }}
      >
        Reset Scanner
      </button>
    </div>
  );
};

export default QRScanner;
