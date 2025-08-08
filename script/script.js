// Variable to track if it's light mode or night mode
let isNightMode = false;

function toggleTheme() {
    // Toggle the isNightMode variable
    isNightMode = !isNightMode;

    // Apply the correct mode based on the value of isNightMode
    // Get the body of the main document
    if (isNightMode) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}