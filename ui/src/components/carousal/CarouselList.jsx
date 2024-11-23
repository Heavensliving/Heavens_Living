/* eslint-disable react/prop-types */
import { useState } from 'react';
import ConfirmationModal from './ConfirmationModal'; // Import the ConfirmationModal

export const CarouselList = ({ carousels, onEdit, onDelete }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [carouselToDelete, setCarouselToDelete] = useState(null);

  const handleDeleteClick = (carouselId) => {
    setCarouselToDelete(carouselId);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (carouselToDelete) {
      onDelete(carouselToDelete);
      setCarouselToDelete(null);
      setModalOpen(false);
    }
  };

  if (!carousels.length) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Existing Carousels</h2>
      <div className="divide-y divide-gray-100">
        {carousels.map((carousel) => (
          <div key={carousel._id} className="py-4 first:pt-0 last:pb-0">
            {carousel.cafeImages.some(Boolean) && (
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Cafe Images</h3>
                <div className="grid grid-cols-4 gap-2">
                  {carousel.cafeImages.filter(Boolean).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Cafe ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}

            {carousel.homeScreenImages.some(Boolean) && (
              <div className="space-y-3 mt-4">
                <h3 className="font-medium text-gray-700">Home Screen Images</h3>
                <div className="grid grid-cols-4 gap-2">
                  {carousel.homeScreenImages.filter(Boolean).map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Home ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => onEdit(carousel)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteClick(carousel._id)} // Open confirmation modal
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};