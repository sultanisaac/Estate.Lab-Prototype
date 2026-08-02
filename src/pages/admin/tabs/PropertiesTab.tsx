import { Plus } from 'lucide-react';

export function PropertiesTab() {
  const mockProperties = [
    { id: '1', title: 'The Glass House', collection: 'Signature', price: '$2,400,000', status: 'Available' },
    { id: '2', title: 'Modern Starter', collection: 'Starter', price: '$450,000', status: 'Available' },
    { id: '3', title: 'The Horizon', collection: 'Family', price: '$850,000', status: 'Sold' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-[#0F4C5C]">Property Catalog</h2>
          <p className="text-gray-500">Manage your real estate listings and collections.</p>
        </div>
        <button className="bg-[#0F4C5C] text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-[#0F4C5C]/90">
          <Plus size={20} />
          <span>Add Property</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProperties.map((property) => (
          <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
              [Image Placeholder]
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-[#D4B483] uppercase tracking-wider">{property.collection}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${property.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {property.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{property.title}</h3>
              <p className="text-gray-500 mt-1">{property.price}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <button className="text-[#0F4C5C] text-sm font-medium hover:underline">Edit Details</button>
                <button className="text-[#0F4C5C] text-sm font-medium hover:underline">Manage Gallery</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
