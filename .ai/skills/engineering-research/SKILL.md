---
name: engineering-research
description: Investigate technologies, libraries, frameworks, protocols, repositories, APIs, and engineering ideas to produce actionable engineering understanding — how something actually works, whether an existing solution already exists, whether an idea is feasible, and how to implement it. Use this whenever the user asks to research, investigate, evaluate, compare, reverse engineer, "figure out how X works," or "find something that does X" for anything technical, including databases, runtimes, SDKs, standards, and blockchain protocols (launchpads, DEXes, AMMs, bonding curves, fee formulas, token mechanics). Trigger even when the user doesn't say "research" — "I found this tool, what is it?" or "is there already a library for this?" both qualify.
---

# Engineering Research

Research technologies, systems, and engineering ideas with the goal of producing **actionable engineering understanding**, not an academic literature review.

The research must eventually answer:

> **What should an engineer know or do after reading this?**

Translate findings into mechanisms, interfaces, data flows, formulas, constraints, implementation options, failure modes, and concrete next steps. Do not stop at describing the topic.

---

## Reference files

Read these only when the investigation calls for them:

| Situation | Read |
| --- | --- |
| Topic is a DEX, launchpad, AMM, bonding curve, staking, bridge, token, or any on-chain protocol; or you need to pin down a formula/fee/pricing mechanism | `references/blockchain-protocols.md` |
| Deciding whether to adopt a technology (Mode E) | `references/evaluation-criteria.md` |
| A repository, SDK, or codebase is the main evidence source | `references/repository-research.md` |
| Writing the final report — full template, section guidance, and a worked example | `references/report-template.md` |

---

## Research modes

Identify which apply; combine when needed.

**A — Technology discovery.** The user found something unfamiliar (a database, framework, runtime, AI technique, protocol). Answer: what is it, what problem does it solve, how does it work internally, what are its components, how does it differ from existing approaches, what are its limits, what does production use look like, how mature is the ecosystem, and what should an engineer learn first. Do not repeat the project's marketing.

**B — Solution discovery.** The user has a problem or rough idea. Search in this order: commercial products → open-source projects → libraries/primitives that solve part of it → adjacent approaches that could be composed → what remains unsolved → only then a custom design. Classify each candidate as direct solution, partial solution, enabling primitive, adjacent approach, or unsuitable. Never conclude "nothing exists" after searching only the obvious terminology; try the words the industry actually uses.

**C — Implementation research.** The user wants to build something. Determine components, interfaces, protocols, data model, algorithms, libraries, infrastructure, deployment, performance and scaling constraints, security, failure handling, observability. Produce an implementable architecture whenever the evidence supports one — prefer a concrete design over abstract discussion.

**D — Reverse engineering.** Behavior is undocumented or documentation may not match reality. Evidence: source, contract/program code, SDKs, generated clients, tests, examples, transaction traces, network requests, ABI/IDL/schemas, package artifacts, commit history, issue threads. Work from observed behavior toward explanation, and keep directly verified, code-inferred, observation-inferred, and speculative findings clearly separated.

**E — Technology evaluation.** Deciding whether to adopt. The recommendation should answer *under what conditions should we choose this*, not declare a universal winner. Use `references/evaluation-criteria.md`.

**F — Protocol / blockchain investigation.** Investigate at the implementation level: addresses, authorities, instruction set, token parameters, pricing mechanism, fees, lifecycle, and numerical reproduction. Use `references/blockchain-protocols.md`.

---

## Research depth

Pick depth from the user's goal; Level 2 is the default.

| Level | Use when | Deliver |
| --- | --- | --- |
| 1 Reconnaissance | Initial exploration | What it is, why it exists, rough mechanism, main alternatives, whether deeper work is worthwhile |
| 2 Engineering understanding | Default | Enough that an experienced engineer could evaluate, integrate with, design around, and estimate effort |
| 3 Implementation-level | User will build against or replicate it | Source, APIs, schemas, algorithms, state transitions, code paths, edge cases |
| 4 Reverse engineering | Accurate understanding requires reconstructing behavior | Code, artifacts, transactions, program state, network traffic, historical versions |

