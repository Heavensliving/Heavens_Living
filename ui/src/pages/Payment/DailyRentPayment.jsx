import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react/prop-types
const InputField = ({ label, name, type = 'text', value, onChange, required = false, disabled = false }) => (
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
    />
  </div>
);

const DailyRentPayment = () => {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const location = useLocation();
  const paymentType = location.state?.paymentType || '';
  // const [formData, setFormData] = useState('');
  const [formData, setFormData] = useState({
    renterId: location.state?.studentId || ''  // Initialize with passed studentId if available
  });
  const [studentId, setStudentId] = useState('');
  const [paymentData, setPaymentData] = useState('');
  const [totalAmountToPay, setTotalAmountToPay] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [collectedBy, setCollectedBy] = useState('');
  const [waveOffAmount, setWaveOffAmount] = useState('');
  const [payingAmount, setPayingAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [isRenterDataFetched, setIsRenterDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [manualStaffName, setManualStaffName] = useState('');

  const handleRenterIdChange = (e) => {
    setFormData({ renterId: e.target.value });
  };

  const fetchRenterData = async () => {
    if (!admin) return;
    if (!formData.renterId) {
      setErrorMessage("Please enter a valid ID.");
      setTimeout(() => {
        // setFormData(initialFormData);
        setErrorMessage('');
      }, 2000);
      return;
    }

    const renterId = formData.renterId;
    setStudentId(renterId)
    try {
      const response = await axios.get(`${API_BASE_URL}/DailyRent/renterId/${renterId}`,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      const data = await response.data;
      // console.log(data)
      setPaymentData(data)
      setErrorMessage('');
      setIsRenterDataFetched(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setErrorMessage("not found. Please check the ID.");
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      setIsRenterDataFetched(false);
    }
  };

  useEffect(() => {
    const fetchStaffMembers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/staff`, {
          headers: { 'Authorization': `Bearer ${admin.token}` }
        });

        // Filter staff members based on status
        const onDutyStaff = response.data.filter(staff => staff.Status === 'On Duty');
        setStaffMembers(onDutyStaff);
      } catch (err) {
        console.error('Error fetching staff members', err);
      }
    };
    fetchStaffMembers()
  }, [])

  // Dynamically update total amount to pay when waveOffAmount changes
  useEffect(() => {
    if (paymentData.renter && (paymentData.renter.totalAmount - paymentData.renter.payingAmount) !== undefined) {
      const newTotal = Math.max(paymentData.renter && (paymentData.renter.totalAmount - paymentData.renter.payingAmount) - waveOffAmount, 0);
      setTotalAmount(newTotal);
      setTotalAmountToPay(newTotal + paymentData.renter.payingAmount)
    }
  }, [waveOffAmount, paymentData.renter && (paymentData.renter.totalAmount - paymentData.renter.payingAmount)]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const finalCollectedBy = collectedBy === 'manual' ? manualStaffName : collectedBy;
    // Construct formData with all necessary fields
    const comprehensiveFormData = {
      ...paymentData, // Includes fetched student details like name, pgName, etc.
      studentId,
      waveOffAmount,
      payingAmount,
      transactionId,
      paidDate,
      totalAmountToPay,
      paymentMode,
      collectedBy: finalCollectedBy,
      property: paymentData.renter.pgName,
      isMessPayment: paymentType === "Daily Rent",
      isDailyRent: paymentType !== "Daily Rent",
    };

    try {
      // console.log(comprehensiveFormData); // debug statement Log to verify all data is present
      await axios.post(`${API_BASE_URL}/fee/add`, comprehensiveFormData,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );

      toast.success('Payments Added Successfully!', { autoClose: 500 });
      setTimeout(() => {
        navigate('/paymentReceived');
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
              <label className="block text-gray-700 mb-2">Enter Occupant ID</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={formData.renterId || ''}
                  onChange={handleRenterIdChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault(); // Prevent form submission on Enter
                    }
                  }}
                  className="w-full pl-16 p-2 border rounded-md"
                  placeholder="Enter ID"
                  required
                />
                <button
                  type="button"
                  onClick={fetchRenterData}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs hover:bg-blue-600 transition"
                >
                  <FaSearch className="text-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            {/* Other Input Fields */}
            {paymentData.renter && paymentData.renter.name && (
              <InputField label="Name" name="name" value={paymentData.renter.name || ''} required disabled />
            )}

            {paymentData.renter && paymentData.renter.pgName && (
              <InputField label="PG Name" name="pgName" value={paymentData.renter.pgName || ''} required disabled />
            )}

            {paymentData.renter && paymentData.renter.checkIn && (
              <InputField label="CheckIn Date" name="checkIn" value={new Date(paymentData.renter.checkIn).toLocaleDateString('en-GB') || ''} disabled />
            )}

            {paymentData.renter && paymentData.renter.checkOut && (
              <InputField label="CheckOut Date" name="checkOut" value={new Date(paymentData.renter.checkOut).toLocaleDateString('en-GB') || ''} required disabled />
            )}

            {paymentData.dailyRent && paymentData.dailyRent.DailyRent && (
              <InputField label="Daily Rent" name="DailyRent" value={paymentData.renter.DailyRent || ''} disabled />
            )}

            {paymentData.renter && paymentData.renter.days && (
              <InputField label="No. of Days" name="days" value={paymentData.renter.days || ''} disabled />
            )}

            {paymentData.renter && paymentData.renter.totalAmount && (
              <InputField label="Total Rent" name="totalAmount" value={paymentData.renter.totalAmount || ''} disabled />
            )}

            {paymentData.renter && paymentData.renter.payingAmount !== 0 && (
              <InputField
                label="Total Amount Paid"
                name="payingAmount"
                value={paymentData.renter.payingAmount === 0 ? "" : paymentData.renter.payingAmount}
                disabled
              />
            )}

            {paymentData.latestPaidDate && (
              <InputField label="Last Paid Date" name="lastPaidDate" value={new Date(paymentData.latestPaidDate || '').toLocaleDateString('en-GB') || ''} disabled />
            )}
            {isRenterDataFetched && (
              <InputField
                label="Rent Status"
                name="rentStatus"
                type="text"
                disabled
                value={
                  paymentData.renter.totalAmount
                    ? paymentData.renter.totalAmount === paymentData.renter.payingAmount
                      ? 'Cleared'
                      : `Pending due: ${paymentData.renter.totalAmount - paymentData.renter.payingAmount}`
                    : 'Cleared'
                }
              />
            )}
            {isRenterDataFetched && (
              <>
                <h1 className="w-full text-lg font-semibold mt-4 text-center mb-4">Make Payment</h1>
                <InputField label={"Total Amount to Pay"} name="totalAmount" type="number" value={totalAmount || 0} onChange={(e) => setTotalAmountToPay(e.target.value)} disabled />
                <InputField label="Wave-Off Amount" name="waveOffAmount" type="number" value={waveOffAmount} onChange={(e) => setWaveOffAmount(e.target.value)} />
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
                    <label className="block text-gray-700 mb-2">Collected By</label>
                    <select
                      name="collectedBy"
                      className="w-full p-2 border rounded-md"
                      required
                      value={collectedBy} // Bind the value to collectedBy
                      onChange={(e) => setCollectedBy(e.target.value)} // Update collectedBy
                    >
                      <option value="" disabled>Select Collector</option>
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
                    <label className="block text-gray-700 mb-2">Enter Staff Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter staff name"
                      value={manualStaffName} // Bind to manualStaffName state
                      onChange={(e) => setManualStaffName(e.target.value)} // Update manualStaffName
                      required
                    />
                  </div>
                )}
                <InputField label="Paid Date" name="paidDate" type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} required />
                <span className="text-xs text-red-400 font-normal block mt-1 text-center mx-auto">
                  The "Total Amount" is automatically calculated based on Check-In and Check-Out dates. Any adjustment can be reflected in the "Wave-Off Amount" field.
                </span>
              </>
            )}
          </div>
          {isRenterDataFetched && (
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

export default CheckAuth(DailyRentPayment);
