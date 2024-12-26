import React, { useState } from 'react';
import { Modal, Form, InputNumber, Select, message, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { Option } = Select;

const UpdateStockModal = ({ isModalOpen, handleCancel, handleUpdateStock, stocks, fetchStocks }) => {
    const admin = useSelector((store) => store.auth.admin);
    const [selectedItem, setSelectedItem] = useState(null); // State for selected item
    const [form] = Form.useForm();

    // Handle item selection
    const handleItemChange = (itemId) => {
        const item = stocks.find((stock) => stock._id === itemId);
        setSelectedItem(item);
        form.setFieldsValue({ itemId }); // Update the form's itemId field
    };

    // Handle form submission
    const onFinish = (values) => {
        if (!selectedItem) {
            message.error('Please select an item to update');
            return;
        }
        handleUpdateStock({ itemId: selectedItem._id, additionalStock: values.additionalStock });
        form.resetFields();
        setSelectedItem(null);
    };

    // Handle delete item action
    const handleDeleteItem = () => {
        Modal.confirm({
            title: 'Are you sure you want to delete this item?',
            okText: 'Yes, delete it',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    // Send a delete request to the server
                    await axios.delete(`${API_BASE_URL}/stocks/delete/${selectedItem._id}`, {
                        headers: { Authorization: `Bearer ${admin.token}` },
                    });
    
                    message.success(`${selectedItem.itemName} has been deleted successfully.`);
    
                    // Reload the page
                    window.location.reload();
    
                    // Close the modal and reset state
                    form.resetFields();
                    setSelectedItem(null);
                    handleCancel(); // Close the modal
                } catch (error) {
                    message.error('Error deleting item. Please try again.');
                    console.log(error);
                }
            },
        });
    };

    
    return (
        <Modal
            title="Update Stock"
            open={isModalOpen}
            onCancel={() => {
                handleCancel();
                form.resetFields();
                setSelectedItem(null);
            }}
            onOk={() => form.submit()}
            okText="Update"
            cancelText="Cancel"
            footer={[
                selectedItem && (
                    <Button
                        key="delete"
                        type="default"
                        icon={<DeleteOutlined />}
                        style={{
                            border: '1px solid red',
                            color: 'red',
                            position: 'absolute',
                            left: '16px',
                            bottom: '16px',
                        }}
                        onClick={handleDeleteItem}
                    >
                        Delete
                    </Button>
                ),
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <Button key="cancel" onClick={() => handleCancel()}>
                        Cancel
                    </Button>
                    <Button key="submit" type="primary" onClick={() => form.submit()} style={{ marginLeft: '10px' }}>
                        Update
                    </Button>
                </div>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    additionalStock: 0,
                }}
            >
                {/* Item Dropdown */}
                <Form.Item
                    label="Select Item"
                    name="itemId"
                    rules={[{ required: true, message: 'Please select an item' }]}
                >
                    <Select
                        placeholder="Select an item"
                        onChange={handleItemChange}
                        value={selectedItem ? selectedItem._id : undefined}
                    >
                        {stocks.map((stock) => (
                            <Option key={stock._id} value={stock._id}>
                                {stock.itemName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Show selected item's available quantity */}
                {selectedItem && (
                    <div style={{ marginBottom: '16px', fontSize: '14px', color: '#555' }}>
                        <strong>Available Quantity:</strong> {selectedItem.stockQty - selectedItem.usedQty}{' '}
                        {selectedItem.quantityType}
                    </div>
                )}

                {/* Input for additional stock */}
                <Form.Item
                    label="Add Stock Quantity"
                    name="additionalStock"
                    rules={[
                        { required: true, message: 'Please enter the quantity to add' },
                        { type: 'number', min: 1, message: 'Quantity must be at least 1' },
                    ]}
                >
                    <InputNumber min={1} style={{ width: '100%' }} placeholder="Enter quantity to add" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateStockModal;
