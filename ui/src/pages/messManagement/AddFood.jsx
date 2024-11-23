import { useState, useEffect } from 'react';
import { FaArrowLeft, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../config';
import axios from 'axios';
import { useSelector } from 'react-redux';

function AddFood() {
  const admin = useSelector(store => store.auth.admin);
  const navigate = useNavigate();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const dayColors = {
    Sunday: 'bg-red-200',
    Monday: 'bg-blue-200',
    Tuesday: 'bg-green-200',
    Wednesday: 'bg-yellow-200',
    Thursday: 'bg-purple-200',
    Friday: 'bg-pink-200',
    Saturday: 'bg-orange-200',
  };

  const [selectedDay, setSelectedDay] = useState(null);
  const [menus, setMenus] = useState({});
  const [inputs, setInputs] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });
  const [confirmDelete, setConfirmDelete] = useState({ show: false, mealType: '', index: null });
  const [confirmClearAll, setConfirmClearAll] = useState(false); // New state for clear all confirmation
  const [notification, setNotification] = useState('');

  // Fetch data from API when component mounts
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/mess/getAllMeals`,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
        const menuData = response.data.reduce((acc, menuItem) => {
          acc[menuItem.dayOfWeek] = menuItem;
          return acc;
        }, {});
        setMenus(menuData); // Convert the array to an object keyed by dayOfWeek
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };

    fetchMenuData();
  }, []);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setInputs({ breakfast: '', lunch: '', dinner: '' });
    setNotification('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value
    }));
  };

  const handleMenuAdd = async () => {
    if (selectedDay) {
      const updatedMenu = {
        ...menus,
        [selectedDay]: {
          ...menus[selectedDay],
          breakfast: [...(menus[selectedDay]?.breakfast || []), inputs.breakfast].filter(item => item),
          lunch: [...(menus[selectedDay]?.lunch || []), inputs.lunch].filter(item => item),
          dinner: [...(menus[selectedDay]?.dinner || []), inputs.dinner].filter(item => item),
        },
      };

      setMenus(updatedMenu);
      setInputs({ breakfast: '', lunch: '', dinner: '' });

      const hasBreakfast = inputs.breakfast || (menus[selectedDay]?.breakfast?.length > 0);
      const hasLunch = inputs.lunch || (menus[selectedDay]?.lunch?.length > 0);
      const hasDinner = inputs.dinner || (menus[selectedDay]?.dinner?.length > 0);

      const addedMeals = [];
      const missingMeals = [];

      if (hasBreakfast) addedMeals.push('Breakfast');
      else missingMeals.push('Breakfast');

      if (hasLunch) addedMeals.push('Lunch');
      else missingMeals.push('Lunch');

      if (hasDinner) addedMeals.push('Dinner');
      else missingMeals.push('Dinner');

      if (addedMeals.length > 0 && missingMeals.length > 0) {
        setNotification(`${addedMeals.join(' and ')} added. Please add ${missingMeals.join(' and ')}.`);
      } else if (addedMeals.length > 0 && missingMeals.length === 0) {
        setNotification(`All meals added: ${addedMeals.join(', ')}!`);
      } else {
        setNotification('Please add at least one meal.');
      }

      try {
        const requestBody = {
          dayOfWeek: selectedDay,
          meals: {
            breakfast: updatedMenu[selectedDay].breakfast,
            lunch: updatedMenu[selectedDay].lunch,
            dinner: updatedMenu[selectedDay].dinner,
          },
        };

        const response = await axios.post(`${API_BASE_URL}/mess/addFood`, requestBody,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        );
       
      } catch (error) {
        console.error('Error adding food items:', error);
      }
    }
  };

  const handleDeleteItem = async (mealType, index) => {
    if (selectedDay) {
      const mealToDelete = menus[selectedDay][mealType][index];

      try {
        // Call the API to delete the food item
        const requestBody = {
          dayOfWeek: selectedDay,
          mealType: mealType,
          itemToDelete: mealToDelete, // Ensure this matches with backend
        };

        const response = await axios.put(`${API_BASE_URL}/mess/deleteFoodItem`, requestBody,
          {headers: { 'Authorization': `Bearer ${admin.token}` }}
        ); // Remove 'data' key
       

        // Update the local state to remove the item
        const updatedMenu = {
          ...menus,
          [selectedDay]: {
            ...menus[selectedDay],
            [mealType]: menus[selectedDay][mealType].filter((_, i) => i !== index),
          },
        };

        setMenus(updatedMenu);
        setConfirmDelete({ show: false, mealType: '', index: null });
        setNotification(`Deleted ${mealToDelete} from ${mealType} successfully.`);
      } catch (error) {
        console.error('Error deleting food item:', error);
        setNotification('Error deleting food item. Please try again.');
      }
    }
  };

  const handleClearAll = async () => {
    if (selectedDay) {
      try {
        const requestBody = {
          dayOfWeek: selectedDay,
        };
        // Call the API to delete all food items for the selected day
        const response = await axios.delete(`${API_BASE_URL}/mess/deleteMealPlan/${selectedDay}`, { data: requestBody, headers: { 'Authorization': `Bearer ${admin.token}` } },
        )
        // Clear the menu for the selected day in local state
        setMenus((prevMenus) => ({
          ...prevMenus,
          [selectedDay]: {
            breakfast: [],
            lunch: [],
            dinner: [],
          },
        }));

        setNotification(`All meals cleared for ${selectedDay}.`);
        setConfirmClearAll(false); // Close the confirmation modal
      } catch (error) {
        console.error('Error deleting all meals:', error);
        setNotification('Nothing to clear');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/4 p-4">
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-semibold ml-4">Select Day</h2>
        </div>
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

      <div className="w-full md:w-3/4 p-4">
        {selectedDay ? (
          <>
            <h2 className="text-lg font-semibold mb-4">
              Menu for {selectedDay}
              <span
                onClick={() => setConfirmClearAll(true)} // Show clear all confirmation modal
                className="ml-4 text-red-600 cursor-pointer hover:underline"
              >
                Clear All
              </span>
            </h2>
            <div className="space-y-6">
              {notification && (
                <div className="mt-4">
                  {notification.split('.').map((part, index) => {
                    if (index === 0) {
                      return (
                        <span key={index} className="text-green-600 font-semibold">
                          {part.trim()}.
                        </span>
                      );
                    } else if (part.trim()) {
                      return (
                        <span key={index} className="text-red-600 font-semibold">
                          {part.trim()}.
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-blue-600">Breakfast</h3>
                <input
                  type="text"
                  className="border border-blue-300 rounded-lg p-2 flex-grow mt-2"
                  name="breakfast"
                  value={inputs.breakfast}
                  onChange={handleInputChange}
                />
                <button
                  onClick={handleMenuAdd}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded ml-2"
                >
                  Add
                </button>
                <ul className="mt-2">
                  {menus[selectedDay]?.breakfast?.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-blue-500 p-1">
                      {item}
                      <button
                        onClick={() => setConfirmDelete({ show: true, mealType: 'breakfast', index })}
                        className="text-red-600 hover:underline"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-green-600">Lunch</h3>
                <input
                  type="text"
                  className="border border-green-300 rounded-lg p-2 flex-grow mt-2"
                  name="lunch"
                  value={inputs.lunch}
                  onChange={handleInputChange}
                />
                <button
                  onClick={handleMenuAdd}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded ml-2"
                >
                  Add
                </button>
                <ul className="mt-2">
                  {menus[selectedDay]?.lunch?.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-green-500 p-1">
                      {item}
                      <button
                        onClick={() => setConfirmDelete({ show: true, mealType: 'lunch', index })}
                        className="text-red-600 hover:underline"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg shadow-md">
                <h3 className="font-semibold text-yellow-600">Dinner</h3>
                <input
                  type="text"
                  className="border border-yellow-300 rounded-lg p-2 flex-grow mt-2"
                  name="dinner"
                  value={inputs.dinner}
                  onChange={handleInputChange}
                />
                <button
                  onClick={handleMenuAdd}
                  className="bg-side-bar hover:bg-[#373082] text-white p-2 rounded ml-2"
                >
                  Add
                </button>
                <ul className="mt-2">
                  {menus[selectedDay]?.dinner?.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-yellow-500 p-1">
                      {item}
                      <button
                        onClick={() => setConfirmDelete({ show: true, mealType: 'dinner', index })}
                        className="text-red-600 hover:underline"
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Confirmation Modal for Deleting All Meals */}
            {confirmClearAll && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                <div className="bg-white p-6 rounded shadow-md">
                  <h3 className="text-lg font-semibold">Confirm Clear All Meals</h3>
                  <p>Are you sure you want to clear all meals for {selectedDay}?</p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setConfirmClearAll(false)}
                      className="bg-gray-300 hover:bg-gray-400 p-2 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Modal for Deleting a Meal Item */}
            {confirmDelete.show && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
                <div className="bg-white p-6 rounded shadow-md">
                  <h3 className="text-lg font-semibold">Confirm Delete</h3>
                  <p>Are you sure you want to delete this {confirmDelete.mealType}?</p>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setConfirmDelete({ show: false, mealType: '', index: null })}
                      className="bg-gray-300 hover:bg-gray-400 p-2 rounded mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteItem(confirmDelete.mealType, confirmDelete.index)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div>Select a day to manage meals.</div>
        )}
      </div>
    </div>
  );
}

export default AddFood;



