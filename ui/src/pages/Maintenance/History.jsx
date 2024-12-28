import { useEffect, useState } from 'react';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import DetailModal from './DetailModal'; // Import the Modal component
import { useSelector } from 'react-redux';
import ImageModal from '../../components/reUsableComponet/ImageModal';

const ResolvedHistory = () => {
  const admin = useSelector(store => store.auth.admin);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null); // State for the selected record
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query
  const [isImgModalOpen, setIsImgModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResolvedRecords = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/maintenance/get`,
          { headers: { 'Authorization': `Bearer ${admin.token}` } }
        );
        // Filter records where the status is 'resolved'
        const resolvedRecords = response.data.filter(record => record.Status === 'resolved');
        setRecords(resolvedRecords);
      } catch (err) {
        setError('Error fetching resolved maintenance records');
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedRecords();
  }, []);

  const handleRowClick = (record) => {
    setSelectedRecord(record); // Set the selected record
    setModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setModalOpen(false); // Close the modal
    setSelectedRecord(null); // Reset the selected record
  };

  const handleImgClick = (record) => {
    if (record.issueImg) {
      setModalImageSrc(record.issueImg);
    } else {
      setModalImageSrc("No image available currently.");
    }
    setIsImgModalOpen(true);
  };

  const closeImgModal = () => {
    setIsImgModalOpen(false);
    setModalImageSrc('');
  };

  // Filter records based on the search query
  const filteredRecords = records.filter(record =>
    record.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full mx-auto mt-4 flex flex-col">
      <div className="mb-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by Name"
          className="border p-2 rounded w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
        />
      </div>

      <div className="flex-grow"> {/* Allow scrolling if too many records */}
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
              <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
              <th className="p-2 text-sm font-bold text-gray-700 text-center">Issue</th>
              <th className="p-2 text-sm font-bold text-gray-700 text-center">Issue Image</th>
              <th className="p-2 text-sm font-bold text-gray-700 text-center">Resolved By</th>
              <th className="p-2 text-sm font-bold text-gray-700 text-center">Resolved Date</th>
              <th className="p-2 text-sm font-bold text-gray-700 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? ( // Check if there are no records
              <tr>
                <td colSpan="6" className="p-2 text-center text-gray-500">No Data Found</td>
              </tr>
            ) : (
              filteredRecords.map((record, index) => {
                // Ensure the date is valid before creating a new Date instance
                const resolutionDate = new Date(record.updatedAt);
                const formattedDate = isNaN(resolutionDate.getTime())
                  ? 'Invalid Date' // Fallback for invalid date
                  : resolutionDate.toLocaleDateString();

                return (
                  <tr key={record._id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(record)}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{record.Name}</td>
                    <td className="p-2 text-center">{record.issue}</td>
                    <td className="p-2 align-middle text-center">
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
                    <td className="p-2 text-center">{record.AssignedTo}</td>
                    <td className="p-2 text-center">{formattedDate}</td>
                    <td className="p-2 text-green-700 text-center">{record.Status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <DetailModal isOpen={isModalOpen} onClose={closeModal} record={selectedRecord} />
      {/* Image Modal */}
      <ImageModal
        isOpen={isImgModalOpen}
        onClose={closeImgModal}
        imageSrc={modalImageSrc}
        altText="&nbsp; No image available &nbsp;&nbsp;&nbsp;"
      />
    </div>
  );
};

export default ResolvedHistory;