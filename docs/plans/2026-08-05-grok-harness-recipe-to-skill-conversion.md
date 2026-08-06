# Grok.com Harness Recipes → Skill Conversion Plan

> **For Hermes:** Plan only until the operator says proceed. Do **not** create ten skills. Prefer umbrella + scripts. Use `hermes-agent-skill-authoring` when implementing. Use `subagent-driven-development` only if the operator requests task-by-task subagents.

**Goal:** Convert the “Local harness recipes” from the field-guide site into durable Hermes procedural memory without skill sprawl — one loadable umbrella, thin scripts for mechanical recipes, deep procedure only where multi-step failure modes justify it.

**Architecture:** Expand the existing profile skill `grok-com-deep-links` into the single entrypoint for all grok.com deep-link + local-harness work. Mechanical recipes become `scripts/*` + a `references/harness-recipes.md` index. Two optional **depth modules** (still under the same skill directory as `references/` or nested procedure sections — **not** separate skill names unless promotion criteria fire later) cover (1) Safari open+harvest and (2) param-matrix re-verification. The HTML docs site remains the human-facing visual surface; the skill points at it and at `data/findings.json` as the observation store.

**Tech stack / locations:**
- Skill (profile): `/Users/velocityworks/.hermes/profiles/idea/skills/software-development/grok-com-deep-links/`
- Docs site: `/Users/velocityworks/IdeaProjects/grok-com-query-params-docs/`
- Source recipes: `data/findings.json` → `harnessRecipes[]`
- macOS: Safari + `osascript`, `pbpaste`/`pbcopy`, `open -a Safari`, optional `computer_use`
- No new npm/python package required; stdlib + shell only for scripts

**Date:** 2026-08-05  
**Status:** Draft — pending operator review (not approved). **Adversarial review:** `docs/plans/2026-08-05-grok-harness-conversion-plan-adversarial-review.md` — **revise before implement (P0s).**

---

## 1. Governing principles (conversion doctrine)

### 1.1 What a Hermes skill is for

A skill is **procedural memory for the agent**: trigger conditions, ordered steps, exact commands, pitfalls, verification. It is loaded when the task matches.

A skill is **not**:
- A cookbook of every one-liner the user might run once
- A duplicate of a polished HTML docs site
- A place to park cron schedules that never need LLM judgment
- Ten near-identical siblings that compete in the skill index (descriptions truncate ~57 chars in the index)

### 1.2 Conversion decision test (apply to every recipe)

Score each recipe 0–2 on each axis. **Convert to first-class skill procedure** only if total ≥ 6 **or** any single axis is 2 on “failure surface” **and** “reuse frequency” is ≥ 1.

| Axis | 0 | 1 | 2 |
|------|---|---|---|
| **A. Multi-step / branching** | 1–3 commands, linear | 4–8 steps, mild branches | Long loop, waits, UI states, recovery |
| **B. Failure surface** | Obvious shell errors | Session/auth/URL pitfalls | Flaky UI, false success, data corruption risk |
| **C. Judgment required** | Pure glue | Light truncation/mode choice | When to private, what to summarize, when to stop |
| **D. Reuse frequency** | Rare / demo | Monthly | Weekly+ or every session class |
| **E. Wrong-if-improvised cost** | Low | Wastes History / wrong mode | Wrong session, leaks secrets, bad matrix data |

**Outcomes:**
- **UMBRELLA SCRIPT** — mechanical; live as `scripts/*.py` + one index line in skill
- **UMBRELLA SECTION** — short procedure in SKILL.md body (not its own skill name)
- **DEPTH MODULE** — long `references/*.md` + scripts; still one skill name
- **STANDALONE SKILL** — only if depth module outgrows umbrella *and* distinct trigger would mis-fire the umbrella (promotion criteria in §6)
- **DO NOT SKILL** — docs/cron/alias only; skill merely *mentions*

### 1.3 Hard non-goals

1. Do **not** create `grok-clipboard-skill`, `grok-git-diff-skill`, … (ten skills).
2. Do **not** move the HTML field guide into SKILL.md (keep site; skill links to it).
3. Do **not** promise voice deep-links or Heavy without re-verify (matrix already marks these).
4. Do **not** open embedded/bot browsers for authenticated SuperGrok behavior.
5. Do **not** auto-submit secrets, full `.env`, or unbounded file contents into `q=` URLs.

---

