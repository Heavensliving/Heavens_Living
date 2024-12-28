import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Table, Select, Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Option } = Select;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LowStock = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [stocks, setStocks] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null); // State for selected property
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const navigate = useNavigate();

  // Fetch all stocks from the backend
  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stocks/get`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });

      console.log('Stock data fetched:', response.data);  // Log the response data to check myProperty field

      const stockData = response.data;

      // If the logged-in admin is a Property-Admin, filter based on the property name
      let filteredStockData = stockData;

      if (admin.role === 'Property-Admin') {
        filteredStockData = stockData.filter(stock =>
          stock.propertyName.some(property =>
            admin.properties.some(adminProperty =>
              adminProperty.name === property.name
            )
          )
        );
      }

      // Calculate available stock and filter low stock items
      const lowStockItems = filteredStockData.filter(stock => {
        const availableStock = (stock.stockQty || 0) - (stock.usedQty || 0); // Safety check for undefined or null values
        return availableStock <= (stock.lowAlertQty || 0);
      });

      setStocks(filteredStockData);
      setLowStockItems(lowStockItems);
      setFilteredItems(lowStockItems); // Initialize filtered items with all low stock items
    } catch (error) {
      console.error('Error fetching stock data:', error);
      message.error('Failed to fetch stock data');
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  // Handle category selection and filter items
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterItems(category, searchTerm, selectedProperty);
  };

  // Handle property selection and filter items
  const handlePropertyChange = (property) => {
    setSelectedProperty(property);
    filterItems(selectedCategory, searchTerm, property);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterItems(selectedCategory, value, selectedProperty);
  };

  // Filter items based on category, search term, and property
  const filterItems = (category, searchValue, property) => {
    let filteredData = lowStockItems;

    if (category) {
      filteredData = filteredData.filter(item => item.category === category);
    }

    if (searchValue) {
      filteredData = filteredData.filter(item =>
        item.itemName.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (property) {
      filteredData = filteredData.filter(item =>
        item.propertyName.some(p => p.name === property)
      );
    }

    setFilteredItems(filteredData);
  };

  // Ant Design Table columns
  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'key',
      render: (text, record, index) => index + 1, 
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (text, record) => record.category || 'N/A', // Display category if available
    },
    {
      title: 'Available Stock',
      dataIndex: 'availableStock',
      key: 'availableStock',
      render: (text, record) => {
        const availableStock = (record.stockQty || 0) - (record.usedQty || 0);
        return (
          <span style={{ color: 'red' }}>
            {`${availableStock} ${record.quantityType}`}
          </span>
        );
      },
    },
    ...(admin.role === 'Main-Admin'
      ? [
          {
            title: 'Property Name',
            key: 'propertyName',
            render: (text, record) => <span>{record.myProperty || 'N/A'}</span>, // Ensure it checks for myProperty
          },
        ]
      : []),
  ];

  // Format the data to match Ant Design's table format
  const formattedData = filteredItems.map((item, index) => ({
    key: index + 1, // Sl No.
    itemName: item.itemName,
    stockQty: item.stockQty,
    usedQty: item.usedQty,
    quantityType: item.quantityType,
    category: item.category, // Assuming category is part of the item data
    myProperty: item.myProperty,  // Ensure myProperty is part of the item data
  }));

  // Extract unique categories from the lowStockItems
  const categories = [...new Set(lowStockItems.map(item => item.category))];

  // Extract unique properties from the lowStockItems
  const properties = [...new Set(lowStockItems.flatMap(item => item.propertyName.map(p => p.name)))];

  // Download report as PDF
  const downloadReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text('Heavens Living - Low Stock Report', 14, 20);

    const today = new Date();
    const dateString = today.toLocaleDateString();
    const dayString = today.toLocaleString('en-US', { weekday: 'long' });

    doc.setFontSize(10);
    doc.text(dateString, 170, 20);
    doc.text(dayString, 170, 25);

    const tableColumn = ['Sl No.', 'Item Name', 'Category', 'Available Stock'];
    const tableRows = [];

    formattedData.forEach((item, index) => {
      const availableStock = (item.stockQty || 0) - (item.usedQty || 0);
      const dataRow = [
        index + 1,
        item.itemName,
        item.category || 'N/A',
        `${availableStock} ${item.quantityType}`,
      ];
      tableRows.push(dataRow);
    });

    doc.autoTable({
      startY: 40,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save('low_stock_report.pdf');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {/* Search Field */}
        <Input
          placeholder="Search by Item Name"
          allowClear
          value={searchTerm}
          onChange={handleSearchChange} // Handle search dynamically
          style={{ width: 300 }}
        />
        <div className="flex items-center">
          {/* Download Report Button */}
          <Button type="primary" onClick={downloadReport} style={{ marginRight: 16 }}>
            Download Report
          </Button>

          {/* Property Filter (Select component) for Main-Admin */}
          {admin.role === 'Main-Admin' && (
            <Select
              style={{ width: 200, marginRight: 16 }}
              placeholder="Select Property"
              onChange={handlePropertyChange}
              value={selectedProperty}
            >
              <Option value={null}>All Properties</Option>
              {properties.map((property, index) => (
                <Option key={index} value={property}>
                  {property}
                </Option>
              ))}
            </Select>
          )}

          {/* Category Filter (Select component) */}
          <Select
            style={{ width: 200 }}
            placeholder="Select Category"
            onChange={handleCategoryChange}
            value={selectedCategory}
          >
            <Option value={null}>All Categories</Option>
            {categories.map((category, index) => (
              <Option key={index} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <Table
          columns={columns}
          dataSource={formattedData}
          pagination={false}
          rowKey="key"
        />
      ) : (
        <p className="mt-4">No items are low on stock.</p>
      )}
    </div>
  );
};

export default LowStock;
