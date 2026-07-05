export const schematic = [
    {
        id: "bedtime",
        label: "What time did you start trying to sleep?",
        direction:
            "Indicate the time you began attempting to fall asleep",
        type: "time",
    },

    {
        id: "sleepOnsetLatency",
        label: "How long did it take you to fall asleep?",
        direction:
            "Estimate the number of minutes it took you to fall asleep after first attempting to sleep",
        type: "number",
        min: 0,
        max: 300,
        suffix: "minutes",
    },

    {
        id: "awakenings",
        label: "How many times did you wake during the night?",
        direction:
            "Indicate the number of times you woke after initially falling asleep.",
        type: "number",
        min: 0,
        max: 20,
        suffix: "times",
    },

    {
        id: "wakeAfterSleepOnset",
        label: "How many total minutes were you awake during the night?",
        direction:
            "Estimate the total amount of time spent awake during the night after first falling asleep",
        type: "number",
        min: 0,
        max: 300,
        suffix: "minutes",
    },

    {
        id: "finalAwakening",
        label: "What time did you wake for the final time?",
        direction:
            "Indicate the final time you woke up before getting out of bed for the day",
        type: "time",
    },

    {
        id: "outOfBedTime",
        label: "What time did you get out of bed?",
        direction:
            "Indicate the time you physically got out of bed to begin your day",
        type: "time",
    },

    {
        id: "sleepQuality",
        label: "How would you rate your sleep quality?",
        direction:
            "Rate your sleep quality",
        type: "ordinal",
        min: 1,
        max: 5,
    },

    {
        id: "napped",
        label: "Did you nap during the day?",
        direction:
            "Indicate whether you took naps throughout the day",
        type: "boolean",
    },

    {
        id: "usedSleepAid",
        label: "Did you use any medication or sleep aid?",
        direction:
            "Indicate whether you used any medication, supplements, or sleep aids which affected your sleep",
        type: "boolean",
    },
];