import { supabase } from './supabase';
import { Complaint, ComplaintFormData } from '../types/complaint';

// Generate complaint number
const generateComplaintNumber = () => `COMP${Date.now().toString().slice(-6)}`;

// Get complaints from Supabase
export const getComplaints = async (): Promise<Complaint[]> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Failed to fetch complaints:', error);
    throw error;
  }
};

// Add new complaint
export const addComplaint = async (complaintData: ComplaintFormData): Promise<Complaint> => {
  try {
    const newComplaint = {
      ...complaintData,
      complaint_number: generateComplaintNumber(),
    };

    const { data, error } = await supabase
      .from('complaints')
      .insert([newComplaint])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from insert operation');
    }

    return data;
  } catch (error) {
    console.error('Failed to add complaint:', error);
    throw error;
  }
};

// Update complaint
export const updateComplaint = async (id: string, complaintData: ComplaintFormData): Promise<Complaint> => {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .update(complaintData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from update operation');
    }

    return data;
  } catch (error) {
    console.error('Failed to update complaint:', error);
    throw error;
  }
};

// Delete complaint
export const deleteComplaint = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete complaint:', error);
    throw error;
  }
};