// Initialize Telegram Web App
let tg = window.Telegram.WebApp;

// Enable closing confirmation dialog
tg.enableClosingConfirmation();

// Initialize TON Connect
const tonConnectManifest = {
    url: window.location.origin,
    name: "ALIENC Token Distribution",
    iconUrl: window.location.origin + "/icon.png"
};

let connector;
let userWallet = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Expand the app to full height
    tg.expand();

    // Initialize TON Connect
    connector = new TonConnect();
    await connector.init();

    // Set up wallet connection button
    const connectWalletBtn = document.getElementById('connect-wallet');
    const walletStatus = document.getElementById('wallet-status');
    const tokenSection = document.getElementById('token-section');
    const collectTokensBtn = document.getElementById('collect-tokens');

    connectWalletBtn.addEventListener('click', async () => {
        try {
            // Request wallet connection
            const walletConnectionSource = {
                universalLink: 'https://app.tonkeeper.com/ton-connect',
                bridgeUrl: 'https://bridge.tonapi.io/bridge'
            };
            
            await connector.connect(walletConnectionSource);
            
            // Update UI when wallet is connected
            userWallet = await connector.account;
            if (userWallet) {
                walletStatus.textContent = `Connected: ${userWallet.address.slice(0, 6)}...${userWallet.address.slice(-4)}`;
                tokenSection.style.display = 'block';
                connectWalletBtn.style.display = 'none';
                
                // Check if this wallet has already received tokens
                // This will be implemented when you provide the contract details
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            walletStatus.textContent = 'Failed to connect wallet. Please try again.';
        }
    });

    // Set up token distribution button
    collectTokensBtn.addEventListener('click', async () => {
        if (!userWallet) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            // Here we'll add the token distribution logic once you provide the contract address
            alert('Token distribution will be implemented once contract details are provided. This will be a one-time distribution of 10,000 ALIENC tokens per wallet.');
        } catch (error) {
            console.error('Error during token distribution:', error);
            alert('Failed to distribute tokens. Please try again later.');
        }
    });

    // Listen for wallet disconnection
    connector.onStatusChange((wallet) => {
        if (!wallet) {
            userWallet = null;
            walletStatus.textContent = 'Wallet not connected';
            tokenSection.style.display = 'none';
            connectWalletBtn.style.display = 'block';
        }
    });
}); 