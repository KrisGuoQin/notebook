function refreshRem() {
  var e = docEl.getBoundingClientRect().width,
    t = docEl.getBoundingClientRect().height;
  if (e / t > 750 / 1334) var i = t / 26.68;
  else var i = e / 15;
  docEl.style.fontSize = i + "px";
}
var win = window,
  doc = win.document,
  docEl = doc.documentElement,
  tid;
win.addEventListener(
  "resize",
  function () {
    clearTimeout(tid), (tid = setTimeout(refreshRem, 300));
  },
  !1
),
  win.addEventListener(
    "pageshow",
    function (e) {
      e.persisted && (clearTimeout(tid), (tid = setTimeout(refreshRem, 300)));
    },
    !1
  ),
  refreshRem();
