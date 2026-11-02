
"use strict";

// Internship Application Tracker
// TCSS 490 - Artifact 4

const STORAGE_KEY = "internshipApplications";

const STATUSES = [
    "Saved",
    "Applied",
    "Interviewing",
    "Offered",
    "Rejected"
];

let applications = [];

// Get an HTML element by its ID
function getElement(id) {
    return document.getElementById(id);
}

// Load saved applications
function loadApplications() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];

        applications = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("Unable to load applications:", error);
        applications = [];
    }
}

// Save applications in the browser
function saveApplications() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(applications)
        );
        return true;
    } catch (error) {
        console.error("Unable to save applications:", error);
        alert("Unable to save your data. Check browser storage.");
        return false;
    }
}

// Generate a unique application ID
function createId() {
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return Date.now().toString() +
        Math.random().toString(36).slice(2);
}

// Display dates without timezone issues
function formatDate(dateString) {
    if (!dateString) return "Not set";

    const parts = dateString.split("-");

    if (parts.length !== 3) return dateString;

    const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

// Check how close an application deadline is
function getDeadlineMessage(deadline) {
    if (!deadline) return "No deadline set";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parts = deadline.split("-");

    const dueDate = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

    const days = Math.round(
        (dueDate - today) / 86400000
    );

    if (days < 0) return "Deadline passed";
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    if (days <= 7) return `Due in ${days} days`;

    return formatDate(deadline);
}

// Update the dashboard statistics
function updateStatistics() {
    const total = applications.length;

    const applied = applications.filter(
        app => app.status === "Applied"
    ).length;

    const interviewing = applications.filter(
        app => app.status === "Interviewing"
    ).length;

    const offers = applications.filter(
        app => app.status === "Offered"
    ).length;

    getElement("total").textContent = total;
    getElement("applied").textContent = applied;
    getElement("interviewing").textContent = interviewing;
    getElement("offers").textContent = offers;
}

// Create a small labeled detail element
function createDetail(label, value) {
    const detail = document.createElement("div");
    detail.className = "application-detail";

    const labelElement = document.createElement("small");
    labelElement.textContent = label + ": ";

    const valueElement = document.createElement("span");
    valueElement.textContent = value;

    detail.append(labelElement, valueElement);

    return detail;
}

// Create a button
function createButton(label, className, callback) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.className = className;

    button.addEventListener("click", callback);

    return button;
}

