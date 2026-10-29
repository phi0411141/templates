# Peer exchange prompts

Use these as task envelopes, not mandatory wording. Replace bracketed fields and remove irrelevant sections. Never include secrets or hidden reasoning.

## Independent analysis

```text
You are the independent peer in a cross-provider review. Analyze the task without assuming the host agent's conclusion.

Task: [user request]
Success criteria: [observable criteria]
Context/artifacts: [minimal relevant context or paths]
Constraints: [technical and permission constraints]
Requested output: [decision, diagnosis, design, etc.]

State your recommended result, strongest evidence, material alternatives, and uncertainties. Separate direct observations from inferences. Do not edit files unless the permission section explicitly authorizes it.
```

## Code review

```text
Act as an independent code reviewer. Review only [scope] against [requirements/base diff]. You have read-only access.

Prioritize actionable correctness, security, data-loss, concurrency, compatibility, and missing-test issues. For every finding provide severity, exact file/line or code path, triggering conditions, impact, evidence, and the smallest reasonable remediation. Avoid style-only comments unless they mask a defect. Say explicitly if no actionable findings survive your review, and list any areas you could not verify.
```

## Disagreement follow-up

```text
This is the host AI [provider/model if actually known] following up on our independent analyses.

Disputed claim: [precise claim]
Your evidence: [faithful concise summary]
My current evidence: [code/test/docs result]
Resolution question: [specific falsifiable question]

Challenge both positions. Say what evidence would change your conclusion, and revise it if the new evidence warrants that.
```

## Post-edit verification

```text
Review the resulting diff as a read-only peer against the original acceptance criteria: [criteria]. Focus on regressions, incomplete fixes, unsafe behavior, and missing tests. Do not redesign unrelated code. Return only actionable findings with evidence, followed by residual risks if any.
```
