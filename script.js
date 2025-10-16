function copyToClipboard(textToCopy) {
  navigator.clipboard.writeText(textToCopy).then(() => {
    // Optional: Give the user feedback that it worked!
    console.log('Text copied to clipboard');
    // You could change the button text to "Copied!" for a second.
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

function confirmSubmission() {
  // This is where you send a signal to your backend
  // that the user has finished the process.
  console.log('User has confirmed submission!');
  // Example: api.post('/submission-confirmed', { userId: '123' });
  // Then you would show the final "Thank You" screen.
}