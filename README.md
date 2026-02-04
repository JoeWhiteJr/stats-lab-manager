# Stats Lab Research Project Manager

A Notion-inspired web application for organizing research projects, tracking progress, managing files, and facilitating team collaboration for statistics labs.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + Zustand
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL 15
- **Infrastructure:** Docker + Docker Compose

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd stats-lab-manager
```

2. Start the development environment:
```bash
docker compose up
```

3. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/api/health

### Local Development (without Docker)

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run database migrations:
```bash
psql $DATABASE_URL -f database/migrations/001_initial_schema.sql
```

5. Start the backend:
```bash
cd backend
npm run dev
```

6. Start the frontend:
```bash
cd frontend
npm run dev
```

## Project Structure

```
stats-lab-manager/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── services/   # API client
│   │   └── store/      # Zustand state management
│   └── package.json
├── backend/            # Express.js API
│   ├── src/
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Express middleware
│   │   ├── config/     # Configuration
│   │   └── tests/      # Jest tests
│   └── package.json
├── database/
│   └── migrations/     # SQL migration files
├── .github/
│   └── workflows/      # GitHub Actions CI/CD
└── docker-compose.yml  # Development setup
```

## Features

- **Project Management:** Create, edit, and organize research projects
- **Action Items:** Task management with drag-and-drop reordering
- **File Management:** Upload and download project files
- **Notes:** Create and edit project notes
- **Meetings:** Track meetings with audio upload support
- **Team Collaboration:** Role-based access control (Admin, Project Lead, Researcher, Viewer)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Action Items
- `GET /api/actions/project/:projectId` - List actions
- `POST /api/actions/project/:projectId` - Create action
- `PUT /api/actions/:id` - Update action
- `DELETE /api/actions/:id` - Delete action
- `PUT /api/actions/reorder` - Reorder actions

### Files
- `GET /api/files/project/:projectId` - List files
- `POST /api/files/project/:projectId` - Upload file
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file

### Notes
- `GET /api/notes/project/:projectId` - List notes
- `POST /api/notes/project/:projectId` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Meetings
- `GET /api/meetings/project/:projectId` - List meetings
- `POST /api/meetings/project/:projectId` - Create meeting
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

## User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full access, manage users |
| Project Lead | Create/edit projects |
| Researcher | View/edit assigned items |
| Viewer | Read-only access |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret for JWT tokens | - |
| `PORT` | Backend server port | 3001 |
| `VITE_API_URL` | Frontend API URL | http://localhost:3001/api |

## Testing

Run backend tests:
```bash
cd backend
npm test
```

Run frontend linting:
```bash
cd frontend
npm run lint
```

## Deployment

The application includes GitHub Actions workflows for CI/CD:

- **CI:** Runs on all PRs and pushes to main/develop
- **Deploy:** Triggers on push to main branch

Configure the following secrets in GitHub:
- `REGISTRY_URL` - Container registry URL
- `REGISTRY_USERNAME` - Registry username
- `REGISTRY_PASSWORD` - Registry password
- `SERVER_HOST` - Deployment server host
- `SERVER_USER` - SSH user
- `SERVER_SSH_KEY` - SSH private key

## License

MIT
