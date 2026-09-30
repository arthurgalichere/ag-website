(() => {
  'use strict';

  const officeHoursBody = document.querySelector('.office-hours-body');
  const target = document.getElementById('office-hours-content');

  if (!officeHoursBody || !target) return;

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    })[character]);
  }

  function safeURL(value) {
    try {
      const url = new URL(value, window.location.origin);
      return ['http:', 'https:', 'mailto:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function renderInlineMarkdown(value) {
    const codeTokens = [];
    let text = String(value == null ? '' : value).replace(/`([^`]+)`/g, (_, code) => {
      const token = `\u0000CODE${codeTokens.length}\u0000`;
      codeTokens.push(`<code>${escapeHTML(code)}</code>`);
      return token;
    });

    text = escapeHTML(text);
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, rawURL) => {
      const url = safeURL(rawURL.trim());
      if (!url) return label;

      const external = /^https?:/i.test(url);
      return `<a href="${escapeHTML(url)}"${external ? ' target="_blank" rel="noreferrer"' : ''}>${label}</a>`;
    });
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    text = text.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');

    codeTokens.forEach((html, index) => {
      text = text.replace(`\u0000CODE${index}\u0000`, html);
    });

    return text;
  }

  function splitTableRow(line) {
    return line
      .trim()
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map(cell => cell.trim());
  }

  function isTableSeparator(line) {
    const cells = splitTableRow(line);
    return cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
  }

  function renderTable(lines, startIndex) {
    const headers = splitTableRow(lines[startIndex]);
    const rows = [];
    let index = startIndex + 2;

    while (index < lines.length) {
      const line = lines[index];
      if (!line.trim() || !line.includes('|')) break;
      rows.push(splitTableRow(line));
      index += 1;
    }

    const headerHTML = headers
      .map(header => `<th scope="col">${renderInlineMarkdown(header)}</th>`)
      .join('');

    const rowsHTML = rows.map(row => {
      const cells = headers.map((_, cellIndex) => row[cellIndex] || '');
      return `<tr>${cells.map(cell => `<td>${renderInlineMarkdown(cell)}</td>`).join('')}</tr>`;
    }).join('');

    return {
      html: `
        <div class="table-wrap">
          <table class="schedule-table">
            <thead><tr>${headerHTML}</tr></thead>
            <tbody>${rowsHTML}</tbody>
          </table>
        </div>
      `,
      nextIndex: index
    };
  }

  function listMatch(line) {
    const match = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.+)$/);
    if (!match) return null;

    return {
      indent: match[1].replace(/\t/g, '    ').length,
      type: /^\d/.test(match[2]) ? 'ol' : 'ul',
      text: match[3]
    };
  }

  function renderList(lines, startIndex, baseIndent) {
    const first = listMatch(lines[startIndex]);
    const listType = first.type;
    const items = [];
    let index = startIndex;

    while (index < lines.length) {
      while (index < lines.length && !lines[index].trim()) {
        const next = listMatch(lines[index + 1] || '');
        if (!next || next.indent < baseIndent) break;
        index += 1;
      }

      const current = listMatch(lines[index] || '');
      if (!current || current.indent < baseIndent) break;
      if (current.indent > baseIndent || current.type !== listType) break;

      let itemHTML = renderInlineMarkdown(current.text);
      index += 1;

      while (index < lines.length) {
        if (!lines[index].trim()) {
          const next = listMatch(lines[index + 1] || '');
          if (next && next.indent > baseIndent) {
            index += 1;
            continue;
          }
          break;
        }

        const nested = listMatch(lines[index]);
        if (nested && nested.indent > baseIndent) {
          const rendered = renderList(lines, index, nested.indent);
          itemHTML += rendered.html;
          index = rendered.nextIndex;
          continue;
        }

        if (nested && nested.indent === baseIndent) break;
        if (nested && nested.indent < baseIndent) break;

        const continuationIndent = lines[index].match(/^\s*/)[0].replace(/\t/g, '    ').length;
        if (continuationIndent > baseIndent) {
          itemHTML += ` ${renderInlineMarkdown(lines[index].trim())}`;
          index += 1;
          continue;
        }

        break;
      }

      items.push(`<li>${itemHTML}</li>`);
    }

    return {
      html: `<${listType}>${items.join('')}</${listType}>`,
      nextIndex: index
    };
  }

  function markdownToHTML(markdown) {
    const lines = String(markdown || '').replace(/\r\n?/g, '\n').split('\n');
    const output = [];
    let paragraph = [];
    let index = 0;

    function flushParagraph() {
      if (!paragraph.length) return;
      output.push(`<p>${renderInlineMarkdown(paragraph.join(' '))}</p>`);
      paragraph = [];
    }

    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph();
        index += 1;
        continue;
      }

      if (
        index + 1 < lines.length &&
        trimmed.includes('|') &&
        isTableSeparator(lines[index + 1])
      ) {
        flushParagraph();
        const table = renderTable(lines, index);
        output.push(table.html);
        index = table.nextIndex;
        continue;
      }

      const heading = trimmed.match(/^(#{1,4})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        const level = Math.min(heading[1].length + 1, 4);
        output.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
        index += 1;
        continue;
      }

      const list = listMatch(line);
      if (list) {
        flushParagraph();
        const rendered = renderList(lines, index, list.indent);
        output.push(rendered.html);
        index = rendered.nextIndex;
        continue;
      }

      paragraph.push(trimmed);
      index += 1;
    }

    flushParagraph();
    return output.join('');
  }

  function restartReveal(element) {
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.classList.remove('reveal');
    void element.offsetWidth;
    element.classList.add('reveal');
  }

  async function loadOfficeHours() {
    const sourceURL = officeHoursBody.dataset.officeHoursUrl;

    try {
      if (!sourceURL) throw new Error('The office-hours data URL is not configured.');

      const response = await fetch(`${sourceURL}?v=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`The server returned status ${response.status}.`);
      }

      const markdown = await response.text();
      if (!markdown.trim()) {
        target.innerHTML = '<p class="empty-message">No current advice and feedback hours have been published.</p>';
        return;
      }

      const rendered = markdownToHTML(markdown);
      target.innerHTML = rendered || '<p class="empty-message">No current advice and feedback hours have been published.</p>';
      restartReveal(target.closest('.content-section'));
    } catch (error) {
      console.error('Office-hours timetable could not be loaded:', error);
      target.innerHTML = `
        <div class="render-error" role="alert">
          <strong><i class="fas fa-exclamation-triangle" aria-hidden="true"></i> Current timetable unavailable</strong>
          The current office-hours information could not be loaded. Please use the booking link above or contact me by email. ${escapeHTML(error.message)}
        </div>
      `;
    } finally {
      target.setAttribute('aria-busy', 'false');
    }
  }

  loadOfficeHours();
})();
