import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;

const EditStockModal = ({ isModalOpen, handleCancel, handleEditStock, stockToEdit, categories }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (stockToEdit) {
      form.setFieldsValue({
        itemName: stockToEdit.itemName,
        quantityType: stockToEdit.quantityType,
        category: stockToEdit.category,
        lowAlertQty: stockToEdit.lowAlertQty,
      });
    }
  }, [stockToEdit, form]);

  const onFinish = (values) => {
    handleEditStock(stockToEdit._id, values);
  };

  return (
    <Modal
      title="Edit Stock"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="itemName"
          label="Item Name"
          rules={[{ required: true, message: 'Please input item name!' }]}
        >
          <Input />
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
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select
            showSearch
            placeholder="Select category"
            optionFilterProp="children"
          >
            {categories.map((category) => (
              <Select.Option key={category._id} value={category.name}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="lowAlertQty"
          label="Low Alert Quantity"
          rules={[{ required: true, message: 'Please input low alert quantity!' }]}
        >
          <Input type="number" min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditStockModal; 