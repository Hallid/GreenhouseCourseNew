import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Only POST method allowed" }),
      {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const webhookData = await req.json();
    console.log("📨 Received webhook data:", webhookData);

    const timestamp = new Date().toISOString();

    const fullName = webhookData.full_name || 
      `${webhookData.first_name || ''} ${webhookData.surname || ''}`.trim() || 
      webhookData.name || 
      'Unknown';

    const registrationData = {
      name: fullName,
      email: webhookData.email,
      phone: webhookData.phone,
      company_name: webhookData.company_name || null,
      course_selection: webhookData.course_selection,
      number_of_seats: webhookData.number_of_seats || 1,
      submission_date: timestamp,
      status: 'pending'
    };

    console.log("💾 Inserting registration:", registrationData);

    const { data: registration, error: regError } = await supabase
      .from("registrations")
      .insert([registrationData])
      .select()
      .single();

    if (regError) {
      console.error("❌ Registration insert error:", regError);
      throw regError;
    }

    console.log("✅ Registration created:", registration);

    const notificationData = {
      type: webhookData.action_type === 'quote' ? 'quote_request' : 'signup',
      title: webhookData.action_type === 'quote' 
        ? 'New Quote Request' 
        : 'New Registration',
      message: `${fullName} ${webhookData.action_type === 'quote' ? 'requested a quote' : 'signed up'} for ${webhookData.course_selection}`,
      metadata: {
        name: fullName,
        email: webhookData.email,
        course: webhookData.course_selection,
        company: webhookData.company_name,
        seats: webhookData.number_of_seats || 1,
        registration_id: registration.id,
        timestamp: timestamp
      },
      read: false,
      created_at: timestamp
    };

    console.log("📬 Creating notification:", notificationData);

    const { error: notifError } = await supabase
      .from("admin_notifications")
      .insert([notificationData]);

    if (notifError) {
      console.error("⚠️ Notification insert error (non-critical):", notifError);
    } else {
      console.log("✅ Notification created");
    }

    const analyticsData = {
      metric_type: webhookData.action_type === 'quote' ? 'quote_request' : 'signup',
      metric_value: 1,
      course_id: webhookData.course_selection,
      metadata: {
        registration_id: registration.id,
        seats: webhookData.number_of_seats || 1,
        timestamp: timestamp
      },
      recorded_at: timestamp
    };

    console.log("📊 Creating analytics record:", analyticsData);

    const { error: analyticsError } = await supabase
      .from("dashboard_analytics")
      .insert([analyticsData]);

    if (analyticsError) {
      console.error("⚠️ Analytics insert error (non-critical):", analyticsError);
    } else {
      console.log("✅ Analytics record created");
    }

    if (webhookData.action_type === 'quote') {
      const quoteRequestData = {
        registration_id: registration.id,
        request_type: 'quote',
        status: 'pending',
        email_sent: false,
        created_at: timestamp,
        updated_at: timestamp
      };

      console.log("💰 Creating quote request:", quoteRequestData);

      const { error: quoteError } = await supabase
        .from("quote_requests")
        .insert([quoteRequestData]);

      if (quoteError) {
        console.error("⚠️ Quote request insert error (non-critical):", quoteError);
      } else {
        console.log("✅ Quote request created");
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Registration recorded successfully",
        registration_id: registration.id,
        timestamp: timestamp
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error("💥 Webhook processing error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
        details: error.message
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});
