export interface Complaint {
  id: string;
  complaint_number: string;
  date: string;
  customer_name: string;
  address: string;
  place: string;
  contact_number: string;
  machine_type: string;
  company: string;
  fault: string;
  work_done: string;
  parts_used: string;
  cost: number;
  technician_name: string;
  completion_date: string | null;
  status: 'Open' | 'Closed';
  created_at: string;
  updated_at: string;
}

export interface ComplaintFormData extends Omit<Complaint, 'id' | 'created_at' | 'updated_at' | 'complaint_number'> {}