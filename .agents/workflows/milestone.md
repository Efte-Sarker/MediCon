---
description: Implement a single milestone from the roadmap, following project rules.
---

### [Implement Milestone]
The user will specify a Phase and Milestone (e.g. "Phase 1, Milestone 1.5", "Phase 1, Milestone 1.22", "Phase 2, Milestone 2.7").
If they didn't specify one, ask which Phase and Milestone before doing anything.

1. Read `docs/README.md`.
2. Read `docs/06-development-roadmap.md` and locate the specified Phase → Milestone.
3. Before changing any code:
   - Review that milestone's scope, dependencies, and completion criteria as documented.
   - Check the actual codebase (not just the docs) to confirm prerequisite milestones are genuinely implemented.
   - If a dependency is missing, or scope is ambiguous enough that proceeding risks building the wrong thing, stop and ask before writing code.
   - Identify existing code, components, or utilities that can be reused rather than duplicated.
4. Even if `npm` is permanently allowed at the tool level, you must still stop and ask before running any `npm install` command. Permanent permission covers npm run scripts only, not installs.
5. Before planning any milestone, re-read that milestone's entry in `06-development-roadmap.md` in full. Do not rely on memory of what the milestone contains.
6. Implement only this milestone:
   - Follow existing project documentation, architecture, and coding patterns (see `docs/02-architecture.md` and `docs/03-coding-standards.md`).
   - Respect all constraints in `docs/04-safety-and-compliance.md`.
   - Reuse existing code wherever possible.
   - Do not implement future milestones, introduce new libraries/dependencies, or modify code unrelated to this milestone.
   - Do not edit project documentation except to mark this milestone's status in `docs/06-development-roadmap.md` once complete.
7. Never begin any download, install, or background process speculatively or "just in case." Every such action requires explicit approval before starting, not after.
8. Before finishing, verify:
   - The milestone satisfies the Definition of Done in `docs/05-workflow.md`.
   - Run typecheck, lint, build, and test scripts; confirm no new errors.
9. Finally, summarize:
   - Files changed
   - What was implemented
   - How it was validated (commands run, results)
   - Any blockers, assumptions, or deviations from the spec