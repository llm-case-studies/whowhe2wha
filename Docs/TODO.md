# Project TODO & Roadmap

This document tracks the development progress of the **whowhe2wha** application, marking completed tasks and outlining the roadmap for future enhancements.

## Completed Features ✅

-   [x] **Core UI/UX:** Initial app structure with Dashboard, Project Cards, and Event Cards.
-   [x] **AI Search:** Gemini-powered natural language search (`queryGraph`).
-   [x] **Event Creation:** Full-featured "Add Event" form with support for creating new projects.
-   [x] **Voice Input:** Voice dictation for key form fields using the Web Speech API.
-   [x] **Automatic Geocoding:** Convert location text to geographic coordinates using Gemini.
-   [x] **Spatial View:** Interactive map modal for single locations, showing nearby events and contacts.
-   [x] **Spatial-Temporal View:** Interactive map modal for time windows, showing a multi-point itinerary and route.
-   [x] **Theming:** Added a theme switcher with light, dark, and focus modes.
-   [x] **Timeline View:** Added an interactive, scalable timeline for visualizing events and holidays.
-   [x] **Documentation:** Created a comprehensive suite of project documentation.

## Planned Features & Enhancements 🚀

### Tier 1: Core Functionality

-   [ ] **Data Persistence:** Implement local storage to save events and projects, so data persists between browser sessions. This is the highest priority feature to make the app truly useful.
-   [ ] **Edit & Delete:** Add functionality to edit and delete existing events and projects.
-   [ ] **Contact Management:** Create a dedicated view for adding and managing contacts, rather than relying on a static list.

### Tier 2: AI & Intelligence

-   [ ] **Enhanced AI Queries:** Expand the AI's capabilities to handle more complex temporal and summary-based questions.
    -   *Example:* "What do I have to do tomorrow morning?"
    -   *Example:* "Summarize my 'Series A Fundraising' project."
-   [ ] **Proactive Suggestions:** Have the AI suggest optimal routes or flag potential scheduling conflicts.

### Tier 3: Feature Expansion

-   [ ] **File Attachments:** Allow users to attach documents, images, or links to events (e.g., receipts, tickets, meeting agendas).
-   [ ] **Notifications & Reminders:** Implement browser-based notifications for upcoming events.
-   [ ] **Recurring Events:** Add support for creating events that repeat daily, weekly, or monthly.

### Tier 4: UI/UX Polish

-   [ ] **Grid-Based Calendar View:** Add a traditional calendar interface (day/week/month grid) as an alternative way to visualize and create events.
-   [ ] **Drag-and-Drop Rescheduling:** Allow users to reschedule events by dragging them on the calendar view.
-   [ ] **Advanced Accessibility:** Conduct a full accessibility audit and enhance keyboard navigation and ARIA attribute usage.