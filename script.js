// Default list of discussion prompts categorized by topic
const prompts = [
  // Icebreakers
  { category: "icebreaker", text: "What is your absolute favorite way to spend a rainy Sunday?" },
  { category: "icebreaker", text: "If you could instantly become an expert in one skill, what would it be?" },
  { category: "icebreaker", text: "What was your very first concert or movie in a theater?" },
  { category: "icebreaker", text: "What is a food combination that sounds weird but tastes amazing?" },

  // Deep & Reflective
  { category: "deep", text: "What is a piece of advice you received years ago that still guides you today?" },
  { category: "deep", text: "How has your definition of success changed over the last 5 years?" },
  { category: "deep", text: "What is something you used to strongly believe, but changed your mind about?" },
  { category: "deep", text: "What hobby or activity makes you completely lose track of time?" },

  // Work & Teamwork
  { category: "work", text: "What small habit or tool has made the biggest impact on your daily productivity?" },
  { category: "work", text: "What is one thing our team does really well, and one area where we can improve?" },
  { category: "work", text: "How do you prefer to recharge during a busy workday?" },
  { category: "work", text: "What is the most useful piece of constructive feedback you've ever received?" },

  // Fun & Random
  { category: "fun", text: "If you were forced to live in a fictional movie universe, which one would you pick?" },
  { category: "fun", text: "What would the title of your autobiography be?" },
  { category: "fun", text: "If animals could talk, which species would be the rudest?" },
  { category: "fun", text: "You get a free billboard in the middle of Times Square. What do you put on it?" }
];

// Reference DOM elements
const categorySelect = document.getElementById("category-select");
const promptText = document.getElementById("prompt-text");
const generateBtn = document.getElementById("generate-btn");
const copyBtn = document.getElementById("copy-btn");

let lastIndex = -1;

// Function to generate a random discussion topic based on category selection
function getRandomPrompt() {
  const selectedCategory = categorySelect.value;

  const filteredPrompts = selectedCategory === "all" 
    ? prompts 
    : prompts.filter(p => p.category === selectedCategory);

  if (filteredPrompts.length === 0) {
    promptText.textContent = "No prompts found for this category!";
    return;
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * filteredPrompts.length);
  } while (filteredPrompts.length > 1 && randomIndex === lastIndex);

  lastIndex = randomIndex;
  promptText.textContent = filteredPrompts[randomIndex].text;
}

// Function to copy the text prompt to clipboard
async function copyToClipboard() {
  const textToCopy = promptText.textContent;
  if (!textToCopy || textToCopy.includes("Click the button")) return;

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
