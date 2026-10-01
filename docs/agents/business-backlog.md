# Business backlog

The **business** backlog carries the project's **user stories**. It is managed by humans
(PO / team); agents **read** it to start a design session and **post back** a traceability link
once the technical issues are created. It is the upstream source of the pipeline ("Understand
the need").

> Distinct from the **technical backlog** (`docs/agents/issue-tracker.md`), which is by and for
> agents. N business issues ≠ N technical issues: one story can yield several technical issues,
> or several stories can collapse into one.

## Tool

Tool: **local Markdown**, versioned in this repository. No CLI/MCP integration: the back-link
(step 6 of `/to-tickets`) is a **manual** gesture.

- **Access / tool**: manual — read and edit the files directly
- **Location**: `docs/business-backlog/US-<nnn>-<slug>.md`, one file per user story (layout:
  `docs/agents/us-format.md`)
- **Auth**: none (repository access)

## Agent queue (story selection)

The agent does **not** pick at random: a human **selects** the stories to work on upstream, by
setting the `Status:` line of the story file. The agent only picks from there.

- **Where the agent picks**: files with `Status: To do`
- **Transition at start**: `To do` → `Doing` when design starts
  (trigger when: grilling done + story selected + technical counterpart created)
- **Transition to review**: `Doing` → `Review` when the PR opens

## Commands / gestures

```
# READ a story:        cat docs/business-backlog/US-<nnn>-<slug>.md
# LIST the queue:      grep -l '^Status: To do' docs/business-backlog/*.md
# COMMENT on a story:  append the issue/PR URL under the story's `## Links` section
#                      (manual, or by the agent on approval)   (used by /to-tickets for traceability)
# MOVE / change state: edit the story's `Status:` line
```

## Link to the technical backlog

Keep the **business reference** (story id, e.g. `US-001`, and its file path) in the spec /
technical tickets, for two-way traceability.

    business backlog (story selected by a human)
      └─ /grill-with-docs    → CONTEXT.md + ADRs   (on integration/<business-ref>-<slug>)
          └─ /to-spec        → spec on the technical backlog
              └─ /to-tickets → technical tickets + back-link on the business story
                  └─ implementation (see git-flow)
