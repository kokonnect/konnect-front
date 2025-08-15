# Konnect - React Native Educational App

## Project Overview

Konnect is a React Native application built with Expo that helps non-Korean-speaking parents navigate educational communications from schools. The app provides translation services, calendar management, messaging features, and user profiles specifically designed for parent-school interactions.

## Tech Stack

- **Framework**: React Native with Expo (SDK 53)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Navigation**: Expo Router (file-based routing)
- **Internationalization**: i18next, react-i18next
- **UI Components**: React Native core components, @expo/vector-icons
- **Calendar**: react-native-calendars
- **Styling**: StyleSheet (React Native)
- **Platform Support**: iOS, Android, Web

## Project Structure

```
konnect/
├── app/                    # App routes (Expo Router)
│   ├── (tabs)/            # Tab-based navigation screens
│   │   ├── calendar/      # Calendar feature
│   │   ├── message/       # Messaging feature
│   │   ├── profile/       # User profile
│   │   └── translate/     # Translation feature
│   ├── _layout.tsx        # Root layout with Redux Provider
│   ├── index.tsx          # Entry point
│   ├── login.tsx          # Authentication
│   └── onboarding.tsx     # User onboarding
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── calendar/         # Calendar-specific components
│   ├── home/            # Home screen components
│   ├── message/         # Messaging components
│   ├── profile/         # Profile components
│   ├── shared/          # Shared/common components
│   └── translate/       # Translation feature components
├── store/                # Redux store configuration
│   ├── features/        # Feature slices
│   │   ├── auth/       # Authentication state
│   │   ├── calendar/   # Calendar state
│   │   ├── message/    # Message state
│   │   ├── translate/  # Translation state
│   │   └── user/       # User state
│   └── store.ts        # Store configuration
├── locales/             # Internationalization
│   ├── en/             # English translations
│   ├── ko/             # Korean translations
│   └── i18n.ts         # i18n configuration
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Key Features

### 1. Translation Service

- **Location**: `app/(tabs)/translate/`
- **Purpose**: Translate school documents from Korean to user's preferred language
- **Capabilities**:
  - Image upload (camera/gallery)
  - PDF document upload
  - Summary and full text translation
  - Event extraction from documents
  - Vocabulary guide for educational terms
  - Translation history

### 2. Calendar Management

- **Location**: `app/(tabs)/calendar/`
- **Purpose**: Manage school events and important dates
- **Features**:
  - Add/modify events
  - View upcoming events
  - Integration with translated documents

### 3. Messaging

- **Location**: `app/(tabs)/message/`
- **Purpose**: Communication with school
- **Features**:
  - Compose messages
  - Message templates
  - Message history

### 4. User Profile

- **Location**: `app/(tabs)/profile/`
- **Purpose**: User settings and preferences
- **Features**:
  - Edit profile
  - Add children information
  - Language preferences

## Development Commands

### Installation

```bash
npm install
```

### Running the App

```bash
# Start development server
npx expo start

# Run on specific platforms
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web browser
```

### Code Quality

```bash
# Linting with Expo ESLint config
npm run lint

# Format and lint with Trunk
trunk check       # Check all changed files
trunk check --all # Check all files
trunk check --fix # Auto-fix issues
```

### Building

```bash
# Development builds require expo-dev-client
npx expo run:ios
npx expo run:android

