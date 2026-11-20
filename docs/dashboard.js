
document.addEventListener("DOMContentLoaded", function () {

    // Demo statistics for the public GitHub Pages website
    const dashboardData = {
        totalBooks: 100,
        availableBooks: 85,
        totalStudents: 25,
        issuedBooks: 15
    };

    const totalBooks = document.getElementById("totalBooks");
    const availableBooks = document.getElementById("availableBooks");
    const totalStudents = document.getElementById("totalStudents");
    const issuedBooks = document.getElementById("issuedBooks");

    if (totalBooks) {
        totalBooks.textContent = dashboardData.totalBooks;
    }

    if (availableBooks) {
        availableBooks.textContent = dashboardData.availableBooks;
    }

    if (totalStudents) {
        totalStudents.textContent = dashboardData.totalStudents;
    }

    if (issuedBooks) {
        issuedBooks.textContent = dashboardData.issuedBooks;
    }

});
