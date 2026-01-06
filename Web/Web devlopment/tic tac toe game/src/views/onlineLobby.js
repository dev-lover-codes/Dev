import { navigate } from '../main.js';
import { store } from '../store.js';
import { DB } from '../database.js';

export function renderOnlineLobby() {
    const section = document.createElement('section');
    section.className = "flex flex-col items-center justify-center w-full h-full p-4 animate-slide-in";

    section.innerHTML = `
        <h2 class="text-3xl font-bold mb-8">Game Lobby</h2>
        
        <div class="flex flex-col gap-4 w-full max-w-sm">
            <button id="create-btn" class="glass-panel p-6 rounded-xl text-left hover:border-primary transition group">
                <h3 class="text-xl font-bold mb-1">Create Match</h3>
                <p class="text-gray-400 text-sm group-hover:text-white">Host a new game and share QR code.</p>
            </button>

            <div class="glass-panel p-6 rounded-xl text-left">
                <h3 class="text-xl font-bold mb-4">Join Match</h3>
                <div class="flex flex-col gap-3">
                    <input id="game-id-input" type="text" placeholder="Paste Game ID here" class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500">
                    <button id="join-btn" class="bg-gradient-to-r from-primary to-secondary px-4 py-3 rounded-lg font-bold hover:opacity-90 w-full text-white">
                        <i class="fa-solid fa-right-to-bracket"></i> JOIN GAME
                    </button>
                    <div class="text-center text-gray-500 text-sm">OR</div>
                    <button id="scan-btn" class="glass-panel px-4 py-3 rounded-lg font-bold hover:bg-white/10 w-full flex items-center justify-center gap-2">
                        <i class="fa-solid fa-qrcode"></i> SCAN QR CODE
                    </button>
                </div>
            </div>
        </div>

        <button id="back-btn" class="mt-8 text-gray-400 hover:text-white">
            <i class="fa-solid fa-arrow-left"></i> Back
        </button>

        <!-- QR Code Modal -->
        <div id="qr-modal" class="hidden fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div class="bg-[#1e293b] p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center max-w-md w-full mx-4 text-center">
                <h2 class="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Share This QR Code</h2>
                <p class="text-gray-400 mb-6">Ask your friend to scan this code to join</p>
                
                <!-- QR Code Container -->
                <div id="qrcode" class="bg-white p-4 rounded-xl mb-4"></div>
                
                <!-- Game ID Display -->
                <div class="glass-panel p-4 rounded-lg w-full mb-4">
                    <p class="text-xs text-gray-400 mb-1">Game ID</p>
                    <p id="game-id-display" class="text-sm font-mono font-bold break-all select-all"></p>
                </div>

                <div class="flex gap-3 w-full">
                    <button id="copy-id-btn" class="flex-1 glass-panel py-3 rounded-lg hover:bg-white/10 transition">
                        <i class="fa-solid fa-copy"></i> COPY ID
                    </button>
                    <button id="start-game-btn" class="flex-1 bg-gradient-to-r from-primary to-secondary py-3 rounded-lg hover:opacity-90 transition font-bold text-white">
                        START GAME
                    </button>
                </div>
                
                <button id="close-qr-btn" class="mt-4 text-sm text-gray-500 hover:text-white">Close</button>
            </div>
        </div>

        <!-- QR Scanner Modal -->
        <div id="scanner-modal" class="hidden fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
            <div class="bg-[#1e293b] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center max-w-lg w-full mx-4 text-center">
                <h2 class="text-2xl font-bold mb-4">Scan QR Code</h2>
                <p class="text-gray-400 mb-4 text-sm">Point your camera at the QR code</p>
                
                <!-- Camera Scanner -->
                <div id="qr-reader" class="w-full rounded-xl overflow-hidden mb-4"></div>
                
                <div id="scan-result" class="hidden glass-panel p-4 rounded-lg w-full mb-4">
                    <p class="text-xs text-gray-400 mb-1">Detected Game ID</p>
                    <p id="scanned-id" class="text-sm font-mono font-bold break-all"></p>
                </div>

                <p class="text-sm text-gray-400 mb-4">Or enter the Game ID manually in the lobby</p>
                
                <button id="close-scanner-btn" class="glass-panel px-6 py-2 rounded-lg hover:bg-white/10">
                    <i class="fa-solid fa-times"></i> Close Scanner
                </button>
            </div>
        </div>
    `;

    const qrModal = section.querySelector('#qr-modal');
    const scannerModal = section.querySelector('#scanner-modal');
    const qrcodeContainer = section.querySelector('#qrcode');
    const gameIdDisplay = section.querySelector('#game-id-display');
    const gameIdInput = section.querySelector('#game-id-input');
    const scanResult = section.querySelector('#scan-result');
    const scannedId = section.querySelector('#scanned-id');

    let html5QrCode = null;

    section.querySelector('#back-btn').addEventListener('click', () => navigate('mode-select'));

    // CREATE GAME
    section.querySelector('#create-btn').addEventListener('click', async () => {
        try {
            const { data } = await DB.createGame(store.state.onlineUser.id, store.state.playerEmoji);
            store.state.onlineGameId = data.id;
            store.state.onlineRole = 'X';

            qrModal.classList.remove('hidden');
            gameIdDisplay.textContent = data.id;

            qrcodeContainer.innerHTML = '';

            // Generate QR Code with full URL including game ID
            const joinUrl = `${window.location.origin}${window.location.pathname}?join=${data.id}`;

            new QRCode(qrcodeContainer, {
                text: joinUrl,
                width: 200,
                height: 200,
                colorDark: "#0f172a",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (err) {
            alert("Error creating game: " + err.message);
        }
    });

    // JOIN GAME (Manual Entry)
    async function joinGame(gameId) {
        if (!gameId || gameId.trim() === '') {
            alert('❌ Please enter a valid Game ID');
            return;
        }

        const trimmedId = gameId.trim();

        const { data, error } = await DB.joinGame(trimmedId, store.state.onlineUser.id, store.state.playerEmoji);
        if (error) {
            alert(`❌ ${error.message}`);
            return;
        }

        store.state.onlineGameId = trimmedId;
        store.state.onlineRole = 'O';
        navigate('game');
    }

    section.querySelector('#join-btn').addEventListener('click', () => {
        joinGame(gameIdInput.value);
    });

    // Allow Enter key to join
    gameIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            joinGame(gameIdInput.value);
        }
    });

    // SCAN QR CODE
    section.querySelector('#scan-btn').addEventListener('click', () => {
        scannerModal.classList.remove('hidden');
        scanResult.classList.add('hidden');

        // Initialize scanner
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("qr-reader");
        }

        const qrCodeSuccessCallback = (decodedText, decodedResult) => {
            console.log(`QR Code detected: ${decodedText}`);

            // Extract game ID from URL
            let extractedGameId = decodedText;

            // If it's a URL with ?join= parameter
            if (decodedText.includes('?join=')) {
                const url = new URL(decodedText);
                extractedGameId = url.searchParams.get('join');
            }

            // Show result
            scannedId.textContent = extractedGameId;
            scanResult.classList.remove('hidden');

            // Stop scanner
            html5QrCode.stop().then(() => {
                // Auto-join after 1 second
                setTimeout(() => {
                    scannerModal.classList.add('hidden');
                    gameIdInput.value = extractedGameId;
                    joinGame(extractedGameId);
                }, 1000);
            });
        };

        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        // Start scanning
        html5QrCode.start(
            { facingMode: "environment" }, // Use back camera
            config,
            qrCodeSuccessCallback
        ).catch(err => {
            console.error("Camera error:", err);
            alert("❌ Camera access denied or not available. Please enter Game ID manually.");
            scannerModal.classList.add('hidden');
        });
    });

    // CLOSE SCANNER
    section.querySelector('#close-scanner-btn').addEventListener('click', () => {
        if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode.stop().then(() => {
                scannerModal.classList.add('hidden');
            }).catch(err => {
                console.error("Error stopping scanner:", err);
                scannerModal.classList.add('hidden');
            });
        } else {
            scannerModal.classList.add('hidden');
        }
    });

    // COPY ID
    section.querySelector('#copy-id-btn').addEventListener('click', () => {
        const gameId = gameIdDisplay.textContent;
        navigator.clipboard.writeText(gameId).then(() => {
            const btn = section.querySelector('#copy-id-btn');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> COPIED!';
            btn.classList.add('bg-green-600');
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.classList.remove('bg-green-600');
            }, 2000);
        }).catch(err => {
            alert('Failed to copy. Please select and copy manually.');
        });
    });

    // START GAME
    section.querySelector('#start-game-btn').addEventListener('click', () => {
        navigate('game');
    });

    // CLOSE QR MODAL
    section.querySelector('#close-qr-btn').addEventListener('click', () => {
        qrModal.classList.add('hidden');
    });

    // AUTO-JOIN from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const joinGameId = urlParams.get('join');
    if (joinGameId) {
        console.log('Auto-joining game:', joinGameId);
        gameIdInput.value = joinGameId;

        // Show visual feedback
        gameIdInput.classList.add('border-green-500', 'border-2');

        // Auto-join after short delay
        setTimeout(() => {
            joinGame(joinGameId);
        }, 800);
    }

    return section;
}
