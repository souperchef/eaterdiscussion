/**
 * Google Apps Script Backend - Secure Endpoint
 * Uses PropertiesService to read API key without exposing it in source code.
 */

function doGet(e) {
  // Pull the API key securely from Google Script Properties
  const GEMINI_API_KEY = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");

  if (!GEMINI_API_KEY) {
    var errorOutput = { status: "error", message: "API key is not configured in Script Properties." };
    return ContentService.createTextOutput(JSON.stringify(errorOutput))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var category = (e && e.parameter && e.parameter.category) ? e.parameter.category : "all";

  var categoryPrompts = {
    "icebreaker": "fun, lighthearted icebreaker question for getting to know people",
    "deep": "deep, thought-provoking, and reflective discussion question",
    "work": "engaging teamwork, workplace, or career productivity discussion topic",
    "fun": "humorous, creative, or completely random hypothetical conversation starter",
    "all": "fun, creative, or thought-provoking conversation starter"
  };

  var promptContext = categoryPrompts[category] || categoryPrompts["all"];
  var promptText = "Generate ONE single " + promptContext + ". " +
                   "Rules: Return ONLY the raw question text. Do not use quotation marks, do not add prefixes like 'Question:' or extra notes.";

  try {
    var url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY;

    var payload = {
      "contents": [
        {
          "parts": [{ "text": promptText }]
        }
      ]
    };

    var options = {
      "method": "post",
      "contentType": "application/json",
      "payload": JSON.stringify(payload),
      "muteHttpExceptions": true
    };

    var response = UrlFetchApp.fetch(url, options);
    var json = JSON.parse(response.getContentText());

    var resultText = "";
    if (json.candidates && json.candidates[0] && json.candidates[0].content && json.candidates[0].content.parts[0]) {
      resultText = json.candidates[0].content.parts[0].text.trim();
    } else {
      resultText = "Unable to generate a question at this moment. Please try again!";
    }

    var output = { status: "success", prompt: resultText };
    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    var errorOutput = { status: "error", message: err.toString() };
    return ContentService.createTextOutput(JSON.stringify(errorOutput))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
