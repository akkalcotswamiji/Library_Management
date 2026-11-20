
const issueForm = document.getElementById("issueForm");
const studentSelect = document.getElementById("studentSelect");
const bookSelect = document.getElementById("bookSelect");
const issuesTable = document.getElementById("issuesTable");
const issueMessage = document.getElementById("issueMessage");
const searchIssue = document.getElementById("searchIssue");

let allIssues = [];

async function loadStudents() {
    try {
        const response = await fetch("/api/issues/students");
        if (!response.ok) throw new Error("Could not load students");

        const students = await response.json();

        studentSelect.innerHTML =
            '<option value="">Select a student</option>';

        students.forEach(student => {
            studentSelect.innerHTML += `
                <option value="${student.student_id}">
                    ${escapeHTML(student.name)} (ID: ${student.student_id})
                </option>
            `;
        });

    } catch (error) {
        studentSelect.innerHTML =
            '<option value="">Unable to load students</option>';
        console.error(error);
    }
}

async function loadBooks() {
    try {
        const response = await fetch("/api/issues/books");
        if (!response.ok) throw new Error("Could not load books");

        const books = await response.json();

        bookSelect.innerHTML =
            '<option value="">Select a book</option>';

        books.forEach(book => {
            bookSelect.innerHTML += `
                <option value="${book.book_id}">
                    ${escapeHTML(book.title)}
                    (${book.available_quantity} available)
                </option>
            `;
        });

    } catch (error) {
        bookSelect.innerHTML =
            '<option value="">Unable to load books</option>';
        console.error(error);
    }
}

async function loadIssues() {
    try {
        const response = await fetch("/api/issues");
        if (!response.ok) throw new Error("Could not load records");

        allIssues = await response.json();

        updateStatistics();
        displayIssues(allIssues);

    } catch (error) {
        console.error(error);
        issuesTable.innerHTML =
            '<tr><td colspan="8">Unable to load issued books.</td></tr>';
    }
}

function updateStatistics() {
    document.getElementById("totalIssued").textContent =
        allIssues.length;

    document.getElementById("currentlyIssued").textContent =
        allIssues.filter(i => i.status === "Issued").length;

    document.getElementById("totalReturned").textContent =
        allIssues.filter(i => i.status === "Returned").length;

    document.getElementById("totalOverdue").textContent =
        allIssues.filter(i => i.status === "Overdue").length;
}

function displayIssues(issues) {
    if (issues.length === 0) {
        issuesTable.innerHTML =
            '<tr><td colspan="8">No issued books yet.</td></tr>';
        return;
    }

    issuesTable.innerHTML = issues.map(issue => `
        <tr>
            <td>${issue.issue_id}</td>
            <td>${escapeHTML(issue.student_name)}</td>
            <td>${escapeHTML(issue.book_title)}</td>
            <td>${formatDate(issue.issue_date)}</td>
            <td>${formatDate(issue.due_date)}</td>
            <td>${issue.return_date ? formatDate(issue.return_date) : "—"}</td>
            <td>${issue.status}</td>
            <td>
                ${issue.status !== "Returned"
                    ? `<button class="return-btn"
                        data-id="${issue.issue_id}">
                        Return
                       </button>`
                    : "Completed"}
            </td>
        </tr>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);
    return new Intl.DateTimeFormat("en-IN").format(date);
}

// SET TODAY AS DEFAULT ISSUE DATE
const today = new Date();
const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
].join("-");

document.getElementById("issueDate").value = todayString;
document.getElementById("issueDate").min = todayString;
document.getElementById("dueDate").min = todayString;

// ISSUE BOOK
issueForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const issueData = {
        student_id: studentSelect.value,
        book_id: bookSelect.value,
        issue_date: document.getElementById("issueDate").value,
        due_date: document.getElementById("dueDate").value
    };

    try {
        issueMessage.textContent = "Issuing book...";

        const response = await fetch("/api/issues", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(issueData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Issue failed");
        }

        issueMessage.textContent = result.message;

        issueForm.reset();
        document.getElementById("issueDate").value = todayString;

        await loadIssues();
        await loadBooks();

    } catch (error) {
        issueMessage.textContent = error.message;
    }
});

// RETURN BOOK
issuesTable.addEventListener("click", async function(event) {
    const button = event.target.closest(".return-btn");

    if (!button) return;

    const issueId = button.dataset.id;

    if (!confirm("Are you sure you want to return this book?")) {
        return;
    }

    try {
        button.disabled = true;

        const response = await fetch(
            `/api/issues/${issueId}/return`,
            { method: "PATCH" }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Return failed");
        }

        await loadIssues();
        await loadBooks();

        issueMessage.textContent = result.message;

    } catch (error) {
        alert(error.message);
        button.disabled = false;
    }
});

// SEARCH RECORDS
searchIssue.addEventListener("input", function() {
    const search = this.value.toLowerCase();

    const filtered = allIssues.filter(issue =>
        issue.student_name.toLowerCase().includes(search) ||
        issue.book_title.toLowerCase().includes(search)
    );

    displayIssues(filtered);
});

// INITIAL LOAD
loadStudents();
loadBooks();
loadIssues();