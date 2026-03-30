import { GoogleGenAI, Type } from "@google/genai";
import { Stage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const generateStages = async (idea: string, budget: string): Promise<Stage[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert startup mentor. Convert the user's idea into a 7-stage startup journey.
    Idea: ${idea}
    Starting Budget: ${budget}

    For each stage provide:
    - Stage Name
    - Objective
    - 2–4 practical tasks
    - One decision-based simulation scenario with 3 options (each with text, impact on budget/trust/impact, and feedback)
    - One possible crisis trigger (scenario, 2 stakeholder opinions, 3 options with impacts)

    Keep it realistic and execution-focused. Avoid generic advice.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            name: { type: Type.STRING },
            objective: { type: Type.STRING },
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            simulation: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      impact: {
                        type: Type.OBJECT,
                        properties: {
                          budget: { type: Type.NUMBER },
                          trust: { type: Type.NUMBER },
                          impact: { type: Type.NUMBER },
                        },
                        required: ["budget", "trust", "impact"],
                      },
                      feedback: { type: Type.STRING },
                    },
                    required: ["text", "impact", "feedback"],
                  },
                },
              },
              required: ["scenario", "options"],
            },
            crisis: {
              type: Type.OBJECT,
              properties: {
                scenario: { type: Type.STRING },
                stakeholders: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      role: { type: Type.STRING },
                      opinion: { type: Type.STRING },
                    },
                    required: ["role", "opinion"],
                  },
                },
                options: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      impact: {
                        type: Type.OBJECT,
                        properties: {
                          budget: { type: Type.NUMBER },
                          trust: { type: Type.NUMBER },
                          impact: { type: Type.NUMBER },
                        },
                        required: ["budget", "trust", "impact"],
                      },
                    },
                    required: ["text", "impact"],
                  },
                },
              },
            },
          },
          required: ["id", "name", "objective", "tasks", "simulation"],
        },
      },
    },
  });

  return JSON.parse(response.text);
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
