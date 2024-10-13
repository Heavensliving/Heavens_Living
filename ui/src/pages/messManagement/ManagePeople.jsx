import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

function ManagePeople() {
  const [people, setPeople] = useState([
    {
      id: 1,
      name: 'John Doe',
      contactNumber: '1234567890',
      email: 'john@example.com',
      mealType: ['Breakfast', 'Lunch'],
      months: 1,
      days: 15,
      joinDate: '22/09/2023',
      daysLeft: '21 days remaining'
    },
    {
      id: 2,
      name: 'Jane Smith',
      contactNumber: '9876543210',
      email: 'jane@example.com',
      mealType: ['Lunch', 'Dinner'],
      months: 2,
      days: 0,
      joinDate: '22/09/2023',
      daysLeft: '21 days remaining'
    },
    {
      id: 3,
      name: 'Robert Brown',
      contactNumber: '5555555555',
      email: 'robert@example.com',
      mealType: ['Whole Meal'],
      months: 3,
      days: 5,
      joinDate: '22/09/2023',
      daysLeft: '21 days remaining'
    },
  ]);

  const [editingPerson, setEditingPerson] = useState(null); // State to store the person being edited
  const [formData, setFormData] = useState({}); // State to store the form data
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Handle Delete
  const handleDelete = (id) => {
    setPeople(people.filter((person) => person.id !== id));
  };

  // Handle Edit button click
  const handleEdit = (person) => {
    setEditingPerson(person); // Set the person to be edited
    setFormData(person); // Load current person data into form
  };

  // Handle form input change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit for editing
  const handleSubmit = (e) => {
    e.preventDefault();
    setPeople(people.map((p) => (p.id === formData.id ? formData : p))); // Update the person data
    setEditingPerson(null); // Close the edit form
  };

  // Filter people based on search term
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Search input */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/2 p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Add a wrapper with max-height to make the table scrollable */}
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Contact Number</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Meal Type</th>
              <th className="py-3 px-6 text-left">Time Period</th>
              <th className="py-3 px-6 text-left">Join Date</th>
              <th className="py-3 px-6 text-left">Days Left</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredPeople.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No people found
                </td>
              </tr>
            ) : (
              filteredPeople.map((person) => (
                <tr key={person.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">{person.name}</td>
                  <td className="py-3 px-6 text-left">{person.contactNumber}</td>
                  <td className="py-3 px-6 text-left">{person.email || 'N/A'}</td>
                  <td className="py-3 px-6 text-left">{person.mealType.join(', ')}</td>
                  <td className="py-3 px-6 text-left">
                    {person.months} Months / {person.days} Days
                  </td>
                  <td className="py-3 px-6 text-left">{person.joinDate}</td>
                  <td className="py-3 px-6 text-left text-yellow-500">{person.daysLeft}</td>
                  <td className="py-3 px-6 flex justify-center items-center space-x-4">
                    {/* Edit Icon */}
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:text-blue-700"
                      onClick={(e) => {
                        console.log(`Editing ${item.name}`);
                      }}
                    />
                    {/* Delete Icon */}
                    <FaTrash
                      className="text-red-500 cursor-pointer hover:text-red-700"
                      onClick={(e) => {
                        console.log(`Deleting ${item.name}`);
                      }}
                      />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Form Modal */}
      {editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Edit Person</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Meal Type</label>
                <select
                  name="mealType"
                  value={formData.mealType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      mealType: Array.from(e.target.selectedOptions, (option) => option.value),
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                  multiple
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Whole Meal">Whole Meal</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Time Period (Months/Days)</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="months"
                    value={formData.months}
                    onChange={handleInputChange}
                    className="w-1/2 p-2 border border-gray-300 rounded"
                    min="0"
                    placeholder="Months"
                  />
                  <input
                    type="number"
                    name="days"
                    value={formData.days}
                    onChange={handleInputChange}
                    className="w-1/2 p-2 border border-gray-300 rounded"
                    min="15"
                    placeholder="Days"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingPerson(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded-lg">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManagePeople;
