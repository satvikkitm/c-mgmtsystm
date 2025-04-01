import React, { useEffect, useState } from 'react';
import { Plus, Loader } from 'lucide-react';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintList } from './components/ComplaintList';
import { SearchFilters } from './components/SearchFilters';
import { Complaint, ComplaintFormData } from './types/complaint';
import { getComplaints, addComplaint, updateComplaint, deleteComplaint } from './lib/storage';

function App() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    try {
      const data = await getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: ComplaintFormData) => {
    try {
      if (editingComplaint) {
        await updateComplaint(editingComplaint.id, formData);
      } else {
        await addComplaint(formData);
      }
      await loadComplaints();
      setShowForm(false);
      setEditingComplaint(null);
    } catch (error) {
      console.error('Error saving complaint:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await deleteComplaint(id);
      await loadComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  };

  const handleEdit = (complaint: Complaint) => {
    setEditingComplaint(complaint);
    setShowForm(true);
  };

  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || complaint.date === dateFilter;
    const matchesStatus = !statusFilter || complaint.status === statusFilter;
    return matchesSearch && matchesDate && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-100">
              Customer Complaints Management
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              <Plus className="h-5 w-5" />
              New Complaint
            </button>
          </div>

          {showForm ? (
            <div className="dark-card rounded-lg p-6">
              <ComplaintForm
                onSubmit={handleSubmit}
                initialData={editingComplaint || undefined}
                onCancel={() => {
                  setShowForm(false);
                  setEditingComplaint(null);
                }}
              />
            </div>
          ) : (
            <>
              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />

              <div className="dark-card rounded-lg overflow-hidden">
                <ComplaintList
                  complaints={filteredComplaints}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App