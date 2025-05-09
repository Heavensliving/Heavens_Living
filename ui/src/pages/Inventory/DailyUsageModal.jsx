import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, InputNumber, Button, message, DatePicker } from 'antd';

const DailyUsageModal = ({ isModalOpen, handleCancel, handleDailyUsage, stocks }) => {
  const [selectedItem, setSelectedItem] = useState(null); // Store selected item details
  const [dailyUsage, setDailyUsage] = useState(0); // Store daily usage value
  const [error, setError] = useState(''); // State to store error message
  const [selectedDate, setSelectedDate] = useState(null); // Store selected date

  // Clear the fields when modal is closed or reset
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedItem(null);
      setDailyUsage(0);
      setError('');
      setSelectedDate(null); // Clear date on modal close
    }
  }, [isModalOpen]);

  const handleItemChange = (itemId) => {
    const selected = stocks.find((item) => item._id === itemId);
    setSelectedItem(selected);
  };

  const handleSubmit = () => {
    if (!selectedItem) {
      message.error('Please select an item.');
      return;
    }

    if (!selectedDate) {
      message.error('Please select a date.');
      return;
    }

    // Validate the dailyUsage value
    if (dailyUsage <= 0 || isNaN(dailyUsage)) {
      message.error('Please enter a valid positive number for daily usage.');
      return;
    }

    // Check if entered daily usage exceeds available stock
    const availableStock = selectedItem.stockQty - selectedItem.usedQty;
    if (dailyUsage > availableStock) {
      message.error('Insufficient available stock for the requested daily usage');
      return;
    }

    // Call the handleDailyUsage function to update the usage with date
    handleDailyUsage(selectedItem._id, dailyUsage, selectedDate.format('YYYY-MM-DD'));
  };

  const handleDailyUsageChange = (value) => {
    // Reject non-numeric or invalid input
    if (value && (value <= 0 || isNaN(value) || String(value).includes('-') || /[a-zA-Z]/.test(value))) {
      setError('Please enter a valid positive number.');
      return;
    }

    // If valid, clear the error and update the state
    setDailyUsage(value);
    setError('');
  };

  const handleInputBlur = () => {
    // Ensure that the final value is valid
    if (dailyUsage <= 0 || isNaN(dailyUsage)) {
      setError('Please enter a valid positive number.');
    }
  };

  return (
    <Modal
      title="Update Daily Usage"
      open={isModalOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Update Daily Usage
        </Button>,
      ]}
      key={isModalOpen ? 'open' : 'closed'}
    >
      <Form layout="vertical">
        <Form.Item label="Item Name" required>
          <Select
            placeholder="Select an item"
            onChange={handleItemChange}
            value={selectedItem ? selectedItem._id : undefined}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {stocks.map((stock) => (
              <Option key={stock._id} value={stock._id}>
                {stock.itemName}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {selectedItem && (
          <div style={{ marginBottom: '15px' }}>
            <p>
              <strong>Available Quantity:</strong>{' '}
              {selectedItem.stockQty - selectedItem.usedQty} {selectedItem.quantityType}
            </p>
          </div>
        )}

        <Form.Item label="Usage Date" required>
          <DatePicker
            style={{ width: '100%' }}
            value={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            placeholder="Select date"
          />
        </Form.Item>

        <Form.Item label="Daily Usage" required>
          <InputNumber
            min={0}
            placeholder="Enter daily usage"
            value={dailyUsage}
            onChange={handleDailyUsageChange}
            onBlur={handleInputBlur}
            style={{ width: '100%' }}
          />
          {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DailyUsageModal;
