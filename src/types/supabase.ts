export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      complaints: {
        Row: {
          id: string
          complaint_number: string
          date: string
          customer_name: string
          address: string | null
          place: string | null
          contact_number: string | null
          machine_type: string
          company: string | null
          fault: string
          work_done: string | null
          parts_used: string | null
          cost: number | null
          technician_name: string | null
          completion_date: string | null
          status: string
          created_at: string | null
          updated_at: string | null
          company_complaint_number: string | null
          machine_number: string | null
          machine_capacity: string | null
        }
        Insert: {
          id?: string
          complaint_number: string
          date: string
          customer_name: string
          address?: string | null
          place?: string | null
          contact_number?: string | null
          machine_type: string
          company?: string | null
          fault: string
          work_done?: string | null
          parts_used?: string | null
          cost?: number | null
          technician_name?: string | null
          completion_date?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
          company_complaint_number?: string | null
          machine_number?: string | null
          machine_capacity?: string | null
        }
        Update: {
          id?: string
          complaint_number?: string
          date?: string
          customer_name?: string
          address?: string | null
          place?: string | null
          contact_number?: string | null
          machine_type?: string
          company?: string | null
          fault?: string
          work_done?: string | null
          parts_used?: string | null
          cost?: number | null
          technician_name?: string | null
          completion_date?: string | null
          status?: string
          created_at?: string | null
          updated_at?: string | null
          company_complaint_number?: string | null
          machine_number?: string | null
          machine_capacity?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}