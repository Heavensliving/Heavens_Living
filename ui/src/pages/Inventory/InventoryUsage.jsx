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

      // Filter logs based on the admin's role
      let filteredLogs = res.data;

      if (admin.role === 'Property-Admin') {
        // Only show logs that match the propertyName of the logged-in admin
        filteredLogs = res.data.filter(log =>
          log.propertyName.some(logProperty =>
            admin.properties.some(adminProperty =>
              logProperty.id === adminProperty.id // Match based on property ID
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
        return 'Daily Usage'; // Display 'Daily Usage' for 'update daily usage'
      case 'update stock':
        return 'Stock Update'; // Display 'Stock Update' for 'update stock'
      case 'add stock':
        return 'Add Stock'; // Display 'Add Stock' for 'add stock'
      default:
        return action; // Default to original text
    }
  };

  const getActionColor = (action) => {
    switch(action) {
      case 'update daily usage':
        return 'gold'; // Yellow color for 'update daily usage'
      case 'update stock':
        return 'green'; // Green color for 'update stock'
      case 'add stock':
        return 'magenta'; // Magenta color for 'add stock'
      default:
        return ''; // Default color
    }
  };

  const columns = [
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

  // If the logged-in admin is a "Main-Admin", add the "Admin Name" column
  if (admin.role === 'Main-Admin') {
    columns.push({
      title: 'Admin Name',
      dataIndex: 'adminName',
      key: 'adminName',
    });
  }

  return (
    <div>
      <Table dataSource={logs} columns={columns} rowKey="_id" />
    </div>
  );
};

export default InventoryUsage;
