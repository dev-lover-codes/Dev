import { navigate } from '../main.js';
import { store } from '../store.js';
import { AI } from '../ai.js';
import { DB } from '../database.js';

export function renderGame() {
    const { mode, level, currentStage, playerEmoji, opponentEmoji, onlineGameId, onlineRole } = store.state;

    // Game State
    let board = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let turn = 'player'; // 'player' or 'ai' for offline, 'X' or 'O' for online
    let moveCount = 0; // Tracks player moves
    const isOffline = mode === 'offline';
    let unsubscribe = null; // For online game subscription

    const section = document.createElement('section');
    section.className = "flex flex-col items-center justify-center w-full h-full relative p-4";

    // Setup HTML
    section.innerHTML = `
        <div class="absolute top-4 left-4 text-gray-400 font-bold text-sm tracking-widest">
            ${isOffline ? `LEVEL ${level} • STAGE ${currentStage}` : 'ONLINE MATCH'}
        </div>

        <button id="menu-btn" class="absolute top-4 right-4 text-gray-400 hover:text-white transition">
            <i class="fa-solid fa-bars text-xl"></i>
        </button>

        <!-- Score / Player Info -->
        <div class="flex justify-between w-full max-w-md mb-8 items-center">
            <div id="p1-card" class="glass-panel p-4 rounded-xl flex flex-col items-center border-b-4 border-primary transition-all duration-300 transform scale-110 shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                <span class="text-4xl mb-2">${playerEmoji}</span>
                <span class="text-xs font-bold text-gray-300">YOU</span>
            </div>
            <div class="text-2xl font-bold text-gray-600">VS</div>
            <div id="p2-card" class="glass-panel p-4 rounded-xl flex flex-col items-center border-b-4 border-transparent opacity-60 transition-all duration-300">
                <span class="text-4xl mb-2">${opponentEmoji}</span>
                <span class="text-xs font-bold text-gray-300">${isOffline ? 'AI' : 'OPPONENT'}</span>
            </div>
        </div>

        <!-- Board -->
        <div id="board" class="game-grid bg-white/5 p-4 rounded-2xl glass-panel relative">
            <div class="winning-line-svg absolute inset-0 pointer-events-none z-10"></div>
            ${board.map((_, i) => `
                <div class="tile text-white hover:bg-white/10" data-index="${i}"></div>
            `).join('')}
        </div>

        <div id="status-msg" class="mt-8 text-xl text-gray-300 min-h-[30px] font-light">
            ${isOffline ? 'Your Turn' : 'Waiting...'}
        </div>

        <!-- Modal (Winner) -->
        <div id="result-modal" class="hidden absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div class="bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
                <h2 id="modal-title" class="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">VICTORY</h2>
                <div id="star-container" class="flex gap-2 text-4xl my-6 min-h-[40px]">
                    <!-- Stars injected here -->
                </div>
                <div class="grid grid-cols-2 gap-3 w-full">
                    <button id="retry-btn" class="glass-panel py-3 rounded-lg hover:bg-white/10 transition">RETRY</button>
                    <button id="next-stage-btn" class="bg-gradient-to-r from-primary to-secondary py-3 rounded-lg hover:opacity-90 transition font-bold text-white">NEXT <i class="fa-solid fa-chevron-right text-xs"></i></button>
                </div>
                <button id="modal-menu-btn" class="mt-4 text-sm text-gray-500 hover:text-white">Back to Menu</button>
            </div>
        </div>
    `;

    // Bind DOM
    const tiles = section.querySelectorAll('.tile');
    const p1Card = section.querySelector('#p1-card');
    const p2Card = section.querySelector('#p2-card');
    const statusMsg = section.querySelector('#status-msg');
    const modal = section.querySelector('#result-modal');
    const starContainer = section.querySelector('#star-container');
    const nextBtn = section.querySelector('#next-stage-btn');

    // Menu Logic
    section.querySelector('#menu-btn').addEventListener('click', () => {
        if (confirm('Quit to menu?')) {
            if (unsubscribe) unsubscribe();
            navigate(isOffline ? 'offline-stages' : 'online-lobby');
        }
    });
    section.querySelector('#modal-menu-btn').addEventListener('click', () => {
        if (unsubscribe) unsubscribe();
        navigate(isOffline ? 'offline-stages' : 'online-lobby');
    });
    section.querySelector('#retry-btn').addEventListener('click', () => {
        if (unsubscribe) unsubscribe();
        navigate('game');
    });
    nextBtn.addEventListener('click', () => {
        if (unsubscribe) unsubscribe();
        store.setStage(currentStage + 1);
        navigate('game');
    });

    // Helper: Update UI Turns
    function updateTurnUI() {
        if (isOffline) {
            if (turn === 'player') {
                p1Card.classList.add('scale-110', 'opacity-100', 'border-primary', 'shadow-[0_0_20px_rgba(99,102,241,0.5)]');
                p1Card.classList.remove('opacity-60', 'border-transparent', 'shadow-none');
                p2Card.classList.remove('scale-110', 'opacity-100', 'border-red-500', 'shadow-[0_0_20px_rgba(239,68,68,0.5)]');
                p2Card.classList.add('opacity-60', 'border-transparent', 'shadow-none');
                statusMsg.textContent = "Your Turn";
            } else {
                p2Card.classList.add('scale-110', 'opacity-100', 'border-red-500', 'shadow-[0_0_20px_rgba(239,68,68,0.5)]');
                p2Card.classList.remove('opacity-60', 'border-transparent', 'shadow-none');
                p1Card.classList.remove('scale-110', 'opacity-100', 'border-primary', 'shadow-[0_0_20px_rgba(99,102,241,0.5)]');
                p1Card.classList.add('opacity-60', 'border-transparent', 'shadow-none');
                statusMsg.textContent = "AI Thinking...";
            }
        } else {
            // Online mode
            const isMyTurn = turn === onlineRole;
            if (isMyTurn) {
                p1Card.classList.add('scale-110', 'opacity-100', 'border-primary', 'shadow-[0_0_20px_rgba(99,102,241,0.5)]');
                p1Card.classList.remove('opacity-60', 'border-transparent', 'shadow-none');
                p2Card.classList.remove('scale-110', 'opacity-100', 'border-red-500', 'shadow-[0_0_20px_rgba(239,68,68,0.5)]');
                p2Card.classList.add('opacity-60', 'border-transparent', 'shadow-none');
                statusMsg.textContent = "Your Turn";
            } else {
                p2Card.classList.add('scale-110', 'opacity-100', 'border-red-500', 'shadow-[0_0_20px_rgba(239,68,68,0.5)]');
                p2Card.classList.remove('opacity-60', 'border-transparent', 'shadow-none');
                p1Card.classList.remove('scale-110', 'opacity-100', 'border-primary', 'shadow-[0_0_20px_rgba(99,102,241,0.5)]');
                p1Card.classList.add('opacity-60', 'border-transparent', 'shadow-none');
                statusMsg.textContent = "Opponent's Turn...";
            }
        }
    }

    // AI Logic Wrapper
    async function makeAIMove() {
        if (!gameActive) return;

        await new Promise(r => setTimeout(r, 600));

        const moveIdx = AI.getBestMove(board, opponentEmoji, playerEmoji, level, currentStage);

        if (moveIdx !== null && moveIdx !== undefined) {
            executeMove(moveIdx, 'ai');
        }
    }

    // Main Move Execution
    function executeMove(index, who) {
        if (board[index] !== '' || !gameActive) return;

        // Update State
        board[index] = (who === 'player') ? playerEmoji : opponentEmoji;
        tiles[index].textContent = board[index];
        tiles[index].classList.add(who === 'player' ? 'text-primary' : 'text-purple-400');
        tiles[index].style.animation = "bounce 0.5s";

        if (who === 'player') moveCount++;

        // Check Win
        if (checkGameEnd(who)) return;

        // Switch Turn
        turn = (who === 'player') ? 'ai' : 'player';
        updateTurnUI();

        if (isOffline && turn === 'ai') {
            makeAIMove();
        }
    }

    // Online Move Execution
    function executeMoveOnline(index) {
        if (board[index] !== '' || !gameActive) return;
        if (turn !== onlineRole) return; // Not my turn

        const symbol = onlineRole === 'X' ? playerEmoji : opponentEmoji;
        board[index] = symbol;
        tiles[index].textContent = symbol;
        tiles[index].classList.add(onlineRole === 'X' ? 'text-primary' : 'text-purple-400');
        tiles[index].style.animation = "bounce 0.5s";

        // Update DB
        const newTurn = turn === 'X' ? 'O' : 'X';
        DB.updateGame(onlineGameId, { board, turn: newTurn });

        // Check Win
        if (checkGameEndOnline()) return;

        turn = newTurn;
        updateTurnUI();
    }

    // Draw Winning Line Animation
    function drawWinningLine(winningCombo) {
        const lineContainer = section.querySelector('.winning-line-svg');
        lineContainer.innerHTML = '';

        // Get tile positions
        const boardRect = section.querySelector('#board').getBoundingClientRect();
        const tileRects = Array.from(tiles).map(tile => tile.getBoundingClientRect());

        // Calculate start and end points (center of tiles)
        const startTile = tileRects[winningCombo[0]];
        const endTile = tileRects[winningCombo[2]];

        const startX = startTile.left - boardRect.left + startTile.width / 2;
        const startY = startTile.top - boardRect.top + startTile.height / 2;
        const endX = endTile.left - boardRect.left + endTile.width / 2;
        const endY = endTile.top - boardRect.top + endTile.height / 2;

        // Create SVG
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', boardRect.width);
        svg.setAttribute('height', boardRect.height);
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';

        // Create line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', startX);
        line.setAttribute('y1', startY);
        line.setAttribute('x2', startX); // Start at same point
        line.setAttribute('y2', startY);
        line.setAttribute('stroke', '#ef4444'); // Red color
        line.setAttribute('stroke-width', '8');
        line.setAttribute('stroke-linecap', 'round');
        line.style.filter = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))';

        svg.appendChild(line);
        lineContainer.appendChild(svg);

        // Animate line drawing
        setTimeout(() => {
            line.style.transition = 'x2 0.6s ease-out, y2 0.6s ease-out';
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
        }, 100);

        // Highlight winning tiles
        winningCombo.forEach(idx => {
            tiles[idx].classList.add('winning');
        });
    }

    // Get Winning Combination
    function getWinningCombo(symbol) {
        const combos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]           // Diagonals
        ];

        for (let combo of combos) {
            if (combo.every(idx => board[idx] === symbol)) {
                return combo;
            }
        }
        return null;
    }

    // Win Check logic (Offline)
    function checkGameEnd(who) {
        const symbol = (who === 'player') ? playerEmoji : opponentEmoji;
        const winningCombo = getWinningCombo(symbol);

        if (winningCombo) {
            drawWinningLine(winningCombo);
            setTimeout(() => {
                endGame(who === 'player' ? 'win' : 'lose');
            }, 800);
            return true;
        }

        if (board.every(cell => cell !== '')) {
            endGame('draw');
            return true;
        }
        return false;
    }

    // Win Check (Online)
    function checkGameEndOnline() {
        const mySymbol = onlineRole === 'X' ? playerEmoji : opponentEmoji;
        const oppSymbol = onlineRole === 'X' ? opponentEmoji : playerEmoji;

        const myWinCombo = getWinningCombo(mySymbol);
        if (myWinCombo) {
            drawWinningLine(myWinCombo);
            setTimeout(() => {
                endGameOnline('win');
            }, 800);
            return true;
        }

        const oppWinCombo = getWinningCombo(oppSymbol);
        if (oppWinCombo) {
            drawWinningLine(oppWinCombo);
            setTimeout(() => {
                endGameOnline('lose');
            }, 800);
            return true;
        }

        if (board.every(cell => cell !== '')) {
            endGameOnline('draw');
            return true;
        }
        return false;
    }

    // End Game Handler (Offline)
    function endGame(result) {
        gameActive = false;

        setTimeout(() => {
            modal.classList.remove('hidden');
            const title = modal.querySelector('#modal-title');

            if (result === 'win') {
                title.textContent = "VICTORY!";
                title.className = "text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500";

                const stars = store.completeStage(level, currentStage, moveCount);
                renderStars(stars);

                if (currentStage < 15) {
                    nextBtn.style.display = 'block';
                } else {
                    nextBtn.style.display = 'none';
                    title.textContent = "LEVEL COMPLETE!";
                }
            } else if (result === 'lose') {
                title.textContent = "DEFEAT";
                title.className = "text-4xl font-bold mb-2 text-red-500";
                renderStars(0);
                nextBtn.style.display = 'none';
            } else {
                title.textContent = "DRAW";
                title.className = "text-4xl font-bold mb-2 text-gray-300";
                renderStars(0);
                nextBtn.style.display = 'none';
            }
        }, 500);
    }

    // End Game Handler (Online)
    function endGameOnline(result) {
        gameActive = false;

        setTimeout(() => {
            modal.classList.remove('hidden');
            const title = modal.querySelector('#modal-title');
            nextBtn.style.display = 'none';

            if (result === 'win') {
                title.textContent = "VICTORY!";
                title.className = "text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500";
                renderStars(3);
            } else if (result === 'lose') {
                title.textContent = "DEFEAT";
                title.className = "text-4xl font-bold mb-2 text-red-500";
                renderStars(0);
            } else {
                title.textContent = "DRAW";
                title.className = "text-4xl font-bold mb-2 text-gray-300";
                renderStars(0);
            }
        }, 500);
    }

    function renderStars(count) {
        starContainer.innerHTML = '';
        for (let i = 1; i <= 3; i++) {
            const star = document.createElement('i');
            star.className = `fa-solid fa-star transition-all duration-500 transform scale-0 ${i <= count ? 'text-yellow-400' : 'text-gray-700'}`;
            starContainer.appendChild(star);

            setTimeout(() => {
                star.classList.remove('scale-0');
                star.classList.add('scale-100');
            }, i * 200);
        }
    }

    // Event Listeners for Board
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const idx = parseInt(tile.dataset.index);
            if (isOffline) {
                if (turn === 'player') executeMove(idx, 'player');
            } else {
                executeMoveOnline(idx);
            }
        });
    });

    // Initialize
    if (isOffline) {
        updateTurnUI();

        // Level 3, Stage 15: AI goes first
        if (level === 3 && currentStage === 15) {
            turn = 'ai';
            updateTurnUI();
            makeAIMove();
        }
    } else {
        // Online Mode: Subscribe to game updates
        const game = DB.getGame(onlineGameId);
        if (game) {
            board = game.board;
            turn = game.turn;

            // Render existing board
            board.forEach((cell, idx) => {
                if (cell) {
                    tiles[idx].textContent = cell;
                    tiles[idx].classList.add(cell === playerEmoji ? 'text-primary' : 'text-purple-400');
                }
            });

            // Check if waiting for opponent
            if (game.status === 'waiting') {
                statusMsg.textContent = 'Waiting for opponent...';
                gameActive = false;
            } else {
                updateTurnUI();
            }

            // Subscribe to changes
            unsubscribe = DB.subscribeToGame(onlineGameId, (updatedGame) => {
                // Determine if game just started
                if (updatedGame.status === 'playing' && !gameActive) {
                    gameActive = true;
                    statusMsg.textContent = 'Game Started!';
                    // Force refresh visuals
                    if (onlineRole === 'O') {
                        // Joiner (O) might have missed the initial 'X' turn status
                        updateTurnUI();
                    }
                }

                // VALIDATE: Only accept arrays
                if (Array.isArray(updatedGame.board)) {
                    board = updatedGame.board;
                } else if (typeof updatedGame.board === 'object') {
                    // Fallback fix if it comes as object
                    board = Object.values(updatedGame.board);
                }

                turn = updatedGame.turn;

                // Render Board (Only allow valid symbols)
                board.forEach((cell, idx) => {
                    const isValidSymbol = (cell === 'X' || cell === 'O' || cell === playerEmoji || cell === opponentEmoji);
                    if (isValidSymbol) {
                        // Map standard X/O to Emojis if needed
                        let displayChar = cell;
                        if (cell === 'X') displayChar = (onlineRole === 'X') ? playerEmoji : opponentEmoji;
                        if (cell === 'O') displayChar = (onlineRole === 'O') ? playerEmoji : opponentEmoji;

                        // Or if we area already receiving emojis (depending on logic) -> just use cell
                        // But easier: The DB stores Emojis directly in our current logic.
                        // Let's just trust valid cells.

                        if (tiles[idx].textContent !== cell) {
                            tiles[idx].textContent = cell;
                            tiles[idx].classList.add(cell === playerEmoji ? 'text-primary' : 'text-purple-400');
                            tiles[idx].style.animation = "bounce 0.5s";
                        }
                    }
                });

                updateTurnUI();

                // Check game end
                if (gameActive) checkGameEndOnline();
            });
        }
    }

    return section;
}
