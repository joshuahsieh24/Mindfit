# MindFit

A modern fitness tracking app with a focus on both physical health and spiritual wellness. Built with React Native, Expo, and TypeScript.

## 🎯 Vision & Purpose

MindFit combines fitness tracking with daily spiritual encouragement. The app helps users:
- **Track workouts** with a streamlined, 1-tap logging experience
- **Build consistency** through easy exercise management
- **Stay motivated** with daily faith-based encouragement
- **Achieve balance** between physical and spiritual wellness

## 🏗️ Tech Stack

### Frontend
- **React Native** (0.79.5) - Cross-platform mobile development
- **Expo** (53.0.20) - Development platform and build tools
- **TypeScript** (5.8.3) - Type-safe JavaScript
- **Moti** (0.30.0) - Smooth animations and transitions
- **Expo Haptics** (14.1.4) - Tactile feedback

### State Management & Data
- **AsyncStorage** - Local data persistence
- **React Hooks** - State management
- **Custom data layer** - Exercise and workout management

### UI/UX
- **NativeWind** (4.1.23) - Utility-first CSS framework
- **React Native Reanimated** (3.17.5) - Advanced animations
- **Custom dark theme** - FAANG-polish UI design

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting and formatting
- **Jest** - Unit testing framework

## 📁 Project Structure

```
MindFit/
├── apps/
│   └── mobile/                 # Main mobile app
│       ├── components/         # React components
│       ├── lib/               # Data layer & utilities
│       ├── assets/            # Images and static files
│       └── __tests__/         # Test files
├── packages/                  # Shared packages (future)
└── pnpm-workspace.yaml       # Monorepo configuration
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (`npm install -g pnpm`)
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MindFit
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   cd apps/mobile
   npx expo start
   ```

4. **Run on device/simulator**
   - **iOS**: Press `i` in terminal or scan QR code with Camera app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go
   - **Web**: Press `w` in terminal

## 📱 Features

### ✅ Completed Features

#### Task A: Exercise Picker
- Search bar with real-time filtering
- Muscle group categorization (Chest, Back, Legs, etc.)
- "Add new exercise" functionality
- Smooth animations and haptic feedback

#### Task B: Quick-Set Sheet
- Reps/weight controls with ± buttons
- Last-used values for each exercise
- Optimistic UI updates
- Save functionality with AsyncStorage

#### Task C: Card Actions
- Long-press to edit/delete sets
- iOS native ActionSheet
- Android alert-based options
- Edit pre-fills current values

#### Task D: Polish
- 200ms Moti animations
- Light haptic feedback on interactions
- VoiceOver accessibility labels
- Spring animations for floating button

#### Task E: Data Layer
- AsyncStorage persistence
- Optimistic UI updates
- Error handling for all async operations
- Loading states and proper data management

### 🔄 Current Status
- **Task F**: Tests (Pending)

## 🛠️ Development Guidelines

### Adding Dependencies

**Always install dependencies in the correct directory:**

```bash
# For mobile app dependencies
cd apps/mobile
pnpm add <package-name>

# For root-level dev dependencies
cd /Users/mac/Documents/coding/Mindfit
pnpm add -D <package-name>
```

### Code Structure

1. **Components**: Place in `apps/mobile/components/`
2. **Data Layer**: Place in `apps/mobile/lib/`
3. **Tests**: Place in `apps/mobile/__tests__/`
4. **Assets**: Place in `apps/mobile/assets/`

### Running Commands

**Always run Expo commands from the mobile directory:**
```bash
cd apps/mobile
npx expo start --clear
```

### Common Issues & Solutions

1. **"expo module not found"**
   - Ensure you're in `apps/mobile` directory
   - Run `pnpm install` in the mobile directory

2. **Metro bundler cache issues**
   - Use `npx expo start --clear --reset-cache`

3. **Dependencies not found**
   - Check if installed in correct directory
   - Verify `node_modules` exists in `apps/mobile/`

## 🧪 Testing

### Unit Tests
```bash
cd apps/mobile
pnpm test
```

### E2E Tests (Coming Soon)
```bash
cd apps/mobile
pnpm test:e2e
```

## 📦 Building for Production

### iOS
```bash
cd apps/mobile
npx expo build:ios
```

### Android
```bash
cd apps/mobile
npx expo build:android
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

[Add your license here]

## 🙏 Acknowledgments

- Built with React Native and Expo
- Inspired by the need for balanced physical and spiritual wellness
- Designed for modern mobile UX patterns 