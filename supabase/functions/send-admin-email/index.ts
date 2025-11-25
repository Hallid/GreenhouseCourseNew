import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ADMIN_EMAIL = 'greenhousehallid@gmail.com';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { type, data } = await req.json();

    let emailSubject = '';
    let emailBody = '';

    if (type === 'quote_request' || type === 'invoice_request') {
      const { registration } = data;
      
      emailSubject = `New ${type === 'quote_request' ? 'Quote' : 'Invoice'} Request - ${registration.name}`;
      emailBody = `
        <h2>New ${type === 'quote_request' ? 'Quote' : 'Invoice'} Request</h2>
        <p>A new request has been submitted. Please log in to your dashboard to view details.</p>
        
        <h3>Registration Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${registration.name}</li>
          <li><strong>Email:</strong> ${registration.email}</li>
          <li><strong>Phone:</strong> ${registration.phone}</li>
          <li><strong>Company:</strong> ${registration.company_name || 'N/A'}</li>
          <li><strong>Course:</strong> ${registration.course_selection}</li>
          <li><strong>Number of Seats:</strong> ${registration.number_of_seats || 1}</li>
          <li><strong>Submitted:</strong> ${new Date(registration.submission_date).toLocaleString()}</li>
        </ul>
        
        <p><a href="https://greenhousebdacademy.co.za/admin/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #1BA098; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">Go to Dashboard</a></p>
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">This is an automated notification from Greenhouse BD Academy.</p>
      `;

      await supabase.from('quote_requests').insert({
        registration_id: registration.id,
        request_type: type === 'quote_request' ? 'quote' : 'invoice',
        email_sent: true,
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Greenhouse BD Academy <notifications@greenhousebdacademy.co.za>',
        to: [ADMIN_EMAIL],
        subject: emailSubject,
        html: emailBody,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error('Resend API error:', errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const emailResult = await emailResponse.json();

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error sending admin email:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});