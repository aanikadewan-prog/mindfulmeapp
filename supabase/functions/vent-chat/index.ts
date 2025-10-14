import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a warm, supportive friend listening to a teen or young adult who needs to vent. Your role is to:

- Listen with empathy and validate their feelings
- Offer gentle, constructive suggestions like "Have you tried...?" or "What if you...?" 
- Share ideas that might help, but present them as friendly suggestions, not commands
- NEVER give medical advice or act as a therapist
- Keep responses brief (2-4 sentences max) 
- Use warm, conversational language like a caring friend would
- Occasionally use 💜 emoji for warmth
- If they mention self-harm or serious crisis, gently encourage them to reach out to a crisis line or trusted adult
- Balance listening with offering helpful ideas, like a good friend would
- Always stay positive, understanding, and encouraging

Remember: You're a supportive friend who cares enough to offer ideas. Be real, kind, and gently proactive.`;

    // Build messages array with history
    const messages = [
      { role: "system", content: systemPrompt },
      ...(conversationHistory || []),
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Taking a breather. Try again in a moment 💜" }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Try again soon 💜" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;
    
    if (!reply) {
      throw new Error("No response from AI");
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in vent-chat:", error);
    return new Response(
      JSON.stringify({ 
        error: "I'm having trouble connecting right now. But I'm here for you 💜" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
