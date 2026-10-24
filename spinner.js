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


// Mahina o walang signal: kapag lumagpas ng 10 segundo ang paghihintay sa server, o walang internet,
// lalabas ang babala at ang mga button na Try again at Cancel. Hindi hihinto ang paghihintay.
var BUSY_SLOW_MS = 10000;
var BUSY_SIGNAL_TEXT = {
  offline: 'No signal. Please check your internet connection. We are still waiting and will continue once you are back online.',
  weak: 'Your signal seems weak. We are still waiting for a response, please stay on this page.'
};

var Busy = (function () {
  var depth = 0; // ilang gawain ang sabay na tumatakbo; mawawala lang ang spinner kapag 0 na
  var overlay, labelEl, phraseEl, noticeEl, buttonsEl, page, timer, signalTimer, index;
  var jobs = []; // mga request na hinihintay ng Busy.fetch

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

    // Babala sa mahina o walang signal, at ang mga button (nakatago hanggang ma-detect)
    noticeEl = document.createElement('div');
    noticeEl.style.cssText = 'display:none; font-size:14px; font-weight:bold; color:#b45309; margin-top:12px';
    noticeEl.setAttribute('role', 'status');

    buttonsEl = document.createElement('div');
    buttonsEl.style.cssText = 'display:none; gap:10px; margin-top:14px';
    var retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.textContent = 'Try again';
    retryBtn.style.cssText = 'flex:1; width:auto; margin:0; padding:10px; border:0; border-radius:6px; background:#2563eb; color:#fff; font-size:15px; font-weight:bold; cursor:pointer';
    retryBtn.addEventListener('click', retryAll);
    var cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'flex:1; width:auto; margin:0; padding:10px; border:0; border-radius:6px; background:#475569; color:#fff; font-size:15px; font-weight:bold; cursor:pointer';
    cancelBtn.addEventListener('click', cancelAll);
    buttonsEl.appendChild(retryBtn);
    buttonsEl.appendChild(cancelBtn);
    box.appendChild(noticeEl);
    box.appendChild(buttonsEl);
    overlay.appendChild(box);

    // Walang scroll at walang ibang magagalaw habang naka-spinner
    overlay.addEventListener('wheel', function (e) { e.preventDefault(); }, { passive: false });
    overlay.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  }

  // Keyboard: walang Tab, Enter, Escape, F5, atbp. Ang Ctrl/Cmd/Alt combos ay dadaan sa warning ng browser sa ibaba.
  function blockKeys(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    // Puwede lang ang Tab papunta sa mga button ng spinner at ang pagpindot sa mga button na iyon
    if (overlay && overlay.contains(e.target) && (e.key === 'Tab' || e.target.tagName === 'BUTTON')) return;
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
    noticeEl.style.display = 'none';
    buttonsEl.style.display = 'none';
    signalTimer = setInterval(refreshSignal, 1000);
    window.addEventListener('offline', refreshSignal);
    window.addEventListener('online', onOnline);
  }

  function hide() {
    clearInterval(timer);
    timer = null;
        clearInterval(signalTimer);
    signalTimer = null;
    window.removeEventListener('offline', refreshSignal);
    window.removeEventListener('online', onOnline);
    document.removeEventListener('keydown', blockKeys, true);
    window.removeEventListener('beforeunload', warnLeave);
    if (page) page.inert = false;
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
    // ===== Mahina o walang signal =====
  function signalState() {
    if (navigator.onLine === false) return 'offline';
    if (!jobs.length) return '';
    if (jobs.some(function (j) { return j.failed; })) return 'weak';
    var c = navigator.connection;
    if (c && (c.effectiveType === 'slow-2g' || c.effectiveType === '2g')) return 'weak';
    var now = Date.now();
    return jobs.some(function (j) { return now - j.startedAt >= BUSY_SLOW_MS; }) ? 'weak' : '';
  }

  function refreshSignal() {
    if (!overlay) return;
    var state = signalState();
    noticeEl.textContent = state ? BUSY_SIGNAL_TEXT[state] : '';
    noticeEl.style.display = state ? 'block' : 'none';
    buttonsEl.style.display = (state && jobs.length) ? 'flex' : 'none';
  }

  // Isang request sa server. Hindi ito titigil kapag mahina ang signal; maghihintay hanggang
  // may sagot, o hanggang pindutin ng customer ang Try again o Cancel.
  function attempt(job) {
    var controller = new AbortController();
    job.controller = controller;
    job.failed = false;
    job.startedAt = Date.now();
    var options = Object.assign({}, job.options, { signal: controller.signal });
    window.fetch(job.url, options).then(function (res) {
      return res.text().then(function (text) {
        return new Response(text, { status: res.status, statusText: res.statusText });
      });
    }).then(function (copy) {
      if (job.controller !== controller || job.done) return;
      job.done = true;
      jobs = jobs.filter(function (j) { return j !== job; });
      refreshSignal();
      job.resolve(copy);
    }, function () {
      if (job.controller !== controller || job.done) return; // napalitan na ng Try again, o na-cancel
      job.failed = true; // walang signal: maghihintay hanggang Try again, Cancel, o bumalik ang signal
      refreshSignal();
    });
  }

  function retryAll() {
    jobs.slice().forEach(function (job) {
      if (job.controller) job.controller.abort();
      attempt(job);
    });
    refreshSignal();
  }

  function onOnline() {
    jobs.slice().forEach(function (job) { if (job.failed) attempt(job); });
    refreshSignal();
  }

  function cancelAll() {
    jobs.slice().forEach(function (job) {
      job.done = true;
      if (job.controller) job.controller.abort();
      var err = new Error('Cancelled');
      err.name = 'AbortError';
      err.cancelled = true;
      job.reject(err);
    });
    jobs = [];
    refreshSignal();
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
    isActive: function () { return depth > 0; },
    // Natatanging ID ng bawat pagsumite; ginagamit ng server para hindi madoble ang record kapag Try again
    newId: function () { return Date.now().toString(36) + Math.random().toString(36).slice(2, 10); },
    // Gamitin ito sa halip na fetch para sa mga request na hinihintay ng spinner (kapareho ng fetch)
    fetch: function (url, options) {
      if (depth === 0) return window.fetch(url, options); // walang spinner: karaniwang fetch lang
      return new Promise(function (resolve, reject) {
        var job = { url: url, options: options || {}, resolve: resolve, reject: reject, done: false, failed: false };
        jobs.push(job);
        attempt(job);
      });
    }
  };
})();
