document.addEventListener("DOMContentLoaded", fetchBooks);

function fetchBooks() {
  fetch("/api/books")
    .then((response) => response.json())
    .then(displayBooks)
    .catch((error) => console.error("Error fetching books:", error));
}

function displayBooks(books) {
  const libraryContainer = document.getElementById("card-container");
  books.forEach((book) => {
    const bookCard = createBookCard(book);
    libraryContainer.appendChild(bookCard);
  });
}

function createBookCard(book) {
  const card = document.createElement("div");
  card.className = "card";
  card.onclick = () => window.open(book.Link, "_blank");

  const title = document.createElement("h1");
  title.textContent = book.Name;
  card.appendChild(title);

  return card;
}
