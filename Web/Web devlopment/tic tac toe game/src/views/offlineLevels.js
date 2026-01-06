import { navigate } from '../main.js';
import { store } from '../store.js';

export function renderOfflineLevels() {
    const section = document.createElement('section');
    section.className = "flex flex-col gap-6 items-center justify-center w-full h-full animate-slide-in p-4";

    // Determine Unlocked Levels
    // Level 1 always unlocked. 
    // Level 2 unlocked if Level 1 Stage 15 is done (stars marked).
    const isLvl1Done = (store.state.stars['1-15'] !== undefined);
    const isLvl2Done = (store.state.stars['2-15'] !== undefined);

    const levels = [
        { id: 1, name: "Easy Peasy", desc: "For Beginners", locked: false, color: "from-green-500 to-emerald-700" },
        { id: 2, name: "Normal", desc: "Getting Smarter", locked: !isLvl1Done, color: "from-yellow-500 to-orange-700" },
        { id: 3, name: "IMPOSSIBLE", desc: "You Will Lose", locked: !isLvl2Done, color: "from-red-600 to-rose-900" }
    ];

    section.innerHTML = `
        <h2 class="text-3xl font-bold mb-6">Select Difficulty</h2>
        <div class="flex flex-col gap-4 w-full max-w-md">
            ${levels.map(lvl => `
                <button class="level-btn relative w-full h-24 glass-panel rounded-xl overflow-hidden transition transform hover:scale-105 ${lvl.locked ? 'opacity-50 cursor-not-allowed grayscale' : ''}" 
                        data-id="${lvl.id}" ${lvl.locked ? 'disabled' : ''}>
                    <div class="absolute inset-0 bg-gradient-to-r ${lvl.color} opacity-30"></div>
                    <div class="flex items-center justify-between px-6 h-full relative z-10">
                        <div class="text-left">
                            <h3 class="text-2xl font-bold text-white">${lvl.name}</h3>
                            <p class="text-sm text-gray-300">${lvl.desc}</p>
                        </div>
                        ${lvl.locked ? '<i class="fa-solid fa-lock text-2xl"></i>' : '<i class="fa-solid fa-chevron-right text-2xl"></i>'}
                    </div>
                </button>
            `).join('')}
        </div>
        <button id="back-btn" class="mt-8 text-gray-500 hover:text-white transition">Back</button>
    `;

    section.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                store.setLevel(parseInt(btn.dataset.id));
                navigate('offline-stages');
            }
        });
    });

    section.querySelector('#back-btn').addEventListener('click', () => navigate('mode-select'));

    return section;
}
