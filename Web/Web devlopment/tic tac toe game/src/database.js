
// PeerJS Implementation for Serverless Multiplayer
// This replaces Supabase with Direct P2P (WebRTC) connections

let peer = null;
let conn = null;
let listeners = [];
let gameState = {
    id: null,
    board: Array(9).fill(''),
    turn: 'X',
    status: 'waiting',
    players: {}
};

// Helper: Notify all listeners of state change
function notifyListeners() {
    listeners.forEach(cb => cb({ ...gameState }));
}

// Helper: Handle incoming data
function handleData(data) {
    console.log("Received P2P Data:", data);

    if (data.type === 'game_update') {
        // SANITIZE: Ensure board is an array, not an object
        let newBoard = data.state.board;
        if (newBoard && !Array.isArray(newBoard) && typeof newBoard === 'object') {
            // Convert object {0: 'X', 1: ''} back to array if corrupted
            newBoard = Object.values(newBoard);
        }

        // Update local state with remote data
        gameState = {
            ...gameState,
            ...data.state,
            board: newBoard || gameState.board // Protect board integrity
        };

        notifyListeners();
    }
}

export const DB = {
    // HOST: Create a new game room
    async createGame(playerId, playerEmoji) {
        // Cleanup existing peer
        if (peer) {
            peer.destroy();
            peer = null;
        }

        // 1. Generate clean ID
        const gameId = 'ttt-' + Math.random().toString(36).substr(2, 6);

        gameState = {
            id: gameId,
            board: Array(9).fill(''),
            turn: 'X',
            status: 'waiting',
            host: playerId
        };

        return new Promise((resolve, reject) => {
            try {
                // 2. Initialize Peer (Host)
                // Use window.Peer to ensure we're accessing the global object from the CDN
                if (!window.Peer) {
                    reject({ message: "PeerJS library not loaded. Check internet connection." });
                    return;
                }

                peer = new window.Peer(gameId, {
                    debug: 2
                });

                // Set a timeout of 10 seconds
                const timeout = setTimeout(() => {
                    if (peer) peer.destroy();
                    reject({ message: "Connection timed out. PeerJS server is not responding." });
                }, 10000);

                peer.on('open', (id) => {
                    clearTimeout(timeout);
                    console.log('Host initialized with ID:', id);
                    resolve({ data: gameState });
                });

                peer.on('error', (err) => {
                    clearTimeout(timeout);
                    console.error('PeerJS Error:', err);
                    reject({ message: "Network error: " + err.type });
                });

                // 3. Listen for connections
                peer.on('connection', (c) => {
                    console.log('Opponent connected!');
                    conn = c;
                    gameState.status = 'playing';

                    // Send initial state to joiner
                    conn.on('open', () => {
                        conn.send({ type: 'game_update', state: gameState });
                    });

                    // Listen for moves from joiner
                    conn.on('data', handleData);

                    // Update local UI
                    notifyListeners();
                });
            } catch (e) {
                reject({ message: "Unexpected error: " + e.message });
            }
        });
    },

    // CLIENT: Join an existing game
    async joinGame(gameId, playerId, playerEmoji) {
        // 1. Initialize Peer (Client gets random ID)
        peer = new Peer();

        return new Promise((resolve) => {
            peer.on('open', () => {
                // 2. Connect to Host
                conn = peer.connect(gameId);

                conn.on('open', () => {
                    console.log("Connected to Host!");
                    gameState.id = gameId;
                    gameState.status = 'playing';

                    // Listen for updates from Host
                    conn.on('data', handleData);

                    resolve({ data: gameState });
                });

                conn.on('error', (err) => {
                    console.error("Connection Error:", err);
                    resolve({ error: { message: "Could not connect to game. Check ID." } });
                });

                // Timeout fallback
                setTimeout(() => {
                    if (!conn || !conn.open) {
                        resolve({ error: { message: "Connection timed out. Host may be offline." } });
                    }
                }, 5000);
            });
        });
    },

    // BOTH: Send Move/Update
    async updateGame(gameId, updates) {
        // Update local state
        gameState = { ...gameState, ...updates };

        // Send to remote peer
        if (conn && conn.open) {
            conn.send({ type: 'game_update', state: gameState });
        }

        // Update local UI immediately
        notifyListeners();
        return { error: null };
    },

    // Get current local state
    getGame(gameId) {
        if (gameState.id === gameId) return gameState;
        return null;
    },

    // Subscribe to changes
    subscribeToGame(gameId, callback) {
        listeners.push(callback);
        // Clean up function
        return () => {
            listeners = listeners.filter(cb => cb !== callback);
        };
    },

    // Mock Auth (Not needed for P2P really)
    async signUp(email, password) {
        return { data: { user: { id: email.split('@')[0], email } } };
    },

    async signIn(email, password) {
        return { data: { user: { id: email.split('@')[0], email } } };
    }
};
