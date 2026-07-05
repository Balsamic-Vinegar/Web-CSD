export default function DateInput({ value, onChange }) {
    return (
        <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-40 rounded-md border border-gray-400 px-3 py-2 text-center shadow-sm"
        />
    )
}
