# Webhook Endpoint Documentation

## Overview
This document describes the webhook endpoint that records registration data into your admin dashboard.

## Endpoint Details

**URL:** `https://bvjedjvdqqjjqdgxqwqs.supabase.co/functions/v1/record-registration-webhook`

**Method:** POST

**Authentication:** None required (public webhook endpoint)

**Content-Type:** application/json

## Purpose
This webhook endpoint receives form registration data and automatically:
- Records the registration in the database with a timestamp
- Updates analytics metrics for the admin dashboard
- Creates admin notifications for new sign-ups
- Tracks quote/invoice requests separately
- **Forwards the data to Zoho Flow webhook** (maintains your existing workflow)

## Request Format

### JSON Payload
```json
{
  "first_name": "John",
  "surname": "Doe",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "0123456789",
  "company_name": "Example Corp",
  "vat_number": "4123456789",
  "course_selection": "Job Readiness (SP-201201)",
  "number_of_seats": 5,
  "action_type": "register",
  "submission_date": "2025-11-25T10:30:00.000Z"
}
```

### Required Fields
- `email` (string): User's email address
- `phone` (string): User's phone number
- `course_selection` (string): Selected course name
- `first_name` OR `full_name` (string): User's name

### Optional Fields
- `surname` (string): User's last name
- `company_name` (string): Company name
- `vat_number` (string): VAT registration number
- `number_of_seats` (integer): Number of seats requested (defaults to 1)
- `action_type` (string): Either "register" or "quote" (defaults to "register")
- `submission_date` (string): ISO 8601 timestamp (auto-generated if not provided)

## Response Format

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Registration recorded successfully and forwarded to Zoho Flow",
  "registration_id": "uuid-here",
  "timestamp": "2025-11-25T10:30:00.000Z"
}
```

### Error Response (500)
```json
{
  "success": false,
  "error": "Internal server error",
  "details": "Error message details"
}
```

## What Happens When Data is Received

1. **Registration Record Created**: A new entry is added to the `registrations` table with:
   - Full user details
   - Course selection
   - Number of seats
   - Submission timestamp
   - Status set to "pending"

2. **Admin Notification Created**: An admin notification is generated with:
   - Type: "signup" or "quote_request"
   - Title and message describing the action
   - Complete metadata about the registration
   - Unread status

3. **Analytics Updated**: A new analytics record is created with:
   - Metric type (signup or quote_request)
   - Course ID for tracking popular courses
   - Timestamp for trend analysis

4. **Quote Tracking** (if action_type = "quote"): A quote request record is created for follow-up

5. **Forwarded to Zoho Flow**: The original webhook data is forwarded to your Zoho Flow webhook automatically, maintaining your existing workflow

## Dashboard Impact

After sending data to this webhook, the admin dashboard will immediately show:
- New registration in the registrations list with timestamp
- Notification badge with unread count
- Updated analytics charts reflecting the new sign-up
- Course popularity metrics updated

## Testing the Webhook

You can test the webhook using curl:

```bash
curl -X POST https://bvjedjvdqqjjqdgxqwqs.supabase.co/functions/v1/record-registration-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Test User",
    "email": "test@example.com",
    "phone": "0123456789",
    "course_selection": "Job Readiness (SP-201201)",
    "number_of_seats": 1,
    "action_type": "register"
  }'
```

## Integration Notes

- This webhook receives data FIRST, records it in the database, then forwards to Zoho Flow
- This ensures your admin dashboard is always up-to-date
- Zoho Flow receives the exact same data it was receiving before
- If Zoho Flow is down or unreachable, the registration is still recorded in your database
- The registration form sends to this single webhook endpoint
- Timestamps are automatically recorded for every registration

## Security

- The endpoint is public and does not require authentication
- It only accepts POST requests
- Data is validated before insertion
- RLS policies protect database access
- Service role credentials are used internally (not exposed)

## Error Handling

The webhook is designed to be fault-tolerant:
- Database operations happen first to ensure data is recorded
- If Zoho Flow is unreachable, the registration is still saved in the database
- Zoho Flow forwarding errors are logged but don't cause the webhook to fail
- This ensures registrations are never lost, even if Zoho Flow is temporarily down
- The response indicates overall success/failure for monitoring purposes
