import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const RecommendActivitiesSchema = z.object({
  mood: z.number().int().min(1).max(5),
  answers: z.record(z.boolean()).optional()
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation
    const body = await req.json();
    const parsed = RecommendActivitiesSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: parsed.error.issues }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { mood, answers } = parsed.data;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create context from check-in data
    const moodLabels = ["", "Struggling (1/5)", "Low (2/5)", "Okay (3/5)", "Good (4/5)", "Great (5/5)"];
    const moodText = moodLabels[mood] || "Unknown";
    
    const answersText = Object.entries(answers || {})
      .map(([key, value]) => {
        const labels: Record<string, string> = {
          sleep: "Got enough sleep",
          hydration: "Staying hydrated",
          movement: "Moved body today",
          social: "Connected with someone"
        };
        return `${labels[key] || key}: ${value ? "Yes" : "No"}`;
      })
      .join(", ");

    const systemPrompt = `You are a compassionate mental health assistant helping teens and young adults with their wellbeing. 
Based on their daily check-in, recommend 3-4 specific activities from the app that would help them most right now.

Available activities:
- Breathing Timer: Guided breathing exercises with visual countdown
- Gentle Stretching: Simple stretches to release tension
- Progressive Relaxation: Systematic muscle relaxation technique
- Morning Ritual: Start the day with intention
- Mindful Tea: Slow down with a warm beverage
- Short Walk: Get outside and move gently
- Soothing Sounds: Calming nature sounds
- Gratitude Practice: Focus on positive moments
- Self-Compassion: Be kind to yourself
- Phone-Free Hour: Digital detox break
- Social Media Pause: Mindful social media use
- Evening Wind-Down: Prepare for restful sleep
- Journal: Write down thoughts and feelings

Consider:
- If struggling emotionally: prioritize calming, grounding activities
- If low energy: suggest gentle, achievable activities
- If anxious: breathing and relaxation techniques
- If lacking self-care basics (sleep, hydration, movement): gentle reminders
- Keep language warm, supportive, never judgmental
- Use 💜 emoji occasionally for warmth

Respond with ONLY a JSON object in this exact format (no markdown, no extra text):
{
  "message": "brief supportive message (1-2 sentences)",
  "activities": ["Activity Name 1", "Activity Name 2", "Activity Name 3"],
  "reasoning": "brief explanation why these help (1 sentence)"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `User check-in: Mood: ${moodText}. ${answersText || "No wellness questions answered yet."}` 
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let recommendations;
    try {
      // Remove markdown code blocks if present
      const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      recommendations = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Fallback recommendations
      recommendations = {
        message: "Thanks for checking in today 💜",
        activities: mood <= 2 
          ? ["Breathing Timer", "Soothing Sounds", "Self-Compassion"]
          : ["Short Walk", "Gratitude Practice", "Journal"],
        reasoning: "These activities can help support your wellbeing right now."
      };
    }

    return new Response(
      JSON.stringify(recommendations),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in recommend-activities:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
