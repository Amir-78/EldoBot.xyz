var os = require("os");
var crypto = require("crypto");
var https = require("https");
var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var _IS_PKG = typeof process !== "undefined" && !!process.pkg;
var _LU_A = "https://eldo";
var _LU_B = "bot.xyz";
var _SS_A = "406a003c8b95d6bc6356cb1b616e82ed";
var _SS_B = "86ee5504d35298cccbd6240a1e0f40bc";
var _LICENSE_URL_BAKED = _LU_A + _LU_B;
var _SHARED_SECRET_BAKED = _SS_A + _SS_B;
var LICENSE_URL = _IS_PKG ? _LICENSE_URL_BAKED : process.env.ELDOBOT_LICENSE_URL || _LICENSE_URL_BAKED;
var SHARED_SECRET = _IS_PKG ? _SHARED_SECRET_BAKED : process.env.ELDOBOT_LICENSE_SECRET || _SHARED_SECRET_BAKED;
var PRODUCT = "VAL";
var _baseDir = typeof process !== "undefined" && process.pkg ? path.dirname(process.execPath) : __dirname;
var KEY_FILE = path.join(_baseDir, "license.key");
var GRACE_FILE = path.join(_baseDir, ".lic_grace");
var _VIRTUAL_NAME_RE = /(virtual|vmnet|vmware|virtualbox|vbox|hyper-?v|docker|wsl|loopback|tap|tun|vethernet|hamachi|bluetooth|wireguard|openvpn|nordlynx|proton|pptp|softether|teredo|isatap)/i;
function _collectMacs() {
  var ifaces = os.networkInterfaces();
  var macs = [];
  Object.keys(ifaces).forEach(function (ifName) {
    if (_VIRTUAL_NAME_RE.test(ifName)) {
      return;
    }
    var entries = ifaces[ifName] || [];
    entries.forEach(function (addr) {
      if (addr.internal) {
        return;
      }
      if (!addr.mac || addr.mac === "00:00:00:00:00:00") {
        return;
      }
      macs.push(addr.mac.toLowerCase());
    });
  });
  macs = Array.from(new Set(macs)).sort();
  return macs;
}
function getHWID() {
  var macList = _collectMacs();
  var macHash = macList.length ? crypto.createHash("sha256").update(macList.join(",")).digest("hex").slice(0, 16) : "no-mac";
  var cpuModel = os.cpus()[0] && os.cpus()[0].model || "unknown";
  var hwidParts = [os.hostname(), macHash, cpuModel, os.platform(), os.arch()].join("|");
  return crypto.createHash("sha256").update(hwidParts).digest("hex").slice(0, 32);
}
function getMachineId() {
  var midCpu = os.cpus()[0] && os.cpus()[0].model || "unknown";
  var midParts = ["m1", os.hostname(), midCpu, os.platform(), os.arch()].join("|");
  return crypto.createHash("sha256").update(midParts).digest("hex").slice(0, 24);
}
function readKey() {
  try {
    return fs.readFileSync(KEY_FILE, "utf8").trim();
  } catch (e6) {
    return "";
  }
}
function postJson(endpoint, reqBody) {
  return new Promise(function (resolve, reject) {
    var parsed = url.parse(endpoint);
    var transport = parsed.protocol === "https:" ? https : http;
    var payload = JSON.stringify(reqBody);
    var httpReq = transport.request({
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload)
      },
      timeout: 12000
    }, function (httpRes) {
      var chunks = [];
      httpRes.on("data", function (chunk) {
        chunks.push(chunk);
      });
      httpRes.on("end", function () {
        var text = Buffer.concat(chunks).toString("utf8");
        try {
          resolve({
            status: httpRes.statusCode,
            body: JSON.parse(text)
          });
        } catch (e5) {
          var rawBody = {
            raw: text
          };
          var parseFallback = {
            status: httpRes.statusCode,
            body: rawBody
          };
          resolve(parseFallback);
        }
      });
    });
    httpReq.on("error", reject);
    httpReq.on("timeout", function () {
      httpReq.destroy(new Error("timeout"));
    });
    httpReq.write(payload);
    httpReq.end();
  });
}
function sign(data) {
  return crypto.createHmac("sha256", SHARED_SECRET).update(JSON.stringify(data)).digest("hex");
}
function writeGrace(ok) {
  try {
    if (ok) {
      fs.writeFileSync(GRACE_FILE, JSON.stringify({
        lastOk: Date.now()
      }));
    }
  } catch (e2) {}
}
function readGrace() {
  try {
    return JSON.parse(fs.readFileSync(GRACE_FILE, "utf8"));
  } catch (e3) {
    return null;
  }
}
function _isDefinitive(msg) {
  return /expired|revoked|unknown key|bad signature|hwid mismatch|missing fields|clock skew|replay/i.test(msg || "");
}
function validate() {
  var licKey = readKey();
  if (!licKey) {
    return Promise.reject(new Error("Missing license.key file. Place your purchased key in license.key next to the bot."));
  }
  var hwid = getHWID();
  var nonce = crypto.randomBytes(16).toString("hex");
  var req = {
    key: licKey,
    hwid: hwid,
    nonce: nonce,
    ts: Date.now(),
    v: 1,
    product: PRODUCT,
    machineId: getMachineId()
  };
  req.sig = sign({
    key: req.key,
    hwid: req.hwid,
    nonce: req.nonce,
    ts: req.ts
  });
  return postJson(LICENSE_URL.replace(/\/$/, "") + "/validate", req).then(function (res) {
    if (res.status === 200 && res.body && res.body.ok) {
      writeGrace(true);
      _expiresAt = res.body.expiresAt || 0;
      _lastOk = Date.now();
      var validResult = {
        ok: true,
        expiresAt: res.body.expiresAt || 0,
        plan: res.body.plan || "",
        latestVersion: res.body.latestVersion || ""
      };
      return validResult;
    }
    var reason = res.body && (res.body.error || res.body.reason) || "HTTP " + res.status;
    if (_isDefinitive(reason) || res.status === 403 || res.status === 401 || res.status === 404) {
      try {
        fs.unlinkSync(GRACE_FILE);
      } catch (e1) {}
      _expiresAt = 1;
      _lastOk = 0;
    }
    throw new Error("License rejected: " + reason);
  }).catch(function (err) {
    if (err && /ECONN|ENOTFOUND|timeout|EAI_AGAIN|EHOSTUNREACH|socket hang up/i.test(err.message)) {
      var grace = readGrace();
      if (grace && grace.lastOk && Date.now() - grace.lastOk < 172800000) {
        _lastOk = Date.now();
        return {
          ok: true,
          grace: true,
          expiresAt: _expiresAt || 0
        };
      }
    }
    throw err;
  });
}
var _lastOk = 0;
var _expiresAt = 0;
var _lastFailReason = "";
var _consecutiveFails = 0;
function startWatchdog(onFail) {
  function check() {
    validate().then(function (okResult) {
      _lastOk = Date.now();
      _expiresAt = okResult.expiresAt || _expiresAt || 0;
      _lastFailReason = "";
      _consecutiveFails = 0;
    }).catch(function (watchErr) {
      _lastFailReason = watchErr.message || String(watchErr);
      if (_isDefinitive(_lastFailReason)) {
        onFail(_lastFailReason);
        return;
      }
      _consecutiveFails++;
      if (_consecutiveFails >= 2) {
        onFail(_lastFailReason);
      }
    });
  }
  _lastOk = Date.now();
  setInterval(check, 600000);
}
function isValid() {
  if (!_lastOk) {
    return false;
  }
  if (_expiresAt > 0 && Date.now() >= _expiresAt) {
    return false;
  }
  if (Date.now() - _lastOk > 43200000) {
    return false;
  }
  return true;
}
function expiresAt() {
  return _expiresAt;
}
function sendTelemetry(info) {
  try {
    var telKey = readKey();
    if (!telKey) {
      return;
    }
    var now = Date.now();
    var telemetry = {
      key: telKey,
      ts: now,
      version: info && info.version || "",
      online: true,
      stats: info && info.stats || {},
      lastOrderAt: info && info.lastOrderAt || 0
    };
    var body = telemetry;
    var telSignFields = {
      key: body.key,
      ts: body.ts,
      version: body.version,
      stats: body.stats
    };
    var telSignAlias = telSignFields;
    body.sig = sign(telSignAlias);
    postJson(LICENSE_URL.replace(/\/$/, "") + "/telemetry", body).catch(function () {});
  } catch (e4) {}
}
module.exports = {
  validate: validate,
  startWatchdog: startWatchdog,
  getHWID: getHWID,
  isValid: isValid,
  expiresAt: expiresAt,
  sendTelemetry: sendTelemetry
};
module.exports = moduleExports;
