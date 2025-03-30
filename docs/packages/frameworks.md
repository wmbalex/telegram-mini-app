# Frameworks for Telegram Mini Apps

This guide covers how to use different modern frameworks with Telegram Mini Apps.

## React

### 1. Setup

#### Create React App
```bash
# Create new React project
pnpm create react-app my-mini-app --template typescript

# Install dependencies
pnpm add @telegram-apps/sdk @telegram-apps/sdk-react
```

#### Project Structure
```
src/
├── components/
│   ├── MainButton.tsx
│   ├── BackButton.tsx
│   └── Popup.tsx
├── hooks/
│   ├── useWebApp.ts
│   └── useMainButton.ts
├── pages/
│   ├── Home.tsx
│   └── Settings.tsx
├── App.tsx
└── index.tsx
```

### 2. Components

#### MainButton Component
```typescript
// src/components/MainButton.tsx
import { MainButton } from '@telegram-apps/sdk-react';

interface Props {
  text: string;
  onClick?: () => void;
}

export const CustomMainButton: React.FC<Props> = ({ text, onClick }) => {
  return (
    <MainButton
      text={text}
      onClick={onClick}
      color="#2481cc"
    />
  );
};
```

#### BackButton Component
```typescript
// src/components/BackButton.tsx
import { BackButton } from '@telegram-apps/sdk-react';

interface Props {
  onClick?: () => void;
}

export const CustomBackButton: React.FC<Props> = ({ onClick }) => {
  return (
    <BackButton
      onClick={onClick}
    />
  );
};
```

### 3. Hooks

#### useWebApp Hook
```typescript
// src/hooks/useWebApp.ts
import { useWebApp } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

export const useWebAppInit = () => {
  const webApp = useWebApp();

  useEffect(() => {
    // Initialize WebApp
    webApp.ready();
    
    // Setup theme
    document.body.style.backgroundColor = webApp.backgroundColor;
    document.body.style.color = webApp.themeParams.text_color;
  }, [webApp]);
};
```

#### useMainButton Hook
```typescript
// src/hooks/useMainButton.ts
import { useMainButton } from '@telegram-apps/sdk-react';
import { useEffect } from 'react';

export const useMainButtonSetup = (text: string, onClick: () => void) => {
  const mainButton = useMainButton();

  useEffect(() => {
    mainButton.setText(text);
    mainButton.show();
    mainButton.onClick(onClick);
  }, [mainButton, text, onClick]);
};
```

### 4. Pages

#### Home Page
```typescript
// src/pages/Home.tsx
import { useWebAppInit } from '../hooks/useWebApp';
import { useMainButtonSetup } from '../hooks/useMainButton';
import { CustomMainButton } from '../components/MainButton';

export const Home: React.FC = () => {
  useWebAppInit();
  useMainButtonSetup('Submit', () => console.log('Clicked!'));

  return (
    <div>
      <h1>Welcome to Mini App</h1>
      <CustomMainButton text="Submit" />
    </div>
  );
};
```

## Vue

### 1. Setup

#### Create Vue Project
```bash
# Create new Vue project
pnpm create vue@latest my-mini-app

# Install dependencies
pnpm add @telegram-apps/sdk
```

#### Project Structure
```
src/
├── components/
│   ├── MainButton.vue
│   ├── BackButton.vue
│   └── Popup.vue
├── composables/
│   ├── useWebApp.ts
│   └── useMainButton.ts
├── views/
│   ├── Home.vue
│   └── Settings.vue
├── App.vue
└── main.ts
```

### 2. Components

#### MainButton Component
```vue
<!-- src/components/MainButton.vue -->
<template>
  <div class="main-button">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { MainButton } from '@telegram-apps/sdk';

const props = defineProps<{
  text: string;
  color?: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

onMounted(() => {
  const mainButton = new MainButton();
  mainButton.setText(props.text);
  if (props.color) {
    mainButton.setColor(props.color);
  }
  mainButton.onClick(() => emit('click'));
  mainButton.show();
});
</script>
```

#### BackButton Component
```vue
<!-- src/components/BackButton.vue -->
<template>
  <div class="back-button">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { BackButton } from '@telegram-apps/sdk';

const emit = defineEmits<{
  (e: 'click'): void;
}>();

onMounted(() => {
  const backButton = new BackButton();
  backButton.onClick(() => emit('click'));
  backButton.show();
});
</script>
```

### 3. Composables

