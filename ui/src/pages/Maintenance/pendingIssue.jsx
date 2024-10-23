import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AssignStaffModal from './AssignStaffModal'; 
import DetailModal from './DetailModal'; 
import API_BASE_URL from '../../config';

const PendingIssues = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [detailModalOpen, setDetailModalOpen] = useState(false); 
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const [staffMembers, setStaffMembers] = useState([]); 

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/get`);
        const unassignedRecords = response.data.filter(record => !record.AssignedTo);
        setRecords(unassignedRecords);
      } catch (err) {
        setError('Error fetching maintenance records');
      } finally {
        setLoading(false);
      }
    };

    const fetchStaffMembers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/staff`);
        setStaffMembers(response.data);
      } catch (err) {
        console.error('Error fetching staff members', err);
      }
    };

    fetchMaintenanceRecords();
    fetchStaffMembers();
  }, []);

  const handleAssignClick = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setDetailModalOpen(true);
  };

  const handleAssignStaff = async (staffId, timeNeeded) => {
    const selectedStaffMember = staffMembers.find(staff => staff._id === staffId);
    if (!selectedStaffMember) {
      console.error('Staff member not found');
      return;
    }

    const staffName = selectedStaffMember.Name;

    try {
      await axios.put(`${API_BASE_URL}/maintenance/assign/${selectedRecord._id}`, {
        staffName,
        Timeneeded: timeNeeded,
      });
      window.location.reload();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error assigning staff', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-1/3 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Pending Issues</h2>
      <div className="flex-grow max-h-40 overflow-y-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
              <th className="p-2 text-sm font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-2 text-center text-gray-600">
                  No pending issues
                </td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr 
                  key={record._id} 
                  className="hover:bg-gray-100 cursor-pointer" 
                  onClick={() => handleRowClick(record)}
                >
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{record.Name}</td>
                  <td className="p-2">{record.issue}</td>
                  <td className="p-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={(e) => { 
                        e.stopPropagation();
                        handleAssignClick(record);
                      }}
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AssignStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAssign={handleAssignStaff}
        staffMembers={staffMembers}
        selectedRecord={selectedRecord}
      />

      <DetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
};

export default PendingIssues;
