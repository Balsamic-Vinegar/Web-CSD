import { createClient } from "@supabase/supabase-js"
import { database } from "@/config/database"

let supabaseClient = null

export function getSupabaseClient() {
    const { supabaseUrl, supabasePublishableKey } = database

    if (
        !supabaseUrl ||
        supabaseUrl === "PASTE_SUPABASE_PROJECT_URL_HERE" ||
        !supabasePublishableKey ||
        supabasePublishableKey === "PASTE_SUPABASE_ANON_KEY_HERE"
    ) {
        throw new Error(
            "Please configure your Supabase connection in config/database.js before running the application."
        )
    }

    if (!supabaseClient) {
        supabaseClient = createClient(supabaseUrl, supabasePublishableKey)
    }

    return supabaseClient
}