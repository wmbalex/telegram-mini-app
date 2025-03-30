// Initialize Telegram Web App
let tg = window.Telegram.WebApp;

// Enable closing confirmation dialog
tg.enableClosingConfirmation();

// ALIENC Token Contract
const ALIENC_CONTRACT = 'EQCU9rkENAx-JSnSqWEfojQXXfFv9a3BJhFSn8M4FqFiGeqg';
const DISTRIBUTION_AMOUNT = 10000; // Amount in tokens

// Initialize TON Connect
const manifestUrl = 'https://wmbalex.github.io/telegram-mini-app/tonconnect-manifest.json';
let connector;
let userWallet = null;

document.addEventListener('DOMContentLoaded', async function() {
    // Expand the app to full height
    tg.expand();

    // Initialize TON Connect
    connector = new TonConnect({
        manifestUrl: manifestUrl,
        buttonRootId: 'connect-wallet',
        uiPreferences: {
            theme: 'DARK'
        },
        actionsConfiguration: {
            twaReturnUrl: window.location.href
        }
    });

    // Set up UI elements
    const connectWalletBtn = document.getElementById('connect-wallet');
    const walletStatus = document.getElementById('wallet-status');
    const tokenSection = document.getElementById('token-section');
    const collectTokensBtn = document.getElementById('collect-tokens');

    // Get available wallets
    const wallets = await connector.getWallets();
    
    connectWalletBtn.addEventListener('click', async () => {
        try {
            // Default to Tonkeeper if available, otherwise use first available wallet
            const tonkeeper = wallets.find(w => w.name.toLowerCase().includes('tonkeeper')) || wallets[0];
            
            if (!tonkeeper) {
                throw new Error('No compatible wallet found');
            }

            const universalLink = connector.connect(tonkeeper);
            
            // For Telegram Mini App, we should use a special format
            if (tg.platform === 'tdesktop' || tg.platform === 'web') {
                // For desktop or web version, open in new tab
                window.open(universalLink, '_blank');
            } else {
                // For mobile, open directly
                window.location.href = universalLink;
            }

            // Update UI to show connecting state
            walletStatus.textContent = 'Connecting...';
            connectWalletBtn.disabled = true;
        } catch (error) {
            console.error('Error connecting wallet:', error);
            walletStatus.textContent = 'Failed to connect wallet. Please try again.';
            connectWalletBtn.disabled = false;
        }
    });

    // Listen for wallet connection
    connector.onStatusChange(async (wallet) => {
        if (wallet) {
            userWallet = wallet;
            walletStatus.textContent = `Connected: ${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}`;
            tokenSection.style.display = 'block';
            connectWalletBtn.style.display = 'none';
            
            // Check if wallet is eligible for distribution
            await checkWalletEligibility(wallet.account.address);
        } else {
            userWallet = null;
            walletStatus.textContent = 'Wallet not connected';
            tokenSection.style.display = 'none';
            connectWalletBtn.style.display = 'block';
            connectWalletBtn.disabled = false;
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
                                to: userWallet.account.address,
                                amount: DISTRIBUTION_AMOUNT,
                                responseAddress: userWallet.account.address
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