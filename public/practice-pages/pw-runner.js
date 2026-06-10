/* Playwright Handbook — PwRunner action listener
   Listens for 'pw-step' postMessages from the PwRunner widget and manipulates
   the DOM to simulate Playwright actions. Steps are labeled simulations. */
(function () {
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'pw-step') return;

    var action = e.data.action;
    var selector = e.data.selector || '';
    var value = e.data.value || '';
    var result = { type: 'pw-step-result', ok: true, error: null };

    try {
      var el = selector ? document.querySelector(selector) : null;

      if (action === 'fill' && el) {
        el.focus();
        el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (action === 'click' && el) {
        el.click();
      } else if (action === 'navigate') {
        // no-op — already on target page
      } else if (action === 'expect-visible') {
        if (!el || el.offsetParent === null) throw new Error('Element not visible: ' + selector);
      } else if (action === 'expect-text') {
        if (!el || !el.textContent.includes(value)) throw new Error('Expected text "' + value + '" in ' + selector);
      } else if (action === 'show-error') {
        var errEl = document.querySelector('[data-error]');
        if (errEl) { errEl.textContent = value; errEl.style.display = 'block'; }
      } else if (action === 'show-page') {
        var pages = document.querySelectorAll('[data-page]');
        pages.forEach(function (p) {
          p.style.display = p.getAttribute('data-page') === value ? 'block' : 'none';
        });
      }
    } catch (err) {
      result.ok = false;
      result.error = err.message;
    }

    window.parent.postMessage(result, '*');
  });
})();
