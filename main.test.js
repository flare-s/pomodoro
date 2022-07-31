// Test if the clicking one of the buttons give it the active class
test("Clicking the short break button gives it the active class and remove the active class from the previous button", () => {
  let shortBreak = document.querySelector('[data-mode="shortBreak"]');
  let previousButton = document.querySelector("[data-mode].active");
  shortBreak.click();

  assertEquals(true, shortBreak.classList.contains("active"));
  assertEquals(false, previousButton.classList.contains("active"));

  //reset so the test does not affect the code
  previousButton.click();
});

test("Clicking the short break button change the countdown to the timer shortBreak property duration", () => {
  let shortBreak = document.querySelector('[data-mode="shortBreak"]');
  let previousButton = document.querySelector("[data-mode].active");
  shortBreak.click();

  let expected = timer.shortBreak >= 1 ? timer.shortBreak : 0;
  let actual = document.querySelector("#js-minutes");
  assertEquals(expected, +actual.textContent);

  //reset so the test does not affect the code
  previousButton.click();
});

test("Clicking the start button start the setInterval method", () => {
  mainButton.click();

  let expected = true;
  let actual = typeof timerInterval === "number";
  assertEquals(expected, actual);

  clearInterval(timerInterval);

  mainButton.textContent = "start";
  mainButton.dataset.action = "start";
  timer.sessionsStarted = 0;
  mainButton.classList.remove("active");
});

test("Clicking the pause button clear the setinterval that is running and pause the time", () => {
  mainButton.click();

  mainButton.click();

  let expected = null;
  let actual = timerInterval;
  assertEquals(expected, actual);
});
