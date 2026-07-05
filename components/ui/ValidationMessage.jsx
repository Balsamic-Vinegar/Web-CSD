export default function ValidationMessage({ message, tone = "error" }) {
    if (!message) return null

    const styles = {
        error: "border-red-100 bg-red-50 text-red-700",
        info: "border-indigo-100 bg-indigo-50 text-indigo-700",
        success: "border-emerald-100 bg-emerald-50 text-emerald-700",
    }

    return (
        <p className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-medium ${styles[tone] ?? styles.error}`}>
            {message}
        </p>
    )
}
