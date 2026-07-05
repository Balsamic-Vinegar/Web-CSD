// services/participantService.js
//
// This service is the participant authentication boundary for the app.
//
// By default, the project uses a local fallback dataset so the app works
// immediately after cloning. To connect the app to Supabase, set:
// NEXT_PUBLIC_CSD_DATA_PROVIDER=supabase
// and provide the Supabase URL and anon key in .env.local.
//
// The app only expects authenticateParticipant() to return either:
// - a participant object with at least { id, username, studyCode }
// - null when credentials are invalid

import { isSupabaseEnabled } from "@/lib/config"
import { getSupabaseClient } from "@/lib/supabaseClient"

const localParticipants = [
    {
        id: "participant-001",
        username: "participant01",
        password: "sleepdemo",
        studyCode: "CSD-DEMO-2026",
    },
]

function toParticipantRecord(record) {
    if (!record) return null

    return {
        id: record.id,
        username: record.username,
        studyCode: record.study_code ?? record.studyCode,
    }
}

async function authenticateWithSupabase(username, password) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
        .from("participants")
        .select("id, username, study_code")
        .eq("username", username.trim())
        .eq("password", password.trim())
        .eq("active", true)
        .maybeSingle()

    if (error) {
        console.error("Participant authentication failed:", error)
        return null
    }

    return toParticipantRecord(data)
}

async function authenticateWithLocalFallback(username, password) {
    const participant = localParticipants.find(
        (record) =>
            record.username === username.trim() &&
            record.password === password.trim()
    )

    return toParticipantRecord(participant)
}

export async function authenticateParticipant(username, password) {
    if (isSupabaseEnabled()) {
        return authenticateWithSupabase(username, password)
    }

    return authenticateWithLocalFallback(username, password)
}
