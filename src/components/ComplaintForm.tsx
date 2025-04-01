import React, { useState } from 'react';
import { format } from 'date-fns';
import { ComplaintFormData, Complaint } from '../types/complaint';

interface ComplaintFormProps {
  onSubmit: (data: ComplaintFormData) => Promise<void>;
  initialData?: Complaint;
  onCancel: () => void;
}

export function ComplaintForm({ onSubmit, initialData, onCancel }: ComplaintFormProps) {
  const [formData, setFormData] = useState<ComplaintFormData>({
    date: initialData?.date || format(new Date(), 'yyyy-MM-dd'),
    customer_name: initialData?.customer_name || '',
    address: initialData?.address || '',
    place: initialData?.place || '',
    contact_number: initialData?.contact_number || '',
    machine_type: initialData?.machine_type || '',
    company: initialData?.company || '',
    fault: initialData?.fault || '',
    work_done: initialData?.work_done || '',
    parts_used: initialData?.parts_used || '',
    cost: initialData?.cost || 0,
    technician_name: initialData?.technician_name || '',
    completion_date: initialData?.completion_date || null,
    status: initialData?.status || 'Open',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      completion_date: formData.completion_date || null
    };
    await onSubmit(formattedData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cost') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else if (name === 'completion_date') {
      setFormData(prev => ({
        ...prev,
        [name]: value || null
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Customer Name</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Place</label>
          <input
            type="text"
            name="place"
            value={formData.place}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Contact Number</label>
          <input
            type="text"
            name="contact_number"
            value={formData.contact_number}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Machine Type</label>
          <select
            name="machine_type"
            value={formData.machine_type}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select Machine Type</option>
            <option value="WM">Washing Machine</option>
            <option value="Fridge">Refrigerator</option>
            <option value="AC">Air Conditioner</option>
            <option value="TV">Television</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Fault Description</label>
          <textarea
            name="fault"
            value={formData.fault}
            onChange={handleChange}
            className="input-field"
            placeholder="Describe the fault or problem with the machine"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Work Done</label>
          <textarea
            name="work_done"
            value={formData.work_done}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Parts Used</label>
          <textarea
            name="parts_used"
            value={formData.parts_used}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Cost (Rs.)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Technician Name</label>
          <input
            type="text"
            name="technician_name"
            value={formData.technician_name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Completion Date</label>
          <input
            type="date"
            name="completion_date"
            value={formData.completion_date || ''}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          {initialData ? 'Update' : 'Submit'}
        </button>
      </div>
    </form>
  );
}