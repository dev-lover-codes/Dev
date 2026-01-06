import { navigate } from '../main.js';
import { store } from '../store.js';
import { DB } from '../database.js';

export function renderOnlineLogin() {
    const section = document.createElement('section');
    section.className = "flex flex-col items-center justify-center w-full h-full p-4 animate-fade-in";

    section.innerHTML = `
        <div class="glass-panel p-8 rounded-2xl w-full max-w-sm">
            <h2 class="text-3xl font-bold mb-6 text-center">Online Login</h2>
            
            <div class="space-y-4">
                <input type="email" id="email" placeholder="Email" class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition">
                <input type="password" id="password" placeholder="Password" class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary transition">
                
                <button id="login-btn" class="w-full py-3 bg-primary rounded-lg font-bold hover:bg-primary/80 transition">Login</button>
                <button id="signup-btn" class="w-full py-3 bg-white/10 rounded-lg font-bold hover:bg-white/20 transition">Sign Up</button>
            </div>
            
            <button id="back-btn" class="mt-6 text-sm text-gray-400 hover:text-white w-full text-center">Back</button>
        </div>
    `;

    const emailInp = section.querySelector('#email');
    const passInp = section.querySelector('#password');

    section.querySelector('#login-btn').addEventListener('click', async () => {
        if (!emailInp.value) { alert("Please enter a username or email"); return; }
        const { data, error } = await DB.signIn(emailInp.value, passInp.value);
        if (error) {
            alert(error.message);
        } else {
            store.state.onlineUser = data.user;
            navigate('online-lobby');
        }
    });

    section.querySelector('#signup-btn').addEventListener('click', async () => {
        if (!emailInp.value) { alert("Please enter a username or email"); return; }
        const { data, error } = await DB.signUp(emailInp.value, passInp.value);
        if (error) {
            alert(error.message);
        } else {
            // Auto login after signup
            store.state.onlineUser = data.user;
            alert('Welcome! You are now connected.');
            navigate('online-lobby');
        }
    });

    section.querySelector('#back-btn').addEventListener('click', () => navigate('mode-select'));

    return section;
}
