// Initialize Telegram Web App
let tg = window.Telegram.WebApp;

// Enable closing confirmation dialog
tg.enableClosingConfirmation();

// ALIENC Token Contract
const ALIENC_CONTRACT = 'EQCU9rkENAx-JSnSqWEfojQXXfFv9a3BJhFSn8M4FqFiGeqg';
const DISTRIBUTION_AMOUNT = 10000; // Amount in tokens

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
                
                // Check if wallet is eligible for distribution
                checkWalletEligibility(userWallet.address);
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
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
                messages: [
                    {
                        address: ALIENC_CONTRACT,
                        amount: '20000000', // 0.02 TON for gas
                        payload: {
                            abi: 'jetton_master',
                            method: 'mint',
                            params: {
                                to: userWallet.address,
                                amount: DISTRIBUTION_AMOUNT,
                                responseAddress: userWallet.address
                            }
                        }
                    }
                ]
            };

            // Send transaction
            const result = await connector.sendTransaction(transaction);
            
            if (result) {
                collectTokensBtn.disabled = true;
                collectTokensBtn.textContent = 'Tokens Sent!';
                alert('Distribution successful! Check your wallet in a few minutes.');
            }
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

async function checkWalletEligibility(address) {
    try {
        // Query the contract to check if the wallet has already received tokens
        const response = await fetch(`https://tonapi.io/v2/accounts/${ALIENC_CONTRACT}/jettons/${address}`);
        const data = await response.json();
        
        const collectTokensBtn = document.getElementById('collect-tokens');
        if (data && data.balance && data.balance > 0) {
            collectTokensBtn.disabled = true;
            collectTokensBtn.textContent = 'Already Received';
            document.querySelector('.info-text').textContent = 'You have already received ALIENC tokens.';
        }
    } catch (error) {
        console.error('Error checking eligibility:', error);
    }
} 