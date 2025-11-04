# Current State of the Application

This document provides a snapshot of the features and capabilities of the **whowhe2wha** Unified Context Engine as of the latest version.

## Core Functionality

The application is fully functional and provides a robust framework for managing and querying personal and professional life events.

1.  **Context Capture:** Users can add detailed events, which are automatically organized into user-defined projects. This forms the foundation of the user's personal context graph.

2.  **Context Visualization:** The primary interface is the "Project Stream," a chronological and project-based view of all events, making it easy to see what's happening at a glance.

3.  **Context Querying:** The application's core strength is its AI-powered search. Users can query their entire life graph using natural, everyday language and receive instantly filtered, relevant results.

## Key Implemented Features

-   **Project and Event Management:**
    -   Create new events with detailed information (What, Who, Where, When, Description).
    -   Create new projects on-the-fly when adding an event.
    -   View all events neatly grouped by their parent project.

-   **AI-Powered Search:**
    -   A "Summon" bar allows for natural language queries (e.g., "dental work," "errands downtown").
    -   The search intelligently matches against event details, project names, participants, and locations.

-   **Advanced User Input:**
    -   **Voice Dictation:** Key text fields in the "Add Event" form support voice-to-text transcription via the browser's Web Speech API.
    -   **Automatic Geocoding:** The "Where" field automatically converts textual locations into precise addresses and geographic coordinates using the Gemini API with Google Maps Grounding.

-   **Interactive Data Exploration:**
    -   **Spatial View (Map Modal):** Clicking a location tag opens a modal showing:
        -   An interactive map of the location.
        -   A list of other scheduled events in the physical vicinity.
        -   A list of key contacts at that location, with a one-click "Schedule" action.
    -   **Spatial-Temporal View (TimeMap Modal):** Clicking a date tag opens a modal showing:
        -   A multi-point route map connecting all events within a 7-day window.
        -   A chronological itinerary for that time period.

-   **User Interface & Experience:**
    -   A clean, responsive, dark-themed UI.
    -   Clear visual language using color-coding for different entity types.
    -   Loading indicators for asynchronous AI operations.
    -   Error handling for AI queries and speech recognition.

## Technical Status

-   The application is client-side only and does not have a backend or database. Data is currently stored in memory and initialized from mock data; it does not persist between sessions.
-   The build process is simplified using import maps, requiring no local build step.
-   API key management is handled by the execution environment (`process.env.API_KEY`).