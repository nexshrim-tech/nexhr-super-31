
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();
    
    if (!topic) {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate a simple suggestion based on the topic
    const suggestions = {
      'company': {
        title: "Company Culture Update",
        content: "Our company has been growing rapidly, and I wanted to share some thoughts on how we can maintain our culture as we scale. Here are three key practices we should focus on..."
      },
      'technology': {
        title: "New Tech Trends to Watch",
        content: "I've been researching emerging technologies that could impact our industry in the next year. Here are the top trends everyone should be aware of and how they might affect our work..."
      },
      'leadership': {
        title: "Leadership Lessons Learned",
        content: "After leading my team through our recent project, I wanted to share some key leadership insights that helped us succeed despite the challenges we faced..."
      },
      'work-life': {
        title: "Work-Life Balance Strategies",
        content: "Finding balance between work responsibilities and personal life can be challenging. Here are some practices that have helped me maintain productivity while preserving my wellbeing..."
      },
      'productivity': {
        title: "Productivity Hacks for Busy Professionals",
        content: "After experimenting with different work methodologies, I've discovered several practices that significantly improved my productivity. Here's what worked best for me..."
      }
    };
    
    // Default suggestion if the topic doesn't match any predefined ones
    const defaultSuggestion = {
      title: `Thoughts on ${topic}`,
      content: `I've been thinking about ${topic} lately and wanted to share some perspectives with the team. I believe this is an important area for us to explore because...`
    };
    
    const result = suggestions[topic as keyof typeof suggestions] || defaultSuggestion;
    
    return new Response(
      JSON.stringify({ suggestion: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
