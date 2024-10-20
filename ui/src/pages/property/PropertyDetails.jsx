
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/property/${propertyId}`);
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
      await axios.delete(`http://localhost:3000/api/property/delete/${propertyId}`);
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">{property.propertyName}</h1>

          {/* Edit and Delete Icons */}
          <div>
            <Link to={`/editproperty/${propertyId}`}>
              <button className="text-blue-600 hover:text-blue-800 mr-4">
                <FontAwesomeIcon icon={faEdit} size="lg" />
              </button>
            </Link>
            <button onClick={() => setIsModalOpen(true)} className="text-red-600 hover:text-red-800">
              <FontAwesomeIcon icon={faTrash} size="lg" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <strong>Property ID:</strong> {property.propertyId}
        </div>
        <div className="mb-4">
          <strong>Location:</strong> {property.location}
        </div>
        <div className="mb-4">
          <strong>Address:</strong> {property.address}
        </div>
        <div className="mb-4">
          <strong>Contact Number:</strong> {property.contactNumber}
        </div>
        <div className="mb-4">
          <strong>Total Beds:</strong> {property.totalBeds}
        </div>
        <div className="mb-4">
          <strong>Preferred By:</strong> {property.preferredBy}
        </div>
        <div className="mb-4">
          <strong>Starting Price:</strong> ${property.startingPrice}
        </div>
        <div className="mb-4">
          <strong>One Sharing Price:</strong> ${property.oneSharing}
        </div>
        <div className="mb-4">
          <strong>Two Sharing Price:</strong> ${property.twoSharing}
        </div>
        <div className="mb-4">
          <strong>Four Sharing Price:</strong> ${property.fourSharing}
        </div>
        <div className="mb-4">
          <strong>Property Type:</strong> {property.propertyType}
        </div>
        <div className="mb-4">
          <strong>Branch:</strong> {property.branchName}
        </div>
        <div className="mb-4">
          <strong>Phase:</strong> {property.phaseName}
        </div>
        <div className="mb-4">
          <strong>Property Owner's Name:</strong> {property.propertyOwnerName}
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

