import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSelector } from 'react-redux';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QRScanner = () => {
    const admin = useSelector(store => store.auth.admin);
    const [scanResult, setScanResult] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');  // State to store message from backend

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
    const onScanSuccess = (decodedText) => {
        setScanResult(decodedText);  // Update the scan result state
        console.log(`Scanned Result: ${decodedText}`);  // Log the result directly here
        handleScan(decodedText);  // Pass the decodedText directly to handleScan
    };

    // Callback when there is an error with the scan
    const onScanError = (errorMessage) => {
        console.error('QR Scan error:', errorMessage);
        setError(errorMessage);
    };

    const handleScan = async (orderId) => {
        setLoading(true);
        console.log("Scanned Order ID:", orderId);  // Log the orderId here
        try {
            const response = await axios.put(`${API_BASE_URL}/messOrder/bookingStatus`, {
                orderId: orderId, // Send the orderId to the backend directly
            }, { headers: { 'Authorization': `Bearer ${admin.token}` } });
    
            if (response.status === 200) {
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
                    setMessage('');
                }}
            >
                Reset Scanner
            </button>
        </div>
    );
};

export default QRScanner;
