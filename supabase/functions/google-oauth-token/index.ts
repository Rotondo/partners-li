// Supabase Edge Function: Trocar código OAuth por tokens
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { code, redirectUri } = await req.json();

    if (!code) {
      return new Response(
        JSON.stringify({ error: "code is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Obter credenciais do ambiente (configurar no Supabase)
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "Google OAuth credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Trocar código por tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri || `${req.headers.get("origin")}/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      return new Response(
        JSON.stringify({ error: `Token exchange failed: ${error}` }),
        { status: tokenResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tokens = await tokenResponse.json();

    return new Response(
      JSON.stringify(tokens),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