## 2. Current inventory (source of truth)

### 2.1 Existing skill

| Item | Path |
|------|------|
| Skill root | `~/.hermes/profiles/idea/skills/software-development/grok-com-deep-links/` |
| Entry | `SKILL.md` (~6.8 KB) — already covers URL recipes, no-ops, Shortcut pattern, re-verify method, pitfalls |
| Refs | `references/query-param-matrix-2026-08-05.md`, `references/docs-site.md` |

### 2.2 Site harness recipes (`data/findings.json` → `harnessRecipes`)

| id | Title | Capabilities (site) |
|----|-------|---------------------|
| `clip-expert` | Clipboard → Grok Expert | terminal, pbpaste, Safari |
| `file-private` | Local file → Private Grok | terminal, filesystem, privacy |
| `git-diff-review` | git diff → Expert review | terminal, git |
| `safari-applescript` | Open in already-authenticated Safari | osascript, Safari |
| `hermes-computer-use-harvest` | computer_use: open + harvest reply | computer_use, Safari, observe |
| `param-matrix-rerun` | Re-run the param matrix under Hermes | terminal, Safari JS, filesystem |
| `cron-morning-opener` | Cron: open a standing Grok brief | cronjob, open/Safari |
| `second-opinion` | Hermes draft → Grok second opinion | filesystem, terminal, Safari |
| `idea-selection` | IDE / Terminal selection via pbcopy bridge | clipboard, shell alias |
| `build-mode-spike` | Build-mode spike from a local spec | filesystem, mode=build |

### 2.3 URL-only recipes (already skill material)

Site `recipes[]` (basic, mode, fast, private, private-expert, mode-only) stay as **URL doctrine** in SKILL.md — they are not “harness recipes” and need no scripts beyond the live builder on the site.

---

## 3. Per-recipe conversion matrix (meticulous)

Legend: **Disposition** = what the upgrade produces. **Rationale** = why that disposition, not another.

---

### 3.1 `clip-expert` — Clipboard → Grok Expert

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SCRIPT** via sole CLI `scripts/open_grok.py --clipboard` + one SKILL.md recipe line |
| **Standalone skill?** | **No** |
| **Scores** | A1 B1 C1 D2 E1 → commentary only (see §1.2); disposition from flowchart: encode+open → SCRIPT |
| **Rationale** | Linear: read clipboard → encode → open Safari. Failure modes are “empty clipboard” and “Safari not logged in” — documentable in pitfalls, not a multi-phase protocol. High reuse does **not** justify a separate skill name; reuse is exactly why it is a **flag on the shared CLI**. |
| **Why not skill** | Creating `grok-clipboard` would duplicate umbrella triggers (“send this to grok”) and add index noise. |
| **Script contract** | `python3 scripts/open_grok.py --clipboard [--mode expert\|fast\|auto\|build] [--private] [--dry-run] [--max-chars N]`. Default mode `expert`. Exit 2 if clipboard empty. Print final URL. Uses `grok_url.py` + `open_safari.py` only. |
| **Verification** | `pbpaste` non-empty fixture → dry-run URL contains encoded text + `mode=`; private flag appends `#private` only at end. |
| **Site sync** | Keep harness card; snippet should prefer skill `open_grok.py --clipboard` once installed. |

---

### 3.2 `file-private` — Local file → Private Grok

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SCRIPT** via `scripts/open_grok.py --file PATH` (default `--private`) |
| **Standalone skill?** | **No** |
| **Scores** | A1 B1 C2 D1 E2 → commentary only; flowchart: encode+open → SCRIPT |
| **Rationale** | Same glue as clipboard with path argument + default `#private`. The *judgment* (how much to send, whether to summarize first in Hermes) belongs in **SKILL.md section “When the file is too large”**, not a second skill. Secret-risk is a **pitfall checklist**, not a separate skill. |
| **Why not skill** | “Open file in Grok” is a parameter variant of clipboard/git recipes on one CLI. |
| **Script contract** | `python3 scripts/open_grok.py --file PATH [--mode …] [--private\|--public] [--dry-run] [--max-chars N] [--preface TEXT]`. Private default **true** for `--file`. Refuse deny-listed paths unless override flag (exact secret policy refined in later review items). |
| **Verification** | Temp file with known string → dry-run URL; deny-listed path without override → exit nonzero. |

---

