// ===== Freebies welcome modal (isang file para sa inquiry, application, at cod pages) =====
var Freebies = (function () {
  var cache = null;
  var PROMO = '\uD83C\uDF89 ENJOY LIFETIME FREE SERVICE WITH EVERY MOTORCYCLE PURCHASE!';

  function injectStyle() {
    if (document.getElementById('freebiesStyle')) return;
    var style = document.createElement('style');
    style.id = 'freebiesStyle';
    style.textContent =
      '@keyframes krPop { from { opacity:0; transform:translateY(24px) scale(0.95); } to { opacity:1; transform:none; } }';
    document.head.appendChild(style);
  }

  function make(tag, css, text) {
    var node = document.createElement(tag);
    if (css) node.style.cssText = css;
    if (text) node.textContent = text;
    return node;
  }

  // Kinukuha ang freebies sa Google Sheet (freebies tab) nga naay spinner
  async function load() {
    if (cache) return cache;
    var lines = [];
    Busy.start('Loading...');
    try {
      var res = await Busy.fetch(SCRIPT_URL + '?action=freebies');
      var result = await res.json();
      lines = result.freebies || [];
      cache = lines;
    } catch (err) {
      lines = []; // walay listahan; ipakita gihapon ang modal
    } finally {
      Busy.stop();
    }
    return lines;
  }

  // Blangko nga row = bag-ong grupo; ang linya nga nagsugod sa "&" kay plain text
  function renderList(lines) {
    var box = make('div', 'background:#f1f5f9; border-radius:8px; padding:10px 14px; margin:12px 0');
    box.appendChild(make('div', 'font-weight:bold; font-size:15px', '\uD83C\uDF81 Your freebies'));
    var ul = null;
    lines.forEach(function (line) {
      if (!line) { ul = null; return; }
      if (line.charAt(0) === '&') {
        ul = null;
        box.appendChild(make('div', 'text-align:center; font-size:14px; color:#334155; margin:4px 0', line));
        return;
      }
      if (!ul) { ul = make('ul', 'margin:6px 0; padding-left:22px; font-size:15px'); box.appendChild(ul); }
      ul.appendChild(make('li', 'margin:3px 0', line));
    });
    return box;
  }

  // opts: { title, before: [text], after: [text], button }
  async function welcome(opts) {
    injectStyle();
    var lines = await load();
    return new Promise(function (resolve) {
      var page = document.querySelector('.card');

      var overlay = make('div', 'position:fixed; inset:0; z-index:1000; background:rgba(15,37,64,0.7); display:flex; align-items:center; justify-content:center; padding:16px; transition:opacity 0.45s');
      var dialog = make('div', 'background:#fff; color:#0f2540; border-radius:10px; max-width:420px; width:100%; max-height:90vh; overflow-y:auto; padding:20px; font-family:Arial,sans-serif; box-shadow:0 10px 30px rgba(0,0,0,0.3); animation:krPop 0.45s ease-out; transition:transform 0.45s ease-in');
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');

      dialog.appendChild(make('div', 'font-size:20px; font-weight:bold; margin-bottom:10px', opts.title));
      (opts.before || []).forEach(function (t) { dialog.appendChild(make('p', 'font-size:14px; margin:8px 0', t)); });
      dialog.appendChild(make('div', 'background:#fbbf24; color:#0f2540; font-weight:bold; font-size:14px; border-radius:6px; padding:10px; margin:12px 0; text-align:center', PROMO));
      if (lines.length) dialog.appendChild(renderList(lines));
      (opts.after || []).forEach(function (t) { dialog.appendChild(make('p', 'font-size:14px; margin:8px 0', t)); });

      var go = make('button', 'width:100%; margin-top:14px; padding:12px; border:0; border-radius:6px; background:#2563eb; color:#fff; font-size:16px; font-weight:bold; cursor:pointer', opts.button || 'Continue');
      go.type = 'button';
      go.addEventListener('click', function () {
        go.disabled = true;
        // Mo-fade ug molupad paingon sa header
        overlay.style.opacity = '0';
        dialog.style.transform = 'translateY(-160px) scale(0.5)';
        setTimeout(function () {
          overlay.remove();
          if (page) page.inert = false;
          resolve();
        }, 450);
      });
      dialog.appendChild(go);
      overlay.appendChild(dialog);
      if (page) page.inert = true;
      document.body.appendChild(overlay);
      go.focus();
    });
  }

  return { welcome: welcome };
})();
