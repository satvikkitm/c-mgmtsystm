/*
  # Add fault column to complaints table

  1. Changes
    - Add `fault` column to `complaints` table to store machine fault descriptions
    - Make the column required to ensure fault is always documented
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'complaints' AND column_name = 'fault'
  ) THEN
    ALTER TABLE complaints ADD COLUMN fault text NOT NULL DEFAULT '';
  END IF;
END $$;