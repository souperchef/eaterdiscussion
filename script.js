// Replace the placeholder below with your full Google Apps Script Web App URL
const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

// Reference DOM elements
const categorySelect = document.getElementById("category-select");
const customTopicContainer = document.getElementById("custom-topic-container");
const customTopicInput = document.getElementById("custom-topic-input");
const promptText = document.getElementById("prompt-text");
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");

// Toggle visibility of the custom topic text field based on category selection
categorySelect.addEventListener("change", () => {
  if (categorySelect.value === "custom") {
    customTopicContainer.classList.remove("hidden");
    customTopicInput.focus();
  } else {
    customTopicContainer.classList.add("hidden");
  }
});

// Function to call the Apps Script backend and receive an AI-generated question
async function getRandomPrompt() {
  const selectedCategory = categorySelect.value;
  let customTopic = "";

  // Validation if "Custom Topic" is selected
  if (selectedCategory === "custom") {
    customTopic = customTopicInput.value.trim();
    if (!customTopic) {
      promptText.textContent = "⚠️ Please type a topic in the box above before generating!";
      return;
    }
  }

  // Set loading state in UI
  generateBtn.disabled = true;
  generateBtn.textContent = "✨ Thinking...";
  promptText.textContent = "Generating a unique question with AI...";

  try {
    // Build query parameters
    let requestUrl = `${APPS_SCRIPT_URL}?category=${encodeURIComponent(selectedCategory)}`;
    if (selectedCategory === "custom") {
      requestUrl += `&custom_topic=${encodeURIComponent(customTopic)}`;
    }

    const response = await fetch(requestUrl);
    const data = await response.json();

    if (data.status === "success" && data.prompt) {
      promptText.textContent = data.prompt;
    } else {
      promptText.textContent = "Oops! Could not generate a question. Please try again.";
    }
  } catch (error) {
    console.error("Error fetching prompt:", error);
    promptText.textContent = "Connection error. Make sure your Apps Script URL is updated in script.js!";
  } finally {
    // Reset button state
    generateBtn.disabled = false;
    generateBtn.textContent = "🎲 Generate Prompt";
  }
}

// Function to copy text to clipboard
async function copyToClipboard() {
  const textToCopy = promptText.textContent;
  if (
    !textToCopy || 
    textToCopy.includes("Click the button") || 
    textToCopy.includes("Generating") ||
    textToCopy.includes("⚠️")
  ) return;

  try {
    await navigator.clipboard.writeText(textToCopy);
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✅ Copied!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  } catch (err) {
    alert("Failed to copy text!");
  }
}

// Event Listeners
generateBtn.addEventListener("click", getRandomPrompt);
copyBtn.addEventListener("click", copyToClipboard);
