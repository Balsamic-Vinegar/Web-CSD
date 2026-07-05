// services/submissionService.js
//
// This service is the diary submission persistence boundary for the app.
//
// By default, the project uses browser localStorage so the app works immediately
// after cloning. To connect the app to Supabase, set:
// NEXT_PUBLIC_CSD_DATA_PROVIDER=supabase
// and provide the Supabase URL and anon key in .env.local.
//
// The app expects this service to:
// 1. Check whether a participant has already submitted today.
// 2. Save a completed diary submission.
// 3. Return the saved submission record.

import { isSupabaseEnabled } from "@/lib/config"
import { getSupabaseClient } from "@/lib/supabaseClient"

function getTodayDate() {
    return new Date().toISOString().slice(0, 10)
}

function getCurrentTime() {
    return new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    })
}

function getLastSubmissionKey(participantId) {
    return `csd-last-submission-${participantId}`
}

function getSubmissionDataKey(participantId, submissionDate) {
    return `csd-submission-${participantId}-${submissionDate}`
}

async function hasSubmittedTodayInSupabase(participantId) {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
        .from("submissions")
        .select("id")
        .eq("participant_id", participantId)
        .eq("submission_date", getTodayDate())
        .maybeSingle()

    if (error) {
        console.error("Submission status check failed:", error)
        throw new Error("Unable to check whether this participant has already submitted today.")
    }

    return Boolean(data)
}

async function hasSubmittedTodayInLocalFallback(participantId) {
    if (typeof window === "undefined") return false

    return (
        window.localStorage.getItem(getLastSubmissionKey(participantId)) ===
        getTodayDate()
    )
}

export async function hasSubmittedToday(participantId) {
    if (isSupabaseEnabled()) {
        return hasSubmittedTodayInSupabase(participantId)
    }

    return hasSubmittedTodayInLocalFallback(participantId)
}

async function saveSubmissionToSupabase(participantId, submission) {
    const supabase = getSupabaseClient()

    const submissionDate = getTodayDate()
    const submissionTime = getCurrentTime()

    const { data, error } = await supabase
        .from("submissions")
        .insert({
            participant_id: participantId,
            submission_date: submissionDate,
            submission_time: submissionTime,
            diary_data: submission,
        })
        .select("id, participant_id, submission_date, submission_time, diary_data, created_at")
        .single()

    if (error) {
        console.error("Diary submission save failed:", error)
        throw new Error("Unable to save diary submission.")
    }

    return data
}

async function saveSubmissionToLocalFallback(participantId, submission) {
    const submissionDate = getTodayDate()

    const savedSubmission = {
        participantId,
        submissionDate,
        submissionTime: getCurrentTime(),
        diaryData: submission,
    }

    if (typeof window !== "undefined") {
        window.localStorage.setItem(
            getLastSubmissionKey(participantId),
            submissionDate
        )

        window.localStorage.setItem(
            getSubmissionDataKey(participantId, submissionDate),
            JSON.stringify(savedSubmission)
        )
    }

    return savedSubmission
}

export async function saveDiarySubmission(participantId, submission) {
    if (isSupabaseEnabled()) {
        return saveSubmissionToSupabase(participantId, submission)
    }

    return saveSubmissionToLocalFallback(participantId, submission)
}
