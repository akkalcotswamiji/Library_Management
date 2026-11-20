
document.addEventListener("DOMContentLoaded", function () {

    const demoStudents = [
        { id: 1, name: "Aarav Patel", email: "aarav@example.com", phone: "9876501234", date: "10 Nov 2026" },
        { id: 2, name: "Diya Shah", email: "diya@example.com", phone: "9876502345", date: "11 Nov 2026" },
        { id: 3, name: "Rohan Mehta", email: "rohan@example.com", phone: "9876503456", date: "12 Nov 2026" },
        { id: 4, name: "Ananya Desai", email: "ananya@example.com", phone: "9876504567", date: "13 Nov 2026" },
        { id: 5, name: "Vivaan Joshi", email: "vivaan@example.com", phone: "9876505678", date: "14 Nov 2026" }
    ];

    const table = document.getElementById("studentsTable");
    const search = document.getElementById("searchStudent");
    const total = document.getElementById("totalStudents");

    total.textContent = "25";

    function displayStudents(list) {

        table.innerHTML = "";

        if (list.length === 0) {
            table.innerHTML =
                '<tr><td colspan="5">No students found.</td></tr>';
            return;
        }

        list.forEach(student => {

            const row = document.createElement("tr");

            [
                student.id,
                student.name,
                student.email,
                student.phone,
                student.date
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.appendChild(cell);
            });

            table.appendChild(row);
        });
    }

    displayStudents(demoStudents);

    search.addEventListener("input", function () {

        const query = search.value.toLowerCase();

        const filtered = demoStudents.filter(student =>
            student.name.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query)
        );

        displayStudents(filtered);
    });

    const modal = document.getElementById("studentModal");
    const addButton = document.getElementById("addStudentBtn");
    const closeButton = document.getElementById("closeModal");
    const form = document.getElementById("studentForm");
    const message = document.getElementById("formMessage");

    addButton.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        message.textContent =
            "This is a public demo. Registration is disabled.";

        form.reset();
    });

});
