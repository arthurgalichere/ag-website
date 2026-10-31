/* Last edited: 2026-10-31 20:25 UTC (Claude, economics chat) */
/* =========================================================
   dashboards.js: shared tools for the economics dashboards
   (business-cycles, main-indicators, ...). Dependency-free.

   Exposes window.AGDashboards with:
   - segmented(fieldElement, onChange): accessible button groups
   - lineChart(frame, options): responsive SVG time-series chart
     with recession bands, zero line, hover and keyboard readout
   - helpers for dates, numbers and data paths
   Page scripts (e.g. business-cycles.js) load after this file.
   ========================================================= */
window.AGDashboards = (() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* ---------- Dates and numbers ---------- */

  /* '1972-04-01' -> 1972.25 (start of the period as a decimal year). */
  function decimalYear(isoDate) {
    const [year, month] = isoDate.split('-').map(Number);
    return year + (month - 1) / 12;
  }

  /* '1972-04-01' -> '1972 Q2' */
  function quarterLabel(isoDate) {
    const [year, month] = isoDate.split('-').map(Number);
    return `${year} Q${Math.floor((month - 1) / 3) + 1}`;
  }

  /* '1972-04-01' -> 'Apr 1972' */
  function monthLabel(isoDate) {
    const [year, month] = isoDate.split('-').map(Number);
    const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${names[month - 1]} ${year}`;
  }

  /* '1972-01-01' -> '1972' (annual data) */
  function yearLabel(isoDate) {
    return isoDate.slice(0, 4);
  }

  function formatNumber(value, digits = 2) {
    if (value == null || !Number.isFinite(value)) return '–';
    return value.toLocaleString('en-GB', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).replace('-', '−');
  }

  /* Round axis ticks: 1, 2, 2.5 or 5 times a power of ten. */
  function niceStep(range, targetTicks) {
    const raw = range / Math.max(1, targetTicks);
    const power = 10 ** Math.floor(Math.log10(raw));
    const fraction = raw / power;
    const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
    return nice * power;
  }

  /* Decimals needed to show every tick exactly (0.25 -> 2, 0.5 -> 1, 5 -> 0). */
  function stepDecimals(step) {
    for (let d = 0; d < 5; d += 1) {
      const scaled = step * 10 ** d;
      if (Math.abs(scaled - Math.round(scaled)) < 1e-9) return d;
    }
    return 4;
  }

  function ticks(min, max, step) {
    const values = [];
    const first = Math.ceil(min / step) * step;
    for (let value = first; value <= max + step * 1e-9; value += step) {
      values.push(Math.abs(value) < step * 1e-9 ? 0 : value);
    }
    return values;
  }

  /* Resolve a site-relative path ('downloads/...') against the site base. */
  function siteUrl(base, path) {
    return `${base.replace(/\/$/, '')}/${String(path).replace(/^\//, '')}`;
  }

  /* ---------- Segmented control ---------- */

  /* Native buttons with aria-pressed; arrow keys move between options. */
  function segmented(field, onChange) {
    const buttons = Array.from(field.querySelectorAll('button[data-value]'));

    function value() {
      const pressed = buttons.find(button => button.getAttribute('aria-pressed') === 'true');
      return pressed ? pressed.dataset.value : null;
    }

    function select(newValue, notify = true) {
      const target = buttons.find(button => button.dataset.value === newValue);
      if (!target || target.getAttribute('aria-disabled') === 'true') return false;
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button === target)));
      if (notify) onChange(newValue);
      return true;
    }

    /* Disabled options stay visible and focusable so their reason can be read. */
    function setDisabled(optionValue, disabled, reason = '') {
      const button = buttons.find(item => item.dataset.value === optionValue);
      if (!button) return;
      button.setAttribute('aria-disabled', String(disabled));
      if (disabled && reason) button.title = reason;
      else button.removeAttribute('title');
    }

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => select(button.dataset.value));
      button.addEventListener('keydown', event => {
        const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
        if (!step) return;
        event.preventDefault();
        buttons[(index + step + buttons.length) % buttons.length].focus();
      });
    });

    return { value, select, setDisabled };
  }

  /* ---------- SVG line chart ---------- */

  function svg(name, attributes = {}, parent = null) {
    const element = document.createElementNS(SVG_NS, name);
    Object.entries(attributes).forEach(([key, val]) => element.setAttribute(key, val));
    if (parent) parent.appendChild(element);
    return element;
  }

  function cssVar(element, name, fallback) {
    return getComputedStyle(element).getPropertyValue(name).trim() || fallback;
  }

  /*
    options = {
      dates: ['1947-01-01', ...],
      series: [{ key, label, values: [number|null], color, dash }],
      recessions: [{ start, end_exclusive }],
      period: 1 (annual), 0.25 (quarterly) or 1/12 (monthly), in years,
      digits: 2,
      zeroLine: true,
      readout: element for the text readout (aria-live),
      label: accessible description of the chart
    }
  */
  function lineChart(frame, options) {
    const state = { options, index: null };
    const xs = options.dates.map(decimalYear);
    const period = options.period || 0.25;
    const labelDate = period >= 1 ? yearLabel : period < 0.2 ? monthLabel : quarterLabel;

    frame.textContent = '';
    frame.setAttribute('tabindex', '0');
    frame.setAttribute('role', 'group');
    frame.setAttribute('aria-roledescription', 'interactive chart');
    frame.setAttribute('aria-label', `${options.label}. Use the left and right arrow keys to read values by quarter.`);

    const root = svg('svg', { class: 'chart-svg', 'aria-hidden': 'true', focusable: 'false' }, frame);

    function draw() {
      const width = Math.max(280, frame.clientWidth);
      const height = Math.round(Math.min(440, Math.max(260, width * 0.48)));
      const compact = width < 560;
      const maxAbs = Math.max(...options.series.flatMap(item => item.values.filter(Number.isFinite).map(Math.abs)));
      const labelChars = formatNumber(maxAbs, 0).length;
      const margin = { top: 14, right: compact ? 10 : 18, bottom: 30, left: Math.max(compact ? 38 : 48, 14 + labelChars * (compact ? 6.2 : 7)) };
      const plotW = width - margin.left - margin.right;
      const plotH = height - margin.top - margin.bottom;

      root.setAttribute('viewBox', `0 0 ${width} ${height}`);
      root.setAttribute('width', width);
      root.setAttribute('height', height);
      root.textContent = '';

      const visible = options.series.flatMap(item => item.values.filter(Number.isFinite));
      let yMin = Math.min(...visible);
      let yMax = Math.max(...visible);
      if (options.zeroLine === true) {
        yMin = Math.min(yMin, 0);
        yMax = Math.max(yMax, 0);
      }
      const yStep = niceStep(yMax - yMin || 1, compact ? 5 : 7);
      yMin = Math.floor(yMin / yStep) * yStep;
      yMax = Math.ceil(yMax / yStep) * yStep;

      const xMin = xs[0];
      const xMax = xs[xs.length - 1] + period;
      const x = value => margin.left + ((value - xMin) / (xMax - xMin)) * plotW;
      const y = value => margin.top + ((yMax - value) / (yMax - yMin)) * plotH;

      const ink = cssVar(frame, '--chart-ink', '#3a3a3c');
      const grid = cssVar(frame, '--chart-grid', 'rgba(28,28,30,0.08)');
      const zero = cssVar(frame, '--chart-zero', 'rgba(28,28,30,0.45)');
      const band = cssVar(frame, '--chart-recession', 'rgba(59,90,117,0.12)');

      /* Recession bands: drawn first so the data stay on top. */
      const bands = svg('g', { class: 'chart-recessions' }, root);
      (options.recessions || []).forEach(interval => {
        const start = Math.max(xMin, decimalYear(interval.start));
        const end = Math.min(xMax, decimalYear(interval.end_exclusive));
        if (end <= start) return;
        svg('rect', {
          x: x(start), y: margin.top, width: Math.max(1, x(end) - x(start)), height: plotH, fill: band,
        }, bands);
      });

      /* Horizontal grid and y labels. */
      const axis = svg('g', { class: 'chart-axis', 'font-size': compact ? 10 : 11, fill: ink }, root);
      ticks(yMin, yMax, yStep).forEach(value => {
        const isZero = value === 0 && Boolean(options.zeroLine);
        svg('line', {
          x1: margin.left, x2: margin.left + plotW, y1: y(value), y2: y(value),
          stroke: isZero ? zero : grid, 'stroke-width': isZero ? 1.2 : 1,
        }, axis);
        const text = svg('text', { x: margin.left - 6, y: y(value) + 3.5, 'text-anchor': 'end' }, axis);
        text.textContent = formatNumber(value, stepDecimals(yStep));
      });

      /* Year ticks on the x axis. */
      const span = xMax - xMin;
      const yearStep = span / (plotW / (compact ? 70 : 80)) > 10 ? 20 : span / (plotW / (compact ? 70 : 80)) > 5 ? 10 : 5;
      ticks(Math.ceil(xMin), Math.floor(xMax), yearStep).forEach(year => {
        svg('line', {
          x1: x(year), x2: x(year), y1: margin.top + plotH, y2: margin.top + plotH + 4, stroke: zero,
        }, axis);
        const text = svg('text', { x: x(year), y: margin.top + plotH + 17, 'text-anchor': 'middle' }, axis);
        text.textContent = String(year);
      });
      svg('line', {
        x1: margin.left, x2: margin.left + plotW, y1: margin.top + plotH, y2: margin.top + plotH, stroke: zero,
      }, axis);

      /* Series: missing values break the line instead of being joined. */
      const lines = svg('g', { class: 'chart-lines', fill: 'none' }, root);
      options.series.forEach(item => {
        let path = '';
        let pen = false;
        item.values.forEach((value, i) => {
          if (!Number.isFinite(value)) { pen = false; return; }
          path += `${pen ? 'L' : 'M'}${x(xs[i] + period / 2).toFixed(1)},${y(value).toFixed(1)}`;
          pen = true;
        });
        const width = (compact ? 1.5 : 1.8) * (item.weight || 1);
        svg('path', {
          d: path, stroke: item.color, 'stroke-width': width, 'stroke-opacity': item.opacity ?? 1,
          'stroke-dasharray': item.dash || 'none', 'stroke-linejoin': 'round', 'stroke-linecap': 'round',
        }, lines);
        /* Hollow markers for values estimated by the author (item.marks: indices). */
        (item.marks || []).forEach(i => {
          if (!Number.isFinite(item.values[i])) return;
          svg('circle', {
            class: 'chart-estimate', cx: x(xs[i] + period / 2), cy: y(item.values[i]), r: compact ? 3.5 : 4.2,
            fill: '#ffffff', stroke: item.color, 'stroke-width': 1.8,
          }, lines);
        });
      });

      /* Hover marker. */
      const marker = svg('g', { class: 'chart-marker', visibility: 'hidden' }, root);
      const markerLine = svg('line', { y1: margin.top, y2: margin.top + plotH, stroke: zero, 'stroke-dasharray': '3 3' }, marker);
      const dots = options.series.map(item => svg('circle', { r: 3.5, fill: item.color, stroke: '#fff', 'stroke-width': 1.5 }, marker));

      state.geometry = { x, y, margin, plotW };
      state.marker = { group: marker, line: markerLine, dots };
      if (state.index != null) showIndex(state.index, false);
    }

    function showIndex(index, announce = true) {
      if (index == null) {
        state.marker.group.setAttribute('visibility', 'hidden');
        return;
      }
      state.index = Math.max(0, Math.min(xs.length - 1, index));
      const { x, y } = state.geometry;
      const px = x(xs[state.index] + period / 2);
      state.marker.group.setAttribute('visibility', 'visible');
      state.marker.line.setAttribute('x1', px);
      state.marker.line.setAttribute('x2', px);
      options.series.forEach((item, i) => {
        const value = item.values[state.index];
        const dot = state.marker.dots[i];
        if (Number.isFinite(value)) {
          dot.setAttribute('visibility', 'visible');
          dot.setAttribute('cx', px);
          dot.setAttribute('cy', y(value));
        } else {
          dot.setAttribute('visibility', 'hidden');
        }
      });
      if (options.readout && announce !== null) {
        const parts = options.series.map(item => `${item.label}: ${formatNumber(item.values[state.index], options.digits ?? 2)}${(item.marks || []).includes(state.index) ? ' (estimated)' : ''}`);
        options.readout.textContent = `${labelDate(options.dates[state.index])} · ${parts.join(' · ')}`;
      }
    }

    function indexFromPointer(event) {
      const rect = root.getBoundingClientRect();
      const { margin, plotW } = state.geometry;
      const scale = rect.width / root.viewBox.baseVal.width;
      const px = (event.clientX - rect.left) / scale;
      const fraction = (px - margin.left) / plotW;
      return Math.round(fraction * (xs.length - 0.5) - 0.5);
    }

    root.addEventListener('pointermove', event => showIndex(indexFromPointer(event)));
    root.addEventListener('pointerleave', () => {
      if (document.activeElement !== frame) showIndex(null);
    });

    frame.addEventListener('keydown', event => {
      const moves = { ArrowRight: 1, ArrowLeft: -1, PageUp: 4, PageDown: -4 };
      let next = null;
      if (event.key in moves) next = (state.index ?? xs.length - 1) + moves[event.key];
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = xs.length - 1;
      if (next == null) return;
      event.preventDefault();
      showIndex(next);
    });
    frame.addEventListener('focus', () => showIndex(state.index ?? xs.length - 1));
    frame.addEventListener('blur', () => showIndex(null));

    let resizeTimer = null;
    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(draw, 80);
    });
    observer.observe(frame);
    draw();

    return {
      destroy() { observer.disconnect(); frame.textContent = ''; },
    };
  }

  return { decimalYear, quarterLabel, monthLabel, yearLabel, formatNumber, siteUrl, segmented, lineChart };
})();
