import DateInput from "@/components/inputs/DateInput"
import TimeInput from "@/components/inputs/TimeInput"
import IntegerInput from "@/components/inputs/IntegerInput"
import OrdinalInput from "@/components/inputs/OrdinalInput"
import BooleanInput from "@/components/inputs/BooleanInput"

export default function QuestionLoader({question, value, onChange, error}) {
    function renderInput() {
        switch (question.type) {
            case "date":
                return <DateInput value={value} onChange={onChange}/>

            case "time":
                return <TimeInput value={value} onChange={onChange}/>

            case "number":
                return (
                    <IntegerInput
                        value={value}
                        onChange={onChange}
                        min={question.min}
                        max={question.max}
                        suffix={question.suffix}
                    />
                )

            case "ordinal":
                return (
                    <OrdinalInput
                        value={value}
                        onChange={onChange}
                        min={question.min}
                        max={question.max}
                    />
                )

            case "boolean":
                return <BooleanInput value={value} onChange={onChange}/>

            default:
                return null
        }
    }

    return (
        <div className="flex w-full flex-col items-center">
            <div className="flex w-full justify-center">
                {renderInput()}
            </div>

            {error ? <p className="mt-3 text-center text-sm text-red-600">{error}</p> : null}
        </div>
    )
}
