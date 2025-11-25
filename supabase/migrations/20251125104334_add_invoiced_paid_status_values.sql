/*
  # Add invoiced and paid status values
  
  1. Changes
    - Update registrations table status column to support 'invoiced' and 'paid' values
    - Status can now be: 'pending', 'invoiced', or 'paid'
    - This enables tracking conversion funnel from registration to payment
  
  2. Security
    - No RLS changes needed
    - Existing policies still apply
*/

-- The status column already exists, we just need to ensure it can accept the new values
-- PostgreSQL text columns don't need schema changes for new values
-- This migration serves as documentation that we're now using these statuses

-- Add a comment to document the valid status values
COMMENT ON COLUMN registrations.status IS 'Registration status: pending, invoiced, or paid';
