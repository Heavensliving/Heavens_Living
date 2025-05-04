import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import moment from 'moment';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import CheckAuth from '../auth/CheckAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line react/prop-types
const InputField = ({ label, name, type = 'text', value, onChange, required = false, disabled = false, style }) => (
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

const FeePayment = () => {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();

  // Function to generate month/year options
  // const generateMonthYearOptions = () => {
  //   const options = [];
  //   const currentDate = new Date();

  //   // Generate the past 12 months
  //   for (let i = 0; i < 12; i++) {
  //     const month = currentDate.getMonth() - i;
  //     const year = currentDate.getFullYear() + Math.floor(month / 12); // Adjust year when going back over December
  //     const adjustedDate = new Date(year, (month + 12) % 12); // Correct month for each iteration

  //     // Format month as full name and year as YYYY
  //     const formattedMonth = adjustedDate.toLocaleString('default', { month: 'long' });
  //     const formattedYear = adjustedDate.getFullYear();

  //     options.push({
  //       label: `${formattedMonth}, ${formattedYear}`, // Format as "November, 2024"
  //       value: `${formattedMonth}, ${formattedYear}`,
  //     });
  //   }
  //   setMonthYearOptions(options);
  // };
  const generateMonthYearOptions = () => {
    const options = [];
    const currentDate = new Date();

    // Generate the past 6 months
    for (let i = 6; i > 0; i--) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear() + Math.floor(month / 12); // Adjust year when going back over December
      const adjustedDate = new Date(year, (month + 12) % 12); // Correct month for each iteration

      // Format month as full name and year as YYYY
      const formattedMonth = adjustedDate.toLocaleString('default', { month: 'long' });
      const formattedYear = adjustedDate.getFullYear();

      options.push({
        label: `${formattedMonth}, ${formattedYear}`, // Format as "November, 2024"
        value: `${formattedMonth}, ${formattedYear}`,
      });
    }

    // Generate the current month and next 5 months (total 6 future months)
    for (let i = 0; i < 6; i++) {
      const month = currentDate.getMonth() + i;
      const year = currentDate.getFullYear() + Math.floor(month / 12); // Adjust year when moving forward
      const adjustedDate = new Date(year, month % 12); // Correct month for each iteration

      // Format month as full name and year as YYYY
      const formattedMonth = adjustedDate.toLocaleString('default', { month: 'long' });
      const formattedYear = adjustedDate.getFullYear();

      options.push({
        label: `${formattedMonth}, ${formattedYear}`, // Format as "March, 2025"
        value: `${formattedMonth}, ${formattedYear}`,
      });
    }

    setMonthYearOptions(options);
  };
  useEffect(() => {
    generateMonthYearOptions();
  }, []);

  // const [formData, setFormData] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentMongoId, setStudentMongoId] = useState('');
  const [paymentData, setPaymentData] = useState('');
  const [totalAmountToPay, setTotalAmountToPay] = useState('');
  const [monthYearOptions, setMonthYearOptions] = useState([]);
  const [paymentMode, setPaymentMode] = useState('');
  const [waveOffAmount, setWaveOffAmount] = useState('');
  const [waveOffReason, setWaveOffReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [payingAmount, setPayingAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [isStudentDataFetched, setIsStudentDataFetched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [staffMembers, setStaffMembers] = useState([]);
  const [collectedBy, setCollectedBy] = useState('');
  const [manualStaffName, setManualStaffName] = useState('');

  const location = useLocation();
  const [formData, setFormData] = useState({
    studentId: location.state?.studentId || '',  // Initialize with passed studentId if available
    mongoId: location.state?.mongoId || ''
  });

  const handleStudentIdChange = (e) => {
    console.log(e.target.value)
    setFormData({ studentId: e.target.value });
  };

  const fetchStudentData = async () => {
    if (!admin) return;
    if (!formData.studentId) {
      setErrorMessage("Please enter a valid student ID.");
      setTimeout(() => {
        // setFormData(initialFormData);
        setErrorMessage('');
      }, 2000);
      return;
    }

    const studentId = `HVNS${formData.studentId}`;
    setStudentId(studentId)
    try {
      const response = await axios.get(`${API_BASE_URL}/students/studentId/${studentId}`,
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      setPaymentData(response.data)
      setStudentMongoId(response.data._id)
      setErrorMessage('');
      setIsStudentDataFetched(true);
    } catch (error) {
      console.error("Error fetching student data:", error);
      setErrorMessage("Student not found. Please check the Student ID.");
      setTimeout(() => {
        setErrorMessage('');
      }, 2000);
      setIsStudentDataFetched(false);
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
    if (paymentData.pendingRent !== undefined) {
      const newTotal = Math.max(paymentData.pendingRent - waveOffAmount, 0);
      setTotalAmountToPay(newTotal);
    }
  }, [waveOffAmount, paymentData.pendingRent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const finalCollectedBy = collectedBy === 'manual' ? manualStaffName : collectedBy;
    // Construct formData with all necessary fields
    const comprehensiveFormData = {
      name: paymentData.name, // Includes fetched student details like name, pgName, etc.
      studentId,
      _id: formData.mongoId || studentMongoId,
      waveOffAmount,
      waveOffReason,
      payingAmount,
      transactionId,
      paidDate,
      paymentMode,
      collectedBy: finalCollectedBy,
      property: paymentData.pgName,
      propertyId: paymentData.property._id,
      remarks
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
      console.error("Error recording fee payment:", error);
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
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">HVNS</span>
                <input
                  type="text"
                  value={formData.studentId || ''}
                  onChange={handleStudentIdChange}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault(); // Prevent form submission on Enter
                    }
                  }}
                  className="w-full pl-16 p-2 border rounded-md"
                  placeholder="Enter ID suffix"
                  required
                />
                <button
                  type="button"
                  onClick={fetchStudentData}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs hover:bg-blue-600 transition"
                >
                  <FaSearch className="text-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-2">
            {/* Other Input Fields */}
            {paymentData.name && (
              <InputField label="Name" name="name" value={paymentData.name || ''} required disabled />
            )}{paymentData.pgName && (
              <InputField label="PG Name" name="pgName" value={paymentData.pgName || ''} required disabled />
            )}{paymentData.joinDate && (
              <InputField
                label="Join Date"
                name="joinDate"
                value={
                  paymentData.joinDate
                    ? moment(paymentData.joinDate).format('DD/MM/YYYY')
                    : 'Invalid Date'
                }
                disabled
              />
            )}{paymentData.monthlyRent && (
              <InputField label="Monthly Rent" name="monthlyRent" type="number" value={paymentData.monthlyRent || ''} required disabled />
            )}{paymentData.accountBalance > 0 && (
              <InputField label="Advance Paid" name="advancePaid" type="number" value={paymentData.accountBalance || ''} disabled />
            )}{paymentData.pendingBalance && (
              <InputField label="Pending Balance" name="pending" type="number" value={paymentData.pendingBalance || ''} disabled />
            )}{paymentData?.payments?.[paymentData.payments.length - 1]?.fullyClearedRentMonths?.length > 0 && (
              <InputField
                label="Rent Cleared Till"
                name="clearedMonth"
                value={
                  paymentData.payments[paymentData.payments.length - 1].fullyClearedRentMonths[
                  paymentData.payments[paymentData.payments.length - 1].fullyClearedRentMonths.length - 1
                  ] || ''
                }
                disabled
              />
            )}
            {paymentData?.payments?.[paymentData.payments.length - 1]?.paymentDate && (
              <InputField
                label="Last Paid Date"
                name="lastPaidDate"
                value={moment(paymentData.payments[paymentData.payments.length - 1].paymentDate).format('DD/MM/YYYY')}
                disabled
              />
            )}
            {paymentData.pendingAddOns > 0 && (
              <InputField
                label="Pending Add-Ons Amount"
                name="pendingAddOns"
                value={paymentData.pendingAddOns}
                disabled
                style={{
                  color: 'red',
                  fontWeight: 'bold',
                }}
              />
            )}
            {isStudentDataFetched && (
              <InputField label="Rent Status" name="rentStatus" type="text" disabled style={{
                color: paymentData.pendingRent ? 'red' : 'green',
                fontWeight: 'bold',
              }}
                value={
                  paymentData.pendingRent
                    ? `Pending due: ${paymentData.pendingRent}`
                    : 'Cleared'
                }
              />
            )}
            {isStudentDataFetched && (
              <>
                <h1 className="w-full text-lg font-semibold mt-4 text-center mb-4">Make Payment</h1>
                <InputField label="Wave-Off Amount" name="waveOffAmount" type="number" value={waveOffAmount} onChange={(e) => setWaveOffAmount(e.target.value)} />
                <InputField label="Wave-Off Reason" name="waveOffReason" value={waveOffReason} onChange={(e) => setWaveOffReason(e.target.value)} />
                <InputField label="Total Amount to Pay" name="totalAmount" type="number" value={totalAmountToPay} onChange={(e) => setTotalAmountToPay(e.target.value)} disabled />
                <InputField label="Amount Paying" name="payingAmount" type="number" value={payingAmount} onChange={(e) => setPayingAmount(e.target.value)} required />
                <InputField label="Paid Date" name="paidDate" type="date" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} required />
                <div className="w-full md:w-1/2 px-2 mb-4">
                  <label className="block text-gray-700 mb-2">Payment Mode</label>
                  <select
                    name="paymentMode"
                    className="w-full p-2 border rounded-md"
                    required
                    value={paymentMode} // Bind the value to paymentMode
                    onChange={(e) => setPaymentMode(e.target.value)} // Update paymentMode
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="Cash">Cash</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
                {/* Conditionally render Transaction ID only if payment mode is not "Cash" */}
                {paymentMode === "Cash" ? (
                  <div className="w-full md:w-1/2 px-2 mb-4">
                    <label className="block text-gray-700 mb-2">Collected By</label>
                    <select
                      name="collectedBy"
                      className="w-full p-2 border rounded-md"
                      required
                      value={collectedBy} // Bind the value to collectedBy
                      // onChange={(e) => setCollectedBy(e.target.value)} // Update collectedBy
                      onChange={(e) => {
                        setCollectedBy(e.target.value); // Update collectedBy
                        // Reset manual name if switching back from "manual" to other options
                        if (e.target.value !== 'manual') {
                          setManualStaffName(''); // Clear manual input if another option is selected
                        }
                      }}
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
                    required
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
                <InputField label="Remarks" name="remarks" type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
              </>
            )}
          </div>
          {isStudentDataFetched && (
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

export default CheckAuth(FeePayment);
