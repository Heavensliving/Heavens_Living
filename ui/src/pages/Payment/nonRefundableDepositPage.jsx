import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const NonRefundableDeposits = () => {
  const admin = useSelector((store) => store.auth.admin); // Retrieve admin from Redux store
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/students`, {
          headers: { Authorization: `Bearer ${admin?.token}` },
        });
        setStudents(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (admin?.token) fetchStudents();
  }, [admin?.token]); // Depend on admin.token

  if (loading) return <p>Loading student data...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Filter out students with refundable or non-refundable deposits equal to 0
  const filteredStudents = students.filter(
    (student) =>
      (student.nonRefundableDeposit && student.nonRefundableDeposit !== 0) ||
      (student.refundableDeposit && student.refundableDeposit !== 0)
  );

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Student Deposits</h1>
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Student Name</th>
            <th className="border border-gray-300 px-4 py-2">Student ID</th>
            <th className="border border-gray-300 px-4 py-2">Non-Refundable Deposit</th>
            <th className="border border-gray-300 px-4 py-2">Refundable Deposit</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student, index) => (
            <tr key={student._id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
              <td className="border border-gray-300 px-4 py-2">{student.name}</td>
              <td className="border border-gray-300 px-4 py-2">{student.studentId}</td>
              <td className="border border-gray-300 px-4 py-2">{student.nonRefundableDeposit}</td>
              <td className="border border-gray-300 px-4 py-2">{student.refundableDeposit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NonRefundableDeposits;
