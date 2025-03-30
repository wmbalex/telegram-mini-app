# Launch Parameters in Telegram Mini Apps

## Overview

Launch parameters are essential for initializing and configuring Telegram Mini Apps. They provide context, user information, and configuration options when the app starts.

## Initialization Data

### 1. Basic Structure

#### Init Data Format
```javascript
{
  query_id: string,
  user: {
    id: number,
    first_name: string,
    last_name?: string,
    username?: string,
    language_code?: string,
    start_param?: string
  },
  auth_date: number,
  hash: string
}
```

#### Accessing Init Data
```javascript
// Example of accessing init data
const initData = window.Telegram.WebApp.initData;
const initDataUnsafe = window.Telegram.WebApp.initDataUnsafe;
```

### 2. User Information

#### User Object
```javascript
// Example of accessing user information
const user = window.Telegram.WebApp.initDataUnsafe.user;
console.log({
  id: user.id,
  name: user.first_name,
  username: user.username
});
```

#### User Language
```javascript
// Example of accessing user language
const languageCode = window.Telegram.WebApp.initDataUnsafe.user?.language_code;
const locale = languageCode || 'en';
```

## Launch Parameters

### 1. Start Parameters

#### Setting Start Parameter
```javascript
// Example of setting start parameter
const startParam = 'welcome';
const url = `https://t.me/your_bot?start=${startParam}`;
```

#### Accessing Start Parameter
```javascript
// Example of accessing start parameter
const startParam = window.Telegram.WebApp.initDataUnsafe.user?.start_param;
if (startParam) {
  handleStartParameter(startParam);
}
```

### 2. Deep Linking

#### Deep Link Format
```
https://t.me/your_bot/app?startapp=param1_value&param2=value2
```

#### Handling Deep Links
```javascript
// Example of handling deep links
function handleDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const startapp = params.get('startapp');
  if (startapp) {
    handleStartAppParameter(startapp);
  }
}
```

## Configuration Options

### 1. App Settings

#### Theme Settings
```javascript
// Example of accessing theme settings
const colorScheme = window.Telegram.WebApp.colorScheme;
const themeParams = window.Telegram.WebApp.themeParams;
```

#### Platform Settings
```javascript
// Example of accessing platform settings
const platform = window.Telegram.WebApp.platform;
const version = window.Telegram.WebApp.version;
```

### 2. Viewport Settings

#### Viewport Information
```javascript
// Example of accessing viewport information
const viewportHeight = window.Telegram.WebApp.viewportHeight;
const viewportStableHeight = window.Telegram.WebApp.viewportStableHeight;
const isExpanded = window.Telegram.WebApp.isExpanded;
```

#### Safe Area
```javascript
// Example of handling safe area
const headerColor = window.Telegram.WebApp.headerColor;
const backgroundColor = window.Telegram.WebApp.backgroundColor;
```

## Security

### 1. Data Validation

#### Hash Verification
```javascript
// Example of hash verification
function verifyHash(initData) {
  const hash = initData.hash;
  delete initData.hash;
  
  const dataCheckString = Object.keys(initData)
    .sort()
    .map(key => `${key}=${initData[key]}`)
    .join('\n');
    
  const secret = createHash('sha256')
    .update(BOT_TOKEN)
    .digest();
    
  const calculatedHash = createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');
    
  return calculatedHash === hash;
}
```

#### Data Sanitization
```javascript
// Example of data sanitization
function sanitizeInitData(initData) {
  return {
    ...initData,
    user: {
      ...initData.user,
      first_name: escapeHtml(initData.user.first_name),
      last_name: initData.user.last_name ? escapeHtml(initData.user.last_name) : undefined,
      username: initData.user.username ? escapeHtml(initData.user.username) : undefined
    }
  };
}
```

## Best Practices

### 1. Initialization

#### App Setup
```javascript
// Example of app initialization
function initializeApp() {
  // Verify init data
  if (!verifyHash(window.Telegram.WebApp.initData)) {
    throw new Error('Invalid init data');
  }
  
  // Setup theme
  setupTheme();
  
  // Setup viewport
  setupViewport();
  
  // Handle start parameters
  handleStartParameters();
}
```

#### Error Handling
```javascript
// Example of error handling
function handleInitializationError(error) {
  console.error('Initialization error:', error);
  showErrorToUser('Failed to initialize app');
}
```

### 2. Configuration

#### Dynamic Configuration
```javascript
// Example of dynamic configuration
const config = {
  theme: window.Telegram.WebApp.colorScheme,
  language: window.Telegram.WebApp.initDataUnsafe.user?.language_code || 'en',
  platform: window.Telegram.WebApp.platform
};
```

#### Platform-Specific Settings
```javascript
// Example of platform-specific settings
function getPlatformSettings() {
  const platform = window.Telegram.WebApp.platform;
  switch (platform) {
    case 'ios':
      return { safeArea: true, nativeNav: true };
    case 'android':
      return { safeArea: false, nativeNav: true };
    default:
      return { safeArea: false, nativeNav: false };
  }
}
```

## Testing

### 1. Development Testing

#### Test Environment
```javascript
// Example of test environment setup
const isTestEnvironment = process.env.NODE_ENV === 'development';
if (isTestEnvironment) {
  window.Telegram = {
    WebApp: {
      initData: 'test_data',
      initDataUnsafe: {
        user: {
          id: 123456,
          first_name: 'Test User'
        }
      }
    }
  };
}
```

#### Mock Data
```javascript
// Example of mock data
const mockInitData = {
  query_id: 'test_query',
  user: {
    id: 123456,
    first_name: 'Test User',
    language_code: 'en'
  },
  auth_date: Date.now(),
  hash: 'test_hash'
};
``` 