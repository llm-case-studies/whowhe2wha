# whowhe2wha: The User's Guide

Welcome to the Unified Context Engine. This guide will walk you through the core features of the application.

Google AI Stodio link to the workspace: https://aistudio.google.com/apps/drive/16HCQUfRMItTpfH-yRnJ4b06boI6OlaR2?showAssistant=true&resourceKey=&showCode=true

## 1. The Main Interface

When you open the app, you see the main dashboard. You can switch between two primary views using the **View Controls** at the top.

-   **Project Stream:** This is your default view, organizing all your events under their respective projects. You can expand and collapse each project card to see the events within it.
-   **Timeline View:** This provides a high-level, horizontal visualization of your events over a selected period (week, month, quarter, or year).

## 2. Adding an Event

This is the primary way to input data into your context graph.

1.  Click the **"+ Add Event"** button.
2.  Fill out the form:
    -   **What (Event/Step Name):** The name of your event (e.g., "Team Meeting"). *This is required.*
    -   **Description:** Optional details about the event.
    -   **Project:** Assign the event to a project. If you type a name that doesn't exist, a new project will be created automatically. *This is required.*
    -   **When:** The date and time of the event. *This is required.*
    -   **Who:** People involved, separated by commas (e.g., "Alice, Bob").
    -   **Where:** The location of the event. *This is required.*
3.  Click **"Save Event"**.

### Special Features of the Form

-   **Voice Dictation:** For some fields, you can click the **microphone icon** to dictate your entry using your voice.
-   **Automatic Geocoding:** When you type a location in the "Where" field and click away, the app will automatically look up its precise address and coordinates. A **green pin icon** will appear to confirm success. This powers the map features.

## 3. Summoning Context: The Search Bar

The search bar is your gateway to the AI engine. You can ask questions in plain English to find information.

-   **How to Use:** Type your query and click **"Summon"**.
-   **Example Queries:**
    -   "Show me everything with Dr. Smith"
    -   "dental work"
    -   "errands downtown"
    -   "What do I have to do in December?"
-   **Clearing a Search:** Click the **"×"** icon in the search bar to return to the full Project Stream.

## 4. Interactive Tags: Exploring Your Data

Every event has color-coded tags for **Who**, **Where**, and **When**. The location and time tags are interactive.

### The Map Modal (Location View)

-   **How to Access:** Click on any green **`Where`** tag (e.g., "Springfield Clinic").
-   **What it Shows:**
    1.  **Map:** An interactive map centered on the selected location.
    2.  **Tabs:**
        -   **Scheduled Events:** Shows a list of other events in your system that are physically close to this location.
        -   **Contacts & Partners:** Lists key people associated with that location. You can click the **"Schedule"** button here to quickly create a new event with that person and place pre-filled.

### The TimeMap Modal (Spatial-Temporal View)

-   **How to Access:** Click on any blue **`When`** tag (e.g., "Nov 15, 2025, 3:00 PM").
-   **What it Shows:** This powerful view gives you a spatio-temporal overview of your life.
    1.  **Map with Route:** An interactive map showing a route that connects *all* of your events scheduled within a 7-day window around the selected date.
    2.  **Itinerary:** A chronological list of those events, showing you the flow of your week.

## 5. The Timeline View

This view provides a "big picture" look at your schedule. It is organized into horizontal "swimlanes" based on your custom layout.

-   **How to Access:** Click the **"Timeline"** button in the View Controls.
-   **Navigation:**
    -   Use the **<** and **>** buttons to move to the previous or next time period.
    -   Use the dropdown menu to change the scale from **Week** to **Month**, **Quarter**, or **Year**.
-   **Interacting with the Timeline:**
    -   Your events appear as icons within their assigned swimlanes. Hover over an icon to see a tooltip with its details.
    -   The timeline displays markers for the start date, end date, and **Today** (if visible).
    -   A **collapsible sidebar** on the left shows the projects and categories aligned with their swimlanes.
-   **Filtering:**
    -   **Project Categories:** Click the **filter icon** to show or hide entire categories of projects from the timeline.
    -   **Holiday Overlays:** Click the **star icon** to select and display various national and religious holidays.

### Configuring Your Layout

You can customize the swimlanes on your timeline for a personalized view.

1.  **Open the Layout Editor:** In the Timeline view controls, click the **"Configure timeline layout"** button (it has a layers icon).
2.  **Manage Tiers:** A "tier" is a group of swimlanes. In the modal, you can:
    -   **Add New Tiers:** Click "+ Add New Tier" to create a new grouping.
    -   **Rename Tiers:** Click on the name of a tier (e.g., "Tier 1") and type to change it.
    -   **Remove Tiers:** Click the "×" button to remove an empty tier.
3.  **Assign Categories:** On the right side, use the dropdown menu next to each project category (Work, Health, etc.) to assign it to one of your custom tiers.
4.  **Save:** Click **"Save Layout"**. The timeline will instantly update to reflect your new structure.