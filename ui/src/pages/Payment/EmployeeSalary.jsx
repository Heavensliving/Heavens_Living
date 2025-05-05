import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../../firebase';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for unique names
import Resizer from "react-image-file-resizer";

const storage = getStorage(app);

// eslint-disable-next-line react/prop-types
const InputField = ({ label, name, type = 'text', value, onChange, style, required = false, disabled = false }) => (
    <div className="w-full md:w-1/2 px-2 mb-4">
        <label className="block text-gray-700 mb-2">{label}</label>
        <input
            min={1}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-2 border rounded-md"
            required={required}
            disabled={disabled}
            onWheel={(e) => e.target.blur()}
            style={style}
        />
    </div>
);

const EmployeeSalary = () => {
    const admin = useSelector(store => store.auth.admin);
    const navigate = useNavigate();
    const [staffData, setStaffData] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [paymentMode, setPaymentMode] = useState('');
    const [collectedBy, setCollectedBy] = useState('');
    const [leaveTaken, setLeaveTaken] = useState('');
    const [salaryCut, setSalaryCut] = useState('');
    const [remarks, setRemarks] = useState('');
    const [payingAmount, setPayingAmount] = useState('');
    const [transactionId, setTransactionId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [paidDate, setPaidDate] = useState('');
    const [isStaffDataFetched, setIsStaffDataFetched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [manualStaffName, setManualStaffName] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadedImageFile, setUploadedImageFile] = useState(null);

    const [staffMembers, setStaffMembers] = useState([]);
    const [formData, setFormData] = useState({ staffName: '' });

    useEffect(() => {
        const fetchStaffMembers = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/staff`, {
                    headers: { 'Authorization': `Bearer ${admin.token}` }
                });

                const onDutyStaff = response.data.filter(staff => staff.Status === 'On Duty');
                setStaffMembers(onDutyStaff);
                console.log(response.data)
            } catch (err) {
                console.error('Error fetching staff members', err);
            }
        };

        fetchStaffMembers();
    }, [])

    const fetchSelectedStaffDetails = async (staffId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/staff/${staffId}`, {
                headers: { Authorization: `Bearer ${admin.token}` },
            });

            console.log('Full staff document:', response.data);
            setStaffData(response.data)
            setIsStaffDataFetched(true)

            // Optionally update form with more data
            // setFormData(prev => ({ ...prev, ...response.data }));
        } catch (error) {
            console.error('Error fetching staff document:', error);
        }
    };

    useEffect(() => {
        if (staffData?.Salary && leaveTaken > 0) {
            const perDaySalary = staffData.Salary / 30;
            const cut = Math.round(perDaySalary * leaveTaken); // 🔁 Rounded here
            setSalaryCut(cut);
        } else {
            setSalaryCut(0);
        }
    }, [leaveTaken, staffData?.Salary]);

    // Dynamically update total amount to pay when leaveTaken 
    useEffect(() => {
        if (staffData?.pendingSalary !== undefined) {
            const newTotal = Math.max(staffData.pendingSalary - salaryCut, 0);
            setTotalAmount(newTotal);
        }
    }, [salaryCut, staffData?.pendingSalary]);

    const handleChange = (e) => {
        const { name, files } = e.target;

        if ((name === "billImgCamera" || name === "billImgFile") && files && files[0]) {
            const file = files[0];
            setUploadedImageFile(file); // ✅ Save real file
            setSelectedImage(URL.createObjectURL(file)); // preview only
        }
    };

    const uploadFile = (file) => {
        return new Promise((resolve, reject) => {
            if (!file || file.size === 0) {
                return reject("Invalid file");
            }

            // ✅ Compress image before upload (Reduces file size)
            Resizer.imageFileResizer(
                file,
                800, // Max width
                800, // Max height
                "JPEG", // Format
                80, // Quality (0 to 100)
                0, // Rotation
                (compressedFile) => {
                    // ✅ Upload compressed file
                    const fileExtension = file.name.split('.').pop();
                    const uniqueFileName = `expense-bill/${Date.now()}_${uuidv4()}.${fileExtension}`;
                    const storageRef = ref(storage, uniqueFileName);
                    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload is ${progress}% done`);
                        },
                        (error) => reject(error),
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
                        }
                    );
                },
                "file" // Output format
            );
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const finalCollectedBy = collectedBy === 'manual' ? manualStaffName : collectedBy;

        let billImgUrl = undefined;

        if (uploadedImageFile) {
            try {
                billImgUrl = await uploadFile(uploadedImageFile);
            } catch (err) {
                toast.error("Image upload failed!");
                console.error("Upload Error:", err);
                setLoading(false);
                return;
            }
        }

        const comprehensiveFormData = {
            name: staffData.Name, // Includes fetched student details like name, pgName, etc.
            staffId: staffData._id,
            totalAmount,
            amount: payingAmount,
            transactionId,
            paidDate,
            paymentMode,
            handledBy: finalCollectedBy,
            propertyId: staffData.property,
            property: staffData.propertyName,
            remarks,
            billImg: billImgUrl
        };

        try {
            console.log(comprehensiveFormData); // debug statement Log to verify all data is present

            await axios.post(`${API_BASE_URL}/expense/addSalary`, comprehensiveFormData,
                { headers: { 'Authorization': `Bearer ${admin.token}` } }
            );

            toast.success('Salary Added Successfully!', { autoClose: 500 });
            setTimeout(() => {
                navigate('/expenses');
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error("Error recording payment:", error);
            toast.error(error.response.data.message, { autoClose: 500 });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen items-center justify-center bg-gray-100">
            <div className="bg-white p-4 rounded-md shadow-md w-full">
                {errorMessage && (
                    <div className="bg-red-500 text-white p-2 rounded-md mb-4 text-center">
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    {/* Student ID Field with Fixed Prefix and Fetch Button */}
                    <div className="w-full flex justify-center px-2 mb-4">

                        <div className="w-full md:w-1/2 px-2 mb-4">
                            <label className="block text-gray-700 mb-2">Select Staff</label>
                            <select
                                value={formData.staffName}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selectedStaff = staffMembers.find((staff) => staff._id === selectedId);

                                    if (selectedStaff) {
                                        setFormData({ ...formData, staffName: selectedStaff.name });
                                        fetchSelectedStaffDetails(selectedId);
                                    }
                                }}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">-- Select Staff --</option>
                                {staffMembers.map((staff) => (
                                    <option key={staff._id} value={staff._id}>
                                        {staff.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>
                    <div className="flex flex-wrap -mx-2">
                        {/* Other Input Fields */}
                        {staffData.Name && (
                            <InputField label="Name" name="name" value={staffData.Name || ''} required disabled />
                        )}

                        {staffData.propertyName && (
                            <InputField label="PG Name" name="pgName" value={staffData.propertyName || ''} required disabled />
                        )}

                        {staffData.joinDate && (
                            <InputField label="joinDate" name="joinDate" value={new Date(staffData.joinDate).toLocaleDateString('en-GB') || ''} disabled />
                        )}

                        {staffData.Salary && (
                            <InputField label="salary" name="salary" value={staffData.Salary || ''} required disabled />
                        )}

                        {isStaffDataFetched && (
                            <InputField
                                label="Rent Status"
                                name="rentStatus"
                                type="text"
                                style={{
                                    color: staffData.pendingSalary ? 'red' : 'green',
                                    fontWeight: 'bold',
                                }}
                                disabled
                                value={
                                    staffData.pendingSalary
                                        ? staffData.pendingSalary === 0
                                            ? 'Cleared'
                                            : `Pending due: ${staffData.pendingSalary}`
                                        : 'Cleared'
                                }
                            />
                        )}
                        {isStaffDataFetched && (
                            <>
                                <h1 className="w-full text-lg font-semibold mt-4 text-center mb-4">Make Payment</h1>
                                <InputField label={"Total Amount to Pay"} name="totalAmount" type="number" value={totalAmount || 0} onChange={(e) => setTotalAmount(e.target.value)} disabled />
                                <InputField label="Leave Taken" name="leaveLaken" type="number" value={leaveTaken} onChange={(e) => setLeaveTaken(e.target.value)} />
                                <InputField label="Amount Paying" name="paidAmount" type="number" value={payingAmount} onChange={(e) => setPayingAmount(e.target.value)} required />
                                <div className="w-full md:w-1/2 px-2 mb-4">
                                    <label className="block text-gray-700 mb-2">Payment Mode</label>
                                    <select
                                        name="paymentMode"
                                        className="w-full p-2 border rounded-md"
                                        required
                                        value={paymentMode} // Bind the value to paymentMode
                                        onChange={(e) => setPaymentMode(e.target.value)} // Update paymentMode
                                    >
                                        <option value="" disabled>Select Payment Mode</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Net Banking">Net Banking</option>
                                        <option value="UPI">UPI</option>
                                    </select>
                                </div>

                                {/* Conditionally render Transaction ID or Collected By dropdown based on Payment Mode */}
                                {paymentMode === "Cash" ? (
                                    <div className="w-full md:w-1/2 px-2 mb-4">
                                        <label className="block text-gray-700 mb-2">Handled By</label>
                                        <select
                                            name="collectedBy"
                                            className="w-full p-2 border rounded-md"
                                            required
                                            value={collectedBy} // Bind the value to collectedBy
                                            onChange={(e) => setCollectedBy(e.target.value)} // Update collectedBy
                                        >
                                            <option value="" disabled>Select Handled By</option>
                                            <option value="manual" className='bg-gray-100 text-red-500 font-bold'>Enter manually</option>
                                            {staffMembers.map((staff) => (
                                                <option key={staff._id} value={staff.Name}>
                                                    {staff.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <InputField
                                        label="Transaction ID"
                                        name="transactionID"
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                    />
                                )}
                                {collectedBy === 'manual' && (
                                    <div className="w-full md:w-1/2 px-2 mb-4">
                                        <label className="block text-gray-700 mb-2">Enter Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-2 border rounded-md"
                                            placeholder="Enter name"
                                            value={manualStaffName} // Bind to manualStaffName state
                                            onChange={(e) => setManualStaffName(e.target.value)} // Update manualStaffName
                                            required
                                        />
                                    </div>
                                )}
                                <InputField label="Paid Date" name="paidDate" type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} required />
                                <InputField label="Remarks" name="remarks" type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
                                <div>
                                    <label className="block text-gray-700 mb-2 font-semibold">Upload Bill</label>

                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <label className="cursor-pointer bg-gray-100 border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-200 transition">
                                            📸 Take a Photo
                                            <input
                                                type="file"
                                                name="billImgCamera"
                                                accept="image/*"
                                                capture="environment"
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                        </label>

                                        <label className="cursor-pointer bg-gray-100 border border-gray-300 rounded-lg p-4 text-center hover:bg-gray-200 transition">
                                            🖼️ Choose from Gallery
                                            <input
                                                type="file"
                                                name="billImgFile"
                                                accept="image/*"
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Image Preview */}
                                    {selectedImage && (
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-600 mb-2">Selected Image Preview:</p>
                                            <img
                                                src={selectedImage}
                                                alt="Selected Preview"
                                                className="max-h-64 border rounded shadow-md"
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {isStaffDataFetched && (
                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className={`w-full bg-side-bar text-white font-bold py-3 rounded-lg hover:bg-[#373082] transition duration-300 flex items-center justify-center ${loading ? ' cursor-not-allowed' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="spinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
                                ) : (
                                    'Submit Payment'
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default CheckAuth(EmployeeSalary);
