// ===== Gate: ang application at cod pages ay bubukas lang kung dumaan sa inquiry page =====
// Isang file ito para sa inquiry, application, at cod pages.
var Gate = (function () {
  var IDS_KEY = 'krProceedIds';   // mga Inquiry ID na ipinakita ng inquiry page sa browser na ito
  var LINK_KEY = 'krInquiryLink'; // ang huling link ng inquiry page (kasama ang referral), dito ibabalik ang customer

  function readIds() {
    try {
      var list = JSON.parse(localStorage.getItem(IDS_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return null; // hindi mabasa ang storage (private mode o naka-block)
    }
  }

  var SESSION_KEY = 'krSession'; // session token gikan sa server (human ma-sign in sa inquiry page)

  function getSession() {
    try { return sessionStorage.getItem(SESSION_KEY) || ''; } catch (err) { return ''; }
  }

  // Ibalik sa inquiry page
  function goBack() {
    var back = 'index.html';
    try {
      var saved = localStorage.getItem(LINK_KEY) || '';
      if (saved.indexOf(location.origin + '/') === 0) back = saved; // sarili nating site lang
    } catch (err) { /* gamitin ang index.html */ }
    document.documentElement.style.visibility = 'hidden';
    location.replace(back);
  }

  return {
    setSession: function (token) {
      try { sessionStorage.setItem(SESSION_KEY, token); } catch (err) { /* wala nang magagawa */ }
    },
    getSession: getSession,
    clearSession: function () {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (err) { /* ayos lang */ }
    },
    back: goBack,
    // Tinatawag ng inquiry page kapag gumawa ng link papunta sa application o cod
    mark: function (inquiryId) {
      try {
        var list = readIds() || [];
        if (list.indexOf(inquiryId) === -1) list.push(inquiryId);
        localStorage.setItem(IDS_KEY, JSON.stringify(list.slice(-20)));
        localStorage.setItem(LINK_KEY, location.href);
      } catch (err) { /* wala nang magagawa */ }
    },
    // Tinatawag ng application at cod pages sa simula. Kung hindi dumaan sa inquiry page, ibabalik doon.
    check: function (inquiryId) {
      var list = readIds();
      var idOk = (list === null) || (inquiryId && list.indexOf(inquiryId) !== -1);
      if (idOk && getSession()) return true; // kinahanglan naay session gikan sa sign-in sa inquiry page
      goBack();
      return false;
    }
  };
})();
