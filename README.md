# NextStep — Intelligent Student Career Readiness Platform

NextStep is a client-side academic prototype that helps a student understand how
their skills align with a target career. It preserves the original single-page
interface while implementing a complete, demonstrable workflow:

**Profile → Target Career → Skills and Evidence → Verification → Skill Gap →
Readiness → Learning Path → Peer Matching**

## Problem statement and motivation

Students often know their existing skills but lack a structured way to compare
them with a desired career, identify missing skills, and decide what to learn
next. NextStep provides an explainable career-readiness workflow rather than an
opaque recommendation.

## Objectives

- Maintain a student profile and target career.
- Record claimed skills and supporting evidence.
- Calculate transparent verification scores.
- Identify matched and missing career skills.
- Generate a learning path from current gaps.
- Recommend compatible peers for collaboration.
- Validate the rule-based algorithms with executable test cases.

## Requirements

### Functional

Profile editing, career selection, skill add/edit, evidence capture, skill
verification, gap analysis, readiness calculation, learning-path generation,
peer matching, connection requests, and project validation are implemented in
the browser.

### Non-functional

The prototype prioritizes usability, maintainability, reliability, responsive
performance, basic input validation, and separation between UI rendering,
persistence, and domain calculations. A server-side database and horizontal
scaling are future scope.

## Architecture

```text
                    NextStep Web Application
                              |
       ------------------------------------------------
       |             |             |                  |
    Profile        Skills       Career Engine     Collaboration
                                  |                  |
                    -----------------------------   |
                    |       |       |            |  |
                  Gaps  Readiness  Learning      Peer
                Analysis  Score      Path       Matching
```

The implementation is a modular browser application using HTML, CSS, and
vanilla JavaScript. `localStorage` provides persistence without introducing a
backend or unnecessary microservices.

## Methodology and Agile/Scrum plan

The project uses requirements, user stories, incremental implementation, and
validation. The sprint structure below is the planned/current organization;
it does not claim that historical ceremonies or velocity were recorded.

| ID | User story | Priority | Points | Acceptance criteria |
|---|---|---:|---:|---|
| US01 | As a student, I want to edit my profile. | High | 3 | Name and education save and remain after refresh. |
| US02 | As a student, I want to select a target career. | High | 3 | Career changes update profile and analysis. |
| US03 | As a student, I want to manage skills and evidence. | High | 5 | Skills can be added/edited and evidence is visible. |
| US04 | As a student, I want transparent skill verification. | High | 5 | Claimed score, evidence, verified score, and status are shown. |
| US05 | As a student, I want to identify skill gaps. | High | 8 | Required, matched, missing, priority, and readiness are calculated. |
| US06 | As a student, I want a personalized learning path. | High | 8 | Topics are generated from missing skills. |
| US07 | As a student, I want compatible peers. | Medium | 8 | Score, common skills, complementary skills, and reason are shown. |
| US08 | As a reviewer, I want validation results. | High | 5 | The validation page runs and reports actual test outcomes. |

### Planned sprint structure

1. **Sprint 1:** requirements, UI prototype, profile, and target career.
2. **Sprint 2:** skills, evidence, verification, and gap analysis.
3. **Sprint 3:** learning path, peer matching, integration, testing, and
   validation.

## Algorithms

### Verification

`verified score = claimed score × 0.6 + evidence score × 0.2 +
assessment score × 0.2`, capped at 100. Each evidence item contributes 20
points to the evidence component. A score of 60 or more is displayed as
Supported.

### Skill gap and readiness

The selected career supplies a required-skill list. A required skill is matched
when its verified score is at least 60.

`readiness = matched required skills / total required skills × 100`

Missing skills receive High priority below 40 and Medium priority otherwise.

### Learning path

Each missing skill maps to an ordered set of foundational topics. Unknown
skills receive a safe generic foundation/practice/project path.

### Peer matching

`compatibility = career similarity × 40% + common skills × 25% +
complementary skills × 20% + skill-gap compatibility × 15%`

Every recommendation displays the inputs behind its result.

## Testing and validation

The **Project Validation** page executes twelve deterministic checks covering
profile retrieval/update, adding a skill, verification input, career lookup,
readiness inputs, learning paths, peer matching, invalid input, unknown
careers, empty skills, and safe unknown-skill handling. Each result displays
test ID, input, expected result, actual result, and status. The page is
generated from the current implementation rather than hardcoded pass values.

The reference scenario is Software Developer with Java, Data Structures, SQL,
Git, and Python as required skills. Changing skills/evidence in the UI changes
the displayed matched skills, gaps, readiness, path, and peer scores.

## Installation and running

No build step or package installation is required. Open
[`index.html`](./index.html) in a modern browser, or serve the folder with any
static file server. Use any valid email and a password of at least four
characters for the demo login.

## Limitations and future scope

This is a transparent rule-based prototype, not a trained machine-learning
model. It does not claim ML accuracy, precision, recall, F1, or dataset
results. Data is stored per browser in localStorage and is not yet shared
between students. Future work may add authenticated server persistence,
institutional career datasets, richer evidence review, and an evaluated ML
recommendation model.
