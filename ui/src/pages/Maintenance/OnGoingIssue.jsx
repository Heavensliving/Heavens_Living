import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import DetailModal from './DetailModal';
import ImageModal from '../../components/reUsableComponet/ImageModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OnGoingIssue = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // Track selected record for modal
  const [remark, setRemark] = useState(''); // State for remark input
  const [isModalOpen, setModalOpen] = useState(false);
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMaintenanceRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/get`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        const pendingRecords = response.data.filter(
          (record) => record.Status === 'pending' && record.AssignedTo
        );
        setRecords(pendingRecords);
      } catch (err) {
        setError('Error fetching maintenance records');
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceRecords();
  }, [admin.token]);

  const calculateTimeRemaining = (assignedAt, timeNeeded) => {
    if (!assignedAt || !timeNeeded) return { hours: 0, minutes: 0 };
    const assignedTime = new Date(assignedAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - assignedTime;

    const timeNeededMs = timeNeeded * 60 * 60 * 1000;
    const remainingTimeMs = timeNeededMs - timeDifference;

    const remainingHours = Math.max(
      Math.floor(remainingTimeMs / (1000 * 60 * 60)),
      0
    );
    const remainingMinutes = Math.max(
      Math.floor((remainingTimeMs % (1000 * 60 * 60)) / (1000 * 60)),
      0
    );

    return { hours: remainingHours, minutes: remainingMinutes };
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRecord(null);
    setRemark(''); // Reset remark
    setModalOpen(false);
  };

  const handleImgClick = (record) => {
    if (record.issueImg) {
      setModalImageSrc(record.issueImg);
    } else {
      setModalImageSrc("No image available currently.");
    }
    setIsImgModalOpen(true);
  };

  const closeModal = () => {
    setIsImgModalOpen(false);
    setModalImageSrc('');
  };

  const handleSubmitRemark = async (skip = false) => {
    if (selectedRecord) {
      try {
        await axios.put(
          `${API_BASE_URL}/maintenance/updateStatus/${selectedRecord._id}`,
          {
            status: 'resolved',
            Remarks: skip ? '' : remark,
          },
          { headers: { Authorization: `Bearer ${admin.token}` } }
        );
        setSelectedRecord(null);
        setRemark('');
        setModalOpen(false);
        window.location.reload(); // Reload page to reflect changes
      } catch (error) {
        console.error('Error resolving issue', error);
      }
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
    <div className="bg-white shadow-md rounded-lg p-4 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">Ongoing Issues</h2>
      <div className="flex-grow max-h-80 overflow-y-auto">
        <table className="w-full text-left">
          <thead className="text-center">
            <tr>
              <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issue Image</th>
              <th className="p-2 text-sm font-bold text-gray-700">Assigned To</th>
              <th className="p-2 text-sm font-bold text-gray-700">Time Needed</th>
              <th className="p-2 text-sm font-bold text-gray-700">Time Remaining</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {records.length === 0 ? (
              <tr>
                <td className="p-2 text-center" colSpan="6">
                  No ongoing issues
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
                  <td className="p-2">{record.AssignedTo}</td>
                  <td className="p-2">{record.Timeneeded} hours</td>
                  <td className="p-2 text-red-700">
                    {(() => {
                      const { hours, minutes } = calculateTimeRemaining(
                        record.AssignedAt,
                        record.Timeneeded
                      );
                      return `${hours} hours ${minutes} minutes`;
                    })()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying details and actions */}
      {isModalOpen && selectedRecord && (
        <DetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          record={selectedRecord}
          remark={remark}
          setRemark={setRemark}
          onSubmitRemark={handleSubmitRemark}
        />
      )}
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

export default OnGoingIssue;
