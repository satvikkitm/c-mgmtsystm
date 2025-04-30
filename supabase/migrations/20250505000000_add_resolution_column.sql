/*
  # Add Resolution Column to Complaints Table

  1. New Field
    - `resolution` (text, default: '')

  This field stores the resolution notes for completed complaints.
*/

-- Ensure resolution column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'complaints' AND column_name = 'resolution'
  ) THEN
    ALTER TABLE complaints ADD COLUMN resolution text NOT NULL DEFAULT '';
  END IF;
END $$; 