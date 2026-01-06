import { store } from './store.js';
import { renderWelcome } from './views/welcome.js';
import { renderEmojiSelect } from './views/emoji.js';
import { renderModeSelect } from './views/mode.js';
import { renderOfflineLevels } from './views/offlineLevels.js';
import { renderOfflineStages } from './views/offlineStages.js';
import { renderGame } from './views/game.js';
import { renderOnlineLogin } from './views/onlineLogin.js';
import { renderOnlineLobby } from './views/onlineLobby.js';

const app = document.getElementById('app');

const routes = {
    'welcome': renderWelcome,
    'emoji-select': renderEmojiSelect,
    'mode-select': renderModeSelect,
    'offline-levels': renderOfflineLevels,
    'offline-stages': renderOfflineStages,
    'game': renderGame,
    'online-login': renderOnlineLogin,
    'online-lobby': renderOnlineLobby
};

export function navigate(route, params = {}) {
    console.log(`Navigating to ${route}`, params);

    // Simple transition
    app.innerHTML = '';

    const viewFn = routes[route];
    if (viewFn) {
        const viewElement = viewFn(params);
        app.appendChild(viewElement);

        // Trigger Animation
        viewElement.classList.add('animate-slide-in');
    }
}

// Initial Load
navigate('welcome');

// Make navigate global for ease
window.navigate = navigate;
