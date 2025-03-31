const iframe = document.getElementById("tapouframe");
            let historyStack = [];
            let historyIndex = -1;

            // Track navigation
            iframe.onload = () => {
                let currentUrl = iframe.contentWindow.location.href;
                if (historyStack[historyIndex] !== currentUrl) {
                    historyStack = historyStack.slice(0, historyIndex + 1);
                    historyStack.push(currentUrl);
                    historyIndex++;
                }
            };

            function goBack() {
                if (historyIndex > 0) {
                    historyIndex--;
                    iframe.src = historyStack[historyIndex];
                }
            }

            function goForward() {
                if (historyIndex < historyStack.length - 1) {
                    historyIndex++;
                    iframe.src = historyStack[historyIndex];
                }
            }

            function reloadIframe() {
                iframe.src = iframe.src;
            }