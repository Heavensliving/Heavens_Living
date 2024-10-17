import React from 'react';

const ResolvedIssues = ({ records }) => {
  return (
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
              <th className="p-2 text-sm font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 text-sm text-gray-600">1</td>
              <td className="p-2 text-sm text-gray-600">Charlie</td>
              <td className="p-2 text-sm text-gray-600">Fan Replacement</td>
              <td className="p-2 text-sm text-gray-600">John Smith</td>
              <td className="p-2">
                <a href="#" className="text-green-500 hover:underline">Resolved</a>
              </td>
            </tr>
            <tr>
              <td className="p-2 text-sm text-gray-600">2</td>
              <td className="p-2 text-sm text-gray-600">David</td>
              <td className="p-2 text-sm text-gray-600">Leak Fixed</td>
              <td className="p-2 text-sm text-gray-600">Jane Doe</td>
              <td className="p-2">
                <a href="#" className="text-green-500 hover:underline">Resolved</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResolvedIssues;
