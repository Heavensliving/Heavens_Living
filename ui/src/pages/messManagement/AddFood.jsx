import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AddFood() {
  const navigate = useNavigate()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Colors for each day
  const dayColors = {
    Sunday: 'bg-red-200',
    Monday: 'bg-blue-200',
    Tuesday: 'bg-green-200',
    Wednesday: 'bg-yellow-200',
    Thursday: 'bg-purple-200',
    Friday: 'bg-pink-200',
    Saturday: 'bg-orange-200',
  };

  // Initial menu state
  const initialMenu = {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const [menus, setMenus] = useState({});
  const [breakfastInput, setBreakfastInput] = useState('');
  const [lunchInput, setLunchInput] = useState('');
  const [dinnerInput, setDinnerInput] = useState('');
  const [confirmDelete, setConfirmDelete] = useState({ show: false, mealType: '', index: null });

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setBreakfastInput('');
    setLunchInput('');
    setDinnerInput('');
  };

  const handleMenuAdd = () => {
    if (selectedDay) {
      const updatedMenu = {
        ...menus,
        [selectedDay]: {
          breakfast: [...(menus[selectedDay]?.breakfast || []), breakfastInput].filter(item => item),
          lunch: [...(menus[selectedDay]?.lunch || []), lunchInput].filter(item => item),
          dinner: [...(menus[selectedDay]?.dinner || []), dinnerInput].filter(item => item),
        },
      };
      setMenus(updatedMenu);
      setBreakfastInput('');
      setLunchInput('');
      setDinnerInput('');
    }
  };

  const handleDeleteItem = (mealType, index) => {
    const updatedMenu = {
      ...menus,
      [selectedDay]: {
        ...menus[selectedDay],
        [mealType]: menus[selectedDay][mealType].filter((_, i) => i !== index),
      },
    };
    setMenus(updatedMenu);
    setConfirmDelete({ show: false, mealType: '', index: null });
  };

  const handleBack = () => {
    setSelectedDay(null);
    setMenus({});
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Side - Days of the Week */}
      <div className="w-full md:w-1/4 p-4">
       {/* Back Button */}
       <button 
      onClick={()=>navigate('/mess')}
      className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full w-32 flex items-center justify-center space-x-2">
        <FaArrowLeft size={16} /> {/* Back icon */}
        <span>Back</span>
      </button>
        <h2 className="text-lg font-semibold">Select Day</h2>
        <div className="flex flex-col space-y-2 mt-4">
          {days.map((day) => (
            <div
              key={day}
              className={`${dayColors[day]} p-4 rounded-lg shadow-md cursor-pointer transition duration-300 hover:opacity-80`}
              onClick={() => handleDaySelect(day)}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Selected Day Menu */}
      <div className="w-full md:w-3/4 p-4">
        {selectedDay ? (
          <>
            <h2 className="text-lg font-semibold mb-4">Menu for {selectedDay}</h2>
            <div className="space-y-6">
              {/* Breakfast Section */}
              <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-blue-600">Breakfast</h3>
                <input
                  type="text"
                  className="border border-blue-300 rounded p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  value={breakfastInput}
                  onChange={(e) => setBreakfastInput(e.target.value)}
                  placeholder="Enter breakfast item"
                />
                <button
                  onClick={() => {
                    if (breakfastInput) {
                      handleMenuAdd();
                    }
                  }}
                  className="bg-blue-600 text-white p-2 rounded-lg shadow hover:bg-blue-500 transition duration-300 ml-2"
                >
                  Add Breakfast
                </button>
                {/* Display Added Breakfast Items */}
                <ul className="mt-2 list-disc list-inside">
                  {menus[selectedDay]?.breakfast?.map((item, index) => (
                    <li key={index} className="text-blue-800 flex justify-between items-center">
                      {item}
                      <button
                        onClick={() => setConfirmDelete({ show: true, mealType: 'breakfast', index })}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Lunch Section */}
              <div className="bg-green-50 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-green-600">Lunch</h3>
                <input
                  type="text"
                  className="border border-green-300 rounded p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
                  value={lunchInput}
                  onChange={(e) => setLunchInput(e.target.value)}
                  placeholder="Enter lunch item"
                />
                <button
                  onClick={() => {
                    if (lunchInput) {
                      handleMenuAdd();
                    }
                  }}
                  className="bg-green-600 text-white p-2 rounded-lg shadow hover:bg-green-500 transition duration-300 ml-2"
                >
                  Add Lunch
                </button>
                {/* Display Added Lunch Items */}
                <ul className="mt-2 list-disc list-inside">
                  {menus[selectedDay]?.lunch?.map((item, index) => (
                    <li key={index} className="text-green-800 flex justify-between items-center">
                      {item}
                      <button
                        onClick={() => setConfirmDelete({ show: true, mealType: 'lunch', index })}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dinner Section */}
              <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-yellow-600">Dinner</h3>
                <input
                  type="text"
                  className="border border-yellow-300 rounded p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
                  value={dinnerInput}
                  onChange={(e) => setDinnerInput(e.target.value)}
                  placeholder="Enter dinner item"
                />
                <button
                  onClick={() => {
                    if (dinnerInput) {
                      handleMenuAdd();
                    }
                  }}
                  className="bg-yellow-600 text-white p-2 rounded-lg shadow hover:bg-yellow-500 transition duration-300 ml-2"
                >
                  Add Dinner
                </button>
                {/* Display Added Dinner Items */}
                <ul className="mt-2 list-disc list-inside">
                  {menus[selectedDay]?.dinner?.map((item, index) => (
                    <li key={index} className="text-yellow-800 flex justify-between items-center">
                      {item}
                      <button
                        onClick={() => setConfirmDelete({ show: true, mealType: 'dinner', index })}
                        className="text-red-600 hover:text-red-800 ml-2"
                      >
                        🗑️
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Please select a day to see the menu.</p>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmDelete.show && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this item?</p>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => handleDeleteItem(confirmDelete.mealType, confirmDelete.index)} 
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-500 transition duration-300 mr-2"
              >
                Yes, Delete
              </button>
              <button 
                onClick={() => setConfirmDelete({ show: false, mealType: '', index: null })} 
                className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddFood;
