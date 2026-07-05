// config/database.js
//
// Paste your Supabase project details here.
// You can find these in Supabase:
// Project Settings -> API

export const database = {
    dataProvider: "local", // change to "supabase" when connected
    supabaseUrl: "PASTE_SUPABASE_PROJECT_URL_HERE",
    supabasePublishableKey: "PASTE_SUPABASE_ANON_KEY_HERE",
}