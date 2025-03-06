window.addEventListener("load", addBookmarkButton);
let currentPathName = window.location.pathname;
let currTheme = localStorage.getItem("playlist-page-theme")?.replace(/"/g, '') || "light";
const themeStyles = {
    light: {
        containerBg: "#ffffff",
        messagesBg: "#f3f4f6",
        inputAreaBg: "#fafafa",
        borderColor: "#ddd",
        headerBg: "linear-gradient(135deg, #3f6fc1, #65aefc)",
        textColor: "white",
        buttonBg: "#3f6fc1",
        buttonHoverBg: "#2d4f91",
        closeHoverColor: "#ff1744",
        clearHoverColor: "#ff1744",
    },
    dark: {
        containerBg: "#1e1e2e",
        messagesBg: "#2c2c3b",
        inputAreaBg: "#2c2c3b",
        borderColor: "#444",
        headerBg: "linear-gradient(135deg, #444, #555)",
        textColor: "white",
        buttonBg: "#4c4c6f",
        buttonHoverBg: "#363654",
        closeHoverColor: "#ff7f7f",
        clearHoverColor: "#ff7f7f",
    },
};

const observer = new MutationObserver(() => {
    addBookmarkButton();
    checkThemeChange();
    const newPathName = window.location.pathname;
    if (currentPathName !== newPathName) {
        currentPathName = newPathName;
        closeBtnHandler();
        addInjectScript();
    }
})

observer.observe(document.body, { childList: true, subtree: true });

addBookmarkButton();
addInjectScript();
checkThemeChange();

function onProblemsPage() {
    return window.location.pathname.startsWith("/problems/") && window.location.pathname.length > "/problems/".length;
}

function addBookmarkButton() {
    // Ensure we are on the correct page and button doesn't already exist
    if (!onProblemsPage() || document.getElementById("ai-bot-btn")) return;

    // Create the button element
    const askDoubtBtn = document.createElement("button");

    // Set the button's text and ID
    askDoubtBtn.textContent = "AI Help";
    askDoubtBtn.id = "ai-bot-btn";

    // Style the button
    askDoubtBtn.style.backgroundColor = "#3f6fc1";
    askDoubtBtn.style.color = "white";
    askDoubtBtn.style.border = "none";
    askDoubtBtn.style.borderRadius = "5px";
    askDoubtBtn.style.padding = "10px 15px";
    askDoubtBtn.style.cursor = "pointer";
    askDoubtBtn.style.fontSize = "16px";
    askDoubtBtn.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    askDoubtBtn.style.margin = "10px";

    // Add hover effect
    askDoubtBtn.addEventListener("mouseover", () => {
        askDoubtBtn.style.backgroundColor = "#2d4f91"; // Darker shade on hover
    });
    askDoubtBtn.addEventListener("mouseout", () => {
        askDoubtBtn.style.backgroundColor = "#3f6fc1"; // Reset color
    });

    // Find the container where the button will be added
    const btnContainer = document.querySelector(".coding_desc_container__gdB9M");
    if (btnContainer) {
        btnContainer.insertAdjacentElement("beforeend", askDoubtBtn);

        // Add event listener for button click
        askDoubtBtn.addEventListener("click", openChatBotHandler);
    } else {
        console.error("Button container not found. Unable to add the bookmark button.");
    }
}

// CHATBOT HANDLER AS A POPUP
function openChatBotHandler() {
    // Check if the API key is stored
    chrome.storage.local.get("apiKey", (result) => {
        const apiKey = result.apiKey;
        if (!apiKey) {
            chrome.runtime.sendMessage({ action: "openPopup" });
        } else {
            // Use the existing API key for the AI model
            console.log("API Key already stored!");
            // Continue with the AI functionality
            createChatBotPopup();
        }
    });
}

function changeChatBotTheme() {
    // Check if chatbot is open or not
    if (!document.getElementById("chatbot-container")) return;

    const chatbotContainer = document.getElementById("chatbot-container");
    const chatbotHeader = chatbotContainer.querySelector("div:first-child");
    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatbotInputArea = document.getElementById("chatbot-input-area");
    const closeButton = document.getElementById("chatbot-close-btn");
    const clearHistoryButton = document.getElementById("clear-history-btn");
    const chatbotSendButton = document.getElementById("chat-send-btn");

    chatbotContainer.style.backgroundColor = themeStyles[currTheme].containerBg;
    chatbotHeader.style.background = themeStyles[currTheme].headerBg;
    chatbotHeader.style.color = themeStyles[currTheme].textColor;
    closeButton.style.color = themeStyles[currTheme].textColor; 
    chatbotMessages.style.backgroundColor = themeStyles[currTheme].messagesBg;
    clearHistoryButton.style.color = themeStyles[currTheme].textColor;
    chatbotInputArea.style.backgroundColor = themeStyles[currTheme].inputAreaBg;
    chatbotSendButton.style.backgroundColor = themeStyles[currTheme].buttonBg;
    chatbotSendButton.style.color = themeStyles[currTheme].textColor;
}

function checkThemeChange() {
    const themeToggle = document.querySelector(".ant_switch_resource_header button");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            setTimeout(() => {
                const updatedTheme = localStorage.getItem("playlist-page-theme").replace(/"/g, '');
                if (updatedTheme !== currTheme) {
                    currTheme = updatedTheme || "light"; // Default to 'light' if null
                    changeChatBotTheme();
                }
            }, 100); // Update after 100ms to ensure state has updated in localStorage
        });
    }
}

