# CYCLECTL

> Control the cycle. Ship the outcome.

A dark, cyber-studio command center for managing long-term production roadmaps, now powered by Next.js, NextAuth.js, and MongoDB.

## Features

- **Kanban-style Board** - Organize tasks by month with drag-and-drop
- **Drag & Drop** - Move cards between months seamlessly
- **Floating Trash Bin** - Drag cards to delete with undo support
- **Task Management** - Create, edit, and track task progress
- **Progress Tracking** - Visual progress bars per month
- **Auto-Status Updates** - Tasks automatically move to 'in-progress' or 'overdue' based on current date
- **Authentication** - Sign in with GitHub, Google, or a magic link sent to your email
- **JSON Import** - Load tasks in bulk by pasting JSON data
- **Animated Favicon** - A live animated rocket favicon
- **Dark Glassmorphism UI** - Cyberpunk-inspired design with neon cyan accents

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- @dnd-kit/core

### Backend
- MongoDB
- Next.js API Routes
- NextAuth.js (JWT Sessions)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd cyclectl
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Add your credentials to `.env`:
```
# MongoDB
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB=cyclectl

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=a_secure_random_string_for_session_encryption

# OAuth Providers
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

```

4. **Run the development server**
```bash
npm run dev
```

5. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating Tasks
Click the "NEW TASK" button in the bottom-left corner to create a new task.

### Drag & Drop
- Drag tasks between months to reschedule
- Drag tasks to the trash bin (appears when dragging) to delete

### Viewing & Editing Tasks
- Click on any task card to open a detailed view.
- From the detailed view, click the pencil icon to edit the task.

### Importing Tasks
- Click "Load JSON" in the header to open a modal.
- Paste your JSON data and click "Load JSON" to import tasks.
- A "Copy Example" button is available for the correct JSON structure.

### Clearing the Board
- Click the trash icon ("Clear Board") in the header to delete all your tasks (a confirmation will be required).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for the logged-in user |
| POST | `/api/tasks` | Create a new task for the logged-in user |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| DELETE | `/api/tasks/clear` | Delete all tasks for the logged-in user |
| POST | `/api/tasks/upload` | Import tasks from JSON |
| GET | `/api/auth/*` | NextAuth.js authentication routes |
| POST | `/api/auth/*` | NextAuth.js authentication routes |

## Project Structure

```
├── app/
│   ├── api/tasks/         # API routes
│   ├── month/[name]/      # Monthly planner page
│   ├── page.tsx           # Dashboard
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Shadcn UI components
│   ├── AddTaskButton.tsx
│   ├── AnimatedFavicon.tsx
│   ├── JsonUpload.tsx
│   ├── JsonUploadModal.tsx
│   ├── MonthColumn.tsx
│   ├── Portal.tsx
│   ├── TaskCard.tsx
│   ├── TaskDetailModal.tsx
│   ├── TaskEditModal.tsx
│   └── TrashBin.tsx
├── lib/
│   ├── database.types.ts  # TypeScript types
│   ├── mongo.ts           # MongoDB client
│   └── mongodb.ts         # MongoDB connection helper
├── types/
│   ├── global.d.ts
│   └── next-auth.d.ts     # NextAuth.js type augmentation
├── auth.ts                # NextAuth.js configuration
└── public/
```

## License

This project is licensed under the GNU General Public License (GPL).
---

### 💀 M3K Signing Off

Questions, collabs or weird binaries: **contact@them3chanik.com**


