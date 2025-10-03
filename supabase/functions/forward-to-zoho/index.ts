const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
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
    // Get the registration data from the request
    const registrationData = await req.json();
    
    console.log("📨 Received registration data:", registrationData);

    // Forward the data to Zoho Flow webhook
    const zohoWebhookUrl = "https://flow.zoho.com/796305666/flow/webhook/incoming?zapikey=1001.5f6e0518816fe64954ad30c68eb49cbc.3a175b4e7e2ee05c3da96ce5e3ec08f1&isdebug=false";
    
    console.log("🚀 Forwarding to Zoho Flow...");
    
    const zohoResponse = await fetch(zohoWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    console.log("📡 Zoho Flow response status:", zohoResponse.status);
    
    let zohoResponseData;
    const contentType = zohoResponse.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      zohoResponseData = await zohoResponse.json();
    } else {
      zohoResponseData = await zohoResponse.text();
    }
    
    console.log("📋 Zoho Flow response data:", zohoResponseData);

    if (zohoResponse.ok) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Registration forwarded to Zoho Flow successfully",
          zohoStatus: zohoResponse.status,
          zohoResponse: zohoResponseData
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } else {
      console.error("❌ Zoho Flow error:", zohoResponseData);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to forward to Zoho Flow",
          zohoStatus: zohoResponse.status,
          zohoResponse: zohoResponseData
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

  } catch (error) {
    console.error("💥 Edge function error:", error);
    
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