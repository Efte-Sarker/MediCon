### [Pre-Implementation Checklist]
Before implementing any feature:

- Read the relevant project documentation.
- Follow the documented architecture and coding standards.
- Never hardcode colors, spacing, typography, or routes.
- Never skip loading, error, and empty states where applicable.
- Never put network calls on the critical path of emergency screens.
- Build clean, maintainable, accessible, and medically responsible code.

---

### [Definition of Done]
A feature is complete only when:

- All TypeScript errors are resolved. `npx tsc --noEmit` and `npx eslint src/ app/ --ext .ts,.tsx` pass with zero issues.
- All linting errors are resolved.
- Navigation works end-to-end for any new screen.
- Loading, error, and empty states are implemented where applicable.
- Accessibility: roles, labels, states, 44×44 touch targets, WCAG AA contrast
- Dark mode (if supported) works correctly.
- Offline behavior is handled appropriately.
- No hardcoded colors, spacing, or typography values are used.
- Components follow the project architecture.
- The implementation matches the approved design reference.
- No unflagged TODOs/placeholders — the Phase 1 mock layer (`3.1`) is the one sanctioned, intentional exception
- UI consistency is mandatory. Similar screens and features must follow the same design language, layout patterns, spacing, typography, colors, components, icons, and interactions. Do not introduce new UI patterns or visual styles unless explicitly required by the approved design system.

---

### [Development Philosophy]
Build feature by feature.

For every feature:
1. Read the relevant project documentation before writing any code.
2. Reuse existing components whenever possible. Create a new component only when justified by the Component Creation Rule.
3. Keep the implementation simple and focused.
4. Avoid overengineering - build the smallest correct solution first.
5. Prefer readable and maintainable code over clever code.
6. Refactor only when duplication or unnecessary complexity appears.
7. Verify that the implementation satisfies the Definition of Done before considering the feature complete.
8. Emergency features are life-safety critical - triple-check them before finishing.

---

### [Feature Implementation Rules]
When the user asks to build a feature:

1. Read this file first
2. Identify which files to create or modify
3. Check component and screen indexes for what already exists
4. Keep changes focused — do not rewrite unrelated code
5. Follow existing patterns exactly
6. Ensure the feature works end-to-end (navigation, data, states)
7. Fix TypeScript and lint errors before finishing
8. For emergency features: verify offline behavior before finishing

---

### [Communication Style]
Be concise. After implementing:

- List the files created or modified
- Do not explain what changed and why until I don't want to
- Describe how to test the feature
- Flag any follow-up work needed

---


### [Linting and Validation]
Before finishing any task:

```tsx
npx tsc --noEmit # Must return: "Found 0 errors"
npx eslint src/ --ext .ts,.tsx # Must return: 0 problems
```

Fix all errors and warnings before marking a task complete. Never suppress lint rules without a documented comment explaining why.