function createChatBotPopup() {
    // Check if the chatbot already exists
    if (document.getElementById("chatbot-container")) return;

    // Create the chatbot container as a popup
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    chatbotContainer.style.position = "fixed";
    chatbotContainer.style.bottom = "20px";
    chatbotContainer.style.right = "20px";
    chatbotContainer.style.width = "400px";
    chatbotContainer.style.height = "500px";
    chatbotContainer.style.backgroundColor = themeStyles[currTheme].containerBg;
    chatbotContainer.style.borderRadius = "16px";
    chatbotContainer.style.boxShadow = "0 6px 20px rgba(0, 0, 0, 0.2)";
    chatbotContainer.style.overflow = "hidden";
    chatbotContainer.style.display = "flex";
    chatbotContainer.style.flexDirection = "column";
    chatbotContainer.style.zIndex = "1001";
    chatbotContainer.style.transition = "transform 0.3s ease";
    chatbotContainer.style.transform = "translateY(0)"; // Initially visible

    // Create the chatbot header
    const chatbotHeader = document.createElement("div");
    chatbotHeader.textContent = "Chat with AI";
    chatbotHeader.style.background = themeStyles[currTheme].headerBg;
    chatbotHeader.style.color = themeStyles[currTheme].textColor;
    chatbotHeader.style.padding = "15px";
    chatbotHeader.style.textAlign = "center";
    chatbotHeader.style.fontSize = "20px";
    chatbotHeader.style.fontWeight = "bold";
    chatbotHeader.style.borderTopLeftRadius = "16px";
    chatbotHeader.style.borderTopRightRadius = "16px";
    chatbotHeader.style.position = "relative";

    // Add a close button to the header
    const closeButton = document.createElement("span");
    closeButton.textContent = "×";
    closeButton.id = "chatbot-close-btn";
    closeButton.style.fontSize = "25px";
    closeButton.style.cursor = "pointer";
    closeButton.style.position = "absolute";
    closeButton.style.top = "12px";
    closeButton.style.right = "15px";
    closeButton.style.color = themeStyles[currTheme].textColor;
    closeButton.style.transition = "color 0.3s ease";
    closeButton.addEventListener("click", closeBtnHandler);
    closeButton.addEventListener("mouseenter", () => {
        closeButton.style.color = themeStyles[currTheme].closeHoverColor;
    });
    closeButton.addEventListener("mouseleave", () => {
        closeButton.style.color = themeStyles[currTheme].textColor;
    });
    chatbotHeader.appendChild(closeButton);

    // Create the chatbot message area
    const chatbotMessages = document.createElement("div");
    chatbotMessages.id = "chatbot-messages";
    chatbotMessages.style.flex = "1";
    chatbotMessages.style.padding = "15px";
    chatbotMessages.style.overflowY = "auto";
    chatbotMessages.style.backgroundColor = themeStyles[currTheme].messagesBg;
    chatbotMessages.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    chatbotMessages.style.fontSize = "14px";
    chatbotMessages.style.lineHeight = "1.6";

    // Add a modern "Clear Chat History" button as an icon
    const clearHistoryButton = document.createElement("span");
    clearHistoryButton.id = "clear-history-btn";
    clearHistoryButton.title = "Clear Chat History"; // Tooltip
    clearHistoryButton.innerHTML = "🗑"; // Trash bin emoji
    clearHistoryButton.style.position = "absolute";
    clearHistoryButton.style.top = "15px";
    clearHistoryButton.style.left = "15px"; // Positioned next to the close button
    clearHistoryButton.style.fontSize = "20px";
    clearHistoryButton.style.cursor = "pointer";
    clearHistoryButton.style.color = themeStyles[currTheme].textColor;
    clearHistoryButton.style.transition = "color 0.3s ease, transform 0.3s ease";
    clearHistoryButton.style.display = "flex";
    clearHistoryButton.style.alignItems = "center";
    clearHistoryButton.style.justifyContent = "center";

    // Add hover effects for better interactivity
    clearHistoryButton.addEventListener("mouseenter", () => {
        clearHistoryButton.style.color = themeStyles[currTheme].clearHoverColor;
        clearHistoryButton.style.transform = "scale(1.1)"; // Slight zoom effect
    });
    clearHistoryButton.addEventListener("mouseleave", () => {
        clearHistoryButton.style.color = themeStyles[currTheme].textColor;
        clearHistoryButton.style.transform = "scale(1)"; // Reset zoom
    });

    const uniqueId = extractUniqueId(window.location.href);
    // Add click handler to clear chat history with UI feedback
    clearHistoryButton.addEventListener("click", () => {
        chrome.storage.local.get(uniqueId, (obj) => {
            if (Object.keys(obj).length == 0)
                return;
            chrome.storage.local.remove(uniqueId, () => {
                console.log("Chat history cleared.");
            });
            const chatbotMsgArea = document.getElementById("chatbot-messages");
    
            // Add fade-out effect to all messages
            const messages = chatbotMsgArea.children;
            Array.from(messages).forEach((msg) => {
                isMsgPresent = true;
                msg.style.transition = "opacity 0.5s ease";
                msg.style.opacity = "0";
                setTimeout(() => {
                    msg.remove(); // Remove messages after fade-out
                }, 500);
            });
            // Update clear button temporarily to show clearing feedback
            clearHistoryButton.innerHTML = "⏳ Clearing...";
            clearHistoryButton.style.cursor = "default";
            setTimeout(() => {
                clearHistoryButton.innerHTML = "🗑"; // Reset icon
                clearHistoryButton.style.cursor = "pointer";
                console.log("Chat history cleared.");
            }, 1000);
        })
    });
    chatbotHeader.appendChild(clearHistoryButton);

    // Create the chatbot input area
    const chatbotInputArea = document.createElement("div");
    chatbotInputArea.id = "chatbot-input-area";
    chatbotInputArea.style.display = "flex";
    chatbotInputArea.style.padding = "15px";
    chatbotInputArea.style.backgroundColor = themeStyles[currTheme].inputAreaBg;
    chatbotInputArea.style.borderBottom = "1px solid #ddd";
    chatbotInputArea.style.borderRadius = "0 0 16px 16px";
    chatbotInputArea.style.justifyContent = "space-between";

    const chatbotInput = document.createElement("input");
    chatbotInput.type = "text";
    chatbotInput.placeholder = "Type your message...";
    chatbotInput.style.flex = "1";
    chatbotInput.style.padding = "12px";
    chatbotInput.style.border = "2px solid #ddd";
    chatbotInput.style.borderRadius = "8px";
    chatbotInput.style.fontSize = "14px";
    chatbotInput.style.outline = "none";
    chatbotInput.style.transition = "border-color 0.3s ease";
    chatbotInput.addEventListener("focus", () => {
        chatbotInput.style.borderColor = themeStyles[currTheme].headerBg;
    });
    chatbotInput.addEventListener("blur", () => {
        chatbotInput.style.borderColor = themeStyles[currTheme].borderColor;
    });
    chatbotInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            document.getElementById("chat-send-btn").click();
        }
    });

    const chatbotSendButton = document.createElement("button");
    chatbotSendButton.id = "chat-send-btn";
    chatbotSendButton.textContent = "Send";
    chatbotSendButton.style.marginLeft = "15px";
    chatbotSendButton.style.padding = "12px 20px";
    chatbotSendButton.style.backgroundColor = themeStyles[currTheme].buttonBg;
    chatbotSendButton.style.color = themeStyles[currTheme].textColor;
    chatbotSendButton.style.border = "none";
    chatbotSendButton.style.borderRadius = "8px";
    chatbotSendButton.style.fontSize = "14px";
    chatbotSendButton.style.cursor = "pointer";
    chatbotSendButton.style.transition = "background-color 0.3s ease";
    chatbotSendButton.addEventListener("click", () => sendBtnHandler(chatbotInput, chatbotMessages));

    chatbotSendButton.addEventListener("mouseenter", () => {
        chatbotSendButton.style.backgroundColor = themeStyles[currTheme].buttonHoverBg;
    });

    chatbotSendButton.addEventListener("mouseleave", () => {
        chatbotSendButton.style.backgroundColor = themeStyles[currTheme].buttonBg;
    });

    chatbotInputArea.appendChild(chatbotInput);
    chatbotInputArea.appendChild(chatbotSendButton);

    // Append all parts to the chatbot container
    chatbotContainer.appendChild(chatbotHeader);
    chatbotContainer.appendChild(chatbotMessages);
    chatbotContainer.appendChild(chatbotInputArea);
    loadChatHistory(chatbotMessages);
    document.body.appendChild(chatbotContainer);
}

