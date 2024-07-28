const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your actual API endpoint

let quotes = [];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}

// Function to populate categories dynamically
function populateCategories() {
  const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Clear existing options
  categoryFilter.innerHTML = '';

  // Add options dynamically
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category; // Use textContent to set option text
    categoryFilter.appendChild(option);
  });

  // Set the last selected category if it exists
  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
  }
}

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    populateCategories();  // Update categories after adding a new quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('New quote added successfully!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.createElement('div');
  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.innerText = 'Add Quote';
  addButton.addEventListener('click', addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// Function to export quotes to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();  // Update categories after importing quotes
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('lastSelectedCategory', selectedCategory);
  const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById('quoteDisplay');
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
  } else {
    quoteDisplay.innerHTML = '<p>No quotes available for this category.</p>';
  }
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL); // Replace SERVER_URL with your actual API endpoint
    if (!response.ok) throw new Error('Failed to fetch data from server');
    const serverQuotes = await response.json();
    return serverQuotes; // Adjust based on your API response format
  } catch (error) {
    console.error('Error fetching from server:', error);
    return [];
  }
}

// Function to post quotes to the server
async function postQuotesToServer() {
  try {
    await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quotes)
    });
    console.log('Data successfully posted to server');
  } catch (error) {
    console.error('Error posting to server:', error);
  }
}

// Function to sync quotes with the server
async function syncQuotes() {
  try {
    const serverQuotes = await fetchQuotesFromServer();

    if (serverQuotes.length > 0) {
      // Simple conflict resolution: prioritize server data
      quotes = serverQuotes;
      saveQuotes();
      populateCategories();
      showNotification('Quotes synced with server!');
    }

    // Post local data to server
    await postQuotesToServer();
  } catch (error) {
    console.error('Error syncing quotes:', error);
    showNotification('Error syncing quotes. Please try again.');
  }
}

// Function to show notifications
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Style the notification
  notification.style.position = 'fixed';
  notification.style.bottom = '10px';
  notification.style.right = '10px';
  notification.style.backgroundColor = '#333';
  notification.style.color = '#fff';
  notification.style.padding = '10px';
  notification.style.borderRadius = '5px';
  notification.style.zIndex = '1000';
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notification);
  }, 3000);
}

// Function to start periodic sync
function startSync() {
  setInterval(syncQuotes, 60000); // Sync every 60 seconds
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  loadQuotes();
  populateCategories();
  createAddQuoteForm();
  startSync(); // Start periodic sync
});

// Example of manual sync trigger
document.getElementById('manualSyncButton').addEventListener('click', syncQuotes);

// Display the last viewed quote on page load (if any)
const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
if (lastViewedQuote) {
  const quote = JSON.parse(lastViewedQuote);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>${quote.category}</em></p>`;
}