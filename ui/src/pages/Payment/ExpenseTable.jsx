import React, {useEffect, useState} from "react";
import axios from "axios";
import {jsPDF} from "jspdf";
import "jspdf-autotable";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import {useSelector} from "react-redux";
import CheckAuth from "../auth/CheckAuth";
import ImageModal from "../../components/reUsableComponet/ImageModal";
import {
  FaEdit,
  FaSearch,
  FaFilter,
  FaFilePdf,
  FaArrowLeft,
  FaTrash,
} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {getStorage, ref, deleteObject} from "firebase/storage";
import app from "../../firebase";

const storage = getStorage(app);

const ExpenseTable = () => {
  const navigate = useNavigate();
  const admin = useSelector((store) => store.auth.admin);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [goToPage, setGoToPage] = useState("");

  const [searchTerm, setSearchTerm] = useState(
    localStorage.getItem("expenseSearchTerm") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("expenseCategory") || ""
  );
  const [selectedType, setSelectedType] = useState(
    localStorage.getItem("expenseType") || ""
  );
  const [selectedMonth, setSelectedMonth] = useState(
    localStorage.getItem("expenseMonth") || ""
  );
  const [selectedYear, setSelectedYear] = useState(
    localStorage.getItem("expenseYear") || ""
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false); // For mobile filter toggle

  useEffect(() => {
    if (!admin) return;
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/expense/`, {
          headers: {Authorization: `Bearer ${admin.token}`},
        });
        let allExpenses = response.data.expenses.reverse();

        // Filter only if Property-Admin
        if (admin.role === "Property-Admin") {
          const propertyIds = admin.properties.map((p) => p.id);
          allExpenses = allExpenses.filter((exp) =>
            propertyIds.includes(exp.propertyId)
          );
        }

        setExpenses(allExpenses);
      } catch (error) {
        setError("Error fetching expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (expenseId, title, amount, billImg) => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the expense: "${title}" with amount ₹${amount}?`
    );

    if (!isConfirmed) return; // Stop if the user cancels

    try {
      // 🔹 Delete image from Firebase Storage (if exists)
      if (billImg) {
        const fileRef = ref(storage, billImg);
        await deleteObject(fileRef);
        console.log("Expense image deleted from storage.");
      }

      // 🔹 Delete expense from database
      await axios.delete(`${API_BASE_URL}/expense/delete/${expenseId}`);

      // 🔹 Show success message
      toast.success("Expense deleted successfully!", {autoClose: 3000});

      // 🔹 Refresh the page or update state
      window.location.reload(); // Replace with state update if needed
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Error deleting expense. Please try again.");
    }
  };

  const handleRowClick = (expense) => {
    if (expense.billImg) {
      setModalImageSrc(expense.billImg);
    } else {
      setModalImageSrc("No bill available currently.");
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImageSrc("");
  };

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenseSearchTerm", searchTerm);
    localStorage.setItem("expenseCategory", selectedCategory);
    localStorage.setItem("expenseType", selectedType);
    localStorage.setItem("expenseMonth", selectedMonth);
    localStorage.setItem("expenseYear", selectedYear);
  }, [searchTerm, selectedCategory, selectedType, selectedMonth, selectedYear]);

  // Clear all filters (add this function)
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedType("");
    setSelectedMonth("");
    setSelectedYear("");

    // Clear localStorage
    localStorage.removeItem("expenseSearchTerm");
    localStorage.removeItem("expenseCategory");
    localStorage.removeItem("expenseType");
    localStorage.removeItem("expenseMonth");
    localStorage.removeItem("expenseYear");
  };

  // Your existing filter logic remains the same
  const filteredExpenses = expenses.filter((expense) =>
    expense.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Expenses = filteredExpenses.filter((expense) => {
    const date = new Date(expense.date);
    const monthMatches = selectedMonth
      ? date.getMonth() + 1 === parseInt(selectedMonth)
      : true;
    const yearMatches = selectedYear
      ? date.getFullYear() === parseInt(selectedYear)
      : true;
    const categoryMatches = selectedCategory
      ? expense.category === selectedCategory
      : true;
    const typeMatches = selectedType ? expense.type === selectedType : true;

    return monthMatches && yearMatches && categoryMatches && typeMatches;
  });
  const sortedExpenses = [...Expenses].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Calculate total amount and total salary
  const totalAmount = sortedExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const totalSalary = sortedExpenses
    .filter((expense) => expense.category.toLowerCase() === "salary")
    .reduce((total, expense) => total + expense.amount, 0);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Expense Report", 14, 20);
    doc.setFontSize(10);
    doc.text("Date: " + new Date().toLocaleDateString(), 14, 30);

    // Add the table
    doc.autoTable({
      startY: 35,
      head: [
        [
          "#",
          "Title",
          "Type",
          "Category",
          "Payment Method",
          "Amount",
          "Date",
          "Property Name",
          "Transaction ID",
        ],
      ],
      body: sortedExpenses.map((expense, index) => [
        index + 1,
        expense.title,
        expense.type,
        expense.category,
        expense.paymentMethod,
        expense.amount,
        new Date(expense.date).toLocaleDateString(),
        expense.propertyName,
        expense.transactionId,
      ]),
    });

    // Add the total amounts (Total Amount and Total Salary)
    doc.setFontSize(12);
    doc.text(
      `Total Amount: ${totalAmount.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 10
    );
    doc.text(
      `Total Salary: ${totalSalary.toFixed(2)}`,
      14,
      doc.lastAutoTable.finalY + 20
    );

    // Save the PDF
    doc.save("transactions.pdf");
  };

  const totalPages = Math.ceil(sortedExpenses.length / itemsPerPage);
  const paginatedExpenses = sortedExpenses.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="loadingSpinner border-t-2 border-white border-solid rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  // Create arrays for month options
  const months = Array.from({length: 12}, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString("default", {month: "long"}),
  }));

  // Get unique categories from expenses for filtering
  const categories = [...new Set(expenses.map((expense) => expense.category))];
  const types = [...new Set(expenses.map((expense) => expense.type))];

  return (
    <div className="container mx-auto p-2 md:p-6 bg-gray-100 rounded-lg shadow-lg">
      {/* Header with PDF button and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex items-center space-x-4">
          {/* Show back arrow if it's not one of the listed pages */}
          <button
            onClick={() => navigate(-1)} // Navigate one step back
            className="p-2 bg-white rounded-full shadow"
          >
            <FaArrowLeft className="h-6 w-6 text-gray-400" />
          </button>
        </div>

        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>

        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 p-2 md:p-3 bg-side-bar text-white rounded-lg hover:bg-[#373082] transition w-full md:w-auto justify-center"
        >
          <FaFilePdf /> Download PDF
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 p-2 bg-gray-200 rounded-lg hover:bg-gray-300 w-full justify-center"
        >
          <FaFilter /> {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Filters Section - Hidden on mobile unless toggled */}
      <div className={`${showFilters ? "block" : "hidden"} md:block mb-4`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Dropdown */}
          <div>
            <label className="block text-sm md:text-base mb-1">
              Filter by Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm md:text-base mb-1">
              Filter by Type:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">All Types</option>
              {types.map((type, index) => (
                <option key={index} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Month Dropdown */}
          <div>
            <label className="block text-sm md:text-base mb-1">
              Filter by Month:
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div>
            <label className="block text-sm md:text-base mb-1">
              Filter by Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">All Years</option>
              {Array.from({length: 5}, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Total Amount and Total Salary Display */}
      <div className="flex flex-col sm:flex-row justify-between mb-4 gap-2">
        <div className="text-sm sm:text-base font-semibold bg-white p-2 rounded text-center">
          Total Records:{" "}
          <span className="text-gray-700">{sortedExpenses.length}</span>
        </div>
        <div className="text-sm sm:text-base font-semibold bg-white p-2 rounded text-center">
          Total Amount:{" "}
          <span className="text-gray-700">{totalAmount.toFixed(2)}</span>
        </div>
        <div className="text-sm sm:text-base font-semibold bg-white p-2 rounded text-center">
          Total Salary:{" "}
          <span className="text-gray-700">{totalSalary.toFixed(2)}</span>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-300 text-black">
            <tr>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                #
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking- text-center">
                Title
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                Type
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                Category
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                Amt.
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                Date
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                Property
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                Txn ID
              </th>
              <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                Bill
              </th>
              {admin.role === "Main-Admin" && (
                <th className="py-3 px-2 sm:px-4 text-left text-xs sm:text-sm font-medium uppercase tracking-wider text-center">
                  Act.
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center">
            {paginatedExpenses.length > 0 ? (
              paginatedExpenses.map((expense, index) => {
                const defaultImage =
                  "https://jkfenner.com/wp-content/uploads/2019/11/default.jpg";
                return (
                  <tr
                    key={expense._id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="py-2 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm text-center">
                      {(page - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="py-2 px-4 text-xs sm:text-sm flex flex-col">
                      {/* Split Title into lines of 10 characters */}
                      {expense.title
                        .match(/.{1,10}/g) // Splits the title into chunks of 10 characters
                        .map((chunk, index) => (
                          <span key={`title-${index}`}>{chunk}</span>
                        ))}

                      {/* Split Other Reason into lines of 10 characters */}
                      {expense.otherReason && (
                        <span className="text-gray-500 text-xs">
                          {expense.otherReason
                            .match(/.{1,10}/g) // Splits the other reason into chunks of 10 characters
                            .map((chunk, index) => (
                              <span key={`reason-${index}`} className="block">
                                {chunk}
                              </span>
                            ))}
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                      {expense.type}
                    </td>
                    <td className="py-2 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                      {expense.category
                        .match(/.{1,10}/g) // Splits into chunks of 10 characters
                        .map((chunk, index) => (
                          <span key={index} className="block">
                            {chunk}
                          </span> // Displays each chunk on a new line
                        ))}
                    </td>
                    <td className="py-2 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                      {expense.amount}
                    </td>
                    <td className="py-2 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm">
                      {new Date(expense.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-2 px-2 sm:px-4 text-xs sm:text-sm">
                      {expense.propertyName
                        ?.match(/.{1,10}/g) // Splits into chunks of 10 characters
                        .map((chunk, index) => (
                          <span key={`property-${index}`} className="block">
                            {chunk}
                          </span>
                        ))}
                    </td>
                    <td className="py-2 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm flex flex-col">
                      {/* Transaction ID (Truncated to 15 characters) */}
                      <span>
                        {expense.paymentMethod === "Petty Cash" &&
                        expense.pettyCashType === "Cash"
                          ? "-"
                          : (expense.transactionId || "-").slice(0, 15)}
                      </span>

                      {/* Payment Method (Truncated to 15 characters, displayed in smaller gray text) */}
                      <span className="text-gray-500 text-xs">
                        {expense.paymentMethod.slice(0, 15)}
                      </span>
                    </td>
                    <td
                      className={`py-2 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm ${
                        expense.billImg ? "cursor-pointer" : ""
                      }`}
                    >
                      {expense.billImg ? (
                        <img
                          src={isLoading ? defaultImage : expense.billImg}
                          alt="Bill"
                          onLoad={() => setIsLoading(false)}
                          onClick={() => handleRowClick(expense)}
                          className="h-8 w-auto mx-auto"
                        />
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    {/* Conditionally render the Action column only if the user is an Admin */}
                    {admin.role === "Main-Admin" && (
                      <td className="py-2 px-2 sm:px-4 whitespace-nowrap text-xs sm:text-sm flex justify-center space-x-3">
                        {/* Edit Button */}
                        <FaEdit
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          onClick={() =>
                            navigate(`/editExpense/${expense._id}`)
                          }
                        />

                        {/* Delete Button */}
                        <FaTrash
                          className="text-red-600 hover:text-red-800 cursor-pointer"
                          onClick={() =>
                            handleDelete(
                              expense._id,
                              expense.title,
                              expense.amount,
                              expense.billImg
                            )
                          }
                        />
                      </td>
                    )}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="11"
                  className="py-3 px-4 text-center text-sm sm:text-base"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>

        <input
          type="number"
          value={goToPage}
          onChange={(e) => setGoToPage(e.target.value)}
          placeholder="Go to page"
          className="w-20 px-2 py-1 border rounded"
          min="1"
          max={totalPages}
        />
        <button
          onClick={() => {
            const targetPage = parseInt(goToPage);
            if (!isNaN(targetPage)) {
              handlePageChange(targetPage);
              setGoToPage("");
            }
          }}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go
        </button>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageSrc={modalImageSrc}
        altText="&nbsp; No bill available &nbsp;&nbsp;&nbsp;"
      />
    </div>
  );
};

export default CheckAuth(ExpenseTable);
