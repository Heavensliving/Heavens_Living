
import { useState } from 'react';

function MessManagementForm() {
  const [formData, setFormData] = useState({
    dayOfWeek: '',
    propertyId: '',
    propertyName: '',
    studentName: '',
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const [mealInput, setMealInput] = useState({
    breakfast: '',
    lunch: '',
    dinner: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleMealChange = (e) => {
    const { name, value } = e.target;
    setMealInput({
      ...mealInput,
      [name]: value,
    });
  };

  const addMealItem = (mealType) => {
    setFormData({
      ...formData,
      [mealType]: [...formData[mealType], mealInput[mealType]],
    });
    setMealInput({
      ...mealInput,
      [mealType]: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you can handle the API call to submit the form data
    try {
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Mess Management</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="dayOfWeek"
              value={formData.dayOfWeek}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-lg w-full"
              required
            >
              <option value="">Select Day of the Week</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <input
              type="text"
              name="propertyId"
              placeholder="Property ID"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={formData.propertyId}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="propertyName"
              placeholder="Property Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={formData.propertyName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="studentName"
              placeholder="Student Name"
              className="p-3 border border-gray-300 rounded-lg w-full"
              value={formData.studentName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Breakfast */}
          <div>
            <label className="block mb-2 font-bold">Breakfast</label>
            <input
              type="text"
              name="breakfast"
              placeholder="Add breakfast item"
              className="p-3 border border-gray-300 rounded-lg w-full mb-4"
              value={mealInput.breakfast}
              onChange={handleMealChange}
            />
            <button
              type="button"
              onClick={() => addMealItem('breakfast')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Breakfast Item
            </button>
            <ul className="list-disc ml-6 mt-2">
              {formData.breakfast.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Lunch */}
          <div>
            <label className="block mb-2 font-bold">Lunch</label>
            <input
              type="text"
              name="lunch"
              placeholder="Add lunch item"
              className="p-3 border border-gray-300 rounded-lg w-full mb-4"
              value={mealInput.lunch}
              onChange={handleMealChange}
            />
            <button
              type="button"
              onClick={() => addMealItem('lunch')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Lunch Item
            </button>
            <ul className="list-disc ml-6 mt-2">
              {formData.lunch.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Dinner */}
          <div>
            <label className="block mb-2 font-bold">Dinner</label>
            <input
              type="text"
              name="dinner"
              placeholder="Add dinner item"
              className="p-3 border border-gray-300 rounded-lg w-full mb-4"
              value={mealInput.dinner}
              onChange={handleMealChange}
            />
            <button
              type="button"
              onClick={() => addMealItem('dinner')}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              Add Dinner Item
            </button>
            <ul className="list-disc ml-6 mt-2">
              {formData.dinner.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <button type="submit" className="w-full bg-green-500 text-white py-3 rounded-lg">
            Submit Mess Plan
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessManagementForm;
