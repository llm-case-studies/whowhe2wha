# Specification: The Rhythmic Grid & Pattern Painter

## 1. Vision: The Rhythmic Grid

The Rhythmic Grid is a suite of views designed to visualize the **cadence and patterns** of life, not just individual appointments. It complements the high-level `TimelineView` and the detailed `StreamView` by providing a powerful, pattern-oriented perspective. Its core purpose is to transform the calendar from a simple container of dates into an analytical tool that makes recurring patterns instantly visible.

---

## 2. Proposed Grid Views

We will introduce a new "Grid" view, accessible from the `ViewControls`, containing two primary modes.

### A. The Linear Annual Grid

This is the innovative, pattern-finding view. It is a scrollable, linear representation of the year, similar to a heatmap.

*   **Structure:** A single, continuous, scrollable grid. A top-level control will allow the user to toggle between two layouts:
    *   **Week-Based Layout (7 columns):** The grid has 7 columns (e.g., Mon-Sun). Each row represents a full week. An entire year would be approximately 52 rows tall. This view is infinitely scrollable, seamlessly transitioning from one year to the next.
    *   **Month-Based Layout (31 columns):** The grid has 31 columns (Day 1-31). Each row represents a month. A year is 12 rows tall.

*   **Visualization:**
    *   **Point-in-Time Events (`Task`, `Appointment`, `Milestone`):** Rendered as a colored dot within a cell.
        *   **Pattern Recognition:** A task that repeats every Tuesday will form a perfect vertical line in the Week-Based Layout. A bill due on the 15th of every month will form a vertical line in the Month-Based Layout.
    *   **Durational Events (`Period`):** Rendered as a solid, colored bar that spans multiple cells (days). A week-long vacation would be a bar stretching across 7 cells in its row.
    *   **Color Coding:** Cells are colored based on the `Project` color, creating a heatmap of which life domains are active on any given day. Days with multiple events could show multiple colors or a blended gradient.
    *   **Interaction:** Hovering over any cell or event bar will bring up the standard, rich `TimelineEventTooltip` with full details and actions.

### B. The Traditional Calendar Grid

We will also include a traditional calendar for its familiarity and utility in day-to-day planning.

*   **Structure:** A standard monthly, weekly, or daily grid. Users can toggle between these scales.
*   **Visualization:**
    *   **`Period` Events:** Render as multi-day banners at the top of the grid, similar to Google Calendar.
    *   **`Appointment` Events:** Render as timed blocks within a day (in Week or Day view).
    *   **`Task`/`Checkpoint`/`Milestone` Events:** Render as "all-day" events at the top of the day's column.
*   **Interaction:** Click-and-drag to create new events. Drag-and-drop existing events to reschedule them.

---

## 3. The Killer Feature: The "Pattern Painter"

To provide a convenient and intuitive way to define recurring events, we will turn the Linear Annual Grid into a powerful creation tool.

*   **Concept:** The "Pattern Painter" transforms the act of scheduling from filling out a form into a direct, visual, and intuitive manipulation of time itself.

*   **How it Works:**
    1.  The user clicks an "Add Recurring Event" button, which activates "painting mode" on the Linear Annual Grid. The cursor changes to indicate the new mode.
    2.  **To create a weekly recurring event:**
        *   In the **Week-Based Layout**, the user clicks on a day (e.g., any Tuesday).
        *   As they drag their mouse **vertically**, the tool automatically highlights and selects every Tuesday in their drag path. They are literally "painting" the recurrence pattern down the column.
    3.  **To create a monthly recurring event:**
        *   In the **Month-Based Layout**, the user clicks on a day number (e.g., the 15th).
        *   Dragging **vertically** selects the 15th of every subsequent month.
    4.  **To define duration:**
        *   Before dragging vertically, the user can first drag **horizontally** from their start day. If they drag across 3 cells, they are defining a 3-day event.
        *   Now, when they drag vertically, the tool will paint a recurring 3-day event (e.g., a recurring "Mon-Wed" block).
    5.  **Confirmation:** When the user releases the mouse, a small modal appears confirming the pattern ("Create a new 3-day event every Monday, Tuesday, and Wednesday?"), allowing them to name it and assign it to a project.
    6.  Upon confirmation, the new recurring `EventNode` is created.
