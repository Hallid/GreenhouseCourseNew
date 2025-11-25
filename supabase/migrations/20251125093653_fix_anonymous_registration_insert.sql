/*
  # Fix Anonymous Registration Insert

  ## Problem
  Anonymous users are getting "new row violates row-level security policy" error
  when trying to insert registrations.

  ## Solution
  1. Drop all existing policies on registrations table
  2. Recreate them with proper configuration for anonymous inserts
  3. Ensure both 'anon' and 'authenticated' roles have correct permissions

  ## Security
  - Anonymous users can only INSERT new registrations
  - Authenticated admin users can view and manage all registrations
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow admin users to manage registrations" ON registrations;
DROP POLICY IF EXISTS "Allow admin users to read registrations" ON registrations;
DROP POLICY IF EXISTS "Allow anonymous users to insert registrations" ON registrations;
DROP POLICY IF EXISTS "Allow anonymous registration submissions" ON registrations;

-- Create policy for anonymous users to insert registrations
CREATE POLICY "Enable insert for anon users"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy for anonymous users via public role (fallback)
CREATE POLICY "Enable insert for public users"
  ON registrations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for admin users to select registrations
CREATE POLICY "Enable read for authenticated admin users"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    )
  );

-- Create policy for admin users to update registrations
CREATE POLICY "Enable update for authenticated admin users"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    )
  );

-- Create policy for admin users to delete registrations
CREATE POLICY "Enable delete for authenticated admin users"
  ON registrations
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    )
  );
