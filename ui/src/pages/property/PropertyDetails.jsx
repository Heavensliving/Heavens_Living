import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import API_BASE_URL from '../../config';
import { useSelector } from 'react-redux';

const PropertyDetails = () => {
  const admin = useSelector(store => store.auth.admin);
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property/${propertyId}`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setProperty(response.data);
      } catch (error) {
        setError('Failed to fetch property details');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [propertyId]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/property/delete/${propertyId}`,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );
      navigate('/property');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Failed to delete the property');
    }
  };

  const ConfirmDelete = () => {
    handleDelete();
    setIsModalOpen(false);
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

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">{property.propertyName}</h1>
          <div>
            <Link to={`/editproperty/${propertyId}`}>
              <button className="text-blue-500 hover:text-blue-700 mr-4">
                <FontAwesomeIcon icon={faEdit} size="lg" />
              </button>
            </Link>
            <button onClick={() => setIsModalOpen(true)} className="text-red-500 hover:text-red-700">
              <FontAwesomeIcon icon={faTrash} size="lg" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Property ID:</strong> <span className="text-gray-800">{property.propertyId}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Location:</strong> <span className="text-gray-800">{property.location}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Address:</strong> <span className="text-gray-800">{property.address}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Contact Number:</strong> <span className="text-gray-800">{property.contactNumber}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Total Beds:</strong> <span className="text-gray-800">{property.totalBeds}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Preferred By:</strong> <span className="text-gray-800">{property.preferredBy}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Starting Price:</strong> <span className="text-gray-800">${property.startingPrice}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">One Sharing Price:</strong> <span className="text-gray-800">${property.oneSharing}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Two Sharing Price:</strong> <span className="text-gray-800">${property.twoSharing}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Three Sharing Price:</strong> <span className="text-gray-800">${property.threeSharing}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Four Sharing Price:</strong> <span className="text-gray-800">${property.fourSharing}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Property Type:</strong> <span className="text-gray-800">{property.propertyType}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Branch:</strong> <span className="text-gray-800">{property.branchName}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Phase:</strong> <span className="text-gray-800">{property.phaseName}</span>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow-md">
            <strong className="text-gray-700">Property Owner's Name:</strong> <span className="text-gray-800">{property.propertyOwnerName}</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={ConfirmDelete}
        title="Confirm Delete"
        message={`Are you sure you want to delete this property?`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default PropertyDetails;
