document.addEventListener('DOMContentLoaded', () => {
    const quotes = [
        {
        text: 'Just do it!', 
        category: 'Motivation' 
        },
        {
         text: 'Life is what happens when you are busy making other plans', 
         category: 'Life'
        }, 
        {
        text: 'Live in the moment', 
        category: 'Life'
        }, 
        {
            text: 'Choose joy',
            category: 'happiness'
        }
    ] 
    
    const quoteDisplay = document.getElementById("quoteDisplay"); 
    const newQuoteText = document.getElementById("newQuoteText"); 
    const newQuoteCategory = document.getElementById("newQuoteCategory"); 
    const categorySelect = document.getElementById("category select");  

    const updateCategories = () => {
        const uniqueCategories = [...new Set(quotes.map(quote => quote.category))] 
        categorySelect.innerHTML = "<option value = ''>All categories </option>"; 
        uniqueCategories.forEach(category => {
            const option = document.createElement('option'); 
            option.value = category; 
            option.textContent = category; 
            categorySelect.appendChild(option);
        });
    } 
    const showRandomQuote = () => { 
        const selectedCategory = categorySelect.value; 
        const filteredQuotes = selectedCategory ? quotes.filter(quote => quote.category === selectedCategory) : quotes; 
        const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)]; 
        quoteDisplay.textContent = randomQuote ? randomQuote.text : 'No quotes Available';
 } 
 document.getElementById('newQuote').addEventListener('click', showRandomQuote) 

 window.createAddQuoteForm = () => {
    const newQuote = {
        text: newQuoteText.value, 
        category: newQuoteCategory.value
    }; 
    quotes.push(newQuote); 
    newQuoteText.value = ''; 
    newQuoteCategory.value = ''; 
    updateCategories();
}; 
updateCategories();
});

