export default function TimeInput({ value, onChange }) {
    return (
        <input
            className="w-24 rounded-md border border-gray-400 px-3 py-2 text-center shadow-sm"
            type="time"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}
