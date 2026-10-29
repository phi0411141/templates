# Peer CLI adapters

Read this reference only when launching a peer provider through a local CLI. Prefer an already available first-class tool or connector when it can perform the same bounded exchange.

## Runtime discovery

Do not assume a provider CLI, model catalog, authentication state, or flag set from memory.

1. Look for plausible commands with `command -v`, prioritizing a provider different from the host.
2. Run `<command> --version` and the relevant `--help` form before the first invocation.
3. Choose the documented non-interactive or print mode. Confirm how the command accepts a prompt, selects a model, limits tools, sets the working directory, resumes a session, and reports errors.
4. Honor an explicit user model choice. Otherwise use the installed CLI's configured default unless the task needs a capability it lacks. Do not force the user through model selection for an ordinary peer pass.
5. State the chosen peer/provider and consequential access mode before launch. Ask for approval at the point required by the host environment for network, filesystem writes, or broad access.

Use argument arrays or safely quoted arguments when a harness supports them. For multiline prompts, prefer stdin or a temporary file created with restrictive permissions. Avoid interpolating untrusted prompt text into shell syntax. Close stdin explicitly when a CLI otherwise waits for more input.

Keep the repository as the working directory only when the peer needs it. Read-only analysis should use the CLI's read-only or tool-disabled mode when available. Do not infer permission for automatic edits from permission to consult a peer.

## Codex CLI adapter

Use this adapter when Codex is the peer and the host is from another provider. Treat locally reported help as authoritative if it differs from these examples.

Preflight:

```sh
command -v codex
codex --version
codex exec --help
```

For a new read-only peer pass, construct the equivalent of:

```sh
codex exec --skip-git-repo-check --sandbox read-only -C <repo> <prompt> </dev/null
```

Add `--model <model>` and the locally documented reasoning-effort setting only when the user requested them or a deliberate override is necessary. Use workspace-write or any automatic-approval mode only for edits the user authorized and only when the installed CLI documents that mode. Broad or danger-full access is exceptional and requires explicit approval immediately before use.

Codex can emit progress or diagnostic data on stderr. Capture stdout and stderr separately. Do not discard stderr before checking a successful exit, because warnings and actionable failures may appear there; summarize it rather than exposing noisy internals.

For a follow-up, prefer the exact session identifier returned by the initial call when supported. If the user explicitly wants the most recent session and the local help supports it, the shape is:

```sh
codex exec --skip-git-repo-check resume --last < <prompt-file>
```

Resume inherits session configuration unless the installed CLI documents an override. Do not use `--last` when another concurrent Codex session could make the target ambiguous; use an explicit session identifier instead.

Codex may buffer its final answer until completion. Use a timeout proportionate to the task and reasoning setting, but do not treat silence alone as failure. When running through a session-based command tool, poll without blocking user-visible updates for long intervals.

## Claude CLI adapter

Claude CLI must run outside the host sandbox to access its authentication. Apply this to authentication checks, initial peer calls, and follow-up or resumed sessions. When invoking it through Codex's command tool, set `sandbox_permissions: "require_escalated"` and provide the required justification. In other hosts, use the supported equivalent for execution outside the sandbox and honor any required approval.

Keep Claude's own tool permissions read-only or disabled for analysis and review. Running the CLI outside the host sandbox does not authorize automatic edits or bypassing Claude's permission checks. Derive invocation flags from the installed CLI's help as described below.

If a sandboxed Claude invocation reports an authentication failure, retry at most once outside the sandbox through the supported escalation mechanism before concluding that Claude is unauthenticated. If authentication still fails, or escalation is denied or unavailable, stop and report the limitation.

## Other provider CLIs

For Claude, Gemini, or another provider, derive the adapter from the installed CLI's help rather than copying Codex flags. In particular, verify:

- whether non-interactive output requires a print/execute flag;
- whether prompts are positional, stdin-based, or mutually exclusive;
- whether tool access is enabled by default;
- how read-only access is enforced;
- whether session resume targets a stable ID or merely the last session;
- whether JSON output separates the answer from usage and diagnostics.

If the CLI cannot guarantee the requested access boundary, do not run it against sensitive or writable project data. Create a minimal sanitized context bundle in a temporary directory, or report that the adapter is unsuitable.

## Failures

Treat a missing binary, authentication error, rate limit, permission denial, unsupported option, timeout, non-zero exit, or empty final answer as an explicit peer failure. Correct one clearly identified invocation issue at most once. Do not repeatedly retry billable calls, weaken sandboxing, change models, or switch providers without telling the user when that changes cost, disclosure, or requested scope.
