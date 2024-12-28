import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchAndSort = ({
  searchQuery,
  handleSearchChange,
  sortingOptions,
  onSortChange,
  addNewEntryPath,
  addButtonLabel = 'Add New Entry',
  currentSortLabel = 'All',  // Default to 'All' if no sort is applied
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="border rounded-full py-2 px-4 w-full md:w-1/2 lg:w-2/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Sorting Option and Add Entry Button */}
      <div className="flex items-center gap-4 ml-auto">
        <div className="relative">
          <select
            onChange={(e) => onSortChange(e.target.value)}
            className="border rounded-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 w-32 appearance-none"
            value={currentSortLabel}  // Dynamically bind the current sort option
          >
            <option value="" disabled>Filter by...</option>
            {sortingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-1 flex items-center pr-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>

        <button
          onClick={() => navigate(addNewEntryPath)}
          className="bg-side-bar text-white rounded-full py-2 px-6 hover:bg-[#373082]"
        >
          {addButtonLabel}
        </button>
      </div>
    </div>
  );
};

export default SearchAndSort;
