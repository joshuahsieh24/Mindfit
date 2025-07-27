# MindFit Coach - Mobile App

A minimalist fitness app with faith-centered motivation, built with Expo Router and React Native.

## 🎨 v0.dev UI Generation

This project is optimized for [v0.dev](https://v0.dev) UI generation. Use these prompts for best results:

### Component Generation Prompts

**For Log Screen:**
```
Create a React Native screen for logging workout sets with:
- Dark mode design with large typography (18pt+)
- Floating action button (FAB) that opens bottom sheet
- One-tap logging with +/- buttons for reps/weight
- Today's date as default, last-used exercise auto-selected
- No scrolling - viewport shows exactly one session
- Use @gorhom/bottom-sheet for preset picker
- Use @shopify/flash-list for high-performance sets list
```

**For Daily Boost Card:**
```
Create a React Native card component for daily faith-centered motivation:
- Dark mode with elevated card design
- Shows confidence tip, happiness reflection, or relationship challenge
- Includes matching scripture verse
- Tap to expand and reveal details
- Large typography (18pt+) for readability
- Use theme colors: background #1C1C1E, surface #2C2C2E
```

**For Bottom Sheet Exercise Picker:**
```
Create a React Native bottom sheet component for exercise selection:
- Dark mode with rounded corners
- Grid of preset exercises (Bench, Squat, Deadlift, etc.)
- Large touch targets for thumb-friendly interaction
- Smooth animations with react-native-reanimated
- Use @gorhom/bottom-sheet for implementation
```

### Available Components

Import these base components in v0.dev:

```tsx
import { Button, Card, Text, View, Input } from '../components/ui';
import { theme } from '../lib/theme';
```

### Theme Colors

Use these colors for consistent dark-mode design:

```tsx
// Background colors
background: '#1C1C1E'      // Main background
surface: '#2C2C2E'         // Card backgrounds
surfaceVariant: '#3A3A3C'  // Elevated surfaces

// Text colors
text.primary: '#FFFFFF'     // Main text
text.secondary: '#EBEBF5'  // Secondary text
text.muted: '#8E8E93'      // Muted text
text.accent: '#007AFF'     // Accent text

// Action colors
primary: '#007AFF'         // Primary actions
secondary: '#5856D6'       // Secondary actions
accent: '#FF9500'          // Highlights
success: '#34C759'         // Success states
error: '#FF453A'           // Error states
```

## 🚀 Development

### Environment Setup

Create a `.env` file in `apps/mobile/` with your Supabase credentials:

```bash
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Commands

```bash
# Start development server
pnpm start

# Run on iOS
pnpm ios

# Run on Android
pnpm android

# Lint code
pnpm lint

# Run tests
pnpm test

# Verify environment variables
pnpm expo config --type public | grep EXPO_PUBLIC
```

## 📱 Features

- **One-tap logging**: Default to today's date, last-used exercise
- **Zero scrolling**: Viewport shows exactly one session
- **Instant add**: FAB opens bottom-sheet preset picker
- **Daily Boost**: Faith-centered motivation cards
- **Dark-mode first**: Large typography, high-contrast buttons
- **No onboarding maze**: Sign-in → home in <10s

## 🏗️ Architecture

### System Design
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Native  │    │   Expo Router   │    │   Supabase      │
│   Components    │◄──►│   Navigation    │◄──►│   Auth + Data   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Layer      │    │   State Mgmt    │    │   Database      │
│   • Dark Theme  │    │   • Auth State  │    │   • RLS         │
│   • Components  │    │   • Workout     │    │   • Real-time   │
│   • Animations  │    │   • Navigation  │    │   • Sync        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Core Technologies
- **Expo Router**: File-system routing with auth/tabs structure
- **Supabase**: Authentication + PostgreSQL with RLS
- **React Native Reanimated**: Smooth animations
- **@gorhom/bottom-sheet**: Thumb-friendly interactions
- **@shopify/flash-list**: High-performance lists
- **TypeScript**: Type-safe development

### Data Flow
1. **Authentication**: Magic link → Supabase Auth → Session persistence
2. **Data Fetching**: WorkoutService → Supabase → RLS policies
3. **State Management**: React hooks + Supabase real-time subscriptions
4. **UI Updates**: Optimistic updates + error handling

## 🧪 Smoke Test

After setting up your Supabase project and environment variables:

1. **Start the app**: `pnpm start`
2. **Sign in**: Enter your email and tap "Send Magic Link"
3. **Check email**: Click the magic link in your email
4. **Test connection**: Tap "Test Supabase Connection" on the home screen
5. **Verify result**: Should show `{ data: [], error: null }` (empty table is expected)

## 📋 Sprint Plan

### Sprint 1 - Skeleton & Auth ✅
- [x] Scaffold Expo app
- [x] Supabase project + Magic Link auth
- [ ] Postgres tables (users, exercises, workouts, moods)
- [ ] Minimal log screen with FAB
- [ ] GitHub Action: ESLint + Jest

### Sprint 2 - Backend API & RAG Base
- [ ] Render deploy FastAPI routes
- [ ] Seed workout & scripture corpus
- [ ] Hybrid retriever util
- [ ] Celery worker & Redis
- [ ] Store push tokens

### Sprint 3 - Daily Boost & Push
- [ ] GPT-4o prompt for confidence/happiness/relationship boost
- [ ] /daily-boost endpoint + DB save
- [ ] Celery schedule 6 AM PST → Expo push
- [ ] Today Boost Card UI
- [ ] Integration test

### Sprint 4 - Polish & Side-Load
- [ ] Streak/Chart screen (Victory Native)
- [ ] Sentry crash logging
- [ ] App icon + splash
- [ ] Local IPA build & side-load
- [ ] README update + demo GIF 