import React, { useState, useEffect } from 'react';
import { Table, Progress, Button, message, Input, Select, Tag } from 'antd';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AddStockModal from './AddStockModal';
import UpdateStockModal from './UpdateStockModal';
import DailyUsageModal from './DailyUsageModal'; 
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InventoryManagement = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); 
  const [isDailyUsageModalOpen, setIsDailyUsageModalOpen] = useState(false); 
  const [stocks, setStocks] = useState([]); 
  const [filteredStocks, setFilteredStocks] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  // const [sortOrder, setSortOrder] = useState("ascend"); 


  const fetchStocks = async () => {
    try {
        const res = await axios.get(`${API_BASE_URL}/stocks/get`, {
            headers: { Authorization: `Bearer ${admin.token}` },
        });

        // Check if the response is valid and contains data
        if (res.data) {
            if (res.data.length > 0) {
                setStocks(res.data);
                setFilteredStocks(res.data);
            } else {
                message.info('No stock details found');
            }
        } else {
            message.info('No stock details found');
        }

    } catch (error) {
        if (!error.response) {
            // Network error or timeout
            message.error('Failed to fetch stock data');
        }
        console.error('Error fetching stock data:', error);
    }
};

const fetchCategories = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/inventorycategories/get`, {
      headers: { Authorization: `Bearer ${admin.token}` },
    });
    if (res.data.categories) {
      setCategories(res.data.categories);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

useEffect(() => {
    fetchStocks();
    fetchCategories();
}, []);


const handleCategoryChange = (value) => {
  setSelectedCategory(value);
  const filteredData = value ? stocks.filter((stock) => stock.category === value) : stocks;
  setFilteredStocks(filteredData);
};

const logUsage = async (itemName, action, qty) => {
  try {
    await axios.post(`${API_BASE_URL}/usage-log/add`, {
      itemName,
      action,
      qty,
      date: new Date().toISOString(),
    }, {
      headers: { Authorization: `Bearer ${admin.token}` },
    });
  } catch (error) {
    console.error('Error logging usage:', error);
  }
};


  // Add Stock API handler
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

  // Update Stock API handler
  const handleUpdateStock = async ({ itemId, additionalStock }) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/stocks/update`,
        { itemId, additionalStock },
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );
      message.success('Stock updated successfully');
      fetchStocks(); // Refresh the stock data
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error(error);
      message.error('Failed to update stock');
    }
  };


  // Daily Usage API handler
  const handleDailyUsage = async (itemId, dailyUsage) => {
    try {
      const selectedStock = stocks.find((item) => item._id === itemId);
      if (!selectedStock) {
        message.error('Invalid stock item selected.');
        return;
      }
  
      await axios.patch(
        `${API_BASE_URL}/stocks/daily-usage`,
        { itemId, dailyUsage }, // Send dailyUsage to the backend
        { headers: { Authorization: `Bearer ${admin.token}` } }
      );
  
      message.success('Daily usage updated successfully');
      fetchStocks(); // Refresh stock data
      setIsDailyUsageModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error updating daily usage:', error);
      message.error('Failed to update daily usage');
    }
  };


    
    const handleViewUsage = () => {
      navigate('/inventory-usage');  // Navigate to InventoryUsage page
    };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filteredData = stocks.filter(stock =>
      stock.itemName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStocks(filteredData);
  };

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
        const lowAlertQty = record.lowAlertQty || 0;
    
        let stockStatus = ''; // Default stock status
        let color = ''; // Color for the status
    
        // Determine the stock status and color based on lowAlertQty and availableStock
        if (availableStock === 0) {
          stockStatus = 'Out of Stock';
          color = 'red';
        } else if (availableStock <= lowAlertQty) {
          stockStatus = 'Low';
          color = 'orange';
        } else {
          stockStatus = 'Sufficient';
          color = 'green';
        }
        return (
          <Tag color={color}>
            {stockStatus}
          </Tag>
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
      render: (text, record) => {
        const availableStock = record.stockQty - record.usedQty;
        const percent = (availableStock / record.stockQty) * 100;
       
        const availableTextColor = percent < 20 ? 'text-red-500' : 'text-black'; // Red if below 20%
  
        return (
          <span className={availableTextColor}>
            {availableStock} {record.quantityType}
          </span>
        );
      },
    },
    {
      title: 'Total Added Stock',
      dataIndex: 'stockQty',
      key: 'stockQty',
      align: 'center',
      render: (stockQty) => `${stockQty}`, // Display the stockQty as total added stock
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-5">
      <Button type="link" className="p-0 text-gray-500 font-semibold" onClick={handleViewUsage}>
        View Usage
      </Button>


        <div className="flex space-x-2">
          <Button
            type="primary"
            className="bg-blue-500 border-blue-500 rounded-full px-5 py-2"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Stock
          </Button>
          <Button
            type="primary"
            className="bg-green-500 border-green-500 rounded-full px-5 py-2"
            onClick={() => setIsUpdateModalOpen(true)}
          >
            Update Stock
          </Button>
          <Button
            type="primary"
            className="bg-yellow-500 border-yellow-500 rounded-full px-5 py-2"
            onClick={() => setIsDailyUsageModalOpen(true)}
          >
            Daily Usage
          </Button>
        </div>
      </div>

      {/* Search and Sort Section */}
      <div className="flex justify-between items-center mb-5">
        <Input
          placeholder="Search by Item Name"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="mr-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
        />
        {/* <Select
          defaultValue={sortOrder}
          onChange={handleSort}
          className="w-36 sm:w-40 md:w-48"
        >
          <Select.Option value="ascend">Sort by Stock (Asc)</Select.Option>
          <Select.Option value="descend">Sort by Stock (Desc)</Select.Option>
        </Select> */}

        {/* Category Filter (Sort) */}
        <Select
          placeholder="Select Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-36 sm:w-40 md:w-48"
        >
          <Select.Option value={null}>All Categories</Select.Option>
          {categories.map((category) => (
            <Select.Option key={category._id} value={category.name}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Add Stock Modal */}
      <AddStockModal
        isModalOpen={isAddModalOpen}
        handleCancel={() => setIsAddModalOpen(false)}
        handleAddStock={handleAddStock}
      />

      {/* Update Stock Modal */}
      <UpdateStockModal
        isModalOpen={isUpdateModalOpen}
        handleCancel={() => setIsUpdateModalOpen(false)}
        handleUpdateStock={handleUpdateStock}
        stocks={stocks}
      />

      {/* Daily Usage Modal */}
      <DailyUsageModal
        isModalOpen={isDailyUsageModalOpen}
        handleCancel={() => setIsDailyUsageModalOpen(false)}
        handleDailyUsage={handleDailyUsage}
        stocks={stocks}
      />

      {/* Displaying No Items Found if no stocks */}
      {filteredStocks.length === 0 ? (
        <div>No items found</div>
      ) : (
        <Table
          dataSource={filteredStocks}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          className="border-collapse w-full"
        />
      )}
    </div>
  );
};

export default InventoryManagement;
