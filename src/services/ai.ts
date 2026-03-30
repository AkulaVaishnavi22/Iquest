import { GoogleGenAI, Type } from "@google/genai";
import { Stage } from "../types";

const ai = new GoogleGenAI({ apiKey: "AIzaSyC62n6fhZaaoYDCoqn-bOTm_lVRwKKVlUI" });

export const generateStages = async (idea: string, budget: string): Promise<Stage[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert startup mentor, operator, and early-stage angel investor with deep real-world experience in building and scaling startups.

Your task is to convert a user's startup idea into a highly practical, real-world execution roadmap.

This is NOT theory. This must simulate how real founders operate.

-------------------------------------

INPUT:
Startup Idea: ${idea}
Target Users: Not specified
Budget: ${budget}
Location: Global

-------------------------------------

STEP 1: CLASSIFY THE IDEA

First, internally identify:
- Domain (e.g., EdTech, Healthcare, SaaS, Social Impact, FinTech)
- Business Model (e.g., SaaS, Marketplace, NGO, Service)
- Target User Type (e.g., students, farmers, startups, enterprises)
- Complexity Level (low / medium / high)

-------------------------------------

STEP 2: GENERATE A 7-STAGE EXECUTION PATH

You MUST use these fixed stages:
1. Problem Discovery  
2. Stakeholder Mapping  
3. Solution Design  
4. Pilot Testing  
5. Resource Management  
6. Crisis Handling  
7. Scaling  

-------------------------------------

STEP 3: FOR EACH STAGE, GENERATE:

For each stage, provide:
- Stage Name
- Objective (clear and outcome-focused)
- Why This Matters (real-world importance)
- Action Steps (3–5 highly practical steps, not generic advice)
- Tools & Resources (real platforms, methods, or approaches founders actually use)
- Real-World Approach (how a founder would actually execute this step)
- Common Mistakes (what beginners usually do wrong)
- One Decision-Based Scenario (realistic situation)
- 3 Decision Options (with trade-offs, not obvious answers)
- Expected Impact (how decisions affect budget, trust, or growth)

-------------------------------------

STEP 4: MAKE IT CONTEXT-AWARE

Adapt everything based on:
- Idea domain
- Target users
- Budget constraints
- Whether it's tech / non-tech / social

Avoid generic outputs like:
"Do market research" or "Build MVP"

Instead be specific:
Example:
- "Interview 5 college students using Google Forms or in-person surveys"
- "Use no-code tools like Bubble or Glide for MVP"

-------------------------------------

STEP 5: REAL-WORLD RESOURCE GUIDANCE

For each stage, include:
- Where to find users (e.g., LinkedIn, college groups, communities)
- How to validate ideas (surveys, interviews, landing pages)
- Where to learn (YouTube, blogs, communities)
- How to approach stakeholders (practical steps, not vague advice)

DO NOT generate fake or specific investor contact details.
Instead:
- Suggest platforms like LinkedIn, AngelList, startup communities
- Suggest HOW to approach investors

-------------------------------------

STEP 6: OUTPUT FORMAT (STRICT JSON)

Return output in this structure:

{
  "idea_analysis": {
    "domain": "",
    "business_model": "",
    "target_users": "",
    "complexity": ""
  },
  "stages": [
    {
      "stage_name": "",
      "objective": "",
      "why_this_matters": "",
      "action_steps": [],
      "tools_and_resources": [],
      "real_world_approach": "",
      "common_mistakes": [],
      "scenario": "",
      "options": [
        {
          "choice": "",
          "feedback": "",
          "impact": {
            "budget": 0,
            "trust": 0,
            "impact": 0
          }
        }
      ]
    }
  ]
}

-------------------------------------

FINAL RULES:
- Be practical, not motivational
- Be specific, not generic
- Simulate real-world constraints
- Do NOT hallucinate fake data (especially investors or funding)
- Focus on execution, decisions, and trade-offs`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          idea_analysis: {
            type: Type.OBJECT,
            properties: {
              domain: { type: Type.STRING },
              business_model: { type: Type.STRING },
              target_users: { type: Type.STRING },
              complexity: { type: Type.STRING }
            }
          },
          stages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stage_name: { type: Type.STRING },
                objective: { type: Type.STRING },
                why_this_matters: { type: Type.STRING },
                action_steps: { type: Type.ARRAY, items: { type: Type.STRING } },
                tools_and_resources: { type: Type.ARRAY, items: { type: Type.STRING } },
                real_world_approach: { type: Type.STRING },
                common_mistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
                scenario: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      choice: { type: Type.STRING },
                      feedback: { type: Type.STRING },
                      impact: {
                        type: Type.OBJECT,
                        properties: {
                          budget: { type: Type.NUMBER },
                          trust: { type: Type.NUMBER },
                          impact: { type: Type.NUMBER }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  const parsed = JSON.parse(response.text);

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
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a strict angel investor. Evaluate this startup pitch.
    Idea: ${idea}
    Pitch: ${pitch}

    - Ask tough questions
    - Identify weaknesses
    - Challenge assumptions
    - Give a score out of 10
    - Provide blunt improvement feedback

    Do not be polite. Be realistic.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          feedback: { type: Type.STRING },
          questions: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["score", "feedback", "questions"],
      },
    },
  });

  return JSON.parse(response.text);
};