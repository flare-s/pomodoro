const modeButtons = document.querySelector("#js-mode-buttons");
const mainButton = document.querySelector("#js-btn");

// Pomodoro default config
const timer = {
    workDuration: 1,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
}

let timerInterval = null;

function getTimeRemaining(endTime) {
    // Get current milliseconds
    const currentTime = Date.parse(new Date());
    // Get the milliseconds left between now and end of timer
    const difference = endTime - currentTime;

    // Convert MS to seconds
    const total = Number.parseInt(difference / 1000, 10);
    // Convert total seconds to minutes
    const minutes = Number.parseInt((total / 60) % 60, 10);
    // conver total seconds to seconds that are not a part of the minutes e.g 130 seconds will be 10 seconds
    const seconds = Number.parseInt(total % 60, 10);

    return {
        total,
        minutes,
        seconds
    }


}

function startTimer() {
    let {total} = timer.timeRemaining;
    // Get the millie seconds of the time that the timer will end
    const endTime = Date.parse(new Date()) + total * 1000;

    mainButton.textContent = "stop";
    mainButton.dataset.action = "stop";
    mainButton.classList.add("active");

    timerInterval = setInterval(() => {
        // Set the timeRemaining object to reflect the change of time when the counter start
        timer.timeRemaining = getTimeRemaining(endTime);
        // Update the couner on the UI
        updateClock();
        // Get the total seconds left from the updated timeRemaining object
        total = timer.timeRemaining.total;
        if (total <= 0) {
            // if the time is over clear the setInterval
            clearInterval(timerInterval);
        }

    }, 1000);
}

// Format the minutes and seconds and show them in the UI
const updateClock = () => {
    let {timeRemaining} = timer;
    let minutes = `${timeRemaining.minutes}`.padStart(2, "0");
    let seconds = `${timeRemaining.seconds}`.padStart(2, "0");

    document.querySelector("#js-minutes").textContent = minutes;
    document.querySelector("#js-seconds").textContent = seconds;
}

const switchMode = (mode) => {
    // Set the mode for the countdown
    timer.mode = mode;
    // Set countdown configurations depending on the mode clicked
    timer.timeRemaining = {
        total: timer[mode] * 60,
        minutes: timer[mode],
        seconds: 0
    }

    // Remove the active class from all the buttons
    document.querySelectorAll("[data-mode]")
        .forEach(button => button.classList.remove("active"));
    // Add the active class to the clicked button
    document.querySelector(`[data-mode="${mode}"]`).classList.add("active");

    document.body.style.backgroundColor = `var(--${mode})`;
    updateClock();

}

const handleMode = (e) => {
    const {mode} = e.target.dataset;
    // If the clicked element doesn't have mode in their dataset return
    if (!mode) return;

    switchMode(mode);
}

modeButtons.addEventListener("click", handleMode);

mainButton.addEventListener("click", (e) => {
    const {action} = e.target.dataset;

    if (action === "start") {
        startTimer();
    }
})
