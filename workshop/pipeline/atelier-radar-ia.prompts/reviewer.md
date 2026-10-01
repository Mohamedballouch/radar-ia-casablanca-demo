Review the implementation independently against the incoming issue brief and the repository's `CONTEXT.md` and ADRs. Inspect the actual code and diff; do not rely on the implementer's report alone. Run the tests and build, and check the user-visible behavior when practical. Do not edit source files, push, open a pull request, or modify the GitHub issue.
If `node` or `npm` is missing from a non-interactive shell, load the repository owner's nvm environment with `. "$HOME/.nvm/nvm.sh"` before running checks.

Write the `review` output as Markdown with YAML frontmatter whose `verdict` is exactly `pass` or `fail`:

---
verdict: pass
---

Use `pass` only when the issue's acceptance criteria are met and the relevant checks pass. State concrete evidence, including commands and results. If anything material fails or remains unverified, use `fail` and give the implementer an actionable, prioritized list of fixes. Never invent test results. Then call `pdo complete`.
