export function getDataProvider() {
    return process.env.NEXT_PUBLIC_CSD_DATA_PROVIDER || "local"
}

export function isSupabaseEnabled() {
    return getDataProvider().toLowerCase() === "supabase"
}
