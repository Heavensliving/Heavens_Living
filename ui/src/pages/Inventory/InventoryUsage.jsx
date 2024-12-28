import React, { useState, useEffect } from 'react';
import { Table, message, Tag, Dropdown, Button, Menu, DatePicker, Space } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InventoryUsage = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All Items');
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchUsageLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/stocks/usage-log`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      let allLogs = res.data;

      if (admin.role === 'Property-Admin') {
        allLogs = res.data.filter((log) =>
          log.propertyName.some((logProperty) =>
            admin.properties.some((adminProperty) =>
              logProperty.id === adminProperty.id
            )
          )
        );
      }

      setLogs(allLogs); // Store full data
      setFilteredLogs(allLogs); // Use full data for filtering
    } catch (error) {
      console.error('Error fetching usage logs:', error);
      message.error('Failed to fetch usage logs');
    }
  };

  useEffect(() => {
    fetchUsageLogs();
  }, []);

  const getActionText = (action) => {
    switch (action) {
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
    switch (action) {
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

  const handleFilter = (category) => {
    setFilterCategory(category);
    let filtered = logs;

    if (category !== 'All Items') {
      filtered = logs.filter((log) => getActionText(log.action) === category);
    }

    if (selectedDate) {
      filtered = filtered.filter((log) => {
        const logDate = moment(log.date).format('YYYY-MM-DD');
        return logDate === selectedDate.format('YYYY-MM-DD');
      });
    }

    setFilteredLogs(filtered);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);

    if (date) {
      const filtered = logs.filter((log) => {
        const logDate = moment(log.date).format('YYYY-MM-DD');
        return logDate === date.format('YYYY-MM-DD');
      });

      setFilteredLogs(filtered);
    } else {
      handleFilter(filterCategory);
    }
  };

  const handleClearFilters = () => {
    setFilterCategory('All Items');
    setSelectedDate(null);
    setFilteredLogs(logs);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Inventory Usage Report', 14, 10);

    const tableColumns = ['Sl No', 'Item Name', 'Action', 'Quantity', 'Date'];
    if (admin.role === 'Main-Admin') {
      tableColumns.push('Admin Name');
    }

    const tableRows = filteredLogs.map((log, index) => {
      const row = [
        index + 1,
        log.itemName,
        getActionText(log.action),
        log.qty,
        new Date(log.date).toLocaleString(),
      ];
      if (admin.role === 'Main-Admin') {
        row.push(log.adminName);
      }
      return row;
    });

    doc.autoTable({
      head: [tableColumns],
      body: tableRows,
      startY: 20,
      theme: 'striped',
      headStyles: { fillColor: [100, 100, 255] },
    });

    doc.save('Inventory_Usage_Report.pdf');
  };

  const filterMenu = (
    <Menu>
      {['All Items', 'Daily Usage', 'Stock Update', 'Add Stock'].map((category) => (
        <Menu.Item
          key={category}
          onClick={() => handleFilter(category)}
          style={{ cursor: 'pointer' }}
        >
          {category}
        </Menu.Item>
      ))}
    </Menu>
  );

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
      <div className="flex items-center justify-between mb-2 mt-3">
        <div className="flex items-center ml-3">
          <div className="bg-[#86198f] rounded-full w-2.5 h-2.5 mr-1.5" />
          <span className="text-xs mr-3">Add Stock</span>
          <div className="bg-green-500 rounded-full w-2.5 h-2.5 mx-1" />
          <span className="text-xs mr-3">Update Stock</span>
          <div className="bg-yellow-500 rounded-full w-2.5 h-2.5 mx-1" />
          <span className="text-xs">Daily Usage</span>
        </div>

        <div className="flex items-center mr-3">
          <Button 
            type="primary" 
            onClick={handleDownloadPDF} 
            className="mr-3" 
            disabled={filteredLogs.length === 0}
          >
            Download Report
          </Button>
          <Space>
            <DatePicker
              onChange={handleDateChange}
              value={selectedDate}
              format="YYYY-MM-DD"
              placeholder="Select a Date"
            />
          </Space>

          <Dropdown overlay={filterMenu} placement="bottomRight" className="ml-3">
            <Button type="default">Filter: {filterCategory}</Button>
          </Dropdown>

          <Button type="default" onClick={handleClearFilters} className="ml-3">
            Clear Filters
          </Button>
        </div>
      </div>

      <Table
        dataSource={filteredLogs}
        columns={columns}
        rowKey="_id"
        className="p-4"
        pagination={false}
        locale={{ emptyText: 'No Data Found' }}
      />
    </div>
  );
};

export default InventoryUsage;
