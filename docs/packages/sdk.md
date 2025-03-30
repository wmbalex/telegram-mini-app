# Telegram Mini Apps SDK

The official SDK for developing Telegram Mini Apps with TypeScript support and modern development tools.

## Installation

### Using pnpm
```bash
pnpm add @telegram-apps/sdk
```

### Using npm
```bash
npm install @telegram-apps/sdk
```

### Using yarn
```bash
yarn add @telegram-apps/sdk
```

## Core Components

### 1. WebApp

#### Initialization
```typescript
import { WebApp } from '@telegram-apps/sdk';

// Initialize WebApp
WebApp.ready();

// Get WebApp instance
const webApp = WebApp.getInstance();
```

#### Properties
```typescript
// Access WebApp properties
const initData = webApp.initData;
const initDataUnsafe = webApp.initDataUnsafe;
const platform = webApp.platform;
const version = webApp.version;
const colorScheme = webApp.colorScheme;
const themeParams = webApp.themeParams;
const isExpanded = webApp.isExpanded;
const viewportHeight = webApp.viewportHeight;
const viewportStableHeight = webApp.viewportStableHeight;
const headerColor = webApp.headerColor;
const backgroundColor = webApp.backgroundColor;
```

### 2. MainButton

#### Usage
```typescript
import { MainButton } from '@telegram-apps/sdk';

// Create main button
const mainButton = new MainButton();

// Configure button
mainButton.setText('Submit');
mainButton.setColor('#2481cc');
mainButton.enable();
mainButton.show();

// Handle click
mainButton.onClick(() => {
  console.log('Button clicked!');
});
```

#### Methods
```typescript
// Button configuration
mainButton.setText(text: string): void;
mainButton.setColor(color: string): void;
mainButton.setBackgroundColor(color: string): void;
mainButton.setTextColor(color: string): void;
mainButton.setButtonColor(color: string): void;
mainButton.setButtonTextColor(color: string): void;
mainButton.setActive(active: boolean): void;
mainButton.setProgress(progress: boolean): void;
mainButton.enable(): void;
mainButton.disable(): void;
mainButton.show(): void;
mainButton.hide(): void;

// Event handling
mainButton.onClick(callback: () => void): void;
mainButton.offClick(callback: () => void): void;
```

### 3. BackButton

#### Usage
```typescript
import { BackButton } from '@telegram-apps/sdk';

// Create back button
const backButton = new BackButton();

// Configure button
backButton.show();
backButton.enable();

// Handle click
backButton.onClick(() => {
  console.log('Back button clicked!');
});
```

#### Methods
```typescript
// Button configuration
backButton.show(): void;
backButton.hide(): void;
backButton.enable(): void;
backButton.disable(): void;

// Event handling
backButton.onClick(callback: () => void): void;
backButton.offClick(callback: () => void): void;
```

### 4. Popup

#### Usage
```typescript
import { Popup } from '@telegram-apps/sdk';

// Create popup
const popup = new Popup({
  title: 'Confirmation',
  message: 'Are you sure?',
  buttons: [
    { id: 'confirm', type: 'default', text: 'Confirm' },
    { id: 'cancel', type: 'cancel', text: 'Cancel' }
  ]
});

// Show popup
popup.show().then(result => {
  if (result === 'confirm') {
    console.log('Confirmed!');
  } else {
    console.log('Cancelled!');
  }
});
```

#### Configuration
```typescript
interface PopupButton {
  id: string;
  type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text: string;
}

interface PopupParams {
  title?: string;
  message: string;
  buttons?: PopupButton[];
}
```

### 5. HapticFeedback

#### Usage
```typescript
import { HapticFeedback } from '@telegram-apps/sdk';

// Trigger haptic feedback
HapticFeedback.impactOccurred('medium');
HapticFeedback.notificationOccurred('success');
HapticFeedback.selectionChanged();
```

#### Methods
```typescript
// Impact feedback
HapticFeedback.impactOccurred(style: 'light' | 'medium' | 'heavy' | 'soft' | 'rigid'): void;

// Notification feedback
HapticFeedback.notificationOccurred(type: 'error' | 'success' | 'warning'): void;

// Selection feedback
HapticFeedback.selectionChanged(): void;
```

## React Components

### 1. MainButton Component

#### Usage
```typescript
import { MainButton } from '@telegram-apps/sdk-react';

function App() {
  return (
    <MainButton
      text="Submit"
      color="#2481cc"
      onClick={() => console.log('Clicked!')}
    />
  );
}
```

