import React from 'react';



function Maintanenace() {
  return (
    <div className="relative h-screen">
      {/* Existing Section */}
      <div className="mt-4 p-4 h-full flex flex-col">
        {/* Add Maintenance Button */}
        <button className="absolute top-4 right-4 flex items-center bg-green-500 text-white px-4 py-2 rounded-full shadow hover:bg-green-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v8m4-4H8"
            />
          </svg>
          Add Maintenance
        </button>

        {/* Title: Maintenance Overview */}
        <h1 className="text-xl font-bold text-left mb-4">Maintenance Overview</h1>

        {/* Row - 4 Cards in One Line, with small space between them */}
        <div className="flex space-x-5 mb-8">
          {/* Card 1 - In Process */}
          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="bg-blue-200 rounded-full p-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l2 2"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-blue-600">10</h2>
            <p className="text-sm text-gray-600">In Process</p>
          </div>

          {/* Card 2 - Completed Maintenance */}
          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="bg-green-200 rounded-full p-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2l4 -4"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-green-600">20</h2>
            <p className="text-sm text-gray-600">Completed Maintenance</p>
          </div>

          {/* Card 3 - Hold Maintenance */}
          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-52 h-28 relative">
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="bg-yellow-200 rounded-full p-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-yellow-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-yellow-600">5</h2>
            <p className="text-sm text-gray-600">Hold Maintenance</p>
          </div>

          {/* Card 4 - Total Maintenance */}
          <div className="bg-white shadow-md rounded-lg p-3 flex flex-col items-start w-48 h-28 relative">
            <div className="absolute top-2 right-2 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="6" r="2" fill="currentColor" />
                <circle cx="12" cy="12" r="2" fill="currentColor" />
                <circle cx="12" cy="18" r="2" fill="currentColor" />
              </svg>
            </div>
            <div className="bg-gray-200 rounded-full p-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
            <h2 className="text-base font-bold text-gray-600">35</h2>
            <p className="text-sm text-gray-600">Total Maintenance</p>
          </div>
        </div>

        {/* New Section: Pending, Ongoing, and Resolved Issues */}
        <div className="flex space-x-5 flex-grow">
       {/* Pending Issues */}
      <div className="bg-white shadow-md rounded-lg p-4 w-1/3 flex flex-col">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Pending Issues</h2>
        <div className="flex-grow overflow-y-auto max-h-40">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
                <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
                <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
                <th className="p-2 text-sm font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 text-sm text-gray-600">1</td>
                <td className="p-2 text-sm text-gray-600">John Doe</td>
                <td className="p-2 text-sm text-gray-600">Broken Light</td>
                <td className="p-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded">Assign</button>
                </td>
              </tr>
              <tr>
                <td className="p-2 text-sm text-gray-600">2</td>
                <td className="p-2 text-sm text-gray-600">Jane Smith</td>
                <td className="p-2 text-sm text-gray-600">Water Leakage</td>
                <td className="p-2">
                  <button className="bg-green-500 text-white px-2 py-1 rounded">Assign</button>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ongoing Issues */}
      <div className="bg-white shadow-md rounded-lg p-4 w-1/3 flex flex-col">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Ongoing Issues</h2>
        <div className="flex-grow max-h-40">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
                <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
                <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
                <th className="p-2 text-sm font-bold text-gray-700">Assigned To</th>
                <th className="p-2 text-sm font-bold text-gray-700">Time Needed</th>
              </tr>
            </thead>
            <tbody>
              <tr className="mb-4"> {/* Added margin-bottom for spacing */}
                <td className="p-2 text-sm text-gray-600">1</td>
                <td className="p-2 text-sm text-gray-600">Alice</td>
                <td className="p-2 text-sm text-gray-600">Power Outage</td>
                <td className="p-2 text-sm text-gray-600">John Smith</td>
                <td className="p-2 text-sm text-red-600">3 hours</td> 
              </tr>
              <tr className="mb-4"> {/* Added margin-bottom for spacing */}
                <td className="p-2 text-sm text-gray-600">2</td>
                <td className="p-2 text-sm text-gray-600">Bob</td>
                <td className="p-2 text-sm text-gray-600">AC Repair</td>
                <td className="p-2 text-sm text-gray-600">Jane Doe</td>
                <td className="p-2 text-sm text-red-600">3 hours</td> 
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>


      {/* Resolved Issues */}
      <div className="bg-white shadow-md rounded-lg p-4 w-1/3 flex flex-col">
        <h2 className="text-lg font-bold text-gray-800 mb-2">Resolved Issues</h2>
        <div className="flex-grow max-h-40">
          <table className="min-w-full text-left">
            <thead>
              <tr>
                <th className="p-2 text-sm font-bold text-gray-700">Sl No</th>
                <th className="p-2 text-sm font-bold text-gray-700">Issuer Name</th>
                <th className="p-2 text-sm font-bold text-gray-700">Issue</th>
                <th className="p-2 text-sm font-bold text-gray-700">Resolved By</th>
                <th className="p-2 text-sm font-bold text-gray-700">Status</th> {/* Changed from Action to Status */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 text-sm text-gray-600">1</td>
                <td className="p-2 text-sm text-gray-600">Charlie</td>
                <td className="p-2 text-sm text-gray-600">Fan Replacement</td>
                <td className="p-2 text-sm text-gray-600">John Smith</td>
                <td className="p-2">
                  <a href="#" className="text-green-500 hover:underline">Resolved</a> {/* Changed button to link */}
                </td>
              </tr>
              <tr>
                <td className="p-2 text-sm text-gray-600">2</td>
                <td className="p-2 text-sm text-gray-600">David</td>
                <td className="p-2 text-sm text-gray-600">Leak Fixed</td>
                <td className="p-2 text-sm text-gray-600">Jane Doe</td>
                <td className="p-2">
                  <a href="#" className="text-green-500 hover:underline">Resolved</a> {/* Changed button to link */}
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>



        </div>
      </div>
    </div>
  );
}

export default Maintanenace;



