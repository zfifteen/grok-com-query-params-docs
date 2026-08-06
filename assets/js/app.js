/**
 * Shared UI for the Grok.com Query Parameter Field Guide.
 * Loads findings.json and renders interactive sections when present.
 */

// Relative paths depending on page depth (root index vs pages/*)
const DATA_CANDIDATES = [
  "data/findings.json",
  "../data/findings.json",
];

async function loadFindings() {
  for (const path of DATA_CANDIDATES) {
    try {
      const res = await fetch(path, { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch (_) {
      /* try next */
    }
  }
  throw new Error("Could not load data/findings.json — serve this folder over HTTP.");
}

function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function badge(status) {
  const map = {
    works: "badge-works",
    noop: "badge-noop",
    partial: "badge-partial",
    unresolved: "badge-unresolved",
  };
  const cls = map[status] || "badge-noop";
  return `<span class="badge ${cls}">${esc(status)}</span>`;
}

function copyButton(text) {
  const id = "c" + Math.random().toString(36).slice(2, 9);
  return `<button class="copy-btn" type="button" data-copy="${esc(text)}" title="Copy" aria-label="Copy">⧉</button>`;
}

function codeBlock(text) {
  return `<div class="code-block">${copyButton(text)}<code>${esc(text)}</code></div>`;
}

function wireCopy(root = document) {
  root.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      btn.classList.add("copied");
      btn.textContent = "✓";
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.textContent = "⧉";
      }, 1200);
    });
  });
}

function setActiveNav() {
  const file = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    const target = href.split("/").pop();
    if (target === file || (file === "" && target === "index.html")) {
      a.setAttribute("aria-current", "page");
    }
  });
}

function renderHome(data) {
  const stats = document.querySelector("[data-stats]");
  if (stats) {
    const works = data.parameters.filter((p) => p.status === "works").length;
    const noop = data.parameters.filter((p) => p.status === "noop").length;
    const partial = data.parameters.filter((p) => p.status === "partial" || p.status === "unresolved").length;
    stats.innerHTML = `
      <div class="stat"><b>${works}</b><span>Confirmed working</span></div>
      <div class="stat"><b>${noop}</b><span>No visible effect</span></div>
      <div class="stat"><b>${partial}</b><span>Partial / unresolved</span></div>
      <div class="stat"><b>${data.recipes.length}</b><span>Deep-link recipes</span></div>
    `;
  }

  const buckets = document.querySelector("[data-buckets]");
  if (buckets) {
    const s = data.summary;
    buckets.innerHTML = `
      <article class="panel bucket">
        <h3>${badge("works")} Auto-submit</h3>
        <ul class="pill-list">${s.autoSubmit.map((x) => `<li class="pill">${esc(x)}</li>`).join("")}</ul>
      </article>
      <article class="panel bucket">
        <h3>${badge("works")} Mode / model</h3>
        <ul class="pill-list">${s.modeSelect.map((x) => `<li class="pill">${esc(x)}</li>`).join("")}</ul>
      </article>
      <article class="panel bucket">
        <h3>${badge("works")} Private</h3>
        <ul class="pill-list">${s.private.map((x) => `<li class="pill">${esc(x)}</li>`).join("")}</ul>
      </article>
      <article class="panel bucket">
        <h3>${badge("noop")} No visible effect</h3>
        <ul class="pill-list">${s.noEffect.slice(0, 8).map((x) => `<li class="pill">${esc(x)}</li>`).join("")}</ul>
      </article>
    `;
  }

  const modes = document.querySelector("[data-modes-table]");
  if (modes) {
    modes.innerHTML = data.modesApi.observed
      .map(
        (m) => `
      <tr>
        <td><code>${esc(m.id)}</code></td>
        <td>${esc(m.title)}</td>
        <td>${esc(m.note)}</td>
      </tr>`
      )
      .join("");
  }

  const recipes = document.querySelector("[data-recipe-preview]");
  if (recipes) {
    recipes.innerHTML = data.recipes
      .slice(0, 4)
      .map(
        (r) => `
      <article class="panel recipe-card">
        <div class="tag-row">${r.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.blurb)}</p>
        ${codeBlock(r.example)}
      </article>`
      )
      .join("");
    wireCopy(recipes);
  }
}

