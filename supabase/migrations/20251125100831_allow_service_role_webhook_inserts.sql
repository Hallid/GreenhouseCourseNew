/*
  # Allow Service Role to Insert Webhook Data

  ## Overview
  This migration adds RLS policies to allow the service role (used by edge functions)
  to insert data into tables when processing webhook data. This enables the
  record-registration-webhook edge function to record registrations, notifications,
  and analytics data.

  ## Changes
  - Add service role INSERT policies for registrations table
  - Add service role INSERT policies for admin_notifications table
  - Add service role INSERT policies for dashboard_analytics table
  - Add service role INSERT policies for quote_requests table

  ## Security Notes
  - These policies only grant INSERT permission to the service role
  - They do not affect existing user-facing policies
  - Service role is only used by trusted edge functions, not exposed to clients
*/

-- Allow service role to insert registrations (for webhook processing)
CREATE POLICY "Service role can insert registrations"
  ON registrations FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to insert notifications
CREATE POLICY "Service role can insert notifications"
  ON admin_notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to insert analytics
CREATE POLICY "Service role can insert analytics"
  ON dashboard_analytics FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Allow service role to insert quote requests
CREATE POLICY "Service role can insert quote requests"
  ON quote_requests FOR INSERT
  TO service_role
  WITH CHECK (true);
