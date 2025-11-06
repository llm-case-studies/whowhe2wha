import { GoogleGenAI, Type } from "@google/genai";
import { EventNode, Project, Location, DiscoveredPlace } from '../types';

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


export async function queryGraph(userQuery: string, data: { projects: Project[], events: EventNode[], locations: Location[] }): Promise<number[]> {
  const aiInstance = getAI();

  const prompt = `
    You are a powerful query engine for a personal context graph app called 'whowhe2wha'.
    Your task is to analyze the user's natural language query and return the IDs of all matching events from the provided JSON data.

    The data model consists of 'projects', 'events', and 'locations'. 
    - A 'project' is a high-level goal (e.g., "Dental Implant Treatment").
    - An 'event' is a specific action within a project (e.g., "Initial Consultation").
    - Events are linked to projects by 'projectId' and to locations by 'whereId'.

    Analyze the user's query for keywords, names, places, activities, dates, or project names.
    Match these against the events, their parent projects, and their locations in the JSON data.
    Return a valid JSON array of numbers, where each number is the 'id' of a matching event.

    - If the query refers to a project (e.g., "dental work", "taxation"), find ALL events that belong to the relevant project(s).
    - If the query mentions a person (e.g., "Dr. Smith"), find all events they are involved in.
    - If the query mentions a place (e.g., "downtown" or "clinic"), find all events at that location. To do this, look up the location name in the 'locations' array to find its 'id', and then find all events with that matching 'whereId'.
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
    Return only the canonical, full address for the 'name' field.

    Location: "${query}"
  `;

  try {
    const response = await aiInstance.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: {
              type: Type.STRING,
              description: 'The canonical, full address of the location.'
            },
            latitude: {
              type: Type.NUMBER,
              description: 'The latitude coordinate.'
            },
            longitude: {
              type: Type.NUMBER,
              description: 'The longitude coordinate.'
            }
          },
          required: ['name', 'latitude', 'longitude']
        }
      },
    });

    const textResponse = response.text.trim();
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

/**
 * Uses the Gemini API with Google Maps grounding to discover real-world places from a text query.
 * @param query The user's search query for a place (e.g., "library downtown").
 * @returns A promise that resolves to an array of discovered places.
 */
export async function discoverPlaces(query: string): Promise<DiscoveredPlace[]> {
    const aiInstance = getAI();
    const prompt = `List business or public places that match the query: "${query}".`;

    try {
        const response = await aiInstance.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
            },
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        if (groundingChunks && Array.isArray(groundingChunks)) {
            const places: DiscoveredPlace[] = groundingChunks
                .filter(chunk => chunk.maps)
                .map(chunk => ({
                    title: chunk.maps.title,
                    uri: chunk.maps.uri,
                }));
            return places;
        }

        return [];

    } catch (error) {
        console.error("Error calling Gemini API with Maps Grounding:", error);
        throw new Error("Failed to discover places with AI.");
    }
}

/**
 * Uses a two-step AI process to find a place from a Google Maps URL.
 * Step 1: Use Google Search tool to resolve the URL to a place name.
 * Step 2: Use Google Maps tool (via discoverPlaces) with the name to get structured data.
 * @param url The Google Maps share link.
 * @returns A promise that resolves to an array of discovered places.
 */
export async function findPlaceFromUrl(url: string): Promise<DiscoveredPlace[]> {
    const aiInstance = getAI();
    
    try {
        // Step 1: Use Google Search to get the name of the location from the URL.
        const searchPrompt = `What is the name of the place or address pointed to by this Google Maps URL? Respond with only the name and address, for example: "Monroe Township, NJ, USA". URL: ${url}`;
        
        const searchResponse = await aiInstance.models.generateContent({
            model: "gemini-2.5-flash",
            contents: searchPrompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const locationName = searchResponse.text.trim();
        
        // Basic sanity check to avoid using a generic or incorrect response.
        if (!locationName || locationName.toLowerCase().includes('mountain view')) {
             console.warn('Google Search did not return a specific location name for the URL.', locationName);
             return [];
        }
        
        // Step 2: Now that we have a reliable name, use discoverPlaces to get the structured data.
        // This uses the googleMaps tool, which is effective when given a clear name.
        return await discoverPlaces(locationName);

    } catch (error) {
        console.error("Error calling Gemini API to resolve URL:", error);
        throw new Error("Failed to find place from URL with AI.");
    }
}