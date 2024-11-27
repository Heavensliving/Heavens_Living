import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QRScanner = () => {
    const admin = useSelector(store => store.auth.admin);

    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [scanner, setScanner] = useState(null); // To control the scanner

    useEffect(() => {
        const qrScanner = new Html5QrcodeScanner("qr-scanner", {
            fps: 10, // Scan frame rate (frames per second)
            qrbox: 250, // Size of the scanning box
        });

        // Save the scanner instance to state for control
        setScanner(qrScanner);

        qrScanner.render(onScanSuccess, onScanError);

        // Cleanup on component unmount
        return () => {
            qrScanner.clear();
        };
    }, []);

    const onScanSuccess = async (decodedText) => {
        if (scanner) {
            scanner.pause(); // Pause scanning to process the result
        }

        setScanResult(decodedText);
        console.log(`Scanned Result: ${decodedText}`);
        await handleScan(decodedText);

        // Wait for 3 seconds before resuming the scanner
        setTimeout(() => {
            if (scanner) {
                scanner.resume(); // Resume scanning after 3 seconds
            }
        }, 3000); // 3-second delay
    };


    const onScanError = (errorMessage) => {
        console.error('QR Scan error:', errorMessage);
    };

    const handleScan = async (orderId) => {
        setLoading(true);
        console.log("Scanned Order ID:", orderId);
        try {
            const response = await axios.put(`${API_BASE_URL}/messOrder/bookingStatus`, {
                orderId: orderId,
            }, { headers: { 'Authorization': `Bearer ${admin.token}` } });

            if (response.status === 200) {
                setMessage(response.data.message || 'Order confirmed successfully!');
            } else {
                setMessage('Error: Failed to confirm order');
            }
        } catch (error) {
            console.error('Network error:', error.response || error.message || error);
            setMessage(error.response?.data?.message || 'Network error while confirming order');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col">
            {/* Header Section */}
            <div className="bg-side-bar text-white text-center py-4">
                <h1 className="text-2xl font-bold">Heavens</h1>
            </div>
            <p className="text-lg mt-2 text-center">QR Scanner</p>

            {/* QR Scanner */}
            <div
                id="qr-scanner"
                style={{
                    width: '100%',
                    height: '60vh',
                    marginBottom: '20px',
                    position: 'relative',
                }}
            ></div>

            {/* Scan result and message */}
            {scanResult && !loading && (
                <div className="absolute top-1/4 w-full text-center">
                    <p className="text-2xl font-bold text-white">{scanResult}</p>
                    <p className="mt-2 text-lg text-green-500">{message}</p>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="absolute top-1/4 w-full text-center text-white">
                    <p className="text-lg">Processing...</p>
                </div>
            )}

            {/* Reset Button */}
            <div className="relative w-full flex justify-center">
                <button
                    className="px-4 py-2 bg-side-bar text-white rounded-md shadow-md"
                    onClick={() => {
                        setScanResult('');
                        setMessage('');
                        if (scanner) {
                            scanner.resume(); // Ensure scanner is resumed on reset
                        }
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default QRScanner;
