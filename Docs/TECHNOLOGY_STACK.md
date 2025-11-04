# Technology Stack

The **whowhe2wha** application is built with a modern, lightweight, and powerful technology stack designed for rapid development and a rich user experience.

### Frontend Framework

-   **React 19:** The core of the user interface is built with React. We leverage its component-based architecture for building a modular and maintainable UI. We use React Hooks (`useState`, `useEffect`, `useCallback`) for state management and handling side effects.
-   **React DOM:** Used for rendering the React components into the browser's DOM.

### Language

-   **TypeScript:** The entire frontend codebase is written in TypeScript. This provides static typing, which helps catch errors early, improves code quality, and makes the codebase easier to understand and refactor.

### AI Engine

-   **Google Gemini API (`@google/genai`):** This is the brain of the application. We use the `gemini-2.5-flash` model for its speed and effectiveness in two key areas:
    1.  **Natural Language Query Processing:** The `queryGraph` service sends the user's search query and the entire data context (projects and events) to Gemini, which intelligently returns the IDs of matching events.
    2.  **Geocoding:** The `geocodeLocation` service uses Gemini with **Google Maps Grounding** to convert user-entered location strings (e.g., "Pearl Dental in Monroe TWP NJ") into precise, canonical addresses with latitude and longitude.

### Styling

-   **Tailwind CSS:** A utility-first CSS framework used for all styling. It allows for rapid prototyping and building a custom design system directly in the HTML. The configuration is defined in a `<script>` tag in `index.html` for simplicity.

### Browser APIs

-   **Web Speech API (`SpeechRecognition`):** This browser-native API is used to implement the voice-to-text dictation feature in the "Add Event" form.
-   **Permissions API:** Used to proactively check for microphone permissions to provide a better user experience for the voice dictation feature.

### Module System & Build Process

-   **ES Modules (ESM) via Import Maps:** The application uses modern JavaScript modules. To simplify the development setup and avoid a complex build toolchain (like Webpack or Vite), we use an **`importmap`** directly in `index.html`. This tells the browser how to resolve module specifiers like `react` or `@google/genai`, allowing it to fetch them directly from a CDN (`aistudiocdn.com`). This results in a zero-build-step development environment.