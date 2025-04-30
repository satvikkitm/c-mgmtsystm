import React, { useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import { ComplaintFormData, Complaint } from '../types/complaint';

interface ComplaintFormProps {
  onSubmit: (data: ComplaintFormData) => Promise<void>;
  initialData?: Complaint;
  onCancel: () => void;
  isEditMode?: boolean;
}

export function ComplaintForm({ onSubmit, initialData, onCancel, isEditMode = false }: ComplaintFormProps) {
  const [formData, setFormData] = useState<ComplaintFormData>({
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
    customer_name: initialData?.customer_name || '',
    address: initialData?.address || '',
    contact_number: initialData?.contact_number || '',
    company_complaint_number: initialData?.company_complaint_number || 'N/A',
    machine_type: initialData?.machine_type || '',
    machine_number: initialData?.machine_number || 'N/A',
    machine_capacity: initialData?.machine_capacity || 'N/A',
    fault: initialData?.fault || '',
    status: initialData?.status || 'Open',
    technician_name: initialData?.technician_name || '',
    resolution: initialData?.resolution || '',
  });
  
  const [formSection, setFormSection] = useState<'customer' | 'machine' | 'service'>('customer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <motion.h2 
          className="text-2xl font-bold text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isEditMode ? 'Edit Complaint' : 'New Complaint'}
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center text-gray-300 hover:text-white transition-colors"
          onClick={onCancel}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </motion.button>
      </div>
      
      {/* Form Navigation */}
      <div className="mb-8">
        <div className="flex space-x-2 items-center p-1 bg-gray-800/50 backdrop-blur-sm rounded-lg">
          <NavButton 
            isActive={formSection === 'customer'} 
            onClick={() => setFormSection('customer')}
            label="Customer Details"
          />
          <NavButton 
            isActive={formSection === 'machine'} 
            onClick={() => setFormSection('machine')}
            label="Machine Info"
          />
          <NavButton 
            isActive={formSection === 'service'} 
            onClick={() => setFormSection('service')}
            label="Service & Status"
          />
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-gray-800/30 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-xl overflow-hidden">
          <div className="p-6">
            {formSection === 'customer' && (
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={formVariants}
              >
                <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-2 mb-4">Customer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormField
                    label="Customer Name"
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-input"
                      rows={2}
                      placeholder="Customer address"
                    />
                  </div>
                  
                  <FormField
                    label="Contact Number"
                    type="text"
                    name="contact_number"
                    value={formData.contact_number || ''}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />

                  <FormField
                    label="Company Complaint Number"
                    type="text"
                    name="company_complaint_number"
                    value={formData.company_complaint_number || 'N/A'}
                    onChange={handleChange}
                    placeholder="Company complaint reference"
                  />
                </div>
              </motion.div>
            )}
            
            {formSection === 'machine' && (
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={formVariants}
              >
                <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-2 mb-4">Machine Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Machine Number"
                    type="text"
                    name="machine_number"
                    value={formData.machine_number}
                    onChange={handleChange}
                    placeholder="Machine serial number or ID"
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Machine Type</label>
                    <select
                      name="machine_type"
                      value={formData.machine_type}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Machine Type</option>
                      <option value="WM">Washing Machine</option>
                      <option value="Fridge">Refrigerator</option>
                      <option value="AC">Air Conditioner</option>
                      <option value="TV">Television</option>
                      <option value="FOW">FOW</option>
                      <option value="Defridge">Defridge</option>
                      <option value="Visi Cooler">Visi Cooler</option>
                      <option value="Water Cooler">Water Cooler</option>
                      <option value="Dispenser">Dispenser</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <FormField
                    label="Machine Capacity"
                    type="text"
                    name="machine_capacity"
                    value={formData.machine_capacity || 'N/A'}
                    onChange={handleChange}
                    placeholder="Capacity specification"
                  />
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Fault Description</label>
                    <textarea
                      name="fault"
                      value={formData.fault}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Describe the fault or problem with the machine"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}
            
            {formSection === 'service' && (
              <motion.div 
                className="space-y-6"
                initial="hidden"
                animate="visible"
                variants={formVariants}
              >
                <h3 className="text-xl font-semibold text-white border-b border-gray-700/50 pb-2 mb-4">Service Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    label="Technician Name"
                    type="text"
                    name="technician_name"
                    value={formData.technician_name || ''}
                    onChange={handleChange}
                    placeholder="Technician who handled the complaint"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="form-input"
                      required
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Resolution Notes</label>
                    <textarea
                      name="resolution"
                      value={formData.resolution}
                      onChange={handleChange}
                      className="form-input"
                      rows={3}
                      placeholder="Notes about how the complaint was resolved"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          <div className="px-6 py-4 bg-gray-800/50 border-t border-gray-700/50 flex justify-between items-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                console.log("Cancel button clicked");
                onCancel();
              }}
              className="btn-outline"
            >
              Cancel
            </button>
            
            <div className="flex space-x-2">
              {formSection === 'customer' && (
                <button 
                  type="button" 
                  onClick={() => setFormSection('machine')}
                  className="btn-primary"
                >
                  Next: Machine Info
                </button>
              )}
              
              {formSection === 'machine' && (
                <>
                  <button 
                    type="button" 
                    onClick={() => setFormSection('customer')}
                    className="btn-outline"
                  >
                    Previous
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setFormSection('service')}
                    className="btn-primary"
                  >
                    Next: Service Details
                  </button>
                </>
              )}
              
              {formSection === 'service' && (
                <>
                  <button 
                    type="button" 
                    onClick={() => setFormSection('machine')}
                    className="btn-outline"
                  >
                    Previous
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isEditMode ? 'Update Complaint' : 'Save Complaint'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
}

function FormField({ label, type, name, value, onChange, placeholder, required }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="form-input"
      />
    </div>
  );
}

interface NavButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

function NavButton({ isActive, onClick, label }: NavButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
        isActive 
          ? 'bg-[#7C3AED] text-white' 
          : 'bg-transparent text-gray-400 hover:text-white'
      }`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      {label}
    </motion.button>
  );
}