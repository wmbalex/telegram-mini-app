// Initialize Telegram Web App
const tg = window.Telegram.WebApp;

// Enable closing confirmation dialog
tg.enableClosingConfirmation();

// ALIENC Token Contract
const ALIENC_CONTRACT = 'EQCU9rkENAx-JSnSqWEfojQXXfFv9a3BJhFSn8M4FqFiGeqg';
const DISTRIBUTION_AMOUNT = 10000; // Amount in tokens

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

    // Check if user has Wallet
    if (tg.initDataUnsafe?.user?.id) {
        console.log('User ID:', tg.initDataUnsafe.user.id);
        
        // Request wallet access
        tg.MainButton.onClick(() => {
            console.log('Requesting wallet access...');
            if (window.Telegram?.WebApp?.TonConnect) {
                window.Telegram.WebApp.TonConnect.connect({
                    jsItems: [{
                        name: 'ALIENC Token Distribution',
                        description: 'Connect to receive ALIENC tokens'
                    }],
                    callback: (result) => {
                        console.log('Wallet connection result:', result);
                        if (result.result) {
                            const address = result.ton_addr;
                            handleWalletConnected(address);
                        } else {
                            tg.showAlert('Failed to connect wallet. Please try again.');
                        }
                    }
                });
            } else {
                tg.showAlert('Please update Telegram to use this feature.');
            }
        });
    } else {
        tg.showAlert('Please open this app in Telegram.');
    }

    function handleWalletConnected(address) {
        if (address) {
            console.log('Wallet connected:', address);
            walletStatus.textContent = `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`;
            tokenSection.style.display = 'block';
            tg.MainButton.hide();
            checkWalletEligibility(address);
        } else {
            walletStatus.textContent = 'Wallet not connected';
            tokenSection.style.display = 'none';
            tg.MainButton.show();
        }
    }

    // Set up token distribution button
    collectTokensBtn.addEventListener('click', async () => {
        if (!window.Telegram?.WebApp?.TonConnect?.currentAccount) {
            tg.showAlert('Please connect your wallet first');
            return;
        }

        const address = window.Telegram.WebApp.TonConnect.currentAccount;

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
                        window.Telegram.WebApp.TonConnect.sendTransaction({
                            validUntil: Math.floor(Date.now() / 1000) + 600,
                            messages: [{
                                address: ALIENC_CONTRACT,
                                amount: '20000000', // 0.02 TON for gas
                                payload: {
                                    abi: 'jetton_master',
                                    method: 'mint',
                                    params: {
                                        to: address,
                                        amount: DISTRIBUTION_AMOUNT,
                                        responseAddress: address
                                    }
                                }
                            }],
                            callback: (result) => {
                                console.log('Transaction result:', result);
                                if (result.result) {
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
        console.log('Checking eligibility for address:', address);
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
        console.error('Error checking eligibility:', error);
    }
} 