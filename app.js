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

    // Set up Telegram MainButton for wallet connection
    tg.MainButton.setParams({
        text: 'CONNECT WALLET',
        color: '#39FF14',
        text_color: '#000000',
        is_active: true,
        is_visible: true
    });

    // Handle MainButton click
    tg.MainButton.onClick(() => {
        // Open Telegram's native TON Wallet
        tg.openTonWallet({
            callback: (result) => {
                if (result) {
                    handleWalletConnected(result);
                } else {
                    tg.showAlert('Failed to connect wallet. Please try again.');
                }
            }
        });
    });

    function handleWalletConnected(wallet) {
        if (wallet && wallet.address) {
            walletStatus.textContent = `Connected: ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`;
            tokenSection.style.display = 'block';
            tg.MainButton.hide();
            checkWalletEligibility(wallet.address);
        } else {
            walletStatus.textContent = 'Wallet not connected';
            tokenSection.style.display = 'none';
            tg.MainButton.show();
        }
    }

    // Set up token distribution button
    collectTokensBtn.addEventListener('click', async () => {
        const wallet = tg.initDataUnsafe?.user?.wallet;
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
                    try {
                        // Send transaction using Telegram's native TON Wallet
                        tg.sendTonTransaction({
                            to_address: ALIENC_CONTRACT,
                            amount: '20000000', // 0.02 TON for gas
                            payload: {
                                abi: 'jetton_master',
                                method: 'mint',
                                params: {
                                    to: wallet.address,
                                    amount: DISTRIBUTION_AMOUNT,
                                    responseAddress: wallet.address
                                }
                            },
                            callback: (result) => {
                                if (result.success) {
                                    collectTokensBtn.disabled = true;
                                    collectTokensBtn.textContent = 'Tokens Sent!';
                                    tg.showPopup({
                                        title: 'Success!',
                                        message: 'Distribution successful! Check your wallet in a few minutes.',
                                        buttons: [{
                                            type: 'ok'
                                        }]
                                    });
                                } else {
                                    tg.showAlert('Failed to send transaction. Please try again later.');
                                }
                            }
                        });
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