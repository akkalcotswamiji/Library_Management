
const booksTable = document.getElementById("booksTable");
const searchBook = document.getElementById("searchBook");

let allBooks = [];

// FETCH BOOKS FROM MYSQL THROUGH THE API
async function loadBooks() {
    try {
        const response = await fetch("/api/books");

        if (!response.ok) {
            throw new Error("Unable to fetch books");
        }

        allBooks = await response.json();

        displayBooks(allBooks);

    } catch (error) {
        console.error("Error loading books:", error);

        booksTable.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load books. Please check the server.
                </td>
            </tr>
        `;
    }
}


// DISPLAY BOOKS IN TABLE
function displayBooks(books) {

    if (books.length === 0) {
        booksTable.innerHTML = `
            <tr>
                <td colspan="7">No books found.</td>
            </tr>
        `;
        return;
    }

    booksTable.innerHTML = books.map(book => `
        <tr>
            <td>${book.book_id}</td>

            <td>${escapeHTML(book.title)}</td>

            <td>${escapeHTML(book.author)}</td>

            <td>${escapeHTML(book.category_name || "Uncategorised")}</td>

            <td>${book.quantity}</td>

            <td>${book.available_quantity}</td>

            <td>
                <span class="status returned">Available</span>
            </td>
        </tr>
    `).join("");
}


// SAFELY DISPLAY TEXT FROM DATABASE
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}


// SEARCH BOOKS
searchBook.addEventListener("input", function () {

    const searchValue = this.value.toLowerCase();

    const filteredBooks = allBooks.filter(book =>
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue)
    );

    displayBooks(filteredBooks);

});


// LOAD BOOKS WHEN PAGE OPENS
loadBooks();
