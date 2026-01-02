# Big Game Hunter - Venue TV Management System

## Overview

Big Game Hunter is a venue TV management application designed for bars and sports venues to intelligently manage multiple television displays. The system automatically recommends optimal channel assignments based on live game schedules, user preferences (favorite teams, league priorities), and TV configurations. Staff can monitor all screens from a central dashboard, apply auto-tuning recommendations, lock TVs to prevent automatic changes, and configure venue-specific preferences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dark theme optimized for bar/venue environments
- **Fonts**: Outfit (display) and Inter (body) for typography hierarchy

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful endpoints defined in shared route definitions with Zod validation
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Build Process**: esbuild for server bundling, Vite for client bundling

### Data Models
Three core entities:
1. **TVs**: Physical screens with location, priority, allowed channels, lock status, and current assignment
2. **Games**: Sports events with teams, league, channel, start time, relevance score, and status
3. **Preferences**: Venue settings including favorite teams, league priority order, and hard rules (JSON)

### Key Design Decisions
- **Shared Schema**: Database schema and Zod validation schemas defined once in `shared/schema.ts`, used by both frontend and backend
- **Typed API Routes**: Route definitions in `shared/routes.ts` provide type-safe API contracts
- **Lock Mechanism**: TVs can be locked for specific durations (15/30/60 mins) to prevent auto-changes during important moments
- **Relevance Scoring**: Games have a 0-100 relevance score calculated based on user preferences

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components including TvCard, GameCard, Layout
    pages/        # Route pages: Dashboard, Recommendations, TvSetup, Preferences
    hooks/        # Custom React Query hooks for data fetching
server/           # Express backend
  routes.ts       # API endpoint handlers
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared between frontend and backend
  schema.ts       # Drizzle schema and Zod types
  routes.ts       # API route definitions
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **Drizzle ORM**: Database toolkit with `drizzle-kit` for migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI Libraries
- **Radix UI**: Accessible component primitives (dialogs, dropdowns, tabs, etc.)
- **Lucide React**: Icon library
- **react-icons**: Additional icons (GiDeer for branding)
- **date-fns**: Date formatting utilities
- **embla-carousel-react**: Carousel component
- **class-variance-authority**: Component variant management
- **tailwind-merge**: Safe Tailwind class merging

### Development Tools
- **Vite**: Frontend dev server and bundler with HMR
- **esbuild**: Fast server-side bundling
- **TypeScript**: Full type safety across the stack
- **Replit plugins**: Development banner and error overlay for Replit environment