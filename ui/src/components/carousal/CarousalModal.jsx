/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageInput } from './ImageInput';
import { ImagePreview } from './ImagePreview';
import { CarouselList } from './CarouselList';
import API_BASE_URL from '../../config';
import { IoCloseCircleOutline } from "react-icons/io5";

export const CarouselModal = ({ isOpen, onClose }) => {
  const [carousels, setCarousels] = useState([]);
  const [cafeImages, setCafeImages] = useState(['']);
  const [homeScreenImages, setHomeScreenImages] = useState(['']);
  const [selectedCarousel, setSelectedCarousel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewCafeImages, setPreviewCafeImages] = useState([]);
  const [previewHomeScreenImages, setPreviewHomeScreenImages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchCarousels();
    }
  }, [isOpen]);

  // Update preview images when selected carousel or input images change
  useEffect(() => {
    if (selectedCarousel) {
      // Initialize preview with existing images
      setPreviewCafeImages(selectedCarousel.cafeImages);
      setPreviewHomeScreenImages(selectedCarousel.homeScreenImages);
    } else {
      setPreviewCafeImages([]);
      setPreviewHomeScreenImages([]);
    }
  }, [selectedCarousel]);

  const fetchCarousels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/carousal`);
      setCarousels(response.data);
    } catch (error) {
      toast.error('Failed to fetch carousels');
    }
  };

  const handleCafeImagesChange = (newUrls) => {
    setCafeImages(newUrls);
    // Update preview by combining existing and new images
    const validNewUrls = newUrls.filter(Boolean);
    if (selectedCarousel) {
      setPreviewCafeImages([...selectedCarousel.cafeImages, ...validNewUrls]);
    } else {
      setPreviewCafeImages(validNewUrls);
    }
  };

  const handleHomeScreenImagesChange = (newUrls) => {
    setHomeScreenImages(newUrls);
    // Update preview by combining existing and new images
    const validNewUrls = newUrls.filter(Boolean);
    if (selectedCarousel) {
      setPreviewHomeScreenImages([...selectedCarousel.homeScreenImages, ...validNewUrls]);
    } else {
      setPreviewHomeScreenImages(validNewUrls);
    }
  };

  const handleAddCarousel = async () => {
    setLoading(true);
    try {
      const validCafeImages = cafeImages.filter(Boolean);
      const validHomeScreenImages = homeScreenImages.filter(Boolean);
      
      const response = await axios.post(`${API_BASE_URL}/carousal/addCarousal`, {
        cafeImages: validCafeImages,
        homeScreenImages: validHomeScreenImages,
      });
      setCarousels([...carousels, response.data.carousal]);
      resetFields();
      toast.success('Carousel added successfully');
    } catch (error) {
      toast.error('Failed to add carousel');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCarousel = async (id) => {
    setLoading(true);
    try {
      const validCafeImages = cafeImages.filter(Boolean);
      const validHomeScreenImages = homeScreenImages.filter(Boolean);
      
      const updatedCafeImages = [...selectedCarousel.cafeImages, ...validCafeImages];
      const updatedHomeScreenImages = [...selectedCarousel.homeScreenImages, ...validHomeScreenImages];

      const response = await axios.put(`${API_BASE_URL}/carousal/updateCarousal/${id}`, {
        cafeImages: updatedCafeImages,
        homeScreenImages: updatedHomeScreenImages,
      });
      
      setCarousels(carousels.map(carousel => 
        carousel._id === id ? response.data.updatedCarousal : carousel
      ));
      resetFields();
      toast.success('Carousel updated successfully');
    } catch (error) {
      toast.error('Failed to update carousel');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCarousel = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/carousal/deleteCarousal/${id}`);
      setCarousels(carousels.filter(carousel => carousel._id !== id));
      toast.success('Carousel deleted successfully');
    } catch (error) {
      toast.error('Failed to delete carousel');
    }
  };

  const resetFields = () => {
    setCafeImages(['']);
    setHomeScreenImages(['']);
    setSelectedCarousel(null);
    setPreviewCafeImages([]);
    setPreviewHomeScreenImages([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Manage Carousels</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <IoCloseCircleOutline style={{fontSize: '30px'}}/>
            </button>
          </div>

          <div className="p-6 space-y-8">
            <CarouselList
              carousels={carousels}
              onEdit={(carousel) => {
                setSelectedCarousel(carousel);
                setCafeImages(['']);
                setHomeScreenImages(['']);
                setPreviewCafeImages(carousel.cafeImages);
                setPreviewHomeScreenImages(carousel.homeScreenImages);
              }}
              onDelete={handleDeleteCarousel}
            />

            <div className="space-y-6">
              <ImageInput
                urls={cafeImages}
                onChange={handleCafeImagesChange}
                title="Add Cafe Images"
              />
              <ImageInput
                urls={homeScreenImages}
                onChange={handleHomeScreenImagesChange}
                title="Add Home Screen Images"
              />
            </div>

            <div className="space-y-6">
              <ImagePreview urls={previewCafeImages} title="Cafe Images Preview" />
              <ImagePreview urls={previewHomeScreenImages} title="Home Screen Images Preview" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            {selectedCarousel ? (
              <button
                onClick={() => handleUpdateCarousel(selectedCarousel._id)}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Updating...' : 'Update Carousel'}
              </button>
            ) : (
              <button
                onClick={handleAddCarousel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Carousel'}
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CarouselModal;