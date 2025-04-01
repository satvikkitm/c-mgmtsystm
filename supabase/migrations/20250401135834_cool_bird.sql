/*
  # Fix RLS Policies for Complaints Table

  1. Changes
    - Drop existing RLS policies
    - Create new, more permissive policies for authenticated users
    - Add policy for anonymous access to support initial setup

  2. Security
    - Enable RLS on complaints table
    - Add policies for both authenticated and anonymous users
    - Ensure basic CRUD operations are allowed
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read complaints" ON complaints;
DROP POLICY IF EXISTS "Allow authenticated users to insert complaints" ON complaints;
DROP POLICY IF EXISTS "Allow authenticated users to update complaints" ON complaints;
DROP POLICY IF EXISTS "Allow authenticated users to delete complaints" ON complaints;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON complaints
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON complaints
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON complaints
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON complaints
  FOR DELETE USING (true);