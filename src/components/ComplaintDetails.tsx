import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Complaint } from '../types/complaint';

interface ComplaintDetailsProps {
  complaint: Complaint | null;
  onClose: () => void;
  onEdit: (complaint: Complaint) => void;
}

export const ComplaintDetails = memo(function ComplaintDetails({ 
  complaint, 
  onClose, 
  onEdit 
}: ComplaintDetailsProps) {
  if (!complaint) return null;

  return (
    <AnimatePresence>
      {complaint && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="modal-overlay"
            onClick={onClose}
          />
          
          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.2, type: "spring", bounce: 0.1 }}
            className="modal-content"
          >
            {/* Header with Title and Close button */}
            <div className="glass-card-header flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-bold text-white">{complaint.customer_name}</h2>
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
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(complaint);
                  }}
                  className="btn-primary text-sm py-1.5"
                >
                  <Edit2 className="h-4 w-4 mr-1.5" />
                  Edit Complaint
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 bg-[#2C2F36] text-[#9CA3AF] hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="glass-card-body grid grid-cols-1 md:grid-cols-2 gap-2 pt-1 pb-2">
              {/* Customer Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-[#9CA3AF] mb-1">Customer Information</h3>
                <div className="space-y-1.5">
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Customer Name</div>
                    <div className="text-[#EAEAEA] font-medium">{complaint.customer_name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Contact Number</div>
                    <div className="text-[#EAEAEA]">{complaint.contact_number || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Address</div>
                    <div className="text-[#EAEAEA]">{complaint.address || 'Not provided'}</div>
                  </div>
                </div>
              </div>
              
              {/* Machine Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-[#9CA3AF] mb-1">Machine Information</h3>
                <div className="space-y-1.5">
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Machine Type</div>
                    <div className="text-[#EAEAEA] font-medium">{complaint.machine_type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Machine Capacity</div>
                    <div className="text-[#EAEAEA]">{complaint.machine_capacity || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Machine Number</div>
                    <div className="text-[#EAEAEA]">{complaint.machine_number}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Company Complaint Number</div>
                    <div className="text-[#EAEAEA]">{complaint.company_complaint_number || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Complaint Number</div>
                    <div className="text-[#EAEAEA]">{complaint.complaint_number}</div>
                  </div>
                </div>
              </div>
              
              {/* Issue Details - Add negative top margin to reduce gap */}
              <div className="space-y-2 md:col-span-2 -mt-2">
                <h3 className="text-lg font-medium text-[#9CA3AF] mb-1">Complaint Details</h3>
                <div className="space-y-1.5">
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Date Reported</div>
                    <div className="text-[#EAEAEA]">{complaint.date}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Fault Description</div>
                    <div className="text-[#EAEAEA] p-2 bg-[#1F222A] rounded-lg">
                      {complaint.fault}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Service Details */}
              <div className="space-y-2 md:col-span-2">
                <h3 className="text-lg font-medium text-[#9CA3AF] mb-1">Service Information</h3>
                <div className="space-y-1.5">
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Assigned Technician</div>
                    <div className="text-[#EAEAEA]">{complaint.technician_name || 'Not assigned'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[#9CA3AF]">Status</div>
                    <div className="text-[#EAEAEA]">{complaint.status}</div>
                  </div>
                  {complaint.resolution && (
                    <div>
                      <div className="text-sm text-[#9CA3AF]">Resolution Notes</div>
                      <div className="text-[#EAEAEA] p-2 bg-[#1F222A] rounded-lg">
                        {complaint.resolution}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}); 