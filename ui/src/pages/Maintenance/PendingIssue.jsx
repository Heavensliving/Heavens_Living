import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AssignStaffModal from './AssignStaffModal';
import DetailModal from './DetailModal';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { useSelector } from 'react-redux';
import ImageModal from '../../components/reUsableComponet/ImageModal';

const PendingIssue = () => {
  const admin = useSelector(store => store.auth.admin);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [staffMembers, setStaffMembers] = useState([]);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchMaintenanceRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/get`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );
        const unassignedRecords = response.data.filter(record => !record.AssignedTo);
        setRecords(unassignedRecords);
      } catch (err) {
        setError('Error fetching maintenance records');
      } finally {
        setLoading(false);
      }
    };

    // Fetch staff members
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

  const handleImgClick = (record) => {
    if (record.issueImg) {
      setModalImageSrc(record.issueImg);
    } else {
      setModalImageSrc("No image available currently.");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsImgModalOpen(false);
    setModalImageSrc('');
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
      },
        { headers: { 'Authorization': `Bearer ${admin.token}` } }
      );
      window.location.reload();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error assigning staff', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>{error}</div>
      </div>
    );
  }
  const defaultImage = 'https://jkfenner.com/wp-content/uploads/2019/11/default.jpg';
  return (
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col mb-2">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Pending Issues</h2>
      <div className=" max-h-80 overflow-y-auto">
        <table className="w-full text-left">
          <thead className='text-center'>
            <tr>
              <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue Image</th>
              <th className="p-2 text-sm font-bold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className='text-center'>
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
                  <td className="p-2 align-middle">
                    {record.issueImg ? (
                      <img
                        src={isLoading ? defaultImage : expense.billImg}
                        className="max-w-[60px] max-h-[60px] object-contain mx-auto"
                        alt="issue-img"
                        onLoad={() => setIsLoading(false)}
                        onClick={() => handleImgClick(expense)}
                      />
                    ) : (
                      <span>-</span>
                    )}
                  </td>
                  <td className="p-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignClick();
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
      {/* Image Modal */}
      <ImageModal
        isOpen={isImgModalOpen}
        onClose={closeModal}
        imageSrc={modalImageSrc}
        altText="&nbsp; No image available &nbsp;&nbsp;&nbsp;"
      />
    </div>
  );
};

export default PendingIssue;
