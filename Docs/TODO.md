# Project TODO & Roadmap

This document tracks the development progress of the **whowhe2wha** application, marking completed tasks and outlining the roadmap for future enhancements.

## Completed Features ✅

-   [x] **Core UI/UX:** Initial app structure with Dashboard, Project Cards, and Event Cards.
-   [x] **Data Persistence:** Implemented local storage to save events and projects, so data persists between browser sessions.
-   [x] **AI Search:** Gemini-powered natural language search (`queryGraph`).
-   [x] **Event Creation:** Full-featured "Add Event" form with support for creating new projects.
-   [x] **Voice Input:** Voice dictation for key form fields using the Web Speech API.
-   [x] **Automatic Geocoding:** Convert location text to geographic coordinates using Gemini.
-   [x] **Spatial View:** Interactive map modal for single locations, showing nearby events and contacts.
-   [x] **Spatial-Temporal View:** Interactive map modal for time windows, showing a multi-point itinerary and route.
-   [x] **Theming:** Added a theme switcher with light, dark, and focus modes.
-   [x] **Timeline View:** Added an interactive, scalable timeline for visualizing events and holidays.
-   [x] **Dynamic Timeline Layout:** Implemented a configurable, multi-tier (swimlane) timeline layout.
-   [x] **PWA Functionality:** Made the app installable on mobile and desktop devices with offline support via a service worker and web manifest.
-   [x] **Documentation:** Created a comprehensive suite of project documentation.
-   [x] **Location Intelligence (Phase 1 & 2):** Reworked data model to treat Locations as first-class entities and implemented an AI-powered workflow for discovering and adding new real-world locations.

## Planned Features & Enhancements 🚀

### Tier 1: Core Functionality

-   [ ] **Location Intelligence & Management (Epic):**
    -   [x] **Phase 1: First-Class Locations:**
        -   [x] Rework data model to have a dedicated `locations` state with rich fields.
        -   [x] Update `EventNode` to use `locationId` instead of embedding location data.
        -   [x] Convert "Where" input in `AddEventForm` to a searchable dropdown for existing locations, with a "+ New Location" button.
    -   [x] **Phase 2: AI-Powered Location Discovery:**
        -   [x] Create a "New Location" modal flow.
        -   [x] Implement a `geminiService` function using **Google Maps Grounding** to search for real-world places from a fuzzy query.
        -   [x] Display a list of potential places for the user to select.
        -   [x] Pre-fill location data from the selected place for the user to confirm and add an alias.
    -   [ ] **Phase 3: Full Location Profile:**
        -   [ ] Create a `LocationDetailModal` to replace the current `MapModal`.
        -   [ ] Display all rich location data (map, alias, phone, website, portal).
        -   [ ] Add actionable buttons (click-to-call, links to website/portal).
-   [ ] **Edit & Delete:** Add functionality to edit and delete existing events and projects.
-   [ ] **Contact Management:** Create a dedicated view for adding and managing contacts, rather than relying on a static list.
-   [ ] **Data Import/Export:** Add functionality to export all user data to a standard format (JSON, CSV) and import events from `.ics` files.

### Tier 2: AI & Intelligence

-   [ ] **Enhanced AI Queries:** Expand the AI's capabilities to handle more complex temporal and summary-based questions.
    -   *Example:* "What do I have to do tomorrow morning?"
    -   *Example:* "Summarize my 'Series A Fundraising' project."
-   [ ] **Proactive Suggestions:** Have the AI suggest optimal routes or flag potential scheduling conflicts.
-   [ ] **AI-Powered Event Creation:** Allow users to paste a block of text (e.g., an email confirmation) and have the AI automatically parse it to fill out the "Add Event" form.

### Tier 3: Feature Expansion

-   [ ] **File Attachments:** Allow users to attach documents, images, or links to events (e.g., receipts, tickets, meeting agendas).
-   [ ] **Notifications & Reminders:** Implement browser-based notifications for upcoming events.
-   [ ] **Recurring Events:** Add support for creating events that repeat daily, weekly, or monthly.
-   [ ] **Sharing & Collaboration:** Introduce the ability to share a read-only or collaborative version of a project with another user.
-   [ ] **External Calendar Integration:** Add options to sync with Google Calendar, Outlook, or other calendar services.

### Tier 4: UI/UX Polish

-   [ ] **Grid-Based Calendar View:** Add a traditional calendar interface (day/week/month grid) as an alternative way to visualize and create events.
-   [ ] **Drag-and-Drop Rescheduling:** Allow users to reschedule events by dragging them on the calendar view.
-   [ ] **Advanced Accessibility:** Conduct a full accessibility audit and enhance keyboard navigation and ARIA attribute usage.
-   [ ] **Enhanced Mobile Experience:** Conduct a thorough review and optimization pass for small-screen devices, improving touch targets and layout.