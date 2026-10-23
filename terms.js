// ===== Terms & Conditions (Data Privacy) =====
// Isang file ito para sa inquiry, application, at cod pages.
// Para palitan ang teksto, i-edit lang ang PRIVACY_TITLE, PRIVACY_PARAGRAPHS, at CONSENT_LABEL.
var PRIVACY_TITLE = 'Terms & Conditions: Data Privacy Consent';
var PRIVACY_PARAGRAPHS = [
  'By ticking the box below, I give K Riders Motorcycle Sales Center ("K Riders") my consent to collect, record, use, and keep the personal information I submit in this form, such as my name, contact number, email address, address, date of birth, employment and income details, co-maker details (if any), and the unit I am interested in.',
  'I understand that K Riders will use this information to respond to and process my inquiry or application, to verify the information I provided, to contact me, and to prepare the sales, financing, and release documents related to my purchase. K Riders may share it with its authorized branches and personnel, only as needed for these purposes.',
  'This consent is given in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173).'
  // Opsyonal na linya tungkol sa rights (idagdag dito kung gusto):
  // , 'I understand that I may ask K Riders to correct my information or withdraw this consent, subject to applicable law.'
];
var CONSENT_LABEL = 'I have read and agree to the Terms & Conditions above, and I give my consent to K Riders to collect and process my personal information.';

var Terms = (function () {
  var link, panel, box, status;

  function show(visible) {
    panel.style.display = visible ? 'block' : 'none';
    link.setAttribute('aria-expanded', visible ? 'true' : 'false');
  }

  return {
    // Ginagawa ang link, ang teksto, at ang checkbox sa loob ng element na may ganitong id
    init: function (containerId) {
      var container = document.getElementById(containerId);
      container.textContent = '';

      var line = document.createElement('div');
      line.style.cssText = 'margin-top:16px; font-size:14px';
      line.appendChild(document.createTextNode('Please read and accept our '));
      link = document.createElement('a');
      link.href = '#';
      link.textContent = 'Terms & Conditions';
      link.style.cssText = 'color:#2563eb; font-weight:bold';
      link.setAttribute('role', 'button');
      link.setAttribute('aria-expanded', 'false');
      line.appendChild(link);
      line.appendChild(document.createTextNode(' (Data Privacy) before sending. '));
      status = document.createElement('span');
      status.style.cssText = 'color:#15803d; font-weight:bold';
      line.appendChild(status);

      panel = document.createElement('div');
      panel.style.cssText = 'display:none; margin-top:10px; padding:12px; border:1px solid #94a3b8; border-radius:6px; background:#f8fafc; font-size:14px';
      var title = document.createElement('p');
      title.style.cssText = 'margin:0 0 10px; font-weight:bold';
      title.textContent = PRIVACY_TITLE;
      panel.appendChild(title);
      PRIVACY_PARAGRAPHS.forEach(function (text) {
        var p = document.createElement('p');
        p.style.margin = '0 0 10px';
        p.textContent = text;
        panel.appendChild(p);
      });
      var label = document.createElement('label');
      label.style.cssText = 'display:flex; align-items:flex-start; gap:8px; font-weight:normal; margin-top:14px';
      box = document.createElement('input');
      box.type = 'checkbox';
      box.style.cssText = 'width:auto; margin:3px 0 0; flex:none';
      var labelText = document.createElement('span');
      labelText.textContent = CONSENT_LABEL;
      label.appendChild(box);
      label.appendChild(labelText);
      panel.appendChild(label);

      link.addEventListener('click', function (event) {
        event.preventDefault();
        show(panel.style.display === 'none');
      });
      box.addEventListener('change', function () {
        status.textContent = box.checked ? '\u2714 Accepted' : '';
      });

      container.appendChild(line);
      container.appendChild(panel);
    },
    isAccepted: function () { return !!box && box.checked; },
    // Binubuksan ang teksto at itinuturo ang checkbox
    requireAcceptance: function () {
      show(true);
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
})();
