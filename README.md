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

Duonote
Duonote is a crisp, narrowly-focused application primarily designed for creating your own two-way vocabulary/dictionary. It allows users to build a personalized collection of notes, each containing a phrase or sentence in two different languages (Language A and Language B). The core idea is to help users memorize words and phrases and have quick access to them.
The app is designed to keep your personalized dictionary in sync across devices.
Core Functionality
•
Creating Notes: Users can add notes, each divided into two containers. A phrase is entered in language A in the left container, and the corresponding phrase in language B is entered in the right container.
•
Two-Way Search: A key feature is the ability to search for a specific phrase by typing it in either Language A or Language B.
•
Fuzzy Search: The search functionality will use "fuzzy search". This means that even if a user misspells a search term, the app will bring up notes that are the closest matches.
•
Efficient Search: The search will be performed automatically in both languages. Results will be ranked by closeness, with the closest matches shown at the top of a scrollable list. Efficiency is paramount, especially as users may have many notes saved. The planned library for the search feature is FlexSearch.
Additional Features
•
Categories: Users can create categories, folders, or collections of notes. This is useful for organizing notes, for example, if a user is learning multiple languages and wants to separate notes by language (e.g., a "Japanese" folder and a "Spanish" folder).
•
Multi-Device Access & Offline-First: Users need to be able to access their notes from different devices. The application will adopt an offline-first approach.
•
Internationalization (UI): While the note content is bilingual (user-defined languages), the app's user interface (buttons, labels, messages) may need to be translated to support users who speak different languages.
Use Cases
The primary use case is for memorizing language vocabulary and phrases. However, the system could potentially be used for other scenarios requiring a two-way search. Users are strongly discouraged from using the app for storing critical information like passwords or contact details, as the app is not intended for this purpose and lacks the necessary security measures.
Technology Stack
•
Backend: Google Cloud Firebase will be used as the primary source of truth.
•
Frontend (Web): Initially, the app will be rolled out as a responsive website built with React (using Next.js 15 and the App Router).
•
Styling: Tailwind CSS will be used for front-end styling.
•
Frontend (Mobile): Later phases plan for iOS and Android releases using React Native. Shared logic between web and mobile is a consideration.
•
Search Library: FlexSearch is planned for implementing the search feature.
Architecture & Development Considerations
•
Service Layer: A "service layer" or "adapter" will be created to separate core application logic (handling notes, languages, categories) from specific API calls. This approach minimizes changes required if the backend database were to be migrated in the future. This layer will handle data operations, interacting with Firebase.
•
Firebase Configuration: Configuration details for Firebase (like API keys) should be stored in environment variables and not committed to the repository.
•
Security & Privacy: A key security requirement is that user notes should not be readable on the server; the developer does not want to have access to user notes. While Cloud Firebase offers server-side encryption, to truly prevent the server owner (the developer) from reading note content, End-to-End Encryption (E2EE) is strongly implied. A dedicated encryptionService.ts could handle client-side encryption before sending notes to Firestore and decryption after fetching them.
•
Offline Logic: Firestore's built-in offline persistence will handle much of the basic data caching and syncing. More complex offline logic could reside in a utility file or within specific services.
•
Project Structure: A proposed file and folder structure utilizing the Next.js App Router with a src/ directory is suggested to ensure organization, scalability, and alignment with project needs (offline-first, services layer, future i18n). Key directories include src/app/ (routing/pages), src/components/ (reusable UI), src/config/ (app configuration), src/contexts/ (global state), src/hooks/ (reusable logic), src/lib/ (utilities, constants), src/locales/ (i18n translations), src/services/ (the crucial adapter layer), and src/types/ (TypeScript definitions).
Monetization
The app will offer a free plan allowing up to 100 saved notes. Paid plans will be available for users needing to save more notes.
