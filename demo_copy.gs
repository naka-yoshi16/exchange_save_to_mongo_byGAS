function lookupInspection() {
 const activeSheetsApp = SpreadsheetApp.getActiveSpreadsheet();
 const sheet = activeSheetsApp.getSheets()[0];
//  const sheet = activeSheetsApp.getSheets()[1];
//  const partialName = sheet.getRange("B1").getValue();
 const partialName = sheet.getRange("a5").getValue();
 SpreadsheetApp.getUi().alert(partialName)
}