// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaEdit, FaTrash } from 'react-icons/fa';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { jsPDF } from 'jspdf';
// import { Table, Input, Button, Modal, Space } from 'antd';
// import ConfirmationModal from "../../components/reUsableComponet/ConfirmationModal";
// import { DatePicker } from 'antd';

// const { Column } = Table;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const InvestmentsTable = () => {
//   const [investments, setInvestments] = useState([]);
//   const [filteredInvestments, setFilteredInvestments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterDate, setFilterDate] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [investmentToDelete, setInvestmentToDelete] = useState(null);
//   const navigate = useNavigate();
//   const admin = useSelector((state) => state.auth.admin);

//   useEffect(() => {
//     const fetchInvestments = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/investment`, {
//           headers: { 'Authorization': `Bearer ${admin?.token}` },
//         });
//         setInvestments(response.data.data);
//         setFilteredInvestments(response.data.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch investments');
//         setLoading(false);
//       }
//     };

//     fetchInvestments();
//   }, [admin]);

//   useEffect(() => {
//     let updatedInvestments = investments;

//     if (searchTerm) {
//       updatedInvestments = updatedInvestments.filter(investment =>
//         investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         investment.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     if (filterDate) {
//       const filterDateObj = new Date(filterDate);
//       updatedInvestments = updatedInvestments.filter(investment => {
//         const investmentDate = new Date(investment.createdAt);
//         return (
//           investmentDate.getDate() === filterDateObj.getDate() &&
//           investmentDate.getMonth() === filterDateObj.getMonth() &&
//           investmentDate.getFullYear() === filterDateObj.getFullYear()
//         );
//       });
//     }

//     setFilteredInvestments(updatedInvestments);
//   }, [searchTerm, filterDate, investments]);

//   const handleDelete = async () => {
//     if (investmentToDelete) {
//       try {
//         await axios.delete(`${API_BASE_URL}/investment/delete/${investmentToDelete}`, {
//           headers: { 'Authorization': `Bearer ${admin?.token}` },
//         });
//         setInvestments(investments.filter(investment => investment._id !== investmentToDelete));
//         setIsModalOpen(false);
//       } catch (err) {
//         setError('Failed to delete investment');
//       }
//     }
//   };

//   const openModal = (id) => {
//     setInvestmentToDelete(id);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setInvestmentToDelete(null);
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(18);
//     doc.text("Investment Table", 14, 16);

//     const tableColumn = ["#", "Investment Name", "Property Name", "Investment Type", "Amount Invested", "Investment Date"];
//     const tableRows = filteredInvestments.map((investment, index) => [
//       index + 1,
//       investment.name,
//       investment.propertyName,
//       investment.type,
//       `$${investment.amount}`,
//       new Date(investment.createdAt).toLocaleDateString('en-GB'),
//     ]);

//     // Calculate total amount invested
//     const totalAmount = filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0);
//     doc.text(`Total Amount Invested: $${totalAmount}`, 14, 270);

//     // Table generation
//     doc.autoTable({
//       startY: 30,
//       head: [tableColumn],
//       body: tableRows,
//     });

//     doc.save("investment_table.pdf");
//   };

//   if (loading) return <div className="text-center py-4">Loading...</div>;
//   if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

//   return (
//     <div className="p-4 bg-gray-50">
//       <ConfirmationModal 
//         isOpen={isModalOpen} 
//         onClose={closeModal} 
//         onConfirm={handleDelete} 
//         confirmLabel="Delete"
//         message="Are you sure you want to delete this investment?" 
//       />
//       <div className="flex justify-between mb-4">
//         <Space>
//           <Input
//             placeholder="Search by name or property..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <DatePicker
//             onChange={(date, dateString) => setFilterDate(dateString)}
//             value={filterDate ? moment(filterDate, 'YYYY-MM-DD') : null}
//           />
//         </Space>
//         <div>
//           <Button
//             type="primary"
//             onClick={() => navigate("/addInvestment")}
//             style={{ marginRight: 8 }}
//           >
//             Add New
//           </Button>
//           <Button
//             type="default"
//             onClick={downloadPDF}
//           >
//             Download PDF
//           </Button>
//         </div>
//       </div>
//       <Table
//         dataSource={filteredInvestments}
//         rowKey="_id"
//         loading={loading}
//         pagination={false}
//       >
//         <Column title="#" dataIndex="index" render={(text, record, index) => index + 1} />
//         <Column title="Investment Name" dataIndex="name" />
//         <Column title="Property Name" dataIndex="propertyName" />
//         <Column title="Investment Type" dataIndex="type" />
//         <Column title="Amount Invested" dataIndex="amount" render={amount => `$${amount}`} />
//         <Column 
//           title="Investment Date" 
//           dataIndex="createdAt" 
//           render={createdAt => new Date(createdAt).toLocaleDateString()} 
//         />
//         <Column 
//           title="Action"
//           render={(text, record) => (
//             <Space size="middle">
//               <Button
//                 type="link"
//                 icon={<FaEdit />}
//                 onClick={() => navigate(`/editInvestment/${record._id}`)}
//               />
//               <Button
//                 type="link"
//                 icon={<FaTrash />}
//                 onClick={() => openModal(record._id)}
//                 danger
//               />
//             </Space>
//           )}
//         />
//       </Table>
//     </div>
//   );
// };

