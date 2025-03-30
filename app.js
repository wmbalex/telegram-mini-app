// Initialize Telegram Web App
let tg = window.Telegram.WebApp;

// Enable closing confirmation dialog
tg.enableClosingConfirmation();

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Expand the app to full height
    tg.expand();

    // Get user information
    const user = tg.initDataUnsafe.user;
    const userInfo = document.getElementById('user-info');

    if (user) {
        userInfo.innerHTML = `
            <p>User ID: ${user.id}</p>
            <p>First Name: ${user.first_name}</p>
            ${user.last_name ? `<p>Last Name: ${user.last_name}</p>` : ''}
            ${user.username ? `<p>Username: ${user.username}</p>` : ''}
            ${user.language_code ? `<p>Language: ${user.language_code}</p>` : ''}
            ${user.start_param ? `<p>Start Parameter: ${user.start_param}</p>` : ''}
        `;
    } else {
        userInfo.innerHTML = '<p>No user information available</p>';
    }
}); 