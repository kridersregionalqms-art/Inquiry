// ===== Busy spinner (nakaharang na loading screen) =====
// Isang file ito para sa inquiry, application, at cod pages.
// Para palitan ang mga phrase o ang bilis, i-edit lang ang BUSY_PHRASES at BUSY_INTERVAL_MS.
var BUSY_INTERVAL_MS = 3000; // bawat 3 segundo, nagpapalit ng phrase
var BUSY_PHRASES = [
  'This will take a moment. Please wait.',
  'Still working on it. Please do not close or refresh this page.',
  'Almost there. Thank you for your patience.',
  'This is taking longer than usual, but we are still working on it. Please keep this page open.',
  'Please stay on this page. Your request is still being processed.'
];

var Busy = (function () {
  var depth = 0; // ilang gawain ang sabay na tumatakbo; mawawala lang ang spinner kapag 0 na
  var overlay, labelEl, phraseEl, page, timer, index;

  function build() {
    if (!document.getElementById('busyStyle')) {
      var style = document.createElement('style');
      style.id = 'busyStyle';
      style.textContent = '@keyframes busySpin { to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }
    overlay = document.createElement('div');
    overlay.id = 'busyOverlay';
    overlay.tabIndex = -1;
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-busy', 'true');
    overlay.setAttribute('aria-live', 'polite');
    overlay.style.cssText = 'position:fixed; inset:0; z-index:2000; background:rgba(15,37,64,0.78); display:flex; align-items:center; justify-content:center; padding:16px; cursor:wait; outline:none; touch-action:none';

    var box = document.createElement('div');
    box.style.cssText = 'background:#fff; color:#0f2540; border-radius:10px; max-width:340px; width:100%; padding:24px 20px; text-align:center; font-family:Arial,sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.3)';

    var ring = document.createElement('div');
    ring.style.cssText = 'width:44px; height:44px; margin:0 auto 14px; border:5px solid #cbd5e1; border-top-color:#2563eb; border-radius:50%; animation:busySpin 0.8s linear infinite';

    labelEl = document.createElement('div');
    labelEl.style.cssText = 'font-size:17px; font-weight:bold';

    phraseEl = document.createElement('div');
    phraseEl.style.cssText = 'font-size:14px; color:#334155; margin-top:8px; min-height:40px';

    box.appendChild(ring);
    box.appendChild(labelEl);
    box.appendChild(phraseEl);
    overlay.appendChild(box);

    // Walang scroll at walang ibang magagalaw habang naka-spinner
    overlay.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    overlay.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  }

  // Keyboard: walang Tab, Enter, Escape, F5, atbp. Ang Ctrl/Cmd/Alt combos ay dadaan sa warning ng browser sa ibaba.
  function blockKeys(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    e.preventDefault();
    e.stopPropagation();
  }

  // Kapag susubukang isara, i-refresh, o iwan ang page, magtatanong muna ang browser
  function warnLeave(e) {
    e.preventDefault();
    e.returnValue = '';
    return '';
  }

  function tick() {
    phraseEl.textContent = BUSY_PHRASES[index % BUSY_PHRASES.length];
    index++;
  }

  function show(label) {
    if (!overlay) build();
    labelEl.textContent = label;
    phraseEl.textContent = '';
    index = 0;
    document.body.appendChild(overlay);
    page = document.querySelector('.card');
    if (page) page.inert = true; // hindi na ma-click o ma-Tab ang form sa likod
    overlay.focus();
    document.addEventListener('keydown', blockKeys, true);
    window.addEventListener('beforeunload', warnLeave);
    timer = setInterval(tick, BUSY_INTERVAL_MS);
  }

  function hide() {
    clearInterval(timer);
    timer = null;
    document.removeEventListener('keydown', blockKeys, true);
    window.removeEventListener('beforeunload', warnLeave);
    if (page) page.inert = false;
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }

  return {
    // Simulan ang spinner. Ang label ay ang unang linya, hal. 'Checking your inquiries...'
    start: function (label) {
      depth++;
      if (depth === 1) show(label);
      else labelEl.textContent = label;
    },
    // Tapusin ang spinner. Palaging tawagin sa finally para hindi ma-stuck.
    stop: function () {
      if (depth === 0) return;
      depth--;
      if (depth === 0) hide();
    },
    isActive: function () { return depth > 0; }
  };
})();
