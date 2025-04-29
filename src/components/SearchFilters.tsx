import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, X, CheckSquare } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  statusFilter,
  onStatusFilterChange,
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  
  const clearFilters = () => {
    onSearchChange('');
    onDateFilterChange('');
    onStatusFilterChange('');
  };
  
  const hasActiveFilters = searchTerm || dateFilter || statusFilter;

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="glass-card">
        <div className="p-3 flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by customer name, machine number, or phone..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="form-input pl-10"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center p-2 rounded-md ${
              showFilters ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            } transition-colors`}
          >
            <Filter className="h-5 w-5" />
          </motion.button>
          
          {hasActiveFilters && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="flex items-center p-2 rounded-md bg-red-800/40 text-red-300 hover:bg-red-700/50 transition-colors"
              title="Clear all filters"
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </div>
        
        {/* Advanced Filters */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: showFilters ? 'auto' : 0, 
            opacity: showFilters ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="glass-card-footer p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Date Filter</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => onDateFilterChange(e.target.value)}
                  className="form-input pl-10"
                />
                {dateFilter && (
                  <button
                    onClick={() => onDateFilterChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CheckSquare className="h-4 w-4 text-gray-500" />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => onStatusFilterChange(e.target.value)}
                  className="form-input pl-10"
                >
                  <option value="">All Status</option>
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
                {statusFilter && (
                  <button
                    onClick={() => onStatusFilterChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-end justify-end md:justify-start">
              <div className="flex-1 md:flex-initial">
                <div className="text-xs text-gray-500 mb-1">Active Filters:</div>
                <div className="flex space-x-2">
                  {searchTerm && (
                    <span className="badge badge-blue">Search</span>
                  )}
                  {dateFilter && (
                    <span className="badge badge-purple">Date</span>
                  )}
                  {statusFilter && (
                    <span className="badge badge-green">Status</span>
                  )}
                  {!hasActiveFilters && (
                    <span className="text-xs text-gray-500">None</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}