Do not enter Level 4 unless necessary.

**Effort budget.** Roughly: Level 1 ≈ 3–6 sources, Level 2 ≈ 8–15, Level 3+ as many as the questions require. Stop when two consecutive searches or fetches add nothing new to the open questions. Do not keep collecting sources that only restate what is already established.

---

## Workflow

Follow this unless the task is trivial.

### 1. Convert the request into research questions

Translate the request into explicit questions internally. "Research this new launchpad" becomes: what program implements it, is it open source, how are tokens created, what curve is used, how is price calculated, what fees exist, when does graduation happen, where does liquidity go, can the math be reproduced, what would integration require. Do not burden the user with a questionnaire unless missing information makes research impossible.

### 2. Build a search map

Identify where evidence likely lives before going deep: official site, docs, GitHub, package registry, examples, issue tracker, explorer/IDL/ABI for protocols, commercial products and research prototypes for ideas. Start broad enough to learn the terminology, then narrow aggressively.

### 3. Establish ground truth

Identify what is authoritative: the canonical repository, the deployed version, the active SDK, the current docs, the protocol version. Watch for abandoned repos, stale docs, deprecated implementations, forks, and multiple protocol versions. Record version-sensitive findings — version matters.

### 4. Understand top-down

Build the overall model first:

```text
User → Client/SDK → API/Protocol → Core engine/contract → State/DB/chain
```

For each component: responsibility, inputs, outputs, state, dependencies.

### 5. Go bottom-up where necessary

Inspect only the code paths that answer research questions: functions, instructions, structs, constants, schemas, serialization, validation, tests. Do not read code indiscriminately.

### 6. Trace one concrete flow

Trace a complete real operation end to end (an HTTP request through router → validation → service → DB → response; a trade through wallet → instruction → account validation → reserve math → fee → transfer → state update). Concrete flows expose details architecture diagrams hide.

### 7. Verify important claims

Consequential findings need two independent forms of evidence: docs + source, source + test, source + transaction, SDK + observed behavior, spec + implementation. Especially verify formulas, fees, limits, security behavior, addresses, supply numbers, graduation conditions, and performance claims.

### 8. Reproduce when possible

Calculate the quote, derive the reserves, decode the account, replay the request, run the minimal example, reproduce the benchmark. If reproduction disagrees with documentation, investigate the discrepancy — that gap is usually the most valuable finding.

### 9. Search for failure modes

Look at GitHub issues, bug reports, security advisories, audits, CVEs, outage reports, and operational complaints. Ask: *what would surprise an engineer deploying this in production?*

### 10. Synthesize

Build a coherent model, not a link collection. Separate **facts** (directly established), **strong inferences**, **unknowns** (could not verify), and **hypotheses** (need further work).

---

## Using the tools

The skill is only as good as the evidence gathered. Concretely:

- **If the user gives a URL or repo, fetch it first** with `web_fetch` (or clone it) before searching anything else.
- **Fetch the actual page.** Search snippets are Tier 5 evidence. Once a promising docs page, source file, or issue appears in results, `web_fetch` it and read it.
- **Clone repositories** when source is the evidence: `git clone --depth 1 <url>` in the sandbox, then `grep -rn` for constants, fee denominators, magic numbers, and the functions named in the research questions. See `references/repository-research.md`.
- **Read raw source files** via `raw.githubusercontent.com` when only one or two files matter.
- **Run the math.** Reproduce formulas, unit conversions, and rounding in Python rather than by hand; integer-vs-float and floor-vs-ceil mistakes are the most common way a formula is "understood" but wrong.
- **Install and run the package** (`pip install`, `npm install`) when a minimal example settles a behavioral question faster than reading.
- **Search alternative terminology** before declaring no solution exists — the industry name for a concept is often not the user's name for it.
- **Include the name as the user wrote it** in at least one search; broader category searches miss the specific thing.

