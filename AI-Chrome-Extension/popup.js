document.getElementById("submitBtn").addEventListener("click", function() {
    const apiKey = document.getElementById("apiKeyInput").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    // If the API key is empty, show an error message
    if (apiKey === "") {
        errorMessage.style.display = "block";
        return;
    }

    // Save the API key to chrome storage
    try {
        console.log("API Key entered:", apiKey);
        chrome.storage.local.set({ "apiKey": apiKey }, function() {
            console.log("The API_KEY is set successfully");

            // Send message to content.js
            chrome.runtime.sendMessage({ action: "openChatBot" }, (response) => {
                console.log("Message sent to content.js: ", response);
            });

            // Close the popup
            window.close();
        });
    } catch (error) {
        console.error("Error setting API_KEY:", error);
    }
});

// Optional: Allow the user to submit by pressing the Enter key
document.getElementById("apiKeyInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("submitBtn").click();
    }
});