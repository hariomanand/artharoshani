// Renders a content block (from chapter data) into HTML.
// Supported types: p, h, list, callout, formula, table, flow, figure, terms.

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Notes intentionally allow a small set of inline tags (<b>, <i>) authored by us,
// so we don't escape block text/items — content is app-authored, not user input.

const CALLOUT_META = {
  def:  { label: 'Definition', icon: '📘' },
  tip:  { label: 'Remember',   icon: '💡' },
  warn: { label: 'Watch out',  icon: '⚠️' },
  exam: { label: 'Exam point', icon: '🎯' },
};

export function renderBlock(b) {
  switch (b.type) {
    case 'p':
      return `<div class="block"><p>${b.text}</p></div>`;

    case 'h':
      return `<div class="block"><h3 class="sub">${b.text}</h3></div>`;

    case 'list': {
      const tag = b.ordered ? 'ol' : 'ul';
      return `<div class="block"><${tag}>${b.items.map(i => `<li>${i}</li>`).join('')}</${tag}></div>`;
    }

    case 'callout': {
      const meta = CALLOUT_META[b.variant] || CALLOUT_META.tip;
      const body = b.items
        ? `<ul>${b.items.map(i => `<li>${i}</li>`).join('')}</ul>`
        : `<p>${b.text}</p>`;
      return `<div class="block"><div class="callout callout--${b.variant}">
        <div class="callout__label">${meta.icon} ${esc(b.label || meta.label)}</div>${body}
      </div></div>`;
    }

    case 'formula':
      return `<div class="block"><div class="formula">${b.tex}${b.note ? `<small>${b.note}</small>` : ''}</div></div>`;

    case 'table': {
      const head = `<tr>${b.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
      const rows = b.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('');
      return `<div class="block"><div class="tbl-wrap"><table class="data"><thead>${head}</thead><tbody>${rows}</tbody></table></div></div>`;
    }

    case 'flow': {
      const steps = b.steps.map((s, i) => `
        <div class="flow__step">
          <div class="flow__rail">
            <div class="flow__node">${i + 1}</div>
            ${i < b.steps.length - 1 ? '<div class="flow__line"></div>' : ''}
          </div>
          <div class="flow__card">
            <h5>${s.title}</h5>${s.text ? `<p>${s.text}</p>` : ''}
          </div>
        </div>`).join('');
      return `<div class="block"><div class="flow">${steps}</div></div>`;
    }

    case 'figure':
      return `<div class="block"><div class="figure">${b.svg}${b.caption ? `<div class="figure__cap">${esc(b.caption)}</div>` : ''}</div></div>`;

    case 'terms':
      return `<div class="block"><div class="terms">${b.items.map(t => `
        <div class="term"><b>${t.term}</b><span>${t.def}</span></div>`).join('')}</div></div>`;

    default:
      return '';
  }
}

export function renderBlocks(blocks = []) {
  return blocks.map(renderBlock).join('');
}
