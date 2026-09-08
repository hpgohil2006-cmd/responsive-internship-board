"use strict";

/* =========================================
   DOM Elements
========================================= */

const searchForm =
    document.getElementById("searchForm");

const searchInput =
    document.getElementById("searchInput");

const domainFilter =
    document.getElementById("domainFilter");

const modeFilter =
    document.getElementById("modeFilter");

const clearFilters =
    document.getElementById("clearFilters");

const internshipGrid =
    document.getElementById("internshipGrid");

const resultCount =
    document.getElementById("resultCount");

const loadingState =
    document.getElementById("loadingState");

const errorState =
    document.getElementById("errorState");

const emptyState =
    document.getElementById("emptyState");

const retryButton =
    document.getElementById("retryButton");

const detailsModal =
    document.getElementById("detailsModal");

const modalContent =
    document.getElementById("modalContent");

const modalTitle =
    document.getElementById("modalTitle");

const closeModal =
    document.getElementById("closeModal");

const applicationModal =
    document.getElementById("applicationModal");

const closeApplicationModal =
    document.getElementById(
        "closeApplicationModal"
    );

const applicationForm =
    document.getElementById("applicationForm");

const applicationInternshipId =
    document.getElementById(
        "applicationInternshipId"
    );

const applicantName =
    document.getElementById("applicantName");

const applicantEmail =
    document.getElementById("applicantEmail");

const portfolioUrl =
    document.getElementById("portfolioUrl");

const coverMessage =
    document.getElementById("coverMessage");

const applicationMessage =
    document.getElementById(
        "applicationMessage"
    );


/* =========================================
   State
========================================= */

let currentInternships = [];


/* =========================================
   Loading Simulation
========================================= */

async function loadInternships() {

    showLoading();

    try {
        const response = await fetch("/api/internships?limit=100");
        const result = await response.json();
        if (!response.ok || result.status !== "success" || !Array.isArray(result.data)) {
            throw new Error(result.error?.message || "Unable to load internships.");
        }
        currentInternships = result.data;
        hideLoading();
        renderInternships(currentInternships);
    } catch (error) {
        console.error("Internship loading failed:", error.message);
        showError();
    }
}


/* =========================================
   Render Cards
========================================= */

function renderInternships(data) {

    internshipGrid.innerHTML = "";

    resultCount.textContent =
        `${data.length} internship${data.length === 1 ? "" : "s"} found`;

    if (data.length === 0) {

        emptyState.hidden = false;

        return;
    }

    emptyState.hidden = true;

    const fragment =
        document.createDocumentFragment();

    data.forEach((internship) => {

        const card =
            createInternshipCard(internship);

        fragment.appendChild(card);

    });

    internshipGrid.appendChild(fragment);
}


/* =========================================
   Create Internship Card
========================================= */

function createInternshipCard(internship) {

    const article =
        document.createElement("article");

    article.className = "internship-card";

    article.setAttribute(
        "data-id",
        internship.id
    );

    article.innerHTML = `

        <div class="card-top">

            <div>

                <h3 class="card-title">
                    ${escapeHTML(internship.title)}
                </h3>

                <span class="domain-badge">
                    ${escapeHTML(internship.domain)}
                </span>

            </div>

            <span class="mode-badge">
                ${escapeHTML(internship.mode)}
            </span>

        </div>


        <div class="card-details">

            <p>
                📍 ${escapeHTML(internship.location)}
            </p>

            <p>
                👥 ${internship.openings}
                opening${internship.openings === 1 ? "" : "s"}
            </p>

        </div>


        <div class="skills">

            ${internship.skills
                .map(
                    skill => `
                        <span class="skill">
                            ${escapeHTML(skill)}
                        </span>
                    `
                )
                .join("")}

        </div>


        <div class="card-actions">

            <button
                type="button"
                class="card-button details-button"
                data-action="details"
                data-id="${internship.id}"
            >
                View Details
            </button>

            <button
                type="button"
                class="card-button apply-button"
                data-action="apply"
                data-id="${internship.id}"
            >
                Apply
            </button>

        </div>
    `;

    return article;
}


/* =========================================
   Filtering
========================================= */

function filterInternships() {

    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();

    const selectedDomain =
        domainFilter.value;

    const selectedMode =
        modeFilter.value;


    const filtered =
        currentInternships.filter(
            internship => {

                const searchableText = [
                    internship.title,
                    internship.domain,
                    internship.mode,
                    internship.location,
                    ...internship.skills
                ]
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    searchableText.includes(
                        searchTerm
                    );


                const matchesDomain =
                    selectedDomain === "all" ||
                    internship.domain === selectedDomain;


                const matchesMode =
                    selectedMode === "all" ||
                    internship.mode === selectedMode;


                return (
                    matchesSearch &&
                    matchesDomain &&
                    matchesMode
                );
            }
        );


    renderInternships(filtered);
}


/* =========================================
   Search Form
========================================= */

searchForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        filterInternships();

        document
            .getElementById("internships")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================
   Live Search
========================================= */

searchInput.addEventListener(
    "input",
    filterInternships
);

domainFilter.addEventListener(
    "change",
    filterInternships
);

modeFilter.addEventListener(
    "change",
    filterInternships
);


