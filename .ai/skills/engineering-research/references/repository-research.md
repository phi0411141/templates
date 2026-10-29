# Repository Research

Read this when a repository, SDK, or codebase is the main evidence source. Investigate it as an engineering system; do not read every file.

## Get the code

```bash
cd /home/claude
git clone --depth 1 https://github.com/<org>/<repo>.git
cd <repo>
```

If only a few files matter, fetch them directly from `raw.githubusercontent.com/<org>/<repo>/<branch>/<path>` instead.

If the repo has tags, note which tag corresponds to the deployed/released version the user cares about — `main` may be ahead of production:

```bash
git ls-remote --tags https://github.com/<org>/<repo>.git | tail -20
git clone --depth 1 --branch <tag> https://github.com/<org>/<repo>.git
```

## Orientation (5 minutes, in this order)

1. `README` — claimed purpose, quick-start, links to docs.
2. Package manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`) — name, version, dependencies, entry points, scripts.
3. Repository structure — `find . -maxdepth 2 -type d | grep -v node_modules | grep -v .git`.
4. Entry points — `main`, `index`, `lib.rs`, `cmd/`, `bin/`.
5. Public API — exported symbols, `mod.rs`, `__init__.py`, `index.ts`.
6. Core modules — the directories that the entry points import.
7. Tests — they document intended behavior more honestly than docs.
8. Examples — the shortest path to seeing real usage.
9. Configuration — defaults, env vars, feature flags.

## Find the code path that answers the question

Grep before reading:

```bash
grep -rn "fee" --include="*.rs" --include="*.ts" . | grep -iv test | head -40
grep -rn "const \|static " src/ | head -60          # constants and magic numbers
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ | head       # known rough edges
```

Pay special attention to:

- constants, hidden defaults, magic numbers
- feature flags and environment-gated behavior
- generated code (an IDL/ABI/OpenAPI file is often more authoritative than hand-written docs)
- version-specific branches (`if version >= 2`)
- validation logic — what is rejected tells you the real constraints

## Use history when current code doesn't explain itself

```bash
git clone https://github.com/<org>/<repo>.git   # full clone for history
git log --oneline -- path/to/file | head
git log -S "FEE_DENOMINATOR" --oneline           # when did this constant appear/change
git blame path/to/file | sed -n '40,60p'
```

Commit messages and linked PRs frequently explain *why* a constraint exists.

## Run it when reading is slower than running

```bash
npm install && npm test                            # or: cargo test / pytest
node -e "const x = require('./dist'); console.log(x.someFn(1,2))"
python -c "import pkg; print(pkg.some_fn(1, 2))"
```

A ten-second experiment settles behavioral questions that would take an hour to trace by hand. Use it especially for rounding, defaults, and error behavior.

## Record

For every finding from code, capture the file path and line (or function name) so the report can cite it. Note the commit hash or tag inspected — findings are version-specific.
