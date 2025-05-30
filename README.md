This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```


```markdown
# Duonote

**Duonote is a crisp, narrowly-focused application primarily designed for creating your own two-way vocabulary/dictionary**. It allows users to build a personalized collection of notes, each containing a phrase or sentence in two different languages (Language A and Language B). The core idea is to help users memorize words and phrases and have quick access to them.

The app is designed to keep your personalized dictionary in sync across devices.

## Core Functionality

*   **Creating Notes**: Users can add notes, each divided into left and right containers. On the left, you enter a phrase in language A, and on the right, you enter that phrase in language B. This forms a note.
*   **Two-Way Search**: A key feature is the ability to search for a specific phrase just by typing it *either* in Language A or Language B. For example, typing an English phrase would bring up the note containing the Japanese translation, and vice versa.
*   **Fuzzy Search**: The search functionality will use "**fuzzy search**". This means that even if a user misspells the search term, the app will bring up notes that are the closest matches. For instance, typing "Teh dor is opening" would still find the note containing "The door is opening" and "ドアが開きます". Typing just part of a phrase, like "開きます", would also bring up that note and any other closest matches.
*   **Efficient Search**: The search will be performed automatically in language A and B. Results will be ranked by closeness, with the closest matches shown at the top of a scrollable list. **Efficiency is paramount**, especially as a user might have a lot of notes saved, making a reliable and efficient search feature necessary. The planned library to use for the search feature is **FlexSearch**.

## Additional Features

*   **Categories**: Users can create **categories** (or folders or collections) of notes. This is useful for organizing notes, such as separating notes by language if the user is learning multiple languages (e.g., a "Japanese" folder and a "Spanish" folder).
*   **Multi-Device Access & Offline-First**: Users need to be able to access their notes from different devices. The application will adopt an **offline-first approach**.
*   **Internationalization (UI)**: While Duonote's *content* (the user's notes) is bilingual, the app's own UI (buttons, labels, messages) might need to be translated if supporting users who speak different languages is planned.

## Use Cases

The **primary idea** behind this app is for **memorizing language vocabulary and phrases**. However, the system could potentially be used for other things requiring a two-way search. Users are **highly discouraged** from using the app for keeping any critical info, such as passwords or contact information. This is because it's not the intent of the app, and implementing the necessary security measures would be difficult.

## Technology Stack

*   **Backend**: **Google Cloud Firebase** will be the primary source of truth.
*   **Frontend (Web)**: In the first phase, the app will be rolled out as a responsive website built with **React** (specifically using **Next.js 15** and the App Router).
*   **Styling**: **Tailwind CSS** will be used for front-end styling.
*   **Frontend (Mobile)**: Later phases plan for iOS and Android releases using **React Native**. Consideration is given to keeping core logic separate for potential sharing with the React Native app.
*   **Search Library**: **FlexSearch** is planned for implementing the search feature.

## Architecture & Development Considerations

*   **Service Layer**: A "**service layer**" or "**adapter**" will be created to keep core application logic (how Duonote handles notes, languages, categories) separate from the specific API calls. This layer handles data operations and interacts with Firebase (or potentially another backend like Supabase later). If the database were migrated, primarily this layer would need rewriting to interact with the new backend, minimizing changes elsewhere.
*   **Firebase Configuration**: Configuration details, like API keys, should be stored in environment variables (`.env.local`) and explicitly **not committed** to the repository (`.gitignore`).
*   **Security & Privacy**: A critical security requirement is that **user notes should not be readable on the server**; the developer does not want to have access to user notes. While Cloud Firebase has server-side encryption, preventing the server owner from reading notes **strongly implies a need for End-to-End Encryption (E2EE)**. An `encryptionService.ts` is suggested to handle client-side encryption before sending notes to Firestore and decryption after fetching them.
*   **Offline Logic**: Firestore's built-in offline persistence will handle much of the basic offline data caching and syncing transparently via the service layer. More complex offline logic, if needed beyond Firestore's capabilities (e.g., custom queuing), could reside in `src/lib/offline.ts` or within specific services.
*   **Project Structure**: A proposed file and folder structure using the Next.js App Router with a `src/` directory is detailed. This structure aims for organization, scalability, and alignment with project needs (offline-first, services layer, future i18n). Key directories include `src/app/` (routing/pages), `src/components/` (reusable UI), `src/config/` (app configuration), `src/contexts/` (global state), `src/hooks/` (reusable logic), `src/lib/` (utilities, constants, non-UI logic), `src/locales/` (i18n translations), `src/services/` (the crucial adapter layer, including auth, firestore, search, and encryption services), and `src/types/` (TypeScript definitions). API routes (`src/app/api/`) are also available for server-side functions.
*   **Shared Logic**: Components of the architecture like the service layer (`src/services/`), types (`src/types/`), parts of the utilities (`src/lib/`), and contexts (`src/contexts/`) could be designed to be shareable between the Next.js web app and the future React Native mobile app.

## Monetization

The app will offer a **free plan** allowing up to **100 saved notes**. Paid plans will be available for users needing to save more notes.
```
