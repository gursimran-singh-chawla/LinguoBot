# LinguoBot

LinguoBot is a multilingual AI chat interface prototype designed around the idea of language-agnostic support. A user can write in different languages while the application applies an industry-specific system instruction and returns a response through Gemini.

## Features

- Multilingual chat experience
- Industry presets:
  - General Support
  - Banking & Finance
  - Healthcare
  - Education
  - E-Governance
- Responsive chat interface
- Conversation reset
- Loading and error states
- TypeScript-based React codebase

## Tech stack

- React
- TypeScript
- Vite
- `@google/genai`

## Run locally

### Prerequisites

- Node.js 20+
- npm
- A Gemini API key

### Setup

```bash
git clone https://github.com/00believer00/LinguoBot.git
cd LinguoBot
npm install
```

Create a local environment file:

```text
GEMINI_API_KEY=your_api_key_here
```

Then start the development server:

```bash
npm run dev
```

## Security note

Do not commit a real API key. This project is a prototype; for a production application, the Gemini request should be made through a server-side service so the credential is not exposed to browser users. The Google Gen AI SDK documentation also recommends avoiding API keys in client-side code for production environments.

## Project status

Prototype / learning project. The repository is being cleaned up as I turn the experiment into a more maintainable portfolio project.

## Author

Gursimran Singh Chawla  
[GitHub](https://github.com/00believer00)
