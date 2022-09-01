const modeButtons = document.querySelector("#js-mode-buttons");
const mainButton = document.querySelector("#js-btn");
const indicator = document.querySelector(".indicator");
const pageTitle = document.querySelector("title");
// Pomodoro default config
const timer = {
  workDuration: 0.25,
  shortBreak: 0.25,
  longBreak: 0.25,
  longBreakInterval: 4,
  mode: "workDuration",
  sessionsStarted: 0,
};

let timerInterval = null;

function getTimeRemaining(endTime) {
  // Get current milliseconds
  const currentTime = Date.parse(new Date());
  // Get the milliseconds left between now and end of timer
  const difference = endTime - currentTime;

  // Convert MS to seconds
  const total = parseInt(difference / 1000);
  // Convert total seconds to minutes
  const minutes = parseInt((total / 60) % 60);
  // conver total seconds to seconds that are not a part of the minutes e.g 130 seconds will be 10 seconds
  const seconds = parseInt(total % 60);

  return {
    total,
    minutes,
    seconds,
  };
}

function startTimer() {
  let { total } = timer.timeRemaining;
  // Get the millie seconds of the time that the timer will end
  const endTime = Date.parse(new Date()) + total * 1000;
  mainButton.textContent = "stop";
  mainButton.dataset.action = "stop";

  // Everytime we start work increase the sessions started counter
  if (timer.mode === "workDuration") {
    timer.sessionsStarted++;
  }

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
      timerInterval = null;

      switch (timer.mode) {
        case "workDuration":
          if (timer.sessionsStarted === timer.longBreakInterval) {
            // Finished a set of sessions and qualify for longer break
            timer.sessionsStarted = 0;
            switchMode("longBreak");
          } else {
            switchMode("shortBreak");
          }
          break;
        default:
          switchMode("workDuration");
      }
      // Start the timer after changing the mode
      startTimer();
    }
  }, 1000);
}

// Pause the timer
const stopTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  mainButton.textContent = "start";
  mainButton.dataset.action = "start";
};

// Format the minutes and seconds and show them in the UI
const updateClock = () => {
  let { timeRemaining } = timer;
  let minutes = `${
    timeRemaining.minutes >= 1 ? timeRemaining.minutes : 0
  }`.padStart(2, "0");
  let seconds = `${timeRemaining.seconds}`.padStart(2, "0");

  document.querySelector("#js-minutes").textContent = minutes;
  document.querySelector("#js-seconds").textContent = seconds;

  const progress = document.getElementById("js-progress");
  // Update the progressbar when the counter is running
  progress.setAttribute(
    "value",
    timer[timer.mode] * 60 - timer.timeRemaining.total
  );

  pageTitle.textContent = `${timer.mode} | ${minutes}:${seconds}`;
};

const switchMode = (mode) => {
  // Set the mode for the countdown
  timer.mode = mode;
  // Set countdown configurations depending on the mode clicked
  timer.timeRemaining = {
    total: timer[mode] * 60,
    minutes: timer[mode],
    seconds: timer[mode] >= 1 ? 0 : timer[mode] * 60,
  };

  // Remove the active class from all the buttons
  document
    .querySelectorAll("[data-mode]")
    .forEach((button) => button.classList.remove("active"));
  // Add the active class to the clicked button
  let selectedMode = document.querySelector(`[data-mode="${mode}"]`);
  selectedMode.classList.add("active");
  handleIndicator(selectedMode);

  // Set the progress bar limit
  document
    .querySelector("#js-progress")
    .setAttribute("max", timer.timeRemaining.total);

  document.body.style.backgroundImage = `linear-gradient(145deg, var(--${mode}))`;
  updateClock();
};

const handleMode = (e) => {
  const { mode } = e.target.dataset;
  // If the clicked element doesn't have mode in their dataset return
  if (!mode) return;
  handleIndicator(e.target);

  switchMode(mode);
  // Stop the countdown (If it's running) when switching between modes
  stopTimer();
};

const handleIndicator = (element) => {
  let elementSpecs = element.getBoundingClientRect();
  indicator.style.top = `${elementSpecs.top}px`;
  indicator.style.left = `${elementSpecs.left}px`;
  indicator.style.width = `${elementSpecs.width}px`;
  indicator.style.height = `${elementSpecs.height}px`;
};

document.addEventListener("DOMContentLoaded", () => switchMode(timer.mode));

window.addEventListener("resize", () => {
  let el = document.querySelector(`[data-mode="${timer.mode}"]`);
  handleIndicator(el);
});

modeButtons.addEventListener("click", handleMode);

mainButton.addEventListener("click", (e) => {
  const { action } = e.target.dataset;

  if (action === "start") {
    startTimer();
  } else if (action === "stop") {
    if (timer.mode === "workDuration") {
      timer.sessionsStarted--;
    }
    stopTimer();
  }
});
