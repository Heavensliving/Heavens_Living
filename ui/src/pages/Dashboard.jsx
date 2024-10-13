import React from 'react';
import { FaBuilding, FaSearch, FaUserGraduate, FaUserTie } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Get today's date
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  // Months array for month names
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = months[currentMonth];

  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Get the total number of days in the month
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create an array for the calendar days
  const calendarDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const financeData = [200, 150, 300, 400, 250, 350]; // Sample values for the graph

  return (
    <div className="flex flex-col h-screen">
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-4 md:p-6">
        {/* Stats Section */}
        <div className=" p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to={'/students'}>
            <div className="flex items-center p-4 rounded-lg bg-blue-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500 mr-4">
                <FaUserGraduate className="text-white text-3xl" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-semibold">Total Students</h2>
                <p className="text-2xl font-bold">40</p>
              </div>
            </div>
            </Link>
            
            <Link to={'/staffs'}>
            <div className="flex items-center p-4 rounded-lg bg-green-100">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 mr-4">
                <FaUserTie className="text-white text-3xl" />
              </div>
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-semibold">Total Staffs</h2>
                <p className="text-2xl font-bold">10</p>
              </div>
            </div>
            </Link>

            <Link to={'/property'}>
              <div className="flex items-center p-4 rounded-lg bg-red-100">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 mr-4">
                  <FaBuilding className="text-white text-3xl" />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-lg font-semibold">Total Properties</h2>
                  <p className="text-2xl font-bold">2</p>
                </div>
              </div>
            </Link>
            

          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Calendar Section */}
          <div className="mt-6 w-full sm:max-w-md">
            <h2 className="text-lg font-semibold mb-4">Calendar - {monthName}</h2>
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="font-bold text-center">
                  {day}
                </div>
              ))}
              {/* Empty slots before the first day of the month */}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={index} className="text-center"></div>
              ))}
              {calendarDays.map((day) => (
                <div
                  key={day}
                  className={`p-2 text-center rounded-full ${day === currentDate ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
                    }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Finance Graph Section */}
          <div className="mt-6 w-full sm:max-w-md bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Finance</h2>
            <div className="flex justify-around">
              {financeData.map((value, index) => (
                <div key={index} className="flex flex-col items-center" style={{ width: '100px' }}>
                  <div
                    className={`h-20 w-6 rounded ${value > 300 ? 'bg-red-500' : 'bg-yellow-500'}`}
                    style={{ height: `${value / 2}px` }}
                  ></div>
                  <span className="text-xs">{`Month ${index + 1}`}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
