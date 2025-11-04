# User Journey: Managing Life's Complexity with whowhe2wha

This document outlines a typical user journey, illustrating how the **whowhe2wha** Unified Context Engine helps a user named Alex navigate a complex, real-world scenario.

## 1. The Persona: Alex

-   **Who:** Alex is a busy professional and parent, juggling a demanding job, family commitments, and personal appointments.
-   **Problem:** Alex's life information is fragmented across a digital calendar, a physical notepad, email threads, and text messages. Planning is a manual, high-effort process of piecing together disparate bits of information. Alex often feels reactive rather than proactive.
-   **Goal:** Alex needs a single, intelligent system that understands the *context* behind appointments and tasks, allowing for natural, fluid planning.

## 2. The Scenario: A Multi-Step Dental Treatment

Alex is undergoing a dental implant procedure, a multi-month project involving consultations, surgery, and check-ups. At the same time, normal life continues with work deadlines and family errands.

### Step 1: Capturing the Context

-   **The Trigger:** Alex receives the treatment plan from the dental clinic.
-   **Action:** Alex opens **whowhe2wha** and clicks "Add Event."
-   **Input:**
    -   **What:** "Initial Consultation & Scan"
    -   **Project:** Alex types "Dental Implant Treatment" into the project field. Since it doesn't exist, the app prepares to create it.
    -   **When:** Enters the date and time.
    -   **Who:** "Dr. Smith"
    -   **Where:** Alex types "Springfield Clinic." On blurring the field, a spinner appears, and the app automatically geocodes the location, confirming with a pin icon.
-   **Outcome:** The first event node is created and linked to a new, active project. Alex repeats this for the "Implant Surgery" and "Post-Op Check-up" events, quickly building out the entire project timeline.

### Step 2: Integrating Everyday Life

-   **The Trigger:** Alex remembers a few other tasks for the week.
-   **Action:** Alex uses the "Add Event" form again. This time, Alex is in a hurry and uses the voice dictation feature.
-   **Input:**
    -   Alex clicks the microphone icon next to the "What" field and says, "Pick up library books." The text appears instantly.
    -   For the project, Alex creates a new one called "Town Errands."
    -   Alex clicks the mic for the "Where" field and says, "Downtown Library." The app transcribes the text and, on blur, geocodes it.
-   **Outcome:** The "Town Errands" project now coexists with the "Dental Implant Treatment" project in the main stream, but all events are clearly organized.

### Step 3: Proactive Planning with Natural Language

-   **The Trigger:** A week later, Alex needs to plan their travel for an upcoming busy day.
-   **Action:** Alex goes to the **whowhe2wha** search bar.
-   **Query:** Alex types a natural language query: **"what's happening on November 15th?"**
-   **Result:** The Dashboard instantly filters, hiding all other projects and showing only the two events scheduled for that day:
    1.  `3:00 PM`: Initial Consultation & Scan @ Springfield Clinic
    2.  `4:30 PM`: Pick up library books @ Downtown Library

### Step 4: The Spatial-Temporal "Aha!" Moment

-   **The Trigger:** Alex sees the two events and wonders about the logistics. "How far apart are they? What's the best route?"
-   **Action:** Alex clicks on the date tag, "Nov 15, 2025."
-   **Result:** The **Spatial-Temporal View** modal appears.
    -   On the right, a clear itinerary lists the two events in chronological order.
    -   On the left, an embedded map displays a route connecting the Springfield Clinic and the Downtown Library.
-   **Outcome:** Alex immediately understands the geographic relationship between the day's tasks. The abstract list of appointments becomes a concrete, visual plan, allowing Alex to efficiently manage time and travel.

### Step 5: Discovering Hidden Context

-   **The Trigger:** While looking at the map, Alex decides to be proactive and schedule the next major appointment.
-   **Action:** Alex closes the Spatial-Temporal View and clicks on the location tag for "Springfield Clinic" on the event card.
-   **Result:** The **Map Modal** for the clinic opens.
    -   It shows the clinic's location on a map.
    -   Alex clicks the "Contacts & Partners" tab.
    -   The app lists "Dr. Smith" and "Clinic Reception." Next to the reception's name is a "Schedule" button.
-   **Action:** Alex clicks "Schedule."
-   **Result:** The map modal closes, and the "Add Event" form immediately opens, pre-populated with:
    -   **Who:** Clinic Reception
    -   **Where:** Springfield Clinic
-   **Outcome:** **whowhe2wha** seamlessly transitioned from providing information to enabling action. Alex has successfully used the unified context graph to not only understand their schedule but to act on it with zero friction.