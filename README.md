# Torneta

A minimalist marketing site for Torneta, an AI visibility platform that helps brands appear inside AI-generated responses.

## Repository Layout

All application files live inside the `torneta-app/` directory so the project can be downloaded or packaged as a single folder.

```
.
└── torneta-app
    ├── index.html
    ├── package.json
    ├── postcss.config.cjs
    ├── tailwind.config.cjs
    ├── vite.config.js
    └── src
        ├── App.jsx
        ├── components
        │   ├── Footer.jsx
        │   ├── Layout.jsx
        │   └── Navbar.jsx
        ├── index.css
        ├── lib
        │   └── supabaseClient.js
        ├── main.jsx
        ├── pages
        │   ├── Landing.jsx
        │   └── Pricing.jsx
        └── sections
            ├── CTASection.jsx
            ├── HeroSection.jsx
            ├── HowItWorks.jsx
            └── StatsSection.jsx
```

## Tech Stack
- [React](https://react.dev/) with [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) for subtle reveal animations
- [React Router](https://reactrouter.com/) for multi-page routing

## Getting Started

> **Note:** Installing dependencies may require network access.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the app in your browser at the URL printed in the terminal (default: `http://localhost:5173`).

## Pages
- **Landing** (`/`): Hero, how it works, stats/testimonial, and CTA sections tailored to AI visibility messaging.
- **Pricing** (`/pricing`): Three-tier pricing table with gradient hover effects and call-to-action buttons.

## Tailwind Utilities
Custom colors, fonts, and shadows are configured in `tailwind.config.cjs` for a light, modern aesthetic referencing the ProFound design language.

## Supabase Integration
A placeholder `supabaseClient.js` file is provided to streamline adding authentication with Supabase at a later stage.
