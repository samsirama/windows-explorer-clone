# Windows Explorer Clone

A web-based clone of the Windows 11 Explorer, built with **Bun**, **Elysia**, **PostgreSQL**, and **Vue 3**.

![Explorer Preview](https://imgur.com/a/Zif4Sjs)

## Features

- **Split-Pane Interface**: Recursive sidebar tree navigation and dynamic content view.
- **Deep Nesting**: Supports unlimited folder depth.
- **File System Logic**:
  - **Single Click**: Selects item.
  - **Double Click**: Opens folder.
  - **Expand/Collapse**: Use the arrow icons in the sidebar.
- **Search**: Real-time filtering of folders and files.
- **Database driven**: All data persists in PostgreSQL.

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Backend Frameowrk**: [ElysiaJS](https://elysiajs.com)
- **Database**: [PostgreSQL](https://www.postgresql.org) with [Drizzle ORM](https://orm.drizzle.team)
- **Frontend**: [Vue 3](https://vuejs.org) + [Vite](https://vitejs.dev)
- **Language**: TypeScript

## Prerequisites

- **Bun** (Latest version)
- **PostgreSQL** running on port `5434` (or update `packages/server/drizzle.config.ts` and `src/db/index.ts`).
  - user: `postgres`
  - pass: `root`
  - db: `explorer`

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd project-name
   ```

2. **Install Dependencies**

   ```bash
   bun install
   ```

3. **Setup Database**
   Ensure Postgres is running, then populate the data:

   ```bash
   cd packages/server
   bun run scripts/create-db.ts # Create DB if needed
   bun run db:push            # Push schema
   bun run scripts/seed.ts    # Seed sample data
   ```

4. **Run Development Servers**

   Backend:

   ```bash
   cd packages/server
   bun run dev
   ```

   Frontend (in a new terminal):

   ```bash
   cd packages/client
   bun run dev
   ```

5. **Open Application**
   Visit `http://localhost:5173`

## Project Structure

- `packages/server`: Elysia API, Database Schema, Repositories.
- `packages/client`: Vue 3 Frontend, Components.

## License

MIT
