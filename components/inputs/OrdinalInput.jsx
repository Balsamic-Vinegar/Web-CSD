export default function OrdinalInput({ value, onChange, min, max }) {

    const buttons = []

    for (let number = min; number <= max; number++) {
        buttons.push(
            <button
                key={number}
                type="button"
                onClick={() => onChange(number)}
                className={value === number ? "px-4 py-2 border bg-black text-white rounded-md" : "px-4 py-2 shadow-sm border border-gray-400 rounded-md "}
            >
                {number}
            </button>
        )
    }

    return (
        <div className="flex justify-center gap-2">
            {buttons}
        </div>
    )
}