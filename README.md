# Telegram Mini App

This is a basic Telegram Mini App template that demonstrates the integration with Telegram's Web App SDK.

## Features

- Basic Telegram Web App integration
- User information display
- Responsive design
- Theme support (light/dark mode)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. The app will be available at `http://localhost:3000`

## Development

- `index.html` - Main HTML file
- `styles.css` - Styling
- `app.js` - Application logic

## Testing in Telegram

1. Deploy your app to a web server
2. Create a new bot using [@BotFather](https://t.me/botfather)
3. Set up your Mini App in the bot settings
4. Test your app by opening it through your bot

## Notes

- The app uses Telegram's theme variables for consistent appearance
- Make sure your web server sets the following headers:
  ```
  Cache-Control: no-store, must-revalidate
  Pragma: no-cache
  Expires: 0
  ``` 