/* =========================================
   Clear Filters
========================================= */

clearFilters.addEventListener(
    "click",
    function () {

        searchInput.value = "";

        domainFilter.value = "all";

        modeFilter.value = "all";

        filterInternships();

        searchInput.focus();

    }
);


/* =========================================
   Card Actions
========================================= */

internshipGrid.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");

        if (!button) {
            return;
        }

        const internshipId =
            button.dataset.id;

        const internship =
            currentInternships.find(
                item =>
                    item.id === internshipId
            );

        if (!internship) {
            return;
        }

        if (
            button.dataset.action ===
            "details"
        ) {

            openDetails(internship);

        }

        if (
            button.dataset.action ===
            "apply"
        ) {

            openApplication(internship);

        }

    }
);


/* =========================================
   Details Modal
========================================= */

function openDetails(internship) {

    modalTitle.textContent =
        internship.title;

    modalContent.innerHTML = `

        <p>
            <strong>Domain:</strong>
            ${escapeHTML(internship.domain)}
        </p>

        <p>
            <strong>Work Mode:</strong>
            ${escapeHTML(internship.mode)}
        </p>

        <p>
            <strong>Location:</strong>
            ${escapeHTML(internship.location)}
        </p>

        <p>
            <strong>Openings:</strong>
            ${internship.openings}
        </p>

        <h3>Required Skills</h3>

        <div class="skills">

            ${internship.skills
                .map(
                    skill => `
                        <span class="skill">
                            ${escapeHTML(skill)}
                        </span>
                    `
                )
                .join("")}

        </div>

        <br>

        <button
            type="button"
            class="primary-button"
            id="modalApplyButton"
        >
            Apply for this Internship
        </button>
    `;


    detailsModal.showModal();


    document
        .getElementById("modalApplyButton")
        .addEventListener(
            "click",
            function () {

                detailsModal.close();

                openApplication(
                    internship
                );

            }
        );
}


closeModal.addEventListener(
    "click",
    () => detailsModal.close()
);


/* =========================================
   Application Modal
========================================= */

function openApplication(internship) {

    applicationInternshipId.value =
        internship.id;

    applicationMessage.textContent = "";

    applicationForm.reset();

    applicationInternshipId.value =
        internship.id;

    applicationModal.showModal();

    applicantName.focus();
}


closeApplicationModal.addEventListener(
    "click",
    () =>
        applicationModal.close()
);


/* =========================================
   Application Submit
========================================= */

applicationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        applicationMessage.textContent = "";


        const name =
            applicantName.value.trim();

        const email =
            applicantEmail.value.trim();

        const portfolio =
            portfolioUrl.value.trim();

        const message =
            coverMessage.value.trim();

        const internshipId =
            applicationInternshipId.value;


        /* Name validation */

        if (name.length < 2) {

            applicationMessage.textContent =
                "Please enter a valid name.";

            applicantName.focus();

            return;
        }


        /* Email validation */

        if (!isValidEmail(email)) {

            applicationMessage.textContent =
                "Please enter a valid email address.";

            applicantEmail.focus();

            return;
        }


        /* URL validation */

        if (
            portfolio &&
            !isSafeURL(portfolio)
        ) {

            applicationMessage.textContent =
                "Please enter a valid HTTPS portfolio URL.";

            portfolioUrl.focus();

            return;
        }


        /* Message validation */

        if (message.length < 20) {

            applicationMessage.textContent =
                "Message must contain at least 20 characters.";

            coverMessage.focus();

            return;
        }


        const submitButton = applicationForm.querySelector("button[type=submit]");
        submitButton.disabled = true;
        applicationMessage.textContent = "Submitting application...";
        applicationMessage.style.color = "";

        try {
            const response = await fetch("/api/applications", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ internshipId, name, email, portfolio, message })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error?.message || "Application could not be submitted.");
            applicationMessage.textContent = "Application submitted successfully!";
            applicationMessage.style.color = "var(--success)";
            applicationForm.reset();
        } catch (error) {
            applicationMessage.textContent = error.message;
            applicationMessage.style.color = "var(--danger)";
        } finally {
            submitButton.disabled = false;
        }

    }
);


/* =========================================
   Application Helpers
========================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


function isSafeURL(url) {

    try {

        const parsed =
            new URL(url);

        return parsed.protocol === "https:";

    } catch {

        return false;
    }
}


/* =========================================
   Loading / Error States
========================================= */

function showLoading() {

    loadingState.hidden = false;

    errorState.hidden = true;

    emptyState.hidden = true;

    internshipGrid.innerHTML = "";
}


function hideLoading() {

    loadingState.hidden = true;
}


function showError() {

    loadingState.hidden = true;

    errorState.hidden = false;

    emptyState.hidden = true;

    internshipGrid.innerHTML = "";

    resultCount.textContent =
        "Unable to load internships";
}


retryButton.addEventListener(
    "click",
    loadInternships
);


/* =========================================
   Accessibility: Escape key
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            if (detailsModal.open) {
                detailsModal.close();
            }

            if (applicationModal.open) {
                applicationModal.close();
            }

        }

    }
);


/* =========================================
   HTML Safety
========================================= */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================
   Start Application
========================================= */

loadInternships(); 