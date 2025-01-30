# TaskFlow - Modern Task Management System

TaskFlow is a modern, responsive task management system built with Next.js and React. It features a Kanban board for task organization and a calendar view for scheduling.

## Features

- **Kanban Board**
  - Drag and drop task management
  - Create, edit, and delete tasks
  - Create and manage custom columns
  - Priority levels (low, medium, high)
  - Task descriptions and time scheduling

- **Calendar View**
  - Multiple view modes (Day, Week, Month)
  - Time-slot selection
  - Event creation and management
  - Current time indicator
  - Priority-based event coloring
  - Responsive design

- **General Features**
  - Dark/Light mode support
  - Local storage persistence
  - Responsive design
  - Clean, minimalist interface
  - Inter font integration

## Technology Stack

- Next.js 13
- React 18
- Tailwind CSS
- shadcn/ui components
- react-big-calendar
- @hello-pangea/dnd (Drag and Drop)
- Lucide React (Icons)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Usage

### Kanban Board

- Click "Add Column" to create a new column
- Use "Add Task" to create tasks within columns
- Drag and drop tasks between columns
- Click edit/delete icons to modify or remove tasks
- Set task priorities and schedules

### Calendar

- Click any time slot to create a new event
- Drag to select multiple time slots
- Click events to edit or delete them
- Use the toolbar to switch between Day, Week, and Month views
- Navigate between dates using the arrow buttons

## Project Structure

```
taskflow/
├── app/
│   ├── globals.css       # Global styles and theme
│   ├── layout.tsx        # Root layout component
│   ├── page.tsx          # Home page (Kanban board)
│   └── schedule/         # Calendar view
├── components/
│   ├── board.tsx         # Kanban board component
│   ├── navbar.tsx        # Navigation component
│   └── ui/              # UI components
└── lib/
    └── utils.ts         # Utility functions
```

## Customization

### Theme

The application uses a black and white color scheme with customizable CSS variables in `globals.css`. You can modify the colors by adjusting the HSL values in the `:root` and `.dark` selectors.

### Components

UI components are built using shadcn/ui and can be customized in the `components/ui` directory. The main components (Board and Calendar) can be found in their respective files.

## Local Storage

The application uses localStorage to persist:
- Task data
- Column configurations
- Calendar events

Data is automatically saved when changes are made and loaded when the application starts.

## Contributing

Feel free to submit issues and enhancement requests!