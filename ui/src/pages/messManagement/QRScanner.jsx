import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';

const QRScanner = () => {
  const [scanResult, setScanResult] = useState('');
  const [error, setError] = useState('');

  const handleScan = (data) => {
    if (data) {
      setScanResult(data.text || 'No Data Found');
      console.log(`Scanned Data: ${data.text}`);
      // Make an API call here with the scanned data
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
