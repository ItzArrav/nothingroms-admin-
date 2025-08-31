# replit.md

## Overview

This is a custom ROM hub specifically designed for Nothing Phone 2a and 2a Plus devices. The application serves as a centralized platform where users can discover, download, and contribute custom Android ROMs. The project features a modern web interface built with React and TypeScript, providing features like ROM browsing, searching, filtering, and community interaction.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI components
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Animation**: Framer Motion for smooth UI animations and transitions
- **Design System**: Custom dark theme with cyan/green accent colors, using CSS variables for theming

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Style**: REST API with JSON responses
- **Storage**: In-memory storage implementation with interface for future database integration
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **Development**: Hot module replacement with Vite middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL configured through Drizzle ORM
- **Schema**: Two main entities - ROMs and Users with proper relationships
- **ORM**: Drizzle ORM with migrations support and type-safe queries
- **Connection**: Neon Database serverless PostgreSQL driver
- **Current State**: Memory storage implementation for development, with database schema ready for production

### Authentication and Authorization
- **Session-based**: Express sessions with PostgreSQL storage
- **User Management**: Basic user schema with username/password authentication
- **ROM Approval**: Approval system for ROM submissions with maintainer verification

### External Service Integrations
- **Google Sheets**: Integration layer for ROM data management (Google Sheets API v4)
- **Google Forms**: ROM submission workflow through external forms
- **Community Platforms**: Links to Telegram, Discord, and GitHub for community engagement
- **Font Services**: Google Fonts integration for typography
- **Development Tools**: Replit-specific plugins for development environment

### Key Design Patterns
- **Component Architecture**: Modular React components with proper separation of concerns
- **API Layer**: Centralized API client with error handling and request/response interceptors
- **Type Safety**: Full TypeScript coverage with shared types between frontend and backend
- **Database Abstraction**: Storage interface pattern for easy database provider switching
- **Configuration Management**: Environment-based configuration with proper fallbacks