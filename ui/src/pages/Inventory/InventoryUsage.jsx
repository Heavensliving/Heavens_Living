import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InventoryUsage = () => {
  const [usageLogs, setUsageLogs] = useState([]);

  const fetchUsageLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/usage-log/get`);
      if (res.data) {
        setUsageLogs(res.data);
      }
    } catch (error) {
      console.error('Error fetching usage logs:', error);
    }
  };

  useEffect(() => {
    fetchUsageLogs();
  }, []);

  const columns = [
    {
      title: 'Sl. No',
      key: 'slNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Added Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
  ];

  return (
    <div className="p-4">
      <Table
        dataSource={usageLogs}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default InventoryUsage;