# Production builds via EAS
npx eas build --platform ios
npx eas build --platform android
npx eas build --platform web
```

## Code Quality Tools

### Trunk Configuration

The project uses Trunk for code quality management with the following tools:

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **Markdownlint**: Markdown file linting
- **Checkov**: Infrastructure as code scanning
- **OSV Scanner**: Vulnerability scanning
- **Trufflehog**: Secret scanning

### TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to root directory
- Includes all `.ts`, `.tsx` files

## State Management

### Redux Store Structure

```typescript
store = {
  auth: {
    // Authentication state
    isAuthenticated: boolean
    user: User | null
    token: string | null
  },
  user: {
    // User profile and preferences
    profile: UserProfile | null
    children: Child[]
    preferences: UserPreferences
  }
}
```

### Key Slices

- **authSlice**: Handles login/logout, token management
- **userSlice**: Manages user profile, children data
- **calendarSlice**: Calendar events state (placeholder)
- **messageSlice**: Messaging state (placeholder)
- **translateSlice**: Translation history and state (placeholder)

## Internationalization

The app supports Korean and English with the following translation namespaces:

- `common`: Shared translations
- `auth`: Authentication screens
- `calendar`: Calendar feature
- `message`: Messaging feature
- `profile`: Profile screens
- `translate`: Translation feature

### Usage

```typescript
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
// Use: t('translate:title')
```

## Navigation Structure

```
Root Stack (Expo Router)
├── splash           # Initial splash screen
├── onboarding       # First-time user guide
├── login           # Authentication
├── add-child       # Add child information
└── (tabs)          # Main tab navigation
    ├── index       # Home screen
    ├── translate   # Translation feature
    ├── message     # Messaging
    ├── calendar    # Calendar
    └── profile     # User profile
```

## API Integration

- **Auth Service**: `services/authApi.ts`
- **User Service**: `services/userApi.ts`
- Base API configuration for backend communication

## Platform-Specific Considerations

- **iOS**: Bundle ID: `com.konnect.app`
- **Android**: Adaptive icon configured
- **Web**: Static output with Metro bundler
- Supports both light and dark themes (automatic)

## Testing Strategy

Currently, no testing framework is configured. Recommended additions:

- Jest for unit testing
- React Native Testing Library for component testing
- Detox for E2E testing (mentioned in README)

## Environment Variables

The project uses Expo constants for configuration. Check `app.json` for:

- EAS project ID
- App scheme for deep linking
- Platform-specific configurations

## Common Development Tasks

### Adding a New Feature

1. Create feature folder in `components/`
2. Add Redux slice in `store/features/`
3. Create routes in `app/` directory
4. Add translations in `locales/`

### Updating Translations

1. Add keys to relevant JSON files in `locales/en/` and `locales/ko/`
2. Use `t('namespace:key')` in components

### Working with Forms

- Use controlled components with React state
- Implement validation before submission
- Show loading states during async operations

### Styling Guidelines

- Use StyleSheet.create() for performance
- Primary color: `#00B493`
- Consistent spacing: 8, 12, 16, 20, 24
- Border radius: 8, 12, 16
- Shadow styles for elevation

## Performance Considerations

- Images handled with `expo-image` for optimization
- Lazy loading for heavy components
- Proper list optimization with FlatList/SectionList
- Memoization for expensive computations

## Security Notes

- No hardcoded API keys or secrets
- Use AsyncStorage for secure token storage
- Validate all user inputs
- Sanitize data before display

## Debugging

```bash
# View logs
npx expo start --clear  # Clear cache and start

# Debug with React DevTools
# Press 'j' in terminal to open debugger
```

## Deployment

- **iOS**: Through EAS Build and App Store
- **Android**: Through EAS Build and Google Play
- **Web**: Static export with `npx expo export:web`

## Important Files

- `app.json`: Expo configuration
- `tsconfig.json`: TypeScript configuration
- `.trunk/trunk.yaml`: Code quality tools configuration
- `eslint.config.js`: ESLint configuration

## Common Issues & Solutions

### i18n Initialization

- Web initializes synchronously
- Mobile platforms initialize asynchronously
- Check `app/_layout.tsx` for initialization logic

### Navigation Type Safety

- Typed routes enabled via `experiments.typedRoutes`
- Use proper route types from Expo Router

### Redux Serialization

- Non-serializable data ignored for specific actions
- Check `store.ts` middleware configuration

## Next Steps for Development

1. Implement actual API endpoints
2. Add comprehensive error handling
3. Set up testing framework
4. Implement push notifications (FCM mentioned in README)
5. Add offline support with data persistence
6. Implement actual file upload functionality
7. Add analytics tracking
8. Set up CI/CD pipeline

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Expo Router Documentation](https://expo.github.io/router)