#### useWebApp Composable
```typescript
// src/composables/useWebApp.ts
import { onMounted } from 'vue';
import { WebApp } from '@telegram-apps/sdk';

export function useWebApp() {
  onMounted(() => {
    WebApp.ready();
  });

  return {
    webApp: WebApp.getInstance(),
    initData: WebApp.initData,
    initDataUnsafe: WebApp.initDataUnsafe,
    platform: WebApp.platform,
    version: WebApp.version,
    colorScheme: WebApp.colorScheme,
    themeParams: WebApp.themeParams
  };
}
```

#### useMainButton Composable
```typescript
// src/composables/useMainButton.ts
import { onMounted } from 'vue';
import { MainButton } from '@telegram-apps/sdk';

export function useMainButton(text: string, onClick: () => void) {
  onMounted(() => {
    const mainButton = new MainButton();
    mainButton.setText(text);
    mainButton.onClick(onClick);
    mainButton.show();
  });
}
```

### 4. Views

#### Home View
```vue
<!-- src/views/Home.vue -->
<template>
  <div class="home">
    <h1>Welcome to Mini App</h1>
    <MainButton
      text="Submit"
      color="#2481cc"
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
import { useWebApp } from '../composables/useWebApp';
import { useMainButton } from '../composables/useMainButton';
import MainButton from '../components/MainButton.vue';

const { webApp } = useWebApp();
useMainButton('Submit', () => console.log('Clicked!'));

const handleClick = () => {
  console.log('Button clicked!');
};
</script>
```

## Svelte

### 1. Setup

#### Create Svelte Project
```bash
# Create new Svelte project
pnpm create vite my-mini-app --template svelte-ts

# Install dependencies
pnpm add @telegram-apps/sdk
```

#### Project Structure
```
src/
├── components/
│   ├── MainButton.svelte
│   ├── BackButton.svelte
│   └── Popup.svelte
├── stores/
│   ├── webApp.ts
│   └── mainButton.ts
├── routes/
│   ├── Home.svelte
│   └── Settings.svelte
├── App.svelte
└── main.ts
```

### 2. Components

#### MainButton Component
```svelte
<!-- src/components/MainButton.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { MainButton } from '@telegram-apps/sdk';

  export let text: string;
  export let color: string = '#2481cc';
  export let onClick: () => void;

  onMount(() => {
    const mainButton = new MainButton();
    mainButton.setText(text);
    mainButton.setColor(color);
    mainButton.onClick(onClick);
    mainButton.show();
  });
</script>
```

#### BackButton Component
```svelte
<!-- src/components/BackButton.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { BackButton } from '@telegram-apps/sdk';

  export let onClick: () => void;

  onMount(() => {
    const backButton = new BackButton();
    backButton.onClick(onClick);
    backButton.show();
  });
</script>
```

### 3. Stores

#### WebApp Store
```typescript
// src/stores/webApp.ts
import { writable } from 'svelte/store';
import { WebApp } from '@telegram-apps/sdk';

export const webApp = writable(WebApp.getInstance());
export const initData = writable(WebApp.initData);
export const initDataUnsafe = writable(WebApp.initDataUnsafe);
export const platform = writable(WebApp.platform);
export const version = writable(WebApp.version);
export const colorScheme = writable(WebApp.colorScheme);
export const themeParams = writable(WebApp.themeParams);
```

#### MainButton Store
```typescript
// src/stores/mainButton.ts
import { writable } from 'svelte/store';
import { MainButton } from '@telegram-apps/sdk';

export const mainButton = writable(new MainButton());
```

### 4. Routes

#### Home Route
```svelte
<!-- src/routes/Home.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { webApp } from '../stores/webApp';
  import { mainButton } from '../stores/mainButton';
  import MainButton from '../components/MainButton.svelte';

  onMount(() => {
    // Initialize WebApp
    $webApp.ready();
    
    // Setup main button
    $mainButton.setText('Submit');
    $mainButton.show();
    $mainButton.onClick(() => console.log('Clicked!'));
  });
</script>

<div class="home">
  <h1>Welcome to Mini App</h1>
  <MainButton
    text="Submit"
    color="#2481cc"
    onClick={() => console.log('Button clicked!')}
  />
</div>
```

## SolidJS

### 1. Setup

#### Create SolidJS Project
```bash
# Create new SolidJS project
pnpm create vite my-mini-app --template solid-ts

# Install dependencies
pnpm add @telegram-apps/sdk
```

#### Project Structure
```
src/
├── components/
│   ├── MainButton.tsx
│   ├── BackButton.tsx
│   └── Popup.tsx
├── stores/
│   ├── webApp.ts
│   └── mainButton.ts
├── pages/
│   ├── Home.tsx
│   └── Settings.tsx
├── App.tsx
└── index.tsx
```