// Display all matching applications
function renderApplications() {
    const container = getElement("list");
    const searchInput = getElement("search");
    const statusFilter = getElement("filter");

    const search = searchInput.value.trim().toLowerCase();
    const selectedStatus = statusFilter.value;

    const filtered = applications.filter(app => {
        const company = String(app.company || "");
        const position = String(app.position || "");

        const matchesSearch =
            company.toLowerCase().includes(search) ||
            position.toLowerCase().includes(search);

        const matchesStatus =
            selectedStatus === "All" ||
            app.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    container.replaceChildren();

    if (filtered.length === 0) {
        const empty = document.createElement("div");
        empty.className = "empty-state";

        const heading = document.createElement("h3");
        const message = document.createElement("p");

        if (applications.length === 0) {
            heading.textContent = "No applications yet";
            message.textContent =
                "Click Add application to start tracking internships.";
        } else {
            heading.textContent = "No matching applications";
            message.textContent =
                "Try changing your search or status filter.";
        }

        empty.append(heading, message);
        container.appendChild(empty);

        updateStatistics();
        return;
    }

    // Sort by nearest deadline
    filtered.sort((a, b) => {
        const dateA = a.deadline || "9999-12-31";
        const dateB = b.deadline || "9999-12-31";

        return dateA.localeCompare(dateB);
    });

    filtered.forEach(app => {
        const card = document.createElement("article");
        card.className = "application-card";

        const heading = document.createElement("div");
        heading.className = "application-heading";

        const company = document.createElement("h3");
        company.textContent = app.company;

        const position = document.createElement("p");
        position.textContent = app.position;

        const status = document.createElement("span");
        status.className = "status-badge";
        status.textContent = app.status;

        heading.append(company, position, status);

        const details = document.createElement("div");
        details.className = "application-details";

        details.appendChild(
            createDetail(
                "Applied",
                formatDate(app.date)
            )
        );

        details.appendChild(
            createDetail(
                "Deadline",
                getDeadlineMessage(app.deadline)
            )
        );

        if (app.notes) {
            details.appendChild(
                createDetail("Notes", app.notes)
            );
        }

        if (app.url) {
            try {
                const parsedUrl = new URL(app.url);

                if (
                    parsedUrl.protocol === "https:" ||
                    parsedUrl.protocol === "http:"
                ) {
                    const link = document.createElement("a");
                    link.href = parsedUrl.href;
                    link.textContent = "View application";
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";

                    details.appendChild(link);
                }
            } catch (error) {
                console.warn("Invalid application URL");
            }
        }

        const actions = document.createElement("div");
        actions.className = "application-actions";

        const editButton = createButton(
            "Edit",
            "edit-btn",
            () => openEditForm(app.id)
        );

        const deleteButton = createButton(
            "Delete",
            "delete-btn",
            () => deleteApplication(app.id)
        );

        actions.append(editButton, deleteButton);

        card.append(heading, details, actions);
        container.appendChild(card);
    });

    updateStatistics();
}

// Open the form for a new application
function openAddForm() {
    const form = getElement("appForm");

    form.reset();

    getElement("editId").value = "";
    getElement("formTitle").textContent = "Add application";

    getElement("status").value = "Applied";

    getElement("modal").showModal();
    getElement("company").focus();
}

// Open the form to edit an existing application
function openEditForm(id) {
    const app = applications.find(
        item => String(item.id) === String(id)
    );

    if (!app) return;

    getElement("editId").value = app.id;
    getElement("company").value = app.company || "";
    getElement("position").value = app.position || "";
    getElement("status").value = app.status || "Applied";
    getElement("date").value = app.date || "";
    getElement("deadline").value = app.deadline || "";
    getElement("url").value = app.url || "";
    getElement("notes").value = app.notes || "";

    getElement("formTitle").textContent = "Edit application";

    getElement("modal").showModal();
    getElement("company").focus();
}

// Read the application form
function readFormData() {
    return {
        company: getElement("company").value.trim(),
        position: getElement("position").value.trim(),
        status: getElement("status").value,
        date: getElement("date").value,
        deadline: getElement("deadline").value,
        url: getElement("url").value.trim(),
        notes: getElement("notes").value.trim()
    };
}

// Add or update an application
function handleFormSubmit(event) {
    event.preventDefault();

    const data = readFormData();
    const editId = getElement("editId").value;

    if (!data.company || !data.position) {
        alert("Please enter a company and position.");
        return;
    }

    if (!STATUSES.includes(data.status)) {
        alert("Please select a valid status.");
        return;
    }

    if (
        data.deadline &&
        data.date &&
        data.deadline < data.date
    ) {
        if (!confirm(
            "The deadline is before the application date. Save anyway?"
        )) {
            return;
        }
    }

    const previous = [...applications];

    if (editId) {
        const index = applications.findIndex(
            app => String(app.id) === editId
        );

        if (index === -1) {
            alert("Application not found.");
            return;
        }

        applications[index] = {
            ...applications[index],
            ...data
        };
    } else {
        applications.push({
            id: createId(),
            ...data,
            createdAt: new Date().toISOString()
        });
    }

    if (!saveApplications()) {
        applications = previous;
        return;
    }

    getElement("modal").close();
    getElement("appForm").reset();

    renderApplications();
}

// Delete an application
function deleteApplication(id) {
    const app = applications.find(
        item => String(item.id) === String(id)
    );

    if (!app) return;

    const confirmed = confirm(
        `Delete the application for ${app.company}?`
    );

    if (!confirmed) return;

    const previous = [...applications];

    applications = applications.filter(
        item => String(item.id) !== String(id)
    );

    if (!saveApplications()) {
        applications = previous;
        return;
    }

    renderApplications();
}

// Export all applications as JSON
function exportApplications() {
    const json = JSON.stringify(applications, null, 2);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "internship-applications.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Validate imported applications
function validateImportedApplications(data) {
    if (!Array.isArray(data)) {
        throw new Error("The JSON file must contain an array.");
    }

    return data.map((item, index) => {
        if (
            !item ||
            typeof item !== "object" ||
            typeof item.company !== "string" ||
            typeof item.position !== "string" ||
            !item.company.trim() ||
            !item.position.trim()
        ) {
            throw new Error(
                `Invalid application at position ${index + 1}.`
            );
        }

        const status = STATUSES.includes(item.status)
            ? item.status
            : "Saved";

        return {
            id: createId(),
            company: item.company.trim().slice(0, 100),
            position: item.position.trim().slice(0, 120),
            status,
            date: typeof item.date === "string"
                ? item.date
                : "",
            deadline: typeof item.deadline === "string"
                ? item.deadline
                : "",
            url: typeof item.url === "string"
                ? item.url
                : "",
            notes: typeof item.notes === "string"
                ? item.notes.slice(0, 1500)
                : "",
            createdAt: typeof item.createdAt === "string"
                ? item.createdAt
                : new Date().toISOString()
        };
    });
}

// Import applications from a JSON file
async function importApplications(file) {
    if (!file) return;

    try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        const imported = validateImportedApplications(parsed);

        const confirmed = confirm(
            `Import ${imported.length} applications? ` +
            "This will replace your current applications. " +
            "Export a backup first if you want to keep them."
        );

        if (!confirmed) return;

        const previous = [...applications];

        applications = imported;

        if (!saveApplications()) {
            applications = previous;
            return;
        }

        renderApplications();

        alert("Applications imported successfully!");
    } catch (error) {
        console.error("Import failed:", error);

        alert(
            "Unable to import the file: " + error.message
        );
    }
}

// Connect the interface to JavaScript
function initializeApp() {
    loadApplications();

    // Add application button
    getElement("addBtn").addEventListener(
        "click",
        openAddForm
    );

    // Close form button
    getElement("closeBtn").addEventListener(
        "click",
        () => getElement("modal").close()
    );

    // Close dialog when clicking its backdrop
    getElement("modal").addEventListener(
        "click",
        event => {
            if (event.target === getElement("modal")) {
                getElement("modal").close();
            }
        }
    );

    // Form submission
    getElement("appForm").addEventListener(
        "submit",
        handleFormSubmit
    );

    // Search applications
    getElement("search").addEventListener(
        "input",
        renderApplications
    );

    // Filter applications by status
    getElement("filter").addEventListener(
        "change",
        renderApplications
    );

    // Export applications
    getElement("exportBtn").addEventListener(
        "click",
        exportApplications
    );

    // Import applications
    getElement("importFile").addEventListener(
        "change",
        async event => {
            const file = event.target.files[0];

            if (file) {
                await importApplications(file);
            }

            event.target.value = "";
        }
    );

    // Initial dashboard display
    renderApplications();
}

// Start once the HTML has loaded
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );
} else {
    initializeApp();
}
