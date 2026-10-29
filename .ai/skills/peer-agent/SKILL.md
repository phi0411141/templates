---
name: peer-agent
description: Coordinate a host AI with a second AI from a different provider for independent analysis, code review, adversarial discussion, or verification, then synthesize one evidence-backed result. Use only when the user explicitly invokes $peer-agent or asks to use the peer-agent skill.
disable-model-invocation: true
---

# Peer Agent

This skill requires explicit user invocation. Generic requests for a second opinion, debate, or peer review do not activate it. Requests to review or edit the skill itself do not authorize launching a peer.

Use a second provider as a critical peer, not as an authority or a vote. The host agent remains responsible for the final answer and any edits.

## Choose the collaboration shape

Match the smallest useful mode to the request:

- **Independent second opinion:** obtain the peer's answer before sharing the host's conclusion. Best for architecture, debugging, research, and ambiguous decisions.
- **Code review:** give the peer the exact review scope and ask for prioritized, line-specific findings. The host verifies every material finding against the code and tests.
- **Adversarial discussion:** use after the independent pass when conclusions conflict or stakes justify another round. Exchange claims and evidence, not entire repeated answers.
- **Implementation check:** keep the peer read-only, let the host make edits, then ask the peer to inspect the resulting diff. Use a single writer unless the user explicitly requests another arrangement.

Do not manufacture disagreement. A single peer pass is enough when both analyses converge and verification supports them.

## Establish scope and safety

Before invoking a peer:

1. Capture the task, success criteria, relevant paths or artifacts, constraints, and whether changes are authorized.
2. Identify the host provider/model only when the environment exposes it; never guess. Select an available CLI or tool from a genuinely different provider. If none is available or authenticated, report that limitation instead of pretending a second agent ran.
3. Treat the peer as an external recipient. Exclude credentials, tokens, private keys, personal data, and irrelevant proprietary material. If useful context is sensitive and the user's authorization to transmit it is unclear, ask before sending it.
4. Give the peer the least privilege required. Default to read-only for analysis and review. Never grant network access, broad filesystem access, automatic editing, or other high-impact permissions merely because this skill was invoked.
5. Agree on a bounded exchange. Default to one independent pass plus at most two focused follow-ups. Continue only while a round can add evidence or resolve a named disagreement.

For provider CLI discovery, invocation, session handling, and failure rules, read [references/cli-adapters.md](references/cli-adapters.md) immediately before running a peer CLI. For reusable task envelopes and follow-up prompts, read [references/peer-prompts.md](references/peer-prompts.md) when composing the exchange.

## Run the peer exchange

### 1. Prepare a neutral task envelope

Send only the context needed to reproduce the reasoning. Include:

- the user's request and acceptance criteria;
- the peer's role and requested deliverable;
- exact repository root and scoped files when relevant;
- known constraints, commands already run, and raw errors or test results;
- permission boundaries: read-only or explicitly authorized edits;
- a request to distinguish observations, inferences, and uncertainties.

For the first pass, withhold the host's preferred conclusion so the opinions are meaningfully independent. Do not withhold facts or user constraints.

### 2. Evaluate independently

While the peer works, inspect the evidence yourself. For code, read the relevant implementation and tests. Run safe, proportionate checks when authorized. Do not copy the peer's output directly into the answer.

Classify each material peer claim as:

- **verified:** supported by code, tests, authoritative documentation, or reproducible output;
- **plausible:** reasonable but not yet proven;
- **rejected:** contradicted by stronger evidence;
- **unresolved:** evidence is incomplete or genuinely ambiguous.

### 3. Discuss only useful disagreements

If material conclusions differ, send a concise follow-up that identifies:

- the disputed claim;
- each side's current evidence;
- the exact question that would resolve it;
- any newly collected test or documentation result.

Identify yourself as the host AI and state the actual provider/model only if known. Invite the peer to challenge both positions and to change its view. Stop when the agents converge, evidence decides the issue, the remaining uncertainty is explicit, or another round would only restate prior arguments.

### 4. Synthesize one result

Return a single coherent answer in the host's voice. Lead with the result, not the transcript. Include, as relevant:

- the recommended answer or implemented outcome;
- verified findings ordered by impact;
- important rejected suggestions and why they were rejected;
- unresolved tradeoffs or assumptions that require the user's decision;
- verification performed and remaining test gaps.

Mention that a cross-provider peer was consulted and name it only when known. Do not imply consensus proves correctness. Quote peer output sparingly and never expose hidden reasoning, credentials, command noise, or raw session metadata.

## Code-review rules

- Ask for correctness, security, data-loss, concurrency, compatibility, and missing-test issues before style preferences.
- Require file and line references or a precise code path for each finding.
- Verify that the reported behavior is reachable and not already guarded elsewhere.
- De-duplicate overlapping findings and calibrate severity from impact and likelihood.
- If no actionable issue survives verification, say so plainly and note residual testing limits.
- The peer may propose a patch, but the host reviews and applies it. Never allow two agents to edit the same working tree concurrently.

## Failure and stopping behavior

- Preserve the peer command's exit status and enough stderr to diagnose failures; suppress or summarize noisy progress output only after success.
- On an empty response, check for blocked stdin, timeout, authentication, or an unsupported flag. Retry at most once after correcting a clearly identified transient or invocation problem.
- Stop on authentication failures, missing tools, permission denials, repeated empty output, or non-zero exits without a safe correction. Report what ran and what did not.
- Do not silently substitute a same-provider model when cross-provider review was requested. Offer it only as a clearly labeled fallback.
- Do not keep a session alive or resume it unless a follow-up is useful. When the CLI exposes a resumable session, tell the user how it can be continued without promising that session state will persist forever.
