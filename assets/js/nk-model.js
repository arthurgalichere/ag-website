/* Last edited: 2026-11-16 09:32 UTC (Claude, economics chat) */
/* =========================================================
   nk-model.js: /economics/nk-model.html
   The canonical New Keynesian model (Arthur Galichère's notes),
   solved in the browser so that readers can change the parameters.

   Log-linear model (deviations from the zero-inflation steady state;
   pi and R quarterly, in decimals):
     IS   sigma E y(t+1) + E pi(t+1) = sigma y(t) + R(t) - (1-rho_z) z(t)
     PC   pi(t) = beta E pi(t+1) + K [(eta+sigma) y(t) - (1+eta) a(t) + th(t)],
          K = (1-xi)(1-xi beta)/xi (Calvo) or (eps-1)/omega (Rotemberg)
     Rule R(t) = phi_pi pi(t) + phi_y (y(t) - yf(t)) + nu(t),
          yf(t) = [(1+eta) a(t) - th(t)] / (eta+sigma)
     States a (rho_A), th (labour-disutility weight, rho_th), z (discount
     factor: demand, rho_z; added to the notes' model so that the shocks can
     be identified from the data) and nu (iid).
   Solution by undetermined coefficients: y = g_y z, pi = g_pi z for each
   state z (closed form; identical to the iterative solver of
   The_canonical_new_Keynesian_model.m). Determinacy: Bullard and Mitra
   (2002), K (eta+sigma) (phi_pi - 1) + (1 - beta) phi_y > 0.

   Data (nk-model.json, built by nk_model_data.py): output and labour
   productivity (HP cycles), inflation and the federal funds rate (demeaned
   or HP cycles). With four shocks and four observables, the states are
   backed out exactly each quarter (technology is labour productivity,
   A = Y/h); each shock's contribution is then g z_k (additive). With only
   output, inflation and the rate, a and th could not be told apart: they
   enter only through (1+eta) a - th.
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="nk-model"]');
  if (!body || !D || !S) return;

  const CALIBRATION = {
    beta: 0.99, sigma: 1, eta: 5, eps: 11, omega: 75, xi: 0.7,
    phiPi: 1.5, phiY: 0.125, rhoA: 0.9, rhoTh: 0.9, rhoZ: 0.5, A: 1.2, theta: 1,
    sdA: 1, sdTh: 1, sdZ: 1, sdNu: 1,
  };
  // Replaced on load by the shock calibration estimated on Extracting Shocks
  // for the New Keynesian Model (nk-model.json, calibration); the values above
  // (the notes', and 1 percent shocks) are used only if the data cannot be read.
  const PARAMS = [
    // key, symbol (TeX), name, min, max, step, group
    ['beta', '\\beta', 'Discount factor', 0.9, 0.999, 0.001, 'Preferences'],
    ['sigma', '\\sigma', 'Relative risk aversion (inverse of the intertemporal elasticity)', 0.1, 10, 0.1, 'Preferences'],
    ['eta', '\\eta', 'Inverse Frisch elasticity of labour supply', 0, 10, 0.1, 'Preferences'],
    ['eps', '\\varepsilon', 'Elasticity of substitution between intermediate goods', 1.1, 50, 0.1, 'Price setting'],
    ['xi', '\\xi', 'Probability of not resetting the price (Calvo)', 0.01, 0.99, 0.01, 'Price setting'],
    ['omega', '\\omega', 'Price-adjustment cost (Rotemberg)', 0, 500, 1, 'Price setting'],
    ['phiPi', '\\phi_\\pi', 'Policy response to inflation', 0, 5, 0.05, 'Monetary policy'],
    ['phiY', '\\phi_y', 'Policy response to the output gap (quarterly rates)', 0, 2, 0.005, 'Monetary policy'],
    ['rhoA', '\\rho_A', 'Persistence of technology', 0, 0.99, 0.01, 'Shocks'],
    ['rhoTh', '\\rho_\\theta', 'Persistence of the labour-disutility weight', 0, 0.99, 0.01, 'Shocks'],
    ['rhoZ', '\\rho_\\zeta', 'Persistence of the discount factor (demand)', 0, 0.99, 0.01, 'Shocks'],
    ['sdA', '\\sigma_A', 'Technology shock (percent)', 0, 20, 0.01, 'Size of the shocks (standard deviations)'],
    ['sdTh', '\\sigma_\\theta', 'Labour-preference shock (percent)', 0, 50, 0.01, 'Size of the shocks (standard deviations)'],
    ['sdZ', '\\sigma_\\zeta', 'Demand shock (percent)', 0, 20, 0.01, 'Size of the shocks (standard deviations)'],
    ['sdNu', '\\sigma_\\nu', 'Monetary policy shock (pp, annual rate)', 0, 20, 0.01, 'Size of the shocks (standard deviations)'],
  ];
  const STATES = ['a', 'th', 'z', 'nu'];
  const SHOCK_LABEL = { a: 'Technology', th: 'Labour preference', z: 'Demand', nu: 'Monetary policy' };
  // The data are --chart-benchmark (orange, dash-dot); contributions differ in colour and dash.
  const SHOCK_COLOR = { a: '--series-4', th: '--series-2', z: '--chart-4', nu: '--series-3' };
  const SHOCK_DASH = { a: 'none', th: 'none', z: '6 3', nu: '1.5 3' };
  const IRF_T = 40;
  const BENCHMARK_DASH = '8 4 0.1 4';

  const role = name => body.querySelector(`[data-role="${name}"]`);
  const inCard = (card, name) => card.querySelector(`[data-role="${name}"]`);
  const irfCards = Array.from(body.querySelectorAll('[data-irf]'));
  const dataCards = Array.from(body.querySelectorAll('[data-decomp]'));
  const stateCards = Array.from(body.querySelectorAll('[data-state]'));
  const state = {
    p: { ...CALIBRATION }, pricing: 'calvo', shock: 'a', measure: 'demeaned', payload: null, charts: new Map(),
  };
  const token = name => getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  const fmt = (value, digits = 2) => (Number.isFinite(value) ? D.formatNumber(Math.abs(value) < 0.5 * 10 ** -digits ? 0 : value, digits) : '–');
  const esc = text => S.escapeHTML(String(text));

  function setHTML(element, html) {
    const MJ = window.MathJax;
    if (MJ && MJ.typesetClear) MJ.typesetClear([element]);
    element.innerHTML = html;
    if (MJ && MJ.startup && MJ.startup.promise) MJ.startup.promise.then(() => MJ.typesetPromise([element])).catch(() => {});
  }

  /* Model ------------------------------------------------------------ */

  function solve(p, pricing) {
    const kappa = pricing === 'calvo' ? (1 - p.xi) * (1 - p.xi * p.beta) / p.xi : (p.omega > 0 ? (p.eps - 1) / p.omega : Infinity);
    const K = kappa * (p.eta + p.sigma);
    const determinate = Number.isFinite(kappa) && K * (p.phiPi - 1) + (1 - p.beta) * p.phiY > 0;
    const f = { a: (1 + p.eta) / (p.eta + p.sigma), th: -1 / (p.eta + p.sigma), z: 0, nu: 0 };   // natural output
    const rho = { a: p.rhoA, th: p.rhoTh, z: p.rhoZ, nu: 0 };
    const g = {};
    STATES.forEach(k => {
      // [sigma(rho-1) - phi_y] gy + (rho - phi_pi) gpi = n - phi_y f - i
      // -K gy + (1 - beta rho) gpi = -c
      const c = { a: kappa * (1 + p.eta), th: -kappa, z: 0, nu: 0 }[k];   // marginal cost
      const n = k === 'nu' ? 1 : 0;                                       // policy rule
      const i = k === 'z' ? 1 - p.rhoZ : 0;                               // IS curve
      const a11 = p.sigma * (rho[k] - 1) - p.phiY, a12 = rho[k] - p.phiPi, a21 = -K, a22 = 1 - p.beta * rho[k];
      const b1 = n - p.phiY * f[k] - i, b2 = -c;
      const det = a11 * a22 - a12 * a21;
      const gy = (b1 * a22 - a12 * b2) / det;
      const gpi = (a11 * b2 - a21 * b1) / det;
      g[k] = { y: gy, pi: gpi, R: p.phiPi * gpi + p.phiY * (gy - f[k]) + n, f: f[k] };
    });
    return { kappa, K, determinate, rho, g, f };
  }

  /* All model variables for given state paths (decimals). */
  function variables(sol, p, z) {
    const n = z.a.length;
    const out = { y: [], gap: [], pi: [], R: [], h: [], w: [], mu: [], yf: [], rr: [] };
    for (let t = 0; t < n; t += 1) {
      const y = STATES.reduce((s, k) => s + sol.g[k].y * z[k][t], 0);
      const pi = STATES.reduce((s, k) => s + sol.g[k].pi * z[k][t], 0);
      const yf = sol.f.a * z.a[t] + sol.f.th * z.th[t];
      const R = p.phiPi * pi + p.phiY * (y - yf) + z.nu[t];
      const mu = z.th[t] + (p.eta + p.sigma) * y - (1 + p.eta) * z.a[t];
      out.y.push(y); out.pi.push(pi); out.yf.push(yf); out.gap.push(y - yf); out.R.push(R);
      out.h.push(y - z.a[t]); out.mu.push(mu); out.w.push(mu + z.a[t]);
      // Ex-ante real rate R - E pi(t+1), with E pi(t+1) = sum g_pi rho z
      out.rr.push(R - STATES.reduce((s, k) => s + sol.g[k].pi * sol.rho[k] * z[k][t], 0));
    }
    return out;
  }

  const SCALE = { y: 100, gap: 100, h: 100, w: 100, mu: 100, yf: 100, a: 100, th: 100, z: 100, nu: 400, pi: 400, R: 400, rr: 400 };

  /* Steady state (levels). */
  function steady(p) {
    const mu = (p.eps - 1) / p.eps;
    const w = mu * p.A;
    const h = (w / (p.theta * p.A ** p.sigma)) ** (1 / (p.eta + p.sigma));
    return { mu, w, h, Y: p.A * h, R: 400 * (1 / p.beta - 1), markup: 100 * (p.eps / (p.eps - 1) - 1) };
  }

  /* Charts ----------------------------------------------------------- */

  const swatch = item => `
    <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
      <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="${2.2 * (item.weight || 1)}"
        stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${esc(item.label)}</li>`;

  function draw(card, options, series) {
    const previous = state.charts.get(card);
    if (previous) previous.destroy();
    inCard(card, 'chart-status').hidden = true;
    inCard(card, 'chart-frame').hidden = false;
    state.charts.set(card, D.lineChart(inCard(card, 'chart-frame'), { ...options, series, readout: inCard(card, 'chart-readout') }));
    const legend = inCard(card, 'chart-legend');
    legend.innerHTML = series.length > 1 ? series.map(swatch).join('') : '';
    legend.hidden = series.length < 2;
    inCard(card, 'chart-readout').textContent = options.readoutText || '';
  }

  function blank(card, text) {
    const previous = state.charts.get(card);
    if (previous) { previous.destroy(); state.charts.delete(card); }
    inCard(card, 'chart-frame').hidden = true;
    inCard(card, 'chart-legend').hidden = true;
    const status = inCard(card, 'chart-status');
    status.hidden = false;
    status.textContent = text;
  }

  function renderIRF(sol) {
    const p = state.p;
    const z = { a: [], th: [], z: [], nu: [] };
    for (let t = 0; t < IRF_T; t += 1) {
      // One-standard-deviation shock: percent (a, th, z); percentage points at an annual rate (nu).
      const size = { a: p.sdA / 100, th: p.sdTh / 100, z: p.sdZ / 100, nu: p.sdNu / 400 };
      STATES.forEach(k => z[k].push(k === state.shock ? size[k] * (k === 'nu' ? (t === 0 ? 1 : 0) : sol.rho[k] ** t) : 0));
    }
    const v = variables(sol, p, z);
    const x = Array.from({ length: IRF_T }, (_, i) => i + 1);
    irfCards.forEach(card => {
      const key = card.dataset.irf;
      if (key === 'shock') {
        card.querySelector('.chart-title').textContent = { a: 'Technology', th: 'Labour-disutility weight', z: 'Discount factor (demand)', nu: 'Monetary policy shock' }[state.shock];
        inCard(card, 'chart-subtitle').textContent = state.shock === 'nu' ? 'Percentage points (annual rate)' : 'Percent deviation from steady state';
      }
      const values = key === 'shock' ? z[state.shock].map(val => val * SCALE[state.shock]) : v[key].map(val => val * SCALE[key]);
      draw(card, {
        dates: x, xValues: x, xStep: 10, xTitle: 'Quarters', zeroLine: true, digits: 3, copyrightPosition: 'top',
        label: `Impulse response of ${card.querySelector('.chart-title').textContent.toLowerCase()} to a ${SHOCK_LABEL[state.shock].toLowerCase()} shock`,
      }, [{ label: 'Response', color: token('--chart-1'), weight: 1.1, values }]);
    });
  }

  /* Data: back out the states, then the contribution of each shock. */
  function observables() {
    const s = state.payload.series;
    const m = state.payload.means;
    const demeaned = state.measure === 'demeaned';
    return {
      y: s.y_hp.map(v => v / 100),
      yh: s.yh_hp.map(v => v / 100),
      pi: (demeaned ? s.infl.map(v => v - m.infl) : s.infl_hp).map(v => v / 400),
      R: (demeaned ? s.ff.map(v => v - m.ff) : s.ff_hp).map(v => v / 400),
    };
  }

  /* Rows: output, labour productivity, inflation, interest rate; columns:
     the four states. Labour productivity is technology in the model
     (Y = A h), so its row is (1, 0, 0, 0). Gaussian elimination with
     partial pivoting, for every quarter at once. */
  const OBS = ['y', 'yh', 'pi', 'R'];
  function invert(sol, obs) {
    const M = OBS.map(row => STATES.map(k => (row === 'yh' ? (k === 'a' ? 1 : 0) : sol.g[k][row])));
    const n = STATES.length;
    const T = obs.y.length;
    const A = M.map((row, r) => [...row, ...Array.from({ length: T }, (_, t) => obs[OBS[r]][t])]);
    let det = 1;
    for (let c = 0; c < n; c += 1) {
      let piv = c;
      for (let r = c + 1; r < n; r += 1) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
      if (Math.abs(A[piv][c]) < 1e-12) return { z: null, det: 0 };
      if (piv !== c) { [A[piv], A[c]] = [A[c], A[piv]]; det = -det; }
      det *= A[c][c];
      for (let r = 0; r < n; r += 1) {
        if (r === c) continue;
        const m = A[r][c] / A[c][c];
        if (m !== 0) for (let j = c; j < A[r].length; j += 1) A[r][j] -= m * A[c][j];
      }
    }
    const z = {};
    STATES.forEach((k, r) => { z[k] = A[r].slice(n).map(v => v / A[r][r]); });
    return { z, det };
  }

  function stats(x, y) {
    const n = x.length;
    const mx = x.reduce((s, v) => s + v, 0) / n, my = y.reduce((s, v) => s + v, 0) / n;
    let sxx = 0, syy = 0, sxy = 0;
    for (let i = 0; i < n; i += 1) { sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; sxy += (x[i] - mx) * (y[i] - my); }
    return { sd: Math.sqrt(sxx / (n - 1)), corr: sxy / Math.sqrt(sxx * syy), share: sxx / syy };
  }
  const sd = x => stats(x, x).sd;
  function ar1(x) {
    return stats(x.slice(1), x.slice(0, -1)).corr;
  }

  let lastDecomposition = null;

  function renderData(sol) {
    const payload = state.payload;
    if (!payload) return;
    const p = state.p;
    const obs = observables();
    const { z, det } = invert(sol, obs);
    const dates = payload.dates;
    const recessions = payload.recessions ? payload.recessions.intervals : [];
    const label = state.measure === 'demeaned' ? 'demeaned' : 'HP cyclical component';
    if (!z || !Number.isFinite(det) || Math.abs(det) < 1e-12) {
      dataCards.concat(stateCards).forEach(card => blank(card, 'The shocks cannot be backed out with these parameters.'));
      return;
    }
    const parts = {};
    STATES.forEach(k => {
      const only = Object.fromEntries(STATES.map(j => [j, z[j].map(v => (j === k ? v : 0))]));
      parts[k] = variables(sol, p, only);
    });
    const full = variables(sol, p, z);
    lastDecomposition = { dates, obs, z, parts, full };
    const units = { y: 'Percent deviation from trend (HP)', pi: `Percentage points, annual rate (${label})`, R: `Percentage points, annual rate (${label})` };
    dataCards.forEach(card => {
      const key = card.dataset.decomp;
      inCard(card, 'chart-subtitle').textContent = `${units[key]} · quarterly · ${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;
      const series = STATES.map(k => ({ label: `${SHOCK_LABEL[k]} shocks`, color: token(SHOCK_COLOR[k]), dash: SHOCK_DASH[k], values: parts[k][key].map(v => v * SCALE[key]) }));
      series.push({ label: 'US data', color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true, weight: 1.1, values: obs[key].map(v => v * SCALE[key]) });
      draw(card, { dates, period: 0.25, zeroLine: true, digits: 2, recessions, readoutText: 'Hover over the chart, or focus it and use the arrow keys, to read values.',
        label: `${card.querySelector('.chart-title').textContent}: US data and the contribution of each shock` }, series);
      const note = STATES.map(k => {
        const st = stats(parts[k][key], obs[key]);
        return `${SHOCK_LABEL[k].toLowerCase()} shocks: correlation with the data ${fmt(st.corr)}, variance ${fmt(100 * st.share, 0)} percent of the data’s`;
      }).join('; ');
      const src = { y: `real GDP per person, ${payload.sources.y_hp}`, pi: `GDP price index, ${payload.sources.infl}`, R: `effective federal funds rate, ${payload.sources.ff}` }[key];
      inCard(card, 'chart-source').textContent = `Data: ${src}. Model: author’s calculations.`;
      inCard(card, 'chart-note').textContent = `The four contributions add up to the data in every quarter. ${note.charAt(0).toUpperCase()}${note.slice(1)} (contributions are correlated, so the shares need not add up to 100).`;
    });
    stateCards.forEach(card => {
      const key = card.dataset.state;
      const series = [{ label: { a: 'Technology', th: 'Labour-disutility weight backed out', z: 'Discount factor backed out', nu: 'Monetary policy shock backed out', gap: 'Output gap (model)' }[key],
        color: token('--chart-1'), weight: 1.1, values: (key === 'gap' ? full.gap : z[key]).map(v => v * SCALE[key === 'gap' ? 'gap' : key]) }];
      let note = '';
      if (key === 'a') {
        note = `In the model, labour productivity is technology, \\(A_t = Y_t/h_t\\), so technology is the HP cycle of US labour productivity. Standard deviation ${fmt(sd(z.a.map(v => v * 100)))} percent; first-order autocorrelation ${fmt(ar1(z.a))}, against \\(\\rho_A = ${fmt(p.rhoA)}\\) assumed.`;
      } else if (key === 'gap') {
        series.push({ label: 'Output, US data (HP cycle)', color: token('--chart-benchmark'), dash: BENCHMARK_DASH, under: true, values: obs.y.map(v => v * 100) });
        note = `Output minus the flexible-price level of output, \\(\\tilde{y}_t = \\hat{y}_t - \\hat{y}^f_t\\), implied by the backed-out states. Correlation with the HP cycle of output: ${fmt(stats(full.gap, obs.y).corr)}.`;
      } else if (key === 'nu') {
        note = `Standard deviation ${fmt(sd(z.nu.map(v => v * 400)))} percentage points (annual rate). Positive values mean a tighter policy than the rule prescribes.`;
      } else if (key === 'z') {
        note = `Standard deviation ${fmt(sd(z.z.map(v => v * 100)))} percent; first-order autocorrelation ${fmt(ar1(z.z))}, against \\(\\rho_\\zeta = ${fmt(p.rhoZ)}\\) assumed. A higher discount factor makes households value consumption today more than in the future, which raises demand.`;
      } else {
        note = `Standard deviation ${fmt(sd(z.th.map(v => v * 100)))} percent; first-order autocorrelation ${fmt(ar1(z.th))}, against \\(\\rho_\\theta = ${fmt(p.rhoTh)}\\) assumed. A higher weight on the disutility of labour lowers labour supply at every wage.`;
      }
      const srcEl = inCard(card, 'chart-source');
      if (srcEl) srcEl.textContent = key === 'a' ? `Data: labour productivity (output per hour, nonfarm business), ${payload.sources.yh_hp}. Model: author’s calculations.` : 'Backed out from US output, labour productivity, inflation and the federal funds rate. Model: author’s calculations.';
      const subtitle = key === 'nu' ? 'Percentage points, annual rate' : 'Percent deviation from steady state';
      inCard(card, 'chart-subtitle').textContent = `${subtitle} · quarterly · ${D.quarterLabel(dates[0])}–${D.quarterLabel(dates[dates.length - 1])}`;
      draw(card, { dates, period: 0.25, zeroLine: true, digits: 2, recessions, readoutText: 'Hover over the chart, or focus it and use the arrow keys, to read values.',
        label: card.querySelector('.chart-title').textContent }, series);
      setHTML(inCard(card, 'chart-note'), esc(note));
    });
    renderShares(parts, obs);
  }

  function renderShares(parts, obs) {
    const keys = [['y', 'Output'], ['pi', 'Inflation'], ['R', 'Nominal interest rate']];
    const head = `<tr><th scope="col" class="component-head" rowspan="2">Variable</th>${STATES.map(k => `<th scope="colgroup" colspan="2">${SHOCK_LABEL[k]} shocks</th>`).join('')}</tr>
      <tr>${STATES.map(() => '<th scope="col">Correlation<br>with the data</th><th scope="col">Variance relative<br>to the data (%)</th>').join('')}</tr>`;
    const rows = keys.map(([key, name]) => `<tr><th scope="row">${esc(name)}</th>${STATES.map(k => {
      const st = stats(parts[k][key], obs[key]);
      return `<td>${fmt(st.corr)}</td><td>${fmt(100 * st.share, 0)}</td>`;
    }).join('')}</tr>`).join('');
    setHTML(role('shares-table'), `<div class="table-scroll"><table class="data-table shares-table bc-table slide-table">
      <caption class="visually-hidden">Contribution of each shock to US output, inflation and the interest rate</caption>
      <thead>${head}</thead><tbody>${rows}</tbody></table></div>`);
  }

  /* Tables ----------------------------------------------------------- */

  function renderTables(sol) {
    const p = state.p;
    const ss = steady(p);
    const calvo = state.pricing === 'calvo';
    const rows = [
      ['Slope of the Phillips curve on marginal cost', calvo ? '\\(\\kappa = (1-\\xi)(1-\\xi\\beta)/\\xi\\)' : '\\(\\kappa = (\\varepsilon-1)/\\omega\\)', fmt(sol.kappa, 4)],
      ['Slope on output', '\\(\\kappa(\\eta+\\sigma)\\)', fmt(sol.K, 4)],
      ...(calvo ? [['Average duration of a price (quarters)', '\\(1/(1-\\xi)\\)', fmt(1 / (1 - p.xi), 2)],
        ['Rotemberg cost with the same slope', '\\(\\omega = (\\varepsilon-1)/\\kappa\\)', fmt((p.eps - 1) / sol.kappa, 1)]]
        : [['Calvo probability with the same slope', '\\(\\xi\\)', fmt(calvoFromKappa(sol.kappa, p.beta), 3)]]),
      ['Determinacy (Bullard and Mitra, 2002)', '\\(\\kappa(\\eta+\\sigma)(\\phi_\\pi-1) + (1-\\beta)\\phi_y\\)', `${fmt(sol.K * (p.phiPi - 1) + (1 - p.beta) * p.phiY, 4)} ${sol.determinate ? '(> 0: unique stable solution)' : '(≤ 0: indeterminate)'}`],
    ];
    setHTML(role('derived-table'), table('Implied values', rows));
    setHTML(role('steady-table'), table('Steady state', [
      ['Real marginal cost', '\\(\\mu = (\\varepsilon-1)/\\varepsilon\\)', fmt(ss.mu, 4)],
      ['Price markup over marginal cost (percent)', '\\(\\varepsilon/(\\varepsilon-1) - 1\\)', fmt(ss.markup, 1)],
      ['Real wage', '\\(w = \\mu A\\)', fmt(ss.w, 4)],
      ['Hours worked', '\\(h = [w/(\\theta A^{\\sigma})]^{1/(\\eta+\\sigma)}\\)', fmt(ss.h, 4)],
      ['Output and consumption', '\\(Y = c = A h\\)', fmt(ss.Y, 4)],
      ['Nominal (= real) interest rate (percent a year)', '\\(4(1/\\beta - 1)\\)', fmt(ss.R, 2)],
    ]));
    const coeff = STATES.map(k => `<tr><th scope="row">${SHOCK_LABEL[k]}</th><td>${fmt(sol.g[k].y, 4)}</td><td>${fmt(sol.g[k].pi, 4)}</td><td>${fmt(sol.g[k].R, 4)}</td><td>${fmt(sol.rho[k], 2)}</td></tr>`).join('');
    setHTML(role('solution-table'), `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
      <caption class="visually-hidden">Solution coefficients</caption>
      <thead><tr><th scope="col" class="component-head">State \\(z_t\\)</th><th scope="col">Output \\(g_y\\)</th><th scope="col">Inflation \\(g_\\pi\\)</th><th scope="col">Interest rate \\(g_R\\)</th><th scope="col">Persistence</th></tr></thead>
      <tbody>${coeff}</tbody></table></div>`);
  }

  function calvoFromKappa(kappa, beta) {
    // (1-xi)(1-xi beta)/xi = kappa  <=>  beta xi^2 - (1 + beta + kappa) xi + 1 = 0
    const b = 1 + beta + kappa;
    return (b - Math.sqrt(b * b - 4 * beta)) / (2 * beta);
  }

  const table = (caption, rows) => `<div class="table-scroll"><table class="data-table shares-table bc-table calibration-table">
    <caption class="visually-hidden">${esc(caption)}</caption>
    <thead><tr><th scope="col" class="component-head">Quantity</th><th scope="col">Formula</th><th scope="col">Value</th></tr></thead>
    <tbody>${rows.map(([n, s, v]) => `<tr><th scope="row">${esc(n)}</th><td class="symbol-cell">${s}</td><td>${v}</td></tr>`).join('')}</tbody></table></div>`;

  /* Controls --------------------------------------------------------- */

  function buildControls() {
    const box = role('parameters');
    const groups = {};
    PARAMS.forEach(([key, sym, name, min, max, step, group]) => {
      (groups[group] = groups[group] || []).push(`<label class="param-field" data-param-field="${key}">
        <span class="param-label"><span class="param-symbol">\\(${sym}\\)</span> ${esc(name)}</span>
        <input type="number" inputmode="decimal" data-param="${key}" min="${min}" max="${max}" step="${step}" value="${state.p[key]}">
      </label>`);
    });
    setHTML(box, Object.entries(groups).map(([g, fields]) => `<fieldset class="param-group"><legend>${esc(g)}</legend>${fields.join('')}</fieldset>`).join(''));
    box.addEventListener('change', event => {
      const input = event.target.closest('[data-param]');
      if (!input) return;
      const [key, , , min, max] = PARAMS.find(row => row[0] === input.dataset.param);
      let value = Number(input.value);
      if (!Number.isFinite(value)) value = CALIBRATION[key];
      value = Math.min(max, Math.max(min, value));
      input.value = value;
      state.p[key] = value;
      render();
    });
    role('reset').addEventListener('click', () => {
      state.p = { ...CALIBRATION };
      box.querySelectorAll('[data-param]').forEach(input => { input.value = state.p[input.dataset.param]; });
      render();
    });
    role('download').addEventListener('click', downloadCSV);
  }

  /* The estimated shock calibration becomes the default (and the reset target). */
  function applyCalibration(cal) {
    if (!cal || !cal.rho || !cal.sd) return;
    const round = v => Math.round(v * 1000) / 1000;
    Object.assign(CALIBRATION, {
      rhoA: round(cal.rho.a), rhoTh: round(cal.rho.th), rhoZ: round(cal.rho.z),
      sdA: round(cal.sd.a), sdTh: round(cal.sd.th), sdZ: round(cal.sd.z), sdNu: round(cal.sd.nu),
    });
    state.p = { ...CALIBRATION };
    body.querySelectorAll('[data-param]').forEach(input => { input.value = state.p[input.dataset.param]; });
  }

  function showRelevantParams() {
    body.querySelectorAll('[data-param-field]').forEach(field => {
      const key = field.dataset.paramField;
      const inactive = (key === 'xi' && state.pricing !== 'calvo') || (key === 'omega' && state.pricing !== 'rotemberg');
      field.classList.toggle('is-inactive', inactive);
      field.title = inactive ? `Not used with ${state.pricing === 'calvo' ? 'Calvo' : 'Rotemberg'} pricing` : '';
    });
  }

  function downloadCSV() {
    if (!lastDecomposition) return;
    const { dates, obs, z, parts } = lastDecomposition;
    const name = { a: 'technology', th: 'labour_preference', z: 'demand', nu: 'monetary' };
    const header = ['date', 'y_data', 'productivity_data', 'pi_data', 'R_data', 'a', 'theta', 'zeta', 'nu',
      ...STATES.flatMap(k => ['y', 'pi', 'R'].map(v => `${v}_${name[k]}`))];
    const lines = [header.join(',')];
    dates.forEach((d, t) => {
      const row = [d, obs.y[t] * 100, obs.yh[t] * 100, obs.pi[t] * 400, obs.R[t] * 400, z.a[t] * 100, z.th[t] * 100, z.z[t] * 100, z.nu[t] * 400,
        ...STATES.flatMap(k => [parts[k].y[t] * 100, parts[k].pi[t] * 400, parts[k].R[t] * 400])];
      lines.push(row.map((v, i) => (i === 0 ? v : Number(v).toFixed(5))).join(','));
    });
    const p = state.p;
    const meta = `# Canonical NK model, ${state.pricing} pricing; beta=${p.beta}, sigma=${p.sigma}, eta=${p.eta}, eps=${p.eps}, xi=${p.xi}, omega=${p.omega}, phi_pi=${p.phiPi}, phi_y=${p.phiY}, rho_A=${p.rhoA}, rho_theta=${p.rhoTh}, rho_zeta=${p.rhoZ}, rho_nu=0; inflation and rate ${state.measure}; output, productivity, a, theta, zeta in percent; pi, R, nu in percentage points at an annual rate. arthurgalichere.com`;
    const blob = new Blob([`${meta}\n${lines.join('\n')}\n`], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'us-nk-model-decomposition.csv';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { URL.revokeObjectURL(link.href); link.remove(); }, 0);
  }

  /* Rendering -------------------------------------------------------- */

  function render() {
    const sol = solve(state.p, state.pricing);
    showRelevantParams();
    renderTables(sol);
    const status = role('determinacy');
    if (!sol.determinate) {
      status.className = 'callout is-warning determinacy-note';
      setHTML(status, '<i class="fas fa-triangle-exclamation" aria-hidden="true"></i><p>With these parameters the policy rule does not satisfy the Taylor principle: the model has no unique stable solution, so the impulse responses and the decomposition of the data are not shown. Raise \\(\\phi_\\pi\\) above one, or \\(\\phi_y\\).</p>');
      irfCards.concat(dataCards, stateCards).forEach(card => blank(card, 'Indeterminate: no unique stable solution with these parameters.'));
      return;
    }
    status.className = 'callout is-quiet determinacy-note';
    setHTML(status, `<i class="fas fa-circle-check" aria-hidden="true"></i><p>Determinate: \\(\\kappa(\\eta+\\sigma)(\\phi_\\pi-1) + (1-\\beta)\\phi_y = ${fmt(sol.K * (state.p.phiPi - 1) + (1 - state.p.beta) * state.p.phiY, 4)} > 0\\). The model has a unique stable solution.</p>`);
    renderIRF(sol);
    renderData(sol);
  }

  async function load() {
    try {
      const url = body.dataset.dataUrl.replace('{country}', 'us');
      const response = await S.fetchFresh(url);
      state.payload = await response.json();
      if (!state.payload || !state.payload.series) throw new Error('The data file does not contain the expected series.');
      role('page-status').hidden = true;
      applyCalibration(state.payload.calibration);
      if (state.payload.generated_at_utc) {
        const note = role('update-note');
        note.textContent = `Data updated on ${new Date(state.payload.data_generated_at_utc || state.payload.generated_at_utc).toLocaleDateString('en-GB')}`;
        note.hidden = false;
      }
    } catch (error) {
      const status = role('page-status');
      status.hidden = false;
      status.className = 'render-error';
      status.innerHTML = '<span class="render-error-title">The US data could not be loaded.</span>The model and its impulse responses are shown; the comparison with the data will appear after the next data update.'
        + `<span class="render-error-message">${esc(error.message)}</span>`;
      dataCards.concat(stateCards).forEach(card => blank(card, 'The data could not be loaded.'));
    } finally {
      render();
      S.releaseReveal();
    }
  }

  D.segmented(body.querySelector('[data-control="pricing"]'), value => { state.pricing = value; render(); }).select('calvo', false);
  D.segmented(body.querySelector('[data-control="shock"]'), value => { state.shock = value; render(); }).select('a', false);
  D.segmented(body.querySelector('[data-control="measure"]'), value => { state.measure = value; render(); }).select('demeaned', false);
  body.addEventListener('click', event => {
    const link = event.target.closest('a[data-open-ribbon]');
    if (!link) return;
    const target = document.getElementById(link.getAttribute('href').slice(1));
    if (target && target.tagName === 'DETAILS') target.open = true;
  });
  buildControls();
  load();
})();
