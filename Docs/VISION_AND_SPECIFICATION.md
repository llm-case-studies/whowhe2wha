# Vision & Specification: The Living Timeline

## 1. Guiding Philosophy

The timeline's primary purpose is to provide an **information-rich, visually clean** overview of a user's context. It must answer high-level questions at a glance ("How busy is next month?") while providing access to deep detail without clutter. Our core principle is **"Clarity at a Distance, Detail on Demand."**

## 2. Core Components & Principles

1.  **The Event Marker:** The fundamental unit of the timeline is the event marker. It is a small, visually distinct "dot" or icon. Its purpose is to signify "something happened here" without revealing all the details immediately.
2.  **The Hover-Card (`TimelineEventTooltip`):** This is the *exclusive* mechanism for revealing detail. All on-timeline interactivity for event markers will trigger this single, consistent, beautifully designed component. It prevents visual clutter and provides a predictable user experience.
3.  **Visual Differentiation:** Different `WhatType`s should be instantly distinguishable by the *style* of their Event Marker, not by text labels on the timeline itself. This maintains the clean aesthetic.
4.  **Durational Cues:** Events that span time (`Period`, `Deadline`) must visually represent their duration without overwhelming the view.

---

## 3. Specification: Event Type Renderers

This section details the specific visual representation for each `WhatType` on the timeline.

#### A. `WhatType: Appointment` / `WhatType: Task`

*   **Concept:** These are the most common, point-in-time events. They are the baseline for the timeline's visual language.
*   **Timeline Renderer Spec:**
    *   **Marker:** A simple, solid, circular dot (`<div class="...rounded-full">`).
    *   **Size:** Approximately 12px in diameter.
    *   **Color:** Inherits the color from its parent `Project`.
    *   **Interactivity:** On hover, it displays the standard `TimelineEventTooltip`.

#### B. `WhatType: Milestone`

*   **Concept:** A significant achievement or goal marker. It should feel celebratory and distinct.
*   **Timeline Renderer Spec:**
    *   **Marker:** A star icon (⭐).
    *   **Size:** Approximately 16px by 16px, slightly larger than a standard dot to draw attention.
    *   **Color:** A distinct, celebratory color, such as `--color-to-orange` (gold/yellow), overriding the project color to signify its special status.
    *   **Interactivity:** On hover, it displays the standard `TimelineEventTooltip`.

#### C. `WhatType: Checkpoint`

*   **Concept:** A low-stakes progress check. It should be visible but less prominent than an `Appointment`.
*   **Timeline Renderer Spec:**
    *   **Marker:** A simple checkmark icon (✓) or a circular icon with a checkmark inside.
    *   **Size:** Same as a standard dot (12px).
    *   **Color:** Inherits the color from its parent `Project`.
    *   **Interactivity:** On hover, it displays the standard `TimelineEventTooltip`.

#### D. `WhatType: Deadline`

*   **Concept:** A critical due date. The visualization must communicate not just the date itself, but the "runway" or lead-up time to it.
*   **Timeline Renderer Spec:**
    *   **Marker:** A distinct, urgent icon, like a clock or an exclamation point in a circle, positioned on the due date.
    *   **Durational Representation (The "Runway"):** A semi-transparent, dashed, or thin solid bar that stretches *backwards* from the deadline marker.
        *   The length of this bar is determined by the `leadTimeDays` property on the `WhatNode`.
        *   The bar's color is a low-opacity version of the parent project's color.
    *   **Interactivity:** Hovering over either the main marker *or* the runway bar will display the standard `TimelineEventTooltip`.

---

## 4. Specification: Container Events (`Period`)

#### A. Concept

A `Period` is a container for other events. It represents a block of time dedicated to a specific phase or activity (e.g., "Week 1-4: Build Base Mileage," "Tony Robbins Challenge"). It must be able to expand and collapse to manage visual complexity.

#### B. Timeline Renderer Spec

A `Period` has two states on the timeline:

*   **Collapsed State (Default):**
    *   **Marker:** A solid, continuous, rectangular bar with rounded corners.
    *   **Position:** Occupies a horizontal lane within its project's swimlane.
    *   **Dimensions:** Its left edge aligns with its `when` (start date) and its right edge aligns with its `endWhen` (end date). Its height is fixed (e.g., 20px).
    *   **Color:** Inherits the color from its parent `Project`.
    *   **Label:** The event name (`what.name`) is rendered directly on the bar.
    *   **Indicator:** A small `+` or `►` icon is displayed on the bar to indicate it is expandable.
    *   **Interactivity:** Clicking the expand indicator transitions it to the Expanded State. Hovering anywhere else on the bar shows the `TimelineEventTooltip` for the `Period` itself.

*   **Expanded State:**
    *   **Lane Behavior:** The swimlane for this specific project dynamically expands its height to accommodate the child events.
    *   **Marker:** The `Period` bar's background becomes semi-transparent or changes to an outline style. The label remains.
    *   **Indicator:** The icon changes to `-` or `▼`.
    *   **Child Events:** All child events (those with a matching `parentId`) are rendered inside the expanded area, positioned correctly according to their own dates and using their own `WhatType` renderers (dots, stars, etc.).
    *   **Interactivity:** Clicking the collapse indicator returns it to the Collapsed State.

---

## 5. Specification: Interactive Templates on the Timeline

#### A. Concept

A `ProjectTemplate` is not just a data structure; it is an interactive, visual object. When selected by a user, it appears on the timeline in a **"floating" or "uninstantiated"** state. It represents a potential sequence of events whose start date has not yet been committed. This allows for fluid, visual planning, enabling the user to "test fit" a complex project into their existing schedule before locking it in.

#### B. Timeline Renderer Spec (Floating State)

*   **Container:** The entire template is rendered within a single, semi-transparent container that spans the full duration of its events. This container has a distinct visual style (e.g., a dashed border, a subtle background pattern) to differentiate it from committed projects.
*   **Ghost Events:** Inside the container, the template's events are rendered as "ghosts" or outlines of their eventual markers. A `Period` is an outlined bar, a `Task` is an empty circle, and a `Milestone` is an outlined star. This communicates the structure of the plan without adding visual noise.
*   **Label:** The template's name is clearly visible on the container.

#### C. Interaction

*   **Adding to Timeline:** The user selects a template from a library (e.g., via a dropdown in the `ViewControls`). The template's renderer appears on the timeline, initially anchored to "Today" or the center of the current view.
*   **Dragging (Time-Shifting):**
    *   The entire floating template container is draggable horizontally along the timeline.
    *   As the user drags it, a tooltip or a temporary label shows the prospective start date in real-time.
    *   This allows the user to slide the template back and forth to visually align it with gaps in their schedule or other key dates.
*   **Instantiation (Committing):**
    *   When the user stops dragging, a "Commit" or "Schedule Project" button appears on the container or in a hover-card.
    *   Clicking this button opens a small confirmation modal. This modal asks the user to confirm the start date and assign the new project to a `Category` and `Color`.
    *   Upon confirmation, the floating template renderer is removed from the timeline.
    *   The system creates a new `Project` and a series of new, concrete `EventNode`s based on the template's structure and the selected start date. These new events are then rendered on the timeline as normal, fully-interactive markers.