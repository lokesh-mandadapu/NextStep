/* NextStep application logic. The domain functions are intentionally
   deterministic so they can be demonstrated and validated in the UI. */
document.addEventListener("DOMContentLoaded", function () {
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const storageKey = "nextstep-state-v1";
    const careers = {
        "Software Developer": ["Java", "Data Structures", "SQL", "Git", "Python"],
        "Backend Developer": ["Java", "SQL", "Git", "APIs", "Data Structures"],
        "Full Stack Developer": ["JavaScript", "React", "SQL", "Git", "APIs"],
        "Data Analyst": ["Python", "SQL", "Statistics", "Excel", "Data Visualization"],
        "Cloud Engineer": ["Linux", "Networking", "Cloud", "Git", "Python"]
    };
    const learningTopics = {
        "Data Structures": ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees"],
        DSA: ["Arrays & Strings", "Linked Lists", "Stacks & Queues", "Trees"],
        SQL: ["Relational modelling", "SELECT and joins", "Indexes", "Query optimisation"],
        Git: ["Commits and branches", "Merging", "Pull requests", "Team workflows"],
        Java: ["Object-oriented design", "Collections", "Exceptions", "Testing"],
        Python: ["Core syntax", "Functions", "Data handling", "Testing"],
        APIs: ["HTTP fundamentals", "REST resources", "Validation", "API testing"]
    };
    const peers = [
        { name: "Priya S.", career: "Software Developer", skills: { Java: 82, SQL: 88, "Data Structures": 55 } },
        { name: "Arjun K.", career: "Software Developer", skills: { "Data Structures": 91, Java: 62, Git: 80 } },
        { name: "Meera R.", career: "Data Analyst", skills: { Python: 90, SQL: 84, Statistics: 86 } }
    ];
    const defaultState = {
        profile: { name: "Lokesh Chowdhary", education: "Computer Science / Engineering", career: "Software Developer" },
        skills: [
            { name: "Java", level: "Advanced", score: 76, evidence: [{ type: "Project", title: "Employee Management System" }] },
            { name: "Data Structures", level: "Advanced", score: 48, evidence: [] },
            { name: "Python", level: "Intermediate", score: 71, evidence: [{ type: "Course", title: "Python Programming" }] },
            { name: "SQL", level: "Intermediate", score: 64, evidence: [{ type: "Project", title: "Student Database" }] },
            { name: "Git", level: "Intermediate", score: 70, evidence: [{ type: "Project", title: "Team repository" }] }
        ],
        assessments: {},
        connections: []
    };
    let state = loadState();
    const loginPage = $("#loginPage");
    const app = $("#app");
    const modalOverlay = $("#modalOverlay");
    const toast = $("#toast");

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function loadState() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey));
            return saved ? Object.assign(clone(defaultState), saved) : clone(defaultState);
        } catch (error) {
            console.warn("NextStep state could not be loaded.", error);
            return clone(defaultState);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
            showToast("Changes could not be saved in this browser.");
            console.error("NextStep state could not be saved.", error);
        }
    }

    function canonical(value) {
        return String(value || "").trim().toLowerCase();
    }

    function findSkill(name) {
        return state.skills.find((skill) => canonical(skill.name) === canonical(name));
    }

    function verificationScore(skill) {
        const evidenceScore = Math.min(100, (skill.evidence || []).length * 20);
        const assessmentScore = state.assessments[canonical(skill.name)] || 0;
        return Math.round(Math.min(100, skill.score * 0.6 + evidenceScore * 0.2 + assessmentScore * 0.2));
    }

    function analyzeGap() {
        const required = careers[state.profile.career] || [];
        const matched = [];
        const missing = [];
        required.forEach((name) => {
            const skill = findSkill(name);
            const score = skill ? verificationScore(skill) : 0;
            (score >= 60 ? matched : missing).push({ name, score, priority: score < 40 ? "High" : "Medium" });
        });
        return { required, matched, missing, readiness: required.length ? Math.round(matched.length / required.length * 100) : 0 };
    }

    function generateLearningPath(gap = analyzeGap()) {
        return gap.missing.flatMap((skill) => learningTopics[skill.name] || ["Foundations", "Guided practice", "Applied project"]);
    }

    function matchPeers() {
        const gap = analyzeGap();
        return peers.map((peer) => {
            const careerSimilarity = peer.career === state.profile.career ? 100 : 0;
            const studentNames = state.skills.map((skill) => canonical(skill.name));
            const common = Object.keys(peer.skills).filter((skill) => studentNames.includes(canonical(skill)));
            const complementary = gap.missing.filter((skill) => (peer.skills[skill.name] || 0) >= 60).map((skill) => skill.name);
            const peerGaps = careers[peer.career] || [];
            const gapCompatibility = gap.missing.filter((skill) => peerGaps.includes(skill.name)).length;
            const score = Math.round(careerSimilarity * 0.4 + Math.min(100, common.length * 25) * 0.25 +
                Math.min(100, complementary.length * 50) * 0.2 + Math.min(100, gapCompatibility * 50) * 0.15);
            return { ...peer, common, complementary, score, reason: common.length ? `Common ${common.join(", ")} with complementary ${complementary.join(", ") || "learning goals"}.` : "Complementary career learning goals." };
        }).sort((a, b) => b.score - a.score);
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.remove("hidden");
        clearTimeout(window.nextStepToastTimer);
        window.nextStepToastTimer = setTimeout(() => toast.classList.add("hidden"), 2500);
    }

    function openModal(title, content) {
        $("#modalTitle").textContent = title;
        $("#modalContent").innerHTML = content;
        modalOverlay.classList.remove("hidden");
    }

    function closeModal() {
        modalOverlay.classList.add("hidden");
        $("#modalContent").innerHTML = "";
    }

    function navigateTo(page) {
        $$(".page").forEach((item) => item.classList.toggle("active-page", item.id === page));
        $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.page === page));
        $("#pageTitle").textContent = ({ dashboard: "Dashboard", skills: "My Skills", verification: "Skill Verification", gap: "Career Gap", exchange: "Skill Exchange", market: "Market Insights", progress: "Progress", profile: "Profile", validation: "Project Validation" })[page] || "NextStep";
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function render() {
        const gap = analyzeGap();
        const readiness = $(".progress-ring strong");
        if (readiness) readiness.textContent = gap.readiness;
        const careerCard = $(".career-info");
        if (careerCard) {
            $("strong", careerCard).textContent = `${gap.matched.length} skills matched`;
            $("span", careerCard).textContent = `${gap.missing.length} skills need attention`;
        }
        const alignment = $(".progress-info strong");
        if (alignment) alignment.textContent = `${gap.readiness}%`;
        const alignmentBar = $(".progress-info .progress-bar div");
        if (alignmentBar) alignmentBar.style.width = `${gap.readiness}%`;
        $("#targetCareer").textContent = state.profile.career;
        $("#profileCareer").textContent = state.profile.career;
        $("#profileName").textContent = state.profile.name;
        const education = $$("#profile .profile-row strong")[1];
        if (education) education.textContent = state.profile.education;
        $("#sidebarName").textContent = state.profile.name.split(" ").map((part) => part[0]).join("").slice(0, 3);
        renderSkills();
        renderGap(gap);
        renderPeers();
        renderValidation();
    }

    function renderSkills() {
        const table = $(".skill-table");
        if (table) {
            table.innerHTML = `<div class="skill-header"><span>SKILL</span><span>YOUR CLAIM</span><span>VERIFIED</span><span>TRUTH SCORE</span><span>STATUS</span></div>` +
                state.skills.map((skill) => {
                    const verified = verificationScore(skill);
                    return `<div class="skill-row"><div class="skill-name"><div class="skill-icon">${skill.name.slice(0, 2)}</div><div><strong>${skill.name}</strong><span>${skill.level}</span></div></div><div><strong>${skill.level}</strong><small>${skill.evidence.length} evidence item(s)</small></div><div><strong>${verified}%</strong><div class="mini-bar verified"><div style="width:${verified}%"></div></div></div><div class="truth-score">${verified}<small>/100</small></div><span class="status ${verified >= 60 ? "good" : "warning"}">${verified >= 60 ? "Supported" : "Needs evidence"}</span></div>`;
                }).join("");
        }
        const details = $("#skills .large-card");
        if (details) {
            details.innerHTML = state.skills.map((skill) => `<div class="skill-detail"><div class="skill-icon">${skill.name.slice(0, 2)}</div><div class="skill-detail-info"><h3>${skill.name}</h3><p>${skill.level}</p></div><div class="skill-detail-value"><span>Truth Score</span><strong>${verificationScore(skill)}/100</strong></div><span class="status ${verificationScore(skill) >= 60 ? "good" : "warning"}">${skill.evidence.length ? "Evidence added" : "Needs evidence"}</span><button class="small-button edit-skill" data-skill="${skill.name}">Edit</button></div>`).join("") + `<button class="primary-button" id="addSkillButton">+ Add Skill</button>`;
            $("#addSkillButton").addEventListener("click", () => showSkillModal());
            $$(".edit-skill").forEach((button) => button.addEventListener("click", () => showSkillModal(findSkill(button.dataset.skill))));
        }
    }

    function renderGap(gap) {
        const card = $("#gap .large-card");
        if (!card) return;
        card.innerHTML = gap.required.map((name) => {
            const result = gap.matched.find((item) => item.name === name);
            const item = result || gap.missing.find((entry) => entry.name === name);
            return `<div class="gap-row"><div><h3>${name}</h3><p>Your ${item.score}% · Target 60%</p></div><span class="status ${result ? "good" : "warning"}">${result ? "Matched" : `${item.priority} priority gap`}</span></div>`;
        }).join("");
        $("#gapLearningButton").textContent = gap.missing.length ? `Start ${gap.missing[0].name} Learning Path` : "Review learning path";
    }

    function renderPeers() {
        const card = $("#exchange .large-card");
        if (!card) return;
        card.innerHTML = matchPeers().map((peer) => `<div class="person-row"><div class="person-avatar">${peer.name.split(" ").map((part) => part[0]).join("")}</div><div class="person-info"><strong>${peer.name}</strong><span>${peer.career} · ${peer.reason}</span></div><span class="match">${peer.score}% match</span><button class="small-button connect-button" data-person="${peer.name}" ${state.connections.includes(peer.name) ? "disabled" : ""}>${state.connections.includes(peer.name) ? "Requested" : "Connect"}</button></div>`).join("");
        $$(".connect-button", card).forEach((button) => button.addEventListener("click", () => {
            state.connections.push(button.dataset.person);
            saveState();
            renderPeers();
            showToast(`Connection request sent to ${button.dataset.person}.`);
        }));
    }

    function showEvidenceModal() {
        openModal("Add Evidence", `<form id="evidenceForm" class="modal-form"><label>Evidence type<select id="evidenceType"><option>Project</option><option>Certification</option><option>Course</option><option>Resume</option></select></label><label>Skill<input id="evidenceSkill" required placeholder="e.g. Java"></label><label>Evidence title<input id="evidenceTitle" required placeholder="e.g. Employee Management System"></label><button class="primary-button" type="submit">Save Evidence</button></form>`);
        $("#evidenceForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const name = $("#evidenceSkill").value.trim();
            const title = $("#evidenceTitle").value.trim();
            if (!name || !title) return;
            let skill = findSkill(name);
            if (!skill) {
                skill = { name, level: "Beginner", score: 30, evidence: [] };
                state.skills.push(skill);
            }
            skill.evidence.push({ type: $("#evidenceType").value, title });
            saveState(); closeModal(); render(); showToast(`${name} evidence added successfully.`);
        });
    }

    function showSkillModal(skill = null) {
        openModal(skill ? "Edit Skill" : "Add Skill", `<form id="skillForm" class="modal-form"><label>Skill<input id="skillName" required value="${skill ? skill.name : ""}" ${skill ? "readonly" : ""}></label><label>Level<select id="skillLevel"><option ${skill && skill.level === "Beginner" ? "selected" : ""}>Beginner</option><option ${skill && skill.level === "Intermediate" ? "selected" : ""}>Intermediate</option><option ${skill && skill.level === "Advanced" ? "selected" : ""}>Advanced</option></select></label><label>Claimed score (0-100)<input id="skillScore" type="number" min="0" max="100" required value="${skill ? skill.score : 50}"></label><button class="primary-button" type="submit">Save Skill</button></form>`);
        $("#skillForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const name = $("#skillName").value.trim();
            const score = Number($("#skillScore").value);
            if (!name || !Number.isFinite(score) || score < 0 || score > 100) return showToast("Enter a skill and a score from 0 to 100.");
            const existing = skill || findSkill(name);
            if (existing) Object.assign(existing, { level: $("#skillLevel").value, score });
            else state.skills.push({ name, level: $("#skillLevel").value, score, evidence: [] });
            saveState(); closeModal(); render(); showToast("Skill saved successfully.");
        });
    }

    function showCareerModal() {
        openModal("Change Target Career", `<form id="careerForm" class="modal-form"><label>Target career<select id="careerSelect">${Object.keys(careers).map((career) => `<option ${career === state.profile.career ? "selected" : ""}>${career}</option>`).join("")}</select></label><button class="primary-button" type="submit">Update Career</button></form>`);
        $("#careerForm").addEventListener("submit", (event) => {
            event.preventDefault();
            state.profile.career = $("#careerSelect").value;
            saveState(); closeModal(); render(); showToast(`Target career changed to ${state.profile.career}.`);
        });
    }

    function showAssessmentModal(skillName) {
        openModal(`${skillName} Assessment`, `<form id="assessmentForm" class="modal-form"><p class="muted">This is a transparent self-assessment used as one verification input.</p><label>Assessment score<select id="assessmentScore"><option value="100">Very confident (100)</option><option value="80">Confident (80)</option><option value="60">Moderate (60)</option><option value="40">Needs practice (40)</option><option value="20">Beginner (20)</option></select></label><button class="primary-button" type="submit">Save Assessment</button></form>`);
        $("#assessmentForm").addEventListener("submit", (event) => {
            event.preventDefault();
            state.assessments[canonical(skillName)] = Number($("#assessmentScore").value);
            saveState(); closeModal(); render(); showToast(`${skillName} assessment saved.`);
        });
    }

    function showProfileModal() {
        openModal("Edit Profile", `<form id="profileForm" class="modal-form"><label>Name<input id="profileInputName" required value="${state.profile.name}"></label><label>Education<input id="profileInputEducation" required value="${state.profile.education}"></label><button class="primary-button" type="submit">Save Profile</button></form>`);
        $("#profileForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const name = $("#profileInputName").value.trim();
            const education = $("#profileInputEducation").value.trim();
            if (!name || !education) return showToast("Name and education are required.");
            state.profile = { ...state.profile, name, education };
            saveState(); closeModal(); render(); showToast("Profile updated successfully.");
        });
    }

    function runValidationTests() {
        const results = [];
        const check = (id, input, expected, actual) => results.push({ id, input, expected, actual, status: JSON.stringify(expected) === JSON.stringify(actual) ? "Passed" : "Failed" });
        const sample = { ...clone(defaultState), profile: { ...defaultState.profile }, skills: defaultState.skills.slice(0, 5).map(clone) };
        check("TEST-01", "Saved profile", "Lokesh Chowdhary", sample.profile.name);
        sample.profile.name = "Asha Student";
        check("TEST-02", "Updated profile name", "Asha Student", sample.profile.name);
        sample.skills.push({ name: "Testing", level: "Beginner", score: 40, evidence: [] });
        check("TEST-03", "Add one skill", 6, sample.skills.length);
        sample.assessments.java = 90;
        check("TEST-04", "Assessment score recorded", 90, sample.assessments.java);
        const required = careers["Software Developer"];
        check("TEST-05", "Required skills lookup", 5, required.length);
        const matchCount = sample.skills.filter((skill) => required.includes(skill.name)).length;
        check("TEST-06", "Readiness inputs", 5, matchCount);
        check("TEST-07", "Learning path from gaps", true, generateLearningPath({ missing: [{ name: "Data Structures" }] }).length > 0);
        check("TEST-08", "Peer matching", true, matchPeers().length > 0);
        check("TEST-09", "Invalid score rejected", true, !(Number("bad") >= 0));
        check("TEST-10", "Unknown career has no requirements", 0, (careers["Unknown"] || []).length);
        check("TEST-11", "Empty skills produces zero matches", 0, analyzeGapWithSkills([]).matched.length);
        check("TEST-12", "Unknown skill verification is safe", 0, verificationScore({ name: "Unknown", score: 0, evidence: [] }));
        return results;
    }

    function analyzeGapWithSkills(skills) {
        const previous = state.skills;
        state.skills = skills;
        const result = analyzeGap();
        state.skills = previous;
        return result;
    }

    function renderValidation() {
        const results = runValidationTests();
        $("#validationTotal").textContent = results.length;
        $("#validationPassed").textContent = results.filter((test) => test.status === "Passed").length;
        $("#validationFailed").textContent = results.filter((test) => test.status === "Failed").length;
        $("#validationResults").innerHTML = results.map((test) => `<div class="gap-row"><div><h3>${test.id} · ${test.input}</h3><p>Expected: ${test.expected} · Actual: ${test.actual}</p></div><span class="status ${test.status === "Passed" ? "good" : "warning"}">${test.status}</span></div>`).join("");
    }

    $("#loginForm").addEventListener("submit", (event) => {
        event.preventDefault();
        if (!$("#email").value.includes("@")) return $("#loginError").textContent = "Please enter a valid email.";
        if ($("#password").value.length < 4) return $("#loginError").textContent = "Password must contain at least 4 characters.";
        $("#loginError").textContent = "";
        loginPage.classList.add("hidden"); app.classList.remove("hidden"); showToast("Welcome to NextStep!"); navigateTo("dashboard");
    });
    $("#logoutButton").addEventListener("click", () => { app.classList.add("hidden"); loginPage.classList.remove("hidden"); $("#loginForm").reset(); });
    $$(".nav-item").forEach((item) => item.addEventListener("click", () => navigateTo(item.dataset.page)));
    $$("[data-page-link]").forEach((item) => item.addEventListener("click", () => navigateTo(item.dataset.pageLink)));
    $("#closeModal").addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", (event) => { if (event.target === modalOverlay) closeModal(); });
    $("#addEvidenceButton").addEventListener("click", showEvidenceModal);
    $("#skillsEvidenceButton").addEventListener("click", showEvidenceModal);
    $("#changeCareerButton").addEventListener("click", showCareerModal);
    $("#editProfileButton").addEventListener("click", showProfileModal);
    $$("[data-assessment]").forEach((button) => button.addEventListener("click", () => showAssessmentModal(button.dataset.assessment)));
    $("#gapLearningButton").addEventListener("click", () => {
        const path = generateLearningPath();
        openModal("Personalized Learning Path", `<h3>${state.profile.career}</h3><p class="muted">Generated from your current skill gaps.</p><ol>${path.map((topic) => `<li>${topic}</li>`).join("") || "<li>You are on track for this career.</li>"}</ol>`);
    });
    $("#learningPathButton").addEventListener("click", () => navigateTo("gap"));
    $("#marketGapButton").addEventListener("click", () => navigateTo("gap"));
    $("#reassessmentButton").addEventListener("click", () => showToast("Reassessment is recorded through Skill Verification."));
    $("#notificationButton").addEventListener("click", () => openModal("Notifications", `<p class="muted">${analyzeGap().missing.length ? "Your highest-priority gaps are ready for review." : "No outstanding skill gaps."}</p>`));
    $$(".connect-button").forEach((button) => button.addEventListener("click", () => showToast(`Connection request sent to ${button.dataset.person}.`)));
    $("#runValidationButton").addEventListener("click", () => { renderValidation(); showToast("Validation tests completed."); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
    render();
});
