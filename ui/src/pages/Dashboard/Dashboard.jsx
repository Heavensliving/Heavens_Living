import React from 'react';
import StatsSection from './StatSection';
import FinanceChart from './FinanceChart';

const Dashboard = () => {
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const monthName = months[currentMonth];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const financeData = [200, 150, 300, 400, 250, 350];

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 bg-gray-100 p-4 md:p-6">
        <StatsSection />

        {/* Flex container for Calendar and Finance graph */}
        <div className="flex flex-row gap-6 mt-6">
          {/* Calendar Section */}
          <div className="flex-1 bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">Calendar - {monthName}</h2>
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
          <div className="w-full sm:max-w-lg">
            <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">Finance Overview</h2>
            <div >
              {/* Increase the width and height of the chart to match calendar */}
              <div style={{ width: '100%', height: '400px' }}>
                <FinanceChart financeData={financeData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
