
document.addEventListener("DOMContentLoaded", function () {

    const demoBooks = [
        { id: 1, title: "The Alchemist", author: "Paulo Coelho", category: "Fiction", quantity: 10, available: 8 },
        { id: 2, title: "Atomic Habits", author: "James Clear", category: "Self Help", quantity: 8, available: 7 },
        { id: 3, title: "Clean Code", author: "Robert C. Martin", category: "Technology", quantity: 5, available: 4 },
        { id: 4, title: "Harry Potter", author: "J.K. Rowling", category: "Fantasy", quantity: 12, available: 10 },
        { id: 5, title: "The Psychology of Money", author: "Morgan Housel", category: "Finance", quantity: 7, available: 6 },
        { id: 6, title: "Ikigai", author: "Hector Garcia", category: "Self Help", quantity: 6, available: 5 },
        { id: 7, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", category: "Finance", quantity: 9, available: 7 },
        { id: 8, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", quantity: 5, available: 4 }
    ];

    const table = document.getElementById("booksTable");
    const search = document.getElementById("searchBook");
    const addButton = document.getElementById("addBookBtn");

    function displayBooks(books) {
        table.innerHTML = "";

        if (books.length === 0) {
            table.innerHTML = '<tr><td colspan="7">No books found.</td></tr>';
            return;
        }

        books.forEach(book => {
            const row = document.createElement("tr");

            const values = [
                book.id,
                book.title,
                book.author,
                book.category,
                book.quantity,
                book.available,
                "Demo"
            ];

            values.forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            table.appendChild(row);
        });
    }

    displayBooks(demoBooks);

    search.addEventListener("input", function () {
        const query = search.value.toLowerCase();

        const filteredBooks = demoBooks.filter(book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );

        displayBooks(filteredBooks);
    });

    addButton.addEventListener("click", function () {
        alert("This is a public demo. Adding books is available in the local application.");
    });

});
