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
| **Disposition** | **UMBRELLA SCRIPT** `scripts/clipboard_to_grok.py` + one SKILL.md recipe line |
| **Standalone skill?** | **No** |
| **Scores** | A1 B1 C1 D2 E1 → total 6 borderline, but A/B low → script wins |
| **Rationale** | Linear: read clipboard → encode → open Safari. Failure modes are “empty clipboard” and “Safari not logged in” — documentable in pitfalls, not a multi-phase protocol. High reuse does **not** justify a separate skill name; reuse is exactly why it should be a **named script** the umbrella always knows. |
| **Why not skill** | Creating `grok-clipboard` would duplicate umbrella triggers (“send this to grok”) and add index noise. Any agent that can load the umbrella can run the script. |
| **Script contract** | CLI: `--mode expert\|fast\|auto\|build` (default expert), `--private`, `--dry-run`, `--max-chars N`. Exit 2 if clipboard empty. Print final URL. |
| **Verification** | `pbpaste` non-empty fixture → dry-run URL contains encoded text + `mode=`; private flag appends `#private` only at end. |
| **Site sync** | Keep harness card; snippet may say “prefer skill script path once installed.” |

---

### 3.2 `file-private` — Local file → Private Grok

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SCRIPT** `scripts/file_to_grok.py` |
| **Standalone skill?** | **No** |
| **Scores** | A1 B1 C2 D1 E2 → judgment on truncation + secret risk, still one pipeline |
| **Rationale** | Same glue as clipboard with path argument + forced or default `#private`. The *judgment* (how much to truncate, whether to summarize first in Hermes) belongs in **SKILL.md section “When the file is too large”**, not a second skill. Secret-risk is a **pitfall checklist**, not a separate skill. |
| **Why not skill** | “Open file in Grok” is a parameter variant of clipboard/git recipes; one `open_grok.py` core with subcommands is better than three skills. |
| **Script contract** | Args: path, `--mode`, `--private` default **true**, `--max-chars` default 12000, `--dry-run`. Refuse if path looks like `.env` / `*.pem` / `id_rsa` unless `--i-understand-secrets`. |
| **Verification** | Temp file with known string → dry-run URL; secret-name file without flag → exit nonzero. |

---

### 3.3 `git-diff-review` — git diff → Expert review

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SCRIPT** `scripts/git_diff_to_grok.py` |
| **Standalone skill?** | **No** |
| **Scores** | A1 B1 C1 D2 E1 |
| **Rationale** | Classic local harness win, but still encode+open. Staged vs unstaged is a flag (`--staged`), not a skill boundary. Sensitive diffs → document `--private`. |
| **Why not skill** | Overlaps “second opinion” and “clipboard”; agents would thrash between skills. |
| **Script contract** | Run in repo cwd (or `--cwd`). `git --no-pager diff` / `--staged`. Cap bytes. Prefix prompt template fixed in script for stability. `--mode expert` default. |
| **Verification** | In a tiny git repo with known diff, dry-run contains hunk header fragment. |

---

### 3.4 `safari-applescript` — Open in already-authenticated Safari

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SECTION + shared helper** `scripts/lib/open_safari_url.sh` (or `.py`) used by **all** openers |
| **Standalone skill?** | **No** — this is infrastructure |
| **Scores** | A1 B2 C0 D2 E2 |
| **Rationale** | Highest leverage **primitive**, lowest value as its own skill. Every recipe that “opens Grok” must call this helper so agents never default to embedded browser. Failure surface (no front document, Safari quit) belongs in shared pitfalls. |
| **Why not skill** | Trigger would be “open URL in Safari” — far too broad and unrelated to grok.com-only loading. |
| **Helper contract** | Input: URL string. Behavior: activate Safari; if no window, `make new document`; set URL of front document. Optional: return front URL after 1s for verify. |
| **Verification** | Dry helper with `https://example.com/` only in manual test; grok tests use dry-run of callers. |

---

### 3.5 `hermes-computer-use-harvest` — open + harvest reply

| Field | Value |
|-------|--------|
| **Disposition** | **DEPTH MODULE** under umbrella: `references/harvest-grok-reply.md` + `scripts/observe_grok_page.js` + optional `scripts/harvest_grok_reply.py` orchestrating osascript |
| **Standalone skill?** | **Not initially.** Promote only if harvest is used outside grok.com deep-link contexts (§6). |
| **Scores** | A2 B2 C2 D1 E2 → total 9 → **must** be real procedure, not a one-liner card |
| **Rationale** | This is the only recipe with **async UI**, false completion, AX vs JS readback, and “did it actually generate.” Improvising burns time and invents success. Depth module teaches: navigate → wait predicates → read structured observe JSON → extract assistant text → fail loud if still “Working”. |
| **Why not separate skill yet** | Trigger is still “use grok.com from Hermes.” Umbrella description can include “harvest reply from Safari.” A second skill (`grok-safari-harvest`) is justified later if non-deep-link Safari automation grows (e.g. clicking History, Imagine). |
| **Why not mere script** | Script can automate happy path; **procedure** must cover timeouts, private vs normal URL shapes (`/` vs `/c/uuid`), model label, and “don’t scrape sidebar.” |
| **Module contents** | Wait strategy (poll title/body every 2s, max 90s); observe schema (url, title, modelLabel, privateState, bodySnippet, hasWorking); extraction heuristics; forbidden actions (don’t click paywalls/password). |
| **Verification** | With a known `?q=Say%20only%20HARVEST_OK&mode=fast`, observe eventually contains HARVEST_OK or fail. |

