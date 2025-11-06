# Project TODO & Roadmap

This document tracks the development progress of the **whowhe2wha** application, marking completed tasks and outlining the roadmap for future enhancements.

## Completed Features ✅

-   [x] **Core UI/UX:** Initial app structure with Dashboard, Project Cards, and Event Cards.
-   [x] **Data Persistence:** Implemented local storage to save all entities, so data persists between browser sessions.
-   [x] **AI Search:** Gemini-powered natural language search (`queryGraph`).
-   [x] **Full CRUD Functionality:** Implemented Create, Read, Update, and Delete for Projects, Events, Locations, and Contacts.
-   [x] **Location Intelligence (Full Epic):**
    -   [x] Reworked data model to treat Locations as first-class entities.
    -   [x] Implemented an AI-powered workflow for discovering new locations from text or Google Maps URLs.
    -   [x] Created a full-featured Location Detail profile modal.
-   [x] **Contact Management:** Added modals for creating, editing, and deleting contacts.
-   [x] **Advanced Project Templates:**
    -   [x] Created a full-featured template editor.
    -   [x] Implemented structured scheduling with start offsets and durations.
    -   [x] Added ability to link external URLs to template steps.
    -   [x] Implemented "Save as New" to fork existing templates.
-   [x] **Voice Input:** Voice dictation for key form fields using the Web Speech API.
-   [x] **Spatial View:** Interactive map modal for single locations, showing nearby events and contacts.
-   [x] **Spatial-Temporal View:** Interactive map modal for time windows, showing a multi-point itinerary and route.
-   [x] **Theming:** Added a theme switcher with light, dark, and focus modes.
-   [x] **Timeline View:** Added an interactive, scalable timeline for visualizing events and holidays.
-   [x] **Dynamic Timeline Layout:** Implemented a configurable, multi-tier (swimlane) timeline layout.
-   [x] **PWA Functionality:** Made the app installable with offline support via a service worker and web manifest.
-   [x] **Documentation:** Created a comprehensive suite of project documentation.
-   [x] **Undo History:** Implemented a functional undo history for all major data-modifying actions, including templates.

## Planned Features & Enhancements 🚀

### Tier 1: Core Functionality

-   [ ] **Dedicated Contact Management View:** Create a dedicated screen for viewing and managing all contacts, separate from the main dashboard.
-   [ ] **Data Import/Export:** Add functionality to export all user data to a standard format (JSON, CSV) and import events from `.ics` files.
-   [ ] **Recurring Events:** Add support for creating events that repeat daily, weekly, or monthly.

### Tier 2: AI & Intelligence

-   [ ] **Enhanced AI Queries:** Expand the AI's capabilities to handle more complex temporal and summary-based questions.
    -   *Example:* "What do I have to do tomorrow morning?"
    -   *Example:* "Summarize my 'Series A Fundraising' project."
-   [ ] **Proactive Suggestions:** Have the AI suggest optimal routes or flag potential scheduling conflicts.
-   [ ] **AI-Powered Event Creation:** Allow users to paste a block of text (e.g., an email confirmation) and have the AI automatically parse it to fill out the "Add Event" form.

### Tier 3: Feature Expansion

-   [ ] **Sharing & Collaboration:** Introduce the ability to share a read-only or collaborative version of a project with another user.
-   [ ] **File Attachments:** Allow users to attach documents, images, or links to events (e.g., receipts, tickets, meeting agendas).
-   [ ] **Notifications & Reminders:** Implement browser-based notifications for upcoming events.
-   [ ] **External Calendar Integration:** Add options to sync with Google Calendar, Outlook, or other calendar services.

### Tier 4: UI/UX Polish

-   [ ] **Grid-Based Calendar View:** Add a traditional calendar interface (day/week/month grid) as an alternative way to visualize and create events.
-   [ ] **Drag-and-Drop Rescheduling:** Allow users to reschedule events by dragging them on the calendar view.
-   [ ] **Advanced Accessibility:** Conduct a full accessibility audit and enhance keyboard navigation and ARIA attribute usage.
-   [ ] **Enhanced Mobile Experience:** Conduct a thorough review and optimization pass for small-screen devices, improving touch targets and layout.