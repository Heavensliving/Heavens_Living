import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Importing jsPDF table plugin
import { useSelector } from 'react-redux';
import { AiOutlineDownload } from 'react-icons/ai';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const WeeklyMenu = () => {
  const admin = useSelector((store) => store.auth.admin);
  const [menus, setMenus] = useState({});
  const navigate = useNavigate();

  const correctDayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const reorderDays = (menus) => {
    const reorderedMenus = {};
    correctDayOrder.forEach((day) => {
      if (menus[day]) {
        reorderedMenus[day] = menus[day];
      }
    });
    return reorderedMenus;
  };

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/mess/getAllMeals`, {
          headers: { Authorization: `Bearer ${admin.token}` },
        });
        const menuData = response.data.reduce((acc, menuItem) => {
          acc[menuItem.dayOfWeek] = menuItem;
          return acc;
        }, {});
        const reorderedMenuData = reorderDays(menuData);
        setMenus(reorderedMenuData);
      } catch (error) {
        console.error('Error fetching food items:', error);
      }
    };
    fetchMenuData();
  }, [admin.token]);

  const handleDownloadMenu = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Weekly Food Menu', 10, 10);

    const tableData = Object.entries(menus).map(([day, meals]) => [
      day,
      meals.breakfast?.join(', ') || 'No meals',
      meals.lunch?.join(', ') || 'No meals',
      meals.dinner?.join(', ') || 'No meals',
    ]);

    doc.autoTable({
      head: [['Day', 'Breakfast', 'Lunch', 'Dinner']],
      body: tableData,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
    });

    doc.save('weekly_menu.pdf');
  };

  return (
    <div className="w-full p-4 bg-gray-100 relative rounded-xl">
      <button
        onClick={handleDownloadMenu}
        className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded-full"
        aria-label="Download Menu"
      >
        <AiOutlineDownload className="w-6 h-6" />
      </button>

      <h2 className="text-lg font-semibold mb-4">Weekly Meals</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b p-2">Day</th>
            <th className="border-b p-2">Breakfast</th>
            <th className="border-b p-2">Lunch</th>
            <th className="border-b p-2">Dinner</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(menus).map(([day, meals]) => (
            <tr key={day} className="hover:bg-gray-200">
              <td className="border-b p-2">{day}</td>
              <td className="border-b p-2">{meals.breakfast?.join(', ') || 'No meals'}</td>
              <td className="border-b p-2">{meals.lunch?.join(', ') || 'No meals'}</td>
              <td className="border-b p-2">{meals.dinner?.join(', ') || 'No meals'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WeeklyMenu;
