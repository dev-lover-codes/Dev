import { navigate } from '../main.js';
import { store } from '../store.js';

export function renderModeSelect() {
    const section = document.createElement('section');
    section.className = "flex flex-col gap-6 items-center justify-center w-full h-full animate-slide-in";

    section.innerHTML = `
        <h2 class="text-3xl font-bold mb-4">Select Mode</h2>
        
        <button id="offline-btn" class="group relative w-full max-w-md h-32 glass-panel rounded-2xl overflow-hidden shadow-2xl transition hover:-translate-y-1">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-20 group-hover:opacity-40 transition"></div>
            <div class="flex items-center justify-between px-8 h-full">
                <div class="text-left">
                    <h3 class="text-3xl font-bold">Offline Adventure</h3>
                    <p class="text-gray-300">Beat 3 Levels & AI Bosses</p>
                </div>
                <i class="fa-solid fa-gamepad text-5xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition"></i>
            </div>
        </button>

        <button id="online-btn" class="group relative w-full max-w-md h-32 glass-panel rounded-2xl overflow-hidden shadow-2xl transition hover:-translate-y-1">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-20 group-hover:opacity-40 transition"></div>
            <div class="flex items-center justify-between px-8 h-full">
                <div class="text-left">
                    <h3 class="text-3xl font-bold">Online Multiplayer</h3>
                    <p class="text-gray-300">Challenge Real Players</p>
                </div>
                <i class="fa-solid fa-earth-americas text-5xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition"></i>
            </div>
        </button>
        
        <button id="back-btn" class="mt-8 text-gray-500 hover:text-white transition">
            <i class="fa-solid fa-arrow-left"></i> Back
        </button>
    `;

    section.querySelector('#offline-btn').addEventListener('click', () => {
        store.setMode('offline');
        navigate('offline-levels');
    });

    section.querySelector('#online-btn').addEventListener('click', () => {
        store.setMode('online');
        navigate('online-login');
    });

    section.querySelector('#back-btn').addEventListener('click', () => {
        navigate('emoji-select'); // Or welcome
    });

    return section;
}
