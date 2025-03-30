// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Enable closing confirmation dialog
tg.enableClosingConfirmation();

// ALIENC Token Contract
const ALIENC_CONTRACT = 'EQCU9rkENAx-JSnSqWEfojQXXfFv9a3BJhFSn8M4FqFiGeqg';
const DISTRIBUTION_AMOUNT = 10000; // Amount in tokens

// Initialize TON Connect
const connector = new TONConnect.SDK({
    manifestUrl: 'https://wmbalex.github.io/telegram-mini-app/tonconnect-manifest.json'
});

document.addEventListener('DOMContentLoaded', async () => {
    // Expand the app to full height
    tg.expand();
    
    // Set up Telegram theme
    document.documentElement.classList.add(`theme-${tg.colorScheme}`);
    
    const walletStatus = document.getElementById('wallet-status');
    const tokenSection = document.getElementById('token-section');
    const collectTokensBtn = document.getElementById('collect-tokens');

    // Set up Telegram MainButton
    tg.MainButton.setParams({
        text: 'CONNECT WALLET',
        color: '#39FF14',
        text_color: '#000000',
        is_active: true,
        is_visible: true
    });

    // Handle MainButton click
    tg.MainButton.onClick(async () => {
        try {
            const wallets = await connector.getWallets();
            const tonWallet = wallets.find(w => w.name === 'Wallet');
            
            if (tonWallet) {
                const universalLink = connector.connect(tonWallet);
                window.location.href = universalLink;
            } else {
                tg.showAlert('Telegram Wallet not found. Please install it first.');
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            tg.showAlert('Failed to connect wallet. Please try again.');
        }
    });

    // Listen for wallet connection
    connector.onStatusChange(async (wallet) => {
        if (wallet) {
            walletStatus.textContent = `Connected: ${wallet.account.address.slice(0, 6)}...${wallet.account.address.slice(-4)}`;
            tokenSection.style.display = 'block';
            tg.MainButton.hide();
            await checkWalletEligibility(wallet.account.address);
        } else {
            walletStatus.textContent = 'Wallet not connected';
            tokenSection.style.display = 'none';
            tg.MainButton.show();
        }
    });

    // Set up token distribution button
    collectTokensBtn.addEventListener('click', async () => {
        const wallet = await connector.getWallet();
        if (!wallet) {
            tg.showAlert('Please connect your wallet first');
            return;
        }

        try {
            tg.showPopup({
                title: 'Confirm Distribution',
                message: `You will receive ${DISTRIBUTION_AMOUNT} ALIENC tokens. Continue?`,
                buttons: [{
                    id: 'confirm',
                    type: 'ok',
                    text: 'Confirm'
                }, {
                    id: 'cancel',
                    type: 'cancel',
                    text: 'Cancel'
                }]
            }, async (buttonId) => {
                if (buttonId === 'confirm') {
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

                    try {
                        const result = await connector.sendTransaction(transaction);
                        if (result) {
                            collectTokensBtn.disabled = true;
                            collectTokensBtn.textContent = 'Tokens Sent!';
                            tg.showPopup({
                                title: 'Success!',
                                message: 'Distribution successful! Check your wallet in a few minutes.',
                                buttons: [{
                                    type: 'ok'
                                }]
                            });
                        }
                    } catch (error) {
                        console.error('Error during token distribution:', error);
                        tg.showAlert('Failed to distribute tokens. Please try again later.');
                    }
                }
            });
        } catch (error) {
            console.error('Error showing confirmation:', error);
            tg.showAlert('Failed to show confirmation. Please try again.');
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