// Close button handler
function closeBtnHandler() {
    const chatbotContainer = document.getElementById("chatbot-container");
    if (chatbotContainer) {
        chatbotContainer.style.transform = "translateY(100%)"; // Slide out effect
        setTimeout(() => {
            chatbotContainer.remove();
        }, 300); // Remove after the slide-out transition
    }
}

async function sendBtnHandler(chatbotInput, chatbotMessages) {
    let message = chatbotInput.value.trim();
    const uniqueId = extractUniqueId(window.location.href);
    if (message) {
        // Add user message
        addMessageToChat(chatbotMessages, message, "user");

        // Retrieve existing messages, append new one, and save
        getMessagesFromLocalStorage(uniqueId, (messages) => {
            messages.push({ text: message, sender: "user" });
            saveMessagesToLocalStorage(uniqueId, messages);
        });

        // Clear input after sending
        chatbotInput.value = "";
        try {
            // Fetch AI response
            const response = await fetchAIResponse(message);

            // Add AI response
            if (response) {
                addMessageToChat(chatbotMessages, response, "model");
                getMessagesFromLocalStorage(uniqueId, (messages) => {
                    messages.push({ text: response, sender: "model" });
                    saveMessagesToLocalStorage(uniqueId, messages);
                });
            } else {
                const errorMsg = "Sorry, I couldn't fetch a response.";
                addMessageToChat(chatbotMessages, errorMsg, "model");
                getMessagesFromLocalStorage(uniqueId, (messages) => {
                    messages.push({ text: errorMsg, sender: "model" });
                    saveMessagesToLocalStorage(uniqueId, messages);
                });
            }
        } catch (error) {
            console.error("Error fetching AI response:", error);
            const errorMsg = "An error occurred. Please try again later.";
            addMessageToChat(chatbotMessages, errorMsg, "model");
            getMessagesFromLocalStorage(uniqueId, (messages) => {
                messages.push({ text: errorMsg, sender: "model" });
                saveMessagesToLocalStorage(uniqueId, messages);
            });
        }
    }
}

