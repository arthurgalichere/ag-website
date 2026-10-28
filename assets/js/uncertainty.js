/* =========================================================
   EC9D5 interactive page: uncertainty and precautionary saving.
   Two-period model, CRRA utility, income W ± ε with prob. 1/2.
   Parameters come from data-* attributes on .uncertainty-body.
   ========================================================= */
(() => {
  'use strict';

  const root = document.querySelector('.uncertainty-body');
  if (!root) return;

  const byId = id => document.getElementById(id);
  const ui = {
    epsilon: byId('epsilon-slider'),
    gamma: byId('gamma-slider'),
    epsilonOutput: byId('epsilon-output'),
    gammaOutput: byId('gamma-output'),
    partialChart: byId('partial-chart'),
    equilibriumChart: byId('equilibrium-chart'),
    partialNote: byId('partial-chart-note'),
    equilibriumNote: byId('equilibrium-chart-note'),
    table: byId('comparison-body'),
    jensenGap: byId('jensen-gap'),
    saving: byId('precautionary-saving'),
    consumptionChange: byId('current-consumption-change'),
    takeaway: byId('takeaway'),
    certaintyCase: byId('certainty-equation'),
    uncertaintyCase: byId('uncertainty-equation'),
    certaintyStatus: byId('certainty-status'),
    uncertaintyStatus: byId('uncertainty-status'),
    /* Section 1: Euler equation under certainty. */
    certGamma: byId('certainty-gamma-slider'),
    certReturn: byId('certainty-return-slider'),
    certGammaOutput: byId('certainty-gamma-output'),
    certReturnOutput: byId('certainty-return-output'),
    certChart: byId('certainty-chart'),
    certNote: byId('certainty-chart-note'),
    certEquation: byId('certainty-equation-line'),
    certC1: byId('certainty-c1'),
    certC2: byId('certainty-c2'),
    certGrowth: byId('certainty-growth'),
    certSaving: byId('certainty-saving')
  };

  const readNumber = (value, fallback) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  };

  const P = {
    W1: readNumber(root.dataset.w1, 10),
    W: readNumber(root.dataset.w2, 10),
    beta: readNumber(root.dataset.beta, 1),
    r: readNumber(root.dataset.interestRate, 0)
  };
  const R = 1 + P.r;
  const BETA_R = P.beta * R;

  /* ---------- Model ---------- */

  const mu = (c, gamma) => Math.pow(c, -gamma);

  function allocation(A, epsilon, gamma) {
    const c1 = P.W1 - A;
    const meanC2 = R * A + P.W;
    const c2Low = meanC2 - epsilon;
    const c2High = meanC2 + epsilon;
    return {
      A,
      c1,
      meanC2,
      c2Low,
      c2High,
      muC1: mu(c1, gamma),
      muMean: mu(meanC2, gamma),
      expectedMU: 0.5 * mu(c2Low, gamma) + 0.5 * mu(c2High, gamma)
    };
  }

  /* Solve u'(c1) = β(1+r) E[u'(c2)] for A by bisection. The residual
     runs from -∞ (c2 low state → 0) to +∞ (c1 → 0), so a root exists. */
  function solveSaving(epsilon, gamma) {
    const residual = A => {
      const state = allocation(A, epsilon, gamma);
      return state.muC1 - BETA_R * state.expectedMU;
    };

    let left = (epsilon - P.W) / R + 1e-9;
    let right = P.W1 - 1e-9;
    if (!(residual(left) < 0 && residual(right) > 0)) {
      throw new Error('No interior solution exists for these parameter values.');
    }

    for (let step = 0; step < 200 && right - left > 1e-12; step += 1) {
      const middle = 0.5 * (left + right);
      if (residual(middle) < 0) left = middle;
      else right = middle;
    }
    return 0.5 * (left + right);
  }

  function solveModel(epsilon, gamma) {
    const certainty = allocation(solveSaving(0, gamma), 0, gamma);
    const fixedSaving = allocation(certainty.A, epsilon, gamma);
    const uncertainty = allocation(solveSaving(epsilon, gamma), epsilon, gamma);

    return {
      epsilon,
      gamma,
      certainty,
      fixedSaving,
      uncertainty,
      /* c1 that would satisfy the Euler equation if saving stayed fixed. */
      impliedC1: Math.pow(BETA_R * fixedSaving.expectedMU, -1 / gamma),
      precautionarySaving: uncertainty.A - certainty.A,
      relativeJensenGap: fixedSaving.expectedMU / fixedSaving.muMean - 1
    };
  }

  /* Section 1, no risk: u'(c1) = β(1+r) u'(c2) gives c2/c1 = [β(1+r)]^(1/γ).
     β stays at its data-* value, so moving β(1+r) moves the interest rate. */
  function solveCertainty(betaR, gamma) {
    const gross = betaR / P.beta;
    const growth = Math.pow(betaR, 1 / gamma);
    const wealth = P.W1 + P.W / gross;
    const c1 = wealth / (1 + growth / gross);
    const c2 = growth * c1;
    return { betaR, gamma, r: gross - 1, c1, c2, growth, A: P.W1 - c1 };
  }

  /* ---------- Formatting ---------- */

  const isZero = value => Math.abs(value) < 5e-7;

  function formatNumber(value, digits = 3) {
    if (!Number.isFinite(value)) return '—';
    return (isZero(value) ? 0 : value).toFixed(digits);
  }

  function formatSigned(value, digits = 3) {
    if (!Number.isFinite(value)) return '—';
    if (isZero(value)) return (0).toFixed(digits);
    return `${value > 0 ? '+' : '−'}${Math.abs(value).toFixed(digits)}`;
  }

  /* Marginal utilities can be tiny when γ is large: use significant figures. */
  function formatSmall(value, signed = false) {
    if (!Number.isFinite(value)) return '—';
    if (Math.abs(value) < 1e-15) return '0';
    const sign = signed ? (value > 0 ? '+' : '−') : (value < 0 ? '−' : '');
    const size = Math.abs(value);
    const text = size < 1e-3 ? size.toExponential(3) : size.toPrecision(4);
    return sign + text;
  }

  const formatPercent = value => (Number.isFinite(value)
    ? `${(100 * value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
    : '—');

  /* ---------- SVG helpers ---------- */

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const WIDTH = 560;
  const HEIGHT = 420;
  const MARGIN = { top: 36, right: 22, bottom: 78, left: 24 };

  /* Text scale set in uncertainty.css (larger on phones). */
  const textScale = () => readNumber(
    getComputedStyle(ui.partialChart).getPropertyValue('--chart-text-scale'), 1) || 1;

  function el(name, attributes = {}, text = '') {
    const node = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    if (text) node.textContent = text;
    return node;
  }

  /* Section 3: both charts share one consumption axis, so shifts can be compared.
     Each chart caps its vertical axis just above its own highest marked
     point; the curve is clipped beyond it, so steep curvature (large γ,
     large ε) does not flatten everything else. */
  function chartScales({ points, gamma, lowestMarked, width = WIDTH, height = HEIGHT, domain = null }) {
    const valid = points.filter(v => Number.isFinite(v) && v > 0);
    const low = Math.min(...valid);
    const high = Math.max(...valid);
    const pad = Math.max(1, 0.14 * (high - low));
    const xMin = domain ? domain[0] : Math.max(0.05, low - pad);
    const xMax = domain ? domain[1] : high + pad;
    const yMax = 1.22 * mu(lowestMarked, gamma);
    const axisY = height - MARGIN.bottom;
    const plotWidth = width - MARGIN.left - MARGIN.right;
    const plotHeight = axisY - MARGIN.top;

    return {
      width,
      height,
      axisY,
      xMin,
      xMax,
      x: value => MARGIN.left + (value - xMin) / (xMax - xMin) * plotWidth,
      y: value => axisY - Math.min(value, yMax * 1.05) / yMax * plotHeight,
      isVisible: value => value <= yMax
    };
  }

  function baseChart(id, scales, gamma) {
    const W = scales.width;
    const H = scales.height;
    const AXIS_Y = scales.axisY;
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, 'aria-hidden': 'true', focusable: 'false' });
    const defs = el('defs');
    const clip = el('clipPath', { id: `${id}-clip` });
    clip.appendChild(el('rect', {
      x: MARGIN.left, y: MARGIN.top - 4,
      width: W - MARGIN.left - MARGIN.right, height: AXIS_Y - MARGIN.top + 4
    }));
    const marker = el('marker', {
      id: `${id}-arrow`, viewBox: '0 0 10 10', refX: '9', refY: '5',
      markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse'
    });
    marker.appendChild(el('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'chart-arrowhead' }));
    defs.append(clip, marker);
    svg.appendChild(defs);

    svg.appendChild(el('line', { x1: MARGIN.left, y1: MARGIN.top - 10, x2: MARGIN.left, y2: AXIS_Y, class: 'chart-axis' }));
    svg.appendChild(el('line', { x1: MARGIN.left, y1: AXIS_Y, x2: W - MARGIN.right, y2: AXIS_Y, class: 'chart-axis' }));
    svg.appendChild(el('text', { x: W - MARGIN.right, y: H - 8, 'text-anchor': 'end', class: 'chart-axis-label' }, 'consumption, c'));
    svg.appendChild(el('text', { x: MARGIN.left + 6, y: MARGIN.top - 16, 'text-anchor': 'start', class: 'chart-axis-label' }, 'marginal utility, u′(c)'));

    let path = '';
    for (let i = 0; i <= 240; i += 1) {
      const c = scales.xMin + (scales.xMax - scales.xMin) * i / 240;
      path += `${i ? 'L' : 'M'}${scales.x(c).toFixed(2)} ${scales.y(mu(c, gamma)).toFixed(2)} `;
    }
    svg.appendChild(el('path', { d: path, class: 'chart-curve', 'clip-path': `url(#${id}-clip)` }));

    return {
      svg,
      axisY: AXIS_Y,
      arrowId: `${id}-arrow`,
      line(x1, y1, x2, y2, className, arrow = false) {
        const attributes = { x1, y1, x2, y2, class: className };
        if (arrow) attributes['marker-end'] = `url(#${id}-arrow)`;
        svg.appendChild(el('line', attributes));
      },
      point(x, y, className = 'chart-point', radius = 4.5) {
        svg.appendChild(el('circle', { cx: x, cy: y, r: radius, class: className }));
      },
      text(x, y, content, className, anchor = 'middle') {
        svg.appendChild(el('text', { x, y, 'text-anchor': anchor, class: className }, content));
      }
    };
  }

  /* Vertical guides from the axis to the curve, with labels under the axis.
     Guides at the same consumption share one label ("c₁ = E[c₂]");
     labels that would collide move down a row. */
  function drawGuides(chart, scales, gamma, guides) {
    const placed = guides
      .map(guide => ({ ...guide, x: scales.x(guide.c), y: scales.y(mu(guide.c, gamma)) }))
      .sort((a, b) => a.x - b.x);

    const groups = [];
    placed.forEach(guide => {
      const last = groups[groups.length - 1];
      if (last && Math.abs(last.x - guide.x) < 1) last.items.push(guide);
      else groups.push({ x: guide.x, y: guide.y, items: [guide] });
    });

    const k = textScale();
    const rowEnds = [];
    groups.forEach(group => {
      group.items.forEach(item => chart.line(item.x, chart.axisY, item.x, item.y, `chart-guide ${item.tone}`));
      chart.point(group.x, group.y);

      const label = group.items.map(item => item.label).join(' = ');
      const halfWidth = label.length * 4 * k;
      let row = rowEnds.findIndex(end => group.x - halfWidth > end + 6);
      if (row === -1) row = rowEnds.length;
      rowEnds[row] = group.x + halfWidth;
      const tone = group.items.length === 1 ? group.items[0].tone : '';
      chart.text(group.x, chart.axisY + (20 + row * 16) * k, label, `chart-label ${tone}`);
    });

    return Object.fromEntries(placed.map(guide => [guide.key, guide]));
  }

  /* Horizontal reference levels from the vertical axis to a point. The
     upper level is labelled above its line, the lower one below; labels
     are kept apart and inside the plot. */
  function drawLevels(chart, levels) {
    const k = textScale();
    const sorted = [...levels].sort((a, b) => a.y - b.y);
    let previous = -Infinity;
    sorted.forEach((level, index) => {
      chart.line(MARGIN.left, level.y, level.toX, level.y, `chart-guide ${level.tone}`);
      const wanted = index === 0 ? level.y - 7 : level.y + 15 * k;
      const y = Math.min(Math.max(wanted, previous + 13 * k, MARGIN.top + 8 * k), chart.axisY - 6);
      previous = y;
      chart.text(MARGIN.left + 6, y, level.label, `chart-label-small ${level.tone}`, 'start');
    });
  }

  /* Short arrow just above the axis showing how a consumption level moves. */
  function drawShift(chart, fromX, toX, row, label) {
    if (Math.abs(toX - fromX) < 14) return;
    const y = chart.axisY - (12 + row * 16) * textScale();
    const direction = Math.sign(toX - fromX);
    chart.line(fromX, y, toX - direction * 2, y, 'chart-guide is-ghost', true);
    if (label) chart.text((fromX + toX) / 2, y - 5, label, 'chart-label-small');
  }

  /* ---------- Charts ---------- */

  const uncertaintyPoints = model => {
    const { fixedSaving: f, uncertainty: u, certainty: c } = model;
    return [f.c2Low, f.c2High, f.meanC2, model.impliedC1, u.c2Low, u.c2High, u.meanC2, u.c1, c.c1];
  };

  /* Section 1. Fixed consumption range, so c1 and c2 visibly move. */
  function renderCertaintyChart(model) {
    const { gamma, c1, c2, betaR } = model;
    const wide = ui.certChart.clientWidth > 600;
    const scales = chartScales({
      points: [c1, c2], gamma, lowestMarked: Math.min(c1, c2),
      width: wide ? 980 : WIDTH, height: wide ? 380 : HEIGHT, domain: [7, 13.5]
    });
    const chart = baseChart('certainty', scales, gamma);
    const g = drawGuides(chart, scales, gamma, [
      { key: 'c1', c: c1, label: 'c₁', tone: 'is-current' },
      { key: 'c2', c: c2, label: 'c₂', tone: 'is-mean' }
    ]);

    const equal = Math.abs(g.c1.y - g.c2.y) < 0.5;
    drawLevels(chart, equal
      ? [{ y: g.c1.y, toX: g.c2.x, tone: 'is-current', label: 'u′(c₁) = u′(c₂)' }]
      : [
        { y: g.c1.y, toX: g.c1.x, tone: 'is-current', label: 'u′(c₁)' },
        { y: g.c2.y, toX: g.c2.x, tone: 'is-mean', label: 'u′(c₂)' }
      ]);

    ui.certEquation.textContent =
      `u′(c₁) / u′(c₂) = β(1+r) = ${betaR.toFixed(2)}   ⇒   c₂ / c₁ = ${model.growth.toFixed(3)}`;

    ui.certChart.replaceChildren(chart.svg);

    const note = betaR === 1
      ? `With β(1+r) = 1, the Euler equation requires u′(c₁) = u′(c₂), so consumption is perfectly smoothed: c₁ = c₂ = ${formatNumber(c1)}.`
      : `With β(1+r) = ${betaR.toFixed(2)} (r = ${formatPercent(model.r)}), marginal utility today must be ${betaR.toFixed(2)} times marginal utility tomorrow. Because u′ is decreasing, c₂ = ${formatNumber(c2)} lies above c₁ = ${formatNumber(c1)}. A higher γ makes u′ steeper, so a smaller consumption gap is enough.`;
    ui.certNote.textContent = note;
    ui.certChart.setAttribute('aria-label', `Marginal utility curve with the certainty Euler equation. ${note}`);

    ui.certC1.textContent = formatNumber(c1);
    ui.certC2.textContent = formatNumber(c2);
    ui.certGrowth.textContent = formatNumber(model.growth);
    ui.certSaving.textContent = formatSigned(model.A);
  }

  function renderPartialChart(model) {
    const { gamma, fixedSaving: s, certainty } = model;
    const scales = chartScales({ points: uncertaintyPoints(model), gamma, lowestMarked: Math.min(s.c2Low, model.impliedC1) });
    const chart = baseChart('partial', scales, gamma);
    const hasRisk = model.epsilon > 0;

    const guides = [
      { key: 'mean', c: s.meanC2, label: 'E[c₂]', tone: 'is-mean' },
      { key: 'c1', c: model.impliedC1, label: 'desired c₁', tone: 'is-current' }
    ];
    if (hasRisk) {
      guides.push(
        { key: 'low', c: s.c2Low, label: 'c₂ᴸ', tone: 'is-risk' },
        { key: 'high', c: s.c2High, label: 'c₂ᴴ', tone: 'is-risk' }
      );
    }
    const g = drawGuides(chart, scales, gamma, guides);
    const yEMU = scales.y(s.expectedMU);

    if (hasRisk) {
      chart.line(g.low.x, g.low.y, g.high.x, g.high.y, 'chart-chord');
      drawLevels(chart, [
        { y: yEMU, toX: g.mean.x, tone: 'is-current', label: 'E[u′(c₂)]' },
        { y: g.mean.y, toX: g.mean.x, tone: 'is-mean', label: 'u′(E[c₂])' }
      ]);
      chart.point(g.mean.x, yEMU, 'chart-point is-current');
      if (g.mean.y - yEMU > 18) {
        chart.text(g.mean.x + 8, (g.mean.y + yEMU) / 2 + 4, 'Jensen gap', 'chart-label-small', 'start');
      }
      drawShift(chart, scales.x(certainty.c1), g.c1.x, 0, 'c₁ falls');
    } else {
      drawLevels(chart, [{ y: yEMU, toX: g.mean.x, tone: 'is-current', label: 'E[u′(c₂)] = u′(E[c₂])' }]);
    }

    ui.partialChart.replaceChildren(chart.svg);

    const note = hasRisk
      ? `At fixed saving, E[c₂] stays at ${formatNumber(s.meanC2)}, but E[u′(c₂)] is ${formatPercent(model.relativeJensenGap)} above u′(E[c₂]). The Euler equation would then require c₁ to fall from ${formatNumber(certainty.c1)} to ${formatNumber(model.impliedC1)}.`
      : 'With no income spread, expected marginal utility equals marginal utility at expected consumption, so desired c₁ is unchanged.';
    ui.partialNote.textContent = note;
    ui.partialChart.setAttribute('aria-label', `Marginal utility before saving adjusts. ${note}`);
  }

  function renderEquilibriumChart(model) {
    const { gamma, fixedSaving: f, uncertainty: u, certainty } = model;
    const scales = chartScales({ points: uncertaintyPoints(model), gamma, lowestMarked: Math.min(u.c2Low, u.c1) });
    const chart = baseChart('equilibrium', scales, gamma);
    const hasRisk = model.epsilon > 0;

    /* Step 1 positions (hollow); a point above the plot is left out,
       the arrow on the axis still shows the shift. */
    if (hasRisk) {
      [f.c2Low, f.c2High].forEach(c => {
        if (scales.isVisible(mu(c, gamma))) chart.point(scales.x(c), scales.y(mu(c, gamma)), 'chart-point is-ghost');
      });
    }

    const guides = [
      { key: 'mean', c: u.meanC2, label: 'E[c₂*]', tone: 'is-mean' },
      { key: 'c1', c: u.c1, label: 'c₁*', tone: 'is-current' }
    ];
    if (hasRisk) {
      guides.push(
        { key: 'low', c: u.c2Low, label: 'c₂ᴸ*', tone: 'is-risk' },
        { key: 'high', c: u.c2High, label: 'c₂ᴴ*', tone: 'is-risk' }
      );
    }
    const g = drawGuides(chart, scales, gamma, guides);
    const yEMU = scales.y(u.expectedMU);
    const levelLabel = BETA_R === 1 ? 'u′(c₁*) = E[u′(c₂*)]' : 'E[u′(c₂*)]';

    if (hasRisk) {
      chart.line(g.low.x, g.low.y, g.high.x, g.high.y, 'chart-chord');
      drawLevels(chart, [
        { y: yEMU, toX: g.mean.x, tone: 'is-current', label: levelLabel },
        { y: g.mean.y, toX: g.mean.x, tone: 'is-mean', label: 'u′(E[c₂*])' }
      ]);
      chart.point(g.mean.x, yEMU, 'chart-point is-current', 5);
      drawShift(chart, scales.x(f.c2Low), g.low.x, 0, 'A ↑');
      drawShift(chart, scales.x(f.c2High), g.high.x, 0, 'A ↑');
      drawShift(chart, scales.x(certainty.c1), g.c1.x, 1, 'c₁ ↓');
    } else {
      drawLevels(chart, [{ y: yEMU, toX: g.mean.x, tone: 'is-current', label: levelLabel }]);
    }

    ui.equilibriumChart.replaceChildren(chart.svg);

    const note = hasRisk
      ? `Saving rises by ${formatNumber(model.precautionarySaving)}, so c₁ falls to ${formatNumber(u.c1)} and both future states rise by ${formatNumber(R * model.precautionarySaving)} relative to Step 1 (hollow points).`
      : 'The certainty and uncertainty allocations coincide when ε = 0.';
    ui.equilibriumNote.textContent = note;
    ui.equilibriumChart.setAttribute('aria-label', `Marginal utility after saving adjusts. ${note}`);
  }

  /* ---------- Table, summary, equation highlighting ---------- */

  function renderTable(model) {
    const c = model.certainty;
    const u = model.uncertainty;
    const rows = [
      { label: 'Current consumption, c₁', a: c.c1, b: u.c1 },
      { label: 'Saving, A (change = precautionary saving)', a: c.A, b: u.A, highlight: true },
      { label: 'Low-state consumption, c₂ᴸ', a: c.c2Low, b: u.c2Low },
      { label: 'High-state consumption, c₂ᴴ', a: c.c2High, b: u.c2High },
      { label: 'Expected future consumption, E[c₂]', a: c.meanC2, b: u.meanC2 },
      { label: 'Current marginal utility, u′(c₁)', a: c.muC1, b: u.muC1, small: true },
      { label: 'Expected marginal utility, E[u′(c₂)]', a: c.expectedMU, b: u.expectedMU, small: true }
    ];

    ui.table.replaceChildren(...rows.map(row => {
      const change = row.b - row.a;
      const tr = document.createElement('tr');
      if (row.highlight) tr.className = 'is-highlight';
      const cells = row.small
        ? [row.label, formatSmall(row.a), formatSmall(row.b), formatSmall(change, true)]
        : [row.label, formatNumber(row.a), formatNumber(row.b), formatSigned(change)];
      cells.forEach((text, index) => {
        const td = document.createElement('td');
        td.textContent = text;
        const significant = row.small
          ? Math.abs(change) > 1e-6 * Math.abs(row.a)
          : !isZero(change);
        if (index === 3 && significant) {
          td.className = change > 0 ? 'value-positive' : 'value-negative';
        }
        tr.appendChild(td);
      });
      return tr;
    }));
  }

  function renderSummary(model) {
    ui.jensenGap.textContent = formatPercent(model.relativeJensenGap);
    ui.saving.textContent = formatSigned(model.precautionarySaving);
    ui.consumptionChange.textContent = formatSigned(model.uncertainty.c1 - model.certainty.c1);

    if (model.epsilon === 0) {
      ui.takeaway.innerHTML = '<strong>No uncertainty:</strong> the two future states coincide, the Jensen gap is zero, and there is no precautionary saving.';
      return;
    }

    ui.takeaway.innerHTML = `
      <strong>Precautionary saving:</strong>
      the mean-preserving income risk raises expected marginal utility. The household increases saving by
      <strong>${formatNumber(model.precautionarySaving)}</strong>, reduces current consumption by
      <strong>${formatNumber(model.certainty.c1 - model.uncertainty.c1)}</strong>, and raises expected future consumption by
      <strong>${formatNumber(model.uncertainty.meanC2 - model.certainty.meanC2)}</strong>.`;
  }

  function renderEquationCases(hasRisk) {
    ui.certaintyCase.classList.toggle('is-active', !hasRisk);
    ui.certaintyCase.classList.toggle('is-muted', hasRisk);
    ui.uncertaintyCase.classList.toggle('is-active', hasRisk);
    ui.uncertaintyCase.classList.toggle('is-muted', !hasRisk);
    ui.certaintyStatus.textContent = hasRisk ? 'Inactive because ε > 0' : 'Active because ε = 0';
    ui.uncertaintyStatus.textContent = hasRisk ? 'Active because ε > 0' : 'Inactive because ε = 0';
  }

  /* ---------- Update loop ---------- */

  function render() {
    const epsilon = Number(ui.epsilon.value);
    const gamma = Number(ui.gamma.value);
    ui.epsilonOutput.value = epsilon.toFixed(1);
    ui.gammaOutput.value = gamma.toFixed(1);
    renderEquationCases(epsilon > 0);

    try {
      const model = solveModel(epsilon, gamma);
      renderPartialChart(model);
      renderEquilibriumChart(model);
      renderTable(model);
      renderSummary(model);
    } catch (error) {
      console.error('Uncertainty model could not be solved:', error);
      ui.takeaway.textContent = `The model could not be solved: ${error.message}`;
    }
  }

  function renderCertainty() {
    const gamma = Number(ui.certGamma.value);
    const betaR = Number(ui.certReturn.value);
    ui.certGammaOutput.value = gamma.toFixed(1);
    ui.certReturnOutput.value = betaR.toFixed(2);
    renderCertaintyChart(solveCertainty(betaR, gamma));
  }

  /* Redraw at most once per frame while a slider moves. */
  function throttled(callback) {
    let frame = 0;
    return () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(callback);
    };
  }

  const scheduleRender = throttled(render);
  const scheduleCertainty = throttled(renderCertainty);

  ui.epsilon.addEventListener('input', scheduleRender);
  ui.gamma.addEventListener('input', scheduleRender);
  ui.certGamma.addEventListener('input', scheduleCertainty);
  ui.certReturn.addEventListener('input', scheduleCertainty);

  /* The certainty chart is wider on large screens; text size changes on phones. */
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { renderCertainty(); render(); }, 150);
  });

  renderCertainty();
  render();
})();