### 3.3 `git-diff-review` — git diff → Expert review

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SCRIPT** via `scripts/open_grok.py --git-diff` |
| **Standalone skill?** | **No** |
| **Scores** | A1 B1 C1 D2 E1 → commentary only; flowchart: encode+open → SCRIPT |
| **Rationale** | Classic local harness win, but still encode+open. Staged vs unstaged is `--staged`, not a skill boundary. Sensitive diffs → `--private`. |
| **Why not skill** | Overlaps “second opinion” and “clipboard”; agents would thrash between skills. |
| **Script contract** | `python3 scripts/open_grok.py --git-diff [--staged] [--cwd DIR] [--mode expert] [--private] [--dry-run]`. Cap via shared max encoded-length policy. Fixed review preface inside CLI or `--preface`. |
| **Verification** | Tiny git repo with known diff → dry-run URL contains hunk fragment. |

---

### 3.4 `safari-applescript` — Open in already-authenticated Safari

| Field | Value |
|-------|--------|
| **Disposition** | **Shared library only** — `scripts/open_safari.py` (import/CLI used by **all** openers). Not a user-facing recipe entrypoint. |
| **Standalone skill?** | **No** — infrastructure |
| **Scores** | A1 B2 C0 D2 E2 → commentary only; flowchart: not a task type → helper under SCRIPT path |
| **Rationale** | Highest leverage **primitive**, lowest value as its own skill. Every open goes through this module so agents never default to embedded browser. |
| **Why not skill** | Trigger would be “open URL in Safari” — far too broad. |
| **Helper contract** | `open_safari.py` / `open_url(url, *, dry_run=False, tab="new")` (tab default refined in later review item). Activate Safari; ensure a document; set URL. Optional return of front URL after short wait. **No** alternate path names (`lib_open_safari.py`, `scripts/lib/open_safari_url.sh` are **forbidden**). |
| **Verification** | Dry-run skips osascript; wet path documented as manual smoke. |

---

### 3.5 `hermes-computer-use-harvest` — open + harvest reply

| Field | Value |
|-------|--------|
| **Disposition** | **DEPTH MODULE** under umbrella: `references/harvest-grok-reply.md` + `scripts/observe_grok_page.js` + `scripts/harvest_grok_reply.py` (orchestrates **open_grok / open_safari + observe poll**; not a second open CLI) |
| **Standalone skill?** | **Not initially.** |
| **Scores** | A2 B2 C2 D1 E2 → commentary only; flowchart: wait/poll/extract → DEPTH MODULE |
| **Rationale** | Async UI, false completion, extract correctness — procedure required. |
| **Why not separate skill yet** | Trigger still “use grok.com from Hermes.” |
| **Why not mere script** | Procedure covers timeouts, URL shapes, model label, don’t scrape sidebar. |
| **Module contents** | Wait strategy; observe schema; extraction; forbidden actions. (Name/osascript-first branding is a separate P0 item.) |
| **Verification** | Known `?q=Say%20only%20HARVEST_OK&mode=fast` eventually contains HARVEST_OK or fail. |

---

### 3.6 `param-matrix-rerun` — Re-run param matrix

| Field | Value |
|-------|--------|
| **Disposition** | **DEPTH MODULE** `references/param-matrix-rerun.md` (+ automation scripts only if in scope for that milestone — see MVP split item). If a script exists later, it **calls** `open_safari.py` / observe helpers; it does **not** invent a parallel open CLI. |
| **Standalone skill?** | **Not initially** |
| **Scores** | A2 B2 C2 D1 E2 → commentary only; flowchart: multi-trial methodology → DEPTH MODULE |
| **Rationale** | Methodology + data integrity. |
| **Script contract (if any)** | No `open_grok.py` fork. Reuse shared observe + Safari primitives only. |

---

### 3.7 `cron-morning-opener` — Cron standing brief

| Field | Value |
|-------|--------|
| **Disposition** | **DO NOT SKILL** as agent procedure; template + optional `scripts/cron_open_grok.sh` that either embeds a fixed URL or calls `open_grok.py --text '…' --mode expert` in `no_agent` cron — **not** a fourth Python entrypoint family |
| **Standalone skill?** | **No** |
| **Scores** | A0 B0 C0 D1 E0 → commentary only; flowchart: zero judgment launcher → DO NOT SKILL |

---

