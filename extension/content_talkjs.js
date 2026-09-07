(function () {
  var opts = {};
  function fn(arg1) {
    if (typeof arg1 !== "string" || !arg1) {
      return;
    }
    var now = Date.now();
    if (opts[arg1] && now - opts[arg1] < 60000) {
      return;
    }
    opts[arg1] = now;
    if (Object.keys(opts).length > 500) {
      var v3 = now - 300000;
      for (var v4 in opts) {
        if (opts[v4] < v3) {
          delete opts[v4];
        }
      }
    }
    try {
      chrome.runtime.sendMessage({
        action: "observeUrl",
        url: arg1,
        ts: now
      }, function () {
        var v5 = chrome.runtime.lastError;
      });
    } catch (v5) {}
  }
  try {
    var v = window.fetch;
    window.fetch = function (req) {
      try {
        var v3 = typeof req === "string" ? req : req && req.url ? req.url : "";
        if (v3) {
          fn(v3);
        }
      } catch (v4) {}
      return v.apply(this, arguments);
    };
  } catch (v3) {}
  try {
    var v2 = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (arg1, arg2) {
      try {
        if (arg2) {
          fn(arg2);
        }
      } catch (v3) {}
      return v2.apply(this, arguments);
    };
  } catch (v3) {}
  function fn2() {
    try {
      var list = document.querySelectorAll("iframe");
      for (var num = 0; num < list.length; num++) {
        if (list[num].src) {
          fn(list[num].src);
        }
      }
    } catch (v3) {}
  }
  setInterval(fn2, 5000);
  try {
    var MutationObserver = new MutationObserver(fn2);
    MutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"]
    });
  } catch (v3) {}
})();