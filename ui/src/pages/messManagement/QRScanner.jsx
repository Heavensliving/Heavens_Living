import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QRScanner = () => {
    const admin = useSelector(store => store.auth.admin);

    const [scanResult, setScanResult] = useState('');
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
        <div className="relative w-full h-full bg-gray-100 flex flex-col">
            {/* Header Section */}
            <div className="bg-side-bar text-white text-center py-4">
                <h1 className="text-2xl font-bold">Heavens</h1>
            </div>
                <p className="text-lg mt-2">QR Scanner</p>

            {/* QR Scanner */}
            <div 
                id="qr-scanner" 
                style={{
                    width: '100%', 
                    height: '60vh',  // Adjust the height here
                    marginBottom: '20px',  // Optional: add space below the scanner
                    position: 'relative'
                }}
            ></div>

            {/* Scan result and message */}
            {scanResult && !loading && (
                <div className="absolute top-1/4 w-full text-center text-white">
                    <p className="text-2xl font-bold">{scanResult}</p>
                    <p className="mt-2 text-lg">{message}</p>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="absolute top-1/4 w-full text-center text-white">
                    <p className="text-lg">Processing...</p>
                </div>
            )}

            {/* Reset Button */}
            <button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-side-bar text-white rounded-md shadow-md"
                onClick={() => {
                    setScanResult('');
                    setMessage('');
                }}
            >
                Reset Scanner
            </button>
        </div>
    );
};

export default QRScanner;