### 3.8 `second-opinion` — Hermes draft → Grok second opinion

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SECTION** (protocol) + open via **`scripts/open_grok.py --file BRIEF [--mode expert] [--private] [--preface …]`**. **No** `brief_to_grok.py`. |
| **Standalone skill?** | **No** (generic second-opinion skill only if promoted later outside this plan) |
| **Scores** | A1 B1 C2 D2 E1 → commentary only; flowchart: short protocol without new I/O → SECTION |
| **Rationale** | Value is role split + brief shape; open is the shared CLI. |
| **Script contract** | Write brief to a path → `open_grok.py --file` only. |

---

### 3.9 `idea-selection` — IDE selection / `grokq` alias

| Field | Value |
|-------|--------|
| **Disposition** | **DO NOT SKILL**; human alias may wrap `open_grok.py --clipboard` if ever installed. Agent path is always `open_grok.py --clipboard`, never a shell function dependency. |
| **Standalone skill?** | **No** |
| **Scores** | A0 B0 C0 D2 E0 → commentary only; flowchart: human shell UX → DO NOT SKILL |

---

### 3.10 `build-mode-spike` — Build mode from local spec

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SCRIPT** via `scripts/open_grok.py --file SPEC --mode build [--preface '…']` |
| **Standalone skill?** | **No** |
| **Scores** | A1 B1 C1 D1 E1 → commentary only; flowchart: encode+open → SCRIPT |
| **Rationale** | Mode is a flag on the shared file open path. |

---

## 3A. Canonical scripts tree (normative — overrides any older name)

**Only these script paths may be created for open/URL work.** Any name in historical drafts (`clipboard_to_grok.py`, `file_to_grok.py`, `git_diff_to_grok.py`, `brief_to_grok.py`, `lib_open_safari.py`, `scripts/lib/open_safari_url.sh`) is **void**.

```
scripts/
  grok_url.py              # pure build_grok_url(q, mode, private) + unit tests
  open_safari.py           # sole Safari primitive (no alternate basenames)
  open_grok.py             # SOLE user-facing CLI for content→URL→Safari
                           #   --clipboard | --file PATH | --git-diff | --text STR | --stdin
                           #   --mode --private/--public --max-chars --dry-run --preface --staged --cwd
  observe_grok_page.js     # DOM snapshot for harvest / auth preflight (later items)
  harvest_grok_reply.py    # depth: open + poll observe (not a second open CLI)
  # optional non-open:
  cron_open_grok.sh        # zero-LLM launcher; may call open_grok.py or open fixed URL
  # optional later milestone only:
  rerun_param_matrix.py
```

**Import graph:** `open_grok.py` → `grok_url.py` + `open_safari.py`.  
`harvest_grok_reply.py` → `open_grok.py` and/or `open_safari.py` + `observe_grok_page.js`.  
Nothing else opens Safari.

---

## 4. Target skill shape (after upgrade)

```
grok-com-deep-links/
  SKILL.md
  references/
    query-param-matrix-2026-08-05.md
    docs-site.md
    harness-recipes.md              # index: recipe id → open_grok flags / section / module
    harvest-grok-reply.md           # DEPTH (name branding fixed in separate P0)
    param-matrix-rerun.md           # DEPTH (automation scope fixed in MVP item)
  scripts/
    grok_url.py
    open_safari.py
    open_grok.py
    observe_grok_page.js
    harvest_grok_reply.py
    cron_open_grok.sh               # optional
```

**Forbidden in tree:** per-recipe `*_to_grok.py` openers; duplicate Safari helpers.

### 4.1 SKILL.md description (index-facing)

Keep first ~57 characters trigger-self-contained:

```text
Use when building Grok.com deep-link URLs, Shortcuts, or local Hermes→Safari harness opens (clipboard/file/git/private/harvest).
```

Full description may continue with harvest/matrix after that.

### 4.2 Decision tree (must appear in SKILL.md)

```
Need grok.com from Hermes?
├─ Only need the URL string (Shortcut/bookmark) → URL doctrine tables
├─ Open authenticated Safari with local content?
│  ├─ Clipboard → open_grok.py --clipboard
│  ├─ File/log → open_grok.py --file PATH [--private]
│  ├─ git diff → open_grok.py --git-diff
│  └─ Hermes brief second opinion → write brief → open_grok.py --file brief --mode expert
├─ Need the reply back in Hermes? → harvest module (not just open)
├─ Site matrix may be stale? → param-matrix-rerun module
└─ Scheduled tab only? → cron template (no skill reasoning)
```

