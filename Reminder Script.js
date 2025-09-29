function sendQuarterlyReminder() {
  const recipients = ["user1@example.com", "user2@example.com"];
  const formURL = "https://forms.gle/your-form-link";

  recipients.forEach(email => {
    MailApp.sendEmail({
      to: email,
      subject: "📝 Quarterly Risk Assessment Reminder",
      body: `Please complete the quarterly GRC risk assessment: ${formURL}`
    });
  });
}
