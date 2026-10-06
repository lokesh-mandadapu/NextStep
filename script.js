/* =====================================================
   NEXTSTEP JAVASCRIPT
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       ELEMENTS
    ================================================= */

    const loginPage = document.getElementById("loginPage");

    const app = document.getElementById("app");

    const loginForm = document.getElementById("loginForm");

    const loginError = document.getElementById("loginError");

    const logoutButton =
        document.getElementById("logoutButton");

    const pageTitle =
        document.getElementById("pageTitle");

    const navItems =
        document.querySelectorAll(".nav-item");

    const pages =
        document.querySelectorAll(".page");


    const modalOverlay =
        document.getElementById("modalOverlay");

    const modalTitle =
        document.getElementById("modalTitle");

    const modalContent =
        document.getElementById("modalContent");

    const closeModal =
        document.getElementById("closeModal");

    const toast =
        document.getElementById("toast");


    /* =================================================
       PAGE NAMES
    ================================================= */

    const pageNames = {

        dashboard: "Dashboard",

        skills: "My Skills",

        verification: "Skill Verification",

        gap: "Career Gap",

        exchange: "Skill Exchange",

        market: "Market Insights",

        progress: "Progress",

        profile: "Profile"

    };


    /* =================================================
       LOGIN
    ================================================= */

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const email =
                document.getElementById("email")
                .value
                .trim();

            const password =
                document.getElementById("password")
                .value;


            if (!email.includes("@")) {

                loginError.textContent =
                    "Please enter a valid email.";

                return;

            }


            if (password.length < 4) {

                loginError.textContent =
                    "Password must contain at least 4 characters.";

                return;

            }


            loginError.textContent = "";


            loginPage.classList.add("hidden");

            app.classList.remove("hidden");


            showToast(
                "Welcome to NextStep!"
            );


            navigateTo("dashboard");

        }
    );


    /* =================================================
       LOGOUT
    ================================================= */

    logoutButton.addEventListener(
        "click",
        function () {

            app.classList.add("hidden");

            loginPage.classList.remove("hidden");

            loginForm.reset();

            showToast(
                "You have been logged out."
            );

        }
    );


    /* =================================================
       NAVIGATION
    ================================================= */

    navItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const page =
                    item.dataset.page;

                navigateTo(page);

            }
        );

    });


    function navigateTo(page) {

        /* Hide all pages */

        pages.forEach(function (currentPage) {

            currentPage.classList.remove(
                "active-page"
            );

        });


        /* Show requested page */

        const targetPage =
            document.getElementById(page);

        if (targetPage) {

            targetPage.classList.add(
                "active-page"
            );

        }


        /* Update navigation */

        navItems.forEach(function (item) {

            item.classList.remove("active");

            if (
                item.dataset.page === page
            ) {

                item.classList.add("active");

            }

        });


        /* Update top bar */

        pageTitle.textContent =
            pageNames[page] || "NextStep";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =================================================
       PAGE LINK BUTTONS
    ================================================= */

    document
        .querySelectorAll("[data-page-link]")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    navigateTo(
                        button.dataset.pageLink
                    );

                }
            );

        });


    /* =================================================
       MODAL
    ================================================= */

    function openModal(title, content) {

        modalTitle.textContent =
            title;

        modalContent.innerHTML =
            content;

        modalOverlay.classList.remove(
            "hidden"
        );

    }


    function closeCurrentModal() {

        modalOverlay.classList.add(
            "hidden"
        );

        modalContent.innerHTML = "";

    }


    closeModal.addEventListener(
        "click",
        closeCurrentModal
    );


    modalOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modalOverlay
            ) {

                closeCurrentModal();

            }

        }
    );


    /* =================================================
       ADD EVIDENCE
    ================================================= */

    document
        .getElementById("addEvidenceButton")
        .addEventListener(
            "click",
            function () {

                showEvidenceModal();

            }
        );


    document
        .getElementById("skillsEvidenceButton")
        .addEventListener(
            "click",
            function () {

                showEvidenceModal();

            }
        );


    function showEvidenceModal() {

        openModal(
            "Add Evidence",
            `
                <form id="evidenceForm"
                      class="modal-form">

                    <label>
                        Evidence type

                        <select id="evidenceType">

                            <option>
                                Project
                            </option>

                            <option>
                                Certification
                            </option>

                            <option>
                                Course
                            </option>

                            <option>
                                Resume
                            </option>

                        </select>

                    </label>


                    <label>
                        Skill

                        <input
                            type="text"
                            id="evidenceSkill"
                            placeholder="e.g. Java"
                            required
                        >

                    </label>


                    <label>
                        Evidence title

                        <input
                            type="text"
                            id="evidenceTitle"
                            placeholder="e.g. Employee Management System"
                            required
                        >

                    </label>


                    <button
                        type="submit"
                        class="primary-button"
                    >
                        Save Evidence
                    </button>

                </form>
            `
        );


        document
            .getElementById("evidenceForm")
            .addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const skill =
                        document
                            .getElementById("evidenceSkill")
                            .value
                            .trim();

                    const title =
                        document
                            .getElementById("evidenceTitle")
                            .value
                            .trim();


                    if (!skill || !title) {

                        return;

                    }


                    closeCurrentModal();


                    showToast(
                        `${skill} evidence added successfully.`
                    );

                }
            );

    }


    /* =================================================
       CHANGE CAREER
    ================================================= */

    document
        .getElementById("changeCareerButton")
        .addEventListener(
            "click",
            function () {

                openModal(
                    "Change Target Career",
                    `
                        <form
                            id="careerForm"
                            class="modal-form"
                        >

                            <label>
                                Target career

                                <select id="careerSelect">

                                    <option>
                                        Software Developer
                                    </option>

                                    <option>
                                        Backend Developer
                                    </option>

                                    <option>
                                        Full Stack Developer
                                    </option>

                                    <option>
                                        Data Analyst
                                    </option>

                                    <option>
                                        Cloud Engineer
                                    </option>

                                </select>

                            </label>


                            <button
                                type="submit"
                                class="primary-button"
                            >
                                Update Career
                            </button>

                        </form>
                    `
                );


                document
                    .getElementById("careerForm")
                    .addEventListener(
                        "submit",
                        function (event) {

                            event.preventDefault();


                            const career =
                                document
                                    .getElementById(
                                        "careerSelect"
                                    )
                                    .value;


                            document
                                .getElementById(
                                    "targetCareer"
                                )
                                .textContent =
                                career;


                            document
                                .getElementById(
                                    "profileCareer"
                                )
                                .textContent =
                                career;


                            closeCurrentModal();


                            showToast(
                                `Target career changed to ${career}.`
                            );

                        }
                    );

            }
        );


    /* =================================================
       SKILL VERIFICATION
    ================================================= */

    document
        .querySelectorAll(
            "[data-assessment]"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const skill =
                        button.dataset.assessment;


                    openModal(
                        `${skill} Assessment`,
                        `
                            <p class="muted"
                               style="margin-bottom:15px">

                                This prototype simulates
                                a skill verification assessment.

                            </p>


                            <form
                                id="assessmentForm"
                                class="modal-form"
                            >

                                <label>

                                    How confident are you?

                                    <select id="confidence">

                                        <option value="100">
                                            Very confident
                                        </option>

                                        <option value="80">
                                            Confident
                                        </option>

                                        <option value="60">
                                            Moderate
                                        </option>

                                        <option value="40">
                                            Needs practice
                                        </option>

                                        <option value="20">
                                            Beginner
                                        </option>

                                    </select>

                                </label>


                                <button
                                    type="submit"
                                    class="primary-button"
                                >
                                    Submit Assessment
                                </button>

                            </form>
                        `
                    );


                    document
                        .getElementById(
                            "assessmentForm"
                        )
                        .addEventListener(
                            "submit",
                            function (event) {

                                event.preventDefault();


                                const score =
                                    document
                                        .getElementById(
                                            "confidence"
                                        )
                                        .value;


                                closeCurrentModal();


                                showToast(
                                    `${skill} assessment completed: ${score}/100`
                                );

                            }
                        );

                }
            );

        });


    /* =================================================
       SKILL EXCHANGE
    ================================================= */

    document
        .querySelectorAll(
            ".connect-button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const person =
                        button.dataset.person;


                    button.textContent =
                        "Requested";

                    button.disabled = true;


                    showToast(
                        `Connection request sent to ${person}.`
                    );

                }
            );

        });


    /* =================================================
       LEARNING PATH
    ================================================= */

    document
        .getElementById(
            "learningPathButton"
        )
        .addEventListener(
            "click",
            function () {

                navigateTo("gap");

                showToast(
                    "DSA learning path opened."
                );

            }
        );


    document
        .getElementById(
            "gapLearningButton"
        )
        .addEventListener(
            "click",
            function () {

                openModal(
                    "DSA Learning Path",
                    `
                        <div>

                            <h3 style="font-size:13px">
                                Recommended learning path
                            </h3>

                            <br>

                            <p class="muted">
                                1. Arrays & Strings
                            </p>

                            <p class="muted">
                                2. Linked Lists
                            </p>

                            <p class="muted">
                                3. Stacks & Queues
                            </p>

                            <p class="muted">
                                4. Trees
                            </p>

                            <p class="muted">
                                5. Graphs
                            </p>

                            <br>

                            <button
                                class="primary-button"
                                id="startLearning"
                            >
                                Start Learning
                            </button>

                        </div>
                    `
                );


                document
                    .getElementById(
                        "startLearning"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            closeCurrentModal();

                            showToast(
                                "Learning path started!"
                            );

                        }
                    );

            }
        );


    /* =================================================
       MARKET → CAREER GAP
    ================================================= */

    document
        .getElementById(
            "marketGapButton"
        )
        .addEventListener(
            "click",
            function () {

                navigateTo("gap");

            }
        );


    /* =================================================
       REASSESSMENT
    ================================================= */

    document
        .getElementById(
            "reassessmentButton"
        )
        .addEventListener(
            "click",
            function () {

                openModal(
                    "Record DSA Reassessment",
                    `
                        <form
                            id="reassessmentForm"
                            class="modal-form"
                        >

                            <label>

                                New demonstrated score

                                <input
                                    type="number"
                                    id="newScore"
                                    min="0"
                                    max="100"
                                    value="58"
                                    required
                                >

                            </label>


                            <button
                                type="submit"
                                class="primary-button"
                            >
                                Update Progress
                            </button>

                        </form>
                    `
                );


                document
                    .getElementById(
                        "reassessmentForm"
                    )
                    .addEventListener(
                        "submit",
                        function (event) {

                            event.preventDefault();


                            const score =
                                Number(
                                    document
                                        .getElementById(
                                            "newScore"
                                        )
                                        .value
                                );


                            if (
                                score < 0 ||
                                score > 100
                            ) {

                                return;

                            }


                            closeCurrentModal();


                            showToast(
                                `DSA reassessment recorded: ${score}/100`
                            );

                        }
                    );

            }
        );


    /* =================================================
       EDIT PROFILE
    ================================================= */

    document
        .getElementById(
            "editProfileButton"
        )
        .addEventListener(
            "click",
            function () {

                openModal(
                    "Edit Profile",
                    `
                        <form
                            id="profileForm"
                            class="modal-form"
                        >

                            <label>

                                Name

                                <input
                                    type="text"
                                    id="profileInputName"
                                    value="Lokesh Chowdhary"
                                    required
                                >

                            </label>


                            <label>

                                Education

                                <input
                                    type="text"
                                    id="profileInputEducation"
                                    value="Computer Science / Engineering"
                                    required
                                >

                            </label>


                            <button
                                type="submit"
                                class="primary-button"
                            >
                                Save Profile
                            </button>

                        </form>
                    `
                );


                document
                    .getElementById(
                        "profileForm"
                    )
                    .addEventListener(
                        "submit",
                        function (event) {

                            event.preventDefault();


                            const name =
                                document
                                    .getElementById(
                                        "profileInputName"
                                    )
                                    .value
                                    .trim();


                            if (!name) {

                                return;

                            }


                            document
                                .getElementById(
                                    "profileName"
                                )
                                .textContent =
                                name;


                            document
                                .getElementById(
                                    "sidebarName"
                                )
                                .textContent =
                                name;


                            closeCurrentModal();


                            showToast(
                                "Profile updated successfully."
                            );

                        }
                    );

            }
        );


    /* =================================================
       NOTIFICATIONS
    ================================================= */

    document
        .getElementById(
            "notificationButton"
        )
        .addEventListener(
            "click",
            function () {

                openModal(
                    "Notifications",
                    `
                        <div>

                            <div class="timeline-item">

                                <span class="timeline-dot orange-dot">
                                    !
                                </span>

                                <div>

                                    <strong>
                                        DSA needs attention
                                    </strong>

                                    <p>
                                        Your verified score is below
                                        the target for Software Developer.
                                    </p>

                                </div>

                            </div>


                            <div class="timeline-item">

                                <span class="timeline-dot green-dot">
                                    ✓
                                </span>

                                <div>

                                    <strong>
                                        Python verified
                                    </strong>

                                    <p>
                                        Your current demonstrated
                                        score is 71%.
                                    </p>

                                </div>

                            </div>

                        </div>
                    `
                );

            }
        );


    /* =================================================
       TOAST
    ================================================= */

    function showToast(message) {

        toast.textContent =
            message;

        toast.classList.remove(
            "hidden"
        );


        clearTimeout(
            window.nextStepToastTimer
        );


        window.nextStepToastTimer =
            setTimeout(
                function () {

                    toast.classList.add(
                        "hidden"
                    );

                },
                2500
            );

    }


    /* =================================================
       ESCAPE KEY
    ================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeCurrentModal();

            }

        }
    );

});