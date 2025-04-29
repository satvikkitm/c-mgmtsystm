import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Download, FileSpreadsheet, Calendar, ArrowRight } from 'lucide-react';
import { Complaint } from '../types/complaint';

interface ExportDataProps {
  complaints: Complaint[];
}

export function ExportData({ complaints }: ExportDataProps) {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [showExport, setShowExport] = useState<boolean>(false);

  // Filter complaints by date range
  const filteredComplaints = complaints.filter(complaint => {
    const complaintDate = new Date(complaint.date);
    
    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      return complaintDate >= from && complaintDate <= to;
    }
    if (fromDate) {
      const from = new Date(fromDate);
      return complaintDate >= from;
    }
    if (toDate) {
      const to = new Date(toDate);
      return complaintDate <= to;
    }
    return true;
  });

  // Format data for CSV export
  const csvData = filteredComplaints.map(complaint => ({
    'Complaint Number': complaint.complaint_number,
    'Date': complaint.date,
    'Customer Name': complaint.customer_name,
    'Address': complaint.address,
    'Place': complaint.place,
    'Contact Number': complaint.contact_number,
    'Company Complaint Number': complaint.company_complaint_number,
    'Machine Number': complaint.machine_number,
    'Machine Type': complaint.machine_type,
    'Machine Capacity': complaint.machine_capacity,
    'Company': complaint.company,
    'Fault': complaint.fault,
    'Work Done': complaint.work_done,
    'Parts Used': complaint.parts_used,
    'Cost': complaint.cost,
    'Technician Name': complaint.technician_name,
    'Completion Date': complaint.completion_date || '',
    'Status': complaint.status
  }));

  const filename = `complaints_${fromDate || 'start'}_to_${toDate || 'end'}_${format(new Date(), 'yyyy-MM-dd')}.csv`;

  return (
    <div className="my-4">
      <motion.button
        className="glass-card flex items-center justify-between w-full px-4 py-3 text-left"
        onClick={() => setShowExport(!showExport)}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          <FileSpreadsheet className="h-5 w-5 text-indigo-400 mr-3" />
          <span className="font-medium text-white">Export Data</span>
        </div>
        <motion.div
          animate={{ rotate: showExport ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </motion.div>
      </motion.button>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: showExport ? 'auto' : 0,
          opacity: showExport ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="glass-card mt-2 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">From Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">To Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="form-input pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-end">
              <motion.div
                className="w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <CSVLink
                  data={csvData}
                  filename={filename}
                  className="w-full btn-primary flex items-center justify-center"
                  target="_blank"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <span className="ml-1 text-xs text-indigo-300">({filteredComplaints.length})</span>
                </CSVLink>
              </motion.div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-gray-500">
              {fromDate && toDate ? (
                <span>Exporting data from {format(new Date(fromDate), 'MMM d, yyyy')} to {format(new Date(toDate), 'MMM d, yyyy')}</span>
              ) : fromDate ? (
                <span>Exporting data from {format(new Date(fromDate), 'MMM d, yyyy')}</span>
              ) : toDate ? (
                <span>Exporting data until {format(new Date(toDate), 'MMM d, yyyy')}</span>
              ) : (
                <span>Exporting all data</span>
              )}
            </div>
            <div className="text-indigo-400">
              {filteredComplaints.length} records
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 