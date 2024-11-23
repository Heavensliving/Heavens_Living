import StatsSection from './StatSection';
import FinanceChart from './FinanceChart';
import CheckAuth from '../auth/CheckAuth';

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

        {/* Stack vertically on all screens */}
        <div className="flex flex-col gap-6 mt-6">
          {/* Finance Graph Section */}
          <div className="bg-white p-4 rounded-lg shadow h-[500px]"> {/* Fixed height */}
            <div className="h-full w-full">
              <FinanceChart financeData={financeData} />
            </div>
          </div>

          {/* Calendar Section */}
          <div className="bg-white p-4 rounded-lg shadow h-[500px]"> {/* Same fixed height */}
            <h2 className="text-lg font-semibold mb-4 text-center sm:text-left">
              Calendar - {monthName}
            </h2>
            <div className="grid grid-cols-7 gap-2 h-[calc(100%-3rem)]"> {/* Adjust for header space */}
              {daysOfWeek.map((day, index) => (
                <div key={index} className="font-bold text-center">
                  {day}
                </div>
              ))}
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={index} className="text-center"></div>
              ))}
              {calendarDays.map((day) => (
                <div
                  key={day}
                  className={`p-2 text-center rounded-full ${
                    day === currentDate 
                      ? 'bg-green-500 text-white' 
                      : 'hover:bg-gray-200'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckAuth(Dashboard);