import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PropertyDetails = () => {
  const { propertyId } = useParams(); 
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-4">{property.propertyName}</h1>
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
          <strong>Branch:</strong> {property.branch}
        </div>
        <div className="mb-4">
          <strong>Phase:</strong> {property.phase}
        </div>
        <div className="mb-4">
          <strong>Property Owner's Name:</strong> {property.propertyOwnerName}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
