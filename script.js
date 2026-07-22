// Replace the placeholder below with your full Google Apps Script Web App URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyFanYz-MZpvBRgfn3XxCln-hzV-_7llZau4jRoI_Ml0QWfwE-NgYSMZUeNanlpaCXz/exec";

// Reference DOM elements
const categorySelect = document.getElementById("category-select");
const promptText = document.getElementById("prompt-text");
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");

// Function to call the Apps Script backend and receive an AI-generated question
async function getRandomPrompt() {
  const selectedCategory = categorySelect.value;

  // Set loading state in UI
  generateBtn.disabled = true;
  generateBtn.textContent = "✨ Thinking...";
  promptText.textContent = "Generating a unique question with AI...";

  try {
    const response = await fetch(`${APPS_SCRIPT_URL}?category=${encodeURIComponent(selectedCategory)}`);
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
  if (!textToCopy || textToCopy.includes("Click the button") || textToCopy.includes("Generating")) return;

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
