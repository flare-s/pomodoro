// Test if the clicking one of the buttons give it the active class
test("Clicking the short break button gives it the active class and remove the active class from the previous button", () => {
    let shortBreak = document.querySelector('[data-mode="shortBreak"]');
    let previousButton = document.querySelector("[data-mode].active");
    shortBreak.click();

    assertEquals(true, shortBreak.classList.contains("active"));
    assertEquals(false, previousButton.classList.contains("active"));

    //reset so the test does not affect the code
    previousButton.click();
    console.log(timer);



})