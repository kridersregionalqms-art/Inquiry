// ===== DOB Picker: 3 dropdowns (Month/Day/Year) kapuli sa <input type="date"> para sa birthdates =====
// Isa ra ka file para sa application.html ug cod.html.
var DobPicker = (function () {
  var MONTHS = ['January','February','March','April','May','June','July','August',
    'September','October','November','December'];

  function daysInMonth(month, year) { return new Date(year, month, 0).getDate(); } // month: 1-12
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  // containerId: div nga lalagyan sa 3 dropdown. hiddenInputId: ang naa nang <input> (himuon tagong 'hidden',
  // dinhi gihapon gikuha ang value sa FormData sa submit, walay lain nga balhinon sa form-handling code).
  function init(containerId, hiddenInputId, opts) {
    opts = opts || {};
    var minAge = opts.minAge || 18;
    var maxAge = opts.maxAge || 100;
    var container = document.getElementById(containerId);
    var hidden = document.getElementById(hiddenInputId);
    hidden.type = 'hidden';

    var thisYear = new Date().getFullYear();
    var maxYear = thisYear - minAge;
    var minYear = thisYear - maxAge;

    var month = document.createElement('select');
    month.innerHTML = '<option value="">Month</option>' +
      MONTHS.map(function (m, i) { return '<option value="' + pad2(i + 1) + '">' + m + '</option>'; }).join('');

    var day = document.createElement('select');
    day.innerHTML = '<option value="">Day</option>';

    var year = document.createElement('select');
    var yearOptions = '<option value="">Year</option>';
    for (var y = maxYear; y >= minYear; y--) yearOptions += '<option value="' + y + '">' + y + '</option>';
    year.innerHTML = yearOptions;

    [month, day, year].forEach(function (s) {
      s.required = true;
      s.style.cssText = 'width:auto; display:inline-block; margin-right:6px; margin-top:4px';
    });

    function rebuildDays() {
      var m = Number(month.value) || 0;
      var y = Number(year.value) || thisYear;
      var count = m ? daysInMonth(m, y) : 31;
      var current = day.value;
      var options = '<option value="">Day</option>';
      for (var d = 1; d <= count; d++) options += '<option value="' + pad2(d) + '">' + d + '</option>';
      day.innerHTML = options;
      if (Number(current) <= count) day.value = current;
    }

    function sync() {
      rebuildDays();
      hidden.value = (month.value && day.value && year.value) ? (year.value + '-' + month.value + '-' + day.value) : '';
      hidden.dispatchEvent(new Event('change', { bubbles: true }));
    }

    month.addEventListener('change', sync);
    day.addEventListener('change', sync);
    year.addEventListener('change', sync);

    container.appendChild(month);
    container.appendChild(day);
    container.appendChild(year);
  }

  return { init: init };
})();
