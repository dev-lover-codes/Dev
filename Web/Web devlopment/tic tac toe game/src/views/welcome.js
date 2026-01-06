import { navigate } from '../main.js';

export function renderWelcome() {
    const section = document.createElement('section');
    section.className = "flex flex-col items-center justify-center w-full h-full text-center p-6";

    section.innerHTML = `
        <div class="mb-10 relative group">
            <h1 class="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-pulse-glow p-2">
                TIC TAC TOE
            </h1>
            <div class="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <h2 class="text-2xl mt-4 text-gray-300 font-light tracking-widest">ULTIMATE</h2>
        </div>

        <button id="start-btn" class="glass-panel px-12 py-4 rounded-full text-2xl font-bold text-white hover:bg-white/10 transition transform hover:scale-110 active:scale-95 shadow-lg border-2 border-primary/50">
            PLAY <i class="fa-solid fa-play ml-2"></i>
        </button>

        <footer class="absolute bottom-5 text-gray-500 text-sm">
            Can you beat the Impossible AI?
        </footer>
    `;

    section.querySelector('#start-btn').addEventListener('click', () => {
        navigate('emoji-select'); // Go to Emoji selection first
    });

    return section;
}
