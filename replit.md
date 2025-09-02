# Hào Khí Lửa Tre — Vietnamese Gaming Website

## Overview

This is a Vietnamese marketing website for the indie game "Hào Khí Lửa Tre" by team The Weakened. The project showcases a cinematic UE5 game through an interactive website featuring 3D model viewing, image galleries, video showcases, and a password-protected file upload system. The site is built with modern web technologies and focuses on Vietnamese cultural design elements while maintaining a dark gaming aesthetic.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router
- **Styling**: Tailwind CSS with a custom dark theme and Vietnamese cultural design elements
- **Component Library**: Shadcn/ui components built on Radix UI primitives for consistent, accessible UI components
- **State Management**: TanStack Query (React Query) for server state management and caching

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Build System**: ESBuild for production bundling, TSX for development
- **File Upload**: Multer middleware for handling multipart/form-data with 200MB file size limit
- **API Design**: RESTful endpoints with proper error handling and logging middleware

### Storage Solutions
- **File Storage**: Supabase Storage for all media files (images, videos, 3D models)
- **Bucket Structure**: Three public buckets - `models`, `images`, `videos`
- **Database**: Uses Drizzle ORM configuration but primarily relies on Supabase Storage rather than traditional database tables
- **Auto-Bootstrap**: Server automatically creates required storage buckets on startup

### Authentication & Authorization
- **Upload Security**: Simple password-based authentication for file uploads
- **No User Accounts**: Single shared password system for team members
- **Environment-Based**: Password stored as environment variable for security

### 3D Model Integration
- **Viewer**: Google Model Viewer for WebGL-based 3D model display
- **Features**: Auto-rotate, camera controls, fullscreen support, WebGL fallback handling
- **Format Support**: GLB/GLTF model formats optimized for web delivery

### Media Management
- **Image Gallery**: Responsive grid layout with lightbox functionality
- **Video Player**: Custom controls with mute/unmute and play/pause functionality
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Development Environment
- **Hot Module Replacement**: Vite HMR for fast development iteration
- **TypeScript**: Strict type checking across frontend and backend
- **Path Aliases**: Configured for clean imports (`@/` for client, `@shared/` for shared types)
- **Error Handling**: Runtime error overlay for development debugging

## External Dependencies

### Core Services
- **Supabase**: Primary storage service for all media files and CDN delivery
- **Google Model Viewer**: 3D model rendering and interaction library

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework with custom dark theme
- **Radix UI**: Unstyled, accessible UI primitives for component foundation
- **Lucide React**: Icon library for consistent iconography

### Build & Development
- **Vite**: Build tool and development server with React plugin
- **TSX**: TypeScript execution for development server
- **ESBuild**: Production bundling for optimized builds

### File Processing
- **Multer**: Node.js middleware for handling file uploads
- **Sharp**: Image processing (if needed for optimization)

### State & Data
- **TanStack Query**: Server state management and caching
- **Zod**: TypeScript-first schema validation for API endpoints
- **React Hook Form**: Form state management with validation

### Deployment
- **Replit**: Hosting platform with automatic deployment
- **Environment Variables**: Secure configuration management through Replit Secrets