### 2. Components

#### MainButton Component
```typescript
// src/components/MainButton.tsx
import { Component, onMount } from 'solid-js';
import { MainButton } from '@telegram-apps/sdk';

interface Props {
  text: string;
  color?: string;
  onClick?: () => void;
}

export const CustomMainButton: Component<Props> = (props) => {
  onMount(() => {
    const mainButton = new MainButton();
    mainButton.setText(props.text);
    if (props.color) {
      mainButton.setColor(props.color);
    }
    if (props.onClick) {
      mainButton.onClick(props.onClick);
    }
    mainButton.show();
  });

  return null;
};
```

#### BackButton Component
```typescript
// src/components/BackButton.tsx
import { Component, onMount } from 'solid-js';
import { BackButton } from '@telegram-apps/sdk';

interface Props {
  onClick?: () => void;
}

export const CustomBackButton: Component<Props> = (props) => {
  onMount(() => {
    const backButton = new BackButton();
    if (props.onClick) {
      backButton.onClick(props.onClick);
    }
    backButton.show();
  });

  return null;
};
```

### 3. Stores

#### WebApp Store
```typescript
// src/stores/webApp.ts
import { createStore } from 'solid-js/store';
import { WebApp } from '@telegram-apps/sdk';

export const [webAppState, setWebAppState] = createStore({
  webApp: WebApp.getInstance(),
  initData: WebApp.initData,
  initDataUnsafe: WebApp.initDataUnsafe,
  platform: WebApp.platform,
  version: WebApp.version,
  colorScheme: WebApp.colorScheme,
  themeParams: WebApp.themeParams
});
```

#### MainButton Store
```typescript
// src/stores/mainButton.ts
import { createStore } from 'solid-js/store';
import { MainButton } from '@telegram-apps/sdk';

export const [mainButtonState, setMainButtonState] = createStore({
  mainButton: new MainButton()
});
```

### 4. Pages

#### Home Page
```typescript
// src/pages/Home.tsx
import { Component, onMount } from 'solid-js';
import { webAppState } from '../stores/webApp';
import { mainButtonState } from '../stores/mainButton';
import { CustomMainButton } from '../components/MainButton';

export const Home: Component = () => {
  onMount(() => {
    // Initialize WebApp
    webAppState.webApp.ready();
    
    // Setup main button
    mainButtonState.mainButton.setText('Submit');
    mainButtonState.mainButton.show();
    mainButtonState.mainButton.onClick(() => console.log('Clicked!'));
  });

  return (
    <div>
      <h1>Welcome to Mini App</h1>
      <CustomMainButton
        text="Submit"
        color="#2481cc"
        onClick={() => console.log('Button clicked!')}
      />
    </div>
  );
};
```

## Best Practices

### 1. Framework-Specific Patterns

#### React
- Use hooks for state management
- Implement error boundaries
- Use React.memo for performance
- Follow React best practices

#### Vue
- Use composition API
- Implement error handling
- Use computed properties
- Follow Vue best practices

#### Svelte
- Use stores for state
- Implement error handling
- Use reactive statements
- Follow Svelte best practices

#### SolidJS
- Use stores for state
- Implement error handling
- Use createEffect
- Follow SolidJS best practices

### 2. Common Patterns

#### Error Handling
```typescript
// Example of error handling
try {
  // Initialize app
  WebApp.ready();
} catch (error) {
  console.error('Failed to initialize:', error);
  // Handle error appropriately
}
```

#### Theme Integration
```typescript
// Example of theme integration
const applyTheme = (themeParams: ThemeParams) => {
  document.body.style.backgroundColor = themeParams.bg_color;
  document.body.style.color = themeParams.text_color;
};
```

#### Performance
```typescript
// Example of performance optimization
const debounce = (fn: Function, delay: number) => {
  let timeoutId: number;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};
```

### 3. Testing

#### Unit Tests
```typescript
// Example of unit test
describe('MainButton', () => {
  it('renders correctly', () => {
    const { container } = render(<MainButton text="Submit" />);
    expect(container).toBeInTheDocument();
  });
});
```

#### Integration Tests
```typescript
// Example of integration test
describe('WebApp Integration', () => {
  it('initializes correctly', () => {
    const webApp = WebApp.getInstance();
    expect(webApp).toBeDefined();
    expect(webApp.platform).toBeDefined();
  });
});
``` 