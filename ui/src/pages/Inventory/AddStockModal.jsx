import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Select, message, InputNumber } from 'antd';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons'; 
import axios from 'axios'; 
import { useSelector } from 'react-redux';

const { Option } = Select;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddStockModal = ({ isModalOpen, handleCancel, handleAddStock }) => {
  const admin = useSelector((store) => store.auth.admin);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm(); 
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false); 
  const [categories, setCategories] = useState([]);

  const properties = admin?.properties || [];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/inventorycategories/get`, 
          {
            headers: { Authorization: `Bearer ${admin.token}` },
          }
        );
        setCategories(response.data.categories);
      } catch (error) {
        message.error('Failed to fetch categories.');
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const handleClose = () => {
    form.resetFields(); 
    handleCancel(); 
  };

  const handleCategoryModalOpen = () => {
    setIsCategoryModalVisible(true); 
  };

  const handleCategoryModalClose = () => {
    categoryForm.resetFields();
    setIsCategoryModalVisible(false);
  };

  const handleAddCategory = async (values) => {
    try {
      const token = admin?.token; 
      
      if (!token) {
        throw new Error('Token not found!');
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/inventorycategories/add`, 
        { categoryName: values.categoryName },
        { 
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      setIsCategoryModalVisible(false);
      message.success('Category Added Successfully!', 2);
      
      setCategories((prevCategories) => [
        ...prevCategories, 
        response.data.category,
      ]);
      
      categoryForm.resetFields();
    } catch (error) {
      console.error('Error adding category:', error.response?.data || error.message);
  
      if (error.response?.data?.message === 'Category already exists') {
        message.error('This category already exists!', 2);  
      } else {
        message.error('Error adding category. Please try again.', 2);
      }
    }
  };

  // Handle category delete
  const handleDeleteCategory = (categoryId) => {
    // Show confirmation modal
    Modal.confirm({
      title: 'Are you sure you want to delete this category?',
      content: 'Once deleted, this action cannot be undone.',
      okText: 'Yes, Delete',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const token = admin?.token;
          
          if (!token) {
            throw new Error('Token not found!');
          }
  
          // Send delete request to the backend
          const response = await axios.delete(
            `${API_BASE_URL}/inventorycategories/delete/${categoryId}`,
            { 
              headers: { Authorization: `Bearer ${token}` }
            }
          );
  
          // Remove the deleted category from the state
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== categoryId)
          );
  
          message.success('Category Deleted Successfully!');
        } catch (error) {
          console.error('Error deleting category:', error.response?.data || error.message);
          message.error('Error deleting category. Please try again.', 2);
        }
      },
      onCancel() {
        console.log('Delete action canceled');
      },
    });
  };

  return (
    <>
      <Modal
    title="Add Stock"
    open={isModalOpen}
    onCancel={handleClose}
    footer={null}
  >
    <Form
      form={form} // Make sure the form instance is passed correctly
      layout="vertical"
      onFinish={(values) => {
        handleAddStock(values);
        form.resetFields();
      }}
    >
      <Form.Item
        label="Item Name"
        name="itemName"
        rules={[{ required: true, message: 'Please enter the item name!' }]}>
        <Input placeholder="Enter item name" />
      </Form.Item>

      <Form.Item
        label={
          <span>
            Category
            <PlusCircleOutlined
              style={{ marginLeft: 8, fontSize: 16, cursor: 'pointer' }}
              onClick={handleCategoryModalOpen}
            />
          </span>
        }
        name="category"
        rules={[{ required: true, message: 'Please select a category!' }]}>
        <Select
          placeholder="Select category"
          value={form.getFieldValue('category')}
          onChange={() => {}}
          optionLabelProp="label" // Avoid rendering icon in selected value
        >
          {categories.map((category) => (
            <Option
              key={category._id}
              value={category.name}
              label={category.name}
            >
              <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {category.name}
                <DeleteOutlined
                  style={{ cursor: 'pointer', color: 'red' }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the select change
                    handleDeleteCategory(category._id);
                  }}
                />
              </span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Quantity Type"
        name="quantityType"
        rules={[{ required: true, message: 'Please select a quantity type!' }]}>
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
        rules={[{ required: true, message: 'Please enter stock quantity!' }]}>
        <Input placeholder="Enter stock quantity" type="number" />
      </Form.Item>

      <Form.Item
      label="Low Alert Quantity"
      name="lowAlertQty"
      rules={[
        { required: true, message: 'Please enter the low alert quantity!' },
      ]}
    >
      <InputNumber placeholder="Enter low alert quantity" style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
            label="Select Property"
            name="myProperty" // The name should be 'myProperty' to store it in the backend
            rules={[{ required: true, message: 'Please select a property!' }]}
          >
            <Select placeholder="Select a property">
              {properties.map((property) => (
                <Option key={property.id} value={property.name}>
                  {property.name}
                </Option>
              ))}
            </Select>
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

      {/* Category Modal */}
          <Modal
      title="Add Category"
      open={isCategoryModalVisible}
      onCancel={handleCategoryModalClose}
      footer={null}
    >
      <Form
        form={categoryForm} // Ensure categoryForm is correctly passed here
        layout="vertical"
        onFinish={handleAddCategory}
      >
        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[{ required: true, message: 'Please enter a category name!' }]}>
          <Input placeholder="Enter new category name" />
        </Form.Item>


        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="default" onClick={handleCategoryModalClose} style={{ marginRight: '10px' }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
    </>
  );
};

export default AddStockModal;
