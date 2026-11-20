
const studentsTable = document.getElementById("studentsTable");
const totalStudents = document.getElementById("totalStudents");

const searchStudent = document.getElementById("searchStudent");

const addStudentBtn = document.getElementById("addStudentBtn");
const studentModal = document.getElementById("studentModal");
const closeModal = document.getElementById("closeModal");

const studentForm = document.getElementById("studentForm");
const formMessage = document.getElementById("formMessage");

let allStudents = [];


// LOAD STUDENTS
async function loadStudents() {

    try {

        const response = await fetch("/api/students");

        if (!response.ok) {
            throw new Error("Unable to load students");
        }

        allStudents = await response.json();

        totalStudents.textContent = allStudents.length;

        displayStudents(allStudents);

    } catch (error) {

        console.error(error);

        studentsTable.innerHTML = `
            <tr>
                <td colspan="5">Unable to load students. Check the server.</td>
            </tr>
        `;

    }

}


// DISPLAY STUDENTS
function displayStudents(students) {

    if (students.length === 0) {

        studentsTable.innerHTML = `
            <tr>
                <td colspan="5">No registered students yet.</td>
            </tr>
        `;

        return;
    }

    studentsTable.innerHTML = students.map(student => {

        const registeredDate = student.created_at
            ? new Date(student.created_at).toLocaleDateString()
            : "—";

        return `
            <tr>
                <td>${student.student_id}</td>
                <td>${escapeHTML(student.name)}</td>
                <td>${escapeHTML(student.email)}</td>
                <td>${escapeHTML(student.phone || "—")}</td>
                <td>${registeredDate}</td>
            </tr>
        `;

    }).join("");

}


// SAFE TEXT DISPLAY
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


// SEARCH STUDENTS
searchStudent.addEventListener("input", function() {

    const search = this.value.toLowerCase();

    const filteredStudents = allStudents.filter(student =>

        student.name.toLowerCase().includes(search) ||

        student.email.toLowerCase().includes(search)

    );

    displayStudents(filteredStudents);

});


// OPEN REGISTRATION FORM
addStudentBtn.addEventListener("click", () => {

    studentModal.classList.add("show");

});


// CLOSE REGISTRATION FORM
closeModal.addEventListener("click", () => {

    studentModal.classList.remove("show");

});


// REGISTER STUDENT
studentForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const formData = new FormData(studentForm);

    const studentData = Object.fromEntries(formData.entries());

    try {

        formMessage.textContent = "Registering...";

        const response = await fetch("/api/students", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(studentData)

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Registration failed");
        }

        formMessage.textContent = result.message;

        studentForm.reset();

        await loadStudents();

        setTimeout(() => {

            studentModal.classList.remove("show");

            formMessage.textContent = "";

        }, 1200);

    } catch (error) {

        formMessage.textContent = error.message;

    }

});


// INITIAL LOAD
loadStudents();