
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const copyBtn = document.getElementById("copyBtn");
const favoritesList = document.getElementById("favoritesList");
const message = document.getElementById("message");

let currentQuote = null;

// Display a message to the user
function showMessage(text) {
  message.textContent = text;
}

// Fetch a random quote
async function getNewQuote() {
  newQuoteBtn.disabled = true;
  showMessage("Loading a new quote...");

  try {
    const response = await fetch("/api/quote");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to fetch quote.");
    }

    currentQuote = {
      quote: data.quote,
      author: data.author
    };

    quoteText.textContent = currentQuote.quote;
    quoteAuthor.textContent = "— " + currentQuote.author;

    showMessage("");
  } catch (error) {
    showMessage(error.message || "Could not load quote. Try again.");
  } finally {
    newQuoteBtn.disabled = false;
  }
}

// Save the current quote as a favorite
async function addFavorite() {
  if (!currentQuote) {
    showMessage("Please load a quote first!");
    return;
  }

  favoriteBtn.disabled = true;

  try {
    const response = await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(currentQuote)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Could not save favorite.");
    }

    showMessage(data.message);
    await loadFavorites();
  } catch (error) {
    showMessage(error.message);
  } finally {
    favoriteBtn.disabled = false;
  }
}

// Copy quote and author to clipboard
async function copyQuote(quote, author) {
  const text = `"${quote}" — ${author}`;

  try {
    await navigator.clipboard.writeText(text);
    showMessage("Quote copied to clipboard! ✅");
  } catch (error) {
    showMessage("Copy failed. Please use a secure browser connection.");
  }
}

// Load favorites history from the backend
async function loadFavorites() {
  favoritesList.textContent = "Loading favorites...";

  try {
    const response = await fetch("/api/favorites");
    const favorites = await response.json();

    if (!response.ok) {
      throw new Error("Unable to load favorites.");
    }

    favoritesList.replaceChildren();

    if (favorites.length === 0) {
      const empty = document.createElement("p");
      empty.className = "empty-message";
      empty.textContent = "No favorites yet. Save a quote you love!";
      favoritesList.appendChild(empty);
      return;
    }

    favorites.forEach((favorite) => {
      const card = document.createElement("article");
      card.className = "favorite-item";

      const quote = document.createElement("p");
      quote.textContent = "“" + favorite.quote + "”";

      const author = document.createElement("p");
      author.className = "author";
      author.textContent = "— " + favorite.author;

      const actions = document.createElement("div");
      actions.className = "favorite-actions";

      const copyButton = document.createElement("button");
      copyButton.textContent = "📋 Copy";
      copyButton.addEventListener("click", () => {
        copyQuote(favorite.quote, favorite.author);
      });

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-btn";
      deleteButton.textContent = "🗑️ Remove";
      deleteButton.addEventListener("click", async () => {
        await deleteFavorite(favorite.id);
      });

      actions.append(copyButton, deleteButton);
      card.append(quote, author, actions);
      favoritesList.appendChild(card);
    });
  } catch (error) {
    favoritesList.textContent = error.message || "Failed to load favorites.";
  }
}

// Delete a saved favorite
async function deleteFavorite(id) {
  try {
    const response = await fetch(`/api/favorites/${id}`, {
      method: "DELETE"
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not remove favorite.");
    }

    showMessage(data.message);
    await loadFavorites();
  } catch (error) {
    showMessage(error.message);
  }
}

// Button events
newQuoteBtn.addEventListener("click", getNewQuote);
favoriteBtn.addEventListener("click", addFavorite);

copyBtn.addEventListener("click", () => {
  if (!currentQuote) {
    showMessage("Please load a quote first!");
    return;
  }

  copyQuote(currentQuote.quote, currentQuote.author);
});

// Load initial quote and saved history
getNewQuote();
loadFavorites();
