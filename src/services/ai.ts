import Groq from "groq-sdk";
import { Stage } from "../types";

const groq = new Groq({ 
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true 
});

export const generateStages = async (idea: string, budget: string): Promise<Stage[]> => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `You are an AI simulation designer.

Based on the user’s idea, generate a gamified journey like Candy Crush levels.

Create 5–7 simple levels.

Each level should:
- Have a short title (2–3 words)
- Represent a real-world step (simple language)
- Be easy to understand (no jargon)

Example:
- Talk to Users
- Build First Version
- Get First Support
- Handle a Problem
- Grow Slowly

Do NOT make it complex or technical.
Make it feel like a fun progression path.

INPUT:
Startup Idea: ${idea}
Budget: ${budget}

RETURN EXACTLY IN THIS STRICT JSON FORMAT:
{
  "stages": [
    {
      "stage_name": "Short Title",
      "objective": "Simple description of the level",
      "action_steps": ["Step 1", "Step 2"],
      "scenario": "A simple fun scenario or challenge for this level.",
      "options": [
        {
          "choice": "Option 1",
          "feedback": "Fun feedback for choosing Option 1",
          "impact": {
            "budget": 100,
            "trust": 10,
            "impact": 5
          }
        },
        {
          "choice": "Option 2",
          "feedback": "Fun feedback for choosing Option 2",
          "impact": {
            "budget": -50,
            "trust": 20,
            "impact": 10
          }
        },
        {
          "choice": "Option 3",
          "feedback": "Fun feedback for choosing Option 3",
          "impact": {
            "budget": 0,
            "trust": -10,
            "impact": -5
          }
        }
      ]
    }
  ]
}

IMPORTANT: Return ONLY valid JSON.`
      }
    ]
  });

  const parsed = JSON.parse(response.choices[0]?.message?.content || "{}");

  if (!parsed.stages) return [];

  // Map the new structured response back to the expected Stage[] interface
  return parsed.stages.map((s: any, i: number) => ({
    id: i + 1,
    name: s.stage_name || `Stage ${i + 1}`,
    objective: s.objective || "",
    tasks: s.action_steps || [],
    simulation: {
      scenario: s.scenario || "",
      options: (s.options || []).map((o: any) => ({
        text: o.choice || "",
        impact: o.impact || { budget: 0, trust: 0, impact: 0 },
        feedback: o.feedback || `You decided to ${o.choice}. This aligns with real-world startup execution methodology.`
      }))
    }
  }));
};

export const evaluatePitch = async (idea: string, pitch: string) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `Act as a strict angel investor. Evaluate this startup pitch.
    Idea: ${idea}
    Pitch: ${pitch}

    - Ask tough questions
    - Identify weaknesses
    - Challenge assumptions
    - Give a score out of 10
    - Provide blunt improvement feedback

    Do not be polite. Be realistic.

    Return STRICT JSON in this structure:
    {
      "score": 0,
      "feedback": "string",
      "questions": ["string", "string"]
    }`
      }
    ]
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
};