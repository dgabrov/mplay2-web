# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**mplay2-web** is a music player web application built with React 19, TypeScript, and Vite. The project uses Oxlint for static analysis and aims to provide a web-based interface for managing and playing media playlists.

## Development Commands

### Start Development Server
```bash
npm run dev
```
Runs Vite in development mode with HMR (Hot Module Replacement). The app will be available at `http://localhost:5173` by default.

### Build for Production
```bash
npm run build
```
Compiles TypeScript (`tsc -b`) and bundles with Vite. Output goes to `dist/`.

### Lint Code
```bash
npm run lint
```
Runs Oxlint to check for style and type issues. See `.oxlintrc.json` for configured rules.

### Preview Production Build
```bash
npm run preview
```
Locally previews the production build before deployment.

## Project Structure

```
src/
├── main.tsx          # React entry point with Redux Provider
├── App.tsx           # Root component
├── store.ts          # Redux store configuration
├── hooks.ts          # Typed Redux hooks (useAppDispatch, useAppSelector)
├── slices/           # Redux Toolkit slices
│   ├── authSlice.ts      # Authentication state (user, login/logout)
│   ├── mediaSlice.ts     # Media state (media list, playback controls)
│   └── reducer.ts  # Playlist state (playlists, selections)
├── App.css           # App styles
├── index.css         # Global styles
└── assets/           # Static images (react.svg, vite.svg, hero.png)

public/              # Static assets served as-is
docs/
├── html/            # HTML specifications/mockups
├── specs/           # Feature specifications (spec01.md, spec02.md)
└── todo.md          # Development TODO list

Configuration files:
├── vite.config.ts   # Vite configuration
├── tsconfig.json    # TypeScript root config (references app and node configs)
├── tsconfig.app.json # App-specific TypeScript settings
├── tsconfig.node.json # Node/build tool TypeScript settings
├── .oxlintrc.json   # Oxlint rules configuration
└── index.html       # HTML entry point
```

## Architecture & Key Details

### Build & Module System
- **Bundler**: Vite with React plugin (@vitejs/plugin-react) using Oxc
- **Module format**: ESM (ES modules)
- **TypeScript target**: ES2023
- **TypeScript config**: Strict mode enabled with no unused locals/parameters enforcement

### Type Safety
The project uses strict TypeScript settings (`noUnusedLocals`, `noUnusedParameters`) and forbids arbitrary extensions. React JSX is configured to use `react-jsx` (no need to import React in components).

### Component Structure
- Functional components with React 19.2.8
- App component currently renders minimal placeholder content
- Entry point properly uses `StrictMode` for development checks

### Linting Rules
Oxlint configuration enforces:
- React hooks rules
- Warn-only rule for exporting non-components from component files (allows constant exports)
- Core oxc rules for the bundler

### Intended Features (from docs/todo.md)
The application is planned to support:
- User login
- Main media/playlist view
- Media and playlist CRUD operations (add, edit, delete with confirmations)
- Media and playlist playback

## Redux Toolkit State Management

The application uses Redux Toolkit for centralized state management with slices pattern:

### Store Structure
- **auth**: User authentication and profile state (login/logout/updateUser)
- **media**: Media library and playback state (play/pause/stop/add/delete)
- **playlist**: Playlist management and selection (add/delete/update/select playlists)

### Using Redux in Components
Import typed hooks instead of raw Redux hooks:
```typescript
import { useAppDispatch, useAppSelector } from './hooks'

// In component:
const dispatch = useAppDispatch()
const user = useAppSelector(state => state.auth.user)
const playlists = useAppSelector(state => state.playlist.playlists)

// Dispatch actions:
dispatch(login(userData))
dispatch(addPlaylist({id: '1', name: 'New Playlist', mediaIds: []}))
```

### Creating New Slices
Each feature has its own slice in `src/slices/`. Follow the pattern:
1. Define state interface and initial state
2. Create slice with `createSlice()` containing synchronous reducers
3. Export actions and reducer as default
4. Use typed hooks in components for type safety

For async operations, consider adding async thunks to slices.

## Development Notes

- The React Compiler is intentionally not enabled due to performance impact during development/build
- HMR is enabled for fast iteration during `npm run dev`
- The project uses strict TypeScript settings to catch errors early
- Oxlint is used instead of ESLint for faster linting with the Rust-based oxc toolchain
- Redux store is initialized in `main.tsx` and wrapped with Provider to make it available to all components