---

### 3.6 `param-matrix-rerun` — Re-run param matrix

| Field | Value |
|-------|--------|
| **Disposition** | **DEPTH MODULE** `references/param-matrix-rerun.md` + `scripts/rerun_param_matrix.py` (or staged shell + observe) writing/merging into **docs site** `data/findings.json` |
| **Standalone skill?** | **Not initially** (same umbrella). Promote if matrix work becomes a scheduled product of its own. |
| **Scores** | A2 B2 C2 D1 E2 → total 9 |
| **Rationale** | Methodology skill-content: clean state, one param, reset, honesty rules, date-stamped matrix. Wrong improvisation corrupts the field guide. Ties skill ↔ site as one system. |
| **Why not skill** | Overlaps umbrella’s existing “Method for re-verification” section; expand that into a module rather than fork a second name agents must discover. |
| **Why not mere script** | Loop is easy; **what counts as observation**, how to mark noop/unresolved, and History pollution policy are protocol. |
| **Module contents** | Candidate list source (matrix + optional bundle grep); observe.js path; merge rules for `findings.json`; require `#private` or disposable prompts; never claim source-only effects. |
| **Verification** | Dry-run mode that does not navigate but validates merge against schema; wet-run limited to 2 known params on operator approval. |

---

### 3.7 `cron-morning-opener` — Cron standing brief

| Field | Value |
|-------|--------|
| **Disposition** | **DO NOT SKILL** as a procedure; **DO** document as **cron template** in `references/cron-templates.md` + optional `scripts/cron_open_grok.sh` |
| **Standalone skill?** | **No** |
| **Scores** | A0 B0 C0 D1 E0 |
| **Rationale** | Best form is `no_agent=true` + script `open -a Safari 'url'` — **zero tokens**, no judgment. A skill that says “schedule morning brief” teaches cron usage already covered by Hermes cron docs; stuffing it into grok skill bloats triggers. |
| **Why not skill** | Skills load into agent context for reasoning tasks. A pure launcher should never require an LLM skill load. |
| **What umbrella says** | One paragraph: “For scheduled tab open, use cron + script; do not use agent turn.” Point to template. |
| **Verification** | Manual: run script once; Safari opens correct URL. |

---

### 3.8 `second-opinion` — Hermes draft → Grok second opinion

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SECTION** (protocol) + thin wrapper script `scripts/brief_to_grok.py` |
| **Standalone skill?** | **No** unless it becomes a named house style across many domains (then maybe `adversarial-second-opinion` generic — still not grok-specific) |
| **Scores** | A1 B1 C2 D2 E1 |
| **Rationale** | Value is the **role split** (Hermes leads, Grok adversariates) and brief shape, not the URL open. That is 15–25 lines of SKILL.md: when to invoke, what to put in brief, private for unpublished research, don’t paste secrets. Script only ships the brief file to URL. |
| **Why not skill** | “Second opinion” is a general review pattern; a grok-only skill would be wrong abstraction. If promoted later, promote **generic** second-opinion skill that *calls* umbrella scripts. |
| **Section contract** | Brief template headings: Claim / Evidence / Risks Hermes sees / Ask Grok for contradictions. Max brief size. Default `mode=expert`, optional `#private`. |
| **Verification** | Operator dry-run with `/tmp/hermes-brief.md` sample. |

---

### 3.9 `idea-selection` — IDE selection / `grokq` alias

| Field | Value |
|-------|--------|
| **Disposition** | **DO NOT SKILL**; **optional install note** in references + alias snippet in `scripts/install_grokq_alias.sh` (idempotent append to zshrc **only on operator request**) |
| **Standalone skill?** | **No** |
| **Scores** | A0 B0 C0 D2 E0 |
| **Rationale** | User-facing shell UX, not agent procedure. Hermes may install alias when asked; day-to-day the human runs `grokq`. Agent should use `clipboard_to_grok.py` instead of depending on interactive shell functions. |
| **Why not skill** | Skills for shell aliases are a category error. |
| **Verification** | `type grokq` after optional install. |

---

### 3.10 `build-mode-spike` — Build mode from local spec

