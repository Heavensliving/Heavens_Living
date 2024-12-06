import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QRScanner = () => {
    const admin = useSelector((store) => store.auth.admin);

    const [scanResult, setScanResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [scanner, setScanner] = useState(null);
    const [scannerActive, setScannerActive] = useState(true);
    const [details, setDetails] = useState(null);

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
        if (loading) {
            console.warn('Scan already in progress. Ignoring this scan.');
            return;
        }
    
        if (scanner) {
            scanner.pause();
        }
    
        // Reset state for repeated scans
        setScanResult('');
        setDetails(null);
        setMessage('');
        setScannerActive(true);
    
        console.log(`Scanned Result: ${decodedText}`);
        setScanResult(decodedText);
    
        // Proceed with handling the scan
        await handleScan(decodedText);
    };
    

    const onScanError = (errorMessage) => {
        console.error('QR Scan error:', errorMessage);
    };

    const handleScan = async (orderId) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${API_BASE_URL}/messOrder/bookingStatus`,
                { orderId },
                { headers: { Authorization: `Bearer ${admin.token}` } }
            );

            if (response.status === 200) {
                setMessage(response.data.message || 'Order confirmed successfully!');
                await fetchStudentDetails(orderId);
            } else {
                setMessage(response.data.message || 'Error: Failed to confirm order');
            }
        } catch (error) {
            console.error('Network error:', error.response || error.message || error);
            setMessage(error.response?.data?.message || 'Network error while confirming order');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentDetails = async (orderId) => {
        setDetails(null); // Clear previous details before fetching new ones
        try {
            const studentResponse = await axios.get(`${API_BASE_URL}/messOrder/order/${orderId}`, {
                headers: { Authorization: `Bearer ${admin.token}` },
            });
    
            if (studentResponse.status === 200) {
                const studentData = studentResponse.data.student;
                const order = studentResponse.data.order;
    
                setDetails({
                    category: studentData.category,
                    mealType: order.mealType,
                    name: order.name,
                    orderId: order.orderId,
                });
                setScannerActive(false);
            } else {
                setMessage('Error: Failed to fetch student details');
            }
        } catch (error) {
            console.error('Error fetching student details:', error.response || error.message || error);
            setMessage(error.response?.data?.message || 'Network error while fetching student details');
        }
    };
    

    const handleReset = () => {
        if (scanner) {
            scanner.clear();
            setScanner(null);
        }
        setScanResult('');
        setMessage('');
        setDetails(null);
        setScannerActive(false);
        setTimeout(() => {
            setScannerActive(true);
        }, 500);
    };

    return (
        <div className="relative w-full h-full flex flex-col">
            <div className="bg-side-bar text-white text-center py-4">
                <h1 className="text-2xl font-bold">Heavens</h1>
            </div>
            <p className="text-lg mt-2 text-center">QR Scanner</p>
            {scannerActive && (
                <div id="qr-scanner" style={{ width: '100%', height: '60vh', marginBottom: '20px', position: 'relative' }}></div>
            )}
            {!scannerActive && details && (
                <div className="p-4 bg-gray-100 rounded shadow-md w-11/12 mx-auto mt-4">
                    <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Category: {details.category}</h2>
                    <div className="text-center">
                        <p><strong>Name:</strong> {details.name}</p>
                        <p><strong>Meal Type:</strong> {details.mealType}</p>
                        <p><strong>Order ID:</strong> {details.orderId}</p>
                    </div>
                </div>
            )}
            {message && <div className="text-center text-lg text-green-500 mt-4">{message}</div>}
            {loading && <div className="absolute top-1/4 w-full text-center text-white"><p className="text-lg">Processing...</p></div>}
            <div className="relative w-full flex justify-center mt-4">
                <button className="px-4 py-2 bg-side-bar text-white rounded-md shadow-md" onClick={handleReset}>Reset</button>
            </div>
        </div>
    );
};

export default QRScanner;
