import { navigate } from '../main.js';
import { store } from '../store.js';

export function renderOfflineStages() {
    const level = store.state.level;
    const maxStage = store.state.maxUnlockedStage[level] || 1;

    const section = document.createElement('section');
    section.className = "flex flex-col items-center justify-center w-full h-full p-4 animate-fade-in";

    const stages = Array.from({ length: 15 }, (_, i) => i + 1);

    section.innerHTML = `
        <div class="w-full max-w-2xl text-center mb-6">
            <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Level ${level} - Stages
            </h2>
            <p class="text-gray-400 text-sm">Win to unlock next stage</p>
        </div>

        <div class="grid grid-cols-3 md:grid-cols-5 gap-3 w-full max-w-3xl overflow-y-auto max-h-[70vh] p-2">
            ${stages.map((stage) => {
        const locked = stage > maxStage;
        const stars = store.state.stars[`${level}-${stage}`] || 0;

        // Star HTML
        let starHtml = '';
        if (!locked && stars > 0) {
            starHtml = `
                        <div class="flex gap-1 text-[10px] mt-1 text-yellow-400">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid ${stars >= 2 ? 'fa-star' : 'fa-star text-gray-600'}"></i>
                            <i class="fa-solid ${stars >= 3 ? 'fa-star' : 'fa-star text-gray-600'}"></i>
                        </div>
                    `;
        }

        return `
                <button class="stage-btn relative glass-panel aspect-square rounded-xl flex flex-col items-center justify-center transition transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed group"
                    data-stage="${stage}" ${locked ? 'disabled' : ''}>
                    
                    ${locked ?
                '<i class="fa-solid fa-lock text-2xl text-gray-500"></i>' :
                `<span class="text-2xl font-bold ${stars > 0 ? 'text-white' : 'text-gray-300'}">${stage}</span>`
            }
                    ${starHtml}
                    
                    ${!locked && stars === 0 ? '<div class="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-xl transition"></div>' : ''}
                </button>
                `;
    }).join('')}
        </div>

        <button id="back-btn" class="mt-8 px-8 py-2 glass-panel rounded-full hover:bg-white/10 transition">Back to Levels</button>
    `;

    section.querySelectorAll('.stage-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.disabled) {
                store.setStage(parseInt(btn.dataset.stage));
                navigate('game');
            }
        });
    });

    section.querySelector('#back-btn').addEventListener('click', () => navigate('offline-levels'));

    return section;
}
