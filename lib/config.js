import { database } from "@/config/database"

export function getDataProvider() {
    return database.dataProvider || "local"
}

export function isSupabaseEnabled() {
    return getDataProvider().toLowerCase() === "supabase"
}