---

## Source hierarchy

Prefer evidence in roughly this order.

1. **Primary technical evidence** — official source, deployed contract/program code, specification, official docs and API docs, official SDK, project tests, standards, on-chain data, directly observed API behavior.
2. **Maintainer evidence** — maintainer comments on issues/discussions, release notes, changelogs, official engineering blogs, maintainer talks.
3. **Independent technical analysis** — reputable engineering blogs, security audits, technical writeups, benchmark reports, reverse-engineering reports.
4. **Community discussion** — Reddit, Stack Overflow, Discord, X, forums, personal blogs. Good for leads and undocumented behavior; verify when practical.
5. **Search snippets and aggregators** — discovery only. Never base an important conclusion on a snippet or generated summary.

When sources disagree: check whether they describe different versions, prefer implementation over marketing, prefer deployed behavior over stale docs, check timestamps, check whether configuration explains the difference. Report unresolved contradictions explicitly.

---

## Confidence and gaps

If documentation is incomplete, work through: source code → tests → SDK behavior → real-world usage → issues/discussions → derive mathematically or experimentally. Do not fill gaps with confident guesses.

Where uncertainty matters, label it: **Confirmed**, **Strong evidence**, **Likely**, **Unknown**. Skip labels when everything is straightforward — they add noise, not rigor.

---

## Freshness, security, performance

**Freshness.** Check publication date, release version, repository activity, latest stable release, deprecated APIs, changed addresses. Prefer current behavior over historical unless history explains the design. Say when a finding is version-specific.

**Security.** For anything handling money, credentials, keys, user data, production traffic, or contract funds, investigate the relevant trust boundaries, auth, key management, input validation, replay, races, unsafe defaults, supply-chain risk, upgrade authority, and privileged roles. Do not turn every investigation into a generic audit — focus on what is relevant to this technology.

**Performance.** When it matters, look at latency, throughput, memory, CPU, I/O, concurrency, scaling. Treat vendor benchmarks with suspicion; prefer reproducible or independent benchmarks that resemble the user's workload, and say when comparisons are not apples-to-apples.

---

## Delivery

Match the output to the depth:

- **Level 1** — a conversational reply, a few paragraphs plus a short list of alternatives. No file.
- **Level 2** — a structured report following `references/report-template.md`. Deliver as a Markdown file (or published artifact) if the tooling supports it; otherwise in chat with headers.
- **Level 3–4** — a full report, usually a file, with formulas, addresses, schemas, and worked examples included. Put reproduction scripts in a separate file if they exist.

Lead with the Bottom Line. An engineer skimming the first screen should know the verdict, the mechanism in one sentence, and the single biggest gotcha. Cite technical claims next to where they appear, linking to the most specific artifact (source file, function, contract, transaction, issue), not a source dump at the end. Only include details that affect implementation, architecture, correctness, cost, scalability, or security.

---

## Stop conditions

Research is complete when the major questions have answers, the mechanism can be explained, important claims have evidence, critical unknowns are named with a way to resolve each, existing alternatives were considered, and the user can make a decision or start building.

---

## Principles

- Think like an engineer investigating an unfamiliar system, not a student writing a survey.
- Discover existing solutions before designing new ones; do not reinvent infrastructure.
- Inspect source when documentation is insufficient, and never assume documentation matches deployed behavior.
- Calculate formulas yourself; a formula is not understood until it reproduces observed output.
- Challenge marketing claims; do not trust a single secondary source for an important claim.
- Distinguish observed fact from inference, and never invent undocumented formulas.
- Skip history that does not affect the engineering decision, and skip basics the user clearly already knows.
- Do not list dozens of tools without evaluating them, and never stop at "here are some links."

The reader should finish feeling able to continue the investigation or implementation themselves.
