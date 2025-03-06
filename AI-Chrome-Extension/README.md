# AI Help Chrome Extension

This Chrome extension is designed to provide AI assistance for solving coding problems directly within the browser. It uses the Google Gemini AI model to offer guidance, solutions, and code examples. The extension integrates with a website hosting coding problems, allowing users to easily get help via a chatbot interface.

---

## Features

- **AI Help Button**: Adds an "AI Help" button to coding problem pages. This button opens a chatbot that assists with solving problems, providing hints, and answering related queries.
- **Custom API Key**: Users enter their API key for the AI model via the extension's popup interface. Once entered, the chatbot fetches AI responses using this key.
- **User-friendly UI**: Sleek, modern, and responsive popup and chatbot interfaces with pleasant user interactions.
- **Message History**: Chat history is saved and used to provide contextual information to the AI model.
- **Clear Chat History**: A dedicated button to clear the chat history directly from the chatbot interface, with smooth UI feedback to confirm the action.
- **Input/Output Formatting**: Collects information from the page, including problem descriptions, hints, input/output formats, and constraints, and sends it to the AI for processing.
- **User's Code as Context**: The user's current code, based on the selected language, is included in the prompt sent to the AI to provide relevant code-specific context and suggestions.
- **Theme Change**: The chatbot's theme can now be dynamically changed based on the selected page theme. This feature allows the extension to match the look and feel of the host website by adjusting the UI colors (container background, header, buttons, etc.) based on the active theme.

---

## Installation

### Prerequisites

1. **Chrome Browser**: The extension is built for Chrome, so you will need the Chrome browser installed.
2. **API Key**: Obtain an API key from the Google Gemini API.

### Steps to Install

1. Clone the repository or download the source files.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer Mode" in the top-right corner.
4. Click "Load unpacked" and select the folder containing the extension files.
5. The extension should now appear in your browser's extension bar.

---

## Usage

### Set the API Key

1. After installing the extension, click on the **AI Help** icon while viewing the coding problem page in your browser.
2. A popup to enter your API key will appear.
3. Enter your API key in the popup to enable the AI model.
4. The popup will automatically close, and the chatbot will be ready for use.

### Open AI Help

1. When viewing a coding problem page, an **AI Help** button will appear on the page.
2. Click the button to open the chatbot, which assists with the problem by providing hints, explanations, or code suggestions.

### Interacting with the Chatbot

- Ask specific questions or provide input related to the problem. The AI will respond accordingly.
- The AI will act as a helpful assistant tasked with providing guidance on problem-specific queries.

### Clear Chat History

- Click the **Clear History** button in the chatbot header to delete all past messages.
- A smooth animation and UI feedback will confirm that the chat history has been cleared successfully.

### Theme Change

- The chatbot interface will automatically match the theme of the hosting page. When the page theme is updated (such as through a theme switcher), the chatbot’s appearance will change accordingly.
- The theme color adjustments include background colors, button styles, text color, and more, ensuring the chatbot aligns with the site's overall design.

---

## Features and Flow

### AI Help Button

- Adds an **AI Help** button to coding problem pages.
- Opens a chatbot that assists with problem-solving.
- If no API key is set, the popup prompts the user to input the key.

### Popup (API Key Entry)

- Prompts the user to enter an API key if none is set.
- Saves the API key to `chrome.storage.local` for future use.
- Automatically enables the chatbot after the key is entered.

### Chatbot UI

- Modern, responsive, and user-friendly interface.
- Features a **Clear History** button for resetting the chat, ensuring a clutter-free experience.
- **Dynamic Theme Switching**: The chatbot theme can change based on the active theme of the page being viewed.

### Message Passing

- The extension uses message passing between scripts (`popup.js`, `background.js`, `content.js`) to handle user input and response flow.

---

## Code Structure

1. **background.js**
   - Manages background tasks, including listening for messages and handling chatbot interactions.
   - Sends messages to the content script to open the chatbot.

2. **content.js**
   - Handles the chatbot functionality on the webpage.
   - Receives messages from the background script to open the chatbot UI.

3. **popup.html**
   - Interface for entering the API key.
   - Displays a form for users to input their API key, which is stored in `chrome.storage.local`.

4. **popup.js**
   - Logic for saving the API key, interacting with `chrome.storage.local`, and closing the popup.

---

## Permissions

- **`storage`**: To store the API key in Chrome's local storage.
- **`activeTab`**: To interact with the active tab where the coding problem is displayed.

---

## Future Improvements

- **Multiple AI Model Support**: Allow users to choose between different AI models.
- **Better Error Handling**: Improve error handling for unavailable AI models or invalid API keys.
- **Enhanced UI**: Further enhance chatbot and popup interfaces for a more engaging experience.

---

## Contributing

Feel free to fork the repository and contribute to its development! If you find any bugs or have feature suggestions, please create an issue or submit a pull request.
