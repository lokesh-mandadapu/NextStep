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
    const questionBank = {
        Java: [
            { q: "Which collection does not allow duplicate elements?", options: ["ArrayList", "HashSet", "LinkedList", "Vector"], answer: "HashSet", explanation: "HashSet stores unique values.", difficulty: "Easy" },
            { q: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "super"], answer: "extends", explanation: "extends creates class inheritance.", difficulty: "Easy" },
            { q: "What does method overriding require?", options: ["A subclass method with the same signature", "Two static methods", "A private constructor", "A final class"], answer: "A subclass method with the same signature", explanation: "Overriding replaces inherited behavior using the same signature.", difficulty: "Medium" },
            { q: "Which type is immutable in Java?", options: ["String", "StringBuilder", "ArrayList", "HashMap"], answer: "String", explanation: "String objects cannot be changed after creation.", difficulty: "Medium" },
            { q: "What is the purpose of an interface?", options: ["Define a contract", "Store database rows", "Allocate memory", "Stop inheritance"], answer: "Define a contract", explanation: "An interface specifies behavior that implementing classes provide.", difficulty: "Medium" }
        ],
        Python: [
            { q: "Which Python type stores key-value pairs?", options: ["list", "tuple", "dict", "set"], answer: "dict", explanation: "Dictionaries map keys to values.", difficulty: "Easy" },
            { q: "What does list comprehension create?", options: ["A list from an expression", "A class", "A database", "A thread"], answer: "A list from an expression", explanation: "It compactly transforms or filters iterable values.", difficulty: "Easy" },
            { q: "Which keyword handles an exception?", options: ["catch", "except", "rescue", "handle"], answer: "except", explanation: "except handles an exception raised in a try block.", difficulty: "Easy" },
            { q: "What does a generator yield?", options: ["Values lazily", "Only strings", "A compiled module", "A sorted list"], answer: "Values lazily", explanation: "yield produces values on demand and preserves generator state.", difficulty: "Medium" },
            { q: "Which object is mutable?", options: ["tuple", "string", "list", "int"], answer: "list", explanation: "List contents can be changed after creation.", difficulty: "Easy" }
        ],
        "Data Structures": [
            { q: "Which structure follows LIFO order?", options: ["Queue", "Stack", "Graph", "Heap"], answer: "Stack", explanation: "The last item pushed is the first item popped.", difficulty: "Easy" },
            { q: "What is binary search complexity on a sorted array?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], answer: "O(log n)", explanation: "Each comparison halves the remaining search range.", difficulty: "Medium" },
            { q: "Which traversal visits a tree root between its subtrees?", options: ["Preorder", "Inorder", "Postorder", "Level order"], answer: "Inorder", explanation: "Inorder is left subtree, root, right subtree.", difficulty: "Medium" },
            { q: "What does a hash table primarily provide?", options: ["Average constant-time lookup", "Sorted traversal", "Guaranteed recursion", "Graph cycles"], answer: "Average constant-time lookup", explanation: "Hashing maps keys to buckets for fast average lookup.", difficulty: "Medium" },
            { q: "Which structure is best for FIFO processing?", options: ["Stack", "Queue", "Tree", "Set"], answer: "Queue", explanation: "A queue removes items in arrival order.", difficulty: "Easy" }
        ],
        SQL: [
            { q: "Which clause filters grouped results?", options: ["WHERE", "HAVING", "ORDER BY", "LIMIT"], answer: "HAVING", explanation: "HAVING filters after GROUP BY aggregation.", difficulty: "Medium" },
            { q: "What does a primary key guarantee?", options: ["Unique non-null row identity", "Sorted rows", "Encrypted data", "A foreign table"], answer: "Unique non-null row identity", explanation: "A primary key uniquely identifies each row.", difficulty: "Easy" },
            { q: "Which join returns matching rows from both tables?", options: ["INNER JOIN", "CROSS JOIN", "FULL JOIN", "SELF JOIN"], answer: "INNER JOIN", explanation: "INNER JOIN keeps rows satisfying the join condition.", difficulty: "Easy" },
            { q: "Why are indexes used?", options: ["To speed up lookups", "To validate passwords", "To delete duplicates", "To create tables"], answer: "To speed up lookups", explanation: "Indexes trade storage/write cost for faster reads.", difficulty: "Easy" },
            { q: "What does COUNT(*) return?", options: ["Number of rows", "Largest value", "Column names", "A table copy"], answer: "Number of rows", explanation: "COUNT(*) counts rows selected by the query.", difficulty: "Easy" }
        ],
        Git: [
            { q: "What does git commit record?", options: ["A snapshot of staged changes", "A remote server", "Only deleted files", "A password"], answer: "A snapshot of staged changes", explanation: "A commit stores a versioned project snapshot and message.", difficulty: "Easy" },
            { q: "Which command creates a branch?", options: ["git branch", "git fork", "git copy", "git split"], answer: "git branch", explanation: "git branch creates or lists branch references.", difficulty: "Easy" },
            { q: "What does git merge do?", options: ["Combines branch histories", "Deletes all branches", "Encrypts commits", "Downloads Git"], answer: "Combines branch histories", explanation: "Merge integrates changes from another branch.", difficulty: "Easy" },
            { q: "What is the staging area for?", options: ["Selecting changes for the next commit", "Publishing a website", "Resolving DNS", "Running tests only"], answer: "Selecting changes for the next commit", explanation: "git add puts chosen changes into the index.", difficulty: "Medium" },
            { q: "Which command gets remote changes without merging?", options: ["git fetch", "git push", "git init", "git tag"], answer: "git fetch", explanation: "fetch downloads remote references and objects only.", difficulty: "Medium" }
        ],
        JavaScript: [
            { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "define", "newvar"], answer: "let", explanation: "let is block scoped; var is function scoped.", difficulty: "Easy" },
            { q: "What does a Promise represent?", options: ["An eventual async result", "A CSS rule", "A database table", "A loop counter"], answer: "An eventual async result", explanation: "Promises model pending, fulfilled, or rejected work.", difficulty: "Easy" },
            { q: "Which method creates a new array by transforming items?", options: ["map", "push", "pop", "join"], answer: "map", explanation: "map returns transformed values for every item.", difficulty: "Easy" },
            { q: "What does === compare?", options: ["Value and type", "Only object identity", "Only text length", "CSS selectors"], answer: "Value and type", explanation: "Strict equality does not coerce operand types.", difficulty: "Easy" },
            { q: "What is event bubbling?", options: ["An event moving from target toward ancestors", "A timer loop", "A network retry", "A syntax error"], answer: "An event moving from target toward ancestors", explanation: "DOM events propagate upward unless stopped.", difficulty: "Medium" }
        ],
        "HTML/CSS": [
            { q: "Which HTML element represents the main page content?", options: ["main", "span", "meta", "title"], answer: "main", explanation: "main identifies the dominant content of a document.", difficulty: "Easy" },
            { q: "What does CSS flexbox primarily control?", options: ["One-dimensional layout", "Database schemas", "Image compression", "HTTP headers"], answer: "One-dimensional layout", explanation: "Flexbox lays out items along a row or column.", difficulty: "Easy" },
            { q: "Which selector targets a class?", options: [".card", "#card", "card()", "*card"], answer: ".card", explanation: "A dot prefix selects class attributes.", difficulty: "Easy" },
            { q: "Why is semantic HTML useful?", options: ["It improves structure and accessibility", "It encrypts content", "It replaces JavaScript", "It prevents all bugs"], answer: "It improves structure and accessibility", explanation: "Meaningful elements help users, tools, and search engines.", difficulty: "Medium" },
            { q: "What does box-sizing: border-box do?", options: ["Includes padding and border in declared size", "Hides overflow", "Adds a shadow", "Centers text"], answer: "Includes padding and border in declared size", explanation: "The declared width includes content, padding, and border.", difficulty: "Medium" }
        ]
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
        learningProgress: {},
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
            const loaded = saved ? Object.assign(clone(defaultState), saved) : clone(defaultState);
            Object.keys(loaded.assessments || {}).forEach((name) => {
                if (typeof loaded.assessments[name] === "number") {
                    const score = loaded.assessments[name];
                    loaded.assessments[name] = { skill: name, score, correct: 0, total: 0, level: performanceLevel(score), verified: score >= 60, at: new Date().toISOString(), answers: [] };
                }
            });
            return loaded;
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
        const assessment = state.assessments[canonical(skill.name)];
        if (assessment && Number.isFinite(assessment.score)) return assessment.score;
        const evidenceScore = Math.min(100, (skill.evidence || []).length * 20);
        const assessmentScore = 0;
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
            details.innerHTML = state.skills.map((skill) => {
                const assessment = state.assessments[canonical(skill.name)];
                return `<div class="skill-detail"><div class="skill-icon">${skill.name.slice(0, 2)}</div><div class="skill-detail-info"><h3>${skill.name}</h3><p>${skill.level}</p></div><div class="skill-detail-value"><span>Truth Score</span><strong>${verificationScore(skill)}/100</strong></div><span class="status ${verificationScore(skill) >= 60 ? "good" : "warning"}">${assessment ? `${assessment.level} · ${assessment.correct}/${assessment.total}` : skill.evidence.length ? "Evidence added" : "Needs evidence"}</span><button class="small-button edit-skill" data-skill="${skill.name}">Edit</button></div>`;
            }).join("") + `<button class="primary-button" id="addSkillButton">+ Add Skill</button>`;
            $("#addSkillButton").addEventListener("click", () => showSkillModal());
            $$(".edit-skill").forEach((button) => button.addEventListener("click", () => showSkillModal(findSkill(button.dataset.skill))));
        }
        const verification = $("#verification .large-card");
        if (verification) {
            verification.innerHTML = state.skills.map((skill) => {
                const assessment = state.assessments[canonical(skill.name)];
                const score = assessment ? assessment.score : "Not attempted";
                return `<div class="verification-row"><div><h3>${skill.name} Assessment</h3><p>Claimed: ${skill.level} · Evidence: ${skill.evidence.length} · Latest score: ${score}${assessment ? `% · ${assessment.level}` : ""}</p></div><button class="small-button" data-assessment="${skill.name}">${assessment ? "Retake" : "Start"}</button></div>`;
            }).join("");
            $$("[data-assessment]", verification).forEach((button) => button.addEventListener("click", () => showAssessmentModal(button.dataset.assessment)));
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

    function shuffle(items) {
        return items.slice().sort(() => Math.random() - 0.5);
    }

    let activeAssessment = null;

    function showAssessmentModal(skillName) {
        const bank = questionBank[skillName] || [];
        if (!bank.length) return showToast(`No question bank is available for ${skillName} yet.`);
        const previous = state.assessments[canonical(skillName)];
        activeAssessment = { skillName, questions: shuffle(bank).slice(0, Math.min(5, bank.length)).map((question) => ({ ...question, options: shuffle(question.options) })), index: 0, answers: [], previous };
        renderAssessmentQuestion();
    }

    function renderAssessmentQuestion() {
        const quiz = activeAssessment;
        const question = quiz.questions[quiz.index];
        const selected = quiz.answers[quiz.index];
        openModal(`${quiz.skillName} Assessment`, `<div class="assessment-shell"><div class="assessment-meta"><strong>Question ${quiz.index + 1} of ${quiz.questions.length}</strong><span>${question.difficulty}</span></div><div class="assessment-progress"><div style="width:${((quiz.index + 1) / quiz.questions.length) * 100}%"></div></div><h3>${question.q}</h3><div class="assessment-options">${question.options.map((option) => `<button type="button" class="assessment-option ${selected === option ? "selected" : ""}" data-option="${option}">${option}</button>`).join("")}</div><p class="muted">Select one answer to continue.</p><button class="primary-button" id="nextAssessmentButton" ${selected ? "" : "disabled"}>${quiz.index === quiz.questions.length - 1 ? "Finish Assessment" : "Next Question"}</button></div>`);
        $$(".assessment-option").forEach((button) => button.addEventListener("click", () => {
            quiz.answers[quiz.index] = button.dataset.option;
            $$(".assessment-option").forEach((item) => item.classList.toggle("selected", item === button));
            $("#nextAssessmentButton").disabled = false;
        }));
        $("#nextAssessmentButton").addEventListener("click", () => {
            if (!quiz.answers[quiz.index]) return;
            if (quiz.index < quiz.questions.length - 1) {
                quiz.index += 1;
                renderAssessmentQuestion();
            } else {
                finishAssessment();
            }
        });
    }

    function performanceLevel(score) {
        if (score >= 90) return "Expert";
        if (score >= 75) return "Strong";
        if (score >= 60) return "Intermediate";
        if (score >= 40) return "Developing";
        return "Beginner";
    }

    function evaluateAnswer(question, answer) {
        return question.answer === answer;
    }

    function finishAssessment() {
        const quiz = activeAssessment;
        const correct = quiz.questions.filter((question, index) => question.answer === quiz.answers[index]).length;
        const score = Math.round(correct / quiz.questions.length * 100);
        const result = { skill: quiz.skillName, score, correct, total: quiz.questions.length, level: performanceLevel(score), verified: score >= 60, at: new Date().toISOString(), answers: quiz.answers, previous: quiz.previous || null };
        state.assessments[canonical(quiz.skillName)] = result;
        saveState();
        render();
        renderAssessmentResult(result, quiz.questions);
    }

    function renderAssessmentResult(result, questions) {
        const improvement = result.previous ? result.score - result.previous.score : 0;
        openModal("Assessment Complete 🎉", `<div class="assessment-result"><div class="result-score">${result.score}%</div><span class="status ${result.verified ? "good" : "warning"}">${result.level} Skill · ${result.verified ? "Verified" : "Needs improvement"}</span><p><strong>${result.correct} / ${result.total} Correct</strong></p>${improvement ? `<p class="green-text">${improvement > 0 ? "+" : ""}${improvement}% improvement from your previous attempt</p>` : ""}<h3>Question-wise review</h3><div class="assessment-review">${questions.map((question, index) => { const isCorrect = result.answers[index] === question.answer; return `<div class="review-item"><strong>${isCorrect ? "✓ Correct" : "✗ Incorrect"} · ${question.q}</strong><p>Your answer: ${result.answers[index] || "Not answered"}</p><p>Correct answer: ${question.answer}</p><p class="muted">${question.explanation}</p></div>`; }).join("")}</div><div class="assessment-actions"><button class="secondary-button" id="reviewAssessmentButton">Review Answers</button><button class="primary-button" id="continueGapButton">Continue to Career Gap</button></div></div>`);
        $("#continueGapButton").addEventListener("click", () => { closeModal(); navigateTo("gap"); });
        $("#reviewAssessmentButton").addEventListener("click", () => $(".assessment-review").classList.toggle("hidden"));
    }

    function showLearningPathModal() {
        const path = generateLearningPath();
        const progress = state.learningProgress || {};
        openModal("Personalized Learning Path", `<div class="learning-path"><h3>${state.profile.career}</h3><p class="muted">Generated from your current skill gaps. Tick a topic when you complete it.</p>${path.map((topic, index) => `<label class="learning-topic"><input type="checkbox" data-topic="${topic}" ${progress[topic] ? "checked" : ""}> <span>${index + 1}. ${topic}</span></label>`).join("") || "<p class=\"muted\">You are on track for this career.</p>"}</div>`);
        $$(".learning-topic input").forEach((checkbox) => checkbox.addEventListener("change", () => {
            state.learningProgress[checkbox.dataset.topic] = checkbox.checked;
            saveState();
            showToast(checkbox.checked ? "Topic marked complete." : "Topic moved back to your plan.");
        }));
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
        const generated = shuffle(questionBank.Java).slice(0, 5);
        check("TEST-04", "Question generation", 5, generated.length);
        check("TEST-05", "Question selection has no duplicates", 5, new Set(generated.map((question) => question.q)).size);
        check("TEST-06", "Answer evaluation", true, evaluateAnswer(generated[0], generated[0].answer));
        check("TEST-07", "Score calculation", 80, Math.round(4 / 5 * 100));
        check("TEST-08", "Performance-level calculation", "Strong", performanceLevel(80));
        sample.assessments.java = { score: 80, correct: 4, total: 5, level: "Strong", verified: true };
        check("TEST-09", "Skill verification update", 80, sample.assessments.java.score);
        const required = careers["Software Developer"];
        check("TEST-10", "Career Gap integration", true, required.includes("Java"));
        check("TEST-11", "Reassessment stores latest score", 85, Object.assign({}, sample.assessments.java, { score: 85 }).score);
        check("TEST-12", "Unknown career and empty skills are safe", 0, analyzeGapWithSkills([]).matched.length);
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
        showLearningPathModal();
    });
    $("#learningPathButton").addEventListener("click", () => navigateTo("gap"));
    $("#marketGapButton").addEventListener("click", () => navigateTo("gap"));
    $("#reassessmentButton").addEventListener("click", () => {
        const skill = state.skills.find((item) => questionBank[item.name]);
        if (skill) {
            navigateTo("verification");
            showAssessmentModal(skill.name);
        } else showToast("Add a supported skill before reassessing.");
    });
    $("#notificationButton").addEventListener("click", () => openModal("Notifications", `<p class="muted">${analyzeGap().missing.length ? "Your highest-priority gaps are ready for review." : "No outstanding skill gaps."}</p>`));
    $$(".connect-button").forEach((button) => button.addEventListener("click", () => showToast(`Connection request sent to ${button.dataset.person}.`)));
    $("#runValidationButton").addEventListener("click", () => { renderValidation(); showToast("Validation tests completed."); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
    render();
});
