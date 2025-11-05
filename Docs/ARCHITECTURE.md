# Application Architecture

This document provides a high-level overview of the `whowhe2wha` application's software architecture, component structure, and data flow.

## 1. High-Level Design

`whowhe2wha` is a **Single-Page Application (SPA)** built with React. The architecture emphasizes a clear separation of concerns, modularity, and a unidirectional data flow. All logic and rendering happen on the client-side, with the Google Gemini API serving as the external intelligence layer.

## 2. Component-Based Structure

The UI is broken down into a tree of reusable React components located in the `src/components` directory.

-   **`App.tsx` (Root Component):** This is the central hub of the application. It is responsible for:
    -   Managing the primary application state (lists of all projects and events, theme, view mode, timeline settings, tier configuration).
    -   Handling the visibility of modals (`MapModal`, `TimeMapModal`, `AddEventForm`, `TierConfigModal`).
    -   Orchestrating the data flow between its child components. It passes down state and callback functions as props.

-   **UI Components:**
    -   `Header.tsx`: The static application header, logo, and `ThemeSwitcher`.
    -   `SearchBar.tsx`: The input form for submitting natural language queries.
    -   `ViewControls.tsx`: The control bar for switching views, navigating the timeline, and adding new events.
    -   `Dashboard.tsx`: The main content area that conditionally renders either the project stream or the `TimelineView`.
    -   `ProjectCard.tsx`: A container for a single project, which lists all of its associated `EventCard` components.
    -   `EventCard.tsx`: Displays the details of a single event node.
    -   `EntityTag.tsx`: A small, reusable component for displaying the color-coded `Who`, `Where`, and `When` tags.
    -   `TimelineView.tsx`: A complex component for visualizing events and holidays on a scalable, multi-tier timeline.

-   **Modal Components:**
    -   `AddEventForm.tsx`: A stateful component for creating new events.
    -   `MapModal.tsx`: Displays the single-location map view.
    -   `TimeMapModal.tsx`: Displays the multi-location itinerary and route map.
    -   `TierConfigModal.tsx`: Allows users to create, edit, and assign project categories to timeline tiers.

## 3. State Management

State management is handled using React's built-in hooks, following a "lifted state" pattern.

-   **Global State:** The master lists of `events` and `projects`, as well as UI state like `theme`, `viewMode`, `timelineScale`, `timelineDate`, `selectedHolidayCategories`, and `tierConfig` are held in the top-level `App.tsx` component. This serves as the single source of truth.
-   **Local State:** Individual components manage their own UI-specific state. For example, `AddEventForm` manages the state of its input fields.
-   **Props Drilling:** State and update functions are passed down through the component tree via props. For an application of this scale, this is a straightforward and effective approach.
-   **Data Persistence:** The application's core data (`projects` and `events`) is persisted to the browser's `localStorage`. This is handled within the root `App.tsx` component. State is loaded from `localStorage` on initial application mount, and `useEffect` hooks automatically save any changes to the state back to `localStorage`, ensuring data continuity across sessions.

## 4. Services & Utilities Layer

To separate business logic and external communication from the UI components, we use a services layer.

-   **`services/geminiService.ts`:** This file acts as an abstraction layer over the Google Gemini API. It encapsulates all the logic for making API calls, including prompt engineering and response parsing.
    -   `queryGraph()`: Takes a user query and the data context, communicates with Gemini, and returns a list of event IDs.
    -   `geocodeLocation()`: Takes a location string, uses Gemini, and returns structured coordinate data.
-   **`services/geoService.ts`:** Contains pure, stateless utility functions for performing geographical calculations.
-   **`utils/dateUtils.ts`:** Contains a set of pure functions for handling date calculations (e.g., getting the start/end of a week or month), which are crucial for the `TimelineView`.

## 5. Data Flow

The application follows a predictable, unidirectional data flow.

-   **Read/Query Flow:**
    1.  User types a query in `SearchBar`.
    2.  `SearchBar` calls the `onSearch` prop function passed down from `App.tsx`.
    3.  `App.tsx` sets a loading state and calls `queryGraph` from `geminiService`.
    4.  The response (a list of IDs) is returned to `App.tsx`.
    5.  `App.tsx` updates the `filteredEventIds` state and switches the `viewMode` to 'stream'.
    6.  React re-renders the `Dashboard` with the filtered results.

-   **Write/Creation Flow:**
    1.  User fills out and submits the `AddEventForm`.
    2.  `AddEventForm` calls the `onSave` prop function, passing the new event data.
    3.  `App.tsx` receives the data, creates a new event object with a unique ID, and adds it to the `events` state array.
    4.  React re-renders the `Dashboard`, which now includes the new event in the appropriate view.