function extractUniqueId(url) {
    const match = url.match(/-(\d+)(?=\?|$)/); // Matches a hyphen followed by digits, ensuring it's before "?" or end of string
    const id = match ? match[1] : null;
    return id;
}

function getMessagesFromLocalStorage(uniqueId, callback) {
    chrome.storage.local.get([uniqueId], (result) => {
        callback(result[uniqueId] || []);
    });
}

function saveMessagesToLocalStorage(uniqueId, messages) {
    chrome.storage.local.set({ [uniqueId]: messages }, () => {
        console.log("Chat history saved for:", uniqueId);
    });
}

function loadChatHistory(chatbotMessages) {
    const uniqueId = extractUniqueId(window.location.href);

    getMessagesFromLocalStorage(uniqueId, (messages) => {
        messages.forEach(({ text, sender }) => {
            addMessageToChat(chatbotMessages, text, sender);
        });
    });
}

// Helper function to add messages to the chat
function addMessageToChat(chatbotMessages, text, sender) {
    const messageElement = document.createElement("div");
    messageElement.innerHTML = text;
    messageElement.style.margin = "5px 0";
    messageElement.style.padding = "8px";
    messageElement.style.borderRadius = "5px";

    if (sender === "user") {
        messageElement.style.backgroundColor = "#e0f7fa";
        messageElement.style.alignSelf = "flex-end";
    } else if (sender === "model") {
        messageElement.style.backgroundColor = "#f1f1f1";
        messageElement.style.alignSelf = "flex-start";
    }

    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

async function getApiKey() {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get("apiKey", (result) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result["apiKey"]);
            }
        });
    });
}

