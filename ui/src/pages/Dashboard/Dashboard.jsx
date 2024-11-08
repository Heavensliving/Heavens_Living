// import React from 'react';
// import StatsSection from './StatSection'; 

// const Dashboard = () => {
//   // Get today's date
//   const today = new Date();
//   const currentDate = today.getDate();
//   const currentMonth = today.getMonth();
//   const currentYear = today.getFullYear();

//   // Months array for month names
//   const months = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December"
//   ];
//   const monthName = months[currentMonth];

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

//   const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

//   const calendarDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

//   const financeData = [200, 150, 300, 400, 250, 350]; 

//   return (
//     <div className="flex flex-col h-screen">
//       <main className="flex-1 bg-gray-100 p-4 md:p-6">
//       <StatsSection />

//         <div className="flex flex-col sm:flex-row gap-6">
//           {/* Calendar Section */}
//           <div className="mt-6 w-full sm:max-w-md">
//             <h2 className="text-lg font-semibold mb-4">Calendar - {monthName}</h2>
//             <div className="grid grid-cols-7 gap-2">
//               {daysOfWeek.map((day, index) => (
//                 <div key={index} className="font-bold text-center">
//                   {day}
//                 </div>
//               ))}
//               {/* Empty slots before the first day of the month */}
//               {Array.from({ length: firstDayOfMonth }).map((_, index) => (
//                 <div key={index} className="text-center"></div>
//               ))}
//               {calendarDays.map((day) => (
//                 <div
//                   key={day}
//                   className={`p-2 text-center rounded-full ${day === currentDate ? 'bg-green-500 text-white' : 'hover:bg-gray-200'
//                     }`}
//                 >
//                   {day}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Finance Graph Section */}
//           <div className="mt-6 w-full sm:max-w-md bg-white p-4 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-4">Finance</h2>
//             <div className="flex justify-around">
//               {financeData.map((value, index) => (
//                 <div key={index} className="flex flex-col items-center" style={{ width: '100px' }}>
//                   <div
//                     className={`h-20 w-6 rounded ${value > 300 ? 'bg-red-500' : 'bg-yellow-500'}`}
//                     style={{ height: `${value / 2}px` }}
//                   ></div>
//                   <span className="text-xs">{`Month ${index + 1}`}</span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Dashboard;

import React from 'react';
import StatsSection from './StatSection';

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

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const financeData = [200, 150, 300, 400, 250, 350]; 

  return (
    <div className="flex flex-col h-screen">
      <main className="flex-1 bg-gray-100 p-4 md:p-6">
        <StatsSection />

        <div className="flex flex-wrap gap-6 mt-6">
          {/* Calendar Section */}
          <div className="w-full sm:max-w-md">
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
          <div className="w-full sm:max-w-md bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">Finance</h2>
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
