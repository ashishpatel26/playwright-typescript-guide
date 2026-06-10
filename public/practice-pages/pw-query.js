/* Playwright Handbook — LocatorLab query listener
   Included in all practice pages. Listens for 'pw-query' postMessages from
   the LocatorLab widget and highlights matching elements. */
(function () {
  function getImplicitRole(el) {
    var tag = el.tagName.toLowerCase();
    var type = (el.getAttribute('type') || '').toLowerCase();
    var roles = {
      button: 'button',
      a: el.hasAttribute('href') ? 'link' : null,
      input: type === 'checkbox' ? 'checkbox'
           : type === 'radio' ? 'radio'
           : type === 'submit' || type === 'button' ? 'button'
           : 'textbox',
      select: 'combobox',
      textarea: 'textbox',
      img: 'img',
      h1: 'heading', h2: 'heading', h3: 'heading',
      h4: 'heading', h5: 'heading', h6: 'heading',
      nav: 'navigation', main: 'main', header: 'banner',
      footer: 'contentinfo', aside: 'complementary',
      table: 'table', tr: 'row', td: 'cell', th: 'columnheader',
      ul: 'list', ol: 'list', li: 'listitem',
      form: 'form',
    };
    return roles[tag] || null;
  }

  function clearHighlights() {
    document.querySelectorAll('[data-pw-hl]').forEach(function (el) {
      el.style.removeProperty('outline');
      el.style.removeProperty('background-color');
      el.removeAttribute('data-pw-hl');
    });
  }

  function highlight(els) {
    els.forEach(function (el) {
      el.style.outline = '2px solid #F05133';
      el.style.backgroundColor = 'rgba(240,81,51,0.12)';
      el.setAttribute('data-pw-hl', '1');
    });
  }

  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'pw-query') return;
    clearHighlights();

    var kind = e.data.kind;
    var value = e.data.value || '';
    var name = e.data.name || '';
    var matches = [];

    try {
      if (kind === 'css') {
        matches = Array.from(document.querySelectorAll(value));
      } else if (kind === 'getByRole') {
        var role = value.toLowerCase();
        matches = Array.from(document.querySelectorAll('*')).filter(function (el) {
          var r = el.getAttribute('role') || getImplicitRole(el);
          if (r !== role) return false;
          if (!name) return true;
          var acc = el.getAttribute('aria-label') || el.textContent.trim() || el.getAttribute('value') || '';
          return acc.toLowerCase().includes(name.toLowerCase());
        });
      } else if (kind === 'getByText') {
        matches = Array.from(document.querySelectorAll('*')).filter(function (el) {
          return el.children.length === 0 && el.textContent.trim().includes(value);
        });
      } else if (kind === 'getByLabel') {
        var labels = Array.from(document.querySelectorAll('label')).filter(function (l) {
          return l.textContent.trim().toLowerCase().includes(value.toLowerCase());
        });
        matches = labels.map(function (l) {
          var forId = l.getAttribute('for');
          return forId ? document.getElementById(forId) : l.querySelector('input,select,textarea');
        }).filter(Boolean);
      } else if (kind === 'getByTestId') {
        matches = Array.from(document.querySelectorAll('[data-testid="' + value + '"]'));
      } else if (kind === 'xpath') {
        var xr = document.evaluate(value, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        for (var i = 0; i < xr.snapshotLength; i++) matches.push(xr.snapshotItem(i));
      }
    } catch (err) {
      e.source.postMessage({ type: 'pw-result', count: 0, error: err.message }, '*');
      return;
    }

    highlight(matches);
    e.source.postMessage({ type: 'pw-result', count: matches.length, error: null }, '*');
  });
})();
