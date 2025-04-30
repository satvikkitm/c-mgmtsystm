/*
  # Add Machine Details to Complaints Table

  1. New Fields
    - `company_complaint_number` (text, default: 'N/A')
    - `machine_number` (text, default: 'N/A')
    - `machine_capacity` (text, default: 'N/A')
    - `resolution` (text, default: '')

  These fields will provide more detailed information about the machine being serviced
  and resolution information.
*/

-- Add new columns to the complaints table
ALTER TABLE complaints 
  ADD COLUMN IF NOT EXISTS company_complaint_number text NOT NULL DEFAULT 'N/A',
  ADD COLUMN IF NOT EXISTS machine_number text NOT NULL DEFAULT 'N/A',
  ADD COLUMN IF NOT EXISTS machine_capacity text NOT NULL DEFAULT 'N/A',
  ADD COLUMN IF NOT EXISTS resolution text NOT NULL DEFAULT ''; 