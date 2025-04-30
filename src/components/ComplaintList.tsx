import React, { useState, useCallback, memo } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Complaint } from '../types/complaint';
import { Edit2, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, FileQuestion } from 'lucide-react';

interface ComplaintListProps {
  complaints: Complaint[];
  onEdit: (complaint: Complaint) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (complaint: Complaint) => void;
}

export const ComplaintList = memo(function ComplaintList({ 
  complaints, 
  onEdit, 
  onDelete,
  onOpenDetails 
}: ComplaintListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  
  const handleViewDetails = useCallback((complaint: Complaint) => {
    onOpenDetails(complaint);
  }, [onOpenDetails]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  }, []);

  const [view, setView] = useState<'cards' | 'table'>('cards');
  
  if (complaints.length === 0) {
    return (
      <div className="bg-[#1A1C20]/30 rounded-xl border border-[#2C2F36] p-8 text-center">
        <div className="max-w-md mx-auto">
          <FileQuestion className="h-16 w-16 text-[#3B4252] mx-auto mb-6" />
          <h3 className="text-xl font-medium text-white mb-2">No complaints found</h3>
          <p className="text-[#9CA3AF]">
            There are no complaints matching your criteria. Try adjusting your filters or add a new complaint.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="table-container smooth-scroll">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="min-w-full animate-optimized"
        >
          {/* Mobile View (Card Layout) */}
          <div className="md:hidden space-y-4 scroll-container smooth-scroll pb-4">
            {complaints.map((complaint, index) => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint}
                isExpanded={expandedId === complaint.id}
                onToggleExpand={toggleExpand}
                onEdit={onEdit}
                onDelete={onDelete}
                onOpenDetails={handleViewDetails}
                index={index}
              />
            ))}
          </div>
          
          {/* Desktop View (Table Layout) */}
          <table className="min-w-full divide-y divide-[#2C2F36] hidden md:table">
            <thead className="bg-[#1A1C20] backdrop-blur-sm">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Machine Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Technician
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#9CA3AF] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C2F36]">
              {complaints.map((complaint, index) => (
                <ComplaintRow
                  key={complaint.id}
                  complaint={complaint}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onOpenDetails={handleViewDetails}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
});

interface ComplaintCardProps {
  complaint: Complaint;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onEdit: (complaint: Complaint) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (complaint: Complaint) => void;
  index: number;
}

const ComplaintCard = memo(function ComplaintCard({ 
  complaint, 
  isExpanded, 
  onToggleExpand, 
  onEdit, 
  onDelete,
  onOpenDetails,
  index
}: ComplaintCardProps) {
  return (
    <motion.div
      className="glass-card overflow-hidden hw-accelerated cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      whileHover={{ scale: 1.005 }}
      layout
      onClick={() => onOpenDetails(complaint)}
    >
      <div className="glass-card-header flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
        <div>
          <span className="text-xs text-[#9CA3AF]">{complaint.complaint_number}</span>
          <h3 className="text-[#EAEAEA] font-medium">{complaint.customer_name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {complaint.status === 'Open' ? (
            <span className="badge badge-yellow">Open</span>
          ) : (
            <span className="badge badge-green">Closed</span>
          )}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(complaint.id);
            }}
            className="text-[#9CA3AF] hover:text-[#EAEAEA] transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="hw-accelerated"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="glass-card-body text-sm">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <div className="text-[#9CA3AF]">Date</div>
                  <div className="text-[#EAEAEA]">{complaint.date}</div>
                </div>
                <div>
                  <div className="text-[#9CA3AF]">Machine</div>
                  <div className="text-[#EAEAEA]">{complaint.machine_type}</div>
                </div>
                <div>
                  <div className="text-[#9CA3AF]">Contact</div>
                  <div className="text-[#EAEAEA]">{complaint.contact_number || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-[#9CA3AF]">Machine Number</div>
                  <div className="text-[#EAEAEA]">{complaint.machine_number}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-[#9CA3AF]">Fault</div>
                  <div className="text-[#EAEAEA]">{complaint.fault}</div>
                </div>
                <div className="col-span-2 pt-2">
                  <button 
                    className="btn-primary w-full"
                    onClick={() => onOpenDetails(complaint)}
                  >
                    View Complete Details
                  </button>
                </div>
              </div>
            </div>
            
            <div className="glass-card-footer flex justify-end space-x-2">
              <button 
                className="btn-outline py-1 px-2 text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(complaint);
                }}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button 
                className="bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#F87171] rounded-md py-1 px-2 text-sm hover:bg-[#EF4444]/30 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(complaint.id);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

interface ComplaintRowProps {
  complaint: Complaint;
  onEdit: (complaint: Complaint) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (complaint: Complaint) => void;
  index: number;
}

const ComplaintRow = memo(function ComplaintRow({ 
  complaint, 
  onEdit, 
  onDelete, 
  onOpenDetails,
  index 
}: ComplaintRowProps) {
  return (
    <motion.tr
      className="hover:bg-[#2A2E38] transition-colors hw-accelerated cursor-pointer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15, delay: index * 0.02 }}
      onClick={() => onOpenDetails(complaint)}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-sm font-medium text-[#EAEAEA]">{complaint.customer_name}</div>
          <div className="text-sm text-[#9CA3AF]">{complaint.contact_number || 'No contact'}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <div className="text-sm text-[#EAEAEA]">{complaint.machine_type}</div>
          <div className="text-sm text-[#9CA3AF]">{complaint.machine_number}</div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA]">
        {complaint.date}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        {complaint.status === 'Open' ? (
          <span className="badge badge-yellow flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Open</span>
          </span>
        ) : (
          <span className="badge badge-green flex items-center space-x-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Closed</span>
          </span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#EAEAEA]">
        {complaint.technician_name || 'Unassigned'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm" onClick={(e) => e.stopPropagation()}>
        <button
          className="text-[#7C3AED] hover:text-[#A78BFA] mx-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(complaint);
          }}
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          className="text-[#EF4444] hover:text-[#F87171] mx-2 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(complaint.id);
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </motion.tr>
  );
});