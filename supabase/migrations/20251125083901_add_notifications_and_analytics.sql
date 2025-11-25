/*
  # Admin Dashboard: Notifications and Analytics

  ## Overview
  This migration adds support for an enhanced admin dashboard with notifications,
  analytics tracking, and email alerts for quote/invoice requests.

  ## New Tables

  ### 1. `admin_notifications`
  Tracks all admin notifications including sign-ups, enrollments, and feedback.
  - `id` (uuid, primary key) - Unique notification identifier
  - `type` (text) - Type of notification: 'signup', 'enrollment', 'feedback', 'quote_request'
  - `title` (text) - Short notification title
  - `message` (text) - Detailed notification message
  - `metadata` (jsonb) - Additional data (user info, course details, etc.)
  - `read` (boolean) - Whether admin has read this notification
  - `created_at` (timestamptz) - When notification was created

  ### 2. `quote_requests`
  Stores quote and invoice requests that trigger email alerts.
  - `id` (uuid, primary key) - Unique request identifier
  - `registration_id` (uuid, foreign key) - Links to registrations table
  - `request_type` (text) - 'quote' or 'invoice'
  - `status` (text) - Request status: 'pending', 'sent', 'completed'
  - `email_sent` (boolean) - Whether email notification was sent
  - `created_at` (timestamptz) - When request was created
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `dashboard_analytics`
  Tracks aggregated analytics data for the dashboard.
  - `id` (uuid, primary key) - Unique analytics record identifier
  - `metric_type` (text) - Type of metric: 'course_view', 'signup', 'completion'
  - `metric_value` (integer) - Numeric value of the metric
  - `course_id` (text, nullable) - Related course if applicable
  - `metadata` (jsonb) - Additional context data
  - `recorded_at` (timestamptz) - When metric was recorded

  ## Security
  - All tables have RLS enabled
  - Only authenticated admin users can access these tables
  - All tables use auth.uid() for access control

  ## Notes
  - Notifications are created automatically via triggers or application code
  - Analytics data can be aggregated for weekly/monthly reports
  - Email alerts are handled via Supabase Edge Functions
*/

-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all notifications"
  ON admin_notifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    )
  );

CREATE POLICY "Admin users can update notifications"
  ON admin_notifications FOR UPDATE
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

-- Create quote_requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES registrations(id) ON DELETE CASCADE,
  request_type text NOT NULL,
  status text DEFAULT 'pending',
  email_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all quote requests"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    )
  );

CREATE POLICY "Admin users can update quote requests"
  ON quote_requests FOR UPDATE
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

-- Create dashboard_analytics table
CREATE TABLE IF NOT EXISTS dashboard_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type text NOT NULL,
  metric_value integer DEFAULT 0,
  course_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  recorded_at timestamptz DEFAULT now()
);

ALTER TABLE dashboard_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can view all analytics"
  ON dashboard_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE auth.users.id = auth.uid())
    )
  );

CREATE POLICY "Admin users can insert analytics"
  ON dashboard_analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.email = (SELECT email FROM auth.users WHERE admin_users.id = auth.uid())
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notifications_read ON admin_notifications(read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON admin_notifications(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON dashboard_analytics(metric_type, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_course ON dashboard_analytics(course_id, recorded_at DESC);

-- Create function to track registration signups
CREATE OR REPLACE FUNCTION track_registration_signup()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (type, title, message, metadata)
  VALUES (
    'signup',
    'New Registration',
    NEW.name || ' signed up for ' || NEW.course_selection,
    jsonb_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'course', NEW.course_selection,
      'company', NEW.company_name,
      'seats', NEW.number_of_seats
    )
  );

  INSERT INTO dashboard_analytics (metric_type, metric_value, course_id, metadata)
  VALUES (
    'signup',
    1,
    NEW.course_selection,
    jsonb_build_object('registration_id', NEW.id)
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new registrations
DROP TRIGGER IF EXISTS on_registration_created ON registrations;
CREATE TRIGGER on_registration_created
  AFTER INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION track_registration_signup();

-- Update admin_users table to track last login
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admin_users' AND column_name = 'last_dashboard_view'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN last_dashboard_view timestamptz DEFAULT now();
  END IF;
END $$;
