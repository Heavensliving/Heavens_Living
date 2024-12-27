import React, { useState, useEffect } from 'react';
import { Table, message, Tag } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InventoryUsage = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [logs, setLogs] = useState([]);

  const fetchUsageLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/stocks/usage-log`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      let filteredLogs = res.data;

      if (admin.role === 'Property-Admin') {
        filteredLogs = res.data.filter(log =>
          log.propertyName.some(logProperty =>
            admin.properties.some(adminProperty =>
              logProperty.id === adminProperty.id
            )
          )
        );
      }

      setLogs(filteredLogs);
    } catch (error) {
      console.error('Error fetching usage logs:', error);
      message.error('Failed to fetch usage logs');
    }
  };

  useEffect(() => {
    fetchUsageLogs();
  }, []);

  const getActionText = (action) => {
    switch(action) {
      case 'update daily usage':
        return 'Daily Usage';
      case 'update stock':
        return 'Stock Update';
      case 'add stock':
        return 'Add Stock';
      default:
        return action;
    }
  };

  const getActionColor = (action) => {
    switch(action) {
      case 'update daily usage':
        return 'gold';
      case 'update stock':
        return 'green';
      case 'add stock':
        return 'magenta';
      default:
        return '';
    }
  };

  const columns = [
    {
      title: 'Sl No',
      dataIndex: 'slNo',
      key: 'slNo',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={getActionColor(action)}>{getActionText(action)}</Tag>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'qty',
      key: 'qty',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  if (admin.role === 'Main-Admin') {
    columns.push({
      title: 'Admin Name',
      dataIndex: 'adminName',
      key: 'adminName',
    });
  }

  return (
    <div>
      {/* Add dots and text */}
      <div className="mb-2 flex items-center mt-3 ml-3">
      <div className="bg-[#86198f] rounded-full w-2.5 h-2.5 mr-1.5" />
      <span className="text-xs mr-3">Add Stock</span>
      <div className="bg-green-500 rounded-full w-2.5 h-2.5 mx-1" />
      <span className="text-xs mr-3">Update Stock</span>
      <div className="bg-yellow-500 rounded-full w-2.5 h-2.5 mx-1" />
      <span className="text-xs">Daily Usage</span>
    </div>


      {/* Table */}
      <Table dataSource={logs} columns={columns} rowKey="_id" className="p-4" />
    </div>
  );
};

export default InventoryUsage;
