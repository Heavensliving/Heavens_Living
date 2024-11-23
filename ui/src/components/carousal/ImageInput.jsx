/* eslint-disable react/prop-types */
import { FaPlus, FaTrash } from 'react-icons/fa'; // Import icons from react-icons

export const ImageInput = ({ urls, onChange, title }) => {
  const addField = () => {
    // Append a new empty string to the existing URLs
    onChange([...urls, '']);
  };

  const updateUrl = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    onChange(newUrls);
  };

  const removeField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    onChange(newUrls);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          onClick={addField}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
        >
          <FaPlus size={16} /> {/* Add icon */}
          Add Image
        </button>
      </div>

      {urls.map((url, index) => (
        <div key={index} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              value={url}
              onChange={(e) => updateUrl(index, e.target.value)}
              placeholder="Enter image URL..."
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
          </div>
          <button
            onClick={() => removeField(index)}
            className="flex items-center p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTrash size={16} /> {/* Remove icon */}
          </button>
        </div>
      ))}
    </div>
  );
};