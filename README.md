# CYCLECTL

> Control the cycle. Ship the outcome.

A dark, cyber-studio command center for managing long-term production roadmaps, now powered by Next.js, NextAuth.js, and MongoDB.

**Live Demo:** [cyclectl.them3chanik.com](https://cyclectl.them3chanik.com)

## Overview

CYCLECTL is a powerful web application designed to help teams manage their long-term production roadmaps efficiently. It provides a collaborative environment where team members can view, create, edit, and track tasks within shared projects, all governed by a robust role-based permission system.

## Features

- **Collaborative Project Management:** Work with your team on shared projects with granular access controls.
- **Role-Based Permissions:** Define roles (Owner, Editor, Viewer) to control who can perform actions within a project.
  - **Owner:** Full control (create, edit, delete, move, reorder, change status, import/export JSON, manage team).
  - **Editor:** Can create, edit, reorder, and change task status.
  - **Viewer:** Can only view tasks and project details.
- **Kanban-style Board:** Organize tasks by month with drag-and-drop functionality.
- **Task Management:** Create, edit, and track task progress with simplified day-only date inputs.
- **Floating Trash Bin:** Drag tasks to the trash bin (appears when dragging) to delete (owner only).
- **Progress Tracking:** Visual progress bars per month.
- **Auto-Status Updates:** Tasks automatically move to 'in-progress' or 'overdue' based on current date.
- **Authentication:** Secure sign-in with GitHub, Google, or a magic link sent to your email.
- **JSON Import/Export:** Load tasks in bulk by pasting JSON data or export existing tasks as a JSON file (owner only).
- **Dark Glassmorphism UI:** Cyberpunk-inspired design with neon cyan accents.

## Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, React, TailwindCSS, Framer Motion, @dnd-kit/core.
- **Backend:** Node.js, Next.js API Routes, NextAuth.js (JWT Sessions), MongoDB.
- **Authentication:** NextAuth.js with GitHub, Google, and Email providers.

## Installation (Local Environment)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/them3chanik/cyclectl.git
    cd cyclectl
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
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

    # OAuth Providers (Optional, uncomment and fill if needed)
    # GITHUB_ID=your_github_oauth_app_id
    # GITHUB_SECRET=your_github_oauth_app_secret
    # GOOGLE_CLIENT_ID=your_google_oauth_client_id
    # GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
    # EMAIL_SERVER_USER=your_email_user
    # EMAIL_SERVER_PASSWORD=your_email_password
    # EMAIL_SERVER_HOST=your_email_host
    # EMAIL_SERVER_PORT=your_email_port
    # EMAIL_FROM=your_email_from
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in browser:**
    Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Projects
After signing in, you'll see a list of your projects. You can create a new project or select an existing one.

### Task Management
-   **Creating Tasks:** Click the "NEW TASK" button to add a new task to the current month. Only Owners and Editors can create tasks.
-   **Viewing & Editing Tasks:** Click on any task card to open a detailed view. Owners and Editors can click the edit icon to modify task details. Viewers can only view.
-   **Simplified Date Input:** When creating or editing tasks, you'll select a month and then only enter the day of the month. The year automatically defaults to the current year.
-   **Changing Task Status:** Owners and Editors can toggle task completion status directly from the task card.

### Team Collaboration (Owner-specific actions)
-   **Sharing Projects:** Click the "Share" button in the project header to manage team members.
-   **Invite Members:** Project Owners can invite new members by email and assign them roles (Editor or Viewer).
-   **Change Roles:** Project Owners can change the roles of existing team members.
-   **Remove Members:** Project Owners can remove members from the project.

### Data Management (Owner-specific actions)
-   **Import JSON:** Click "Load JSON" in the header to import tasks in bulk from a JSON file.
-   **Export JSON:** Click "Export JSON" to download all tasks for the current project as a JSON file.
-   **Clear Board:** Click the "Clear Board" button (trash icon) to delete all tasks in the current project.

## License

This project is licensed under the GNU General Public License (GPL).

### 💀 M3K Signing Off

Questions, collabs or weird binaries: **contact@them3chanik.com**