function renderParameters(data) {
  const host = document.querySelector("[data-param-list]");
  if (!host) return;

  const search = document.querySelector("#param-search");
  const chips = document.querySelectorAll("[data-filter]");
  let statusFilter = "all";
  let categoryFilter = "all";

  function matches(p, q) {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (!q) return true;
    const hay = [p.name, p.notes, p.category, p.kind, ...(p.effects || []), ...(p.urls || [])]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  }

  function paint() {
    const q = (search?.value || "").trim().toLowerCase();
    const items = data.parameters.filter((p) => matches(p, q));
    if (!items.length) {
      host.innerHTML = `<div class="empty">No parameters match this filter.</div>`;
      return;
    }
    host.innerHTML = items
      .map(
        (p) => `
      <article class="panel param-card" data-status="${esc(p.status)}" data-category="${esc(p.category)}">
        <div class="param-side">
          <h3>${esc(p.name)}</h3>
          <div class="param-meta">
            ${badge(p.status)}
            <span class="kind-tag">${esc(p.kind)}</span>
            <span class="kind-tag">${esc(p.category)}</span>
          </div>
        </div>
        <div class="param-body">
          <h4>Observed effect</h4>
          <ul>${(p.effects || []).map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
          <h4>URL tested</h4>
          ${(p.urls || []).map((u) => codeBlock(u)).join("")}
          ${p.notes ? `<p class="notes">${esc(p.notes)}</p>` : ""}
        </div>
      </article>`
      )
      .join("");
    wireCopy(host);
    const count = document.querySelector("[data-result-count]");
    if (count) count.textContent = `${items.length} shown · ${data.parameters.length} total`;
  }

  search?.addEventListener("input", paint);
  chips.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-filter-type");
      const value = btn.getAttribute("data-filter");
      if (type === "status") {
        statusFilter = value;
        document.querySelectorAll('[data-filter-type="status"]').forEach((b) =>
          b.setAttribute("aria-pressed", b === btn ? "true" : "false")
        );
      } else if (type === "category") {
        categoryFilter = value;
        document.querySelectorAll('[data-filter-type="category"]').forEach((b) =>
          b.setAttribute("aria-pressed", b === btn ? "true" : "false")
        );
      }
      paint();
    });
  });

  paint();
}

function renderMethodology(data) {
  const host = document.querySelector("[data-timeline]");
  if (host) {
    host.innerHTML = data.methodology
      .map(
        (s) => `
      <div class="t-item">
        <div class="t-num">${s.step}</div>
        <div class="panel t-body">
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.detail)}</p>
        </div>
      </div>`
      )
      .join("");
  }

  const disc = document.querySelector("[data-discovery]");
  if (disc) {
    disc.innerHTML = data.discoveryNotes.map((n) => `<li>${esc(n)}</li>`).join("");
  }

  const defaults = document.querySelector("[data-defaults]");
  if (defaults) {
    defaults.innerHTML = data.defaults.ui.map((x) => `<li>${esc(x)}</li>`).join("");
  }
}

function renderRecipes(data) {
  const host = document.querySelector("[data-recipes]");
  if (host) {
    host.innerHTML = data.recipes
      .map(
        (r) => `
      <article class="panel recipe-card" id="recipe-${esc(r.id)}">
        <div class="tag-row">${r.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.blurb)}</p>
        <div>
          <h4 class="sr-only">Template</h4>
          ${codeBlock(r.template)}
        </div>
        <div>
          <h4 class="sr-only">Example</h4>
          ${codeBlock(r.example)}
        </div>
        ${r.caveat ? `<p class="caveat">${esc(r.caveat)}</p>` : ""}
      </article>`
      )
      .join("");
    wireCopy(host);
  }

  const harness = document.querySelector("[data-harness-recipes]");
  if (harness && Array.isArray(data.harnessRecipes)) {
    harness.innerHTML = data.harnessRecipes
      .map(
        (r) => `
      <article class="panel recipe-card harness-card" id="harness-${esc(r.id)}">
        <div class="tag-row">
          ${(r.tags || []).map((t) => `<span class="tag tag-hermes">${esc(t)}</span>`).join("")}
        </div>
        <h3>${esc(r.title)}</h3>
        <p>${esc(r.blurb)}</p>
        <div class="cap-row">
          ${(r.capabilities || [])
            .map((c) => `<span class="cap-pill">${esc(c)}</span>`)
            .join("")}
        </div>
        <div>
          <h4 class="sr-only">Snippet</h4>
          ${codeBlock(r.snippet)}
        </div>
        ${r.notes ? `<p class="notes">${esc(r.notes)}</p>` : ""}
      </article>`
      )
      .join("");
    wireCopy(harness);
    const count = document.querySelector("[data-harness-count]");
    if (count) count.textContent = `${data.harnessRecipes.length} harness recipes`;
  }

  // Live builder
  const out = document.querySelector("[data-builder-out]");
  const prompt = document.querySelector("#builder-prompt");
  const mode = document.querySelector("#builder-mode");
  const priv = document.querySelector("#builder-private");
  if (out && prompt && mode && priv) {
    const paint = () => {
      const q = encodeURIComponent(prompt.value || "Your prompt here");
      const parts = [`https://grok.com/?q=${q}`];
      if (mode.value) parts[0] += `&mode=${encodeURIComponent(mode.value)}`;
      let url = parts[0];
      if (priv.checked) url += "#private";
      out.innerHTML = codeBlock(url);
      wireCopy(out);
    };
    prompt.addEventListener("input", paint);
    mode.addEventListener("change", paint);
    priv.addEventListener("change", paint);
    paint();
  }
}

async function main() {
  setActiveNav();
  wireCopy(document);

  let data;
  try {
    data = await loadFindings();
  } catch (err) {
    const fail = document.querySelector("[data-load-error]");
    if (fail) {
      fail.hidden = false;
      fail.textContent = String(err.message || err);
    }
    console.error(err);
    return;
  }

  // stamp meta
  document.querySelectorAll("[data-meta-date]").forEach((el) => {
    el.textContent = data.meta.date;
  });
  document.querySelectorAll("[data-meta-session]").forEach((el) => {
    el.textContent = data.meta.session;
  });

  renderHome(data);
  renderParameters(data);
  renderMethodology(data);
  renderRecipes(data);
}

main();
