import { createClient } from "@supabase/supabase-js"
import { database } from "@/config/database"

let supabaseClient = null

export function getSupabaseClient() {
    const { supabaseID, supabasePublishableKey } = database

    if (
        !supabaseID ||
        supabaseID === "PASTE_SUPABASE_PROJECT_ID_HERE" ||
        !supabasePublishableKey ||
        supabasePublishableKey === "PASTE_SUPABASE_PUBLISHABLE_KEY_HERE"
    ) {
        throw new Error(
            "Please configure your Supabase connection in config/database.js before running the application."
        )
    }

    const supabaseUrl = `https://${supabaseID}.supabase.co`

    if (!supabaseClient) {
        supabaseClient = createClient(
            supabaseUrl,
            supabasePublishableKey
        )
    }

    return supabaseClient
}