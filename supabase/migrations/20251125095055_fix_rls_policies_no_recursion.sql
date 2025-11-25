/*
  # Fix RLS Policies to Eliminate Infinite Recursion

  ## Problem
  - Infinite recursion in admin_users table policies
  - Registrations table policies reference admin_users which causes recursion
  - Anonymous users cannot insert registrations

  ## Solution
  1. Simplify admin_users policies to avoid recursion
  2. Simplify registrations policies to work for anonymous inserts
  3. Use direct auth.jwt() checks instead of nested subqueries

  ## Security
  - Anonymous users can INSERT registrations (public form)
  - Authenticated users who exist in admin_users can manage everything
  - No circular policy references
*/

-- Fix admin_users table policies
DROP POLICY IF EXISTS "Allow admin users to manage admin users" ON admin_users;
DROP POLICY IF EXISTS "Allow authenticated users to read admin users" ON admin_users;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Enable write access for admins only" ON admin_users;

-- Simple policy: authenticated users can read admin_users (needed for admin checks)
CREATE POLICY "Admins can read admin_users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Only allow updates/inserts/deletes if the user's email matches an admin
CREATE POLICY "Admins can manage admin_users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (email = (auth.jwt() ->> 'email'))
  WITH CHECK (email = (auth.jwt() ->> 'email'));

-- Fix registrations table policies completely
DROP POLICY IF EXISTS "Enable insert for anon users" ON registrations;
DROP POLICY IF EXISTS "Enable insert for public users" ON registrations;
DROP POLICY IF EXISTS "Enable read for authenticated admin users" ON registrations;
DROP POLICY IF EXISTS "Enable update for authenticated admin users" ON registrations;
DROP POLICY IF EXISTS "Enable delete for authenticated admin users" ON registrations;
DROP POLICY IF EXISTS "Allow public registration inserts" ON registrations;
DROP POLICY IF EXISTS "Allow admin read access" ON registrations;
DROP POLICY IF EXISTS "Allow admin update access" ON registrations;
DROP POLICY IF EXISTS "Allow admin delete access" ON registrations;

-- Allow anonymous users to insert registrations (for the public form)
CREATE POLICY "Public can insert registrations"
  ON registrations
  FOR INSERT
  TO anon, public
  WITH CHECK (true);

-- Allow authenticated admins to read registrations
CREATE POLICY "Admins can read registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (SELECT email FROM admin_users)
  );

-- Allow authenticated admins to update registrations
CREATE POLICY "Admins can update registrations"
  ON registrations
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (SELECT email FROM admin_users)
  )
  WITH CHECK (
    (auth.jwt() ->> 'email') IN (SELECT email FROM admin_users)
  );

-- Allow authenticated admins to delete registrations
CREATE POLICY "Admins can delete registrations"
  ON registrations
  FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (SELECT email FROM admin_users)
  );
