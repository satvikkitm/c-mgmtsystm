import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Plus, Loader } from 'lucide-react';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintList } from './components/ComplaintList';
import { SearchFilters } from './components/SearchFilters';
import { ExportData } from './components/ExportData';
import { Layout } from './components/Layout';
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
  const [currentView, setCurrentView] = useState<'dashboard' | 'new' | 'search'>('dashboard');

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    // When navigating to "new" view, show the form
    if (currentView === 'new') {
      setShowForm(true);
      setEditingComplaint(null);
    }
    // When navigating to "search", ensure we're showing the complaint list
    else if (currentView === 'search') {
      setShowForm(false);
    }
  }, [currentView]);

  const loadComplaints = useCallback(async () => {
    try {
      const data = await getComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error loading complaints:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (formData: ComplaintFormData) => {
    try {
      if (editingComplaint) {
        await updateComplaint(editingComplaint.id, formData);
      } else {
        await addComplaint(formData);
      }
      await loadComplaints();
      setShowForm(false);
      setCurrentView('dashboard');
      setEditingComplaint(null);
    } catch (error) {
      console.error('Error saving complaint:', error);
    }
  }, [editingComplaint, loadComplaints]);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;

    try {
      await deleteComplaint(id);
      await loadComplaints();
    } catch (error) {
      console.error('Error deleting complaint:', error);
    }
  }, [loadComplaints]);

  const handleEdit = useCallback((complaint: Complaint) => {
    setEditingComplaint(complaint);
    setShowForm(true);
    setCurrentView('new');
  }, []);

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingComplaint(null);
    setCurrentView('dashboard');
  }, []);

  const handleNewComplaint = useCallback(() => {
    setShowForm(true);
    setEditingComplaint(null);
    setCurrentView('new');
  }, []);

  const handleNavigate = useCallback((view: 'dashboard' | 'new' | 'search') => {
    setCurrentView(view);
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(complaint => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        complaint.customer_name.toLowerCase().includes(searchLower) ||
        (complaint.machine_number && complaint.machine_number.toLowerCase().includes(searchLower)) ||
        (complaint.contact_number && complaint.contact_number.toLowerCase().includes(searchLower));
      
      const matchesDate = !dateFilter || complaint.date === dateFilter;
      const matchesStatus = !statusFilter || complaint.status === statusFilter;
      
      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [complaints, searchTerm, dateFilter, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0E0F12]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="hw-accelerated"
        >
          <Loader className="h-10 w-10 text-[#7C3AED]" />
        </motion.div>
      </div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <Layout currentView={currentView} onNavigate={handleNavigate}>
        <AnimatePresence mode="wait" initial={false}>
          {showForm ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="hw-accelerated"
            >
              <ComplaintForm
                onSubmit={handleSubmit}
                initialData={editingComplaint || undefined}
                onCancel={handleCancelForm}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-6 hw-accelerated"
            >
              <div className="flex justify-between items-center">
                <motion.h1 
                  className="text-2xl font-bold text-[#EAEAEA]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {currentView === 'dashboard' ? 'Dashboard' : 'Search Complaints'}
                </motion.h1>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.1 }}
                  className="btn-primary flex items-center hw-accelerated"
                  onClick={handleNewComplaint}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Complaint
                </motion.button>
              </div>

              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                dateFilter={dateFilter}
                onDateFilterChange={setDateFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />

              <ExportData complaints={filteredComplaints} />

              <ComplaintList
                complaints={filteredComplaints}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </MotionConfig>
  );
}

export default App;