| Field | Value |
|-------|--------|
| **Disposition** | **UMBRELLA SCRIPT** flag on `file_to_grok.py --mode build` (no separate script required) |
| **Standalone skill?** | **No** |
| **Scores** | A1 B1 C1 D1 E1 |
| **Rationale** | Same as file opener with different mode + prompt preface (“Build a minimal prototype…”). Matrix already notes build storage stickiness — document in pitfalls. |
| **Why not skill** | Mode is a parameter, not a product surface. |

---

## 4. Target skill shape (after upgrade)

```
grok-com-deep-links/
  SKILL.md                          # triggers, doctrine, decision tree, pitfalls, verify
  references/
    query-param-matrix-2026-08-05.md
    docs-site.md                    # path to IdeaProjects field guide + how to serve
    harness-recipes.md              # index: recipe id → script/section/module
    harvest-grok-reply.md           # DEPTH: open+wait+observe+extract
    param-matrix-rerun.md           # DEPTH: clean/one/reset/merge honesty
    cron-templates.md               # DO NOT SKILL launchers
  scripts/
    lib_open_safari.py              # shared Safari open primitive
    open_grok.py                    # core: text/file/stdin → URL → Safari
      subcommands or flags:
        --text / --file / --clipboard / --git-diff
        --mode --private --max-chars --dry-run --preface
    observe_grok_page.js            # DOM snapshot schema
    harvest_grok_reply.py           # orchestrate open + poll observe
    rerun_param_matrix.py           # optional; wet-run gated
    cron_open_grok.sh               # zero-LLM launcher
    install_grokq_alias.sh          # operator-opt-in only
```

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

For each new Python script: signatures + rich docstrings/comments describing control flow; **no** full implementation yet if following 4-phase strictly for non-trivial scripts.

Files to create (empty/scaffold):
- `scripts/lib_open_safari.py`
- `scripts/open_grok.py`
- `scripts/observe_grok_page.js`
- `scripts/harvest_grok_reply.py`
- `scripts/rerun_param_matrix.py` (scaffold; wet logic behind `--wet`)
- `references/harness-recipes.md`
- `references/harvest-grok-reply.md`
- `references/param-matrix-rerun.md`
- `references/cron-templates.md`

### Phase 2 — Skeleton review

Review against §3 matrix: every recipe id mapped; no standalone skills; secret refuse-list present; `#private` ordering enforced in URL builder helper.

### Phase 3 — Incremental implementation (one unit at a time)

Order matters (dependencies):

| Step | Unit | Tests / verify |
|------|------|----------------|
| 3.1 | URL builder pure function (`build_grok_url(q, mode, private)`) | Unit tests: encoding, mode, hash last, empty q raises |
| 3.2 | `lib_open_safari.py` | Dry-run mode skips osascript; manual optional |
| 3.3 | `open_grok.py --clipboard/--file/--git-diff` | Dry-run integration tests with fixtures |
| 3.4 | Secret path refusals | Tests for `.env` |
| 3.5 | `observe_grok_page.js` schema | Manual once in Safari |
| 3.6 | `harvest_grok_reply.py` happy path | Opt-in wet test `HARVEST_OK` |
| 3.7 | SKILL.md rewrite sections | `skill_view` / frontmatter validate |
| 3.8 | Matrix rerun dry-run merge | Fixture JSON merge test |
| 3.9 | Site cross-links + skill `docs-site.md` update | Links resolve |
| 3.10 | Optional alias installer | Only if operator asks |

Commits: one logical unit per commit if skill dir is git-tracked; if not, checkpoint by updating plan checkboxes.

### Phase 4 — Self-review checklist

- [ ] Frontmatter valid; description trigger-first; body 8–15k chars target; heavy text in references
- [ ] Zero standalone recipe skills created
- [ ] All 10 harness ids appear in `harness-recipes.md` with disposition
- [ ] Scripts are executable / `python3 scripts/... --help` works
- [ ] No secrets in examples
- [ ] Related skills: `computer-use` / `macos-computer-use` mentioned for harvest escalation only
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
| `clip-expert` | Linear glue; high reuse → script | `open_grok.py --clipboard` |
| `file-private` | Parameterized open + pitfalls | `open_grok.py --file` |
| `git-diff-review` | Parameterized open | `open_grok.py --git-diff` |
| `safari-applescript` | Shared primitive, not a task type | `lib_open_safari.py` |
| `cron-morning-opener` | Zero-LLM launcher; cron domain | `cron-templates.md` + shell |
| `idea-selection` | Human shell UX | optional alias installer |
| `build-mode-spike` | `--mode build` flag | same file opener |
| `second-opinion` | Role protocol, thin open | SKILL section + brief file open |
| URL-only recipes | Already doctrine | SKILL.md tables |
| Site visual builder | Human UI | docs site only |

| Recipe id | Deep procedure because | Lives as |
|-----------|------------------------|----------|
| `hermes-computer-use-harvest` | Waits, flaky UI, extract correctness | depth module + scripts |
| `param-matrix-rerun` | Methodology + data integrity | depth module + scripts |

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
