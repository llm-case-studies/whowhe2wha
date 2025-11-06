# Current State of the Application

This document provides a snapshot of the features and capabilities of the **whowhe2wha** Unified Context Engine as of the latest version.

## Core Functionality

The application is fully functional and provides a robust framework for managing and querying personal and professional life events.

1.  **Context Capture:** Users can add detailed events, which are automatically organized into user-defined projects. Events are linked to distinct **Location** entities, forming a rich, interconnected context graph.

2.  **Context Visualization:** The application offers two distinct ways to visualize context: the "Project Stream" for a detailed, project-oriented view, and the "Timeline" for a high-level, chronological overview.

3.  **Context Querying:** The application's core strength is its AI-powered search. Users can query their entire life graph using natural, everyday language and receive instantly filtered, relevant results.

## Key Implemented Features

-   **Project, Event, and Location Management:**
    -   Create new events with detailed information (What, Who, Where, When, Description).
    -   Create new projects on-the-fly when adding an event.
    -   Create new locations seamlessly from the "Add Event" form or select from a list of existing locations.
    -   View all events neatly grouped by their parent project in the Stream view.
    -   All core data (`projects`, `events`, `locations`) is persisted in the browser's `localStorage` between sessions.

-   **AI-Powered Search:**
    -   A "Summon" bar allows for natural language queries (e.g., "dental work," "errands downtown").
    -   The search intelligently matches against event details, project names, participants, and full location data.

-   **Dual View Modes:**
    -   **Project Stream:** A familiar, chronological feed of projects and their associated events.
    -   **Timeline View:** An interactive, scalable timeline (week, month, quarter, year) that visualizes events over time. It features a fully configurable **multi-tier (swimlane) layout**, allowing users to group project categories into logical sections. A collapsible sidebar shows project details aligned with their swimlanes.

-   **Advanced User Input:**
    -   **Voice Dictation:** Key text fields in the "Add Event" form support voice-to-text transcription.
    -   **Automatic Geocoding:** The "Where" field automatically converts new textual locations into precise addresses and geographic coordinates using the Gemini API.

-   **Interactive Data Exploration:**
    -   **Spatial View (Map Modal):** Clicking a location tag opens a modal showing a map, nearby events, and key contacts with a one-click "Schedule" action.
    -   **Spatial-Temporal View (TimeMap Modal):** Clicking a date tag opens a modal showing a multi-point route map and itinerary for a 7-day window.
    -   **Holiday Overlays:** The Timeline view allows users to select and display various national and religious holidays for better contextual planning.
    -   **Project Filtering:** The Timeline view allows users to filter which project categories are visible.

-   **User Interface & Experience:**
    -   A clean, responsive UI with multiple user-selectable themes (light, dark, focus).
    -   Clear visual language using color-coding for different entity types.
    -   Loading indicators for asynchronous AI operations.
    -   Error handling for AI queries and speech recognition.

## Technical Status

-   The application is client-side only and does not have a backend or database. Data is persisted in the browser's **localStorage**. `projects`, `events`, and `locations` are now all managed as separate, first-class data entities.
-   The build process is simplified using import maps, requiring no local build step.
-   API key management is handled by the execution environment (`process.env.API_KEY`).