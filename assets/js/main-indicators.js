/* =========================================================
   main-indicators.js: /economics/main-indicators.html
   Loads the generated main-indicators JSON for the selected
   country and draws one chart per card. Each card lists its
   indicators in data-indicators. Level series can show a trend
   (HP, Hamilton, Christiano–Fitzgerald or all three), chosen
   with one page-level switch. Uses AGDashboards and AGSite.
   ========================================================= */
(() => {
  'use strict';

  const D = window.AGDashboards;
  const S = window.AGSite;
  const body = document.querySelector('[data-dashboard="main-indicators"]');
  if (!body || !D || !S) return;

  /* Trend lines: field in the JSON, label, colour token, dash. */
  const TRENDS = {
    hp: { field: 'hp_trend', label: 'HP trend', color: '--chart-2', dash: '6 4' },
    hamilton: { field: 'hamilton_trend', label: 'Hamilton trend', color: '--chart-3', dash: '1.5 3.5' },
    cf: { field: 'cf_trend', label: 'Christiano–Fitzgerald trend', color: '--chart-4', dash: '9 3 2 3' },
  };
  const TREND_NAMES = { none: 'no trend', hp: 'HP trend', hamilton: 'Hamilton trend', cf: 'Christiano–Fitzgerald trend', comparison: 'trend comparison' };
  /* Colours for cards that show several indicators (e.g. two interest rates). */
  const MULTI = [
    { color: '--chart-1', dash: null },
    { color: '--chart-2', dash: '6 4' },
  ];

  const el = {
    downloads: body.querySelector('[data-role="downloads"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    pageStatus: body.querySelector('[data-role="page-status"]'),
  };
  const cards = Array.from(body.querySelectorAll('[data-indicators]'));
  const state = { country: 'US', trend: 'none', payload: null, charts: new Map(), visible: new Set(), basis: new Map() };
  const cache = new Map();

  D.segmented(body.querySelector('[data-control="country"]'), value => {
    state.country = value;
    load();
  });
  const trendControl = D.segmented(body.querySelector('[data-control="trend"]'), value => {
    state.trend = value;
    cards.forEach(card => { if (state.visible.has(card)) renderCard(card); });
  });

  /* Card-level switch for real interest rates: annual rate or per quarter. */
  cards.forEach(card => {
    const field = card.querySelector('[data-control="rate-basis"]');
    if (!field) return;
    state.basis.set(card, 'annual');
    D.segmented(field, value => {
      state.basis.set(card, value);
      if (state.visible.has(card)) renderCard(card);
    }).select('annual', false);
  });

  function token(name) {
    return getComputedStyle(body).getPropertyValue(name).trim() || '#3b5a75';
  }

  async function fetchCountry(code) {
    if (cache.has(code)) return cache.get(code);
    const url = body.dataset.dataUrl.replace('{country}', code.toLowerCase());
    const response = await S.fetchFresh(url);
    const payload = await response.json();
    if (!payload || !payload.indicators) throw new Error('The data file does not contain any indicators.');
    cache.set(code, payload);
    return payload;
  }

  /* Several indicators on one chart: align them on the union of their dates. */
  function align(indicators) {
    const dates = Array.from(new Set(indicators.flatMap(item => item.observations.date))).sort();
    const position = new Map(dates.map((date, i) => [date, i]));
    const pick = (item, field) => {
      const values = new Array(dates.length).fill(null);
      item.observations.date.forEach((date, i) => { values[position.get(date)] = item.observations[field][i]; });
      return values;
    };
    return { dates, pick };
  }

  function cardElements(card) {
    return {
      subtitle: card.querySelector('[data-role="chart-subtitle"]'),
      status: card.querySelector('[data-role="chart-status"]'),
      frame: card.querySelector('[data-role="chart-frame"]'),
      legend: card.querySelector('[data-role="chart-legend"]'),
      readout: card.querySelector('[data-role="chart-readout"]'),
      source: card.querySelector('[data-role="chart-source"]'),
      note: card.querySelector('[data-role="trend-note"]'),
    };
  }

  function renderCard(card) {
    const parts = cardElements(card);
    const ids = card.dataset.indicators.split(',').map(id => id.trim());
    const indicators = ids.map(id => state.payload.indicators[id]).filter(Boolean);

    if (!indicators.length) {
      parts.frame.hidden = true;
      parts.legend.hidden = true;
      parts.status.hidden = false;
      parts.status.className = 'empty-message';
      parts.status.textContent = 'No data are available for this chart.';
      return;
    }

    const { dates, pick: pickRaw } = align(indicators);
    const quarterly = state.basis.get(card) === 'quarterly';
    const pick = (item, field) => {
      const values = pickRaw(item, field);
      return quarterly ? values.map(v => (v == null ? null : v / 4)) : values;
    };
    const single = indicators.length === 1;
    const first = indicators[0];
    const series = indicators.map((item, i) => {
      const flags = pickRaw(item, 'estimated');
      return {
        label: single ? first.short_title : item.short_title,
        color: token(single ? '--chart-1' : MULTI[i % MULTI.length].color),
        dash: single ? null : MULTI[i % MULTI.length].dash,
        values: pick(item, 'value'),
        marks: flags.map((flag, j) => (flag ? j : -1)).filter(j => j >= 0),
      };
    });
    const anyEstimate = series.some(item => item.marks.length);

    /* Trends only apply to one level series per chart. */
    const trendable = single && first.kind === 'level';
    if (trendable && state.trend !== 'none') {
      const keys = state.trend === 'comparison' ? ['hp', 'hamilton', 'cf'] : [state.trend];
      keys.forEach(key => series.push({
        label: TRENDS[key].label,
        color: token(TRENDS[key].color),
        dash: TRENDS[key].dash,
        values: pick(first, TRENDS[key].field),
      }));
    }
    parts.note.hidden = trendable || state.trend === 'none';

    const monthly = indicators.every(item => item.frequency === 'Monthly');
    const start = dates[0];
    const end = dates[dates.length - 1];
    const label = monthly ? D.monthLabel : D.quarterLabel;
    const trendText = trendable && state.trend !== 'none' ? ` · ${TREND_NAMES[state.trend]}` : '';
    const units = quarterly ? 'Percent per quarter (annual rate ÷ 4)' : first.units;
    parts.subtitle.textContent = `${units}${single ? ` · ${first.frequency.toLowerCase()}` : ''}${trendText} · ${label(start)}–${label(end)}`;

    const prev = state.charts.get(card);
    if (prev) prev.destroy();
    parts.status.hidden = true;
    parts.frame.hidden = false;
    state.charts.set(card, D.lineChart(parts.frame, {
      dates,
      series,
      period: monthly ? 1 / 12 : 0.25,
      recessions: state.payload.recessions ? state.payload.recessions.intervals : [],
      zeroLine: card.dataset.zeroLine === 'true' ? true : 'auto',
      digits: Number(card.dataset.digits || 2),
      readout: parts.readout,
      label: `${card.querySelector('.chart-title').textContent}, ${state.payload.country.name}, ${label(start)} to ${label(end)}, with recessions shaded`,
    }));

    parts.legend.innerHTML = series.map(item => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${item.color}" stroke-width="2.2"
          stroke-dasharray="${item.dash || 'none'}" stroke-linecap="round"/></svg>${S.escapeHTML(item.label)}</li>`).join('')
      + (anyEstimate ? '<li><span class="legend-estimate" aria-hidden="true"></span>Estimated value (see Missing data)</li>' : '')
      + '<li><span class="legend-band" aria-hidden="true"></span>Recession (NBER-based)</li>';
    parts.legend.hidden = false;
    parts.readout.textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';

    const sources = Array.from(new Set(indicators.map(item => item.source)));
    const updated = indicators.map(item => item.source_last_updated).filter(Boolean).sort().pop();
    const estimated = indicators.flatMap(item => (item.estimates || []).map(record =>
      `${record.series_id} ${record.date.slice(0, 7)}`));
    parts.source.textContent = `Source: ${sources.join('; ')}.${updated ? ` Source last updated ${updated.slice(0, 10)}.` : ''}`
      + (estimated.length ? ` Includes values estimated by the author where the source published none (${Array.from(new Set(estimated)).join('; ')}); see Missing data and estimates.` : '');
  }

  /* Charts are drawn when their card first approaches the viewport. */
  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || !state.payload) return;
        state.visible.add(entry.target);
        renderCard(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '300px 0px' })
    : null;

  /* Bottom-of-page list of every estimated source value. */
  function renderEstimates() {
    const target = body.querySelector('[data-role="estimates"]');
    if (!target) return;
    const seen = new Map();
    Object.values(state.payload.indicators).forEach(item => (item.estimates || []).forEach(record => {
      const key = `${record.series_id}|${record.date}`;
      if (!seen.has(key)) seen.set(key, { ...record, used: [] });
      seen.get(key).used.push(item.short_title);
    }));
    if (!seen.size) {
      target.innerHTML = '<p>No values are currently estimated: every period shown was published by the source.</p>';
      return;
    }
    const rows = Array.from(seen.values()).sort((a, b) => a.date.localeCompare(b.date)).map(record => `
      <tr>
        <td>${S.escapeHTML(record.series_id)}</td>
        <td>${S.escapeHTML(record.date.slice(0, 7))}</td>
        <td>${S.escapeHTML(D.formatNumber(record.value, 2))}</td>
        <td>${S.escapeHTML(record.reason)}</td>
        <td>${S.escapeHTML(record.method)}</td>
        <td>${S.escapeHTML(Array.from(new Set(record.used)).join(', '))}</td>
      </tr>`).join('');
    target.innerHTML = `<div class="table-scroll"><table class="estimates-table">
      <caption class="visually-hidden">Source values estimated by the author</caption>
      <thead><tr><th scope="col">Series</th><th scope="col">Period</th><th scope="col">Estimate</th>
      <th scope="col">Why it is missing</th><th scope="col">Method</th><th scope="col">Used in</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  }

  function updateDownloads() {
    const links = state.payload.downloads;
    if (!links) { el.downloads.hidden = true; return; }
    el.downloads.querySelectorAll('[data-download]').forEach(link => {
      const path = links[link.dataset.download];
      link.hidden = !path;
      if (path) link.href = D.siteUrl(body.dataset.siteBase, path);
    });
    el.downloads.hidden = false;
    if (state.payload.generated_at_utc) {
      el.updateNote.textContent = `Data updated on ${new Date(state.payload.generated_at_utc).toLocaleDateString('en-GB')}`;
      el.updateNote.hidden = false;
    }
  }

  async function load() {
    try {
      state.payload = await fetchCountry(state.country);
      el.pageStatus.hidden = true;
      updateDownloads();
      renderEstimates();
      state.visible.clear();
      cards.forEach(card => {
        if (observer) observer.observe(card);
        else { state.visible.add(card); renderCard(card); }
      });
    } catch (error) {
      el.pageStatus.hidden = false;
      el.pageStatus.className = 'render-error';
      el.pageStatus.innerHTML = '<span class="render-error-title">The data could not be loaded.</span>'
        + 'Please try again later. If the problem persists, please let me know.'
        + `<span class="render-error-message">${S.escapeHTML(error.message)}</span>`;
      cards.forEach(card => {
        const status = card.querySelector('[data-role="chart-status"]');
        status.textContent = 'Data unavailable.';
      });
    } finally {
      S.releaseReveal();
    }
  }

  trendControl.select('none', false);
  load();
})();
