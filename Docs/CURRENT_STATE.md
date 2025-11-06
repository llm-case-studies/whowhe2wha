# Current State of the Application

This document provides a snapshot of the features and capabilities of the **whowhe2wha** Unified Context Engine as of the latest version.

## Core Functionality

The application is fully functional and provides a robust framework for managing and querying personal and professional life events.

1.  **Context Capture:** Users can add, edit, and delete detailed events, projects, real-world locations, and contacts, forming a rich, interconnected context graph.

2.  **Context Visualization:** The application offers two distinct ways to visualize context: the "Project Stream" for a detailed, project-oriented view, and the "Timeline" for a high-level, chronological overview.

3.  **Context Querying:** The application's core strength is its AI-powered search. Users can query their entire life graph using natural, everyday language and receive instantly filtered, relevant results.

## Key Implemented Features

-   **Full CRUD Management:**
    -   Complete Create, Read, Update, and Delete (CRUD) functionality is implemented for all core entities: **Projects**, **Events**, **Locations**, and **Contacts**.
    -   Data is persisted in the browser's `localStorage` between sessions.

-   **Advanced Project Templates:**
    -   Create structured project plans with events that have defined start offsets and durations, decoupling scheduling from the event name.
    -   Add external resource links (e.g., training videos, documents) to template steps.
    -   "Fork" existing templates using a "Save as New" feature to create customized versions.

-   **Comprehensive Location Intelligence:**
    -   A multi-step, AI-powered workflow allows users to discover real-world locations from a text query or a Google Maps URL.
    -   Locations are automatically geocoded to get precise addresses and coordinates.
    -   A full-featured **Location Detail Modal** provides a comprehensive profile for each place, including a map, contact info, associated contacts, and all events scheduled there.

-   **AI-Powered Search:**
    -   A "Summon" bar allows for natural language queries (e.g., "dental work," "errands downtown").
    -   The search intelligently matches against event details, project names, participants, and full location data.

-   **Dual View Modes:**
    -   **Project Stream:** A familiar, chronological feed of projects and their associated events with independent scrolling panes.
    -   **Timeline View:** An interactive, scalable timeline (week, month, quarter, year) that visualizes events over time. It features a fully configurable **multi-tier (swimlane) layout**, allowing users to group project categories into logical sections.

-   **Interactive Data Exploration:**
    -   **Spatial View (Location Detail Modal):** Clicking a location tag opens its detailed profile.
    -   **Spatial-Temporal View (TimeMap Modal):** Clicking a date tag opens a modal showing a multi-point route map and itinerary for a 7-day window.
    -   **Holiday Overlays:** The Timeline view allows users to select and display various national and religious holidays.
    -   **Project Filtering:** The Timeline view and Project list allow users to filter which project categories are visible.

-   **User Interface & Experience:**
    -   A clean, responsive UI with multiple user-selectable themes (light, dark, focus).
    -   Loading indicators for asynchronous AI operations.
    -   Confirmation modals for destructive actions (deleting).
    -   A history panel to view (but not yet undo) changes.

## Technical Status

-   The application is client-side only. Data is persisted in the browser's **localStorage**.
-   The build process is simplified using import maps, requiring no local build step.
-   API key management is handled by the execution environment (`process.env.API_KEY`).
