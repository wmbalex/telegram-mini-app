// Initialize TWA SDK
const WebApp = window.Telegram.WebApp;
const TWA = window.TWA;

// Enable closing confirmation
WebApp.enableClosingConfirmation();

// ALIENC Token Contract
const ALIENC_CONTRACT = 'EQCU9rkENAx-JSnSqWEfojQXXfFv9a3BJhFSn8M4FqFiGeqg';
const DISTRIBUTION_AMOUNT = 10000;

// Initialize TON Connect UI
const tonConnectUI = new TONConnect.UI({
    manifestUrl: 'https://wmbalex.github.io/telegram-mini-app/tonconnect-manifest.json',
    buttonRootId: 'wallet-status',
    uiPreferences: { 
        theme: WebApp.colorScheme
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Verify we're in Telegram
        if (!TWA.isInTelegram) {
            throw new Error('Please open this app in Telegram');
        }

        // Initialize UI elements
        const walletStatus = document.getElementById('wallet-status');
        const tokenSection = document.getElementById('token-section');
        const collectTokensBtn = document.getElementById('collect-tokens');

        // Set up Telegram MainButton
        WebApp.MainButton.setParams({
            text: 'CONNECT WALLET',
            color: '#39FF14',
            textColor: '#000000',
            isVisible: true,
            isActive: true
        });

        // Handle wallet connection
        WebApp.MainButton.onClick(async () => {
            try {
                await tonConnectUI.connectWallet();
            } catch (error) {
                console.error('Connection error:', error);
                WebApp.showAlert('Failed to connect wallet. Please try again.');
            }
        });

        // Listen for wallet connection changes
        tonConnectUI.onStatusChange(async (wallet) => {
            console.log('Wallet status changed:', wallet);
            
            if (wallet) {
                const address = wallet.account.address;
                console.log('Connected wallet address:', address);
                
                walletStatus.textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
                tokenSection.style.display = 'block';
                WebApp.MainButton.hide();
                
                await checkWalletEligibility(address);
            } else {
                walletStatus.textContent = 'Wallet not connected';
                tokenSection.style.display = 'none';
                WebApp.MainButton.show();
            }
        });

        // Handle token distribution
        collectTokensBtn.addEventListener('click', async () => {
            const wallet = await tonConnectUI.getWallet();
            if (!wallet) {
                WebApp.showAlert('Please connect your wallet first');
                return;
            }

            try {
                WebApp.showPopup({
                    title: 'Confirm Distribution',
                    message: `You will receive ${DISTRIBUTION_AMOUNT} ALIENC tokens. Continue?`,
                    buttons: [
                        { id: 'confirm', type: 'ok', text: 'Confirm' },
                        { id: 'cancel', type: 'cancel', text: 'Cancel' }
                    ]
                }, async (buttonId) => {
                    if (buttonId === 'confirm') {
                        try {
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

                            const result = await tonConnectUI.sendTransaction(transaction);
                            console.log('Transaction result:', result);

                            if (result) {
                                collectTokensBtn.disabled = true;
                                collectTokensBtn.textContent = 'Tokens Sent!';
                                WebApp.showPopup({
                                    title: 'Success!',
                                    message: 'Distribution successful! Check your wallet in a few minutes.',
                                    buttons: [{ type: 'ok' }]
                                });
                            }
                        } catch (error) {
                            console.error('Transaction error:', error);
                            WebApp.showAlert('Failed to distribute tokens. Please try again later.');
                        }
                    }
                });
            } catch (error) {
                console.error('Popup error:', error);
                WebApp.showAlert('Failed to show confirmation. Please try again.');
            }
        });

    } catch (error) {
        console.error('Initialization error:', error);
        WebApp.showAlert(error.message);
    }
});

async function checkWalletEligibility(address) {
    try {
        console.log('Checking eligibility for:', address);
        const response = await fetch(`https://tonapi.io/v2/accounts/${ALIENC_CONTRACT}/jettons/${address}`);
        const data = await response.json();
        console.log('Eligibility data:', data);
        
        const collectTokensBtn = document.getElementById('collect-tokens');
        if (data && data.balance && data.balance > 0) {
            collectTokensBtn.disabled = true;
            collectTokensBtn.textContent = 'Already Received';
            document.querySelector('.info-text').textContent = 'You have already received ALIENC tokens.';
        }
    } catch (error) {
        console.error('Eligibility check error:', error);
    }
} 