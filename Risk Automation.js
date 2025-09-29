function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Risk_Assessment_Data');
  const lastRow = sheet.getLastRow();

  // Read answers
  const pii = sheet.getRange(lastRow, 4).getValue(); // "Yes"/"No"
  const impact = sheet.getRange(lastRow, 5).getValue(); // Low/Medium/High
  const backup = sheet.getRange(lastRow, 6).getValue(); // Daily/Weekly/Never
  const access = sheet.getRange(lastRow, 7).getValue(); // SSO/MFA/None
  const managedBy = sheet.getRange(lastRow, 8).getValue(); // Internal/3rd Party

  // Scoring logic
  let score = 0;
  score += (pii === 'Yes') ? 5 : 1;
  score += (impact === 'High') ? 10 : (impact === 'Medium') ? 5 : 2;
  score += (backup === 'Never') ? 10 : (backup === 'Weekly') ? 5 : 1;
  score += (access === 'None') ? 5 : (access === 'MFA') ? 2 : 1;
  score += (managedBy === '3rd Party') ? 5 : 2;

  // Risk level
  let riskLevel = 'Low';
  if (score >= 15) {
    riskLevel = 'High';
  } else if (score >= 8) {
    riskLevel = 'Medium';
  }

  // Write back to the sheet
  sheet.getRange(lastRow, 9).setValue(score); // Column H
  sheet.getRange(lastRow, 10).setValue(riskLevel); // Column I

  // Optional: send alert if high risk
  if (riskLevel === 'High') {
    MailApp.sendEmail({
      to: "[YOUR EMAIL/GRC LEAD EMAIL HERE]",
      subject: "⚠️ High Risk Assessment Submitted",
      body: `A High Risk submission was received from ${e.values[1]} (system: ${e.values[2]}). Total score: ${score}`
    });
  }
}
