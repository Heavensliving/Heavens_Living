import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QRScanner = () => {
    const admin = useSelector(store => store.auth.admin);

    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [scanner, setScanner] = useState(null);
    const [scannerActive, setScannerActive] = useState(true); // New state to control scanning

    useEffect(() => {
        if (scannerActive) {
            const qrScanner = new Html5QrcodeScanner("qr-scanner", {
                fps: 10,
                qrbox: 250,
            });

            setScanner(qrScanner);

            qrScanner.render(onScanSuccess, onScanError);

            return () => {
                qrScanner.clear();
            };
        }
    }, [scannerActive]);

    const onScanSuccess = async (decodedText) => {
        if (scanner) {
            scanner.pause(); // Pause scanning
        }
        setScanResult(decodedText);
        console.log(`Scanned Result: ${decodedText}`);
        await handleScan(decodedText);
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
                fetchStudentDetails(orderId);
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

    const fetchStudentDetails = async (orderId) => {

        try {
            const studentResponse = await axios.get(`${API_BASE_URL}/messOrder/order/${orderId}`, {
                headers: { 'Authorization': `Bearer ${admin.token}` },
            });

            if (studentResponse.status === 200) {
                const category = studentResponse.data.category;
                console.log('Category:', category);

                setMessage(`Category: ${category}`);
                setScannerActive(false); // Disable scanner after successful data fetch
            } else {
                setMessage('Error: Failed to fetch student details');
            }
        } catch (error) {
            console.error('Error fetching student details:', error.response || error.message || error);
            setMessage(error.response?.data?.message || 'Network error while fetching student details');
        }
    };

    const handleReset = () => {
        setScanResult('');
        setMessage('');
        setScannerActive(true); // Re-enable scanner
    };

    return (
        <div className="relative w-full h-full flex flex-col">
            {/* Header Section */}
            <div className="bg-side-bar text-white text-center py-4">
                <h1 className="text-2xl font-bold">Heavens</h1>
            </div>
            <p className="text-lg mt-2 text-center">QR Scanner</p>

            {/* QR Scanner */}
            {scannerActive && (
                <div
                    id="qr-scanner"
                    style={{
                        width: '100%',
                        height: '60vh',
                        marginBottom: '20px',
                        position: 'relative',
                    }}
                ></div>
            )}

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
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default QRScanner;
