/**
 * Google Apps Script Web App Endpoint
 *
 * Instructions:
 * 1. Open Google Drive -> New -> Google Apps Script.
 * 2. Paste this code into Code.gs.
 * 3. Add an HTML file named "index" and paste the content from index.html (including inline CSS/JS).
 * 4. Click Deploy -> New deployment -> Select 'Web app' -> Execute as 'Me' -> Access 'Anyone'.
 */

function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Discussion Generator')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Optional helper function to pull prompts dynamically from an active Google Sheet
function getPromptsFromSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var prompts = [];

  // Assumes Column A = Category, Column B = Prompt Text (skipping header row)
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] && data[i][1]) {
      prompts.push({
        category: data[i][0].toString().toLowerCase().trim(),
        text: data[i][1].toString()
      });
    }
  }
  return prompts;
}
