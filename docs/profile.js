
const profileForm = document.getElementById("profileForm");
const passwordForm = document.getElementById("passwordForm");

const profileMessage = document.getElementById("profileMessage");
const passwordMessage = document.getElementById("passwordMessage");

const fullName = document.getElementById("fullName");
const username = document.getElementById("username");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

// LOAD ADMIN PROFILE
async function loadProfile() {
    try {
        const response = await fetch("/api/admin/profile");

        const admin = await response.json();

        if (!response.ok) {
            throw new Error(admin.message || "Unable to load profile.");
        }

        fullName.value = admin.full_name || "";
        username.value = admin.username || "";
        email.value = admin.email || "";
        phone.value = admin.phone || "";

        document.getElementById("profileDisplayName").textContent =
            admin.full_name || admin.username;

        document.getElementById("avatarInitial").textContent =
            (admin.full_name || admin.username).charAt(0).toUpperCase();

    } catch (error) {
        profileMessage.textContent = error.message;
    }
}

// SAVE PROFILE
profileForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const profileData = {
        full_name: fullName.value,
        username: username.value,
        email: email.value,
        phone: phone.value
    };

    try {
        const response = await fetch("/api/admin/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(profileData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        profileMessage.textContent = result.message;

        document.getElementById("profileDisplayName").textContent =
            fullName.value;

        document.getElementById("avatarInitial").textContent =
            fullName.value.charAt(0).toUpperCase();

    } catch (error) {
        profileMessage.textContent = error.message;
    }
});

// CHANGE PASSWORD
passwordForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (newPassword !== confirmPassword) {
        passwordMessage.textContent = "New passwords do not match.";
        return;
    }

    try {
        const response = await fetch("/api/admin/password", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        passwordMessage.textContent = result.message;
        passwordForm.reset();

    } catch (error) {
        passwordMessage.textContent = error.message;
    }
});

loadProfile();