// --- CONFIGURATION ---
const GOOGLE_REVIEW_URL = "https://www.google.com/search?q=%D0%9E%D1%85%D0%BE%D1%80%D0%BE%D0%BD%D0%BD%D0%B5+%D0%BF%D1%96%D0%B4%D0%BF%D1%80%D0%B8%D1%94%D0%BC%D1%81%D1%82%D0%B2%D0%BE+%D0%90%D0%9F%D0%A1&rlz=1C1RXQR_enCA1146CA1146&oq=&gs_lcrp=EgZjaHJvbWUqCQgBEEUYOxjCAzIJCAAQIxgnGOoCMgkIARBFGDsYwgPSAQkxNDc4ajBqMTWoAgKwAgHxBRPonzQY31mD&sourceid=chrome&ie=UTF-8#mpd=~315244133773608684/customers/reviews"; // IMPORTANT: Replace with the client's real Place ID
const REVIEW_ITEMS = [
    { label: "Your detailed review text", value: "The support was incredibly fast and helpful. They solved my issue in under 5 minutes, and I would highly recommend them to anyone." },
    { label: "A title for your review (optional)", value: "Excellent Service!" }
];

// --- STATE MANAGEMENT ---
let currentItemIndex = 0;
let companionWindow = null;

// --- DOM ELEMENTS ---
const initialStateEl = document.getElementById('initial-state');
const pastingStateEl = document.getElementById('pasting-state');
const blockedStateEl = document.getElementById('blocked-state');
const reviewItemsListEl = document.getElementById('review-items-list');
const instructionTextEl = document.getElementById('instruction-text');
const finalSubmitButtonEl = document.getElementById('final-submit-button');

// --- CORE FUNCTIONS ---

function startGuidedReview() {
    // Open the companion window. Sizing can be adjusted.
    const windowFeatures = 'width=600,height=700,noopener,noreferrer';
    companionWindow = window.open(GOOGLE_REVIEW_URL, 'ReviewFlowCompanion', windowFeatures);

    // Pop-up Blocker Detection
    if (!companionWindow || companionWindow.closed || typeof companionWindow.closed === 'undefined') {
        // If the window failed to open, it was likely blocked.
        initialStateEl.classList.add('hidden');
        blockedStateEl.classList.remove('hidden');
    } else {
        // If it succeeded, start the process.
        initialStateEl.classList.add('hidden');
        pastingStateEl.classList.remove('hidden');
        
        setupPastingUI();
        copyNextItem();

        // Focus the main window to ensure onfocus listener is ready.
        window.focus(); 
    }
}

function handleBlockedPopup() {
    // Fallback: Open in a new tab instead
    window.open(GOOGLE_REVIEW_URL, '_blank');
    // You might want to update the UI further here
    blockedStateEl.innerHTML = `<h1>New Tab Opened</h1><p>Please switch to the new tab to continue. Return here when you're done to confirm.</p><button class="final-submit-button" onclick="confirmSubmission()">✅ I've Submitted My Review!</button>`;
}

function copyNextItem() {
    if (currentItemIndex < REVIEW_ITEMS.length) {
        const item = REVIEW_ITEMS[currentItemIndex];
        navigator.clipboard.writeText(item.value);
        
        updatePastingUI();
        currentItemIndex++;
    } else {
        // All items have been copied
        instructionTextEl.textContent = "All items copied! Just click 'Post' in the other window, then confirm below.";
        finalSubmitButtonEl.classList.remove('hidden');
    }
}

// --- UI HELPER FUNCTIONS ---

function setupPastingUI() {
    reviewItemsListEl.innerHTML = ''; // Clear previous items
    REVIEW_ITEMS.forEach((item, index) => {
        const li = document.createElement('div');
        li.classList.add('review-item');
        li.id = `item-${index}`;
        li.textContent = item.label;
        reviewItemsListEl.appendChild(li);
    });
}

function updatePastingUI() {
    // Mark previous item as completed
    if (currentItemIndex > 0) {
        document.getElementById(`item-${currentItemIndex - 1}`).classList.add('completed');
    }
    
    // Highlight the current item
    const currentItemEl = document.getElementById(`item-${currentItemIndex}`);
    if (currentItemEl) {
        currentItemEl.classList.add('current');
        instructionTextEl.innerHTML = `<b>Copied:</b> <i>"${REVIEW_ITEMS[currentItemIndex].label}"</i>. Paste it, then click back to this window.`;
    }
}

function confirmSubmission() {
    console.log('User has confirmed submission! Starting verification process...');
    pastingStateEl.innerHTML = `
        <header>
            <h1>Submission Received! Thank You.</h1>
            <p>Our system will now monitor for your review. We'll notify you as soon as it's published and your reward is sent.</p>
        </header>
    `;
    if(companionWindow) companionWindow.close(); // Close the companion window
}

// --- THE MAGIC EVENT LISTENER ---
window.onfocus = () => {
    // This checks if the process has started and is not yet complete.
    if (companionWindow && !companionWindow.closed && currentItemIndex > 0 && currentItemIndex <= REVIEW_ITEMS.length) {
        console.log("Main window refocused, copying next item!");
        copyNextItem();
    }
};

