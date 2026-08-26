# mplay2-web

A modern, web-based music player application built with React, TypeScript, and Vite. Manage and play media playlists with a clean, responsive interface.

## Features

- 🎵 **Media Playback** – Play, pause, and stop media with intuitive controls
- 📋 **Playlist Management** – Create, edit, and organize playlists
- 👤 **User Authentication** – Secure login and user profile management
- ⚡ **Fast Development** – Hot Module Replacement (HMR) for instant feedback
- 🎯 **Type-Safe** – Strict TypeScript settings catch errors early
- 📊 **State Management** – Redux Toolkit for centralized state
- ✅ **Code Quality** – Oxlint for fast, reliable code analysis

## Tech Stack

- **Frontend Framework**: React 19.2.8
- **Language**: TypeScript with strict mode
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Linting**: Oxlint (Rust-based, faster than ESLint)
- **Module System**: ES Modules (ESM)
- **Target**: ES2023

## Project Structure

```
mplay2-web/
├── src/
│   ├── main.tsx                    # React entry point with Redux Provider
│   ├── App.tsx                     # Root component
│   ├── App.css                     # App styles
│   ├── index.css                   # Global styles
│   ├── store.ts                    # Redux store configuration
│   ├── hooks.ts                    # Typed Redux hooks
│   ├── slices/                     # Redux Toolkit slices
│   │   ├── authSlice.ts           # Authentication state
│   │   ├── mediaSlice.ts          # Media and playback state
│   │   └── reducer.ts             # Playlist state management
│   └── assets/                     # Static images and assets
├── public/                         # Static files served as-is
├── docs/
│   ├── html/                       # HTML specifications and mockups
│   ├── specs/                      # Feature specifications
│   └── todo.md                     # Development TODO list
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript root configuration
├── tsconfig.app.json               # App-specific TypeScript settings
├── tsconfig.node.json              # Node/build tool TypeScript settings
├── .oxlintrc.json                  # Oxlint rules configuration
├── index.html                      # HTML entry point
├── package.json                    # Project dependencies
└── README.md                        # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mplay2-web.git
cd mplay2-web
```

2. Install dependencies:
```bash
npm install
```

## Development

### Start Development Server

```bash
npm run dev
```

Starts the Vite development server with HMR enabled. The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Compiles TypeScript and bundles the application with Vite. Output is generated in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Locally preview the production build before deployment.

### Lint Code

```bash
npm run lint
```

Runs Oxlint to check for style and type issues. Configuration is defined in `.oxlintrc.json`.

## State Management

The application uses Redux Toolkit with a slices-based architecture for centralized state management.

### Store Structure

- **auth** – User authentication and profile state (login/logout/updateUser)
- **media** – Media library and playback state (play/pause/stop/add/delete)
- **playlist** – Playlist management and selection

### Using Redux in Components

```typescript
import { useAppDispatch, useAppSelector } from './hooks'

export function MyComponent() {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.auth.user)
  const playlists = useAppSelector(state => state.playlist.playlists)

  const handleLogin = (userData) => {
    dispatch(login(userData))
  }

  const handleAddPlaylist = () => {
    dispatch(addPlaylist({ id: '1', name: 'New Playlist', mediaIds: [] }))
  }

  return (
    // component JSX
  )
}
```

## Architecture Notes

- **Functional Components** – React 19 with functional components and hooks
- **Strict TypeScript** – `noUnusedLocals` and `noUnusedParameters` enforced
- **JSX Transform** – React 19's `react-jsx` transform (no need to import React)
- **Oxlint Rules** – Enforces React hooks rules and core oxc rules
- **No React Compiler** – Intentionally disabled due to development performance impact
- **HMR Enabled** – Fast iteration during development

## Planned Features

- User login and authentication
- Main media/playlist view
- Media CRUD operations (add, edit, delete with confirmations)
- Playlist CRUD operations
- Media and playlist playback controls
- Responsive, mobile-friendly UI

## Contributing

Contributions are welcome! Please ensure:

1. Code passes `npm run lint`
2. TypeScript compiles without errors (`npm run build`)
3. Changes follow the existing code style and architecture
4. New components are functional and TypeScript-strict

## License

This project is licensed under the MIT License – see the LICENSE file for details.

## Author

Daniel Gabroveanu
