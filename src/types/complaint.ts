export interface Complaint {
  id: string;
  complaint_number: string;
  customer_name: string;
  contact_number?: string;
  address?: string;
  machine_type: string;
  machine_number: string;
  fault: string;
  date: string;
  status: 'Open' | 'Closed';
  technician_name?: string;
  resolution?: string;
}

export interface ComplaintFormData {
  customer_name: string;
  contact_number?: string;
  address?: string;
  machine_type: string;
  machine_number: string;
  fault: string;
  date: string;
  status: 'Open' | 'Closed';
  technician_name?: string;
  resolution?: string;
}