# SwastyaScan: AI Health Analyzer

This is a Next.js application that provides a chat-based interface for preliminary health analysis using Google's Generative AI. Users can describe their symptoms or upload an image to get an AI-powered assessment.

## Features

-   **Chat-based Interface:** An intuitive and responsive chat UI for interacting with the AI.
-   **Multimodal Input:** Accepts both text descriptions and image uploads for analysis.
-   **AI-Powered Analysis:** Uses Google's Gemini model via Genkit to provide insights on potential conditions, causes, treatments, and routines.
-   **Professional Layout:** Features a modern, responsive design with a sidebar for navigation.

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **AI:** [Genkit](https://firebase.google.com/docs/genkit) with the Gemini model
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   [Node.js](https://nodejs.org/en) (version 20 or later recommended)
-   [npm](https://www.npmjs.com/) (or your preferred package manager)

### 1. Installation

First, clone the repository to your local machine and install the dependencies:

```bash
git clone <your-repo-url>
cd <repo-name>
npm install
```

### 2. Environment Variables

This project uses the Google Gemini API, which requires an API key.

1.  Create a new file named `.env.local` in the root of the project.
2.  Copy the contents of `.env.example` into `.env.local`.
3.  Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
4.  Add your API key to `.env.local`:

    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

Next.js will automatically load this environment variable for you.

### 3. Running the Application

You need to run two processes in separate terminals for the application to work correctly: the Next.js frontend and the Genkit AI flows.

**Terminal 1: Start the Next.js development server**

```bash
npm run dev
```

This will start the web application, typically on `http://localhost:9002`.

**Terminal 2: Start the Genkit development server**

```bash
npm run genkit:dev
```

This starts the Genkit flows that the Next.js application calls for AI analysis.

Now, you can open your browser to `http://localhost:9002` to see the application running.

## Available Scripts

-   `npm run dev`: Starts the Next.js development server.
-   `npm run genkit:dev`: Starts the Genkit development server for AI flows.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the codebase for errors.
-   `npm run typecheck`: Runs TypeScript to check for type errors.