// export default InvestmentsTable;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { Table, Input, Button, Modal, Space } from 'antd';
import ConfirmationModal from "../../components/reUsableComponet/ConfirmationModal";
import { DatePicker } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Column } = Table;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const InvestmentsTable = () => {
  const [investments, setInvestments] = useState([]);
  const [filteredInvestments, setFilteredInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [totalExpense, setTotalExpense] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState(null);
  const navigate = useNavigate();
  const admin = useSelector((state) => state.auth.admin);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/investment`, {
          headers: { 'Authorization': `Bearer ${admin?.token}` },
        });
        setInvestments(response.data.data);
        setFilteredInvestments(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch investments');
        setLoading(false);
      }
    };

    const fetchTotalExpense = async () => {
      if (!admin) return;
      try {
        const expenseResponse = await axios.get(
          `${API_BASE_URL}/expense/totalexpense`,
          { headers: { Authorization: `Bearer ${admin.token}` } }
        );
        setTotalExpense(expenseResponse.data.totalAmount);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching total expense:", error);
      }
    };

    fetchInvestments();
    fetchTotalExpense();
  }, [admin]);

  useEffect(() => {
    let updatedInvestments = investments;

    if (searchTerm) {
      updatedInvestments = updatedInvestments.filter(investment =>
        investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investment.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      updatedInvestments = updatedInvestments.filter(investment => {
        const investmentDate = new Date(investment.createdAt);
        return (
          investmentDate.getDate() === filterDateObj.getDate() &&
          investmentDate.getMonth() === filterDateObj.getMonth() &&
          investmentDate.getFullYear() === filterDateObj.getFullYear()
        );
      });
    }

    setFilteredInvestments(updatedInvestments);
  }, [searchTerm, filterDate, investments]);

  const handleDelete = async () => {
    if (investmentToDelete) {
      try {
        await axios.delete(`${API_BASE_URL}/investment/delete/${investmentToDelete}`, {
          headers: { 'Authorization': `Bearer ${admin?.token}` },
        });
        setInvestments(investments.filter(investment => investment._id !== investmentToDelete));
        setIsModalOpen(false);
      } catch (err) {
        setError('Failed to delete investment');
      }
    }
  };

  const openModal = (id) => {
    setInvestmentToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setInvestmentToDelete(null);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Investment Table", 14, 16);

    const tableColumn = ["#", "Investment Name", "Property Name", "Investment Type", "Amount Invested", "Investment Date"];
    const tableRows = filteredInvestments.map((investment, index) => [
      index + 1,
      investment.name,
      investment.propertyName,
      investment.type,
      `$${investment.amount}`,
      new Date(investment.createdAt).toLocaleDateString('en-GB'),
    ]);

    // Calculate total amount invested
    const totalAmount = filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0);
    doc.text(`Total Amount Invested: $${totalAmount}`, 14, 270);

    // Table generation
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
    });

    doc.save("investment_table.pdf");
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  // Calculate total investment
  const totalInvestment = filteredInvestments.reduce((sum, investment) => sum + investment.amount, 0);

  // Data for PieChart
  const pieData = [
    { name: 'Total Investment', value: totalInvestment },
    { name: 'Total Expense', value: totalExpense },
  ];

  return (
    <div className="p-4 bg-gray-50">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        confirmLabel="Delete"
        message="Are you sure you want to delete this investment?"
      /><div className="flex justify-between mb-4">
        <Space>
          <Input
            placeholder="Search by name or property..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DatePicker
            onChange={(date, dateString) => setFilterDate(dateString)}
            value={filterDate ? moment(filterDate, 'YYYY-MM-DD') : null}
          />
        </Space>
        <div>
          <Button
            type="primary"
            onClick={() => navigate("/addInvestment")}
            style={{ marginRight: 8 }}
          >
            Add New
          </Button>
          <Button
            type="default"
            onClick={downloadPDF}
          >
            Download PDF
          </Button>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between">
  <ResponsiveContainer width="40%" height={300}>
    <PieChart>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={100}
        fill="#8884d8"
      >
        {pieData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#82ca9d" : "#8884d8"} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ResponsiveContainer>

  <div className="ml-6 w-1/2">
    <h3 className="text-lg font-semibold text-left mb-2 underline">Financial Overview</h3>
    <p className="mb-2">
      <strong>Total Investment:</strong> ${totalInvestment}
    </p>
    <p className="mb-2">
      <strong>Total Expense:</strong> ${totalExpense}
    </p>
    <p className={`font-semibold ${totalInvestment >= totalExpense ? 'text-green-500' : 'text-red-500'}`}>
      {totalInvestment >= totalExpense
        ? `Profit: $${(totalInvestment - totalExpense).toFixed(2)}`
        : `Loss: $${(totalExpense - totalInvestment).toFixed(2)}`}
    </p>
  </div>
</div>




      <Table
        dataSource={filteredInvestments}
        rowKey="_id"
        loading={loading}
        pagination={false}
      >
        <Column title="#" dataIndex="index" render={(text, record, index) => index + 1} />
        <Column title="Investment Name" dataIndex="name" />
        <Column title="Property Name" dataIndex="propertyName" />
        <Column title="Investment Type" dataIndex="type" />
        <Column title="Amount Invested" dataIndex="amount" render={amount => `$${amount}`} />
        <Column
          title="Investment Date"
          dataIndex="createdAt"
          render={createdAt => new Date(createdAt).toLocaleDateString()}
        />
        <Column
          title="Action"
          render={(text, record) => (
            <Space size="middle">
              <Button
                type="link"
                icon={<FaEdit />}
                onClick={() => navigate(`/editInvestment/${record._id}`)}
              />
              <Button
                type="link"
                icon={<FaTrash />}
                onClick={() => openModal(record._id)}
                danger
              />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default InvestmentsTable;
