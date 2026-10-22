# Todoist Clone Backend

This is the backend for a Todoist clone, built with Node.js, Express, better-sqlite3, and TypeScript. It features an offline-first synchronization engine allowing mobile clients to seamlessly push and pull data.

## Tech Stack

- **Node.js**: JavaScript runtime environment.
- **Express**: Web framework for building APIs.
- **better-sqlite3**: Fast and synchronous SQLite3 driver for Node.js.
- **TypeScript**: Static typing for robustness.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

1. Navigate to the `backend` directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start:dev
   ```
   *(Assuming a `start:dev` script using `ts-node` or `nodemon` is configured in `package.json`, or you can simply run `npx ts-node src/index.ts`)*

## API Documentation

### Authentication
Requests to protected endpoints must include a JWT in the `Authorization` header:
`Authorization: Bearer <token>`

---

### Sync API

#### `POST /api/sync/pull`
Pulls records that have been updated since the client's last sync.

**Request Payload:**
```json
{
  "client_last_sync": 1698242000000
}
```
* `client_last_sync`: A millisecond timestamp.

**Response Payload:**
```json
{
  "projects": [{...}],
  "tasks": [{...}],
  "tags": [{...}],
  "task_tags": [{...}],
  "server_timestamp": 1698243000000
}
```
* The response includes arrays of records updated after `client_last_sync` for the authenticated user.
* `server_timestamp`: The timestamp the client should use as its `client_last_sync` in the next pull request.

#### `POST /api/sync/push`
Pushes local client changes to the server. Resolves conflicts using a Last-Write-Wins (LWW) strategy.

**Request Payload:**
```json
{
  "projects": [
    {
      "id": "uuid-1234",
      "user_id": "user-123",
      "name": "New Project",
      "color": "#fff",
      "order_val": "0",
      "is_deleted": 0,
      "updated_at": 1698243000000,
      "created_at": 1698243000000
    }
  ],
  "tasks": [...],
  "tags": [...],
  "task_tags": [...]
}
```
* Only modified entities need to be included in the request.
* `updated_at` must be provided for every record to correctly resolve LWW conflicts.

**Response Payload:**
```json
{
  "status": "ok",
  "server_timestamp": 1698243000000
}
```
