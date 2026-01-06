import { navigate } from '../main.js';
import { store } from '../store.js';

export function renderEmojiSelect() {
    const emojis = ['❌', '🚀', '🐱', '💀', '🔥', '💎', '🍀', '⚡'];
    let selected = emojis[0];

    const section = document.createElement('section');
    section.className = "flex flex-col items-center justify-center w-full h-full p-6 animate-fade-in";

    section.innerHTML = `
        <h2 class="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Choose Your Fighter</h2>
        
        <div class="grid grid-cols-4 gap-4 mb-10">
            ${emojis.map(emoji => `
                <button class="emoji-btn text-5xl p-4 glass-panel rounded-xl hover:bg-white/20 transition transform hover:scale-110 focus:ring-4 ring-primary" data-emoji="${emoji}">
                    ${emoji}
                </button>
            `).join('')}
        </div>

        <div class="flex items-center gap-4 text-xl mb-8">
            <div class="text-center">
                <p class="text-gray-400 text-sm mb-1">You</p>
                <div id="preview-p1" class="text-6xl glass-panel p-4 rounded-lg bg-primary/20">${selected}</div>
            </div>
            <div class="text-2xl font-bold text-gray-500">VS</div>
            <div class="text-center">
                <p class="text-gray-400 text-sm mb-1">Opponent</p>
                <div class="text-6xl glass-panel p-4 rounded-lg bg-red-500/20">⭕</div>
            </div>
        </div>

        <button id="confirm-btn" class="w-64 py-4 bg-gradient-to-r from-primary to-secondary rounded-full text-xl font-bold shadow-lg transform active:scale-95 transition">
            CONTINUE
        </button>
    `;

    // Logic
    const btns = section.querySelectorAll('.emoji-btn');
    const preview = section.querySelector('#preview-p1');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            selected = btn.dataset.emoji;
            preview.textContent = selected;
            // Highlight
            btns.forEach(b => b.classList.remove('bg-white/20', 'ring-2', 'ring-primary'));
            btn.classList.add('bg-white/20', 'ring-2', 'ring-primary');
        });
    });

    section.querySelector('#confirm-btn').addEventListener('click', () => {
        store.setEmoji(selected, '⭕');
        navigate('mode-select');
    });

    return section;
}
