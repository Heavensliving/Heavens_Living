import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Form, Input, Button, Select, message } from 'antd';

const { Option } = Select;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (values) => {
    try {
      await axios.put(`${API_BASE_URL}/investment/update/${id}`, values, {
        headers: { 'Authorization': `Bearer ${admin?.token}` },
      });
      setSuccessMessage('Investment updated successfully!');
      message.success('Investment updated successfully!');
      navigate('/investment'); // Redirect to the investments list after successful update
    } catch (err) {
      setError('Failed to update investment');
      message.error('Failed to update investment');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      <Form
        layout="vertical"
        initialValues={formData}
        onFinish={handleSubmit}
        onFinishFailed={() => message.error('Please fill all required fields')}
      >
        <Form.Item
          label="Investment Name"
          name="name"
          rules={[{ required: true, message: 'Please enter the investment name' }]}
        >
          <Input id="name" value={formData.name} onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Property Name"
          name="propertyId"
          rules={[{ required: true, message: 'Please select a property' }]}
        >
          <Select
            id="propertyId"
            value={formData.propertyId}
            onChange={(value) => setFormData((prevData) => ({ ...prevData, propertyId: value }))}
            placeholder="Select a property"
          >
            <Option value="">Select a property</Option>
            {properties.map((property) => (
              <Option key={property._id} value={property._id}>
                {property.propertyName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Investment Type"
          name="type"
          rules={[{ required: true, message: 'Please enter the investment type' }]}
        >
          <Input id="type" value={formData.type} onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: 'Please enter the amount' }]}
        >
          <Input
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            type="number"
            min={0}
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
