import React, { useState, useEffect } from 'react';
import { Table, Progress, Button, message } from 'antd';
import axios from 'axios';
import AddStockModal from './AddStockModal';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InventoryManagement = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // For Add Stock modal
  const [stocks, setStocks] = useState([]);

  const fetchStocks = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/stocks/get`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      if (res.data && res.data.length > 0) {
        setStocks(res.data);
      } else {
        message.info('No stock details found');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      message.error('Failed to fetch stock data');
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const columns = [
    {
      title: 'Sl. No',
      key: 'slNo',
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Stock Level',
      dataIndex: 'stockQty',
      key: 'stockQty',
      render: (stockQty, record) => {
        const availableStock = record.stockQty - record.usedQty;
        const percent = (availableStock / record.stockQty) * 100;
        return (
          <Progress
            percent={percent}
            status="active"
            strokeColor="#52c41a"
            format={() => `${percent.toFixed(0)}%`}
          />
        );
      },
    },
    {
      title: 'Used Qty',
      dataIndex: 'usedQty',
      key: 'usedQty',
      align: 'center',
      render: (usedQty, record) => `${usedQty} ${record.quantityType}`,
    },
    {
      title: 'Available Stock',
      key: 'availableStock',
      align: 'center',
      render: (text, record) => `${record.stockQty - record.usedQty} ${record.quantityType}`,
    },
    {
      title: 'Total Added Stock',
      dataIndex: 'stockQty',
      key: 'stockQty',
      align: 'center',
      render: (stockQty) => `${stockQty}`, // Display the stockQty as total added stock
    },
  ];

  const handleAddStock = async (values) => {
    try {
      await axios.post(`${API_BASE_URL}/stocks/add`, values, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      message.success('Stock added successfully');
      fetchStocks();
      setIsAddModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error('Failed to add stock');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Button type="link" style={{ padding: 0, color: 'grey', fontWeight: 'bold' }}>
          Download Report
        </Button>

        <div>
          <Button
            type="primary"
            style={{
              marginRight: '10px',
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              borderRadius: '20px',
            }}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Stock
          </Button>
          <Button
            type="primary"
            style={{
              marginRight: '10px',
              backgroundColor: '#52c41a',
              borderColor: '#52c41a',
              borderRadius: '20px',
            }}
          >
            Update Stock
          </Button>
          <Button
            type="primary"
            style={{
              backgroundColor: '#faad14',
              borderColor: '#faad14',
              borderRadius: '20px',
            }}
          >
            Daily Usage
          </Button>
        </div>
      </div>

      <AddStockModal
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleAddStock={handleAddStock}
      />

      <Table
        dataSource={stocks}
        columns={columns}
        pagination={{ pageSize: 5 }}
        bordered
        style={{ marginTop: '20px' }}
      />
    </div>
  );
};

export default InventoryManagement;
