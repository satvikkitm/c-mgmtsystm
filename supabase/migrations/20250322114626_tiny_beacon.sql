/*
  # Customer Complaints Management System Schema

  1. New Tables
    - `complaints`
      - `id` (uuid, primary key)
      - `complaint_number` (text, unique)
      - `date` (date)
      - `customer_name` (text)
      - `address` (text)
      - `place` (text)
      - `contact_number` (text)
      - `machine_type` (text)
      - `company` (text)
      - `work_done` (text)
      - `parts_used` (text)
      - `cost` (numeric)
      - `technician_name` (text)
      - `completion_date` (date)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `complaints` table
    - Add policies for authenticated users to perform CRUD operations
*/

CREATE TABLE complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number text UNIQUE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  customer_name text NOT NULL,
  address text,
  place text,
  contact_number text,
  machine_type text NOT NULL,
  company text,
  work_done text,
  parts_used text,
  cost numeric(10,2),
  technician_name text,
  completion_date date,
  status text NOT NULL DEFAULT 'Open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read complaints"
  ON complaints
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert complaints"
  ON complaints
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update complaints"
  ON complaints
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to delete complaints"
  ON complaints
  FOR DELETE
  TO authenticated
  USING (true);

-- Create an index for faster searches
CREATE INDEX idx_complaints_customer_name ON complaints(customer_name);
CREATE INDEX idx_complaints_date ON complaints(date);
CREATE INDEX idx_complaints_status ON complaints(status);