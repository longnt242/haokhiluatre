# Hào Khí Lửa Tre — Vietnamese Gaming Website

Vietnamese marketing website for the indie game "Hào Khí Lửa Tre" by team The Weakened. Built with Next.js and Supabase Storage.

## Features

- 🎮 Vietnamese-language gaming website
- 🗿 3D Model viewer with @google/model-viewer
- 🖼️ Responsive image gallery with lightbox
- 🎥 Video showcase with custom controls
- 📤 Password-protected file upload system
- 🌙 Dark theme with Vietnamese cultural design
- 📱 Fully responsive design
- 🔒 Secure file uploads to Supabase Storage

## Setup Instructions

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/projects)
2. Create a new project
3. Once created, click the "Connect" button in the top toolbar
4. Copy the URI value under "Connection string" → "Transaction pooler"
5. Note down your project URL and anon key from Settings → API

### 2. Environment Variables

Set these environment variables in Replit → Tools → Secrets:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
UPLOAD_PASSWORD=your_chosen_upload_password
