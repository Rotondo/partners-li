// Supabase Edge Function para buscar calendário iCal (resolve CORS)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { calendarUrl } = await req.json();

    if (!calendarUrl) {
      return new Response(
        JSON.stringify({ error: "calendarUrl is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch calendar from Google
    const response = await fetch(calendarUrl, {
      headers: {
        "Accept": "text/calendar",
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch calendar: ${response.statusText}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const icalData = await response.text();

    return new Response(
      JSON.stringify({ data: icalData }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

