import { useState, useEffect } from 'react';
import { FaHamburger, FaArrowLeft, FaTrash, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config';
import ConfirmationModal from '../../components/reUsableComponet/ConfirmationModal';
import { useSelector } from 'react-redux';

function AddOns() {
  const admin = useSelector(store => store.auth.admin);
  const [isToggled, setIsToggled] = useState({}); // To manage toggle states
  const [products, setProducts] = useState([]); // To store fetched products
  const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal
  const [productToDelete, setProductToDelete] = useState(null); // State to hold the product ID to delete
  const navigate = useNavigate(); // For navigation

  // Fetching add-ons on component mount
  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/adOn`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        setProducts(response.data);
        const initialToggledState = {};
        response.data.forEach((product) => {
          initialToggledState[product._id] = product.status === 'available'; // Set toggle based on product status
        });
        setIsToggled(initialToggledState);
      } catch (error) {
        console.error('Error fetching add-ons:', error);
      }
    };

    fetchAddOns();
  }, []);

  // Handle toggle of product status
  const handleToggle = async (productId, currentStatus) => {
    const newStatus = currentStatus ? 'unavailable' : 'available';

    try {
      await axios.put(`${API_BASE_URL}/adOn/${productId}/status`, 
        {status: newStatus},
        {headers: { 'Authorization': `Bearer ${admin.token}` }},
      );

      setIsToggled((prevState) => ({
        ...prevState,
        [productId]: !currentStatus,
      }));
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    if (!productToDelete) return; // Exit if no product is selected

    try {
      const response = await axios.delete(`${API_BASE_URL}/adOn/${productToDelete}`,
        {headers: { 'Authorization': `Bearer ${admin.token}` }}
      );

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productToDelete)
        );
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setIsModalOpen(false); // Close the modal
      setProductToDelete(null); // Reset the product to delete
    }
  };

  // Open confirmation modal for deletion
  const openDeleteModal = (productId) => {
    setProductToDelete(productId); // Set the product ID to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  // Handle product edit
  const handleEdit = (productId) => {
    navigate(`/update-addOn/${productId}`); // Navigate to edit page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 p-6">
      <div className="flex justify-between">

        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-semibold ml-4">Available Menu</h2>
        </div>

        <button onClick={() => navigate('/addOns-item')} className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full w-32 flex items-center justify-center space-x-2">
          <FaHamburger size={16} />
          <span>Add Item</span>
        </button>

      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-8">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-300"
            style={{ width: '160px', height: '220px' }}
          >
            <img
              src={product.image}
              alt={product.Itemname}
              className="h-28 w-full object-cover rounded-md mb-2"
            />
            <div className="flex justify-between items-center mb-2">
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold">{product.Itemname}</h3>
                <span className="text-red-600 text-lg font-bold">₹{product.prize}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                className={`${isToggled[product._id] ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded-full text-xs`}
                onClick={() => handleToggle(product._id, isToggled[product._id])}
              >
                {isToggled[product._id] ? 'Added' : 'Add'}
              </button>

              <button
                className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs"
                onClick={() => handleEdit(product._id)}
              >
                <FaEdit size={12} />
              </button>

              {/* Change delete button to open modal */}
              <button
                className="bg-red-500 text-white px-2 py-1 rounded-full text-xs"
                onClick={() => openDeleteModal(product._id)}
              >
                <FaTrash size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal for deletion */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close the modal
        onConfirm={handleDelete} // Confirm delete action
        title="Confirm Deletion"
        message="Are you sure you want to delete this add-on?"
        confirmLabel="Delete"
      />
    </div>
  );
}

export default AddOns;
