# Adversarial Review: Harness Recipe → Skill Conversion Plan

**Subject plan:** `docs/plans/2026-08-05-grok-harness-recipe-to-skill-conversion.md`  
**Reviewer stance:** Hostile peer — assume the plan will be executed by a future agent that follows it literally and will amplify every ambiguity.  
**Date:** 2026-08-05  
**Verdict:** **Revise before implement.** Core umbrella doctrine is sound; several internal contradictions, scoring loopholes, and scope landmines will produce a bloated or inconsistent skill if executed as written.

---

## Executive summary

### Keep (high confidence)

1. **One umbrella skill, zero “one recipe = one skill” sprawl** — correct for Hermes index dynamics and trigger collision.
2. **Mechanical openers as scripts; harvest/matrix as deep procedure** — right split between glue and protocol.
3. **Docs site remains human UX; skill is agent UX** — avoids stuffing HTML into SKILL.md.
4. **Safari authenticated session as the open path** — matches lived experiment failure of embedded browser.
5. **Promotion criteria requiring operator agreement** — good brake on future sprawl.

### Block / fix before Phase 1 scaffolding

| Sev | Finding | Why it matters |
|-----|---------|----------------|
| **P0** | Script naming contradicts itself (§3 vs §4) | Implementer will create both `clipboard_to_grok.py` *and* `open_grok.py` sprawl |
| **P0** | Decision rule in §1.2 is logically broken / special-pleadable | Scores were reverse-engineered to dispositions; formula doesn’t constrain |
| **P0** | Harvest recipe branded `computer_use` but plan prefers osascript — name/trigger lie | Agents will load CUA unnecessarily or skip the real path |
| **P1** | Dual source of truth still unsolved (site JSON vs skill refs vs SKILL.md) | Drift is guaranteed without a single write path |
| **P1** | Param-matrix automation is YAGNI-heavy for v1 | Highest corruption risk, lowest weekly value |
| **P1** | Missing platform/TCC/profile-HOME reality | Scripts will “work in plan” and fail in idea profile |
| **P1** | Acceptance criteria don’t prove agent behavior | Green checkboxes ≠ “agent stopped reinventing URLs” |
| **P2** | Status line claims “approved for review” without operator sign-off | Process theater |
| **P2** | Secret refuse-list is theater without content scanning | `.env.example` vs secrets in `notes.md` |
| **P2** | Private-chat guarantees overstated | Matrix observed tendencies, not product SLAs |

**Recommended gate:** Do not scaffold scripts until a **plan rev2** resolves P0s and explicitly **defers** wet matrix automation.

---

## 1. Internal contradictions (plan disagrees with itself)

### 1.1 P0 — File layout fork

| Location | Says |
|----------|------|
| §3.1 | `scripts/clipboard_to_grok.py` |
| §3.2 | `scripts/file_to_grok.py` |
| §3.3 | `scripts/git_diff_to_grok.py` |
| §3.8 | `scripts/brief_to_grok.py` |
| §4 tree | Single `open_grok.py` with flags `--clipboard / --file / --git-diff` |
| §3.4 | `scripts/lib/open_safari_url.sh` **or** `.py` |
| §4 | `lib_open_safari.py` (different path/name) |
| §7 table | Everything is `open_grok.py --…` |

**Attack:** A literal implementer creates **five entrypoints** plus a unified one, then documents none of them consistently. The plan’s own anti-sprawl doctrine is violated at the *script* layer.

**Fix (must specify one):**

```
scripts/
  grok_url.py           # pure build_grok_url + tests
  open_safari.py        # only Safari primitive
  open_grok.py          # sole CLI: --clipboard|--file|--git-diff|--text|--stdin
  observe_grok_page.js
  harvest_grok_reply.py # calls open_grok + observe poll
```

Delete per-recipe script names from §3.

---

### 1.2 P0 — Scoring rule does not match scored outcomes

§1.2:

> Convert to first-class skill procedure only if **total ≥ 6** **or** (B=2 **and** D≥1).

Problems:

1. **“First-class skill procedure” is undefined** relative to outcomes (SCRIPT vs SECTION vs DEPTH vs STANDALONE). Clipboard totals 6 and is *not* a depth procedure — the rule’s consequent is meaningless.
2. **Safari helper** scores B2 D2 → rule says convert to first-class procedure; disposition is “not a skill / infrastructure.” Special pleading.
3. **build-mode** totals 5 and is still an umbrella script — fine, but then total≥6 was never the real gate.
4. Scores look **motivated**: harvest/matrix get 9; thin recipes get ≤6. No inter-rater note; no worked example of rejecting something.

