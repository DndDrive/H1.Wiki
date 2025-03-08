// Variable to track if it's light mode or night mode
let isNightMode = false;

function toggleTheme() {
    // Toggle the isNightMode variable
    isNightMode = !isNightMode;

    // Apply the correct mode based on the value of isNightMode
    applyTheme();
}

function applyTheme() {
    // Get the body of the main document
    if (isNightMode) {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }

    // Access the iframe and apply the theme there
    const iframe = document.getElementById('my-iframe');
    if (iframe && iframe.contentWindow) {
        const iframeDocument = iframe.contentWindow.document;

        if (isNightMode) {
            iframeDocument.body.classList.add('light-mode');
        } else {
            iframeDocument.body.classList.remove('light-mode');
        }
    }
}