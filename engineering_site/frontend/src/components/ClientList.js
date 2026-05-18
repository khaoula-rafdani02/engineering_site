import React from 'react';
import ClientCard from './ClientCard';
import { Plus, Search } from 'lucide-react';

const ClientList = ({ clients, onSelectClient }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Répertoire Clients</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-all">
          <Plus size={18} /> Nouveau
        </button>
      </div>

      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Rechercher un client..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <ClientCard 
            key={client.id} 
            client={client} 
            onClick={() => onSelectClient(client)} 
          />
        ))}
      </div>
    </div>
  );
};

export default ClientList;