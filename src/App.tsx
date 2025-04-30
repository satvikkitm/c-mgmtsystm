import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Plus, Loader, ArrowLeft } from 'lucide-react';
import { ComplaintForm } from './components/ComplaintForm';
import { ComplaintList } from './components/ComplaintList';
import { ComplaintDetails } from './components/ComplaintDetails';
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
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentView, setCurrentView] = useState<'dashboard' | 'new' | 'edit' | 'search'>('dashboard');

  useEffect(() => {
    loadComplaints();
  }, []);

  useEffect(() => {
    // When navigating to "new" or "edit" view, show the form
    if (currentView === 'new' || currentView === 'edit') {
      setShowForm(true);
      // If not edit mode, clear any existing complaint
      if (currentView === 'new') {
        setEditingComplaint(null);
      }
    }
    // When navigating to "search" or "dashboard", ensure we're showing the complaint list
    else if (currentView === 'search' || currentView === 'dashboard') {
      setShowForm(false);
      setEditingComplaint(null);
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

  // memoized navigation functions to ensure they don't change on every render
  const navigateToDashboard = useCallback(() => {
    console.log("Navigating to dashboard - resetting all states");
    // Explicitly reset all state values
    setShowForm(false);
    setEditingComplaint(null);
    setSelectedComplaint(null);
    // Set the current view last
    setCurrentView('dashboard');
  }, []);

  const navigateToNew = useCallback(() => {
    console.log("Navigating to new");
    setCurrentView('new');
    setShowForm(true);
    setEditingComplaint(null);
  }, []);

  const navigateToEdit = useCallback((complaint: Complaint) => {
    console.log("Navigating to edit mode for complaint:", complaint.id);
    setSelectedComplaint(null);
    setCurrentView('edit');
    setShowForm(true);
    setEditingComplaint(complaint);
  }, []);

  const navigateToSearch = useCallback(() => {
    console.log("Navigating to search");
    setCurrentView('search');
    setShowForm(false);
  }, []);

  const handleNavigate = useCallback((view: 'dashboard' | 'new' | 'edit' | 'search') => {
    console.log('Navigating to view:', view);
    
    if (view === 'dashboard') {
      console.log('Calling navigateToDashboard');
      navigateToDashboard();
    } else if (view === 'new') {
      console.log('Calling navigateToNew');
      navigateToNew();
    } else if (view === 'edit' && editingComplaint) {
      console.log('Calling navigateToEdit');
      navigateToEdit(editingComplaint);
    } else if (view === 'search') {
      console.log('Calling navigateToSearch');
      navigateToSearch();
    } else {
      console.log('Unknown view:', view);
    }
  }, [navigateToDashboard, navigateToNew, navigateToEdit, navigateToSearch, editingComplaint]);

  const handleSubmit = useCallback(async (formData: ComplaintFormData) => {
    try {
      if (editingComplaint) {
        await updateComplaint(editingComplaint.id, formData);
      } else {
        await addComplaint(formData);
      }
      await loadComplaints();
      console.log("Complaint saved, returning to dashboard");
      navigateToDashboard();
    } catch (error) {
      console.error('Error saving complaint:', error);
    }
  }, [editingComplaint, loadComplaints, navigateToDashboard]);

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
    console.log("Editing complaint:", complaint.id);
    // Clear any selected complaint to close any open modals
    setSelectedComplaint(null);
    // Navigate to edit mode with this complaint
    navigateToEdit(complaint);
  }, [navigateToEdit]);

  const handleCancelForm = useCallback(() => {
    console.log("Canceling form, returning to dashboard");
    navigateToDashboard();
  }, [navigateToDashboard]);

  const handleNewComplaint = useCallback(() => {
    console.log("Creating new complaint");
    navigateToNew();
  }, [navigateToNew]);

  const handleOpenDetails = useCallback((complaint: Complaint) => {
    console.log("Opening details for complaint:", complaint.id);
    setSelectedComplaint(complaint);
  }, []);

  const handleCloseDetails = useCallback(() => {
    console.log("Closing complaint details");
    setSelectedComplaint(null);
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
              <div className="mb-6 flex items-center justify-between">
                <motion.h1 
                  className="text-2xl font-bold text-[#EAEAEA]"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {currentView === 'edit' ? 'Edit Complaint' : 'New Complaint'}
                </motion.h1>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center text-gray-300 hover:text-white transition-colors"
                  onClick={handleCancelForm}
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Back to Dashboard
                </motion.button>
              </div>
              
              <ComplaintForm
                onSubmit={handleSubmit}
                initialData={editingComplaint || undefined}
                onCancel={handleCancelForm}
                isEditMode={currentView === 'edit'}
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
                onOpenDetails={handleOpenDetails}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
      
      {/* Complaint Details Modal */}
      <ComplaintDetails 
        complaint={selectedComplaint}
        onClose={handleCloseDetails}
        onEdit={handleEdit}
      />
    </MotionConfig>
  );
}

export default App;