**Attack:** Future you cites §1.2 to promote `second-opinion` (total 7 if you bump A) to standalone skill while claiming fidelity to the plan.

**Fix:** Replace numeric theater with a **decision flowchart** that has only four exits matching dispositions, e.g.:

```
Is it only encode+open with flags?
  yes → SCRIPT (open_grok.py)
Does it require wait/poll/extract or multi-trial methodology?
  yes → DEPTH MODULE
Is it human shell/cron with zero agent judgment?
  yes → DO NOT SKILL (template only)
Is it a short agent protocol without new I/O primitives?
  yes → UMBRELLA SECTION
else → stop and ask operator
```

Keep scores as optional commentary, not binding gates.

---

### 1.3 P0 — `computer_use` naming vs preferred implementation

- Recipe id: `hermes-computer-use-harvest`
- Site card capabilities: `computer_use`
- Plan §3.5 / risk register: **prefer osascript + JS observe**; CUA only if needed
- Experiment reality: CUA session death already happened mid-work

**Attack:** Agent loads `computer-use` skill, fights cua-driver, never tries the reliable AppleScript path the experiment actually used for navigation/observe.

**Fix:**

- Rename recipe id (site + plan) to `safari-harvest-reply` or `open-and-harvest`.
- Depth module title must lead with **osascript + do JavaScript**.
- `computer_use` is **escalation rung 2**, not the brand name.
- Update site harness card capabilities list accordingly when implementing.

---

### 1.4 P1 — “Optional” depth modules vs mandatory acceptance

- Architecture line: depth modules are **optional**
- Acceptance §9.2: operator says “harvest the reply” and agent **must** follow harvest waits
- Phase 3 includes harvest happy path as a numbered step

**Attack:** “Skip wet harvest” handoff still leaves acceptance #2 unmet; implementer ships empty reference stubs and claims done.

**Fix:** Split acceptance into **v1 MVP** vs **v1.1**:

| MVP (proceed default) | v1.1 (explicit) |
|----------------------|-----------------|
| URL doctrine + `open_grok.py` dry-run | harvest poll loop wet-tested |
| Safari open helper | matrix wet-run behind `--wet` |
| harness-recipes.md map | findings.json merge automation |
| SKILL decision tree | |

---

### 1.5 P1 — Phase 1 file list ≠ §4 tree ≠ §3 names

Phase 1 lists `lib_open_safari.py` at `scripts/` root; §3.4 allows `scripts/lib/...`. No `grok_url.py` pure module though Phase 3.1 depends on it. No test directory specified anywhere.

**Fix:** Single canonical tree in one section only; other sections reference it by link. Add `scripts/test_*.py` or `tests/` path explicitly.

---

## 2. Scope and YAGNI attacks

### 2.1 P1 — Param matrix automation is a product, not a v1 script

Plan proposes merge rules, schema validation, bundle grep, wet-run gating, backups — i.e. a **mini research instrumentation system**.

**Attack:**

- Highest severity data-corruption path (`findings.json`) built first-ish (Phase 3.8) while daily value is “open clipboard in Safari.”
- Automating observation **tempts fake completeness** (DOM snippet ≠ human judgment of “noop”).
- Skill already has a solid **manual** re-verify method; automation doesn’t remove honesty obligations.

**Fix for rev2:**

- v1 matrix = **DEPTH DOC ONLY** (expand existing SKILL method + point at site methodology). No `rerun_param_matrix.py` until operator asks after openers ship.
- If a script exists, max ambition = **checklist emitter** (print the 7 steps + candidate URLs), not JSON merge.

---

### 2.2 P2 — Too many reference files for thin content

Planned: `harness-recipes.md`, `harvest-…`, `param-matrix-…`, `cron-templates.md` (+ existing matrix + docs-site).

**Attack:** Six references for one skill; agent loads SKILL.md, misses the right file, improvises anyway.

**Fix:** 

- `harness-recipes.md` = index table only (required).
- `harvest-grok-reply.md` = only if harvest in MVP.
- Fold cron into a **short SKILL.md subsection** (10 lines) instead of its own file until content > ~40 lines.
- Matrix rerun stays in SKILL “Method for re-verification” until automation exists.

