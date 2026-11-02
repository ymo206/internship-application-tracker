
const STORAGE_KEY = "internshipApplications";

let applications = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

function saveApplications() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

function addApplication(company, position, date, deadline, status) {
    const application = {
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        company,
        position,
        date,
        deadline,
        status
    };

    applications.push(application);
    saveApplications();
    renderApplications();
}

function deleteApplication(id) {
    if (!confirm("Are you sure you want to delete this application?")) {
        return;
    }

    applications = applications.filter(app => app.id !== id);
    saveApplications();
    renderApplications();
}

function updateApplication(id, updates) {
    const application = applications.find(app => app.id === id);

    if (!application) return;

    Object.assign(application, updates);
    saveApplications();
    renderApplications();
}

function updateStatistics() {
    const total = applications.length;
    const applied = applications.filter(app => app.status === "Applied").length;
    const interviewing = applications.filter(app => app.status === "Interviewing").length;
    const offered = applications.filter(app => app.status === "Offered").length;

    const stats = {
        "totalApplications": total,
        "appliedCount": applied,
        "interviewCount": interviewing,
        "offerCount": offered
    };

    Object.entries(stats).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
}

function renderApplications() {
    const tableBody = document.getElementById("applicationsTable");
    const applicationList = document.getElementById("applicationList");

    const container = tableBody || applicationList;

    if (!container) {
        updateStatistics();
        return;
    }

    const search = (
        document.getElementById("searchInput")?.value || ""
    ).toLowerCase();

    const statusFilter =
        document.getElementById("statusFilter")?.value || "All";

    const filtered = applications.filter(app => {
        const matchesSearch =
            app.company.toLowerCase().includes(search) ||
            app.position.toLowerCase().includes(search);

        const matchesStatus =
            statusFilter === "All" ||
            statusFilter === "All Statuses" ||
            app.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    container.innerHTML = "";

    if (filtered.length === 0) {
        const message = document.createElement(
            tableBody ? "tr" : "div"
        );

        if (tableBody) {
            const cell = document.createElement("td");
            cell.colSpan = 6;
            cell.textContent = "No applications found.";
            message.appendChild(cell);
        } else {
            message.textContent = "No applications found.";
        }

        container.appendChild(message);
        updateStatistics();
        return;
    }

    filtered.forEach(app => {
        const row = document.createElement(
            tableBody ? "tr" : "div"
        );

        if (!tableBody) row.className = "application-card";

        const fields = [
            app.company,
            app.position,
            app.date || "Not set",
            app.deadline || "Not set",
            app.status
        ];

        fields.forEach(value => {
            const cell = document.createElement(
                tableBody ? "td" : "div"
            );

            cell.textContent = value;
            row.appendChild(cell);
        });

        const actions = document.createElement(
            tableBody ? "td" : "div"
        );

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";
        editButton.addEventListener("click", () => editApplication(app.id));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteApplication(app.id));

        actions.append(editButton, deleteButton);
        row.appendChild(actions);
        container.appendChild(row);
    });

    updateStatistics();
}

function editApplication(id) {
    const app = applications.find(item => item.id === id);
    if (!app) return;

    const company = prompt("Company name:", app.company);
    if (company === null) return;

    const position = prompt("Position:", app.position);
    if (position === null) return;

    const status = prompt(
        "Status (Applied, Interviewing, Offered, Rejected):",
        app.status
    );

    if (status === null) return;

    const validStatuses = [
        "Applied",
        "Interviewing",
        "Offered",
        "Rejected"
    ];

    const normalizedStatus = validStatuses.find(
        item => item.toLowerCase() === status.trim().toLowerCase()
    );

    if (!company.trim() || !position.trim() || !normalizedStatus) {
        alert("Enter a company, position, and valid status.");
        return;
    }

    updateApplication(id, {
        company: company.trim(),
        position: position.trim(),
        status: normalizedStatus
    });
}

function exportApplications() {
    const data = JSON.stringify(applications, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "internship-applications.json";
    link.click();

    URL.revokeObjectURL(url);
}

function importApplications(file) {
    const reader = new FileReader();

    reader.onload = function () {
        try {
            const imported = JSON.parse(reader.result);

            if (!Array.isArray(imported)) {
                throw new Error("Invalid file format");
            }

            const validStatuses = [
                "Applied",
                "Interviewing",
                "Offered",
                "Rejected"
            ];

            const cleaned = imported.map(item => {
                if (
                    !item ||
                    typeof item.company !== "string" ||
                    typeof item.position !== "string" ||
                    !validStatuses.includes(item.status)
                ) {
                    throw new Error("Invalid application data");
                }

                return {
                    id: crypto.randomUUID(),
                    company: item.company,
                    position: item.position,
                    date: typeof item.date === "string" ? item.date : "",
                    deadline: typeof item.deadline === "string" ? item.deadline : "",
                    status: item.status
                };
            });

            applications = cleaned;
            saveApplications();
            renderApplications();
            alert("Applications imported successfully!");
        } catch (error) {
            alert("Unable to import this JSON file.");
        }
    };

    reader.readAsText(file);
}

document.addEventListener("DOMContentLoaded", () => {
    const form =
        document.getElementById("applicationForm") ||
        document.getElementById("internshipForm");

    if (form) {
        form.addEventListener("submit", event => {
            event.preventDefault();

            const company = document.getElementById("company")?.value.trim();
            const position = document.getElementById("position")?.value.trim();

            const date =
                document.getElementById("applicationDate")?.value ||
                document.getElementById("date")?.value ||
                "";

            const deadline =
                document.getElementById("deadline")?.value || "";

            const status =
                document.getElementById("status")?.value || "Applied";

            if (!company || !position) {
                alert("Please enter a company and position.");
                return;
            }

            addApplication(company, position, date, deadline, status);
            form.reset();
        });
    }

    document.getElementById("searchInput")?.addEventListener(
        "input",
        renderApplications
    );

    document.getElementById("statusFilter")?.addEventListener(
        "change",
        renderApplications
    );

    document.getElementById("exportButton")?.addEventListener(
        "click",
        exportApplications
    );

    document.getElementById("importFile")?.addEventListener(
        "change",
        event => {
            const file = event.target.files[0];
            if (file) importApplications(file);
            event.target.value = "";
        }
    );

    renderApplications();
});
