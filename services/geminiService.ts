import { GoogleGenAI, Type } from "@google/genai";
import { EventNode, Project } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
  if (!ai) {
     if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
};


export async function queryGraph(userQuery: string, data: { projects: Project[], events: EventNode[] }): Promise<number[]> {
  const aiInstance = getAI();

  const prompt = `
    You are a powerful query engine for a personal context graph app called 'whowhe2wha'.
    Your task is to analyze the user's natural language query and return the IDs of all matching events from the provided JSON data.

    The data model consists of 'projects' and 'events'. Events are steps or appointments that belong to a project, linked by 'projectId'.
    - A 'project' is a high-level goal or activity (e.g., "Dental Implant Treatment").
    - An 'event' is a specific action within that project (e.g., "Initial Consultation").

    Analyze the user's query for keywords, names, places, activities, dates, or project names.
    Match these against the events and their parent projects in the JSON data.
    Return a valid JSON array of numbers, where each number is the 'id' of a matching event.

    - If the query refers to a project (e.g., "dental work", "taxation"), find ALL events that belong to the relevant project(s).
    - If the query mentions a person (e.g., "Dr. Smith"), find all events they are involved in.
    - If the query mentions a place (e.g., "downtown" or "clinic"), find all events at that location.
    - If the query combines concepts (e.g., "errands downtown"), find events that match both.

    If no events match the query, return an empty array [].

    Here is the data context:
    ${JSON.stringify(data, null, 2)}

    Here is the user query:
    "${userQuery}"

    Now, provide the JSON array of matching event IDs:
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.INTEGER,
          },
        },
      },
    });
    
    const textResponse = response.text.trim();
    const result = JSON.parse(textResponse);

    if (Array.isArray(result) && result.every(item => typeof item === 'number')) {
      return result;
    } else {
      console.error('Gemini response was not an array of numbers:', result);
      return [];
    }
  } catch (error) {
    console.error("Error calling Gemini API or parsing response:", error);
    throw new Error("Failed to process query with AI.");
  }
}

export async function geocodeLocation(query: string): Promise<{ name: string; latitude: number; longitude: number; } | null> {
  const aiInstance = getAI();
  const prompt = `
    Find the precise address and geographic coordinates (latitude and longitude) for the following location.
    Return the result as a single, clean JSON object with three keys: "name" (the canonical, full address), "latitude", and "longitude".
    Do not add any commentary or markdown formatting. Just return the raw JSON object.

    Location: "${query}"
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    let textResponse = response.text.trim();
    // The model might return the JSON wrapped in markdown backticks, so we extract it.
    const jsonMatch = textResponse.match(/```(json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch && jsonMatch[2]) {
        textResponse = jsonMatch[2];
    }
    
    const result = JSON.parse(textResponse);
    if (result && typeof result.latitude === 'number' && typeof result.longitude === 'number' && typeof result.name === 'string') {
      return result;
    }
    console.warn('Geocoding response was not in the expected format:', result);
    return null;
  } catch (error) {
    console.error("Error during geocoding with Gemini:", error);
    return null;
  }
}