export default function Reports() {
  const reports = [
    { id: 1, name: 'Monthly Inventory Summary', type: 'Inventory', date: '2026-05-01', status: 'Ready' },
    { id: 2, name: 'Supplier Performance Q1', type: 'Suppliers', date: '2026-04-30', status: 'Ready' },
    { id: 3, name: 'Procurement Cost Analysis', type: 'Procurement', date: '2026-04-28', status: 'Processing' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          Generate Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                report.status === 'Ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {report.status}
              </span>
              <span className="text-xs text-gray-500">{report.type}</span>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">{report.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{report.date}</p>
            <button className="w-full px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors">
              Download
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Report History</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{report.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{report.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button className="text-teal-600 hover:text-teal-900 mr-3">View</button>
                  <button className="text-teal-600 hover:text-teal-900">Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