---

### 2.3 P2 — `install_grokq_alias.sh` is a footgun

Idempotent zshrc append across **profile-redirected `$HOME`** (idea profile) vs real home is underspecified.

**Attack:** Alias installed into profile home the user never opens interactively; or double-appended; or pollutes real `~/.zshrc` without asking path.

**Fix:** Drop installer from v1 entirely. Document copy-paste alias in harness-recipes.md. Install only on explicit “add alias to REAL ~/.zshrc” with absolute path confirmation.

---

### 2.4 P2 — Second-opinion section may bloat SKILL.md

15–25 lines seems small; in practice “brief templates” grow. Plan already notes generic second-opinion might be better later — good — but still schedules a dedicated script `brief_to_grok.py` while saying thin wrapper of file open.

**Attack:** Useless script wrapper that only adds `--preface`.

**Fix:** No `brief_to_grok.py`. Second opinion = write file + `open_grok.py --file --mode expert [--private] --preface '…'`.

---

## 3. Missing requirements the plan pretends are solved

### 3.1 P1 — URL length is hand-waved

`--max-chars 12000` is not a measured limit. Browsers, Safari, OS `open`, and AppleScript string limits differ. Multibyte percent-encoding **expands** size (3×–9×).

**Attack:** Dry-run passes; wet open fails silently or truncates mid-UTF-8; user thinks Grok “ignored” the file.

**Fix:**

- Measure empirically once: binary search max successful `q` length in Safari on this Mac; record in skill.
- Script counts **encoded** length, not raw chars.
- On oversize: **refuse** (exit 3) with message “summarize in Hermes first” — do not silent truncate by default (truncation is data loss). Optional `--truncate` opt-in.

---

### 3.2 P1 — Auth is never verified

Plan assumes “open Safari URL” ≡ “logged-in SuperGrok session.”

**Attack:** Front document is a different profile/window; or session expired; observe sees Sign in; harvest scrapes marketing page; agent reports success because HTTP navigated.

**Fix (harvest + openers):**

- Post-open observe must assert logged-in chrome (e.g. absence of “Sign in”/`Sign up`, presence of known account control or Private control).
- Fail with explicit `NOT_AUTHENTICATED` code.
- Openers in dry-run can’t check this — wet smoke test required once per machine.

---

### 3.3 P1 — TCC / Automation / JS permissions

`osascript` → Safari → `do JavaScript` often needs:

- Automation permission (Terminal/Hermes → Safari)
- “Allow JavaScript from Apple Events” in Safari Develop menu

Plan never mentions this.

**Attack:** Entire script stack returns vague AppleScript errors; agent “falls back” to embedded browser, violating non-goal #4.

**Fix:** SKILL pitfalls + harvest module **preflight** section; script catches and prints permission remediation; no silent fallback to embedded browser (exit 4).

---

### 3.4 P1 — Hermes profile `$HOME` redirect

Active profile **idea** redirects `$HOME`. Plan paths use absolute IdeaProjects and absolute skill path (good) but scripts using `~/` or `Path.home()` for zshrc/logs will mis-target.

**Fix:** All skill docs use absolute paths; scripts never write under `Path.home()` unless `--home` passed; cron templates warn about profile vs login shell.

---

### 3.5 P1 — Cross-profile skill writes

Skill lives under `profiles/idea/skills/...`. Operator may run other profiles. Plan doesn’t say “idea-only” or how to copy.

**Fix:** One line in plan + SKILL: canonical for **idea** profile; promoting to user-global skills requires explicit operator direction (cross_profile).

---

### 3.6 P2 — Git diff recipe ignores dirty/large/binary/submodule hell

No `--stat` first, no binary detection, no “not a git repo” UX, no default to `git diff HEAD` vs working tree clarity beyond `--staged`.

**Fix:** Minimal: exit 2 if not repo; exit 3 if diff empty; skip binary paths via `git diff --numstat` heuristic; prefer text.

---

### 3.7 P2 — Private mode claims are softer than plan language

Matrix: private + q → no History entry **observed once**; disclaimer sometimes absent after chat starts; URL stayed `/`.

Plan acceptance and recipes talk as if private is a reliable “don’t pollute History” product feature.