### 4.3 Relationship to docs site

| Artifact | Role |
|----------|------|
| `grok-com-query-params-docs/` | Human UX, visual matrix, live builder, harness cards |
| `data/findings.json` | Machine-readable observations; matrix rerun merges here |
| Skill | Agent UX; scripts; when-to; pitfalls |
| Sync rule | Recipe ids in `harness-recipes.md` **must match** `harnessRecipes[].id` |

On implement: add one line to site README and `references/docs-site.md` pointing at skill scripts path.

---

## 5. Implementation phases (when operator says proceed)

### Phase 0 — Freeze plan + operator gates

- [ ] Operator confirms dispositions in §3 (especially: no 10 skills; harvest + matrix as depth modules).
- [ ] Operator confirms wet-run of harvest/matrix is **opt-in** (pollutes Safari / History).
- [ ] Confirm Safari is the only supported browser for v1 (Chrome later).

### Phase 1 — Scaffolding only (global-code-style Phase 1 for scripts)

For each non-trivial Python module: signatures + rich docstrings/comments describing control flow; **no** full implementation yet if following 4-phase strictly.

Files to create (empty/scaffold) — **names must match §3A only**:
- `scripts/grok_url.py`
- `scripts/open_safari.py`
- `scripts/open_grok.py`
- `scripts/observe_grok_page.js`
- `scripts/harvest_grok_reply.py`
- `references/harness-recipes.md`
- `references/harvest-grok-reply.md`
- `references/param-matrix-rerun.md` (doc OK in MVP; automation script only if milestone includes it)

Do **not** scaffold: `clipboard_to_grok.py`, `file_to_grok.py`, `git_diff_to_grok.py`, `brief_to_grok.py`, `lib_open_safari.py`, `install_grokq_alias.sh`, or `rerun_param_matrix.py` unless that milestone is explicitly in scope.

### Phase 2 — Skeleton review

Review against §3 + **§3A**: every recipe id mapped to `open_grok.py` flags or depth module; no standalone skills; single Safari helper basename; `#private` ordering enforced in `grok_url.py`.

### Phase 3 — Incremental implementation (one unit at a time)

Order matters (dependencies):

| Step | Unit | Tests / verify |
|------|------|----------------|
| 3.1 | `grok_url.py` pure `build_grok_url(q, mode, private)` | Unit tests: encoding, mode, hash last, empty q raises |
| 3.2 | `open_safari.py` | Dry-run skips osascript; manual optional |
| 3.3 | `open_grok.py --clipboard/--file/--git-diff/--text` | Dry-run integration tests with fixtures |
| 3.4 | Secret path refusals on `--file` | Tests for `.env` |
| 3.5 | `observe_grok_page.js` schema | Manual once in Safari |
| 3.6 | `harvest_grok_reply.py` happy path | Opt-in wet test `HARVEST_OK` |
| 3.7 | SKILL.md rewrite sections | `skill_view` / frontmatter validate |
| 3.8 | Matrix (milestone-dependent) | Doc-only or dry-run — not required for open CLI MVP |
| 3.9 | Site cross-links + skill `docs-site.md` update | Links resolve |

Commits: one logical unit per commit if skill dir is git-tracked; if not, checkpoint by updating plan checkboxes.

### Phase 4 — Self-review checklist

- [ ] Frontmatter valid; description trigger-first; body 8–15k chars target; heavy text in references
- [ ] Zero standalone recipe skills created
- [ ] All 10 harness ids appear in `harness-recipes.md` with disposition → **`open_grok.py` flags or module**
- [ ] **Exactly one** user-facing open CLI: `open_grok.py`; **exactly one** Safari module: `open_safari.py`
- [ ] `rg '_to_grok\\.py|lib_open_safari' scripts/` returns nothing
- [ ] Scripts: `python3 scripts/open_grok.py --help` works
- [ ] No secrets in examples
- [ ] Field guide still serves; skill does not duplicate full matrix HTML
- [ ] Fresh session can `skill_view(name='grok-com-deep-links')` and follow clipboard recipe without the website open

---

## 6. Promotion criteria (when a depth module becomes its own skill)

Create a **new** skill name only if **all** hold:

