import React from 'react';
import { format } from 'date-fns';
import { Complaint } from '../types/complaint';
import { Edit2, Trash2 } from 'lucide-react';

interface ComplaintListProps {
  complaints: Complaint[];
  onEdit: (complaint: Complaint) => void;
  onDelete: (id: string) => void;
}

export function ComplaintList({ complaints, onEdit, onDelete }: ComplaintListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="table-header">Complaint No.</th>
            <th className="table-header">Date</th>
            <th className="table-header">Customer</th>
            <th className="table-header">Machine</th>
            <th className="table-header">Status</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {complaints.map((complaint) => (
            <tr key={complaint.id} className="hover:bg-gray-750">
              <td className="table-cell font-medium">
                {complaint.complaint_number}
              </td>
              <td className="table-cell">
                {format(new Date(complaint.date), 'dd/MM/yyyy')}
              </td>
              <td className="table-cell">
                {complaint.customer_name}
              </td>
              <td className="table-cell">
                {complaint.machine_type}
              </td>
              <td className="table-cell">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  complaint.status === 'Open' 
                    ? 'bg-yellow-900 text-yellow-200' 
                    : 'bg-green-900 text-green-200'
                }`}>
                  {complaint.status}
                </span>
              </td>
              <td className="table-cell">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(complaint)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(complaint.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}