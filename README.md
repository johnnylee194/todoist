# Todoist Clone - Fullstack Task Management

A cross-platform, offline-first task management application inspired by Todoist. This project is divided into three distinct modules, providing a robust web experience and a resilient, offline-capable mobile experience.

## 🏗 Architecture Overview

This repository is structured as a monorepo containing three separate applications:

- **/backend**: Node.js + Express + `better-sqlite3`.
  Acts as the central source of truth. Features JWT authentication and a custom incremental synchronization engine using a Last-Write-Wins (LWW) conflict resolution strategy.
- **/web (Planned/Coming Soon)**: React + Vite + TypeScript.
  The desktop/web client. Styled with Tailwind CSS and `shadcn/ui` for a modern, accessible, and highly polished user interface.
- **/mobile (Planned/Coming Soon)**: React Native + Expo.
  The Android mobile client. Built with an offline-first approach using `expo-sqlite`. It features local background syncing and utilizes `expo-notifications` (AlarmManager) for reliable, offline-capable task reminders.

## ✨ Core Features

- **Offline-First Mobile**: Create, edit, and organize tasks on Android without an internet connection. Changes are queued and synced seamlessly when back online.
- **Incremental Sync Engine**: Efficiently pushes and pulls only modified data (Sync Token approach) with soft-deletion support (`is_deleted`) to preserve data integrity across multiple devices.
- **Project & Tag Organization**: Robust data model supporting tasks, multi-level nesting, projects, and many-to-many tag relationships.
- **Reliable Local Notifications**: Android push notifications bypass network restrictions by utilizing system-level device alarms for task reminders.

## 🚀 Getting Started

To run the stack locally, you will need to start the development servers for the components you wish to work on.

### Backend Server

```bash
cd backend
npm install
npx ts-node src/index.ts
```

The API runs on `http://localhost:3000` by default. An SQLite database will be initialized automatically in the `backend` folder.

*(Note: Web and Mobile clients are currently in development and instructions will be added here once they are available.)*

## 🗺 Roadmap

- **Phase 1**: Core Data Modeling & Sync Engine (Completed)
- **Phase 2**: Frontend Layouts & UI Foundation (In Progress)
- **Phase 3**: Task CRUD, Drag-and-Drop Sorting, and Reminder Integrations
- **Phase 4**: Custom Filters, Views, and Advanced Nesting
