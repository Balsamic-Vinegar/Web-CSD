"use client"

import {useState} from "react"
import {diarySchema} from "@/config/diarySchema"
import QuestionLoader from "@/components/QuestionLoader"
import {validateAnswer, validateEntry} from "@/library/validation"
import {demoStudy} from "@/library/demoParticipants"
import {authenticateParticipant} from "@/services/participantService"
import {hasSubmittedToday, saveDiarySubmission} from "@/services/submissionService"
import ValidationMessage from "@/components/ui/ValidationMessage"


export default function DiaryWorkflow() {
    const [participant, setParticipant] = useState(null)
    const [loginDetails, setLoginDetails] = useState({username: "", password: ""})
    const [loginError, setLoginError] = useState("")
    const [questionIndex, setQuestionIndex] = useState(0)
    const [submission, setSubmission] = useState({})
    const [error, setError] = useState("")
    const [completion, setCompletion] = useState(false)

    const question = diarySchema[questionIndex]
    const questionAnswer = submission[question?.id] ?? ""
    const progress = Math.round(((questionIndex + 1) / diarySchema.length) * 100)

    async function handleLogin(event) {
        event.preventDefault()
        setLoginError("")

        if (!loginDetails.username.trim() || !loginDetails.password.trim()) {
            setLoginError("Please enter both participant username and password.")
            return
        }

        try {
            const matchedParticipant = await authenticateParticipant(
                loginDetails.username,
                loginDetails.password
            )

            if (!matchedParticipant) {
                setLoginError("Participant username or password is incorrect.")
                return
            }

            const alreadySubmitted = await hasSubmittedToday(matchedParticipant.id)

            if (alreadySubmitted) {
                setLoginError("This participant has already submitted a diary entry today.")
                return
            }

            setParticipant(matchedParticipant)
        } catch (error) {
            console.error(error)
            setLoginError("Unable to validate participant details. Please check the data connection and try again.")
        }
    }

    function changeAnswer(newAnswer) {
        setSubmission((prev) => ({...prev, [question.id]: newAnswer}))
        setError("")
    }

    async function handleNext() {
        const validationError = validateAnswer(question, questionAnswer)

        if (validationError) {
            setError(validationError)
            return
        }

        if (questionIndex < diarySchema.length - 1) {
            setQuestionIndex((prev) => prev + 1)
            setError("")
            return
        }

        const now = new Date()
        const finalSubmission = {
            username: participant.username,
            submissionDate: now.toLocaleDateString("en-GB"),
            submissionTime: now.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            }),
            ...submission,
            [question.id]: questionAnswer,
        }

        const submissionErrors = validateEntry(finalSubmission)

        if (submissionErrors.length > 0) {
            setError(submissionErrors[0])
            return
        }

        try {
            await saveDiarySubmission(participant.id, finalSubmission)
            setSubmission(finalSubmission)
            setCompletion(true)
        } catch (error) {
            console.error(error)
            setError("The diary entry was valid, but could not be saved. Please try again.")
        }
    }

    function handleBack() {
        if (questionIndex > 0) {
            setQuestionIndex((prev) => prev - 1)
            setError("")
        }
    }

    if (!participant) {
        return (
            <section className="mx-auto w-full max-w-3xl">
                <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-indigo-950/10 backdrop-blur sm:p-8">
                    <div className="text-center">
                        <p className="text-sm font-bold uppercase tracking-[0.25em] text-indigo-600">{demoStudy.code}</p>
                        <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">{demoStudy.title}</h2>
                        <p className="mx-auto mt-3 max-w-xl text-slate-600">Enter the participant credentials to continue to todays diary submission.</p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <label className="block text-sm font-semibold text-slate-700" htmlFor="participant-username">Participant username</label>
                        <input
                            id="participant-username"
                            value={loginDetails.username}
                            onChange={(event) => setLoginDetails((prev) => ({...prev, username: event.target.value}))}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                            placeholder="participant01"
                        />

                        <label className="mt-5 block text-sm font-semibold text-slate-700" htmlFor="participant-password">Password</label>
                        <input
                            id="participant-password"
                            type="password"
                            value={loginDetails.password}
                            onChange={(event) => setLoginDetails((prev) => ({...prev, password: event.target.value}))}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                            placeholder="sleepdemo"
                        />

                        <ValidationMessage message={loginError} />

                        <button type="submit" className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-700">
                            Continue to diary
                        </button>
                    </form>
                </div>
            </section>
        )
    }

    if (completion) {
        return (
            <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-indigo-950/10 backdrop-blur">
                <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-600">Entry validated</p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">Submission complete!</h1>
                </div>
            </section>
        )
    }

    return (
        <section className="mx-auto w-full max-w-3xl">
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-2xl shadow-indigo-950/10 backdrop-blur sm:p-8">
                <div className="mb-8">
                    <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-500">
                        <span>Question {questionIndex + 1} of {diarySchema.length}</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-slate-950 transition-all" style={{width: `${progress}%`}} />
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-3xl font-black tracking-tight text-slate-950">{question.label}</h2>
                    <p className="mx-auto mt-3 max-w-xl text-slate-600">{question.direction}</p>
                </div>

                <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <QuestionLoader question={question} value={questionAnswer} onChange={changeAnswer} error={error}/>
                </div>

                <div className="mt-8 flex items-center justify-between gap-4">
                    <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0" onClick={handleBack} disabled={questionIndex === 0}>
                        ← Back
                    </button>
                    <button onClick={handleNext} className="rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-700">
                        {questionIndex === diarySchema.length - 1 ? "Submit entry" : "Next →"}
                    </button>
                </div>
            </div>
        </section>
    )
}
