# Application Architecture

This document provides a high-level overview of the `whowhe2wha` application's software architecture, component structure, and data flow.

## 1. High-Level Design

`whowhe2wha` is a **Single-Page Application (SPA)** built with React. The architecture emphasizes a clear separation of concerns, modularity, and a unidirectional data flow. All logic and rendering happen on the client-side, with the Google Gemini API serving as the external intelligence layer. The application is also a **Progressive Web App (PWA)**, enabling installation and offline use.

## 2. Component-Based Structure

The UI is broken down into a tree of reusable React components located in the `src/components` directory.

-   **`App.tsx` (Root Component):** This is the central hub of the application. It is responsible for:
    -   Managing the primary application state (lists of all projects, events, and locations; theme, view mode, timeline settings, tier configuration).
    -   Handling the visibility of modals (`MapModal`, `TimeMapModal`, `AddEventForm`, `TierConfigModal`, `AddLocationModal`).
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
    -   `AddLocationModal.tsx`: A multi-step modal that uses the AI service to find, verify, and create new real-world locations.
    -   `MapModal.tsx`: Displays the single-location map view.
    -   `TimeMapModal.tsx`: Displays the multi-location itinerary and route map.
    -   `TierConfigModal.tsx`: Allows users to create, edit, and assign project categories to timeline tiers.

## 3. State Management

State management is handled using React's built-in hooks, following a "lifted state" pattern.

-   **Global State:** The master lists of `projects`, `events`, and `locations`, as well as UI state like `theme`, `viewMode`, `timelineScale`, `timelineDate`, `selectedHolidayCategories`, and `tierConfig` are held in the top-level `App.tsx` component. This serves as the single source of truth.
-   **Local State:** Individual components manage their own UI-specific state. For example, `AddEventForm` manages the state of its input fields.
-   **Props Drilling:** State and update functions are passed down through the component tree via props. For an application of this scale, this is a straightforward and effective approach.
-   **Data Persistence:** The application's core data (`projects`, `events`, and `locations`) is persisted to the browser's `localStorage`. This is handled within the root `App.tsx` component. State is loaded from `localStorage` on initial application mount, and `useEffect` hooks automatically save any changes to the state back to `localStorage`, ensuring data continuity across sessions.

## 4. Services & Utilities Layer

To separate business logic and external communication from the UI components, we use a services layer.

-   **`services/geminiService.ts`:** This file acts as an abstraction layer over the Google Gemini API. It encapsulates all the logic for making API calls, including prompt engineering and response parsing.
    -   `queryGraph()`: Takes a user query and the data context, communicates with Gemini, and returns a list of event IDs.
    -   `discoverPlaces()`: Uses the `googleMaps` grounding tool to find a list of candidate real-world places from a fuzzy text query.
    -   `geocodeLocation()`: Takes a location string, uses Gemini, and returns structured coordinate data.
-   **`services/geoService.ts`:** Contains pure, stateless utility functions for performing geographical calculations.
-   **`utils/dateUtils.ts`:** Contains a set of pure functions for handling date calculations (e.g., getting the start/end of a week or month), which are crucial for the `TimelineView`.

## 5. Data Flow

The application follows a predictable, unidirectional data flow.

-   **Read/Query Flow:**
    1.  User types a query in `SearchBar`.
    2.  `SearchBar` calls the `onSearch` prop function passed down from `App.tsx`.
    3.  `App.tsx` sets a loading state and calls `queryGraph` from `geminiService` with the full data context (`projects`, `events`, `locations`).
    4.  The response (a list of IDs) is returned to `App.tsx`.
    5.  `App.tsx` updates the `filteredEventIds` state and switches the `viewMode` to 'stream'.
    6.  React re-renders the `Dashboard` with the filtered results.

-   **Write/Creation Flow (with Location Discovery):**
    1.  User fills out the `AddEventForm`. In the "Where" field, they type a new location name and blur the input.
    2.  `AddEventForm` sees no existing match and calls the `onOpenLocationFinder` prop passed from `App.tsx`.
    3.  `App.tsx` opens the `AddLocationModal`.
    4.  Inside `AddLocationModal`, `discoverPlaces` is called. The user selects a result, which is then enriched using `geocodeLocation`.
    5.  The user confirms and saves the new location. `AddLocationModal` calls its `onSave` prop.
    6.  `App.tsx` receives the new `Location` object, adds it to the global `locations` state, and updates the `addEventInitialData` state to push the new location name back to the `AddEventForm`.
    7.  The user can now submit the `AddEventForm`, which saves the new event linked to the newly created location.

## 6. Progressive Web App (PWA) Features

The application is enhanced with PWA capabilities to provide a more native-like experience.

-   **`manifest.json` (Web App Manifest):** This file provides metadata about the application (name, icons, theme colors). It allows browsers on desktop and mobile to "install" the web app to the user's home screen or applications folder, where it can run in a standalone window without the browser's UI chrome.
-   **`service-worker.js` (Service Worker):** This script runs in the background, separate from the main application thread. Its primary role is to provide network resilience and offline support by caching the core application assets (the "app shell"). On subsequent visits, it intercepts network requests and can serve the cached assets directly, resulting in near-instant load times and the ability for the app to function without a network connection.