export const AI = {
    // 0-8 index
    winningCombos: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]           // Diagonals
    ],

    checkWin(board, player) {
        return this.winningCombos.some(combo => {
            return combo.every(i => board[i] === player);
        });
    },

    getEmptyIndices(board) {
        return board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    },

    // Main AI function
    getBestMove(board, aiSymbol, userSymbol, level, stage) {
        const emptySpots = this.getEmptyIndices(board);
        if (emptySpots.length === 0) return null;

        // Level 1: Random (Easy)
        if (level === 1) {
            // Stage 1-5: Completely random
            // Stage 6-15: 20% chance to block? Nah, keep it easy as requested.
            const randIdx = Math.floor(Math.random() * emptySpots.length);
            return emptySpots[randIdx];
        }

        // Level 2: Normal (Block obvious wins, else random)
        if (level === 2) {
            // 1. Can AI win now?
            let winMove = this.findWinningMove(board, aiSymbol);
            if (winMove !== null) return winMove;

            // 2. Must AI block user?
            let blockMove = this.findWinningMove(board, userSymbol);
            if (blockMove !== null) return blockMove;

            // 3. Else random
            const randIdx = Math.floor(Math.random() * emptySpots.length);
            return emptySpots[randIdx];
        }

        // Level 3: Impossible (Minimax)
        if (level === 3) {
            // Minimax
            // If it's the very first move of the game and board is empty, take center or corner to save calculation time
            if (emptySpots.length === 9) return 4; // Center
            if (emptySpots.length === 8 && board[4] === '') return 4; // If user didn't take center, take it.

            // Stage 15 specific hard-code? Minimax is enough to ensure "User cannot win".
            // If user plays perfect, it's a draw. Minimax ensures this.
            return this.minimax(board, aiSymbol, userSymbol, aiSymbol).index;
        }

        return emptySpots[0]; // Fallback
    },

    findWinningMove(board, player) {
        const emptySpots = this.getEmptyIndices(board);
        for (let idx of emptySpots) {
            let tempBoard = [...board];
            tempBoard[idx] = player;
            if (this.checkWin(tempBoard, player)) {
                return idx;
            }
        }
        return null;
    },

    // Minimax Algorithm
    minimax(board, aiSymbol, userSymbol, currentPlayer) {
        const availSpots = this.getEmptyIndices(board);

        if (this.checkWin(board, userSymbol)) {
            return { score: -10 };
        } else if (this.checkWin(board, aiSymbol)) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];

        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];

            // Set board state for this move
            board[availSpots[i]] = currentPlayer;

            if (currentPlayer === aiSymbol) {
                const result = this.minimax(board, aiSymbol, userSymbol, userSymbol);
                move.score = result.score;
            } else {
                const result = this.minimax(board, aiSymbol, userSymbol, aiSymbol);
                move.score = result.score;
            }

            // Reset board
            board[availSpots[i]] = '';
            moves.push(move);
        }

        let bestMove;
        if (currentPlayer === aiSymbol) {
            // Maximize
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            // Minimize
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }
};
