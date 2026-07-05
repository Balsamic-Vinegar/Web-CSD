import { createClient } from "@supabase/supabase-js"
import { database } from "@/config/database"

let supabaseClient = null

export function getSupabaseClient() {
    const { supabaseUrl, supabaseAnonKey } = database

    if (
        !supabaseUrl ||
        supabaseUrl === "PASTE_YOUR_SUPABASE_URL_HERE" ||
        !supabaseAnonKey ||
        supabaseAnonKey === "PASTE_YOUR_SUPABASE_ANON_KEY_HERE"
    ) {
        throw new Error(
            "Please configure your Supabase connection in config/database.js before running the application."
        )
    }

    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    }

    return supabaseClient
}