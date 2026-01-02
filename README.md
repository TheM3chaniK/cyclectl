# CYCLECTL

> The system that exists only to ship.

A dark, cyber-studio command center for managing long-term production roadmaps.

## Features

- **Kanban-style Board** - Organize tasks by month with drag-and-drop
- **Drag & Drop** - Move cards between months seamlessly
- **Floating Trash Bin** - Drag cards to delete with undo support
- **Task Management** - Create, edit, and track task progress
- **Progress Tracking** - Visual progress bars per month
- **LocalStorage Caching** - Fast loading with backend sync
- **Dark Glassmorphism UI** - Cyberpunk-inspired design with neon cyan accents

## Tech Stack

### Frontend
- Next.js 13 (App Router)
- TypeScript
- TailwindCSS
- Framer Motion
- @dnd-kit/core

### Backend
- Supabase (PostgreSQL)
- Next.js API Routes

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd shipctrl
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Add your Supabase credentials to `.env`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database is already set up**
The Supabase database schema has been created automatically.

5. **(Optional) Seed with sample data**
To populate the database with sample tasks, run the SQL in `scripts/seed.sql` in your Supabase SQL editor.

6. **Run the development server**
```bash
npm run dev
```

7. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Creating Tasks
Click the "NEW TASK" button in the bottom-left corner to create a new task.

### Drag & Drop
- Drag tasks between months to reschedule
- Drag tasks to the trash bin (appears when dragging) to delete

### Editing Tasks
Click the edit icon on any task card to modify its details.

### Monthly View
Click on any month header to view a detailed monthly planner.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Project Structure

```
├── app/
│   ├── api/tasks/         # API routes
│   ├── month/[name]/      # Monthly planner page
│   ├── page.tsx           # Dashboard
│   └── layout.tsx         # Root layout
├── components/
│   ├── add-task-button.tsx
│   ├── month-column.tsx
│   ├── task-card.tsx
│   ├── task-edit-modal.tsx
│   └── trash-bin.tsx
├── lib/
│   ├── database.types.ts  # TypeScript types
│   └── supabase.ts        # Supabase client
├── scripts/
│   └── seed.sql           # Sample data for testing
└── public/
```

## License

MIT
