// ===== Terms & Conditions (Data Privacy) =====
// Isang file ito para sa inquiry, application, at cod pages.
// Para palitan ang teksto, i-edit lang ang PRIVACY_TITLE, PRIVACY_SECTIONS, PRIVACY_CONTACT_INTRO, PRIVACY_FOOTER, at CONSENT_LABEL.
// Ang section na may contact: true ang pagpapakitaan ng email, number, at Facebook ng napiling branch.
var PRIVACY_TITLE = 'Terms & Conditions: Data Privacy Notice and Consent';
var PRIVACY_SECTIONS = [
  {
    heading: '1. Collection and Use of Personal Information',
    text: 'By submitting this form, I acknowledge that K Riders Motorcycle Sales Center, Inc. (\u201CK Riders\u201D) may collect, record, use, store, and process the personal information I provide, including my name, contact number, email address, residential address, date of birth, employment and income details, co-maker details (if applicable), and the motorcycle unit I am interested in.'
  },
  {
    heading: '2. Purpose of Processing',
    text: 'K Riders will process my personal information to respond to my inquiry, contact me regarding my selected motorcycle unit, process my application if I choose to apply, verify the information I provide, conduct necessary credit and background verification, and prepare sales, financing, collection, and release documents related to my purchase, as applicable.'
  },
  {
    heading: '3. Data Sharing and Protection',
    text: 'My personal information may be accessed by authorized K Riders branches, employees, and service providers, where necessary for the purposes stated above and subject to applicable data privacy requirements and appropriate safeguards. K Riders will take reasonable measures to protect my personal information against unauthorized access, disclosure, alteration, loss, or misuse.'
  },
  {
    heading: '4. Data Retention',
    text: 'K Riders will retain my personal information only for as long as necessary to fulfill the stated purposes, comply with applicable legal and regulatory requirements, and establish, exercise, or defend legal claims, as applicable. Information will be securely disposed of or anonymized when retention is no longer necessary, subject to applicable requirements.'
  },
  {
    heading: '5. My Data Privacy Rights',
    text: 'I understand that I have rights under the Data Privacy Act of 2012, including the right to be informed, access and correct my personal information, object to or request the restriction of certain processing where applicable, and withdraw my consent where consent is the applicable legal basis, subject to legal limitations and other lawful grounds for processing.',
    contact: true
  },
  {
    heading: '6. Consent',
    text: 'By checking the box below, I confirm that I have read and understood this Data Privacy Notice. I voluntarily consent to the collection and processing of my personal information for the purposes described above, where consent is the applicable legal basis for processing.'
  }
];
var PRIVACY_CONTACT_INTRO = 'For privacy-related questions or requests, I may contact K Riders through its designated Data Protection Officer or privacy contact:';
var PRIVACY_FOOTER = 'This notice is provided in accordance with the Data Privacy Act of 2012 (Republic Act No. 10173) and its applicable implementing rules and regulations.';
var PRIVACY_NEED_BRANCH = 'Please select a branch first to open the Terms & Conditions.';
var CONSENT_LABEL = 'I have read and understood the Data Privacy Notice above, and I consent to the processing of my personal information as described, where consent is the applicable legal basis.';

var Terms = (function () {
  var link, panel, box, status, notice, contactBox;
  var branchInfo = null; // { branch, contact, link, email } ng napiling branch; null kung wala pa

  function show(visible) {
    panel.style.display = visible ? 'block' : 'none';
    link.setAttribute('aria-expanded', visible ? 'true' : 'false');
  }

  // Inilalagay sa section 5 ang email, number, at Facebook ng napiling branch
  function renderContact() {
    if (!contactBox) return;
    contactBox.textContent = '';
    if (!branchInfo) return;
    var name = document.createElement('div');
    name.style.fontWeight = 'bold';
    name.textContent = branchInfo.branch;
    contactBox.appendChild(name);

    var addresses = String(branchInfo.email || '').split(',').map(function (a) { return a.trim(); }).filter(Boolean);
    if (addresses.length) {
      var emailLine = document.createElement('div');
      emailLine.appendChild(document.createTextNode('Email: '));
      addresses.forEach(function (address, i) {
        if (i > 0) emailLine.appendChild(document.createTextNode(', '));
        var a = document.createElement('a');
        a.href = 'mailto:' + address;
        a.textContent = address;
        emailLine.appendChild(a);
      });
      contactBox.appendChild(emailLine);
    }
    if (branchInfo.contact) {
      var phoneLine = document.createElement('div');
      phoneLine.appendChild(document.createTextNode('Contact number: '));
      var phone = document.createElement('a');
      phone.href = 'tel:' + String(branchInfo.contact).replace(/[^0-9+]/g, '');
      phone.textContent = branchInfo.contact;
      phoneLine.appendChild(phone);
      contactBox.appendChild(phoneLine);
    }
    if (branchInfo.link) {
      var fbLine = document.createElement('div');
      fbLine.appendChild(document.createTextNode('Facebook page: '));
      var fb = document.createElement('a');
      fb.href = branchInfo.link;
      fb.target = '_blank';
      fb.rel = 'noopener';
      fb.textContent = branchInfo.link;
      fb.style.wordBreak = 'break-all';
      fbLine.appendChild(fb);
      contactBox.appendChild(fbLine);
    }
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
      PRIVACY_SECTIONS.forEach(function (s) {
        var h = document.createElement('p');
        h.style.cssText = 'margin:14px 0 4px; font-weight:bold';
        h.textContent = s.heading;
        panel.appendChild(h);
        var p = document.createElement('p');
        p.style.margin = '0 0 10px';
        p.textContent = s.text;
        panel.appendChild(p);
        if (s.contact) {
          var intro = document.createElement('p');
          intro.style.margin = '0 0 6px';
          intro.textContent = PRIVACY_CONTACT_INTRO;
          panel.appendChild(intro);
          contactBox = document.createElement('div');
          contactBox.style.cssText = 'margin:0 0 10px; padding:8px; border-radius:6px; background:#e2e8f0; word-break:break-word';
          panel.appendChild(contactBox);
        }
      });
      var footer = document.createElement('p');
      footer.style.margin = '10px 0 0';
      footer.textContent = PRIVACY_FOOTER;
      panel.appendChild(footer);
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
        if (!branchInfo) {
          notice.textContent = PRIVACY_NEED_BRANCH;
          return;
        }
        notice.textContent = '';
        show(panel.style.display === 'none');
      });
      box.addEventListener('change', function () {
        status.textContent = box.checked ? '\u2714 Accepted' : '';
      });

      notice = document.createElement('div');
      notice.setAttribute('aria-live', 'polite');
      notice.style.cssText = 'margin-top:6px; font-size:14px; font-weight:bold; color:#b91c1c';

      container.appendChild(line);
      container.appendChild(notice);
      container.appendChild(panel);
      renderContact();
    },
    isAccepted: function () { return !!box && box.checked && !!branchInfo; },
    // Itinatakda ang branch ng customer (object galing sa Branch Contacts, o null kung wala pang napili)
    setBranch: function (info) {
      branchInfo = info || null;
      renderContact();
      if (!panel) return;
      if (branchInfo) {
        notice.textContent = '';
      } else {
        show(false);
        box.checked = false;
        status.textContent = '';
      }
    },
    // Binubuksan ang teksto at itinuturo ang checkbox; kung wala pang branch, ipapaalala muna
    requireAcceptance: function () {
      if (!branchInfo) {
        notice.textContent = PRIVACY_NEED_BRANCH;
        notice.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      show(true);
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
})();
