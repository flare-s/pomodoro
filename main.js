const modeButtons = document.querySelector("#js-mode-buttons");

// Pomodoro default config
const timer = {
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
}

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
