export function validateAnswer(question, answer) {

    //check for empty answer
    if (answer === "" || answer === undefined || answer === null) {
        return "This field is required."
    }

    if (question.type === "number") {

        const numberAnswer = Number(answer)

        //check is number
        if (Number.isNaN(numberAnswer)) {
            return "Please enter a valid number."
        }

        //compare with min value
        if (question.min !== undefined && numberAnswer < question.min) {
            return `Answer must be at least ${question.min}.`
        }

        //compare with max value
        if (question.max !== undefined && numberAnswer > question.max) {
            return `Answer must be no more than ${question.max}.`
        }
    }
    return ""
}

function timeToMinutes(time) {
    if (!time) {
        return null
    }

    const splitTime = time.split(":")

    const hours = Number(splitTime[0])
    const minutes = Number(splitTime[1])
    return (hours * 60) + minutes
}

export function validateEntry(answers) {
    const errors = []

    const bedtime = timeToMinutes(answers.bedtime)
    let finalAwakening = timeToMinutes(answers.finalAwakening)
    let outOfBedTime = timeToMinutes(answers.outOfBedTime)

    //if waking times are earlier than bedtimes assume they occured next day
    if (bedtime !== null && finalAwakening !== null && finalAwakening < bedtime) {
        finalAwakening += 1440
    }

    if (bedtime !== null && outOfBedTime !== null && outOfBedTime < bedtime) {
        outOfBedTime += 1440
    }

    if (
        finalAwakening !== null && outOfBedTime !== null && outOfBedTime < finalAwakening) {
        errors.push("Out of bed time cannot be earlier than final awakening time.")
    }

    if (
        answers.sleepOnsetLatency !== undefined && Number(answers.sleepOnsetLatency) < 0
    ) {
        errors.push("Sleep onset latency cannot be negative.")
    }

    if (
        answers.wakeAfterSleepOnset !== undefined && Number(answers.wakeAfterSleepOnset) < 0
    ) {
        errors.push("Wake after sleep onset cannot be negative.")
    }

    return errors
}