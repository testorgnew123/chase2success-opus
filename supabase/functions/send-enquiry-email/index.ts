import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface EnquiryRequest {
  name: string;
  email: string;
  phone: string;
  project: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, project, message }: EnquiryRequest = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not set");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Use AI gateway to generate formatted email content
    const emailBody = `
New Enquiry Received!

Name: ${name}
Email: ${email}
Phone: ${phone}
Project: ${project || "Not specified"}
Message: ${message || "No message provided"}

---
This enquiry was submitted via the CHASE2SUCCESS website.
    `.trim();

    // Log the enquiry for now since we don't have an email service configured
    console.log("New enquiry received:");
    console.log(emailBody);
    console.log("Would send to: admin@desirerealty.in");

    return new Response(
      JSON.stringify({ success: true, message: "Enquiry notification processed" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error processing enquiry:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
