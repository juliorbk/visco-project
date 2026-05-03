gexport default function Suppliers() {
  const suppliers = [
    { id: 1, name: 'Metal Works Inc', contact: 'John Smith', email: 'john@metalworks.com', orders: 23, status: 'Active' },
    { id: 2, name: 'ElectroSupply', contact: 'Jane Doe', email: 'jane@electrosupply.com', orders: 45, status: 'Active' },
    { id: 3, name: 'Safety First Co', contact: 'Bob Wilson', email: 'bob@safetyfirst.com', orders: 12, status: 'Inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Suppliers</h2>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
          Add Supplier
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-bold text-lg">{supplier.name.charAt(0)}</span>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                supplier.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {supplier.status}
              </span>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">{supplier.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {supplier.contact}
              </p>
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {supplier.email}
              </p>
              <p className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {supplier.orders} orders
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 px-3 py-2 border border-teal-600 text-teal-600 rounded hover:bg-teal-50 transition-colors text-sm">
                Edit
              </button>
              <button className="flex-1 px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition-colors text-sm">
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
