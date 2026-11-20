
async function loadDashboard() {
    try {
        const response = await fetch("/api/test-db");

        if (!response.ok) {
            throw new Error("Unable to load dashboard data");
        }

        const data = await response.json();

        document.getElementById("totalBooks").textContent =
            data.totalBooks;

        document.getElementById("availableBooks").textContent =
            data.totalBooks;

    } catch (error) {
        console.error("Dashboard error:", error.message);
    }
}

loadDashboard();
