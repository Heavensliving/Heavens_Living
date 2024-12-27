import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message, Table, Select, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import jsPDF from 'jspdf';  // Import jsPDF

const { Option } = Select;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LowStock = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [stocks, setStocks] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Fetch all stocks from the backend
  const fetchStocks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stocks/get`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });

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
    if (category) {
      const filteredData = lowStockItems.filter(item => item.category === category);
      setFilteredItems(filteredData);
    } else {
      setFilteredItems(lowStockItems); // Show all items if no category is selected
    }
  };

  // Ant Design Table columns
  const columns = [
    {
      title: 'Sl No.',
      dataIndex: 'key',
      render: (text, record, index) => index + 1, // Render the serial number based on index
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Category', // Added Category column
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
        // Return available stock with red color if the stock is low
        return (
          <span style={{ color: 'red' }}>
            {`${availableStock} ${record.quantityType}`}
          </span>
        );
      },
    },
  ];

  // Format the data to match Ant Design's table format
  const formattedData = filteredItems.map((item, index) => ({
    key: index + 1, // Sl No.
    itemName: item.itemName,
    stockQty: item.stockQty,
    usedQty: item.usedQty,
    quantityType: item.quantityType,
    category: item.category, // Assuming category is part of the item data
  }));

  // Extract unique categories from the lowStockItems
  const categories = [...new Set(lowStockItems.map(item => item.category))];

  // Download report as PDF
  const downloadReport = () => {
    const doc = new jsPDF();
    
    // Add Heading aligned to the left
    doc.setFontSize(16); // Set font size for the heading
    doc.text('Heavens Living - Low Stock Report', 14, 20); // Position the heading at coordinates (14, 20)
  
    // Get today's date and day
    const today = new Date();
    const dateString = today.toLocaleDateString(); // e.g., "12/27/2024"
    const dayString = today.toLocaleString('en-US', { weekday: 'long' }); // e.g., "Thursday"
  
    // Add the date and day to the right end
    doc.setFontSize(10); // Set font size for the date and day
    doc.text(dateString, 170, 20); // Position date at coordinates (170, 20) (right-aligned)
    doc.text(dayString, 170, 25); // Position day just below the date at coordinates (170, 30)
  
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
  
    // Add the table below the heading
    doc.autoTable({
      startY: 40,  // Start the table below the heading and date (adjust as needed)
      head: [tableColumn],
      body: tableRows,
    });
  
    // Save the PDF with the name "low_stock_report.pdf"
    doc.save('low_stock_report.pdf');
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-end items-center mb-4">
        {/* Download Report Button */}
        <Button type="primary" onClick={downloadReport} style={{ marginRight: 16 }}>
          Download Report
        </Button>
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

      {filteredItems.length > 0 ? (
        <Table
          columns={columns}
          dataSource={formattedData}
          pagination={false} // Disable pagination
          rowKey="key"
        />
      ) : (
        <p className="mt-4">No items are low on stock.</p>
      )}
    </div>
  );
};

export default LowStock;
