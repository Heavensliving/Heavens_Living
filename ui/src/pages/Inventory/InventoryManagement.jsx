import React, { useState, useEffect } from 'react';
import { Table, Progress, Button, message, Input, Select, Tag, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AddStockModal from './AddStockModal';
import UpdateStockModal from './UpdateStockModal';
import DailyUsageModal from './DailyUsageModal'; 
import EditStockModal from './EditStockModal';
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const navigate = useNavigate();
  // const [sortOrder, setSortOrder] = useState("ascend"); 


const fetchStocks = async () => {
  try {
      const res = await axios.get(`${API_BASE_URL}/stocks/get`, {
          headers: { Authorization: `Bearer ${admin.token}` },
      });

      // Check if the response is valid and contains data
      if (res.data) {
          let filteredData = [];

          // Check admin role and filter accordingly
          if (admin.role === 'Property-Admin') {
              // Filter stocks based on properties match
              filteredData = res.data.filter(stock => {
                  return stock.propertyName.some(stockProperty =>
                      admin.properties.some(adminProperty =>
                          // Ensure comparison is correct (ObjectId or string matching)
                          stockProperty.id === adminProperty.id
                      )
                  );
              });
          } else if (admin.role === 'Main-Admin') {
              // If role is Main-Admin, show all data
              filteredData = res.data;
          }

          if (filteredData.length > 0) {
              setStocks(filteredData);
              setFilteredStocks(filteredData);
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
      const payload = {
        ...values,
        adminName: admin.adminName,
        properties: admin.properties, // Include property names and IDs
      };
  
      await axios.post(`${API_BASE_URL}/stocks/add`, payload, {
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
      const payload = {
        itemId,
        additionalStock,
        adminName: admin.adminName,
        properties: admin.properties, // Include property names and IDs
      };
  
      await axios.patch(`${API_BASE_URL}/stocks/update`, payload, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      message.success('Stock updated successfully');
      fetchStocks();
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
  
      const payload = {
        itemId,
        dailyUsage,
        adminName: admin.adminName,
        properties: admin.properties, // Include property names and IDs
      };
  
      await axios.patch(`${API_BASE_URL}/stocks/daily-usage`, payload, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
  
      message.success('Daily usage updated successfully');
      fetchStocks();
      setIsDailyUsageModalOpen(false);
    } catch (error) {
      console.error('Error updating daily usage:', error);
      message.error('Failed to update daily usage');
    }
  };
  


    
    const handleViewUsage = () => {
      navigate('/inventory-usage');  // Navigate to InventoryUsage page
    };

    const lowStock = () => {
      navigate('/low-stock');  // Navigate to InventoryUsage page
    };

  // Handle search
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filteredData = stocks.filter(stock =>
      stock.itemName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStocks(filteredData);
  };

  // Handle Edit Stock
  const handleEditStock = async (itemId, values) => {
    try {
      const payload = {
        ...values,
        adminName: admin.adminName,
        properties: admin.properties,
      };

      await axios.patch(`${API_BASE_URL}/stocks/edit/${itemId}`, payload, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      message.success('Stock edited successfully');
      fetchStocks();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error editing stock:', error);
      message.error('Failed to edit stock');
    }
  };

  // Handle Delete Stock
  const handleDeleteStock = async (itemId) => {
    try {
      await axios.delete(`${API_BASE_URL}/stocks/delete/${itemId}`, {
        headers: { Authorization: `Bearer ${admin.token}` },
      });
      message.success('Stock deleted successfully');
      fetchStocks();
    } catch (error) {
      console.error('Error deleting stock:', error);
      message.error('Failed to delete stock');
    }
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
        const lowAlertQty = record.lowAlertQty || 0;
  
        // Determine color based on stock level
        const availableTextColor = availableStock <= lowAlertQty ? 'red' : 'black';
  
        return (
          <span style={{ color: availableTextColor }}>
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
    ...(admin.role === 'Main-Admin'
      ? [
          {
            title: 'Property Name',
            key: 'propertyName',
            render: (text, record) => <span>{record.myProperty}</span>,
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
              <span className="space-x-4">
                <Tooltip title="Edit">
                  <EditOutlined
                    className="text-blue-500 text-lg cursor-pointer hover:text-blue-600"
                    onClick={() => {
                      setSelectedStock(record);
                      setIsEditModalOpen(true);
                    }}
                  />
                </Tooltip>
                <Tooltip title="Delete">
                  <Popconfirm
                    title="Are you sure you want to delete this stock?"
                    onConfirm={() => handleDeleteStock(record._id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <DeleteOutlined className="text-red-500 text-lg cursor-pointer hover:text-red-600" />
                  </Popconfirm>
                </Tooltip>
              </span>
            ),
          },
        ]
      : []),
  ];
  
  

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-5">
      <div className="flex items-center space-x-4">
        <Button type="link" className="p-0 text-gray-500 font-semibold" onClick={handleViewUsage}>
          View Usage
        </Button>

        {/* Low Stock button */}
        <Button type="link" className="p-0 text-gray-500 font-semibold" onClick={lowStock}>
          Low Stock
        </Button>
      </div>

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

      {/* Edit Stock Modal - Only show for Main-Admin */}
      {admin.role === 'Main-Admin' && (
        <EditStockModal
          isModalOpen={isEditModalOpen}
          handleCancel={() => {
            setIsEditModalOpen(false);
            setSelectedStock(null);
          }}
          handleEditStock={handleEditStock}
          stockToEdit={selectedStock}
          categories={categories}
        />
      )}

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
