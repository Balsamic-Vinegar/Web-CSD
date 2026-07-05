export default function IntegerInput({ value, onChange, min, max, suffix }) {
    return (
        <div className="flex w-full items-center justify-center gap-1">
            <input
                type="number"
                step="1"
                value={value}
                min={min}
                max={max}
                onChange={(e) => onChange(e.target.value)}
                className="w-24 rounded-md border border-gray-400 px-3 py-2 text-center shadow-sm"
            />
            {suffix ? <span className="text-sm text-slate-700">{suffix}</span> : null}
        </div>
    )
}
