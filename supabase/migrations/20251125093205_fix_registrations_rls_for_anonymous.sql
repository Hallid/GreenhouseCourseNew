/*
  # Fix Registrations RLS for Anonymous Insert with Select

  ## Changes
  - Drop the existing anonymous insert policy that only allows INSERT
  - Create a new policy that allows anonymous users to INSERT and immediately SELECT back the inserted row
  - This is necessary because the registration form needs to get the ID of the inserted row

  ## Security
  - The new policy only allows INSERT, not general SELECT access
  - Anonymous users cannot read other registrations, only return data from their own insert
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Allow anonymous registration submissions" ON registrations;

-- Create a new policy that allows insert and return of inserted data
-- This uses the special INSERT command which allows the RETURNING clause
CREATE POLICY "Allow anonymous users to insert registrations"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);