1. **Distinct trigger** that should fire when the user is **not** talking about deep links (e.g. “scrape my Grok History for last week”).
2. **Reference doc > ~15k** or scripts > 3 with independent versioning pain inside the umbrella.
3. **Mis-load cost**: umbrella is too often loaded or too often skipped because description is overloaded.
4. **Operator agrees** to a second index entry.

Candidates most likely to promote later:
- Harvest → `grok-safari-harvest` (if Safari automation expands)
- Matrix → `grok-com-param-audit` (if scheduled monthly product)

Never promote: clipboard, file, git-diff, alias, cron opener, build-mode flag.

---

## 7. Explicit “will not convert to skill” summary table

| Recipe id | Not a skill because | Lives as |
|-----------|---------------------|----------|
| `clip-expert` | Linear glue; high reuse → CLI flag | `open_grok.py --clipboard` |
| `file-private` | Parameterized open + pitfalls | `open_grok.py --file` (private default) |
| `git-diff-review` | Parameterized open | `open_grok.py --git-diff` |
| `safari-applescript` | Shared primitive, not a task type | `open_safari.py` only |
| `cron-morning-opener` | Zero-LLM launcher; cron domain | template + optional `cron_open_grok.sh` |
| `idea-selection` | Human shell UX | optional alias wrapping `open_grok.py --clipboard` |
| `build-mode-spike` | `--mode build` flag | `open_grok.py --file --mode build` |
| `second-opinion` | Role protocol, thin open | SKILL section + `open_grok.py --file` |
| URL-only recipes | Already doctrine | SKILL.md tables |
| Site visual builder | Human UI | docs site only |

| Recipe id | Deep procedure because | Lives as |
|-----------|------------------------|----------|
| `hermes-computer-use-harvest` | Waits, flaky UI, extract correctness | depth module + `harvest_grok_reply.py` (uses shared open/observe) |
| `param-matrix-rerun` | Methodology + data integrity | depth module (+ script only if milestone allows) |

---

## 8. Risk register

| Risk | Mitigation |
|------|------------|
| Skill description too long / vague | Trigger-first sentence; details in references |
| Agents still use embedded browser | Pitfall #1 bold; scripts only call Safari helper |
| History pollution from tests | Default private for file; matrix requires disposable prompts |
| URL length / silent truncation | `--max-chars`; skill says Hermes summarizes first |
| Secret exfiltration via `q=` | Refuse list; never read `.env` into prompt |
| Matrix wet-run corrupts findings.json | `--dry-run` default; backup JSON before merge; date-stamp |
| computer_use session death | Prefer osascript+JS observe first; CUA only if needed |
| Dual source of truth drift (site vs skill) | Single recipe id namespace; harness-recipes.md sync check in Phase 4 |
| 4-phase authoring vs “just ship scripts” | Non-trivial Python follows scaffold→review→one function+tests; tiny shell may be direct |

---

## 9. Acceptance criteria (upgrade done when)

1. Operator can say “send clipboard to Grok expert” and the agent loads **one** skill and runs **one** script without reinventing encoding.
2. Operator can say “harvest the reply” and the agent follows harvest module waits — not a single blind `sleep 5`.
3. No new skill names appear in `skills_list` beyond `grok-com-deep-links` (unless promotion explicitly approved).
4. All ten harness recipe ids are classified and linked.
5. Docs site still renders harness cards; skill references the site path.
6. Dry-run tests pass without opening network/Safari where designed.

---

## 10. Suggested commit / checkpoint messages (implementation time)

```
docs(plan): grok harness recipe → skill conversion plan
feat(grok-com-deep-links): URL builder + Safari open helper
feat(grok-com-deep-links): open_grok clipboard/file/git-diff
docs(grok-com-deep-links): harvest + matrix depth modules
chore(docs-site): link skill scripts from harness recipes
```

---

## 11. Execution handoff

**Plan complete and saved** at:

`/Users/velocityworks/IdeaProjects/grok-com-query-params-docs/docs/plans/2026-08-05-grok-harness-recipe-to-skill-conversion.md`

**Not implemented yet** (per operator: plan before upgrade).

When ready, operator should say one of:
- **“Proceed with the umbrella upgrade”** — implement Phases 1–4 as above  
- **“Proceed but skip wet harvest/matrix”** — scripts + docs only, depth modules dry-run  
- **“Revise dispositions for X”** — adjust §3 before any skill write  

Optional later: subagent-driven-development one task per Phase 3 step with two-stage review.
