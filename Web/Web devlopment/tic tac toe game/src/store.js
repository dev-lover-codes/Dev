// Simple State Management
export const store = {
    state: {
        playerEmoji: '❌',
        opponentEmoji: '⭕',
        mode: 'offline', // 'offline' or 'online'
        level: 1, // 1: Easy, 2: Normal, 3: Impossible
        currentStage: 1, // 1-15
        maxUnlockedStage: {
            1: 1, // Level 1: Stage 1 unlocked
            2: 1,
            3: 1
        },
        stars: {}, // key: "level-stage" -> value: 1, 2, 3
        onlineUser: null,
        onlineGameId: null,
    },
    
    // Listeners for state changes (simple reactive system)
    listeners: [],
    
    subscribe(callback) {
        this.listeners.push(callback);
    },
    
    notify() {
        this.listeners.forEach(cb => cb(this.state));
    },

    setEmoji(player, opponent) {
        this.state.playerEmoji = player;
        this.state.opponentEmoji = opponent;
        this.notify();
    },

    setMode(mode) {
        this.state.mode = mode;
        this.notify();
    },

    setLevel(level) {
        this.state.level = level;
        this.notify();
    },

    setStage(stage) {
        this.state.currentStage = stage;
        this.notify();
    },

    completeStage(level, stage, moveCount) {
        debugger; // For debugging
        // Advance logic
        const key = `${level}-${stage}`;
        
        // Calculate Stars
        let starCount = 0;
        if (moveCount <= 3) starCount = 3;
        else if (moveCount <= 4) starCount = 2;
        else starCount = 1;

        // Save Stars if better
        if (!this.state.stars[key] || this.state.stars[key] < starCount) {
            this.state.stars[key] = starCount;
        }

        // Unlock next stage
        if (stage < 15) {
            if (this.state.maxUnlockedStage[level] <= stage) {
                this.state.maxUnlockedStage[level] = stage + 1;
            }
        } 
        // Unlock next Level if all 15 done? (Optional Logic)
        
        this.save();
        this.notify();
        return starCount;
    },
    
    save() {
        localStorage.setItem('tictactoe_state', JSON.stringify(this.state));
    },

    load() {
        const saved = localStorage.getItem('tictactoe_state');
        if (saved) {
            this.state = { ...this.state, ...JSON.parse(saved) };
        }
    }
};

store.load();