**Attack:** Operator trusts private for secrets; History or training policy differs; skill overclaims.

**Fix:** Language must stay observational: “observed not to appear in History sidebar in 2026-08-05 test; not a security boundary; don’t put secrets in `q=` regardless.”

---

### 3.8 P2 — Secret refuse-list is filename cosplay

Refusing `.env` / `*.pem` does nothing for `dump.txt` containing API keys or `notes.md` with seed phrases.

**Fix:**

- Filename deny is **necessary but insufficient** — label it so.
- Optional `--scan-secrets` heuristic (AKIA, `BEGIN RSA`, `sk-`, etc.) default on for `--file`.
- Hard rule in SKILL: Hermes redacts before open when content is credentials; scripts are not a vaulting system.

---

### 3.9 P2 — No concurrency / front-document races

Multiple opens stomp the same Safari front tab; harvest may read the wrong conversation; user may be mid-typing.

**Attack:** Agent steals the user’s active research tab (trust violation worse than History pollution).

**Fix:**

- Default: **new tab/window** for harness opens, not reuse front document if URL is already grok.com non-empty chat — or always `make new document` with explicit note “will foreground Safari.”
- Plan must warn: harness opens are **user-visible and disruptive**.
- Optional `--tab new|front`.

---

### 3.10 P3 — No Windows/Linux story

Fine for this operator (macOS), but skill authoring metadata may claim multi-platform later. Plan should stamp **macos-only v1**.

---

## 4. Methodological attacks on dispositions

### 4.1 Is “umbrella only” always right for harvest?

Counter-argument the plan underweights:

- Harvest trigger (“read what Grok answered”) can fire **without** deep-link construction.
- Loading full URL doctrine + matrix + open flags to scrape a reply is context bloat.
- Related: `computer-use` skill already exists; harvest might belong as a **thin grok-specific observe recipe inside computer-use** — but that splits Safari JS knowledge.

**Revised take:** Keep harvest under umbrella for v1 **if** SKILL.md uses progressive disclosure (decision tree points to reference; body stays short). Revisit promotion earlier if harvest becomes the dominant load reason.

### 4.2 Clipboard as SCRIPT underweights privacy defaults

Clipboard often holds secrets (passwords from managers, OTP, tokens). Plan defaults clipboard to **non-private** expert open (History pollution + training ambiguity).

**Fix:** Default `--private` for clipboard **or** require explicit `--public` for History-visible sends. File already defaults private — inconsistency is a bug.

### 4.3 Cron “DO NOT SKILL” is right — but orphaned

If umbrella only “mentions” cron, agents asked to “schedule morning Grok” may still invent agentic cron with full LLM every morning (token burn).

**Fix:** SKILL.md must include an explicit **anti-pattern**: “If user wants scheduled open, create `no_agent` cron + `cron_open_grok.sh`; do not schedule an agent turn that constructs the URL each day unless prompt must change.”

---

## 5. Test strategy gaps

Plan says TDD for URL builder then jumps to “manual once” for observe.

**Missing:**

| Case | Needed test |
|------|-------------|
| `#private` before query accidentally | builder unit test |
| mode empty vs omitted | no `mode=` in URL |
| encoded length cap | unit |
| refuse `.env` | unit |
| git not a repo | integration |
| observe schema keys stable | fixture HTML optional |
| end-to-end agent | **eval prompt**: “send clipboard to grok” in dry-run env |

**Attack:** Unit tests pass; agent never calls the script because SKILL.md still shows old inline python from the website cards.

**Fix:** SKILL.md recipes must show **only** skill script invocations after upgrade; site snippets can lag one revision with a “agent path” note. Add acceptance: `rg 'open_grok.py' SKILL.md` and `rg 'pbpaste' SKILL.md` expect script not raw pbpaste as primary.

---

## 6. Process / meta issues

### 6.1 P2 — False status

> Status: Plan approved for review

Nothing in-thread was “approved.” Accurate: `Status: Draft — pending operator review`.

### 6.2 P2 — Global 4-phase vs “ship 8 scripts”

Plan invokes global-code-style Phase 1–4 for scripts, then also lists 10 Phase-3 units. Risk: performative scaffolding theater OR abandoned 4-phase.

**Fix:** Declare explicitly:

- **Strict 4-phase** only for: `grok_url` pure module, `open_grok.py`, `harvest_grok_reply.py` (if in scope).
- **Direct implement** allowed for: `cron_open_grok.sh`, observe js if <80 LOC, markdown refs.

### 6.3 P3 — Commit messages assume skill dir is a git repo

Skill under `.hermes/profiles/idea/skills` may not be versioned; docs site may be.

**Fix:** “Commit if tracked; else checkpoint plan checkboxes + date stamp skill SKILL.md changelog section.”

### 6.4 P3 — Plan path is inside docs site, not skill

Future agent loading only the skill won’t see this adversarial review or conversion plan.

**Fix on implement:** Add `references/conversion-plan.md` stub linking to IdeaProjects plan path **or** copy final rev2 into skill references.

---

## 7. What a hostile implementer would build if unblocked today

1. Five overlapping Python CLIs + one unified CLI (name mess).  
2. SKILL.md 25k chars pasting site recipes.  
3. `rerun_param_matrix.py` that overwrites `findings.json` keys with empty observes.  
4. Harvest that `sleep 8` once and greps `document.body.innerText` including sidebar (“PARAMTEST…” noise).  
5. Alias installer writing into profile-home `.zshrc`.  
6. Claims “private = safe for secrets.”  
7. Falls back to embedded browser when osascript fails.  
8. Marks acceptance done because `--help` works.

If the plan cannot prevent that future, it is not ready.

---

## 8. Required plan rev2 changes (checklist)

### Must (P0)

- [ ] Unify on **one** CLI (`open_grok.py`) + **one** Safari helper name/path; purge alternate script names from §3.
- [ ] Replace binding numeric score gate with disposition flowchart; mark scores non-normative.
- [ ] Rename harvest away from `computer_use` brand; osascript-first; CUA escalation only.
- [ ] Split **MVP vs v1.1** acceptance; matrix JSON automation **out of MVP**.
- [ ] Clipboard privacy default aligned with file (private by default or explicit `--public`).
- [ ] Encoded URL length refuse; no silent truncate by default.
- [ ] Auth preflight + no embedded-browser fallback (hard fail).
- [ ] TCC / JS-from-Apple-Events preflight documented.
- [ ] Status → Draft pending operator approval.

### Should (P1)

- [ ] New tab default; document user disruption.
- [ ] Secret scan optional/default-on for files; refuse-list honesty.
- [ ] Drop alias installer from MVP.
- [ ] Drop `brief_to_grok.py`; use preface flag.
- [ ] Cron anti-pattern paragraph in SKILL.
- [ ] Test paths listed; agent eval acceptance item.
- [ ] macos-only stamp; absolute paths only.
- [ ] Link/copy plan into skill refs on implement.

### Nice (P2)

- [ ] Measure real max `q` length on this Mac once.
- [ ] Git binary/empty heuristics.
- [ ] Fewer reference files.
- [ ] Progressive disclosure guidance for SKILL.md size.

---

## 9. Residual steelman (why not scrap the plan)

The plan’s **center of gravity is correct**: sprawl is the real enemy; the delicious harness recipes are mostly **one primitive** (build URL → open authenticated Safari) with two genuinely hard satellites (harvest, matrix methodology). An adversarial read does **not** recommend ten skills or “docs site only.” It recommends a **smaller MVP**, **one CLI**, **honest uncertainty** on private/auth/URL limits, and **deferring** the instrumentation fantasy until openers are boring and reliable.

---

## 10. Suggested operator responses

| Operator says | Effect |
|---------------|--------|
| **Accept adversarial rev — write plan rev2** | Author updates conversion plan in place or `…-rev2.md` |
| **Proceed MVP only** | open_grok + Safari helper + SKILL tree + harness index; no matrix automation; harvest doc stubs OK |
| **Proceed full original plan** | Explicit acceptance of P0 risks (not recommended) |
| **Kill harvest entirely** | Open-only umbrella; reply harvest stays manual computer_use |

---

## 11. Review metadata

| Field | Value |
|-------|--------|
| Subject | `2026-08-05-grok-harness-recipe-to-skill-conversion.md` |
| Method | Adversarial consistency pass + execution-sim (“literal future agent”) + cross-check vs live skill/site |
| Not done | No implementation; no wet Safari re-test in this review |
| Output path | `docs/plans/2026-08-05-grok-harness-conversion-plan-adversarial-review.md` |
