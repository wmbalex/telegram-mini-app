# @telegram-apps/create-mini-app

A CLI tool for scaffolding new Telegram Mini Apps with modern development tools and best practices.

## Installation

### Using pnpm
```bash
pnpm dlx @telegram-apps/create-mini-app@latest
```

### Using npm
```bash
npx @telegram-apps/create-mini-app@latest
```

### Using yarn
```bash
yarn create @telegram-apps/mini-app
```

## Usage

### 1. Project Creation

#### Basic Usage
```bash
# Create a new project
pnpm dlx @telegram-apps/create-mini-app@latest

# Follow the prompts:
# 1. Enter project name
# 2. Select technology stack
# 3. Choose framework
# 4. Configure additional options
```

#### Project Structure
```
my-mini-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── App.tsx
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

### 2. Technology Options

#### Language Options
- TypeScript
- JavaScript

#### Framework Options
- React
- Vue
- Svelte
- SolidJS

#### SDK Options
- tma.js
- Telegram SDK

### 3. Configuration

#### Package.json
```json
{
  "name": "my-mini-app",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@telegram-apps/sdk": "^1.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^4.0.0"
  }
}
```

#### Vite Configuration
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
```

## Development

### 1. Starting Development

#### Development Server
```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### 2. Project Structure

#### Components
```typescript
// src/components/Button.tsx
import { MainButton } from '@telegram-apps/sdk';

export const Button = () => {
  return (
    <MainButton
      text="Click me"
      onClick={() => console.log('Clicked!')}
    />
  );
};
```

#### Pages
```typescript
// src/pages/Home.tsx
import { useEffect } from 'react';
import { WebApp } from '@telegram-apps/sdk';

export const Home = () => {
  useEffect(() => {
    WebApp.ready();
  }, []);

  return (
    <div>
      <h1>Welcome to Mini App</h1>
    </div>
  );
};
```

### 3. TypeScript Support

#### Type Definitions
```typescript
// src/types/index.ts
export interface User {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface WebAppInitData {
  query_id: string;
  user: User;
  auth_date: number;
  hash: string;
}
```

## Deployment

### 1. Building for Production

#### Build Process
```bash
# Build the application
pnpm build

# The build output will be in the dist directory
```

### 2. Hosting Options

#### Static Hosting
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

#### Configuration Example
```typescript
// vite.config.ts
export default defineConfig({
  base: '/my-mini-app/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

## Testing

### 1. Unit Testing

#### Test Setup
```typescript
// src/components/Button.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    const { getByText } = render(<Button />);
    expect(getByText('Click me')).toBeInTheDocument();
  });
});
```

### 2. Integration Testing

#### Test Configuration
```typescript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
```

## Best Practices

### 1. Code Organization

#### Directory Structure
```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript type definitions
├── constants/     # Constants and configuration
└── services/      # API and external service integrations
```

### 2. State Management

#### Example with Context
```typescript
// src/context/AppContext.tsx
import { createContext, useContext, useState } from 'react';

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};
```

### 3. Error Handling

#### Error Boundary
```typescript
// src/components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <h1>Sorry.. there was an error</h1>;
    }

    return this.props.children;
  }
}
```

## Troubleshooting

### 1. Common Issues

#### Build Issues
```bash
# Clear build cache
rm -rf node_modules/.vite

# Reinstall dependencies
pnpm install

# Rebuild
pnpm build
```

#### Development Issues
```bash
# Check for TypeScript errors
pnpm tsc --noEmit

# Run linting
pnpm lint

# Check for outdated dependencies
pnpm outdated
```

### 2. Debugging

#### Development Tools
- React Developer Tools
- Vue DevTools
- Chrome DevTools

#### Logging
```typescript
// src/utils/logger.ts
export const logger = {
  info: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(...args);
    }
  }
};
``` 