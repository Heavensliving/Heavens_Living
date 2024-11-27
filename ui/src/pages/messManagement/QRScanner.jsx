import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import axios from 'axios'; // Import Axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScan = async (data) => {
    if (data) {
      const scannedData = data.text || 'No Data Found';
      setScanResult(scannedData);
      console.log(`Scanned Data: ${scannedData}`);

      // Make an API call with Axios
      setLoading(true);
      try {
        const response = await axios.put(`${API_BASE_URL}/bookingStatus`, {
          bookingId: scannedData, // Sending the scanned booking ID
        });

        if (response.status === 200) {
          console.log('API Response:', response.data);
          alert('Order confirmed successfully!');
        } else {
          console.error('API Error:', response.data);
          alert(`Error: ${response.data.message || 'Failed to confirm order'}`);
        }
      } catch (apiError) {
        console.error('Network/API Error:', apiError);
        alert('Network error while confirming order.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (err) => {
    setError('QR Scanner Error: Unable to read QR code');
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };

  const videoConstraints = {
    facingMode: 'environment', // Use the back camera
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Confirm Your Order
      </h1>
      <div className="w-full max-w-sm bg-white p-4 rounded-lg shadow-lg">
        <QrScanner
          delay={300}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
          videoConstraints={videoConstraints}
          className="w-full"
        />
      </div>
      {scanResult && (
        <p className="mt-4 text-lg font-medium text-green-600 text-center">
          Scanned Code: {scanResult}
        </p>
      )}
      {error && (
        <p className="mt-4 text-lg font-medium text-red-600 text-center">
          {error}
        </p>
      )}
      {loading && (
        <div className="mt-4 text-lg font-medium text-blue-600 text-center">
          Processing...
        </div>
      )}
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md shadow-md focus:ring-2 focus:ring-blue-300"
        onClick={() => {
          setScanResult('');
          setError('');
        }}
      >
        Reset Scanner
      </button>
    </div>
  );
};

export default QRScanner;
