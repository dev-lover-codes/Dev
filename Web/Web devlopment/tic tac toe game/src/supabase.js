
// Initialize Supabase
// REPLACE THESE WITH YOUR OWN SUPABASE CREDENTIALS
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseKey = 'public-anon-key';

export const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

export async function signIn(email, password) {
    if (!supabase) return { error: { message: "Supabase library not loaded" } };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
}

export async function signUp(email, password) {
    if (!supabase) return { error: { message: "Supabase library not loaded" } };
    const { data, error } = await supabase.auth.signUp({ email, password });
    return { data, error };
}

export async function createGame(playerId) {
    if (!supabase) return;
    const { data, error } = await supabase
        .from('games')
        .insert([{ player_x: playerId, board: Array(9).fill(''), turn: 'X' }])
        .select()
        .single();
    return { data, error };
}

export async function joinGame(gameId, playerId) {
    if (!supabase) return;
    const { data, error } = await supabase
        .from('games')
        .update({ player_o: playerId })
        .eq('id', gameId)
        .select()
        .single();
    return { data, error };
}
