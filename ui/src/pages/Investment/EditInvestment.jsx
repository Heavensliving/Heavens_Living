import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, Input, Select, Button, Alert } from 'antd';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const { Option } = Select;

const EditInvestment = () => {
  const { id } = useParams(); // Get the investment ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    propertyId: '',
    type: '',
    amount: '',
  });
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.admin); // Access the admin from Redux

  useEffect(() => {
    const fetchInvestment = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/investment/${id}`, {
          headers: { 'Authorization': `Bearer ${admin?.token}` },
        });
        setFormData(response.data.data);
      } catch (err) {
        setError('Failed to fetch investment details');
      }
    };

    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`, {
          headers: { 'Authorization': `Bearer ${admin?.token}` },
        });
        setProperties(response.data);
      } catch (err) {
        setError('Failed to fetch properties');
      }
    };

    fetchInvestment();
    fetchProperties();
  }, [id, admin]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/investment/update/${id}`, formData, {
        headers: { 'Authorization': `Bearer ${admin?.token}` },
      });
      setSuccessMessage('Investment updated successfully!');
      navigate('/investment'); // Redirect to the investments list after successful update
    } catch (err) {
      setError('Failed to update investment');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      {error && <Alert message={error} type="error" className="mb-4" />}
      {successMessage && <Alert message={successMessage} type="success" className="mb-4" />}
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Investment Name"
          required
          rules={[{ required: true, message: 'Please enter the investment name' }]}
        >
          <Input
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Enter investment name"
          />
        </Form.Item>

        <Form.Item
          label="Property Name"
          required
          rules={[{ required: true, message: 'Please select a property' }]}
        >
          <Select
            value={formData.propertyName}
            onChange={(value) => handleChange('propertyName', value)}
            placeholder="Select a property"
          >
            {properties.map((property) => (
              <Option key={property._id} value={property.propertyName}>
                {property.propertyName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Investment Type"
          required
          rules={[{ required: true, message: 'Please enter the investment type' }]}
        >
          <Input
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            placeholder="Enter investment type"
          />
        </Form.Item>

        <Form.Item
          label="Amount"
          required
          rules={[{ required: true, message: 'Please enter the amount' }]}
        >
          <Input
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            placeholder="Enter amount"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update Investment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditInvestment;
