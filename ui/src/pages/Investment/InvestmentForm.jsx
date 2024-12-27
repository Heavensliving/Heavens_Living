import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, Select, Button, Form, message } from 'antd';

const { Option } = Select;
const InvestmentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    propertyName: '',
    propertyId: '',
    type: '',
    amount: '',
  });
  const [properties, setProperties] = useState([]);
  const admin = useSelector((state) => state.auth.admin); // Admin properties
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // URL
  const navigate = useNavigate();

  useEffect(() => {
    console.log(admin);
    if (!admin) {
      console.error('Admin prop is undefined. Please ensure it is passed correctly.');
      return;
    }

    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/property`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        message.error('Failed to fetch properties');
      }
    };

    fetchProperties();
  }, [admin]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handlePropertyChange = (value) => {
    const selectedProperty = properties.find(
      (property) => property.propertyName === value
    );

    setFormData((prevData) => ({
      ...prevData,
      propertyName: value,
      propertyId: selectedProperty ? selectedProperty._id : '',
    }));
  };

  const handleSubmit = async (values) => {
    if (formData.amount <= 0) {
      message.error('Amount must be a positive number');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/investment/add`, formData, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      message.success('Investment added successfully!');
      setFormData({ name: '', propertyName: '', propertyId: '', type: '', amount: '' });
      navigate('/investment');
    } catch (error) {
      console.error('Error adding investment:', error);
      message.error(error.response?.data?.message || 'Error adding investment. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Investment Name" name="name" required>
          <Input
            value={formData.name}
            onChange={handleChange}
            id="name"
            placeholder="Enter investment name"
          />
        </Form.Item>

        <Form.Item label="Property Name" name="propertyName" required>
          <Select
            value={formData.propertyName}
            onChange={handlePropertyChange}
            placeholder="Select a property"
          >
            {properties.map((property) => (
              <Option key={property._id} value={property.propertyName}>
                {property.propertyName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Investment Type" name="type" required>
          <Input
            value={formData.type}
            onChange={handleChange}
            id="type"
            placeholder="Enter investment type"
          />
        </Form.Item>

        <Form.Item label="Amount" name="amount" required>
          <Input
            type="number"
            value={formData.amount}
            onChange={handleChange}
            id="amount"
            placeholder="Enter investment amount"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add Investment
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InvestmentForm;
