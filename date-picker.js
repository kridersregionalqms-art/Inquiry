// ===== Date Picker: 3 dropdowns (Month/Day/Year) kapuli sa <input type="date"> =====
// General purpose — gamiton sa DOB, release date, bisan unsang date field. Isa ra ka file para sa
// index.html, application.html, ug cod.html.
var DatePicker = (function () {
  var MONTHS = ['January','February','March','April','May','June','July','August',
    'September','October','November','December'];

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function daysInMonth(month, year) { return new Date(year, month, 0).getDate(); } // month: 1-12
  function parseIso(iso) {
    var p = iso.split('-').map(Number);
    return { y: p[0], m: p[1], d: p[2] };
  }

  // containerId: div nga lalagyan sa 3 dropdown. hiddenInputId: naa nang <input>, himuon tagong 'hidden'
  // (dinhi gihapon gikuha ang value sa FormData sa submit). opts: { minDate, maxDate } - 'YYYY-MM-DD'.
  function init(containerId, hiddenInputId, opts) {
    var min = parseIso(opts.minDate);
    var max = parseIso(opts.maxDate);
    var container = document.getElementById(containerId);
    var hidden = document.getElementById(hiddenInputId);
    hidden.type = 'hidden';

    var month = document.createElement('select');
    var day = document.createElement('select');
    var year = document.createElement('select');
    [month, day, year].forEach(function (s) {
      s.required = true;
      s.style.cssText = 'width:auto; display:inline-block; margin-right:6px; margin-top:4px';
    });

    var yearOptions = '<option value="">Year</option>';
    for (var y = min.y; y <= max.y; y++) yearOptions += '<option value="' + y + '">' + y + '</option>';
    year.innerHTML = yearOptions;

    function monthRange() {
      var y = Number(year.value);
      if (!y) return [1, 12];
      return [y === min.y ? min.m : 1, y === max.y ? max.m : 12];
    }
    function rebuildMonths() {
      var range = monthRange();
      var current = month.value;
      var options = '<option value="">Month</option>';
      for (var m = range[0]; m <= range[1]; m++) options += '<option value="' + pad2(m) + '">' + MONTHS[m - 1] + '</option>';
      month.innerHTML = options;
      if (Number(current) >= range[0] && Number(current) <= range[1]) month.value = current;
    }

    function dayRange() {
      var y = Number(year.value), m = Number(month.value);
      if (!y || !m) return [1, 31];
      var lo = (y === min.y && m === min.m) ? min.d : 1;
      var hi = (y === max.y && m === max.m) ? max.d : daysInMonth(m, y);
      return [lo, hi];
    }
    function rebuildDays() {
      var range = dayRange();
      var current = day.value;
      var options = '<option value="">Day</option>';
      for (var d = range[0]; d <= range[1]; d++) options += '<option value="' + pad2(d) + '">' + d + '</option>';
      day.innerHTML = options;
      if (Number(current) >= range[0] && Number(current) <= range[1]) day.value = current;
    }

    function sync() {
      rebuildMonths();
      rebuildDays();
      hidden.value = (year.value && month.value && day.value) ? (year.value + '-' + month.value + '-' + day.value) : '';
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
    }

    year.addEventListener('change', sync);
    month.addEventListener('change', sync);
    day.addEventListener('change', sync);

    rebuildMonths();
    rebuildDays();
    container.appendChild(month);
    container.appendChild(day);
    container.appendChild(year);
  }

  return { init: init };
})();
