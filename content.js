/* Proposal content. Blocks: string = paragraph, {table} = table (never split across pages), {refs} = reference list. */
const PROJECT = {
  name: "FieldLoop",
  subtitle: "Field Data Review and Follow Up",
  kind: "Research and Development Proposal",  
  byline: "Field Loop Team"
};

const SECTIONS = [
  { short: "Project overview", title: "Project overview", blocks: [
    "We propose a focused extension to KoboToolbox for reviewing field submissions. The prototype will explain suspected data problems, place them in a review queue, assign follow-ups, and preserve a history of decisions.",
    "Our research question is whether assisted review reduces active processing time without increasing missed errors or unnecessary investigations. Initial testing will use fictional records and consenting adult participants. The outcome will be a working demonstration and exploratory evidence, rather than a deployed NGO service."
  ]},
  { short: "Problem and users", title: "Problem and users", blocks: [
    "Our working hypothesis is that some programme teams struggle to coordinate investigation after submissions arrive. Missing information, conflicting answers, repeated registrations, and overdue clarifications might require work across several tools. Practitioner interviews are needed to establish how often these problems occur and whether another product is warranted.",
    "The demonstration will use a fictional adult livelihoods-training programme. A reviewer inspects flags, a supervisor assigns work, and a follow-up officer records clarification. The team will use participant codes, session dates, and attendance counts. Beneficiary identities and sensitive cases are outside this prototype."
  ]},
  { short: "Alternatives", title: "Existing alternatives and proposed contribution", blocks: [
    "KoboToolbox already supports collection, validation, and user permissions [1, 2]. ODK Central includes review states, comments, and action history [4]. Our contribution is a testable combination of explained checks, issue ownership, deadlines, and review metrics. We will compare this workflow with native KoboToolbox review plus a spreadsheet tracker. The need for an extension remains a hypothesis."
  ]},
  { short: "Scope", title: "Scope for two weeks", blocks: [
    "Build one complete workflow for one form and one programme. Four fixed checks replace a configurable rule builder. A CSV import is the guaranteed entry point. A read-only KoboToolbox connector is included if the integration gate passes by day 3.",
    { table: { head: ["Component", "Required behaviour"], rows: [
      ["Import", "Load a documented CSV with stable record IDs and field mapping."],
      ["Quality checks", "Flag required programme fields, invalid date order, inconsistent attendance totals, and repeated registration keys."],
      ["Explanations", "Show the rule, affected values, and reason for each flag."],
      ["Review queue", "Filter by state and assignee. Confirm an issue or dismiss a false alarm."],
      ["Follow-up", "Assign an owner and due date. Record clarification and a resolution reason."],
      ["Audit history", "Record actor, time, action, and previous and new issue state."],
      ["Access and metrics", "Two application roles, reviewer and supervisor. Report review outcomes and overdue work."]
    ]}},
    "Issue states will be open, assigned, awaiting clarification, resolved, dismissed, and reopened. A suspected duplicate requires human review. Legitimate repeat attendance must not be treated as duplicate registration."
  ]},
  { short: "Boundaries", title: "Explicit boundaries", blocks: [
    "The two-week release excludes offline collection, a mobile app, machine learning, fuzzy identity matching, automated beneficiary contact, configurable rule authoring, multi-organisation hosting, and source-data writeback. A live NGO pilot, production readiness, and demonstrated field impact are later milestones.",
    "The day 3 scope gate protects delivery. If API access is blocked, CSV remains the demonstration route and the team reports the connector as incomplete. After day 8, only defect fixes and evaluation work enter the release."
  ]},
  { short: "Technical approach", title: "Technical approach", blocks: [
    "Use React with JavaScript, FastAPI, and PostgreSQL. Keep a single application, a documented API, and one database. Manual synchronisation avoids a background processing service during the sprint.",
    "Core records are source submissions and revisions, flags, assignments, decisions, users, and audit events. Import identity combines the source project and stable record identifier. Re-importing unchanged records must not create duplicate submissions or issues. Changed records trigger fresh checks and mark affected decisions for re-review.",
    "The optional connector will read one team-owned KoboToolbox project containing synthetic records. Use paginated authenticated API reads, with credentials stored on the server. KoboToolbox REST services deliver new submissions but do not deliver edits [3]. A manual full refresh is therefore the proposed correction-checking method for this small dataset.",
    "Use rootUuid where available, subject to the integration test. KoboToolbox documents this as stable across edits [2]. CSV records require a documented stable ID. Record a content fingerprint and rule version so reviewers know what evidence a decision used.",
    "Restrict assignments and administration to the supervisor role. Reviewers see their permitted project records. Protect decision updates against conflicting edits. Preserve audit events through normal application permissions. This is application traceability, not a claim of tamper-proof storage."
  ]},
  { short: "Team", title: "Team responsibilities", blocks: [
    { table: { head: ["Contributor", "Primary responsibility"], rows: [
      ["1", "Research, scope, supervisor liaison, study coordination and final report"],
      ["2", "CSV import, KoboToolbox integration spike and repeat-import handling"],
      ["3", "Data model, API and four quality checks"],
      ["4", "Frontend queue, flag explanation and review interface"],
      ["5", "Assignments, permissions, audit history and demonstration deployment"],
      ["6", "Synthetic benchmark, automated checks, evaluation setup and quality assurance"]
    ]}},
    "Every component has a second reviewer. Integrate daily, hold a short daily check-in, and demonstrate the full workflow by day 5. No contributor independently validates their own feature without peer review."
  ]},
  { short: "Evaluation", title: "Evaluation method", blocks: [
    "Generate 300 fictional submissions with a fixed random seed. Reserve 100 for development and 200 for held-out evaluation before tuning rules. Include clean records, known errors, legitimate repeat attendance, and permitted missing values. Record the chosen error prevalence and keep an answer key separate from participant materials.",
    "Two contributors check the labels and resolve ambiguous cases. Do not treat missing fields as errors when the programme rules permit their absence. Report results by error type so one easy rule does not hide failures elsewhere.",
    "Aim to recruit 4-6 consenting adult classmates outside the project team. Each will review two matched batches of approximately 20-30 records: one through native KoboToolbox plus a spreadsheet tracker, and one through the prototype. Counterbalance condition order, use different records, and give equivalent training. The two-week study is exploratory, not a statistically powered trial.",
    "If independent participants are unavailable by day 9, complete the benchmark and a disclosed internal walkthrough. Do not present developer testing as independent usability evidence. No NGO access is required to complete the prototype.",
    { table: { head: ["Measure", "Definition"], rows: [
      ["Review time", "Median active time per record, including investigation and documentation."],
      ["Flag precision", "True issues flagged divided by all issues flagged on the labelled test set."],
      ["Rule recall", "Known issues flagged divided by all known benchmark issues."],
      ["Reviewer misses", "Known errors left unresolved or unrecognised after the review task."],
      ["Unnecessary investigation", "Clean records escalated divided by clean records reviewed."],
      ["Follow-up completion", "Scripted tasks completed by their simulated deadline divided by tasks due."]
    ]}},
    "Provisional targets are a 20% reduction in median active review time, at least 85% flag precision, and at least 90% rule recall. Also inspect whether reviewer misses and unnecessary investigations increase. These targets are proposed, not achieved. Report counts, participant variation, and uncertainty. A small sample cannot prove equivalent safety or performance in field conditions.",
    "Functional acceptance also requires successful tests for repeat imports, edited records, incorrect permissions, concurrent decisions, and audit completeness. Simulated follow-up results do not establish real staff response rates."
  ]},
  { short: "Delivery plan", title: "Two week delivery plan", blocks: [
    "Plan for 10 core working days within a two-week window. Remaining calendar days provide contingency if available. Confirm actual start and submission dates with the supervisor.",
    { table: { head: ["Day", "Work and completion gate"], rows: [
      ["1", "Agree on the scenario and rules. Compare existing tools. Create the repository, screen sketches and evaluation plan."],
      ["2", "Create the dataset, schema, API contracts and CSV import. Prepare a team-owned Kobo project."],
      ["3", "Finish the connector spike and enforce the API-or-CSV decision. Freeze the held-out test set."],
      ["4", "Integrate four checks, explanations and the review queue."],
      ["5", "Demonstrate import through assignment and resolution with audit history. Review scope with the supervisor."],
      ["6", "Complete permissions, due dates and source-edit rechecks."],
      ["7", "Test repeat imports, conflicts and failures. Prepare matched review tasks and instructions."],
      ["8", "Complete integration and defect fixes. Rehearse evaluation and freeze features."],
      ["9", "Run the benchmark, participant study and scripted follow-ups."],
      ["10", "Analyse results, finalise documentation, rehearse the demonstration and submit."]
    ]}}
  ]},
  { short: "Budget", title: "Budget and resources", blocks: [
    "Use existing laptops and local development. A public domain and paid cloud subscription are unnecessary for the core demonstration. The budget below is a team-wide allowance for two weeks, not a vendor quote or spending commitment.",
    { table: { head: ["Item", "Planning allowance KES"], rows: [
      ["Optional demonstration hosting", "0-1,000"],
      ["Contingency", "500"],
      ["Total", "500-1,500"]
    ]}}
  ]},
  { short: "Risks", title: "Risks and responsible handling", blocks: [
    { table: { head: ["Risk", "Response"], rows: [
      ["Existing tools meet the need", "Compare capabilities on day 1. Narrow the research to measurable workflow improvement or report no added value."],
      ["No NGO partner", "Use fictional data and report laboratory feasibility. Practitioner feedback is useful but not on the critical path."],
      ["Integration delays", "Enforce the day 3 gate and retain CSV import as the core delivery route."],
      ["Misleading flags", "Include legitimate unusual cases. Keep human decisions and measure false alarms."],
      ["Scope and integration overload", "Use four fixed rules, one form, daily integration and a day 8 feature freeze."]
    ]}},
    "Use synthetic identifiers only. Store secrets outside source control and redact payloads from logs. Enforce project permissions on the server. Any later use of NGO records requires authorised access, an agreed purpose, retention rules, hosting review, and appropriate privacy and research approvals. The two-week project does not establish regulatory compliance."
  ]},
  { short: "Deliverables", title: "Deliverables and next decision", blocks: [
    "Submit a working prototype, reproducible dataset generator and answer key, source code and setup guide, architecture notes, consequential automated tests, evaluation protocol and results, known limitations, and a demonstration recording. State explicitly whether the KoboToolbox connector passed or whether the demonstration used CSV.",
    "Request supervisor approval of this reduced scope, team allocation, and evaluation plan. Potential pilot partners are invited to a short workflow interview or synthetic-data demonstration. A later pilot or sponsor request should follow evidence of a useful gap and a separately costed field plan. Employment, sponsorship, and operational benefits are potential outcomes, not promised results."
  ]},
  { short: "References", title: "References", blocks: [
    { refs: [
      ["KoboToolbox. Data collection with KoboToolbox.", "https://support.kobotoolbox.org/data-collection-tools.html"],
      ["KoboToolbox. Viewing and validating your data.", "https://support.kobotoolbox.org/viewing_validating_data.html"],
      ["KoboToolbox. Using the REST services.", "https://support.kobotoolbox.org/rest_services.html"],
      ["ODK. Managing Submissions in Central.", "https://docs.getodk.org/central-submissions/"],
      ["KoboToolbox. Getting started with the API.", "https://support.kobotoolbox.org/api"]
    ]}
  ]}
];

