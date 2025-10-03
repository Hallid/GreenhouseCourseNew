/*
  # Complete Admin System Setup

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `created_at` (timestamp)
      - `last_sign_in_at` (timestamp)
    - `registrations`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `company_name` (text, optional)
      - `course_selection` (text)
      - `number_of_seats` (integer)
      - `submission_date` (timestamp)
      - `status` (text, default 'pending')
    - `course_dates`
      - `id` (text, primary key)
      - `course_code` (text)
      - `course_name` (text)
      - `upcoming_date` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin users to manage all data
    - Add policy for anonymous users to submit registrations
    - Add policy for authenticated users to read course dates

  3. Default Data
    - Insert default admin users
    - Insert default course dates for all three courses
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_sign_in_at timestamptz DEFAULT now()
);

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text,
  course_selection text NOT NULL,
  number_of_seats integer DEFAULT 1,
  submission_date timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

-- Create course_dates table
CREATE TABLE IF NOT EXISTS course_dates (
  id text PRIMARY KEY,
  course_code text NOT NULL,
  course_name text NOT NULL,
  upcoming_date text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_dates ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "Allow admin users to manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Allow authenticated users to read admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Registrations policies
CREATE POLICY "Allow admin users to manage registrations"
  ON registrations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Allow admin users to read registrations"
  ON registrations
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Allow anonymous registration submissions"
  ON registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Course dates policies
CREATE POLICY "Allow admin users to manage course dates"
  ON course_dates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Allow authenticated users to read course dates"
  ON course_dates
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default admin users
INSERT INTO admin_users (email, created_at, last_sign_in_at)
VALUES 
  ('idrissmithy@gmail.com', now(), now()),
  ('greenhousehallid@gmail.com', now(), now())
ON CONFLICT (email) DO NOTHING;

-- Insert default course dates
INSERT INTO course_dates (id, course_code, course_name, upcoming_date, updated_at)
VALUES 
  ('job-readiness-default', 'SP-201201', 'Job Readiness', 'Contact us for dates', now()),
  ('workplace-skills-default', 'SP-211009', 'Workplace Essential Skills', 'Contact us for dates', now()),
  ('new-venture-default', 'SP-2110010', 'New Venture Creation', 'Contact us for dates', now())
ON CONFLICT (id) DO UPDATE SET
  course_code = EXCLUDED.course_code,
  course_name = EXCLUDED.course_name,
  upcoming_date = EXCLUDED.upcoming_date,
  updated_at = now();