#### Props
```typescript
interface MainButtonProps {
  text?: string;
  color?: string;
  textColor?: string;
  isActive?: boolean;
  isVisible?: boolean;
  onClick?: () => void;
}
```

### 2. BackButton Component

#### Usage
```typescript
import { BackButton } from '@telegram-apps/sdk-react';

function App() {
  return (
    <BackButton
      onClick={() => console.log('Back clicked!')}
    />
  );
}
```

#### Props
```typescript
interface BackButtonProps {
  isVisible?: boolean;
  onClick?: () => void;
}
```

## Hooks

### 1. useWebApp

#### Usage
```typescript
import { useWebApp } from '@telegram-apps/sdk-react';

function App() {
  const webApp = useWebApp();
  
  useEffect(() => {
    console.log(webApp.platform);
    console.log(webApp.colorScheme);
  }, [webApp]);
}
```

### 2. useMainButton

#### Usage
```typescript
import { useMainButton } from '@telegram-apps/sdk-react';

function App() {
  const mainButton = useMainButton();
  
  useEffect(() => {
    mainButton.setText('Submit');
    mainButton.show();
  }, [mainButton]);
}
```

## Utilities

### 1. Theme Utilities

#### Usage
```typescript
import { getThemeParams } from '@telegram-apps/sdk';

// Get theme parameters
const themeParams = getThemeParams();

// Apply theme colors
const styles = {
  backgroundColor: themeParams.bg_color,
  color: themeParams.text_color
};
```

### 2. Validation Utilities

#### Usage
```typescript
import { validateInitData } from '@telegram-apps/sdk';

// Validate init data
const isValid = validateInitData(initData, botToken);
```

## Type Definitions

### 1. WebApp Types

```typescript
interface WebAppInitData {
  query_id: string;
  user: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
    start_param?: string;
  };
  auth_date: number;
  hash: string;
}

interface ThemeParams {
  bg_color: string;
  text_color: string;
  hint_color: string;
  link_color: string;
  button_color: string;
  button_text_color: string;
  secondary_bg_color: string;
}
```

### 2. Component Types

```typescript
interface ButtonProps {
  text: string;
  color?: string;
  onClick?: () => void;
}

interface PopupProps {
  title?: string;
  message: string;
  buttons?: PopupButton[];
}
```

## Best Practices

### 1. Error Handling

```typescript
import { WebApp } from '@telegram-apps/sdk';

try {
  WebApp.ready();
} catch (error) {
  console.error('Failed to initialize WebApp:', error);
  // Handle error appropriately
}
```

### 2. Type Safety

```typescript
import { WebApp, WebAppInitData } from '@telegram-apps/sdk';

// Type-safe access to init data
const initData: WebAppInitData = WebApp.initDataUnsafe;
```

### 3. Performance

```typescript
// Cache WebApp instance
const webApp = WebApp.getInstance();

// Use event delegation
document.addEventListener('click', (event) => {
  if (event.target.matches('.button')) {
    handleButtonClick(event);
  }
});
```

## Examples

### 1. Basic App Setup

```typescript
import { WebApp, MainButton } from '@telegram-apps/sdk';

// Initialize app
WebApp.ready();

// Setup main button
const mainButton = new MainButton();
mainButton.setText('Submit');
mainButton.show();
mainButton.onClick(() => {
  console.log('Form submitted!');
});
```

### 2. Theme Integration

```typescript
import { WebApp, getThemeParams } from '@telegram-apps/sdk';

// Apply theme
const themeParams = getThemeParams();
document.body.style.backgroundColor = themeParams.bg_color;
document.body.style.color = themeParams.text_color;
```

### 3. Form Handling

```typescript
import { WebApp, MainButton, Popup } from '@telegram-apps/sdk';

// Form submission
function handleSubmit() {
  const formData = new FormData(form);
  
  // Show loading state
  MainButton.setProgress(true);
  
  // Submit data
  fetch('/api/submit', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Show success popup
    new Popup({
      title: 'Success',
      message: 'Form submitted successfully!',
      buttons: [{ id: 'ok', type: 'ok', text: 'OK' }]
    }).show();
  })
  .catch(error => {
    // Show error popup
    new Popup({
      title: 'Error',
      message: 'Failed to submit form',
      buttons: [{ id: 'ok', type: 'destructive', text: 'OK' }]
    }).show();
  })
  .finally(() => {
    MainButton.setProgress(false);
  });
}
``` 