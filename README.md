# ALIENC Token Distribution - Telegram Mini App

A Telegram Mini App for distributing ALIENC tokens on the TON blockchain. This app allows users to connect their TON wallet and claim ALIENC tokens through a simple and intuitive interface.

## Features

- 🔗 TON Wallet Integration
- 🎨 Native Telegram UI/UX
- 🌓 Automatic Theme Support (Light/Dark)
- 💰 Token Distribution System
- ✅ Eligibility Checking
- 🔒 Secure Transaction Handling

## Technical Details

- **Token Contract**: `EQCU9rkENAx-JSnSqWEfojQXXfFv9a3BJhFSn8M4FqFiGeqg`
- **Distribution Amount**: 10,000 ALIENC tokens
- **Network**: TON Mainnet
- **Required Gas**: 0.02 TON

## Dependencies

- Telegram Web App SDK
- TON Connect SDK (v2.1.3)
- TON Connect UI (v1.0.0)

## Project Structure

```
telegram-mini-app/
├── index.html          # Main HTML file
├── app.js             # Application logic
├── styles.css         # Styling
└── tonconnect-manifest.json  # TON Connect configuration
```

## Setup Instructions

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/wmbalex/telegram-mini-app.git
   cd telegram-mini-app
   ```

2. Switch to the gh-pages branch:
   ```bash
   git checkout gh-pages
   ```

3. Serve the project locally:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # OR using Node.js
   npx http-server
   ```

### Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the `gh-pages` branch:

```bash
git add .
git commit -m "Your changes description"
git push origin gh-pages
```

## Integration Details

### TON Connect Integration

```javascript
const tonConnectUI = new TonConnectUI({
    manifestUrl: 'https://wmbalex.github.io/telegram-mini-app/tonconnect-manifest.json',
    buttonRootId: 'wallet-status',
    uiPreferences: { 
        theme: WebApp.colorScheme
    }
});
```

### Transaction Structure

```javascript
const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 600,
    messages: [{
        address: ALIENC_CONTRACT,
        amount: '20000000', // 0.02 TON for gas
        payload: {
            abi: 'jetton_master',
            method: 'mint',
            params: {
                to: wallet.account.address,
                amount: DISTRIBUTION_AMOUNT,
                responseAddress: wallet.account.address
            }
        }
    }]
};
```

## Testing

1. Open the bot in Telegram
2. Click the "CONNECT WALLET" button
3. Select your TON wallet
4. Approve the connection
5. Click "Collect Tokens" to receive ALIENC tokens

## Development Notes

### Required Headers

```http
Cache-Control: no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### Browser Support

- Telegram Web App Browser
- Modern web browsers for testing (Chrome, Firefox, Safari)

## Troubleshooting

### Common Issues

1. **Wallet Not Connecting**
   - Ensure you're using the latest version of Telegram
   - Check if your wallet (e.g., Tonkeeper) is installed
   - Clear browser cache and reload

2. **Transaction Failures**
   - Verify you have enough TON for gas (minimum 0.02 TON)
   - Check wallet connection status
   - Ensure you haven't already claimed tokens

### Debug Mode

The app includes comprehensive console logging for debugging:
- Wallet connection status
- Transaction details
- Eligibility checking results

## Security Considerations

- All transactions require user confirmation
- No sensitive data is stored locally
- Secure communication through Telegram's platform
- Rate limiting on token distribution

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this code for your own projects.

## Contact

For support or inquiries, contact through the Telegram bot. 