async function fetchAIResponse(message) {
    const API_KEY = await getApiKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    let promptSent = false;
    const contents = [];
    const uniqueId = extractUniqueId(window.location.href);

    return new Promise((resolve, reject) => {
        // Fetch intercepted data (this data contains problem details)
        chrome.storage.local.get("interceptedData", (result) => {
            const interceptedData = result["interceptedData"] || {}; // Renamed variable to avoid collision
            // Fetch previous messages from chrome storage using uniqueId
            chrome.storage.local.get([uniqueId], (result) => {
                const messagesData = result[uniqueId]; // Renamed variable to avoid collision
                // Fetch code editor details
                const editorLanguage = localStorage.getItem("editor-language")?.replace(/"/g, '') || "C++14";
                const usersCode = getUsersCode();
                if (messagesData) {
                    // Iterate over the array of messages and add them to contents
                    for (let i = 0; i < messagesData.length; i++) {
                        promptSent = true;
                        const text = messagesData[i].text;  // Get the message text
                        const role = messagesData[i].sender;  // Get the sender's role ("user" or "model")

                        // Check if this is the first user message, and if promptSent is true, add the prompt
                        if (i === 0) {
                            contents.push({
                                role: "user",
                                parts: [
                                    { text: `You are a helpful assistant tasked with solving a specific problem based on the provided details. You should only provide responses directly related to the problem description, constraints, input/output formats, the user's current coding context provided as code editor details and coding concepts required to solve the problem. Ignore any unrelated questions or topics. If a user asks a question outside the scope of the problem, politely remind them to stay focused on the problem at hand.

                                        Problem Description: 
                                        ${interceptedData.problemDescription}

                                        Hints: 
                                        1. ${interceptedData.hints?.hint1 || "No hint provided."}
                                        2. ${interceptedData.hints?.hint2 || "No hint provided."}

                                        Solution Approach:
                                        ${interceptedData.solutionApproach}

                                        Input Format:
                                        ${interceptedData.inputFormat}

                                        Output Format:
                                        ${interceptedData.outputFormat}

                                        Constraints:
                                        ${interceptedData.constraints}

                                        User's Current Code:
                                        ${usersCode[editorLanguage] ? `
                                        \`\`\`${editorLanguage}
                                        ${usersCode[editorLanguage] || "No code found."}
                                        \`\`\`
                                        ` : "No code found for the selected language."}

                                        Notes:
                                        - If the user asks a question related to problem or greet (e.g., "Hi"), acknowledge it warmly and guide the user to ask specific questions related to the problem.
                                        - If no specific question is asked, politely prompt the user to provide one, explaining how it relates to the problem.
                                        - Use the provided users code context to tailor suggestions or debugging tips.
                                        - Do not provide responses to questions which are unrelated to the current problem

                                        User Question: ${messagesData[i].text}
                                    `}
                                ]
                            });
                        } else {
                            // Add the message to contents in the correct format
                            contents.push({
                                role: role,
                                parts: [
                                    { text: text }
                                ]
                            });
                        }
                    }
                }
                if (!promptSent) {
                    message = `You are a helpful assistant tasked with solving a specific problem based on the provided details. You should only provide responses directly related to the problem description, constraints, input/output formats, the user's current coding context provided as User's Code and coding concepts required to solve the problem. Ignore any unrelated questions or topics. If a user asks a question outside the scope of the problem, politely remind them to stay focused on the problem at hand.
                    
                        Problem Description: 
                        ${interceptedData.problemDescription}

                        Hints: 
                        1. ${interceptedData.hints?.hint1 || "No hint provided."}
                        2. ${interceptedData.hints?.hint2 || "No hint provided."}

                        Solution Approach:
                        ${interceptedData.solutionApproach}

                        Input Format:
                        ${interceptedData.inputFormat}

                        Output Format:
                        ${interceptedData.outputFormat}

                        Constraints:
                        ${interceptedData.constraints}

                        User's Current Code:
                        ${usersCode[editorLanguage] ? `
                        \`\`\`${editorLanguage}
                        ${usersCode[editorLanguage] || "No code found."}
                        \`\`\`
                        ` : "No code found for the selected language."}

                        Notes:
                        - If the user asks a question related to problem or greet (e.g., "Hi"), acknowledge it warmly and guide the user to ask specific questions related to the problem.
                        - If no specific question is asked, politely prompt the user to provide one, explaining how it relates to the problem.
                        - Use the provided users code context to tailor suggestions or debugging tips.
                        - Do not provide responses to questions which are unrelated to the current problem

                        User Question: ${message}
                    `;
                }

                // Add the final user message (with the problem details prompt) after all previous messages
                contents.push({
                    role: "user",
                    parts: [
                        { text: message }
                    ]
                });
                
                // Construct the requestBody object
                const requestBody = {
                    contents: contents
                };

                // Make the POST request
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(requestBody)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(responseData => {
                    let text = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                        text = formatResponseForUI(text);
                        resolve(text);  // Resolve with AI response text
                    } else {
                        console.error("Response does not contain the expected text field.");
                        reject("No AI response");
                    }
                })
                .catch(error => {
                    console.error("Error fetching AI response:", error);
                    reject(error);
                });
            });
        });
    });
}

// Function to format response for better readability and code handling
function formatResponseForUI(text) {
    return text.replace(/```([\s\S]*?)```|`([^`]*)`/g, (match, multilineCode, inlineCode) => {
        if (multilineCode) {
            return `<pre class="code-block"><code>${escapeHTML(multilineCode)}</code></pre>`;
        } else if (inlineCode) {
            return `<code class="inline-code">${escapeHTML(inlineCode)}</code>`;
        }
        return match;
    }).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Bold markdown support
      .replace(/\*(.*?)\*/g, '<em>$1</em>');  // Italic markdown support
}

// Helper function to escape HTML characters
function escapeHTML(html) {
    return html.replace(/&/g, "&amp;")
               .replace(/</g, "&lt;")
               .replace(/>/g, "&gt;")
               .replace(/"/g, "&quot;")
               .replace(/'/g, "&#039;");
}

function addInjectScript() {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("inject.js");
    script.onload = function () {
        this.remove(); // Remove script after execution
    };
    document.documentElement.appendChild(script);
}

function getUsersCode() {
    // Check if the profileID exists in the localStorage of the browser
        // Iterate over all items in the localStorage
    const uniqueId = extractUniqueId(window.location.href);
    const codeEntries = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);

        // Check if the value contains the profileID (assuming profileID is part of the stored data)
        if (key && key.includes(uniqueId)) {
            // Extract the language from the key (e.g., "course_10634_337_Java")
            const match = key.match(/_(C(?:\+\+)?(?:\d+)?|Java|Python(?:\d+)?)/); // Matches C, C++, C++14, Java, Python3
            const language = match ? match[1] : "Unknown";
            try {
                // Attempt to parse the value as JSON (if applicable)
                const codeContent = JSON.parse(value);
                codeEntries[language] = codeContent; // Add the parsed content
            } catch (e) {
                // If parsing fails, return the raw value
                codeEntries[language] = value;
            }
        }
    }
    if (Object.keys(codeEntries).length === 0) {
        console.warn(`No matching localStorage entries found for unique ID: ${uniqueId}`);
        return null;
    }
    return codeEntries;
}

document.addEventListener("xhrIntercept", (event) => {
    const data = JSON.parse(event.detail.response).data;  // Intercepted data from XHR
    // Store the intercepted data for use in chatbot (excluding body for chat)
    const relevantData = {
        problemDescription: data.body,
        hints: {hint1: data.hints.hint1, hint2: data.hints.hint2}, // Store hints, solution approach, etc.
        solutionApproach: data.hints.solution_approach,
        inputFormat: data.input_format,
        outputFormat: data.output_format,
        constraints: data.constraints
    };
    chrome.storage.local.set({ "interceptedData" : relevantData }, () => {
        console.log("Intercepted data stored.");
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "openChatBot") {
        console.log("Received message to open chatbot");
        openChatBotHandler();
        sendResponse({ status: "Chatbot opened successfully" });
    }
});