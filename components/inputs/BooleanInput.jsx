export default function BooleanInput({ value, onChange }) {
    return (
        <div className="flex justify-center gap-3">

            <button
                type="button"
                onClick={() => onChange(true)}
                className={`px-4 py-2 border
                 ${value === true ? "bg-black text-white rounded-md " : "bg-white rounded-md shadow-sm border border-gray-400"}`}>
                Yes
            </button>

            <button
                type="button"
                onClick={() => onChange(false)}
                className={`px-4 py-2 border
                ${value === false ? "bg-black text-white rounded-md" : "bg-white rounded-md shadow-sm border border-gray-400"}`}>
                No
            </button>

        </div>
    )
}