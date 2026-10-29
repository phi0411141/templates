# Technology Evaluation (Mode E)

Read this when the user is deciding whether to adopt, replace, or standardize on a technology.

## Framing

The output of an evaluation is a conditional recommendation:

> Choose X when [conditions]. Prefer Y when [other conditions]. Avoid X if [dealbreakers].

Not "X is the best." Universal winners are rarely true and never useful.

Avoid numerical scoring unless it materially improves the decision — a 7.2 vs 6.8 comparison hides the one criterion that actually matters. If you do score, weight by the user's stated priorities and show the weights.

## Criteria

Cover at least the following. For each, record what you found and how confident you are; skip criteria that clearly do not apply to this decision rather than padding.

| Criterion | What to establish |
| --- | --- |
| Technical fit | Does it solve the actual problem, or an adjacent one? What would need to be worked around? |
| Architecture fit | How does it slot into the user's existing system? What does it force (runtime, data model, deployment shape)? |
| Developer experience | Quality of docs, API ergonomics, error messages, debugging story, local dev loop. |
| Operational complexity | What has to be run, monitored, upgraded, backed up. Who is on call for it. |
| Ecosystem maturity | Integrations, tooling, client libraries, hosting options. |
| Maintenance activity | Commit frequency, release cadence, issue response time, number of active maintainers, bus factor. |
| Performance | Measured under a workload resembling the user's. Vendor numbers are claims, not evidence. |
| Scalability | Where does it stop scaling and what is the path beyond that. |
| Security | Advisory history, disclosure process, default posture, privileged roles. |
| Observability | Metrics, tracing, logs, and how much you get for free. |
| Migration cost | Getting in, and — more importantly — getting out. |
| Vendor lock-in | Proprietary formats, protocols, or hosted-only features. |
| Failure modes | How it breaks and how loudly. Partial failures, data loss scenarios, split brain. |
| Community adoption | Who uses it in production at what scale; public postmortems. |
| Long-term viability | Funding, governance, license changes, single-company control. |
| License | Exact license and any recent changes (source-available relicensing is common). |

## Process

1. Establish what the user is actually deciding between — often the real alternative is "keep doing what we do now," which needs to be in the comparison.
2. Identify the two or three criteria that dominate this particular decision. Investigate those to Level 3 depth; cover the rest at Level 1–2.
3. Look for evidence of the technology failing: issues tagged as bugs, postmortems, "why we moved off X" posts, and audit findings. Success stories are marketing; failure stories are data.
4. Check whether the user's workload matches the workloads the technology was built for. Mismatch here predicts most adoption failures.
5. Write the conditional recommendation.

## Output additions

On top of the standard report template, include:

- **Decision criteria that dominated** and why.
- **Dealbreakers found** (or an explicit statement that none were found).
- **What would change the recommendation** — the fact that, if it turned out differently, would flip the answer.
- **Suggested prototype** if the decision cannot be settled from evidence alone: what to build, how long, what to measure.
