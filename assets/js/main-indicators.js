/* Last edited: 2026-10-31 19:59 UTC (Claude, economics chat) */
/* =========================================================
   main-indicators.js: /economics/main-indicators.html
   Loads the generated main-indicators JSON for the selected
   country and draws one chart per card. A card lists its
   indicators in data-indicators and may also carry:
     data-per-capita  per-capita indicator ids (switch on the card)
     data-mode=index  rebase each series to 2017 = 100
     data-rate-basis  annual / quarterly switch (real rates)
     data-trends=off  no trends on this chart
     data-benchmark   the first indicator is the aggregate (GDP,
                      consumption, investment): site blue, thicker line
   Sections may carry shares and growth tables (data-table = gdp,
   consumption or investment).
   One page-level switch adds an HP or Christiano–Fitzgerald
   trend to every single-series chart.
   Uses AGDashboards (dashboards.js) and AGSite (site.js).
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
    cf: { field: 'cf_trend', label: 'Christiano–Fitzgerald trend', color: '--chart-3', dash: '1.5 3.5' },
  };
  const TREND_NAMES = { none: 'no trend', hp: 'HP trend', cf: 'Christiano–Fitzgerald trend', comparison: 'trend comparison' };
  /* Several series of equal importance: equal-weight colours, solid lines;
     the site accent (--chart-1) is kept for single-series charts. */
  const MULTI = ['--series-1', '--series-2', '--series-3', '--series-4'];
  /* Composition charts: the aggregate is drawn in the site blue, thicker. */
  const BENCHMARK_WEIGHT = 1.5;

  const el = {
    downloads: body.querySelector('[data-role="downloads"]'),
    updateNote: body.querySelector('[data-role="update-note"]'),
    pageStatus: body.querySelector('[data-role="page-status"]'),
  };
  const cards = Array.from(body.querySelectorAll('[data-indicators]'));
  const state = {
    country: 'US', trend: 'none', payload: null,
    charts: new Map(), visible: new Set(), basis: new Map(), perCapita: new Map(),
  };
  const cache = new Map();

  D.segmented(body.querySelector('[data-control="country"]'), value => {
    state.country = value;
    load();
  });
  const trendControl = D.segmented(body.querySelector('[data-control="trend"]'), value => {
    state.trend = value;
    cards.forEach(card => { if (state.visible.has(card)) renderCard(card); });
  });

  /* Card-level switches: rate basis (real rates) and per-capita measures. */
  cards.forEach(card => {
    const basis = card.querySelector('[data-control="rate-basis"]');
    if (basis) {
      state.basis.set(card, 'annual');
      D.segmented(basis, value => {
        state.basis.set(card, value);
        if (state.visible.has(card)) renderCard(card);
      }).select('annual', false);
    }
    const measure = card.querySelector('[data-control="measure"]');
    if (measure) {
      state.perCapita.set(card, false);
      D.segmented(measure, value => {
        state.perCapita.set(card, value === 'per-capita');
        if (state.visible.has(card)) renderCard(card);
      }).select('total', false);
    }
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
      const source = item.observations[field] || [];
      item.observations.date.forEach((date, i) => { values[position.get(date)] = source[i] ?? null; });
      return values;
    };
    return { dates, pick };
  }

  /* Rebase a series to its 2017 average = 100. */
  function rebase(dates, values) {
    const base = dates.map((date, i) => (date.startsWith('2017') ? values[i] : null)).filter(Number.isFinite);
    if (!base.length) return values;
    const mean = base.reduce((a, b) => a + b, 0) / base.length;
    return values.map(v => (v == null ? null : (v / mean) * 100));
  }

  function cardElements(card) {
    const role = name => card.querySelector(`[data-role="${name}"]`);
    return {
      subtitle: role('chart-subtitle'), status: role('chart-status'), frame: role('chart-frame'),
      legend: role('chart-legend'), readout: role('chart-readout'), source: role('chart-source'),
      note: role('trend-note'),
    };
  }

  function renderCard(card) {
    const parts = cardElements(card);
    const perCapita = state.perCapita.get(card) === true;
    const idList = (perCapita ? card.dataset.perCapita : card.dataset.indicators).split(',').map(id => id.trim());
    const indicators = idList.map(id => state.payload.indicators[id]).filter(Boolean);

    if (!indicators.length) {
      parts.frame.hidden = true;
      parts.legend.hidden = true;
      parts.status.hidden = false;
      parts.status.className = 'empty-message';
      parts.status.textContent = 'No data are available for this chart.';
      return;
    }

    const indexMode = card.dataset.mode === 'index';
    const { dates, pick: pickRaw } = align(indicators);
    const quarterlyBasis = state.basis.get(card) === 'quarterly';
    const pick = (item, field) => {
      let values = pickRaw(item, field);
      if (quarterlyBasis) values = values.map(v => (v == null ? null : v / 4));
      return values;
    };
    const single = indicators.length === 1;
    const first = indicators[0];
    const benchmark = !single && card.dataset.benchmark === 'true';

    const series = indicators.map((item, i) => {
      const flags = pickRaw(item, 'estimated');
      const raw = pick(item, 'value');
      const isBenchmark = benchmark && i === 0;
      const colour = single || isBenchmark ? '--chart-1' : MULTI[(benchmark ? i - 1 : i) % MULTI.length];
      return {
        label: item.short_title,
        color: token(colour),
        weight: isBenchmark ? BENCHMARK_WEIGHT : 1,
        dash: null,
        values: indexMode ? rebase(dates, raw) : raw,
        marks: flags.map((flag, j) => (flag ? j : -1)).filter(j => j >= 0),
      };
    });
    const anyEstimate = series.some(item => item.marks.length);

    /* Trends, in each series' own units. One series: trends in their own
       colours. Several series: each trend in its series' colour, dashed (HP)
       or dotted (CF), and slightly thinner. */
    const trendable = !indexMode && card.dataset.trends !== 'off';
    const trendKeys = state.trend === 'none' ? [] : state.trend === 'comparison' ? ['hp', 'cf'] : [state.trend];
    const dataSeries = series.slice();
    /* Some indicators replace the statistical trends by an external estimate
       (unemployment: CBO's noncyclical rate, NROU). */
    const override = single && first.override_trend;
    if (trendable && override && trendKeys.length) {
      series.push({
        label: override.label,
        color: token('--chart-2'),
        dash: '6 4',
        values: pick(first, override.field),
        isTrend: true,
      });
    } else if (trendable) {
      indicators.forEach((item, i) => trendKeys.forEach(key => series.push({
        label: single ? TRENDS[key].label : `${item.short_title}, ${TRENDS[key].label}`,
        color: single ? token(TRENDS[key].color) : dataSeries[i].color,
        dash: TRENDS[key].dash,
        weight: (single ? 1 : 0.85) * (dataSeries[i].weight || 1),
        opacity: single ? 1 : 0.6,
        values: pick(item, TRENDS[key].field),
        isTrend: true,
      })));
    }
    parts.note.hidden = trendable || state.trend === 'none';

    const monthly = indicators.every(item => item.frequency === 'Monthly');
    const start = dates[0];
    const end = dates[dates.length - 1];
    const label = monthly ? D.monthLabel : D.quarterLabel;
    const trendText = trendable && state.trend !== 'none'
      ? ` · ${override ? 'NROU' : TREND_NAMES[state.trend]}` : '';
    let units = first.units;
    if (quarterlyBasis) units = 'Percent per quarter (annual rate ÷ 4)';
    if (indexMode) units = 'Index, 2017 average = 100';
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

    const swatch = (color, dash, text, weight = 1) => `
      <li><svg class="legend-swatch" viewBox="0 0 28 10" aria-hidden="true" focusable="false">
        <line x1="1" y1="5" x2="27" y2="5" stroke="${color}" stroke-width="${2.2 * weight}"
          stroke-dasharray="${dash || 'none'}" stroke-linecap="round"/></svg>${S.escapeHTML(text)}</li>`;
    /* With several series, trends share their series' colour: the key shows
       each series once, then one grey entry per trend style. */
    const legendItems = single
      ? series.map(item => swatch(item.color, item.dash, item.label))
      : dataSeries.map(item => swatch(item.color, null, item.label, item.weight))
        .concat(trendable ? trendKeys.map(key => swatch(token('--muted'), TRENDS[key].dash, `${TRENDS[key].label} (lighter, same colour as its series)`)) : []);
    parts.legend.innerHTML = legendItems.join('')
      + (anyEstimate ? '<li><span class="legend-estimate" aria-hidden="true"></span>Estimated value</li>' : '');
    parts.legend.hidden = false;
    parts.readout.textContent = 'Hover over the chart, or focus it and use the arrow keys, to read values.';

    const sources = Array.from(new Set(indicators.map(item => item.source)
      .concat(override && trendKeys.length ? [override.source] : [])));
    const updated = indicators.map(item => item.source_last_updated).filter(Boolean).sort().pop();
    const hasEstimates = indicators.some(item => (item.estimates || []).length);
    parts.source.innerHTML = `Source: ${S.escapeHTML(sources.join('; '))}.`
      + (updated ? ` Source last updated ${S.escapeHTML(updated.slice(0, 10))}.` : '')
      + (hasEstimates ? '<br><span class="chart-missing">Missing data: see <a class="text-link" href="#missing-title">Missing data and estimates</a> at the bottom of the page.</span>' : '');
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

  /* Shares and growth tables (GDP, consumption, investment): nominal and
     real columns, three periods. */
  function table(rows, periods, caption, unitLabel, decimals) {
    const p = periods;
    const fmt = v => (v == null ? '–' : D.formatNumber(v, decimals));
    const head = `<tr><th scope="col" rowspan="2" class="component-head">Component<br><span class="unit-label">${S.escapeHTML(unitLabel)}</span></th>
        <th scope="colgroup" colspan="3">Nominal (current dollars)</th>
        <th scope="colgroup" colspan="3">Real (chained 2017 dollars)</th></tr>
      <tr>${['nominal', 'real'].map(() => `<th scope="col">${S.escapeHTML(p.latest)}</th>
        <th scope="col"><abbr title="${S.escapeHTML(p.recent_range || '')}">${S.escapeHTML(p.recent)}</abbr></th>
        <th scope="col"><abbr title="${S.escapeHTML(p.full_range || '')}">${S.escapeHTML(p.full)}</abbr></th>`).join('')}</tr>`;
    const body = rows.map(row => `
      <tr${row.is_sum ? ' class="is-sum"' : ''}>
        <th scope="row">${S.escapeHTML(row.component)}</th>
        <td>${fmt(row.nominal_latest)}</td><td>${fmt(row.nominal_recent)}</td><td>${fmt(row.nominal_full)}</td>
        <td>${fmt(row.real_latest)}</td><td>${fmt(row.real_recent)}</td><td>${fmt(row.real_full)}</td>
      </tr>`).join('');
    return `<div class="table-scroll"><table class="data-table shares-table">
      <caption class="visually-hidden">${S.escapeHTML(caption)}</caption>
      <thead>${head}</thead><tbody>${body}</tbody></table></div>`;
  }

  const GROWTH_NOTE = 'Annualised quarter-on-quarter growth, 400 × [ln(X<sub>t</sub>) − ln(X<sub>t−1</sub>)]: the latest-quarter column is that quarter’s growth at an annual rate; the period columns are averages of quarterly growth rates. Real growth uses chained 2017-dollar series, whose growth rates are those of BEA’s quantity indexes and are not affected by non-additivity; nominal growth also includes price changes.';

  /* Table settings by data-table key. GDP tables come from gdp_shares;
     consumption and investment tables from component_tables. */
  const TABLES = {
    gdp: {
      data: payload => payload.gdp_shares,
      share: ['Shares of GDP by expenditure component, percent', '(% of GDP)'],
      growth: ['Growth of GDP and its expenditure components, percent per year', '(% per year)'],
      shareNote: (t, p) => `Imports enter GDP with a negative sign. ${S.escapeHTML(t.notes.nominal)} ${S.escapeHTML(t.notes.real)} “Last 10 years” is ${S.escapeHTML(p.recent_range)}; ${S.escapeHTML(p.full)} is ${S.escapeHTML(p.full_range)}. Period columns are averages of quarterly shares.`,
      growthNote: () => GROWTH_NOTE,
    },
    consumption: {
      data: payload => payload.component_tables && payload.component_tables.consumption,
      share: ['Shares of consumption by component, percent', '(% of consumption)'],
      growth: ['Growth of consumption and its components, percent per year', '(% per year)'],
      shareNote: (t, p) => `Nominal: current-dollar component / current-dollar consumption. These shares add up to 100 and measure each component’s relative importance (BEA, 2023). Real: chained 2017-dollar component / chained 2017-dollar consumption. Chained components are not additive — see the “Sum of components” row — and their ratios are meaningful only close to 2017: further away they are distorted by relative-price changes, notably the long fall in the relative price of durable goods (Landefeld, Moulton and Vojtech, 2003; Whelan, 2002). “Last 10 years” is ${S.escapeHTML(p.recent_range)}; ${S.escapeHTML(p.full)} is ${S.escapeHTML(p.full_range)}. Period columns are averages of quarterly shares.`,
      growthNote: () => GROWTH_NOTE,
    },
    investment: {
      data: payload => payload.component_tables && payload.component_tables.investment,
      share: ['Shares of investment by component, percent', '(% of investment)'],
      growth: ['Growth of investment and its components, percent per year', '(% per year)'],
      shareNote: (t, p) => `Nominal: current-dollar component / current-dollar gross private domestic investment. These shares add up to 100 and measure each component’s relative importance (BEA, 2023). Real: chained 2017-dollar component / chained 2017-dollar investment. Chained components are not additive — see the “Sum of components” row — and their ratios are meaningful only close to 2017: further away they are distorted by relative-price changes (Landefeld, Moulton and Vojtech, 2003; Whelan, 2002). The change in private inventories is small on average but can be large, and negative, in individual quarters. “Last 10 years” is ${S.escapeHTML(p.recent_range)}; ${S.escapeHTML(p.full)} is ${S.escapeHTML(p.full_range)}. Period columns are averages of quarterly shares.`,
      growthNote: () => `${GROWTH_NOTE} The change in private inventories has no growth rate, because it changes sign.`,
    },
  };

  function renderShares() {
    body.querySelectorAll('[data-role="shares"], [data-role="growth"]').forEach(target => {
      const settings = TABLES[target.dataset.table || 'gdp'];
      const data = settings && settings.data(state.payload);
      if (!data) {
        target.innerHTML = '<p class="empty-message">This table will appear after the next data update.</p>';
        return;
      }
      const p = data.periods;
      if (target.dataset.role === 'shares') {
        target.innerHTML = table(data.rows, p, settings.share[0], settings.share[1], 1)
          + `<p class="table-note">${settings.shareNote(data, p)}</p>`;
      } else if (data.growth_rows) {
        target.innerHTML = table(data.growth_rows, p, settings.growth[0], settings.growth[1], 1)
          + `<p class="table-note">${settings.growthNote(data, p)}</p>`;
      }
    });
  }

  /* Bottom of the page: one ribbon per source series with estimated values. */
  function renderEstimates() {
    const target = body.querySelector('[data-role="estimates"]');
    if (!target) return;
    const bySeries = new Map();
    Object.values(state.payload.indicators).forEach(item => (item.estimates || []).forEach(record => {
      if (!bySeries.has(record.series_id)) bySeries.set(record.series_id, new Map());
      const dates = bySeries.get(record.series_id);
      if (!dates.has(record.date)) dates.set(record.date, { ...record, used: new Set() });
      dates.get(record.date).used.add(item.short_title.replace(/ per capita$/, ''));
      dates.get(record.date).series_title = record.series_title;
    }));
    if (!bySeries.size) {
      target.innerHTML = '<p>No values are currently estimated: every period shown was published by the source.</p>';
      return;
    }
    target.innerHTML = Array.from(bySeries.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([id, dates]) => {
      const records = Array.from(dates.values()).sort((a, b) => a.date.localeCompare(b.date));
      const used = Array.from(new Set(records.flatMap(r => Array.from(r.used))));
      /* Ribbon name: the indicator using the series, or the source title when several do. */
      const name = used.length === 1 ? used[0] : (records[0].series_title || id);
      const rows = records.map(r => `
        <tr><td>${S.escapeHTML(r.date.slice(0, 7))}</td><td>${S.escapeHTML(D.formatNumber(r.value, 2))}</td>
        <td>${S.escapeHTML(r.reason)}</td><td>${S.escapeHTML(r.method)}</td></tr>`).join('');
      return `<details class="ribbon">
        <summary>
          <span class="ribbon-title">${S.escapeHTML(name)} (${S.escapeHTML(id)}) <span class="ribbon-meta">· ${records.length} estimated ${records.length === 1 ? 'value' : 'values'}${used.length > 1 ? ` · used in ${S.escapeHTML(used.join(', '))}` : ''}</span></span>
          <i class="fas fa-chevron-down ribbon-chevron" aria-hidden="true"></i>
        </summary>
        <div class="ribbon-content"><div class="table-scroll"><table class="data-table estimates-table">
          <caption class="visually-hidden">Estimated values of ${S.escapeHTML(id)}</caption>
          <thead><tr><th scope="col">Period</th><th scope="col">Estimate</th><th scope="col">Why it is missing</th><th scope="col">Method</th></tr></thead>
          <tbody>${rows}</tbody></table></div></div>
      </details>`;
    }).join('');
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
      renderShares();
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
