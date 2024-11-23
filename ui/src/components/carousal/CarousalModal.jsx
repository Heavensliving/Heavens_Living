import { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';
import { FaTimes, FaPlus } from 'react-icons/fa'; // Import close and add icons

const CarousalModal = ({ isOpen, onClose }) => {
  const [cafeImages, setCafeImages] = useState(['']); // Start with one input field
  const [homeScreenImages, setHomeScreenImages] = useState(['']); // Start with one input field
  const [carousals, setCarousals] = useState([]);
  const [selectedCarousal, setSelectedCarousal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchCarousals();
    }
  }, [isOpen]);

  const fetchCarousals = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/carousal`);
      setCarousals(response.data);
    } catch (err) {
      setError('Error fetching carousals');
    }
  };

  const handleAddCarousal = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/carousal/addCarousal`, {
        cafeImages,
        homeScreenImages,
      });
      setCarousals([...carousals, response.data.carousal]);
      resetFields();
    } catch (err) {
      setError('Error adding carousal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCarousal = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/carousal/updateCarousal/${id}`, {
        cafeImages,
        homeScreenImages,
      });
      setCarousals(carousals.map(carousal => (carousal._id === id ? response.data.updatedCarousal : carousal)));
      resetFields();
    } catch (err) {
      setError('Error updating carousal');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCarousal = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/carousal/deleteCarousal/${id}`);
      setCarousals(carousals.filter(carousal => carousal._id !== id));
    } catch (err) {
      setError('Error deleting carousal');
    } finally {
      setLoading(false);
    }
  };

  const resetFields = () => {
    setCafeImages(['']); // Reset to one input field
    setHomeScreenImages(['']); // Reset to one input field
    setSelectedCarousal(null);
  };

  const addCafeImageField = () => {
    setCafeImages([...cafeImages, '']); // Add a new empty field
  };

  const addHomeScreenImageField = () => {
    setHomeScreenImages([...homeScreenImages, '']); // Add a new empty field
  };

  const handleCafeImageChange = (index, value) => {
    const updatedImages = [...cafeImages];
    updatedImages[index] = value;
    setCafeImages(updatedImages);
  };

  const handleHomeScreenImageChange = (index, value) => {
    const updatedImages = [...homeScreenImages];
    updatedImages[index] = value;
    setHomeScreenImages(updatedImages);
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-4 rounded-lg shadow-lg w-1/3 max-h-[80vh] overflow-y-auto relative">
          <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
            <FaTimes className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-bold mb-4">Manage Carousals</h2>
          {error && <p className="text-red-500">{error}</p>}

          {/* Existing Carousals Section */}
          {carousals.length > 0 && (
            <div className="mb-4">
              <h3 className="font-bold">Existing Carousals:</h3>
              <div className="mt-2">
                {carousals.map(carousal => (
                  <div key={carousal._id} className="mb-4">
                    {carousal.cafeImages.length > 0 && (
                      <>
                        <h4 className="font-semibold">Cafe Carousal:</h4>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex flex-wrap">
                            {carousal.cafeImages.map((url, index) => (
                              url && ( // Only render if the URL is not empty
                                <img key={index} src={url} alt={`Existing Cafe Image ${index + 1}`} className="w-24 h-24 object-cover m-1 border" />
                              )
                            ))}
                          </div>
                          <button onClick={() => handleDeleteCarousal(carousal._id)} className="text-red-500">Delete</button>
                          <button onClick={() => {
                            setSelectedCarousal(carousal);
                            setCafeImages(carousal.cafeImages);
                            setHomeScreenImages(carousal.homeScreenImages);
                          }} className="text-blue-500">Edit</button>
                        </div>
                      </>
                    )}
                    {carousal.homeScreenImages.length > 0 && (
                      <>
                        <h4 className="font-semibold">Home Screen Carousal:</h4>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex flex-wrap">
                            {carousal.homeScreenImages.map((url, index) => (
                              url && ( // Only render if the URL is not empty
                                <img key={index} src={url} alt={`Existing Home Screen Image ${index + 1}`} className="w-24 h-24 object-cover m-1 border" />
                              )
                            ))}
                          </div>
                          <button onClick={() => handleDeleteCarousal(carousal._id)} className="text-red-500">Delete</button>
                          <button onClick={() => {
                            setSelectedCarousal(carousal);
                            setCafeImages(carousal.cafeImages);
                            setHomeScreenImages(carousal.homeScreenImages);
                          }} className="text-blue-500">Edit</button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label>Cafe Images:</label>
            {cafeImages.map((url, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleCafeImageChange(index, e.target.value)}
                  className="border p-2 w-full"
                />
                <button type="button" onClick={addCafeImageField} className="ml-2 text-blue-500">
                  <FaPlus />
                </button>
              </div>
            ))}
            <label>Home Screen Images:</label>
            {homeScreenImages.map((url, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleHomeScreenImageChange(index, e.target.value)}
                  className="border p-2 w-full"
                />
                <button type="button" onClick={addHomeScreenImageField} className="ml-2 text-blue-500">
                  <FaPlus />
                </button>
              </div>
            ))}
          </div>

          {/* Preview of Cafe Images */}
          {cafeImages.some(url => url) && ( // Only show if there is at least one non-empty URL
            <>
              <h3 className="font-bold mt-4">Cafe Images Preview:</h3>
              <div className="flex flex-wrap">
                {cafeImages.map((url, index) => (
                  url && ( // Only render if the URL is not empty
                    <img key={index} src={url} alt={`Cafe Image ${index + 1}`} className="w-24 h-24 object-cover m-1 border" />
                  )
                ))}
              </div>
            </>
          )}

          {/* Preview of Home Screen Images */}
          {homeScreenImages.some(url => url) && ( // Only show if there is at least one non-empty URL
            <>
              <h3 className="font-bold mt-4">Home Screen Images Preview:</h3>
              <div className="flex flex-wrap">
                {homeScreenImages.map((url, index) => (
                  url && ( // Only render if the URL is not empty
                    <img key={index} src={url} alt={`Home Screen Image ${index + 1}`} className="w-24 h-24 object-cover m-1 border" />
                  )
                ))}
              </div>
            </>
          )}

          <button onClick={handleAddCarousal} className="bg-blue-500 text-white p-2 rounded mr-2">
            Add Carousal
          </button>
          {selectedCarousal && (
            <button onClick={() => handleUpdateCarousal(selectedCarousal._id)} className="bg-yellow-500 text-white p-2 rounded">
              Update Carousal
            </button>
          )}
          <button onClick={onClose} className="bg-gray-300 text-black p-2 rounded ml-2">
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default CarousalModal;