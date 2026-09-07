var BOT_URL = "http://localhost:3000";
var _syncRetryTimer = null;
var _pendingCookieStr = null;
var _lastPushedCookie = null;
var _lastPushAt = 0;
var _licOK = false;
var _licExpiresAt = 0;
var _licLastOk = 0;
var _licCheckInflight = false;
var LIC_GRACE_MS = 86400000;
var LIC_RECHECK_MS = 300000;
function _now() {
  return Date.now();
}
function licValid() {
  if (_licOK) {
    return true;
  }
  if (_licLastOk && _now() - _licLastOk < LIC_GRACE_MS) {
    return true;
  }
  return false;
}
function _saveLicState() {
  try {
    chrome.storage.local.set({
      licOK: _licOK,
      licExpiresAt: _licExpiresAt,
      licLastOk: _licLastOk
    });
  } catch (v) {}
}
function _loadLicState(fn) {
  try {
    chrome.storage.local.get(["licOK", "licExpiresAt", "licLastOk"], function (err) {
      _licOK = !!err && !!err.licOK;
      _licExpiresAt = err && err.licExpiresAt || 0;
      _licLastOk = err && err.licLastOk || 0;
      if (fn) {
        fn();
      }
    });
  } catch (v) {
    if (fn) {
      fn();
    }
  }
}
function _handshakeOneBot(arg1) {
  return new Promise(function (fn) {
    var flag = false;
    var v = typeof AbortController !== "undefined" ? new AbortController() : null;
    var setTimeoutResult = setTimeout(function () {
      if (!flag) {
        flag = true;
        try {
          if (v) {
            v.abort();
          }
        } catch (v2) {}
        fn(null);
      }
    }, 3000);
    fetch("http://localhost:" + arg1 + "/api/extension/handshake", {
      method: "GET",
      signal: v ? v.signal : undefined
    }).then(function (res) {
      if (res.ok) {
        return res.json();
      } else {
        return null;
      }
    }).then(function (res) {
      if (flag) {
        return;
      }
      flag = true;
      clearTimeout(setTimeoutResult);
      fn(res && res.ok ? Object.assign({
        port: arg1
      }, res) : null);
    }).catch(function () {
      if (!flag) {
        flag = true;
        clearTimeout(setTimeoutResult);
        fn(null);
      }
    });
  });
}
function checkLicense() {
  if (_licCheckInflight) {
    return Promise.resolve(licValid());
  }
  _licCheckInflight = true;
  var list = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3020, 3021, 3022];
  if (BOT_URL) {
    var matched = BOT_URL.match(/:(\d+)/);
    if (matched) {
      var parseIntResult = parseInt(matched[1], 10);
      list = [parseIntResult].concat(list.filter(function (item) {
        return item !== parseIntResult;
      }));
    }
  }
  return Promise.all(list.map(_handshakeOneBot)).then(function (err) {
    _licCheckInflight = false;
    var lic = err.filter(function (item) {
      return item !== null;
    })[0];
    if (lic) {
      _licOK = true;
      _licLastOk = _now();
      _licExpiresAt = lic.expiresAt || 0;
      BOT_URL = "http://localhost:" + lic.port;
      _saveLicState();
      try {
        chrome.storage.local.set({
          licStatus: "active",
          botUrl: BOT_URL
        });
      } catch (v) {}
      return true;
    }
    _licOK = false;
    _saveLicState();
    if (licValid()) {
      try {
        chrome.storage.local.set({
          licStatus: "grace"
        });
      } catch (v) {}
      return true;
    }
    try {
      chrome.storage.local.set({
        licStatus: "dormant",
        lastError: "No licensed bot reachable on localhost — start your bot."
      });
    } catch (v) {}
    return false;
  });
}
setInterval(checkLicense, LIC_RECHECK_MS);
_loadLicState(function () {
  checkLicense();
});
function getAllEldoradoCookies() {
  return new Promise(function (fn) {
    chrome.cookies.getAll({
      domain: "eldorado.gg"
    }, function (err) {
      var mapped = (err || []).map(function (item) {
        return item.name + "=" + item.value;
      });
      fn(mapped.join("; "));
    });
  });
}
function extractMinsLeft(arg1) {
  try {
    var matched = (arg1 || "").match(/__Host-EldoradoIdToken=([^;]+)/);
    if (!matched) {
      return 0;
    }
    var v = matched[1];
    var list = v.split(".")[1];
    while (list.length % 4) {
      list += "=";
    }
    var parsed = JSON.parse(atob(list));
    if (!parsed.exp) {
      return 0;
    }
    return Math.max(0, Math.round((parsed.exp - Date.now() / 1000) / 60));
  } catch (v2) {
    return 0;
  }
}
function extractEmail(arg1) {
  try {
    var matched = (arg1 || "").match(/__Host-EldoradoIdToken=([^;]+)/);
    if (!matched) {
      return "";
    }
    var list = matched[1].split(".")[1];
    while (list.length % 4) {
      list += "=";
    }
    var parsed = JSON.parse(atob(list));
    return parsed.email || "";
  } catch (v) {
    return "";
  }
}
function pushCookiesToBot(arg1, arg2) {
  arg2 = arg2 || 0;
  var list = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3020, 3021, 3022];
  var mapped = list.map(function (item) {
    return fetch("http://localhost:" + item + "/api/cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cookieString: arg1
      })
    }).then(function (res) {
      if (res.ok) {
        return item;
      } else {
        return null;
      }
    }).catch(function () {
      return null;
    });
  });
  return Promise.all(mapped).then(function (err) {
    var filtered = err.filter(function (item) {
      return item !== null;
    });
    if (filtered.length > 0) {
      BOT_URL = "http://localhost:" + filtered[0];
      chrome.storage.local.set({
        botUrl: BOT_URL,
        botsFed: filtered.length
      });
      _pendingCookieStr = null;
      _lastPushedCookie = arg1;
      _lastPushAt = Date.now();
      clearTimeout(_syncRetryTimer);
      return {
        ok: true,
        delivered: filtered
      };
    }
    if (arg2 < 5) {
      _pendingCookieStr = arg1;
      var v = Math.min((arg2 + 1) * 10000, 60000);
      clearTimeout(_syncRetryTimer);
      _syncRetryTimer = setTimeout(function () {
        if (_pendingCookieStr) {
          pushCookiesToBot(_pendingCookieStr, arg2 + 1);
        }
      }, v);
      chrome.storage.local.set({
        syncStatus: "bot_offline",
        lastError: "Bot offline — retrying in " + Math.round(v / 1000) + "s (attempt " + (arg2 + 1) + "/5)"
      });
    } else {
      chrome.storage.local.set({
        syncStatus: "bot_offline",
        lastError: "Bot offline after 5 retries — start the dashboard first"
      });
    }
    return {
      ok: false
    };
  });
}
function sync(arg1) {
  if (!licValid()) {
    chrome.storage.local.set({
      syncStatus: "dormant",
      lastError: "Extension inactive — needs a licensed bot running on localhost."
    });
    checkLicense();
    return;
  }
  chrome.storage.local.set({
    syncStatus: "syncing"
  });
  getAllEldoradoCookies().then(function (err) {
    if (!err || err.indexOf("EldoradoIdToken") === -1) {
      chrome.storage.local.set({
        syncStatus: "no_cookies",
        lastError: "Not logged in yet — open eldorado.gg and log in"
      });
      return;
    }
    var extractMinsLeftResult = extractMinsLeft(err);
    var extractEmailResult = extractEmail(err);
    chrome.storage.local.set({
      minsLeft: extractMinsLeftResult,
      email: extractEmailResult
    });
    if (err === _lastPushedCookie && Date.now() - _lastPushAt < 10000 && arg1 !== "manual") {
      return;
    }
    pushCookiesToBot(err).then(function (res) {
      if (res && res.ok) {
        chrome.storage.local.set({
          syncStatus: "ok",
          lastSync: Date.now(),
          lastError: null,
          minsLeft: extractMinsLeftResult
        });
        if (arg1 === "manual") {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "icon48.png",
            title: "Synced",
            message: "Token: " + extractMinsLeftResult + " min left"
          });
        }
      } else {
        chrome.storage.local.set({
          syncStatus: "bot_error",
          lastError: res && res.error || "Bot returned error"
        });
      }
    }).catch(function () {});
  });
}
chrome.alarms.create("eldobot_sync", {
  periodInMinutes: 10
});
chrome.alarms.onAlarm.addListener(function (evt) {
  if (evt.name === "eldobot_sync") {
    checkLicense().then(function () {
      sync("auto");
    });
  }
});
chrome.cookies.onChanged.addListener(function (evt) {
  var v = evt.cookie.name;
  if (v === "__Host-EldoradoIdToken" && !evt.removed) {
    setTimeout(function () {
      sync("cookie_change");
    }, 800);
  }
});
chrome.tabs.onUpdated.addListener(function (evt, arg2, req) {
  if (arg2.status === "complete" && req.url && req.url.indexOf("eldorado.gg") !== -1) {
    setTimeout(function () {
      sync("tab_load");
    }, 1500);
  }
});
function forwardObservation(arg1, arg2) {
  if (!arg1) {
    return;
  }
  var list = [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010, 3020, 3021, 3022];
  if (BOT_URL) {
    var matched = BOT_URL.match(/:(\d+)/);
    if (matched) {
      var parseIntResult = parseInt(matched[1], 10);
      list = [parseIntResult].concat(list.filter(function (item) {
        return item !== parseIntResult;
      }));
    }
  }
  var json = JSON.stringify({
    url: arg1,
    ts: arg2 || Date.now()
  });
  var num = 0;
  function fn() {
    if (num >= list.length) {
      return;
    }
    fetch("http://localhost:" + list[num] + "/api/observe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: json
    }).then(function (res) {
      if (res.ok) {
        BOT_URL = "http://localhost:" + list[num];
        chrome.storage.local.set({
          botUrl: BOT_URL
        });
      } else {
        num++;
        fn();
      }
    }).catch(function () {
      num++;
      fn();
    });
  }
  fn();
}
chrome.runtime.onMessage.addListener(function (req, arg2, fn) {
  if (req.action === "sync") {
    sync("manual");
    fn({
      ok: true
    });
  }
  if (req.action === "forceReconnect") {
    _lastPushedCookie = null;
    _lastPushAt = 0;
    sync("manual");
    fn({
      ok: true
    });
  }
  if (req.action === "getStatus") {
    chrome.storage.local.get(null, function (err) {
      fn(err);
    });
    return true;
  }
  if (req.action === "setBotUrl") {
    BOT_URL = req.url;
    chrome.storage.local.set({
      botUrl: req.url
    });
    fn({
      ok: true
    });
  }
  if (req.action === "observeUrl" && req.url) {
    forwardObservation(req.url, req.ts);
    fn({
      ok: true
    });
  }
});
chrome.runtime.onInstalled.addListener(function () {
  setTimeout(function () {
    sync("install");
  }, 2000);
});
chrome.runtime.onStartup.addListener(function () {
  setTimeout(function () {
    sync("startup");
  }, 3000);
});