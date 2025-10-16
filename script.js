function copyToClipboard(textToCopy) {
  navigator.clipboard.writeText(textToCopy).then(() => {
    console.log('Text copied to clipboard:', textToCopy);
    // Optional: Add visual feedback, like a "Copied!" tooltip.
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

function confirmSubmission() {
  // This is where you trigger the backend to start the verification bot.
  console.log('User has confirmed submission! Starting verification process...');
  
  // You would then hide the cockpit and show the final success message.
  document.body.innerHTML = `
    <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100vh; text-align:center; padding: 2rem;">
      <h1>Submission Received! Thank You.</h1>
      <p style="margin-top: 1rem; font-size: 1.25rem; color: #667085;">Our system will now monitor the page for your review. We'll notify you as soon as it's published and your reward is sent.</p>
    </div>
  `;
}
