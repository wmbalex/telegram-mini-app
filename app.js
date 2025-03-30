// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Enable closing confirmation dialog
tg.enableClosingConfirmation();

// ALIENC Token Contract
const ALIENC_CONTRACT = 'EQCU9rkENAx-JSnSqWEfojQXXfFv9a3BJhFSn8M4FqFiGeqg';
const DISTRIBUTION_AMOUNT = 10000; // Amount in tokens

// Initialize TON Connect UI
const tonConnectUI = new TONConnect.UI({
    manifestUrl: 'https://wmbalex.github.io/telegram-mini-app/tonconnect-manifest.json',
    buttonRootId: 'tonconnect-button',
    uiPreferences: { theme: 'DARK' },
    walletsListConfiguration: {
        includeWallets: [
            {
                name: 'Tonkeeper',
                imageUrl: 'https://tonkeeper.com/assets/tonconnect-icon.png',
                aboutUrl: 'https://tonkeeper.com',
                universalLink: 'https://app.tonkeeper.com/ton-connect',
                bridgeUrl: 'https://bridge.tonapi.io/bridge',
                platforms: ['ios', 'android', 'chrome', 'firefox']
            }
        ]
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    // Expand the app to full height
    tg.expand();

    const walletStatus = document.getElementById('wallet-status');
    const tokenSection = document.getElementById('token-section');
    const collectTokensBtn = document.getElementById('collect-tokens');

    // Listen for wallet connection
    tonConnectUI.onStatusChange(async (wallet) => {
        if (wallet) {
            walletStatus.textContent = `Connected: ${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}`;
            tokenSection.style.display = 'block';
            await checkWalletEligibility(wallet.account.address);
        } else {
            walletStatus.textContent = 'Wallet not connected';
            tokenSection.style.display = 'none';
        }
    });

    // Set up token distribution button
    collectTokensBtn.addEventListener('click', async () => {
        const wallet = await tonConnectUI.getWallet();
        if (!wallet) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 600,
                messages: [
                    {
                        address: ALIENC_CONTRACT,
                        amount: '20000000',
                        payload: {
                            abi: 'jetton_master',
                            method: 'mint',
                            params: {
                                to: wallet.account.address,
                                amount: DISTRIBUTION_AMOUNT,
                                responseAddress: wallet.account.address
                            }
                        }
                    }
                ]
            };

            const result = await tonConnectUI.sendTransaction(transaction);
            
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