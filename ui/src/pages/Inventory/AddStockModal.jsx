import React from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const AddStockModal = ({ isModalOpen, handleCancel, handleAddStock }) => {
  const [form] = Form.useForm();

  const handleClose = () => {
    form.resetFields(); // Reset form when modal is closed
    handleCancel(); // Call the parent cancel function
  };

  return (
    <Modal
      title="Add Stock"
      visible={isModalOpen}
      onCancel={handleClose} // Use handleClose here
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          handleAddStock(values);
          form.resetFields(); // Reset form after submit
        }}
      >
        <Form.Item
          label="Item Name"
          name="itemName"
          rules={[{ required: true, message: 'Please enter the item name!' }]}
        >
          <Input placeholder="Enter item name" />
        </Form.Item>

        <Form.Item
          label="Quantity Type"
          name="quantityType"
          rules={[{ required: true, message: 'Please select a quantity type!' }]}
        >
          <Select placeholder="Select quantity type">
            <Option value="litre">Litre</Option>
            <Option value="kilogram">Kilogram</Option>
            <Option value="gram">Gram</Option>
            <Option value="millilitre">Millilitre</Option>
            <Option value="piece">Piece</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Stock Quantity"
          name="stockQty"
          rules={[{ required: true, message: 'Please enter stock quantity!' }]}
        >
          <Input placeholder="Enter stock quantity" type="number" />
        </Form.Item>

        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="default" onClick={handleClose} style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add Stock
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddStockModal;
