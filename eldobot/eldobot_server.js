var BOT_VERSION = "1.4.3";
var updateAvailable = false;
var latestVersion = "";
var _licenseExpiry = 0;
var _licenseGrace = false;
var _licClient = null;
var https = require("https");
var http = require("http");
var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var DELIVERY_OPTIONS = [{
  label: "20 min",
  value: 0,
  enum: "Minute20"
}, {
  label: "1 hour",
  value: 1,
  enum: "Hour1"
}, {
  label: "2 hours",
  value: 2,
  enum: "Hour2"
}, {
  label: "3 hours",
  value: 3,
  enum: "Hour3"
}, {
  label: "5 hours",
  value: 4,
  enum: "Hour5"
}, {
  label: "8 hours",
  value: 5,
  enum: "Hour8"
}, {
  label: "12 hours",
  value: 6,
  enum: "Hour12"
}, {
  label: "1 day",
  value: 7,
  enum: "Day1"
}, {
  label: "2 days",
  value: 8,
  enum: "Day2"
}, {
  label: "3 days",
  value: 9,
  enum: "Day3"
}, {
  label: "7 days",
  value: 10,
  enum: "Day7"
}, {
  label: "14 days",
  value: 11,
  enum: "Day14"
}];
var DISCORD_WEBHOOK = "";
var DISCORD_MSG_WEBHOOK = "";
var TELEGRAM_BOT_TOKEN = "";
var TELEGRAM_CHAT_IDS = "";
var CONFIG = {
  cookieString: "",
  idToken: "",
  email: "",
  acceptNA: true,
  acceptEU: true,
  acceptLATAM: true,
  acceptAP: true,
  slowMode: false,
  acceptNetWinsEU: true,
  acceptNetWinsNA: true,
  acceptNetWinsLATAM: true,
  acceptNetWinsAP: true,
  acceptEUDuo: true,
  acceptNADuo: true,
  acceptLATAMDuo: true,
  acceptAPDuo: true,
  acceptEUAsc1: true,
  acceptEUAsc2: true,
  acceptEUAsc3: true,
  acceptNAAsc1: true,
  acceptNAAsc2: true,
  acceptNAAsc3: true,
  acceptLATAMAsc1: true,
  acceptLATAMAsc2: true,
  acceptLATAMAsc3: true,
  acceptAPAsc1: true,
  acceptAPAsc2: true,
  acceptAPAsc3: true,
  acceptEUAsc1Duo: true,
  acceptEUAsc2Duo: true,
  acceptEUAsc3Duo: true,
  acceptNAAsc1Duo: true,
  acceptNAAsc2Duo: true,
  acceptNAAsc3Duo: true,
  acceptLATAMAsc1Duo: true,
  acceptLATAMAsc2Duo: true,
  acceptLATAMAsc3Duo: true,
  acceptAPAsc1Duo: true,
  acceptAPAsc2Duo: true,
  acceptAPAsc3Duo: true,
  acceptEUImmo1: false,
  acceptEUImmo2: false,
  acceptEUImmo3: false,
  acceptEURadiant: false,
  acceptNAImmo1: false,
  acceptNAImmo2: false,
  acceptNAImmo3: false,
  acceptNARadiant: false,
  acceptLATAMImmo1: false,
  acceptLATAMImmo2: false,
  acceptLATAMImmo3: false,
  acceptLATAMRadiant: false,
  acceptAPImmo1: false,
  acceptAPImmo2: false,
  acceptAPImmo3: false,
  acceptAPRadiant: false,
  acceptEUImmo1Duo: false,
  acceptEUImmo2Duo: false,
  acceptEUImmo3Duo: false,
  acceptEURadiantDuo: false,
  acceptNAImmo1Duo: false,
  acceptNAImmo2Duo: false,
  acceptNAImmo3Duo: false,
  acceptNARadiantDuo: false,
  acceptLATAMImmo1Duo: false,
  acceptLATAMImmo2Duo: false,
  acceptLATAMImmo3Duo: false,
  acceptLATAMRadiantDuo: false,
  acceptAPImmo1Duo: false,
  acceptAPImmo2Duo: false,
  acceptAPImmo3Duo: false,
  acceptAPRadiantDuo: false,
  skipCustomEU: false,
  skipCustomNA: false,
  skipCustomLATAM: false,
  skipCustomAP: false,
  autoOffer: true,
  autoMessage: true,
  activeProfile: 1,
  deliveryEnumValue: 9,
  naMultiplier: 2,
  latamMultiplier: 1.15,
  apMultiplier: 1.15,
  cooldownSeconds: 0,
  offerCooldown: 30,
  messageTemplate: "Hey {username}! I can boost your account from {currentRank} to {desiredRank} on {server}. Fast & reliable, message me!",
  discordWebhook: "",
  discordMessageWebhook: "",
  telegramBotToken: "",
  telegramChatID: "",
  telegramOnPaidOrder: true,
  telegramOnOfferSent: false,
  telegramOnImmortal: true,
  telegramOnError: false,
  telegramMinRank: "",
  telegramServerEU: true,
  telegramServerNA: true,
  telegramServerLATAM: true,
  telegramServerAP: true,
  prorateRR: false,
  talkjsNymOverride: "",
  messageImageURL: ""
};
var TIER_PRICES_EU = {
  iron: 4,
  bronze: 7,
  silver: 6,
  gold: 9,
  platinum: 12,
  diamond: 12,
  ascendant: 16,
  immortal: 0
};
var TIER_PRICES_NA = {
  iron: 8,
  bronze: 14,
  silver: 12,
  gold: 18,
  platinum: 24,
  diamond: 24,
  ascendant: 32,
  immortal: 0
};
var NETWIN_PRICES_EU = {
  iron: 2,
  bronze: 3,
  silver: 3,
  gold: 4,
  platinum: 5,
  diamond: 6,
  ascendant: 15,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
var NETWIN_PRICES_NA = {
  iron: 4,
  bronze: 6,
  silver: 6,
  gold: 8,
  platinum: 10,
  diamond: 12,
  ascendant: 15,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
var NETWIN_HOURS = {
  iron: 1,
  bronze: 1,
  silver: 1,
  gold: 1.5,
  platinum: 2,
  diamond: 2,
  ascendant: 3,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
var TIER_PRICES_LATAM = {
  iron: 5,
  bronze: 8,
  silver: 7,
  gold: 10,
  platinum: 13,
  diamond: 13,
  ascendant: 18,
  immortal: 0
};
var TIER_PRICES_AP = {
  iron: 5,
  bronze: 8,
  silver: 7,
  gold: 10,
  platinum: 13,
  diamond: 13,
  ascendant: 18,
  immortal: 0
};
var TIER_PRICES_DUO_EU = {
  iron: 3,
  bronze: 5,
  silver: 4,
  gold: 7,
  platinum: 9,
  diamond: 9,
  ascendant: 12,
  immortal: 0
};
var TIER_PRICES_DUO_NA = {
  iron: 6,
  bronze: 11,
  silver: 9,
  gold: 14,
  platinum: 18,
  diamond: 18,
  ascendant: 24,
  immortal: 0
};
var TIER_PRICES_DUO_LATAM = {
  iron: 4,
  bronze: 6,
  silver: 5,
  gold: 8,
  platinum: 10,
  diamond: 10,
  ascendant: 14,
  immortal: 0
};
var TIER_PRICES_DUO_AP = {
  iron: 4,
  bronze: 6,
  silver: 5,
  gold: 8,
  platinum: 10,
  diamond: 10,
  ascendant: 14,
  immortal: 0
};
var NETWIN_PRICES_LATAM = {
  iron: 2,
  bronze: 3,
  silver: 3,
  gold: 4,
  platinum: 5,
  diamond: 6,
  ascendant: 12,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
var NETWIN_PRICES_AP = {
  iron: 2,
  bronze: 3,
  silver: 3,
  gold: 4,
  platinum: 5,
  diamond: 6,
  ascendant: 12,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
var NETWIN_PRICES_DUO_EU = {
  iron: 1.5,
  bronze: 2,
  silver: 2,
  gold: 3,
  platinum: 4,
  diamond: 4.5,
  ascendant: 10,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
var NETWIN_PRICES_DUO_NA = {
  iron: 3,
  bronze: 4.5,
  silver: 4.5,
  gold: 6,
  platinum: 7.5,
  diamond: 9,
  ascendant: 12,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
var NETWIN_PRICES_DUO_LATAM = {
  iron: 1.5,
  bronze: 2,
  silver: 2,
  gold: 3,
  platinum: 4,
  diamond: 4.5,
  ascendant: 9,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
var NETWIN_PRICES_DUO_AP = {
  iron: 1.5,
  bronze: 2,
  silver: 2,
  gold: 3,
  platinum: 4,
  diamond: 4.5,
  ascendant: 9,
  immortal_1: 0,
  immortal_2: 0,
  immortal_3: 0,
  radiant: 0
};
function getNWRankKey(arg1) {
  var opts = {
    "Immortal I": "immortal_1",
    "Immortal II": "immortal_2",
    "Immortal III": "immortal_3",
    Radiant: "radiant"
  };
  if (opts[arg1]) {
    return opts[arg1];
  }
  var RankIdx = getRankIdx(arg1);
  if (RankIdx >= 0) {
    return RANK_LIST[RankIdx].tier || "iron";
  } else {
    return "iron";
  }
}
var TIER_HOURS = {
  iron: 4,
  bronze: 5,
  silver: 5,
  gold: 6,
  platinum: 8,
  diamond: 8,
  ascendant: 12,
  immortal: 0
};
var IMMO_RR_PRICES = {
  EU: 25,
  NA: 50,
  LATAM: 30,
  AP: 30
};
var IMMO_RR_PRICES_DUO = {
  EU: 19,
  NA: 38,
  LATAM: 23,
  AP: 23
};
var IMMO_RR_HOURS = {
  EU: 6,
  NA: 8,
  LATAM: 7,
  AP: 7
};
var IMMO_TIER_BASE = {
  "Immortal I": 0,
  "Immortal II": 100,
  "Immortal III": 200,
  Radiant: 400
};
function immoTotalRR(arg1, arg2) {
  var v = IMMO_TIER_BASE[arg1];
  if (v === undefined) {
    return 0;
  }
  var v2 = Number(arg2) || 0;
  if (v2 >= v) {
    return v2;
  }
  return v + Math.max(0, Math.min(v2, 99));
}
var CROSS_TIER_PRICES = {
  "Iron I_Bronze I": 8,
  "Iron I_Silver I": 20,
  "Iron I_Gold I": 38,
  "Iron I_Platinum I": 74,
  "Bronze I_Silver I": 12,
  "Bronze I_Gold I": 30,
  "Bronze I_Platinum I": 66,
  "Silver I_Gold I": 18,
  "Silver I_Platinum I": 54,
  "Silver I_Diamond I": 90,
  "Gold I_Platinum I": 36,
  "Gold I_Diamond I": 72,
  "Gold I_Ascendant I": 144,
  "Platinum I_Diamond I": 36,
  "Platinum I_Ascendant I": 108,
  "Diamond I_Ascendant I": 48,
  "Diamond I_Immortal I": 120,
  "Ascendant I_Immortal I": 80,
  "Ascendant II_Immortal I": 64,
  "Ascendant III_Immortal I": 48,
  "Immortal I_Immortal II": 50,
  "Immortal I_Immortal III": 100,
  "Immortal I_Radiant": 200,
  "Immortal II_Immortal III": 50,
  "Immortal II_Radiant": 150,
  "Immortal III_Radiant": 100
};
var CUSTOM_RULES = [];
function hasCustomRule(arg1, arg2, arg3) {
  var v = (arg3 || "any").toUpperCase();
  for (var num = 0; num < CUSTOM_RULES.length; num++) {
    var v2 = CUSTOM_RULES[num];
    var v3 = (v2.server || "any").toUpperCase();
    if (v2.from === arg1 && v2.to === arg2 && (v3 === v || v3 === "" || v3 === "ANY" || !v2.server)) {
      return true;
    }
  }
  return false;
}
var RANK_LIST = [{
  label: "Iron I",
  tier: "iron"
}, {
  label: "Iron II",
  tier: "iron"
}, {
  label: "Iron III",
  tier: "iron"
}, {
  label: "Bronze I",
  tier: "bronze"
}, {
  label: "Bronze II",
  tier: "bronze"
}, {
  label: "Bronze III",
  tier: "bronze"
}, {
  label: "Silver I",
  tier: "silver"
}, {
  label: "Silver II",
  tier: "silver"
}, {
  label: "Silver III",
  tier: "silver"
}, {
  label: "Gold I",
  tier: "gold"
}, {
  label: "Gold II",
  tier: "gold"
}, {
  label: "Gold III",
  tier: "gold"
}, {
  label: "Platinum I",
  tier: "platinum"
}, {
  label: "Platinum II",
  tier: "platinum"
}, {
  label: "Platinum III",
  tier: "platinum"
}, {
  label: "Diamond I",
  tier: "diamond"
}, {
  label: "Diamond II",
  tier: "diamond"
}, {
  label: "Diamond III",
  tier: "diamond"
}, {
  label: "Ascendant I",
  tier: "ascendant"
}, {
  label: "Ascendant II",
  tier: "ascendant"
}, {
  label: "Ascendant III",
  tier: "ascendant"
}, {
  label: "Immortal I",
  tier: "immortal"
}, {
  label: "Immortal II",
  tier: "immortal"
}, {
  label: "Immortal III",
  tier: "immortal"
}, {
  label: "Radiant",
  tier: "immortal"
}];
function getRankIdx(arg1) {
  if (!arg1) {
    return -1;
  }
  var v = arg1.toLowerCase().trim();
  for (var num = 0; num < RANK_LIST.length; num++) {
    if (RANK_LIST[num].label.toLowerCase() === v) {
      return num;
    }
  }
  return -1;
}
function shiftDelivery(arg1) {
  var list = ["Minute20", "Hour1", "Hour2", "Hour3", "Hour4", "Hour5", "Hour8", "Hour12", "Day1", "Day2", "Day3", "Day7", "Day14"];
  var opts = {
    Hour8: "Day1",
    Hour12: "Day1",
    Day1: "Day2",
    Day2: "Day3",
    Day3: "Day7",
    Day7: "Day14"
  };
  if (CONFIG.activeProfile === 2 && opts[arg1]) {
    return opts[arg1];
  } else {
    return arg1;
  }
}
function calcPrice(arg1, arg2, arg3, arg4, arg5, arg6) {
  var v = (arg4 || "").toUpperCase();
  var v2 = v === "NA" ? TIER_PRICES_NA : v === "LATAM" ? TIER_PRICES_LATAM : v === "AP" ? TIER_PRICES_AP : TIER_PRICES_EU;
  var v3 = v === "NA" ? TIER_PRICES_DUO_NA : v === "LATAM" ? TIER_PRICES_DUO_LATAM : v === "AP" ? TIER_PRICES_DUO_AP : TIER_PRICES_DUO_EU;
  var v4 = arg5 ? v3 : v2;
  var v5 = (arg1 || "").trim().toLowerCase();
  var v6 = (arg3 || "").trim().toLowerCase();
  addLog("Custom rule check: from='" + arg1 + "' to='" + arg3 + "' sv=" + v + " rules=" + CUSTOM_RULES.length, "info");
  var v7 = null;
  var v8 = null;
  var v9 = null;
  for (var num = 0; num < CUSTOM_RULES.length; num++) {
    var v10 = CUSTOM_RULES[num];
    var v11 = (v10.from || "").trim().toLowerCase();
    var v12 = (v10.to || "").trim().toLowerCase();
    if (v11 !== v5 || v12 !== v6) {
      continue;
    }
    var v13 = (v10.server || "").toUpperCase();
    if (v13 === v) {
      v7 = v10;
      break;
    }
    if (v13 === "" || !v10.server || v13 === "ANY") {
      v8 = v8 || v10;
    } else if (v13 === "EU" && (v === "LATAM" || v === "AP")) {
      v9 = v9 || v10;
    }
  }
  var v14 = v7 || v8 || v9;
  if (v14) {
    var v15 = v14.price || 0;
    var v16 = v15;
    if (v14 === v9) {
      var v17 = v === "LATAM" ? Number(CONFIG.latamMultiplier) || 1.15 : Number(CONFIG.apMultiplier) || 1.15;
      v16 = Math.round(v15 * v17 * 100) / 100;
      addLog("📋 EU rule × " + v17 + " ? $" + v16 + " for " + v + " (" + arg1 + "?" + arg3 + ")", "success");
    } else {
      addLog("📋 Custom rule matched: " + arg1 + "?" + arg3 + " (" + v + ") = $" + v16 + " [" + (v14.delivery_enum || "auto") + "]", "success");
    }
    return {
      price: v16,
      deliveryEnum: shiftDelivery(v14.delivery_enum || getDelivery().enum)
    };
  }
  if (CUSTOM_RULES.length > 0) {
    addLog("No rule matched. Rules: " + JSON.stringify(CUSTOM_RULES.map(function (item) {
      return item.from + "?" + item.to + (item.server ? " (" + item.server + ")" : "");
    })), "warn");
  }
  var v18 = arg3 && (arg3.indexOf("Immortal") !== -1 || arg3 === "Radiant");
  var v19 = arg1 && (arg1.indexOf("Immortal") !== -1 || arg1 === "Radiant");
  if (v18 && v19) {
    var v20 = arg5 ? IMMO_RR_PRICES_DUO : IMMO_RR_PRICES;
    var v21 = v20[v] || v20.EU || 25;
    var immoTotalRRResult = immoTotalRR(arg1, arg2);
    var immoTotalRRResult2 = immoTotalRR(arg3, arg6);
    var v22 = Math.max(0, immoTotalRRResult2 - immoTotalRRResult);
    if (v22 === 0) {
      addLog("Immo: from " + arg1 + "(" + immoTotalRRResult + "RR) ? " + arg3 + "(" + immoTotalRRResult2 + "RR) = no jump", "warn");
      return {
        price: 0,
        deliveryEnum: shiftDelivery(getDelivery().enum),
        _immortalBlocked: true
      };
    }
    var v23 = Math.round(v22 / 100 * v21 * 100) / 100;
    var v24 = v22 / 100 * (IMMO_RR_HOURS[v] || IMMO_RR_HOURS.EU || 6);
    var v25 = Math.round(v24);
    var str = "Day3";
    if (v25 <= 1) {
      str = "Hour1";
    } else if (v25 <= 2) {
      str = "Hour2";
    } else if (v25 <= 3) {
      str = "Hour3";
    } else if (v25 <= 5) {
      str = "Hour5";
    } else if (v25 <= 8) {
      str = "Hour8";
    } else if (v25 <= 12) {
      str = "Hour12";
    } else if (v25 <= 24) {
      str = "Day1";
    } else if (v25 <= 48) {
      str = "Day2";
    } else if (v25 <= 72) {
      str = "Day3";
    } else if (v25 <= 168) {
      str = "Day7";
    } else {
      str = "Day14";
    }
    addLog("👑 Immo " + arg1 + "(" + immoTotalRRResult + "RR) ? " + arg3 + "(" + immoTotalRRResult2 + "RR) = " + v22 + "RR × $" + v21 + "/100 = $" + v23 + " [" + v + (arg5 ? " Duo" : "") + "]", "success");
    return {
      price: v23,
      deliveryEnum: shiftDelivery(str),
      hours: v25
    };
  }
  if (v18 || v19) {
    return {
      price: 0,
      deliveryEnum: shiftDelivery(getDelivery().enum),
      _immortalBlocked: true
    };
  }
  var RankIdx = getRankIdx(arg1);
  var RankIdx2 = getRankIdx(arg3);
  if (RankIdx < 0 || RankIdx2 < 0 || RankIdx >= RankIdx2) {
    return {
      price: 0,
      deliveryEnum: shiftDelivery(getDelivery().enum)
    };
  }
  var num2 = 0;
  var num3 = 0;
  var v26 = RANK_LIST[RankIdx].tier;
  var v27 = v4[v26] || 0;
  if (v26 === "immortal" && v27 === 0) {
    var flag = true;
    for (var v28 = RankIdx; v28 < RankIdx2; v28++) {
      if (RANK_LIST[v28].tier !== "immortal") {
        flag = false;
        break;
      }
    }
    if (flag) {
      return {
        price: 0,
        deliveryEnum: shiftDelivery(getDelivery().enum)
      };
    }
  }
  for (var v29 = RankIdx; v29 < RankIdx2; v29++) {
    var v30 = RANK_LIST[v29].tier;
    var v31 = v4[v30] || 0;
    if (v29 === RankIdx && CONFIG.prorateRR && v31 > 0) {
      var v32 = Number(arg2) || 0;
      if (v32 < 10) {
        v32 = 0;
      } else if (v32 > 84) {
        v32 = 84;
      }
      v31 = v31 * (100 - v32) / 100;
    }
    num2 += v31;
    num3 += TIER_HOURS[v30] || 0;
  }
  num2 = Math.round(num2 * 100) / 100;
  var v33 = Math.round(num3);
  var str2 = "Day3";
  if (v33 <= 0) {
    str2 = "Minute20";
  } else if (v33 <= 1) {
    str2 = "Hour1";
  } else if (v33 <= 2) {
    str2 = "Hour2";
  } else if (v33 <= 3) {
    str2 = "Hour3";
  } else if (v33 <= 5) {
    str2 = "Hour5";
  } else if (v33 <= 8) {
    str2 = "Hour8";
  } else if (v33 <= 12) {
    str2 = "Hour12";
  } else if (v33 <= 24) {
    str2 = "Day1";
  } else if (v33 <= 48) {
    str2 = "Day2";
  } else if (v33 <= 72) {
    str2 = "Day3";
  } else if (v33 <= 168) {
    str2 = "Day7";
  } else {
    str2 = "Day14";
  }
  return {
    price: num2,
    deliveryEnum: shiftDelivery(str2),
    hours: v33
  };
}
var botRunning = false;
var pollTimer = null;
var onlineTimer = null;
var processed = {};
var activity = [];
var logs = [];
var pollCount = 0;
setInterval(function () {
  try {
    var v = Object.keys(processed).length;
    if (v > 10000) {
      processed = {};
      addLog("🧹 processed cache cleared (" + v + " entries)", "info");
    }
  } catch (v2) {}
}, 1800000);
var stats = {
  seen: 0,
  offered: 0,
  messaged: 0,
  skipped: 0,
  errors: 0,
  revenue: 0
};
function startTelemetry() {
  function fn() {
    try {
      if (!_licClient || typeof _licClient.sendTelemetry !== "function") {
        return;
      }
      _licClient.sendTelemetry({
        version: BOT_VERSION,
        lastOrderAt: typeof _lastOrderAt !== "undefined" ? _lastOrderAt : 0,
        stats: {
          seen: (stats.seen || 0) | 0,
          offered: (stats.offered || 0) | 0,
          messaged: (stats.messaged || 0) | 0,
          skipped: (stats.skipped || 0) | 0,
          errors: (stats.errors || 0) | 0,
          revenue: Math.round((stats.revenue || 0) * 100) / 100,
          botRunning: !!botRunning
        }
      });
    } catch (v) {}
  }
  setTimeout(fn, 30000);
  setInterval(fn, 600000);
}
var _lastOrderAt = 0;
var STATS_HISTORY_FILE = "stats_history.json";
var statsHistory = [];
var _todayKey = "";
function _dateKey(arg1) {
  arg1 = arg1 || new Date();
  var FullYear = arg1.getFullYear();
  var v = String(arg1.getMonth() + 1).padStart(2, "0");
  var v2 = String(arg1.getDate()).padStart(2, "0");
  return FullYear + "-" + v + "-" + v2;
}
function loadStatsHistory() {
  try {
    if (fs.existsSync(STATS_HISTORY_FILE)) {
      var fileData = fs.readFileSync(STATS_HISTORY_FILE, "utf8");
      var parsed = JSON.parse(fileData);
      if (Array.isArray(parsed)) {
        statsHistory = parsed;
      }
    }
  } catch (v) {}
  _todayKey = _dateKey();
}
function saveStatsHistory() {
  try {
    fs.writeFileSync(STATS_HISTORY_FILE, JSON.stringify(statsHistory.slice(-90), null, 2));
  } catch (v) {}
}
function snapshotStatsToHistory() {
  var DateKeyResult = _dateKey();
  if (_todayKey && DateKeyResult !== _todayKey) {
    statsHistory = statsHistory.filter(function (item) {
      return item.date !== _todayKey;
    });
    statsHistory.push({
      date: _todayKey,
      seen: stats.seen,
      offered: stats.offered,
      messaged: stats.messaged,
      skipped: stats.skipped,
      errors: stats.errors,
      revenue: Math.round(stats.revenue * 100) / 100
    });
    saveStatsHistory();
    stats.seen = 0;
    stats.offered = 0;
    stats.messaged = 0;
    stats.skipped = 0;
    stats.errors = 0;
    stats.revenue = 0;
    _todayKey = DateKeyResult;
  }
  var v = -1;
  for (var num = 0; num < statsHistory.length; num++) {
    if (statsHistory[num].date === DateKeyResult) {
      v = num;
      break;
    }
  }
  var opts = {
    date: DateKeyResult,
    seen: stats.seen,
    offered: stats.offered,
    messaged: stats.messaged,
    skipped: stats.skipped,
    errors: stats.errors,
    revenue: Math.round(stats.revenue * 100) / 100
  };
  if (v < 0) {
    statsHistory.push(opts);
  } else {
    statsHistory[v] = opts;
  }
  saveStatsHistory();
}
function statsTotals(arg1) {
  var Date2 = new Date();
  Date2.setDate(Date2.getDate() - (arg1 - 1));
  var DateKeyResult = _dateKey(Date2);
  var opts = {
    seen: 0,
    offered: 0,
    messaged: 0,
    revenue: 0
  };
  for (var num = 0; num < statsHistory.length; num++) {
    var v = statsHistory[num];
    if (v.date >= DateKeyResult) {
      opts.seen += v.seen || 0;
      opts.offered += v.offered || 0;
      opts.messaged += v.messaged || 0;
      opts.revenue += v.revenue || 0;
    }
  }
  var v2 = null;
  for (var num2 = 0; num2 < statsHistory.length; num2++) {
    if (statsHistory[num2].date === _todayKey) {
      v2 = statsHistory[num2];
      break;
    }
  }
  if (v2) {
    opts.seen += stats.seen - (v2.seen || 0);
    opts.offered += stats.offered - (v2.offered || 0);
    opts.messaged += stats.messaged - (v2.messaged || 0);
    opts.revenue += stats.revenue - (v2.revenue || 0);
  } else {
    opts.seen += stats.seen;
    opts.offered += stats.offered;
    opts.messaged += stats.messaged;
    opts.revenue += stats.revenue;
  }
  opts.revenue = Math.round(opts.revenue * 100) / 100;
  return opts;
}
loadStatsHistory();
setInterval(snapshotStatsToHistory, 60000);
function ts() {
  return new Date().toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
}
var DEBUG_LOGS = process.env.ELDOBOT_DEBUG === "1" || process.env.DEBUG === "1";
function addLog(arg1, arg2) {
  var slice = new Date().toTimeString().slice(0, 8);
  logs.push({
    time: slice,
    msg: String(arg1),
    type: arg2 || "info",
    level: arg2 || "info"
  });
  if (logs.length > 300) {
    logs.shift();
  }
  if (DEBUG_LOGS) {
    console.log("[" + slice + "] " + arg1);
  }
}
function addActivity(arg1) {
  activity.unshift(Object.assign({
    time: ts()
  }, arg1));
  if (activity.length > 200) {
    activity.pop();
  }
  if (arg1 && arg1.type === "Error" && CONFIG.telegramOnError) {
    try {
      tgNotifyError((arg1.region || "?") + " / " + (arg1.boost || "?"), arg1.details || "unknown error");
    } catch (v) {}
  }
}
function getDelivery() {
  return DELIVERY_OPTIONS.find(function (item) {
    return item.value === CONFIG.deliveryEnumValue;
  }) || DELIVERY_OPTIONS[9];
}
function sleep(arg1) {
  return new Promise(function (arg12) {
    setTimeout(arg12, arg1);
  });
}
function getCookieVal(arg1) {
  var parts = (CONFIG.cookieString || "").split(";");
  for (var num = 0; num < parts.length; num++) {
    var parts2 = parts[num].trim().split("=");
    if (parts2[0].trim() === arg1) {
      return parts2.slice(1).join("=");
    }
  }
  return "";
}
function getIdToken() {
  return CONFIG.idToken || getCookieVal("__Host-EldoradoIdToken") || "";
}
function getRefreshToken() {
  return CONFIG.refreshToken || getCookieVal("__Host-EldoradoRefreshToken") || "";
}
function getTokenExpiry() {
  var IdToken = getIdToken();
  if (!IdToken) {
    return 0;
  }
  try {
    var list = IdToken.split(".")[1];
    while (list.length % 4) {
      list += "=";
    }
    return JSON.parse(Buffer.from(list, "base64").toString()).exp || 0;
  } catch (v) {
    return 0;
  }
}
function getEmailFromToken() {
  var IdToken = getIdToken();
  if (!IdToken) {
    return "";
  }
  try {
    var list = IdToken.split(".")[1];
    while (list.length % 4) {
      list += "=";
    }
    return JSON.parse(Buffer.from(list, "base64").toString()).email || "";
  } catch (v) {
    return "";
  }
}
var _refreshing = false;
function refreshToken() {
  if (_refreshing) {
    return Promise.resolve(false);
  }
  var RefreshToken = getRefreshToken();
  if (!RefreshToken) {
    addLog("No refresh token — sync extension or re-paste cookie", "warn");
    return Promise.resolve(false);
  }
  _refreshing = true;
  addLog("🔄 Refreshing token via Eldorado...", "info");
  return api("POST", "/api/refreshTokens", {}).then(function (err) {
    _refreshing = false;
    if (err && err.tokenExpiresIn) {
      var v = err.tokenClaims && err.tokenClaims.email || CONFIG.email;
      if (v) {
        CONFIG.email = v;
      }
      var v2 = err.tokenExpiresIn ? Math.floor(new Date(err.tokenExpiresIn).getTime() / 1000) : 0;
      var v3 = v2 ? Math.round((v2 - Date.now() / 1000) / 60) : 30;
      addLog("✅ Token refreshed! " + v3 + " min left", "success");
      saveConfig();
      if (botRunning && !_signalrConnected) {
        setTimeout(negotiateSignalR, 1000);
      }
      return true;
    } else {
      addLog("Refresh failed — re-sync Chrome extension", "warn");
      return false;
    }
  }).catch(function (err) {
    _refreshing = false;
    addLog("Refresh error: " + err.message + " — re-sync Chrome extension", "warn");
    return false;
  });
}
function startTokenWatcher() {
  setInterval(function () {
    var TokenExpiry = getTokenExpiry();
    if (!TokenExpiry) {
      return;
    }
    var v = Math.round((TokenExpiry - Date.now() / 1000) / 60);
    if (v < 5 && v > -30) {
      addLog("?? Token expires in " + v + " min — auto-refreshing...", "warn");
      refreshToken();
    }
    if (!botRunning && TokenExpiry && v > 5) {
      addLog("🔄 Token valid — auto-restarting bot...", "warn");
      startBot();
    }
  }, 120000);
}
function saveConfig() {
  try {
    var opts = {
      cookieString: CONFIG.cookieString,
      idToken: CONFIG.idToken,
      email: CONFIG.email,
      acceptNA: CONFIG.acceptNA,
      acceptEU: CONFIG.acceptEU,
      acceptLATAM: CONFIG.acceptLATAM,
      acceptAP: CONFIG.acceptAP,
      autoOffer: CONFIG.autoOffer,
      autoMessage: CONFIG.autoMessage,
      slowMode: CONFIG.slowMode,
      cooldownSeconds: CONFIG.cooldownSeconds,
      naMultiplier: CONFIG.naMultiplier,
      messageTemplate: CONFIG.messageTemplate,
      messageImageURL: CONFIG.messageImageURL || "",
      acceptNetWinsEU: CONFIG.acceptNetWinsEU,
      acceptNetWinsNA: CONFIG.acceptNetWinsNA,
      acceptNetWinsLATAM: CONFIG.acceptNetWinsLATAM,
      acceptNetWinsAP: CONFIG.acceptNetWinsAP,
      acceptEUDuo: CONFIG.acceptEUDuo,
      acceptNADuo: CONFIG.acceptNADuo,
      acceptLATAMDuo: CONFIG.acceptLATAMDuo,
      acceptAPDuo: CONFIG.acceptAPDuo,
      acceptEUAsc1: CONFIG.acceptEUAsc1,
      acceptEUAsc2: CONFIG.acceptEUAsc2,
      acceptEUAsc3: CONFIG.acceptEUAsc3,
      acceptNAAsc1: CONFIG.acceptNAAsc1,
      acceptNAAsc2: CONFIG.acceptNAAsc2,
      acceptNAAsc3: CONFIG.acceptNAAsc3,
      acceptLATAMAsc1: CONFIG.acceptLATAMAsc1,
      acceptLATAMAsc2: CONFIG.acceptLATAMAsc2,
      acceptLATAMAsc3: CONFIG.acceptLATAMAsc3,
      acceptAPAsc1: CONFIG.acceptAPAsc1,
      acceptAPAsc2: CONFIG.acceptAPAsc2,
      acceptAPAsc3: CONFIG.acceptAPAsc3,
      acceptEUAsc1Duo: CONFIG.acceptEUAsc1Duo,
      acceptEUAsc2Duo: CONFIG.acceptEUAsc2Duo,
      acceptEUAsc3Duo: CONFIG.acceptEUAsc3Duo,
      acceptNAAsc1Duo: CONFIG.acceptNAAsc1Duo,
      acceptNAAsc2Duo: CONFIG.acceptNAAsc2Duo,
      acceptNAAsc3Duo: CONFIG.acceptNAAsc3Duo,
      acceptLATAMAsc1Duo: CONFIG.acceptLATAMAsc1Duo,
      acceptLATAMAsc2Duo: CONFIG.acceptLATAMAsc2Duo,
      acceptLATAMAsc3Duo: CONFIG.acceptLATAMAsc3Duo,
      acceptAPAsc1Duo: CONFIG.acceptAPAsc1Duo,
      acceptAPAsc2Duo: CONFIG.acceptAPAsc2Duo,
      acceptAPAsc3Duo: CONFIG.acceptAPAsc3Duo,
      acceptEUImmo1: CONFIG.acceptEUImmo1,
      acceptEUImmo2: CONFIG.acceptEUImmo2,
      acceptEUImmo3: CONFIG.acceptEUImmo3,
      acceptEURadiant: CONFIG.acceptEURadiant,
      acceptNAImmo1: CONFIG.acceptNAImmo1,
      acceptNAImmo2: CONFIG.acceptNAImmo2,
      acceptNAImmo3: CONFIG.acceptNAImmo3,
      acceptNARadiant: CONFIG.acceptNARadiant,
      acceptLATAMImmo1: CONFIG.acceptLATAMImmo1,
      acceptLATAMImmo2: CONFIG.acceptLATAMImmo2,
      acceptLATAMImmo3: CONFIG.acceptLATAMImmo3,
      acceptLATAMRadiant: CONFIG.acceptLATAMRadiant,
      acceptAPImmo1: CONFIG.acceptAPImmo1,
      acceptAPImmo2: CONFIG.acceptAPImmo2,
      acceptAPImmo3: CONFIG.acceptAPImmo3,
      acceptAPRadiant: CONFIG.acceptAPRadiant,
      acceptEUImmo1Duo: CONFIG.acceptEUImmo1Duo,
      acceptEUImmo2Duo: CONFIG.acceptEUImmo2Duo,
      acceptEUImmo3Duo: CONFIG.acceptEUImmo3Duo,
      acceptEURadiantDuo: CONFIG.acceptEURadiantDuo,
      acceptNAImmo1Duo: CONFIG.acceptNAImmo1Duo,
      acceptNAImmo2Duo: CONFIG.acceptNAImmo2Duo,
      acceptNAImmo3Duo: CONFIG.acceptNAImmo3Duo,
      acceptNARadiantDuo: CONFIG.acceptNARadiantDuo,
      acceptLATAMImmo1Duo: CONFIG.acceptLATAMImmo1Duo,
      acceptLATAMImmo2Duo: CONFIG.acceptLATAMImmo2Duo,
      acceptLATAMImmo3Duo: CONFIG.acceptLATAMImmo3Duo,
      acceptLATAMRadiantDuo: CONFIG.acceptLATAMRadiantDuo,
      acceptAPImmo1Duo: CONFIG.acceptAPImmo1Duo,
      acceptAPImmo2Duo: CONFIG.acceptAPImmo2Duo,
      acceptAPImmo3Duo: CONFIG.acceptAPImmo3Duo,
      acceptAPRadiantDuo: CONFIG.acceptAPRadiantDuo,
      netwinPricesDuoEU: NETWIN_PRICES_DUO_EU,
      netwinPricesDuoNA: NETWIN_PRICES_DUO_NA,
      netwinPricesDuoLATAM: NETWIN_PRICES_DUO_LATAM,
      netwinPricesDuoAP: NETWIN_PRICES_DUO_AP,
      skipCustomEU: CONFIG.skipCustomEU,
      skipCustomNA: CONFIG.skipCustomNA,
      skipCustomLATAM: CONFIG.skipCustomLATAM,
      skipCustomAP: CONFIG.skipCustomAP,
      tierPricesEU: TIER_PRICES_EU,
      tierPricesNA: TIER_PRICES_NA,
      tierPricesLATAM: TIER_PRICES_LATAM,
      tierPricesAP: TIER_PRICES_AP,
      tierPricesDuoEU: TIER_PRICES_DUO_EU,
      tierPricesDuoNA: TIER_PRICES_DUO_NA,
      tierPricesDuoLATAM: TIER_PRICES_DUO_LATAM,
      tierPricesDuoAP: TIER_PRICES_DUO_AP,
      tierHours: TIER_HOURS,
      netwinPricesEU: NETWIN_PRICES_EU,
      netwinPricesNA: NETWIN_PRICES_NA,
      netwinPricesLATAM: NETWIN_PRICES_LATAM,
      netwinPricesAP: NETWIN_PRICES_AP,
      netwinHours: NETWIN_HOURS,
      immoRrPrices: IMMO_RR_PRICES,
      immoRrPricesDuo: IMMO_RR_PRICES_DUO,
      immoRrHours: IMMO_RR_HOURS,
      latamMultiplier: CONFIG.latamMultiplier,
      apMultiplier: CONFIG.apMultiplier,
      customRules: CUSTOM_RULES,
      discordWebhook: CONFIG.discordWebhook || "",
      discordMessageWebhook: CONFIG.discordMessageWebhook || "",
      telegramBotToken: CONFIG.telegramBotToken || "",
      telegramChatID: CONFIG.telegramChatID || "",
      telegramOnPaidOrder: !!CONFIG.telegramOnPaidOrder,
      telegramOnOfferSent: !!CONFIG.telegramOnOfferSent,
      telegramOnImmortal: !!CONFIG.telegramOnImmortal,
      telegramOnError: !!CONFIG.telegramOnError,
      telegramMinRank: CONFIG.telegramMinRank || "",
      telegramServerEU: CONFIG.telegramServerEU !== false,
      telegramServerNA: CONFIG.telegramServerNA !== false,
      telegramServerLATAM: CONFIG.telegramServerLATAM !== false,
      telegramServerAP: CONFIG.telegramServerAP !== false,
      activeProfile: CONFIG.activeProfile || 1,
      prorateRR: !!CONFIG.prorateRR,
      talkjsNymOverride: CONFIG.talkjsNymOverride || ""
    };
    if (CONFIG.discordWebhook) {
      DISCORD_WEBHOOK = CONFIG.discordWebhook;
    }
    if (CONFIG.discordMessageWebhook) {
      DISCORD_MSG_WEBHOOK = CONFIG.discordMessageWebhook;
    }
    try {
      if (fs.existsSync("eldobot_config.json")) {
        fs.copyFileSync("eldobot_config.json", "eldobot_config.backup.json");
      }
    } catch (v) {}
    fs.writeFileSync("eldobot_config.json", JSON.stringify(opts, null, 2));
  } catch (err) {
    addLog("Save config error: " + err.message, "err");
  }
}
function checkDestinationToggle(arg1, arg2, arg3) {
  if (!arg1) {
    return {
      allowed: true
    };
  }
  var v = (arg2 || "").toUpperCase();
  if (v !== "EU" && v !== "NA" && v !== "LATAM" && v !== "AP") {
    return {
      allowed: true
    };
  }
  var v2 = "accept" + v;
  var v3 = arg3 ? "Duo" : "";
  var v4 = arg3 ? " Duo" : "";
  var v5 = String(arg1).trim();
  if (v5.indexOf("Ascendant") !== -1) {
    var v6 = v5.endsWith("III") ? 3 : v5.endsWith("II") ? 2 : 1;
    if (!CONFIG[v2 + "Asc" + v6 + v3]) {
      return {
        allowed: false,
        reason: "Ascendant " + ["I", "II", "III"][v6 - 1] + " (" + v + v4 + ") toggle OFF"
      };
    }
  } else if (v5.indexOf("Immortal") !== -1) {
    var v7 = v5.endsWith("III") ? "3" : v5.endsWith("II") ? "2" : "1";
    if (!CONFIG[v2 + "Immo" + v7 + v3]) {
      var v8 = v7 === "3" ? "III" : v7 === "2" ? "II" : "I";
      return {
        allowed: false,
        reason: "Immortal " + v8 + " (" + v + v4 + ") toggle OFF"
      };
    }
  } else if (v5 === "Radiant") {
    if (!CONFIG[v2 + "Radiant" + v3]) {
      return {
        allowed: false,
        reason: "Radiant (" + v + v4 + ") toggle OFF"
      };
    }
  }
  return {
    allowed: true
  };
}
function isAllowedServer(arg1) {
  var v = (arg1 || "").toUpperCase().trim();
  return v === "EU" && CONFIG.acceptEU || v === "NA" && CONFIG.acceptNA || v === "LATAM" && CONFIG.acceptLATAM || v === "AP" && CONFIG.acceptAP;
}
function httpreq(arg1, arg2) {
  return new Promise(function (fn, fn2) {
    var res = https.request(arg1, function (res2) {
      var str = "";
      res2.on("data", function (chunk) {
        str += chunk;
      });
      res2.on("end", function () {
        if (res2.statusCode === 401) {
          return fn2(new Error("UNAUTHORIZED"));
        }
        if (res2.statusCode === 403) {
          return fn2(new Error("FORBIDDEN"));
        }
        if (res2.statusCode === 404) {
          return fn2(new Error("NOT_FOUND"));
        }
        if (res2.statusCode >= 400) {
          return fn2(new Error("HTTP_" + res2.statusCode + ": " + str.slice(0, 300)));
        }
        try {
          fn(str ? JSON.parse(str) : {});
        } catch (v) {
          fn({
            _raw: str.slice(0, 200)
          });
        }
      });
    });
    res.setTimeout(25000, function () {
      res.destroy();
      fn2(new Error("TIMEOUT"));
    });
    res.on("error", fn2);
    if (arg2) {
      res.write(typeof arg2 === "string" ? arg2 : JSON.stringify(arg2));
    }
    res.end();
  });
}
function api(arg1, arg2, arg3) {
  var IdToken = getIdToken();
  if (!IdToken && !CONFIG.cookieString) {
    return Promise.reject(new Error("NO_COOKIE"));
  }
  var v = CONFIG.cookieString || "";
  if (IdToken && v.indexOf("__Host-EldoradoIdToken") === -1) {
    v = "__Host-EldoradoIdToken=" + IdToken + (v ? "; " + v : "");
  }
  return httpreq({
    hostname: "www.eldorado.gg",
    port: 443,
    path: arg2,
    method: arg1,
    headers: {
      Cookie: v,
      Authorization: "Bearer " + IdToken,
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Connection: "keep-alive",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      Origin: "https://www.eldorado.gg",
      Referer: "https://www.eldorado.gg/",
      "x-xsrf-token": getCookieVal("__Host-XSRF-TOKEN"),
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin"
    }
  }, arg3 || null).catch(function (err) {
    if (err.message === "UNAUTHORIZED") {
      return refreshToken().then(function (err2) {
        if (!err2) {
          throw err;
        }
        var IdToken2 = getIdToken();
        var v2 = "__Host-EldoradoIdToken=" + IdToken2 + (CONFIG.cookieString ? "; " + CONFIG.cookieString : "");
        return httpreq({
          hostname: "www.eldorado.gg",
          port: 443,
          path: arg2,
          method: arg1,
          headers: {
            Cookie: v2,
            Authorization: "Bearer " + IdToken2,
            "Content-Type": "application/json",
            Accept: "application/json, text/plain, */*",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            Origin: "https://www.eldorado.gg",
            Referer: "https://www.eldorado.gg/",
            "x-xsrf-token": getCookieVal("__Host-XSRF-TOKEN"),
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
          }
        }, arg3 || null);
      });
    }
    throw err;
  });
}
function setOnline() {
  return api("PUT", "/api/offerUser/me/switchOnline", {
    online: true
  }).catch(function (err) {
    if (err.message.indexOf("already Online") === -1) {
      addLog("setOnline: " + err.message, "warn");
    }
  });
}
var _firstPoll = true;
var _activeRequestsPoll = 0;
var _signalrWs = null;
var _soldOrderDetails = {};
var _trackedConvs = {};
var _messagedRequests = {};
var _signalrConnected = false;
var _signalrReconnectTimer = null;
function negotiateSignalR() {
  return api("POST", "/api/signalR/notificationHub/negotiate?negotiateVersion=1").then(function (req) {
    if (!req || !req.url || !req.accessToken) {
      addLog("SignalR negotiate failed — missing url/token", "warn");
      return;
    }
    connectSignalR(req.url, req.accessToken);
  }).catch(function (err) {
    addLog("SignalR negotiate error: " + err.message, "warn");
    _signalrReconnectTimer = setTimeout(negotiateSignalR, 15000);
  });
}
function connectSignalR(arg1, arg2) {
  try {
    var v = arg1.replace(/^https?:\/\//, "wss://") + "&access_token=" + encodeURIComponent(arg2);
    addLog("? Connecting to SignalR real-time hub...", "info");
    var tls = require("tls");
    var URL = new URL(v);
    var v2 = URL.hostname;
    var v3 = URL.pathname + URL.search;
    var text = require("crypto").randomBytes(16).toString("base64");
    var emitter = tls.connect({
      host: v2,
      port: 443,
      servername: v2
    }, function () {
      var joined = ["GET " + v3 + " HTTP/1.1", "Host: " + v2, "Upgrade: websocket", "Connection: Upgrade", "Sec-WebSocket-Key: " + text, "Sec-WebSocket-Version: 13", "Origin: https://www.eldorado.gg", "", ""].join("\r\n");
      emitter.write(joined);
    });
    var flag = false;
    var list = Buffer.alloc(0);
    emitter.on("data", function (chunk) {
      list = Buffer.concat([list, chunk]);
      if (!flag) {
        var v4 = list.indexOf("\r\n\r\n");
        if (v4 === -1) {
          return;
        }
        var text2 = list.slice(0, v4).toString();
        if (text2.indexOf("101") === -1) {
          emitter.destroy();
          return;
        }
        flag = true;
        _signalrWs = emitter;
        _signalrConnected = true;
        list = list.slice(v4 + 4);
        addLog("✅ SignalR connected — orders will arrive instantly!", "success");
        sendSignalRFrame(emitter, JSON.stringify({
          protocol: "json",
          version: 1
        }) + "");
        var setIntervalResult = setInterval(function () {
          if (!_signalrConnected) {
            clearInterval(setIntervalResult);
            return;
          }
          sendSignalRFrame(emitter, JSON.stringify({
            type: 6
          }) + "");
        }, 30000);
      }
      while (list.length > 0) {
        if (list.length < 2) {
          break;
        }
        var v5 = list[0];
        var v6 = list[1];
        var v7 = (v6 & 128) !== 0;
        var v8 = v6 & 127;
        var num = 2;
        if (v8 === 126) {
          if (list.length < 4) {
            break;
          }
          v8 = list.readUInt16BE(2);
          num = 4;
        } else if (v8 === 127) {
          if (list.length < 10) {
            break;
          }
          v8 = Number(list.readBigUInt64BE(2));
          num = 10;
        }
        if (v7) {
          num += 4;
        }
        if (list.length < num + v8) {
          break;
        }
        var slice = list.slice(num, num + v8);
        list = list.slice(num + v8);
        var v9 = v5 & 15;
        if (v9 === 8) {
          _signalrConnected = false;
          emitter.destroy();
          return;
        }
        if (v9 === 9) {
          sendSignalRFrame(emitter, slice, 138);
          continue;
        }
        if (v9 === 1 || v9 === 2) {
          var text3 = slice.toString("utf8");
          text3.split("").forEach(function (item) {
            if (!item.trim()) {
              return;
            }
            try {
              var parsed = JSON.parse(item);
              handleSignalRMessage(parsed);
            } catch (v10) {}
          });
        }
      }
    });
    emitter.on("error", function (err) {
      _signalrConnected = false;
      addLog("SignalR error: " + err.message, "warn");
      scheduleSignalRReconnect();
    });
    emitter.on("close", function () {
      _signalrConnected = false;
      if (botRunning) {
        scheduleSignalRReconnect();
      }
    });
    emitter.setTimeout(60000, function () {
      emitter.destroy();
    });
  } catch (err) {
    addLog("SignalR connect error: " + err.message, "warn");
    scheduleSignalRReconnect();
  }
}
function sendSignalRFrame(arg1, arg2, arg3) {
  try {
    var v = arg3 || 129;
    var list = Buffer.isBuffer(arg2) ? arg2 : Buffer.from(arg2, "utf8");
    var v2 = list.length;
    var v3;
    if (v2 < 126) {
      v3 = Buffer.from([v, v2]);
    } else if (v2 < 65536) {
      v3 = Buffer.alloc(4);
      v3[0] = v;
      v3[1] = 126;
      v3.writeUInt16BE(v2, 2);
    } else {
      v3 = Buffer.alloc(10);
      v3[0] = v;
      v3[1] = 127;
      v3.writeBigUInt64BE(BigInt(v2), 2);
    }
    arg1.write(Buffer.concat([v3, list]));
  } catch (v4) {}
}
function scheduleSignalRReconnect() {
  if (_signalrReconnectTimer) {
    clearTimeout(_signalrReconnectTimer);
  }
  _signalrReconnectTimer = setTimeout(function () {
    if (botRunning) {
      negotiateSignalR();
    }
  }, 5000);
}
function handleSignalRMessage(arg1) {
  if (arg1.type !== 1) {
    return;
  }
  var v = arg1.target || "";
  var v2 = arg1.arguments || [];
  if (v === "BoostingRequestUpdated" || v === "boostingRequestUpdated") {
    var v3 = v2[0];
    if (!v3 || typeof v3 !== "string") {
      return;
    }
    if (processed[v3]) {
      return;
    }
    addLog("? SignalR: new order — " + v3.slice(0, 8) + "...", "success");
    processed[v3] = true;
    processActiveRequestItem(v3, null);
  }
  if (v === "NotificationCreated" || v === "notificationCreated") {
    addLog("? SignalR: notification received — scanning...", "info");
    if (botRunning) {
      checkSoldOrders(false);
    }
    if (botRunning && Date.now() >= _rateLimitedUntil) {
      fetchList().then(function (list) {
        if (!list || !list.length) {
          return;
        }
        var v4 = Promise.resolve();
        list.forEach(function (item) {
          v4 = v4.then(function () {
            if (item._isActiveRequest) {
              return processActiveRequestItem(item._requestId, item._item);
            }
            var extractFromItemResult = extractFromItem(item);
            var v5 = extractFromItemResult.oid;
            if (!v5 || processed[v5]) {
              return;
            }
            processed[v5] = 1;
            return processActiveRequestItem(v5, null);
          });
        });
        return v4;
      }).catch(function () {});
    }
  }
}
var _soldOrdersPoll = 0;
var _seenSoldOrders = {};
var _sentMsgRequests = {};
var _soldOrdersList = [];
function fetchList() {
  var v = _firstPoll;
  _firstPoll = false;
  return api("GET", "/api/boostingOffers/me/boostingRequests/received?pageSize=50&filter=ActiveRequests").then(function (err) {
    var list = err.results || err || [];
    if (!Array.isArray(list)) {
      list = [];
    }
    if (v) {
      list.forEach(function (item) {
        var v2 = item.id || item.requestId;
        if (v2) {
          processed[v2] = true;
        }
      });
      addLog("First poll: marked " + list.length + " existing orders as seen — watching for NEW orders only", "info");
      return [];
    }
    var list2 = [];
    list.forEach(function (item) {
      var v2 = item.id || item.requestId;
      if (!v2 || processed[v2]) {
        return;
      }
      if (item.sellerDetails && item.sellerDetails.boostingRequestSellerState !== "WaitingForOffer") {
        processed[v2] = true;
        return;
      }
      processed[v2] = true;
      list2.push({
        _isActiveRequest: true,
        _requestId: v2,
        _item: item
      });
    });
    _activeRequestsPoll++;
    if (_activeRequestsPoll >= 3) {
      _activeRequestsPoll = 0;
      return api("GET", "/api/notifications/me?cursorValue=9999-99-99%2099%3A99%3A99.999999999999999-9999-9999-9999-999999999999&pageDirection=Next&pageSize=50&notificationReadStatuses=IsUnread&notificationReadStatuses=IsRead").then(function (err2) {
        var list3 = err2.results || [];
        list3.forEach(function (item) {
          var v2 = item.notification;
          if (!v2 || v2.event !== "BoostingRequestCreated" || v2.recipientRole !== "Seller") {
            return;
          }
          var v3 = v2.details && v2.details.detailsId;
          if (!v3 || processed[v3]) {
            return;
          }
          processed[v3] = true;
          list2.push(item);
        });
        return list2;
      }).catch(function () {
        return list2;
      });
    }
    return list2;
  }).catch(function (err) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      addLog("?? Auth error — trying to refresh token...", "warn");
      return refreshToken().then(function (err2) {
        if (!err2) {
          addLog("❌ Auth failed after refresh — re-sync Chrome extension to continue", "err");
        }
        return [];
      });
    }
    if (err.message && err.message.indexOf("429") !== -1) {
      _rateLimitedUntil = Date.now() + 8000;
      addLog("? Rate limited — backing off 10s...", "warn");
      return [];
    }
    addLog("Fetch error: " + err.message, "err");
    return [];
  });
}
function fetchActiveRequests(arg1) {
  return api("GET", "/api/boostingOffers/me/boostingRequests/received?pageSize=50&filter=ActiveRequests").then(function (err) {
    var list = err.results || err || [];
    if (!Array.isArray(list)) {
      return [];
    }
    var list2 = [];
    list.forEach(function (item) {
      var v = item.id || item.requestId;
      if (!v || processed[v]) {
        return;
      }
      if (arg1) {
        processed[v] = true;
        return;
      }
      if (item.sellerDetails && item.sellerDetails.boostingRequestSellerState !== "WaitingForOffer") {
        processed[v] = true;
        return;
      }
      processed[v] = true;
      list2.push({
        _isActiveRequest: true,
        _requestId: v,
        _item: item
      });
    });
    if (list2.length > 0) {
      addLog("🔍 Found " + list2.length + " missed order(s) via active requests check", "warn");
    }
    return list2;
  }).catch(function (err) {
    return [];
  });
}
function deepFind(arg1, list) {
  if (!arg1 || typeof arg1 !== "object") {
    return null;
  }
  for (var num = 0; num < list.length; num++) {
    if (arg1[list[num]] !== undefined && arg1[list[num]] !== null && arg1[list[num]] !== "") {
      return arg1[list[num]];
    }
  }
  var vals = Object.values(arg1);
  for (var num2 = 0; num2 < vals.length; num2++) {
    if (vals[num2] && typeof vals[num2] === "object" && !Array.isArray(vals[num2])) {
      var deepFindResult = deepFind(vals[num2], list);
      if (deepFindResult !== null) {
        return deepFindResult;
      }
    }
  }
  return null;
}
function extractRankLabel(arg1) {
  if (!arg1) {
    return null;
  }
  if (typeof arg1 === "string") {
    return arg1;
  }
  if (typeof arg1 === "object") {
    return arg1.name || arg1.label || arg1.displayName || arg1.rankName || null;
  }
  return null;
}
function extractFromItem(arg1) {
  var v = arg1.notification;
  var v2 = v.details || {};
  var v3 = v.customNotificationData || {};
  var list = v3.requestFields || [];
  var v4 = v3.boostingCategoryId || v2.boostingCategoryId || "?";
  var v5 = v2.gameCategoryTitle || "";
  var v6 = v2.buyerUsername || "Unknown";
  var v7 = v2.detailsId;
  var str = "?";
  var str2 = "?";
  var str3 = "?";
  var num = 0;
  var str4 = "Solo";
  var v8 = (v5 || "").toLowerCase();
  var v9 = list.join(" ").toLowerCase();
  if (v8.indexOf("duo") !== -1 || v9.indexOf("duo") !== -1) {
    str4 = "Duo";
  }
  var v10 = v3.descriptionValues || {};
  var mapped = Object.values(v10).map(function (item) {
    return String(item).toLowerCase();
  });
  if (mapped.indexOf("duo") !== -1) {
    str4 = "Duo";
  }
  if (v4 === "0") {
    str = list[0] || "?";
    str2 = list[1] || "?";
    str3 = list[2] || "?";
    num = Number(v3.descriptionValues && v3.descriptionValues["27"] || 0) || 0;
  } else if (v4 === "1") {
    str = "Unranked";
    str2 = "Placement";
    str3 = list[1] || list[0] || "?";
  } else if (v4 === "2") {
    str = list[0] || "?";
    str2 = "Net Wins";
    str3 = list[1] || "?";
    var num2 = 1;
    for (var num3 = 2; num3 <= 4; num3++) {
      if (list[num3] && /^\d+$/.test(String(list[num3]).trim())) {
        var NumberResult = Number(list[num3]);
        if (NumberResult >= 1 && NumberResult <= 50) {
          num2 = NumberResult;
          break;
        }
      }
    }
    if (num2 === 1 && v3.descriptionValues) {
      var list2 = Object.keys(v3.descriptionValues).sort(function (err, data) {
        return Number(err) - Number(data);
      });
      for (var num4 = 0; num4 < list2.length; num4++) {
        var v11 = list2[num4];
        if (v11 === "27") {
          continue;
        }
        var NumberResult2 = Number(v3.descriptionValues[v11]);
        if (Number.isInteger(NumberResult2) && NumberResult2 >= 1 && NumberResult2 <= 50) {
          num2 = NumberResult2;
          break;
        }
      }
    }
    arg1._numGames = num2;
  } else if (v4 === "3") {
    str = "Custom";
    str2 = "Custom";
    str3 = list[1] || "?";
  }
  return {
    cr: str,
    dr: str2,
    sv: str3,
    rr: num,
    method: str4,
    oid: v7,
    un: v6,
    catId: v4,
    catTitle: v5
  };
}
function applySlowMode(arg1) {
  if (!CONFIG.slowMode) {
    return arg1;
  }
  var opts = {
    Hour5: "Hour12",
    Hour8: "Hour12",
    Hour12: "Day1",
    Day1: "Day2",
    Day2: "Day3",
    Day3: "Day3",
    Day7: "Day7"
  };
  return opts[arg1] || arg1;
}
function sendOffer(arg1, arg2, arg3) {
  try {
    if (process.pkg && _licClient && !_licClient.isValid()) {
      return Promise.reject(new Error("license invalid"));
    }
  } catch (v) {}
  var opts = {
    details: {
      boostingRequestId: arg1,
      guaranteedDeliveryTime: arg3,
      offerGroup: "Boosting",
      pricing: {
        quantity: 1,
        minQuantity: 1,
        volumeDiscounts: null,
        pricePerUnit: {
          amount: arg2,
          currency: "USD"
        }
      }
    }
  };
  return new Promise(function (fn) {
    var json = JSON.stringify(opts);
    var IdToken = getIdToken();
    var v = CONFIG.cookieString || "";
    var opts2 = {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(json),
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json"
    };
    if (IdToken) {
      opts2.Authorization = "Bearer " + IdToken;
    }
    if (v) {
      opts2.Cookie = v;
    }
    var res = require("https").request({
      hostname: "www.eldorado.gg",
      path: "/api/boostingOffers",
      method: "POST",
      headers: opts2
    }, function (res2) {
      var str = "";
      res2.on("data", function (chunk) {
        str += chunk;
      });
      res2.on("end", function () {
        var v2 = res2.statusCode;
        addLog("Offer HTTP " + v2 + ": " + str.slice(0, 500), "info");
        if (v2 === 200 || v2 === 201 || v2 === 204) {
          fn({
            ok: true
          });
        } else {
          var v3 = "HTTP_" + v2 + ": " + str.slice(0, 200);
          fn({
            ok: false,
            err: v3
          });
        }
      });
    });
    res.on("error", function (err) {
      fn({
        ok: false,
        err: err.message
      });
    });
    res.write(json);
    res.end();
  });
}
var _talkjsToken = null;
var _talkjsNymId = null;
var _talkjsSessionId = null;
var _talkjsRecentShorts = [];
var _convIdMap = {};
var TALKJS_STATE_PATH = "talkjs_state.json";
var _talkjsStateSaveTimer = null;
function saveTalkJSState() {
  if (_talkjsStateSaveTimer) {
    return;
  }
  _talkjsStateSaveTimer = setTimeout(function () {
    _talkjsStateSaveTimer = null;
    try {
      var opts = {
        nymId: _talkjsNymId || null,
        convIdMap: _convIdMap || {},
        savedAt: Date.now()
      };
      fs.writeFileSync(TALKJS_STATE_PATH, JSON.stringify(opts, null, 2));
    } catch (err) {
      addLog("TalkJS state save error: " + err.message, "warn");
    }
  }, 5000);
}
function loadTalkJSState() {
  try {
    if (!fs.existsSync(TALKJS_STATE_PATH)) {
      return;
    }
    var fileData = fs.readFileSync(TALKJS_STATE_PATH, "utf8");
    var parsed = JSON.parse(fileData);
    if (parsed && parsed.nymId && !_talkjsNymId) {
      _talkjsNymId = parsed.nymId;
    }
    if (parsed && parsed.convIdMap && typeof parsed.convIdMap === "object") {
      Object.keys(parsed.convIdMap).forEach(function (item) {
        if (!_convIdMap[item]) {
          _convIdMap[item] = parsed.convIdMap[item];
        }
      });
    }
    var v = Object.keys(_convIdMap).length;
    addLog("ὋE Loaded TalkJS state: nymId=" + (_talkjsNymId ? "yes" : "no") + ", " + v + " conv mapping(s)", "info");
  } catch (err) {
    addLog("TalkJS state load error: " + err.message, "warn");
  }
}
loadTalkJSState();
var _pendingMessages = [];
var _pendingMsgId = 0;
function queueMessage(arg1, arg2, arg3) {
  var v = ++_pendingMsgId;
  var opts = {
    id: v,
    convId: arg1,
    msg: arg2,
    nymId: arg3 || _talkjsNymId || null,
    created: Date.now(),
    status: "pending"
  };
  _pendingMessages.push(opts);
  if (_pendingMessages.length > 50) {
    _pendingMessages.shift();
  }
  addLog("📨 Message queued (id:" + v + ") — waiting for browser extension to send it", "info");
  setTimeout(function () {
    var v2 = _pendingMessages.findIndex ? _pendingMessages.findIndex(function (err) {
      return err.id === v && err.status === "pending";
    }) : -1;
    if (v2 !== -1) {
      _pendingMessages[v2].status = "timeout";
      addLog("⏱ Message id:" + v + " timed out — extension may not be on eldorado.gg tab", "warn");
    }
  }, 30000);
  return v;
}
function getTalkJsSession() {
  var list = [{
    method: "POST",
    path: "/api/talkjs/token",
    body: {}
  }, {
    method: "GET",
    path: "/api/talkjs/token"
  }, {
    method: "POST",
    path: "/api/chat/token",
    body: {}
  }, {
    method: "GET",
    path: "/api/chat/token"
  }, {
    method: "POST",
    path: "/api/talkjs/session",
    body: {}
  }, {
    method: "GET",
    path: "/api/talkjs/session"
  }, {
    method: "POST",
    path: "/api/talkjs/auth",
    body: {}
  }];
  var num = 0;
  function fn() {
    if (num >= list.length) {
      return Promise.resolve(null);
    }
    var res = list[num++];
    return api(res.method, res.path, res.body || null).then(function (err) {
      var v = err.sessionId || err.session_id || err.token || err.accessToken || err.talkjsToken || err.chatToken || null;
      var v2 = err.nymId || err.userId || err.user_id || err.sellerId || null;
      addLog("TalkJS endpoint " + res.path + " ? sid:" + (v ? "✅" : "❌") + " nymId:" + (v2 || "?"), "info");
      if (v) {
        _talkjsSessionId = v;
        if (v2) {
          _talkjsNymId = v2;
        }
        return err;
      }
      return fn();
    }).catch(function () {
      return fn();
    });
  }
  return fn();
}
var _cachedTalkToken = null;
var _cachedTalkTokenExp = 0;
function fetchTalkJSToken(arg1, arg2) {
  if (arg2) {
    _cachedTalkToken = null;
    _cachedTalkTokenExp = 0;
  }
  if (_cachedTalkToken && Date.now() < _cachedTalkTokenExp - 120000) {
    return Promise.resolve(_cachedTalkToken);
  }
  return new Promise(function (fn, fn2) {
    var v = CONFIG.cookieString || "";
    var v2 = v;
    if (v2 && !v2.includes("__Host-EldoradoIdToken")) {
      v2 = "__Host-EldoradoIdToken=" + arg1 + "; " + v2;
    } else if (!v2) {
      v2 = "__Host-EldoradoIdToken=" + arg1;
    }
    var opts = {
      hostname: "www.eldorado.gg",
      port: 443,
      path: "/api/conversations/me/authorize",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Cookie: v2
      }
    };
    addLog("💬 Fetching TalkJS token from authorize endpoint...", "info");
    var res = https.request(opts, function (res2) {
      var str = "";
      res2.on("data", function (chunk) {
        str += chunk;
      });
      res2.on("end", function () {
        addLog("💬 Authorize response HTTP " + res2.statusCode + ": " + str.slice(0, 300), "info");
        try {
          var parsed = JSON.parse(str);
          if (parsed.token) {
            try {
              var parsed2 = JSON.parse(Buffer.from(parsed.token.split(".")[1], "base64").toString());
              _cachedTalkTokenExp = (parsed2.exp || 0) * 1000;
            } catch (v3) {
              _cachedTalkTokenExp = Date.now() + 36000000;
            }
            _cachedTalkToken = parsed.token;
            fn(parsed.token);
          } else {
            fn2(new Error("No token in authorize response: " + str.slice(0, 200)));
          }
        } catch (err) {
          fn2(new Error("Parse error: " + err.message + " body: " + str.slice(0, 100)));
        }
      });
    });
    res.on("error", function (err) {
      fn2(err);
    });
    res.setTimeout(15000, function () {
      res.destroy();
      fn2(new Error("authorize timeout"));
    });
    res.end();
  });
}
function extractJWTSub(arg1) {
  var parts = arg1.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT");
  }
  var list = parts[1];
  while (list.length % 4) {
    list += "=";
  }
  var parsed = JSON.parse(Buffer.from(list, "base64").toString("utf8"));
  if (!parsed.sub) {
    throw new Error("No sub claim in JWT");
  }
  return parsed.sub;
}
function generateIdempotencyKey() {
  var str = "0123456789abcdef";
  var str2 = "";
  for (var num = 0; num < 32; num++) {
    str2 += str[Math.floor(Math.random() * 16)];
  }
  return str2;
}
var _pendingMessages = [];
var _pendingMsgId = 0;
function queueMessage(arg1, arg2, arg3) {
  var v = ++_pendingMsgId;
  var opts = {
    id: v,
    convId: arg1,
    msg: arg2,
    nymId: arg3 || _talkjsNymId || null,
    created: Date.now(),
    status: "pending"
  };
  _pendingMessages.push(opts);
  if (_pendingMessages.length > 50) {
    _pendingMessages.shift();
  }
  addLog("📨 Message queued (id:" + v + ") — waiting for browser extension to send it", "info");
  setTimeout(function () {
    var v2 = _pendingMessages.findIndex ? _pendingMessages.findIndex(function (err) {
      return err.id === v && err.status === "pending";
    }) : -1;
    if (v2 !== -1) {
      _pendingMessages[v2].status = "timeout";
      addLog("⏱ Message id:" + v + " timed out — extension may not be on eldorado.gg tab", "warn");
    }
  }, 30000);
  return v;
}
function getTalkJsSession() {
  var list = [{
    method: "POST",
    path: "/api/talkjs/token",
    body: {}
  }, {
    method: "GET",
    path: "/api/talkjs/token"
  }, {
    method: "POST",
    path: "/api/chat/token",
    body: {}
  }, {
    method: "GET",
    path: "/api/chat/token"
  }, {
    method: "POST",
    path: "/api/talkjs/session",
    body: {}
  }, {
    method: "GET",
    path: "/api/talkjs/session"
  }, {
    method: "POST",
    path: "/api/talkjs/auth",
    body: {}
  }];
  var num = 0;
  function fn() {
    if (num >= list.length) {
      return Promise.resolve(null);
    }
    var res = list[num++];
    return api(res.method, res.path, res.body || null).then(function (err) {
      var v = err.sessionId || err.session_id || err.token || err.accessToken || err.talkjsToken || err.chatToken || null;
      var v2 = err.nymId || err.userId || err.user_id || err.sellerId || null;
      addLog("TalkJS endpoint " + res.path + " ? sid:" + (v ? "✅" : "❌") + " nymId:" + (v2 || "?"), "info");
      if (v) {
        _talkjsSessionId = v;
        if (v2) {
          _talkjsNymId = v2;
        }
        return err;
      }
      return fn();
    }).catch(function () {
      return fn();
    });
  }
  return fn();
}
var _cachedTalkToken = null;
var _cachedTalkTokenExp = 0;
function fetchTalkJSToken(arg1, arg2) {
  if (arg2) {
    _cachedTalkToken = null;
    _cachedTalkTokenExp = 0;
  }
  if (_cachedTalkToken && Date.now() < _cachedTalkTokenExp - 120000) {
    return Promise.resolve(_cachedTalkToken);
  }
  return new Promise(function (fn, fn2) {
    var v = CONFIG.cookieString || "";
    var v2 = v;
    if (v2 && !v2.includes("__Host-EldoradoIdToken")) {
      v2 = "__Host-EldoradoIdToken=" + arg1 + "; " + v2;
    } else if (!v2) {
      v2 = "__Host-EldoradoIdToken=" + arg1;
    }
    var opts = {
      hostname: "www.eldorado.gg",
      port: 443,
      path: "/api/conversations/me/authorize",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Cookie: v2
      }
    };
    addLog("💬 Fetching TalkJS token from authorize endpoint...", "info");
    var res = https.request(opts, function (res2) {
      var str = "";
      res2.on("data", function (chunk) {
        str += chunk;
      });
      res2.on("end", function () {
        addLog("💬 Authorize response HTTP " + res2.statusCode + ": " + str.slice(0, 300), "info");
        try {
          var parsed = JSON.parse(str);
          if (parsed.token) {
            try {
              var parsed2 = JSON.parse(Buffer.from(parsed.token.split(".")[1], "base64").toString());
              _cachedTalkTokenExp = (parsed2.exp || 0) * 1000;
            } catch (v3) {
              _cachedTalkTokenExp = Date.now() + 36000000;
            }
            _cachedTalkToken = parsed.token;
            fn(parsed.token);
          } else {
            fn2(new Error("No token in authorize response: " + str.slice(0, 200)));
          }
        } catch (err) {
          fn2(new Error("Parse error: " + err.message + " body: " + str.slice(0, 100)));
        }
      });
    });
    res.on("error", function (err) {
      fn2(err);
    });
    res.setTimeout(15000, function () {
      res.destroy();
      fn2(new Error("authorize timeout"));
    });
    res.end();
  });
}
function extractJWTSub(arg1) {
  var parts = arg1.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid JWT");
  }
  var list = parts[1];
  while (list.length % 4) {
    list += "=";
  }
  var parsed = JSON.parse(Buffer.from(list, "base64").toString("utf8"));
  if (!parsed.sub) {
    throw new Error("No sub claim in JWT");
  }
  return parsed.sub;
}
function generateIdempotencyKey() {
  var str = "0123456789abcdef";
  var str2 = "";
  for (var num = 0; num < 32; num++) {
    str2 += str[Math.floor(Math.random() * 16)];
  }
  return str2;
}
function _buildEntityTree(arg1) {
  var StringResult = String(arg1 == null ? "" : arg1);
  var v = /(https?:\/\/[^\s<>"'`]+)/gi;
  var list = [];
  var num = 0;
  var v2;
  while ((v2 = v.exec(StringResult)) !== null) {
    if (v2.index > num) {
      list.push(StringResult.slice(num, v2.index));
    }
    var list2 = v2[0];
    list.push({
      type: "autolink",
      url: list2,
      text: list2
    });
    num = v2.index + list2.length;
  }
  if (num < StringResult.length) {
    list.push(StringResult.slice(num));
  }
  if (list.length === 0) {
    list.push(StringResult);
  }
  return list;
}
function sendTalkJSRestAPI(arg1, arg2, arg3, arg4, arg5) {
  return new Promise(function (fn, fn2) {
    if (!arg2 || !arg1 || !arg4) {
      return fn2(new Error("REST API: missing conv/token/sender"));
    }
    if (arg5) {
      addLog("REST API: image attachment not supported by TalkJS user JWT — sending text only", "warn");
    }
    var opts = {
      content: [{
        type: "text",
        children: [String(arg3 || " ")]
      }],
      sender: arg4,
      type: "UserMessage",
      custom: {}
    };
    var json = JSON.stringify(opts);
    var opts2 = {
      host: "api.talkjs.com",
      port: 443,
      method: "POST",
      path: "/v1/49mLECOW/conversations/" + encodeURIComponent(arg2) + "/messages",
      headers: {
        Authorization: "Bearer " + arg1,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json),
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36"
      }
    };
    addLog("REST POST /v1/.../" + arg2.slice(0, 12) + "/messages (text-only via user JWT)", "info");
    var res = https.request(opts2, function (res2) {
      var str = "";
      res2.on("data", function (chunk) {
        str += chunk;
      });
      res2.on("end", function () {
        addLog("REST response: " + res2.statusCode + " " + str.slice(0, 250), "info");
        if (res2.statusCode >= 200 && res2.statusCode < 300) {
          var v = null;
          try {
            var parsed = JSON.parse(str);
            v = parsed && parsed.id || true;
          } catch (v2) {
            v = true;
          }
          fn(v);
        } else {
          fn2(new Error("REST API " + res2.statusCode + ": " + str.slice(0, 300)));
        }
      });
    });
    res.on("error", fn2);
    res.setTimeout(15000, function () {
      try {
        res.destroy();
      } catch (v) {}
      fn2(new Error("REST API timeout"));
    });
    res.write(json);
    res.end();
  });
}
function _downloadImageBytes(arg1) {
  var parsedUrl;
  try {
    parsedUrl = new URL(arg1);
  } catch (err) {
    return Promise.reject(new Error("bad image URL: " + err.message));
  }
  return new Promise(function (fn, fn2) {
    var list = [];
    var res = https.request({
      host: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + (parsedUrl.search || ""),
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "image/*,*/*"
      }
    }, function (res2) {
      if (res2.statusCode === 301 || res2.statusCode === 302) {
        var v = res2.headers.location;
        if (v) {
          return fn(_downloadImageBytes(v));
        }
      }
      if (res2.statusCode !== 200) {
        return fn2(new Error("image download status " + res2.statusCode));
      }
      var v2 = (res2.headers["content-type"] || "image/jpeg").split(";")[0].trim();
      res2.on("data", function (chunk) {
        list.push(chunk);
      });
      res2.on("end", function () {
        var combined = Buffer.concat(list);
        var v3 = parsedUrl.pathname.split("/").pop() || "image";
        var decodeURIComponentResult = decodeURIComponent(v3);
        if (!/\.[a-z0-9]+$/i.test(decodeURIComponentResult)) {
          decodeURIComponentResult += "." + (v2.split("/")[1] || "jpg").replace(/[^a-z0-9]/gi, "");
        }
        fn({
          bytes: combined,
          mime: v2,
          filename: decodeURIComponentResult
        });
      });
      res2.on("error", fn2);
    });
    res.on("error", fn2);
    res.setTimeout(15000, function () {
      try {
        res.destroy();
      } catch (v) {}
      fn2(new Error("image download timeout"));
    });
    res.end();
  });
}
function _parseImageDimensions(list) {
  if (!list || list.length < 24) {
    return null;
  }
  if (list[0] === 137 && list[1] === 80 && list[2] === 78 && list[3] === 71) {
    return {
      w: list.readUInt32BE(16),
      h: list.readUInt32BE(20)
    };
  }
  if (list[0] === 71 && list[1] === 73 && list[2] === 70) {
    return {
      w: list.readUInt16LE(6),
      h: list.readUInt16LE(8)
    };
  }
  if (list[0] === 82 && list[1] === 73 && list[2] === 70 && list[3] === 70 && list[8] === 87 && list[9] === 69 && list[10] === 66 && list[11] === 80) {
    if (list[12] === 86 && list[13] === 80 && list[14] === 56 && list[15] === 88) {
      return {
        w: (list[24] | list[25] << 8 | list[26] << 16) + 1,
        h: (list[27] | list[28] << 8 | list[29] << 16) + 1
      };
    }
    if (list[12] === 86 && list[13] === 80 && list[14] === 56 && list[15] === 76) {
      var v = list.readUInt32LE(21);
      return {
        w: (v & 16383) + 1,
        h: (v >> 14 & 16383) + 1
      };
    }
    if (list[12] === 86 && list[13] === 80 && list[14] === 56 && list[15] === 32) {
      return {
        w: list.readUInt16LE(26) & 16383,
        h: list.readUInt16LE(28) & 16383
      };
    }
  }
  if (list[0] === 255 && list[1] === 216) {
    var num = 2;
    while (num < list.length - 8) {
      if (list[num] !== 255) {
        num++;
        continue;
      }
      var v2 = list[num + 1];
      if (v2 === 255 || v2 === 216 || v2 === 217) {
        num += 2;
        continue;
      }
      var v3 = list.readUInt16BE(num + 2);
      if (v2 >= 192 && v2 <= 195 || v2 >= 197 && v2 <= 199 || v2 >= 201 && v2 <= 203 || v2 >= 205 && v2 <= 207) {
        if (num + 9 < list.length) {
          return {
            w: list.readUInt16BE(num + 7),
            h: list.readUInt16BE(num + 5)
          };
        }
      }
      num += 2 + v3;
    }
  }
  return null;
}
function _uploadImageToTalkJSBucket(list, arg2, arg3) {
  return new Promise(function (fn, fn2) {
    var crypto = require("crypto");
    var text = crypto.randomBytes(16).toString("hex");
    var v = "user_files/49mLECOW/" + text + "/" + arg2;
    var encodeURIComponentResult = encodeURIComponent(v);
    var v2 = "----eldoUpload" + crypto.randomBytes(16).toString("hex");
    var json = JSON.stringify({
      contentType: arg3,
      metadata: {
        draft: "true"
      }
    });
    var buf = Buffer.from("--" + v2 + "\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n" + json + "\r\n--" + v2 + "\r\nContent-Type: " + arg3 + "\r\n\r\n", "utf8");
    var buf2 = Buffer.from("\r\n--" + v2 + "--\r\n", "utf8");
    var combined = Buffer.concat([buf, list, buf2]);
    var res = https.request({
      host: "firebasestorage.googleapis.com",
      port: 443,
      path: "/v0/b/klets-3642/o?name=" + encodeURIComponentResult,
      method: "POST",
      headers: {
        "Content-Type": "multipart/related; boundary=" + v2,
        "Content-Length": combined.length,
        "x-goog-upload-protocol": "multipart",
        "x-firebase-storage-version": "webjs/9.23.0",
        Origin: "https://app.talkjs.com",
        Referer: "https://app.talkjs.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",
        Accept: "*/*"
      }
    }, function (res2) {
      var str = "";
      res2.on("data", function (chunk) {
        str += chunk;
      });
      res2.on("end", function () {
        if (res2.statusCode < 200 || res2.statusCode >= 300) {
          return fn2(new Error("Firebase upload " + res2.statusCode + ": " + str.slice(0, 200)));
        }
        try {
          var parsed = JSON.parse(str);
          var v3 = parsed.downloadTokens || parsed.metadata && parsed.metadata.downloadTokens;
          if (!v3) {
            return fn2(new Error("Firebase upload: no downloadTokens in response"));
          }
          var v4 = "https://firebasestorage.googleapis.com/v0/b/klets-3642/o/" + encodeURIComponent(parsed.name || v) + "?alt=media&token=" + v3;
          fn({
            url: v4,
            name: parsed.name,
            size: list.length
          });
        } catch (err) {
          fn2(new Error("Firebase upload parse: " + err.message));
        }
      });
    });
    res.on("error", fn2);
    res.setTimeout(30000, function () {
      try {
        res.destroy();
      } catch (v3) {}
      fn2(new Error("Firebase upload timeout"));
    });
    res.write(combined);
    res.end();
  });
}
var _talkjsImgCache = {};
function _prepareTalkJSImage(arg1) {
  if (!arg1) {
    return Promise.reject(new Error("no image URL configured"));
  }
  if (_talkjsImgCache[arg1]) {
    return Promise.resolve(_talkjsImgCache[arg1]);
  }
  return _downloadImageBytes(arg1).then(function (err) {
    var v = _parseImageDimensions(err.bytes) || {
      w: 800,
      h: 600
    };
    return _uploadImageToTalkJSBucket(err.bytes, err.filename, err.mime).then(function (req) {
      var opts = {
        url: req.url,
        size: err.bytes.length,
        filename: err.filename,
        width: v.w,
        height: v.h
      };
      _talkjsImgCache[arg1] = opts;
      addLog("✅ image uploaded to TalkJS bucket — " + opts.filename, "success");
      return opts;
    });
  });
}
function sendTalkJSHTTPS(arg1, arg2, arg3, arg4, arg5, arg6) {
  return new Promise(function (fn, fn2) {
    var crypto = require("crypto");
    var slice = crypto.randomBytes(15).toString("base64").replace(/[+/=]/g, "").slice(0, 20);
    var v = arg3 && String(arg3).trim().length > 0;
    var json = JSON.stringify({
      idempotencyKey: slice,
      entityTree: v ? _buildEntityTree(arg3) : [],
      received: false,
      custom: {},
      nymId: arg4 || null,
      attachment: arg6 || null,
      location: null
    });
    var v2 = "/api/v0/49mLECOW/say/" + encodeURIComponent(arg2) + "/" + (arg5 ? "?sessionId=" + encodeURIComponent(arg5) : "");
    var opts = {
      host: "app.talkjs.com",
      port: 443,
      path: v2,
      method: "POST",
      headers: {
        Authorization: "Bearer " + arg1,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json),
        Accept: "application/json",
        Origin: "https://app.talkjs.com",
        Referer: "https://app.talkjs.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
        "x-talkjs-client-build": "frontend-release-9b84f26",
        "x-talkjs-client-date": new Date().toISOString()
      }
    };
    addLog("TalkJS HTTPS /say/ → conv=" + arg2 + " nym=" + (arg4 || "?"), "info");
    var res = https.request(opts, function (res2) {
      var str = "";
      res2.on("data", function (chunk) {
        str += chunk;
      });
      res2.on("end", function () {
        addLog("TalkJS HTTPS response: " + res2.statusCode + " " + str.slice(0, 200), "info");
        if (res2.statusCode >= 200 && res2.statusCode < 300) {
          try {
            fn(JSON.parse(str));
          } catch (v3) {
            fn({
              ok: true
            });
          }
        } else {
          fn2(new Error("TalkJS HTTPS " + res2.statusCode + ": " + str.slice(0, 300)));
        }
      });
    });
    res.on("error", fn2);
    res.setTimeout(15000, function () {
      res.destroy();
      fn2(new Error("TalkJS HTTPS timeout"));
    });
    res.write(json);
    res.end();
  });
}
function sendTalkJSWebSocket(arg1, arg2, arg3, arg4) {
  return new Promise(function (fn, fn2) {
    var v;
    try {
      v = arg4 || extractJWTSub(arg1);
    } catch (err) {
      return fn2(new Error("Extract userID: " + err.message));
    }
    addLog("TalkJS WS: connecting as userID " + v.slice(0, 12) + "...", "info");
    var tls = require("tls");
    var crypto = require("crypto");
    var text = crypto.randomBytes(16).toString("base64");
    var v2 = "/v1/49mLECOW/realtime/" + encodeURIComponent(v) + "?talkjs-client-build=jssdk-release-1a273f5&talkjs-core=1.0.0&talkjs-client-id=go-bot";
    var emitter = tls.connect({
      host: "realtime.talkjs.com",
      port: 443,
      servername: "realtime.talkjs.com"
    }, function () {
      var joined = ["GET " + v2 + " HTTP/1.1", "Host: realtime.talkjs.com", "Upgrade: websocket", "Connection: Upgrade", "Sec-WebSocket-Key: " + text, "Sec-WebSocket-Version: 13", "Sec-WebSocket-Protocol: ", "Origin: https://www.eldorado.gg", "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36", "", ""].join("\r\n");
      emitter.write(joined);
    });
    emitter.setTimeout(30000, function () {
      emitter.destroy();
      fn2(new Error("TalkJS WS timeout"));
    });
    emitter.on("error", function (err) {
      fn2(err);
    });
    var list = Buffer.alloc(0);
    var flag = false;
    var flag2 = false;
    var flag3 = false;
    function fn3(arg12) {
      var buf = Buffer.from(JSON.stringify(arg12), "utf8");
      var v3 = buf.length;
      var v4;
      if (v3 < 126) {
        v4 = Buffer.from([129, v3 | 128]);
      } else if (v3 < 65536) {
        v4 = Buffer.from([129, 254, v3 >> 8 & 255, v3 & 255]);
      } else {
        v4 = Buffer.from([129, 127, 0, 0, 0, 0, v3 >> 24 & 255, v3 >> 16 & 255, v3 >> 8 & 255, v3 & 255]);
      }
      var randomBytes = crypto.randomBytes(4);
      var v5 = Buffer.alloc(v3);
      for (var num = 0; num < v3; num++) {
        v5[num] = buf[num] ^ randomBytes[num % 4];
      }
      emitter.write(Buffer.concat([v4, randomBytes, v5]));
    }
    function fn4() {
      while (list.length >= 2) {
        var v3 = (list[0] & 128) !== 0;
        var v4 = list[0] & 15;
        var v5 = (list[1] & 128) !== 0;
        var v6 = list[1] & 127;
        var num = 2;
        if (v6 === 126) {
          if (list.length < 4) {
            return;
          }
          v6 = list[2] << 8 | list[3];
          num = 4;
        } else if (v6 === 127) {
          if (list.length < 10) {
            return;
          }
          v6 = list.readUInt32BE(6);
          num = 10;
        }
        if (v5) {
          num += 4;
        }
        if (list.length < num + v6) {
          return;
        }
        var text2 = list.slice(num, num + v6).toString("utf8");
        list = list.slice(num + v6);
        if (v4 === 9) {
          emitter.write(Buffer.from([138, 0]));
          continue;
        }
        if (v4 === 8) {
          continue;
        }
        addLog("TalkJS WS raw frame: " + text2.slice(0, 200), "info");
        try {
          var parsed = JSON.parse(text2);
          var v7 = parsed[0];
          var v8 = parsed[1];
          addLog("TalkJS WS arr[0]=" + v7 + " arr[1]=" + v8 + " authDone=" + flag2 + " msgSent=" + flag3, "info");
          if (v7 === 0 && !flag2) {
            if (v8 === 200) {
              flag2 = true;
              addLog("TalkJS WS: authenticated ✅ sending message to conv: " + arg2.slice(0, 12) + "...", "info");
              var opts = {
                content: [{
                  type: "text",
                  children: [arg3]
                }],
                idempotencyKey: crypto.randomBytes(16).toString("hex"),
                custom: {}
              };
              addLog("TalkJS WS: message payload: " + JSON.stringify(opts).slice(0, 200), "info");
              fn3([1, "POST", "/conversations/" + arg2 + "/messages", opts, {}]);
              flag3 = true;
            } else {
              emitter.destroy();
              fn2(new Error("TalkJS auth failed status " + v8 + ": " + text2.slice(0, 300)));
            }
          } else if (v7 === 1 && flag3) {
            addLog("TalkJS WS msg response: status=" + v8 + " body=" + text2.slice(0, 300), "info");
            emitter.destroy();
            if (v8 === 200 || v8 === 201) {
              addLog("✅ TalkJS message sent!", "success");
              var v9 = parsed[2] && parsed[2].id || null;
              fn(v9 || true);
            } else {
              fn2(new Error("TalkJS message failed status " + v8 + ": " + text2.slice(0, 200)));
            }
          }
        } catch (err) {
          addLog("TalkJS WS parse error: " + err.message + " frame=" + text2.slice(0, 100), "warn");
        }
      }
    }
    emitter.on("data", function (chunk) {
      if (!flag) {
        var text2 = chunk.toString();
        if (text2.indexOf("101") !== -1) {
          flag = true;
          addLog("TalkJS WS: connected, authenticating...", "info");
          fn3([0, "POST", "/session/renew", {
            token: arg1
          }, {}]);
        } else {
          emitter.destroy();
          fn2(new Error("WS upgrade failed: " + text2.slice(0, 100)));
        }
        return;
      }
      list = Buffer.concat([list, chunk]);
      fn4();
    });
  });
}
function sendMessage(arg1, arg2, arg3, arg4, arg5) {
  if (_sentMsgRequests[arg1]) {
    addLog("💬 Skip duplicate msg for " + arg2 + " (already sent)", "info");
    return Promise.resolve(false);
  }
  _sentMsgRequests[arg1] = true;
  var v = CONFIG.messageTemplate.replace("{username}", arg2).replace("{currentRank}", arg3).replace("{desiredRank}", arg4).replace("{server}", arg5);
  addLog("💬 sendMessage called for " + arg2 + " | requestId:" + arg1.slice(0, 8) + "...", "info");
  var IdToken = getIdToken();
  if (!IdToken) {
    addLog("❌ No ID token — cannot send message", "err");
    return Promise.resolve(false);
  }
  function fn(arg12) {
    return api("POST", "/api/boostingOffers/boostingRequests/" + arg1 + "/createConversationForSeller", {}).catch(function (err) {
      var v2 = err && err.message || "";
      if (v2.indexOf("HTTP_409") !== -1 && arg12 < 2) {
        return new Promise(function (arg13) {
          setTimeout(arg13, 600);
        }).then(function () {
          return fn(arg12 + 1);
        });
      }
      throw err;
    });
  }
  return fn(1).then(function (err) {
    addLog("💬 Conv resp (full): " + JSON.stringify(err).slice(0, 1000), "info");
    var v2 = err.talkJsConversationId || err.talkJSConversationID || err.conversationId || null;
    var v3 = err.sellerUserId || null;
    if (v3 && /^[a-f0-9]{20}_n$/i.test(v3) && !_talkjsNymId) {
      _talkjsNymId = v3;
      saveTalkJSState();
    }
    if (!v2) {
      addLog("❌ No convId in response: " + JSON.stringify(err).slice(0, 100), "err");
      return false;
    }
    var v4 = String(v2).toLowerCase();
    var v5;
    if (_convIdMap[v4]) {
      v5 = Promise.resolve(null);
    } else {
      v5 = api("GET", "/api/boostingOffers/boostingRequests/" + arg1, null).then(function (err2) {
        try {
          var json = JSON.stringify(err2);
          addLog("🔬 boostingRequests/" + arg1.slice(0, 8) + " len=" + json.length, "info");
          var v6 = _talkjsNymId ? _talkjsNymId.replace(/_n$/i, "").toLowerCase() : "";
          var slice = v4.replace(/-/g, "").slice(0, 20);
          var matched = json.match(/https?:\/\/[^"]*talkjs\.com[^"]*/gi);
          if (matched) {
            addLog("🔬 TalkJS URL: " + matched[0].slice(0, 200), "success");
          }
          var list = json.match(/[a-f0-9]{20}(?![a-f0-9])/gi) || [];
          var opts = {};
          var list2 = [];
          list.forEach(function (item) {
            var v7 = item.toLowerCase();
            if (v7 === v6 || v7 === slice || opts[v7]) {
              return;
            }
            opts[v7] = 1;
            list2.push(v7);
          });
          if (list2.length === 0) {
            addLog("🔬 No short-ID candidates in boostingRequests response", "warn");
            return null;
          }
          addLog("🔬 Found " + list2.length + " candidate(s): " + list2.slice(0, 5).join(", "), "info");
          return list2;
        } catch (v7) {
          return null;
        }
      }).catch(function () {
        return null;
      });
    }
    addLog("💬 convId:" + v2.slice(0, 12) + " sellerUserId:" + (v3 || "?"), "info");
    if (v2 && !_trackedConvs[v2]) {
      _trackedConvs[v2] = {
        buyer: arg2,
        orderInfo: _soldOrderDetails[arg1] || {},
        lastMsgId: null
      };
    }
    function fn2(arg12) {
      return fetchTalkJSToken(IdToken, !!arg12).then(function (err2) {
        var v6 = String(v2 || "").toLowerCase();
        var crypto = require("crypto");
        var slice = crypto.createHash("sha1").update(v2).digest("hex").slice(0, 20);
        function fn3(arg13) {
          try {
            var parts = String(arg13 || "").split(".");
            if (parts.length < 2) {
              return "";
            }
            var list = parts[1].replace(/-/g, "+").replace(/_/g, "/");
            while (list.length % 4) {
              list += "=";
            }
            var parsed = JSON.parse(Buffer.from(list, "base64").toString("utf8"));
            return parsed.sub || "";
          } catch (v10) {
            return "";
          }
        }
        var fn3Result = fn3(err2);
        var v7 = fn3Result ? crypto.createHash("sha1").update(fn3Result).digest("hex").slice(0, 20) + "_n" : null;
        var v8 = _talkjsNymId && /^[a-f0-9]{20}_n$/i.test(_talkjsNymId) ? _talkjsNymId : v7;
        if (v8 && _talkjsNymId !== v8) {
          _talkjsNymId = v8;
          try {
            saveTalkJSState();
          } catch (v10) {}
          addLog("nymId derived from JWT: " + v8, "info");
        }
        var v9 = /https?:\/\//i.test(v);
        if (slice && v8) {
          addLog("TalkJS token OK" + (arg12 ? " (fresh)" : "") + ", sending HTTPS /say/ (clickable links)", "info");
          return sendTalkJSHTTPS(err2, slice, v, v8, _talkjsSessionId, null).then(function (err3) {
            var v10 = String(CONFIG.messageImageURL || "").trim();
            if (!v10) {
              return err3;
            }
            return _prepareTalkJSImage(v10).then(function (req) {
              var opts = {
                type: "file",
                subtype: "image",
                url: req.url,
                size: req.size,
                filename: req.filename,
                width: req.width,
                height: req.height
              };
              return sendTalkJSHTTPS(err2, slice, "", v8, _talkjsSessionId, opts).then(function () {
                addLog("✅ image attached after auto-message", "success");
                return err3;
              }).catch(function (err4) {
                addLog("⚠ text sent but image failed: " + ((err4 && err4.message || "") + "").slice(0, 120), "warn");
                return err3;
              });
            }).catch(function (err4) {
              addLog("⚠ image prep failed (text already sent): " + ((err4 && err4.message || "") + "").slice(0, 120), "warn");
              return err3;
            });
          }).catch(function (err3) {
            var v10 = err3 && err3.message || "";
            if (/401|403|auth|invalid|signature|expired|token/i.test(v10)) {
              throw err3;
            }
            addLog("TalkJS HTTPS failed (" + v10.slice(0, 80) + ") — falling back to WS", "warn");
            return sendTalkJSWebSocket(err2, v2, v, v3);
          });
        }
        if (v9) {
          addLog("No senderNym for " + v6.slice(0, 12) + " — text via REST API", "warn");
          return sendTalkJSRestAPI(err2, v2, v, v3, null).catch(function (err3) {
            addLog("REST API path failed (" + ((err3 && err3.message || "") + "").slice(0, 120) + ") — falling back to WS", "warn");
            return sendTalkJSWebSocket(err2, v2, v, v3);
          });
        }
        addLog("TalkJS token OK" + (arg12 ? " (fresh)" : "") + ", sending via WS", "info");
        return sendTalkJSWebSocket(err2, v2, v, v3);
      });
    }
    return v5.then(function (list) {
      if (!list || list.length === 0) {
        return null;
      }
      return fetchTalkJSToken(IdToken).then(function (err2) {
        function fn3(arg12) {
          if (arg12 >= list.length) {
            return null;
          }
          var v6 = list[arg12];
          return sendTalkJSHTTPS(err2, v6, v, _talkjsNymId, _talkjsSessionId, null).then(function (err3) {
            addLog("🔬 Short conv ID " + v6 + " VERIFIED — cached + HTTPS used", "success");
            _convIdMap[v4] = v6;
            saveTalkJSState();
            return err3;
          }).catch(function () {
            return fn3(arg12 + 1);
          });
        }
        return fn3(0);
      }).catch(function () {
        return null;
      });
    }).then(function (err2) {
      if (err2) {
        return err2;
      }
      return fn2(false).catch(function (err3) {
        var v6 = err3 && err3.message || "";
        if (/auth failed|401|403|invalid|signature|expired|token/i.test(v6)) {
          addLog("TalkJS retry with fresh token after: " + v6.slice(0, 80), "warn");
          return fn2(true);
        }
        throw err3;
      });
    }).then(function (err2) {
      if (err2 && typeof err2 === "string" && _trackedConvs[v2]) {
        _trackedConvs[v2].lastMsgId = err2;
      }
      return !!err2;
    }).catch(function (err2) {
      addLog("TalkJS msg error: " + (err2 && err2.message), "err");
      return false;
    });
  }).catch(function (err) {
    var v2 = err && err.message || "";
    if (v2.indexOf("HTTP_409") === -1) {
      addLog("❌ createConv error: " + v2, "err");
    }
    return false;
  });
}
function extractNetWinsFields(list) {
  var str = "?";
  var str2 = "?";
  var str3 = "Solo";
  var num = 1;
  if (!Array.isArray(list)) {
    return {
      cr: str,
      sv: str2,
      mth: str3,
      games: num
    };
  }
  list.forEach(function (item) {
    var v = item && item.value != null ? String(item.value).trim() : "";
    var v2 = item && item.label ? String(item.label).toLowerCase() : "";
    if (!v) {
      return;
    }
    if (v2.indexOf("current rank") !== -1 || v2.indexOf("current season rank") !== -1 || v2.indexOf("current") !== -1 && v2.indexOf("rank") !== -1) {
      str = v;
    } else if (v2 === "server" || v2.indexOf("server") !== -1 || v2 === "region" || v2.indexOf("region") !== -1) {
      str2 = v.toUpperCase();
    } else if (v2.indexOf("number of games") !== -1 || v2.indexOf("games") !== -1 || v2.indexOf("matches") !== -1) {
      var NumberResult = Number(v);
      if (Number.isInteger(NumberResult) && NumberResult >= 1 && NumberResult <= 200) {
        num = NumberResult;
      }
    } else if (v2.indexOf("completion") !== -1 || v2.indexOf("method") !== -1 || v2.indexOf("mode") !== -1) {
      str3 = v;
    }
  });
  list.forEach(function (item) {
    var NumberResult = Number(item && item.id);
    var v = item && item.value != null ? String(item.value).trim() : "";
    if (!v) {
      return;
    }
    if (str === "?" && NumberResult === 27) {
      str = v;
    } else if (str2 === "?" && NumberResult === 35) {
      str2 = v.toUpperCase();
    } else if (str3 === "Solo" && NumberResult === 44) {
      str3 = v;
    } else if (num === 1 && NumberResult === 41) {
      var NumberResult2 = Number(v);
      if (Number.isInteger(NumberResult2) && NumberResult2 >= 1 && NumberResult2 <= 200) {
        num = NumberResult2;
      }
    }
  });
  if (list.some(function (item) {
    return (String(item && item.value) || "").toLowerCase() === "duo";
  })) {
    str3 = "Duo";
  }
  str2 = (str2 || "").toUpperCase().trim();
  return {
    cr: str,
    sv: str2,
    mth: str3,
    games: num
  };
}
function processActiveRequestItem(arg1, arg2) {
  try {
    if (process.pkg && _licClient && !_licClient.isValid()) {
      return Promise.resolve();
    }
  } catch (v) {}
  return api("GET", "/api/boostingOffers/boostingRequests/" + arg1).then(function (err) {
    if (!err) {
      return;
    }
    var v = err.boostingCategoryId || "0";
    var v2 = err.buyerInfo && err.buyerInfo.user && err.buyerInfo.user.username || "Unknown";
    var list = err.boostingRequestDetails && err.boostingRequestDetails.descriptionValues || [];
    if (v === "2" || v === 2) {
      addLog("NW dvArr: " + JSON.stringify(list.map(function (item) {
        return {
          id: item.id,
          v: item.value,
          l: item.label
        };
      })).slice(0, 500), "info");
      var extractNetWinsFieldsResult = extractNetWinsFields(list);
      var v3 = extractNetWinsFieldsResult.cr;
      var v4 = extractNetWinsFieldsResult.sv;
      var v5 = extractNetWinsFieldsResult.mth;
      var v6 = extractNetWinsFieldsResult.games;
      addLog("?? SignalR NW: " + v3 + " | " + v4 + " | x" + v6 + " | " + v5, "info");
      var v7 = v4 === "EU" ? CONFIG.acceptNetWinsEU : v4 === "NA" ? CONFIG.acceptNetWinsNA : v4 === "LATAM" ? CONFIG.acceptNetWinsLATAM : v4 === "AP" ? CONFIG.acceptNetWinsAP : false;
      if (!v7) {
        addActivity({
          type: "Rejected",
          account: CONFIG.email,
          region: v4,
          boost: "Net Wins (" + v3 + ")",
          price: null,
          details: "Net Wins disabled for " + v4
        });
        stats.skipped++;
        return;
      }
      if (!isAllowedServer(v4)) {
        addActivity({
          type: "Rejected",
          account: CONFIG.email,
          region: v4,
          boost: "Net Wins (" + v3 + ")",
          price: null,
          details: "Region not accepted: " + v4
        });
        stats.skipped++;
        return;
      }
      var v8 = v5.toLowerCase().indexOf("duo") !== -1;
      if (v8) {
        var v9 = v4 === "EU" ? CONFIG.acceptEUDuo : v4 === "NA" ? CONFIG.acceptNADuo : v4 === "LATAM" ? CONFIG.acceptLATAMDuo : CONFIG.acceptAPDuo;
        if (!v9) {
          addActivity({
            type: "Rejected",
            account: CONFIG.email,
            region: v4,
            boost: "Net Wins Duo (" + v3 + ")",
            price: null,
            details: "Duo not accepted for " + v4
          });
          stats.skipped++;
          return;
        }
      }
      var NWRankKey = getNWRankKey(v3);
      var v10 = v4 === "EU" ? "acceptEU" : v4 === "NA" ? "acceptNA" : v4 === "LATAM" ? "acceptLATAM" : "acceptAP";
      var v11 = v8 ? "Duo" : "";
      if (NWRankKey.startsWith("immortal") || NWRankKey === "radiant") {
        var flag = false;
        if (NWRankKey === "immortal_1") {
          flag = CONFIG[v10 + "Immo1" + v11];
        } else if (NWRankKey === "immortal_2") {
          flag = CONFIG[v10 + "Immo2" + v11];
        } else if (NWRankKey === "immortal_3") {
          flag = CONFIG[v10 + "Immo3" + v11];
        } else if (NWRankKey === "radiant") {
          flag = CONFIG[v10 + "Radiant" + v11];
        }
        if (!flag) {
          var v12 = NWRankKey === "immortal_1" ? "Immortal I" : NWRankKey === "immortal_2" ? "Immortal II" : NWRankKey === "immortal_3" ? "Immortal III" : "Radiant";
          addActivity({
            type: "Immortal",
            account: CONFIG.email,
            region: v4,
            boost: "Net Wins (" + v3 + ")",
            price: null,
            details: v12 + (v8 ? " Duo" : "") + " toggle OFF (" + v4 + ")"
          });
          return;
        }
      }
      if (NWRankKey === "ascendant") {
        var v13 = v3 && v3.endsWith("III") ? "Asc3" : v3 && v3.endsWith("II") ? "Asc2" : "Asc1";
        var v14 = CONFIG[v10 + v13 + v11];
        if (!v14) {
          addActivity({
            type: "Rejected",
            account: CONFIG.email,
            region: v4,
            boost: "Net Wins (" + v3 + ")",
            price: null,
            details: "Ascendant " + v13 + " NW" + (v8 ? " Duo" : "") + " toggle OFF (" + v4 + ")"
          });
          stats.skipped++;
          return;
        }
      }
      var v15 = v8 ? v4 === "EU" ? NETWIN_PRICES_DUO_EU : v4 === "NA" ? NETWIN_PRICES_DUO_NA : v4 === "LATAM" ? NETWIN_PRICES_DUO_LATAM : NETWIN_PRICES_DUO_AP : v4 === "EU" ? NETWIN_PRICES_EU : v4 === "NA" ? NETWIN_PRICES_NA : v4 === "LATAM" ? NETWIN_PRICES_LATAM : NETWIN_PRICES_AP;
      var v16 = v15[NWRankKey] || 0;
      var v17 = Math.round(v16 * v6 * 100) / 100;
      if (v17 <= 0) {
        addActivity({
          type: "Error",
          account: CONFIG.email,
          region: v4,
          boost: "Net Wins (" + v3 + ") x" + v6,
          price: null,
          details: "Price=0"
        });
        return;
      }
      var v18 = NETWIN_HOURS[NWRankKey] || 1;
      var v19 = Math.round(v18 * v6 * 10) / 10;
      var str = "Day1";
      if (v19 <= 1) {
        str = "Hour1";
      } else if (v19 <= 2) {
        str = "Hour2";
      } else if (v19 <= 3) {
        str = "Hour3";
      } else if (v19 <= 5) {
        str = "Hour5";
      } else if (v19 <= 8) {
        str = "Hour8";
      } else if (v19 <= 12) {
        str = "Hour12";
      } else if (v19 <= 24) {
        str = "Day1";
      } else if (v19 <= 48) {
        str = "Day2";
      } else if (v19 <= 72) {
        str = "Day3";
      } else {
        str = "Day7";
      }
      var v20 = "Net Wins x" + v6 + " (" + v3 + ")";
      stats.seen++;
      _lastOrderAt = Date.now();
      addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "info");
      addLog("??— NW " + v2 + " | " + v3 + " | " + v4 + " | x" + v6 + " | $" + v17, "success");
      addLog("??— NW delivery: del=" + str + " | hpg=" + v18 + " | htotal=" + v19, "info");
      var v21 = Promise.resolve();
      if (CONFIG.autoOffer) {
        v21 = v21.then(function () {
          return sleep(50).then(function () {
            return sendOffer(arg1, v17, applySlowMode(str)).then(function (res) {
              if (res.ok) {
                addActivity({
                  type: "Offer Sent",
                  account: CONFIG.email,
                  region: v4,
                  boost: v20,
                  price: v17,
                  details: "Auto-offer: $" + v17,
                  oid: arg1,
                  un: v2
                });
                addLog("✅ NW OFFER $" + v17 + " ? " + v2, "success");
                stats.offered++;
                stats.revenue += v17;
                _soldOrderDetails[arg1] = {
                  cr: v3,
                  dr: "Net Wins x" + v6,
                  sv: v4,
                  deliveryEnum: str,
                  numGames: v6
                };
              } else {
                var v27 = res.err || "";
                if (v27.indexOf("already") !== -1 || v27.indexOf("AlreadyExists") !== -1) {
                  addActivity({
                    type: "Rejected",
                    account: CONFIG.email,
                    region: v4,
                    boost: v20,
                    price: null,
                    details: "Already offered"
                  });
                } else {
                  addActivity({
                    type: "Error",
                    account: CONFIG.email,
                    region: v4,
                    boost: v20,
                    price: null,
                    details: "Offer failed: " + v27
                  });
                  stats.errors++;
                }
              }
            });
          });
        });
      }
      if (CONFIG.autoMessage) {
        v21 = v21.then(function () {
          return sendMessage(arg1, v2, v3, "Net Wins x" + v6, v4).then(function (err2) {
            if (err2) {
              addActivity({
                type: "auto_message",
                account: CONFIG.email,
                region: v4,
                boost: v20,
                price: null,
                details: "Auto-message sent"
              });
              stats.messaged++;
            }
          });
        });
      }
      if (CONFIG.cooldownSeconds > 0) {
        v21 = v21.then(function () {
          return sleep(CONFIG.cooldownSeconds * 1000);
        });
      }
      return v21;
    }
    var str2 = "?";
    var str3 = "?";
    var str4 = "?";
    var str5 = "Solo";
    var num = 0;
    var num2 = 0;
    list.forEach(function (item) {
      var NumberResult = Number(item.id);
      var v27 = (item.label || "").toLowerCase();
      if (NumberResult === 26) {
        str2 = item.value;
      } else if (NumberResult === 27) {
        num = Number(item.value) || 0;
      } else if (NumberResult === 53) {
        str3 = item.value;
      } else if (NumberResult === 54) {
        num2 = Number(item.value) || 0;
      } else if (NumberResult === 60) {
        str4 = item.value;
      } else if (NumberResult === 63) {
        str5 = item.value || "Solo";
      } else if (NumberResult === 9) {
        str4 = item.value;
      } else if (NumberResult === 10) {
        str5 = item.value || "Solo";
      } else if (v27.indexOf("current rank") !== -1) {
        str2 = item.value;
      } else if (v27.indexOf("desired rank") !== -1) {
        str3 = item.value;
      } else if (v27 === "server") {
        str4 = item.value;
      } else if (v27.indexOf("completion") !== -1 || v27.indexOf("method") !== -1) {
        str5 = item.value || "Solo";
      } else if (v27.indexOf("desired rr") !== -1 || v27.indexOf("target rr") !== -1 || v27.indexOf("desired rating") !== -1) {
        num2 = Number(item.value) || 0;
      } else if (v27.indexOf("current rr") !== -1 || v27.indexOf("current rating") !== -1) {
        num = Number(item.value) || 0;
      }
    });
    addLog("🔍 Order: " + v2 + " | cat:" + v + " | " + str2 + " ? " + str3 + " | " + str4 + " | " + str5, "info");
    str4 = (str4 || "").toUpperCase().trim();
    var v22 = str5 && str5.toLowerCase().indexOf("duo") !== -1;
    if (v === "1" || v === 1) {
      addActivity({
        type: "Rejected",
        account: CONFIG.email,
        region: str4,
        boost: "Placements",
        price: null,
        details: "Placements — skipped"
      });
      stats.skipped++;
      return;
    }
    var v23 = v === "3" || v === 3;
    if (v23) {
      var v24 = str4 === "EU" && CONFIG.skipCustomEU || str4 === "NA" && CONFIG.skipCustomNA || str4 === "LATAM" && CONFIG.skipCustomLATAM || str4 === "AP" && CONFIG.skipCustomAP;
      if (v24) {
        addActivity({
          type: "Rejected",
          account: CONFIG.email,
          region: str4,
          boost: "Custom",
          price: null,
          details: "Custom skipped (" + str4 + ")"
        });
        stats.skipped++;
        return;
      }
    }
    if (!isAllowedServer(str4)) {
      addActivity({
        type: "Rejected",
        account: CONFIG.email,
        region: str4,
        boost: str2 + "?" + str3,
        price: null,
        details: "Region not accepted: " + str4
      });
      return;
    }
    if (v22) {
      var v25 = str4 === "EU" ? CONFIG.acceptEUDuo : str4 === "NA" ? CONFIG.acceptNADuo : str4 === "LATAM" ? CONFIG.acceptLATAMDuo : CONFIG.acceptAPDuo;
      if (!v25) {
        addActivity({
          type: "Rejected",
          account: CONFIG.email,
          region: str4,
          boost: str2 + "?" + str3,
          price: null,
          details: "Duo not accepted for " + str4
        });
        stats.skipped++;
        return;
      }
    }
    var checkDestinationToggleResult = checkDestinationToggle(str3, str4, v22);
    if (!checkDestinationToggleResult.allowed) {
      var v26 = str3 && (str3.indexOf("Immortal") !== -1 || str3 === "Radiant") ? "Immortal" : "Rejected";
      addActivity({
        type: v26,
        account: CONFIG.email,
        region: str4,
        boost: str2 + "?" + str3,
        price: null,
        details: checkDestinationToggleResult.reason + (v23 ? " [custom]" : "")
      });
      if (v26 === "Rejected") {
        stats.skipped++;
      }
      return;
    }
    var calcPriceResult = calcPrice(str2, num, str3, str4, v22, num2);
    if (calcPriceResult.price <= 0) {
      addLog("?? Missed order: price=0 for " + str2 + "?" + str3, "warn");
      return;
    }
    stats.seen++;
    _lastOrderAt = Date.now();
    addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "info");
    addLog("??— [MISSED] " + v2 + " | " + str2 + " ? " + str3 + " | " + str4 + " | $" + calcPriceResult.price, "success");
    var flag2 = false;
    var v21 = Promise.resolve();
    if (CONFIG.autoOffer) {
      v21 = v21.then(function () {
        return sleep(50).then(function () {
          return sendOffer(arg1, calcPriceResult.price, applySlowMode(calcPriceResult.deliveryEnum)).then(function (res) {
            if (res.ok) {
              addActivity({
                type: "Offer Sent",
                account: CONFIG.email,
                region: str4,
                boost: str2 + "?" + str3,
                price: calcPriceResult.price,
                details: "[Missed order] Auto-offer: $" + calcPriceResult.price,
                oid: arg1,
                un: v2
              });
              addLog("✅ OFFER $" + calcPriceResult.price + " ? " + v2 + " [missed order]", "success");
              stats.offered++;
              stats.revenue += calcPriceResult.price;
              _soldOrderDetails[arg1] = {
                cr: str2,
                dr: str3,
                sv: str4,
                deliveryEnum: calcPriceResult.deliveryEnum
              };
              try {
                tgNotifyOfferSent({
                  buyer: v2,
                  sv: str4,
                  cr: str2,
                  dr: str3,
                  price: calcPriceResult.price,
                  delivery: calcPriceResult.deliveryEnum,
                  requestId: arg1
                });
              } catch (v27) {}
            } else {
              addLog("Missed order offer failed: " + res.err, "err");
              if (res.err && res.err.indexOf("Canceled") !== -1) {
                flag2 = true;
              }
            }
          });
        });
      });
    }
    addLog("💬 autoMessage=" + CONFIG.autoMessage + " | canceled=" + flag2 + " | requestId=" + arg1.slice(0, 8), "info");
    if (CONFIG.autoMessage) {
      v21 = v21.then(function () {
        if (flag2) {
          addLog("💬 Skipping message — order is Canceled", "warn");
          return;
        }
        addLog("💬 Calling sendMessage for missed order: " + v2, "info");
        return sendMessage(arg1, v2, str2, str3, str4).then(function (err2) {
          if (err2) {
            stats.messaged++;
          }
        });
      });
    }
    if (CONFIG.cooldownSeconds > 0) {
      v21 = v21.then(function () {
        return sleep(CONFIG.cooldownSeconds * 1000);
      });
    }
    return v21;
  }).catch(function (err) {
    addLog("❌ processActiveRequest error: " + err.message, "err");
    if (err.message === "TIMEOUT" || err.message.indexOf("429") !== -1) {
      setTimeout(function () {
        api("GET", "/api/boostingOffers/boostingRequests/" + arg1).then(function (err2) {
          if (err2) {
            processActiveRequestItem(arg1, arg2);
          }
        }).catch(function () {});
      }, 3000);
    }
  });
}
function isDuo_check(arg1) {
  return arg1 && arg1.toLowerCase().indexOf("duo") !== -1;
}
var _rateLimitedUntil = 0;
function checkSoldOrders(arg1) {
  api("GET", "/api/orders/me/seller/orders?cursorValue=9999-99-99%2099%3A99%3A99.999999999999999-9999-9999-9999-999999999999&pageSize=50&pageDirection=Next&isAscendingDateOrder=false&ignorePendingReviewOrders=false&displayFilter=DisplaySellingOrders&orderGroup=Regular").then(function (err) {
    var list = err.results || err.orders || err.items || [];
    if (!Array.isArray(list)) {
      addLog("Sold orders - not an array, data: " + JSON.stringify(err).slice(0, 200), "warn");
      return;
    }
    if (arg1) {
      _soldOrdersList = [];
      var now = Date.now();
      list.forEach(function (item) {
        var v = item.id || item.orderId || item.requestId;
        var v2 = item.orderOfferDetails && item.orderOfferDetails.gameCategoryTitle || "Valorant";
        var v3 = item.buyerUsername || "Unknown";
        var v4 = item.totalPrice && item.totalPrice.amount || 0;
        var v5 = item.state && item.state.state || "Paid";
        var v6 = item.createdDate || "";
        var v7 = v6 ? new Date(v6).getTime() : 0;
        var v8 = v7 > 0 && now - v7 < 60000;
        if (v && !v8) {
          _seenSoldOrders[v] = true;
        }
        _soldOrdersList.push({
          game: v2,
          buyer: v3,
          price: v4,
          status: v5,
          date: v6,
          orderedDate: v6,
          details: "Order ID: " + (v || "?"),
          id: v
        });
        if (v8 && v) {
          addLog("?? NEW SOLD ORDER (while bot was off): " + v2 + " | " + v3 + " | $" + v4, "success");
          sendDiscordNotification({
            game: v2,
            buyer: v3,
            price: v4,
            status: v5,
            date: v6,
            id: v
          });
        }
      });
      if (_soldOrdersList.length > 0) {
        addLog("?? Loaded " + _soldOrdersList.length + " existing sold order(s) from Eldorado", "success");
      }
      return;
    }
    list.forEach(function (item) {
      var v = item.id || item.orderId;
      if (!v || _seenSoldOrders[v]) {
        return;
      }
      var v2 = item.state && item.state.state || "";
      if (v2 === "Cancelled" || v2 === "Refunded") {
        return;
      }
      _seenSoldOrders[v] = true;
      var v3 = item.orderOfferDetails && item.orderOfferDetails.gameCategoryTitle || "Valorant";
      var v4 = item.buyerUsername || "Unknown";
      var v5 = item.totalPrice && item.totalPrice.amount || 0;
      var v6 = v2 || "Paid";
      var v7 = item.createdDate || "";
      addLog("?? SOLD ORDER! " + v3 + " | Buyer: " + v4 + " | $" + v5 + " | Status: " + v6, "success");
      (function (err2, data, extra, arg4, arg5, arg6) {
        api("GET", "/api/orders/me/seller/orders/" + err2).then(function (err3) {
          var v8 = err3 && err3.talkJsConversationId || "";
          var v9 = err3 && err3.orderOfferDetails && err3.orderOfferDetails.boostingRequestId || "";
          var v10 = err3 && err3.orderOfferDetails && err3.orderOfferDetails.guaranteedDeliveryTime || "";
          var v11 = _soldOrderDetails[err2] || _soldOrderDetails[v9] || {};
          if (v11.cr) {
            sendDiscordNotification({
              id: err2,
              game: data,
              buyer: extra,
              price: arg4,
              status: arg5,
              date: arg6,
              currentRank: v11.cr,
              desiredRank: v11.dr,
              server: v11.sv,
              deliveryEnum: v10 || v11.deliveryEnum,
              numGames: v11.numGames || null,
              conversationId: v8
            });
          } else if (v9) {
            api("GET", "/api/boostingOffers/boostingRequests/" + v9).then(function (err4) {
              addLog("BR details: " + JSON.stringify(err4).slice(0, 500), "info");
              var list2 = err4 && err4.boostingRequestDetails && err4.boostingRequestDetails.descriptionValues || [];
              var v12 = err4 && err4.boostingCategoryId;
              var v13 = v12 === "2" || v12 === 2 || data && data.toLowerCase().indexOf("net win") !== -1;
              var str = "";
              var str2 = "";
              var str3 = "";
              var v14 = null;
              if (err4 && err4.currentRank) {
                str = err4.currentRank;
              }
              if (err4 && err4.desiredRank) {
                str2 = err4.desiredRank;
              }
              if (err4 && err4.server) {
                str3 = err4.server;
              }
              if (v13) {
                try {
                  var extractNetWinsFieldsResult = extractNetWinsFields(list2);
                  if (!str) {
                    str = extractNetWinsFieldsResult.cr;
                  }
                  if (!str3) {
                    str3 = extractNetWinsFieldsResult.sv;
                  }
                  if (v14 == null && extractNetWinsFieldsResult.games >= 1) {
                    v14 = extractNetWinsFieldsResult.games;
                  }
                } catch (v15) {}
              } else {
                list2.forEach(function (item2) {
                  var v15 = item2 && item2.value != null ? String(item2.value).trim() : "";
                  var v16 = item2 && item2.label ? String(item2.label).toLowerCase() : "";
                  if (!v15) {
                    return;
                  }
                  if (!str && v16.indexOf("current") !== -1 && v16.indexOf("rank") !== -1) {
                    str = v15;
                  } else if (!str2 && v16.indexOf("desired") !== -1) {
                    str2 = v15;
                  } else if (!str3 && (v16 === "server" || v16.indexOf("platform") !== -1 || v16 === "region")) {
                    str3 = v15;
                  }
                });
                list2.forEach(function (item2) {
                  var NumberResult = Number(item2 && item2.id);
                  var v15 = item2 && item2.value != null ? String(item2.value).trim() : "";
                  if (!v15) {
                    return;
                  }
                  if (!str && (NumberResult === 26 || NumberResult === 58 || NumberResult === 31)) {
                    str = v15;
                  } else if (!str2 && (NumberResult === 53 || NumberResult === 54)) {
                    str2 = v15;
                  } else if (!str3 && (NumberResult === 60 || NumberResult === 23 || NumberResult === 9)) {
                    str3 = v15;
                  }
                });
              }
              addLog("Sold order extracted: cr=" + str + " dr=" + str2 + " sv=" + str3 + " games=" + v14 + " NW=" + v13, "info");
              sendDiscordNotification({
                id: err2,
                game: data,
                buyer: extra,
                price: arg4,
                status: arg5,
                date: arg6,
                currentRank: str || "—",
                desiredRank: str2 || (v13 ? "Net Wins" : "—"),
                server: str3 || "—",
                deliveryEnum: v10,
                numGames: v14,
                conversationId: v8
              });
            }).catch(function (err4) {
              addLog("BR fetch failed for sold order: " + (err4 && err4.message), "warn");
              sendDiscordNotification({
                id: err2,
                game: data,
                buyer: extra,
                price: arg4,
                status: arg5,
                date: arg6,
                currentRank: "—",
                desiredRank: "—",
                server: "—",
                deliveryEnum: v10,
                conversationId: v8
              });
            });
          } else {
            sendDiscordNotification({
              id: err2,
              game: data,
              buyer: extra,
              price: arg4,
              status: arg5,
              date: arg6,
              currentRank: "—",
              desiredRank: "—",
              server: "—",
              deliveryEnum: v10,
              conversationId: v8
            });
          }
        }).catch(function () {
          sendDiscordNotification({
            id: err2,
            game: data,
            buyer: extra,
            price: arg4,
            status: arg5,
            date: arg6,
            currentRank: "—",
            desiredRank: "—",
            server: "—",
            conversationId: ""
          });
        });
      })(v, v3, v4, v5, v6, v7);
      addActivity({
        type: "Sold Order",
        account: CONFIG.email,
        region: "—",
        boost: v3,
        price: parseFloat(v5) || null,
        details: "Buyer: " + v4 + " — Pending delivery!"
      });
      stats.revenue += parseFloat(v5) || 0;
      _soldOrdersList.unshift({
        game: v3,
        buyer: v4,
        price: v5,
        status: v6,
        date: v7 || new Date().toISOString(),
        orderedDate: v7,
        details: "Order ID: " + v,
        id: v
      });
      if (_soldOrdersList.length > 100) {
        _soldOrdersList.pop();
      }
    });
  }).catch(function (err) {
    addLog("Sold orders API error: " + err.message, "warn");
  });
}
var _discordQueue = [];
var _discordSending = false;
function processDiscordQueue() {
  if (_discordSending || _discordQueue.length === 0) {
    return;
  }
  _discordSending = true;
  var fn = _discordQueue.shift();
  fn();
  setTimeout(function () {
    _discordSending = false;
    processDiscordQueue();
  }, 1500);
}
var _RANK_ORDER = ["Iron I", "Iron II", "Iron III", "Bronze I", "Bronze II", "Bronze III", "Silver I", "Silver II", "Silver III", "Gold I", "Gold II", "Gold III", "Platinum I", "Platinum II", "Platinum III", "Diamond I", "Diamond II", "Diamond III", "Ascendant I", "Ascendant II", "Ascendant III", "Immortal I", "Immortal II", "Immortal III", "Radiant"];
function _rankIdx(arg1) {
  if (!arg1) {
    return -1;
  }
  var v = _RANK_ORDER.indexOf(String(arg1).trim());
  return v;
}
function _rankPasses(arg1) {
  var v = (CONFIG.telegramMinRank || "").trim();
  if (!v) {
    return true;
  }
  var RankIdxResult = _rankIdx(arg1);
  var RankIdxResult2 = _rankIdx(v);
  if (RankIdxResult < 0 || RankIdxResult2 < 0) {
    return true;
  }
  return RankIdxResult >= RankIdxResult2;
}
function _tgEscape(arg1) {
  arg1 = String(arg1 == null ? "" : arg1);
  return arg1.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function sendTelegram(arg1) {
  var v = (CONFIG.telegramBotToken || TELEGRAM_BOT_TOKEN || "").trim();
  var v2 = (CONFIG.telegramChatID || TELEGRAM_CHAT_IDS || "").trim();
  if (!v || !v2) {
    return;
  }
  var filtered = v2.split(",").map(function (item) {
    return item.trim();
  }).filter(Boolean);
  if (!filtered.length) {
    return;
  }
  filtered.forEach(function (item) {
    try {
      var v3 = "chat_id=" + encodeURIComponent(item) + "&text=" + encodeURIComponent(arg1) + "&parse_mode=HTML&disable_web_page_preview=true";
      var res = https.request({
        hostname: "api.telegram.org",
        port: 443,
        path: "/bot" + encodeURIComponent(v) + "/sendMessage",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(v3)
        },
        timeout: 12000
      }, function (res2) {
        var list = [];
        res2.on("data", function (chunk) {
          list.push(chunk);
        });
        res2.on("end", function () {
          if (res2.statusCode !== 200) {
            try {
              addLog("Telegram non-200 (" + res2.statusCode + ") for chat " + item + ": " + Buffer.concat(list).toString("utf8").slice(0, 150), "warn");
            } catch (v4) {}
          }
        });
      });
      res.on("error", function (err) {
        try {
          addLog("Telegram send error: " + err.message, "warn");
        } catch (v4) {}
      });
      res.on("timeout", function () {
        res.destroy(new Error("timeout"));
      });
      res.write(v3);
      res.end();
    } catch (err) {
      try {
        addLog("Telegram send exception: " + err.message, "warn");
      } catch (v4) {}
    }
  });
}
function _tgKnown(arg1) {
  if (arg1 == null) {
    return false;
  }
  var v = String(arg1).trim();
  if (!v) {
    return false;
  }
  if (v === "—" || v === "-" || v === "?" || v === "—" || v === "—") {
    return false;
  }
  return true;
}
function _tgServerPasses(arg1) {
  var v = String(arg1 || "").toUpperCase().trim();
  if (v === "EU") {
    return CONFIG.telegramServerEU !== false;
  }
  if (v === "NA") {
    return CONFIG.telegramServerNA !== false;
  }
  if (v === "LATAM") {
    return CONFIG.telegramServerLATAM !== false;
  }
  if (v === "AP") {
    return CONFIG.telegramServerAP !== false;
  }
  return true;
}
function _tgFmtBuyer(arg1) {
  return _tgEscape(_tgKnown(arg1) ? arg1 : "Unknown buyer");
}
function _tgFmtBoost(arg1, arg2) {
  var TgKnownResult = _tgKnown(arg1);
  var TgKnownResult2 = _tgKnown(arg2);
  if (TgKnownResult && TgKnownResult2) {
    return _tgEscape(arg1) + " ? " + _tgEscape(arg2);
  }
  if (TgKnownResult2) {
    return _tgEscape(arg2);
  }
  if (TgKnownResult) {
    return _tgEscape(arg1);
  }
  return "";
}
function tgNotifyPaidOrder(arg1) {
  if (!CONFIG.telegramOnPaidOrder) {
    return;
  }
  var v = arg1.server || arg1.sv || "";
  if (!_tgServerPasses(v)) {
    return;
  }
  var v2 = arg1.desiredRank || arg1.dr || "";
  if (!_rankPasses(v2)) {
    return;
  }
  var list = ["?? <b>Paid Order</b>", ""];
  list.push("<b>Buyer:</b> " + _tgFmtBuyer(arg1.buyer));
  if (_tgKnown(v)) {
    list.push("<b>Region:</b> " + _tgEscape(v));
  }
  var TgFmtBoostResult = _tgFmtBoost(arg1.currentRank || arg1.cr, v2);
  if (TgFmtBoostResult) {
    list.push("<b>Boost:</b> " + TgFmtBoostResult);
  }
  if (_tgKnown(arg1.price)) {
    list.push("<b>Price:</b> $" + _tgEscape(arg1.price));
  }
  if (arg1.id) {
    list.push("<a href=\"https://www.eldorado.gg/boosting-request/" + _tgEscape(arg1.id) + "\">?? View Order</a>");
  }
  sendTelegram(list.join("\n"));
}
function tgNotifyOfferSent(arg1) {
  if (!CONFIG.telegramOnOfferSent) {
    return;
  }
  if (!_tgServerPasses(arg1.sv)) {
    return;
  }
  if (!_rankPasses(arg1.dr || "")) {
    return;
  }
  var list = ["? <b>Offer Sent</b>", ""];
  list.push("<b>Buyer:</b> " + _tgFmtBuyer(arg1.buyer));
  if (_tgKnown(arg1.sv)) {
    list.push("<b>Region:</b> " + _tgEscape(arg1.sv));
  }
  var TgFmtBoostResult = _tgFmtBoost(arg1.cr, arg1.dr);
  if (TgFmtBoostResult) {
    list.push("<b>Boost:</b> " + TgFmtBoostResult);
  }
  if (_tgKnown(arg1.price)) {
    list.push("<b>Price:</b> $" + _tgEscape(arg1.price));
  }
  if (_tgKnown(arg1.delivery)) {
    list.push("<b>Delivery:</b> " + _tgEscape(arg1.delivery));
  }
  if (arg1.requestId) {
    list.push("<a href=\"https://www.eldorado.gg/boosting-request/" + _tgEscape(arg1.requestId) + "\">?? View Request</a>");
  }
  sendTelegram(list.join("\n"));
}
function tgNotifyImmortal(arg1) {
  if (!CONFIG.telegramOnImmortal) {
    return;
  }
  if (!_tgServerPasses(arg1.sv)) {
    return;
  }
  var list = ["?? <b>Immortal/Radiant Request — Manual Action Needed</b>", ""];
  list.push("<b>Buyer:</b> " + _tgFmtBuyer(arg1.buyer));
  if (_tgKnown(arg1.sv)) {
    list.push("<b>Region:</b> " + _tgEscape(arg1.sv));
  }
  var TgFmtBoostResult = _tgFmtBoost(arg1.cr, arg1.dr);
  if (TgFmtBoostResult) {
    list.push("<b>Boost:</b> " + TgFmtBoostResult);
  }
  if (_tgKnown(arg1.reason)) {
    list.push("<b>Reason:</b> " + _tgEscape(arg1.reason));
  }
  if (arg1.requestId) {
    list.push("<a href=\"https://www.eldorado.gg/boosting-request/" + _tgEscape(arg1.requestId) + "\">?? View Request</a>");
  }
  sendTelegram(list.join("\n"));
}
function tgNotifyError(arg1, arg2) {
  if (!CONFIG.telegramOnError) {
    return;
  }
  sendTelegram("? <b>Error</b>\n\n<b>Context:</b> " + _tgEscape(arg1 || "?") + "\n<b>Error:</b> " + _tgEscape(arg2 || "?"));
}
function sendDiscordNotification(arg1) {
  _discordQueue.push(function () {
    _sendDiscordNow(arg1);
  });
  processDiscordQueue();
  try {
    tgNotifyPaidOrder(arg1);
  } catch (v) {}
}
function _sendDiscordNow(arg1) {
  var v = CONFIG.discordWebhook || DISCORD_WEBHOOK;
  if (!v) {
    addLog("?? Discord: no webhook set", "warn");
    return;
  }
  DISCORD_WEBHOOK = v;
  try {
    var URL = new URL(v);
    var v2 = parseFloat(arg1.price || 0).toFixed(2);
    var v3 = arg1.buyer || "Unknown";
    var v4 = arg1.game || "Valorant";
    var v5 = arg1.status || "Paid";
    var v6 = arg1.date ? new Date(arg1.date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) : new Date().toLocaleString();
    var v7 = arg1.currentRank || "";
    var v8 = arg1.desiredRank || "";
    var v9 = arg1.server || "";
    var v10 = arg1.conversationId || "";
    var list = [];
    list.push({
      name: "?? Buyer",
      value: "**" + v3 + "**",
      inline: true
    });
    list.push({
      name: "?? Price",
      value: "**$" + v2 + "**",
      inline: true
    });
    list.push({
      name: "?? Status",
      value: v5,
      inline: true
    });
    var v11 = v4 && v4.toLowerCase().indexOf("net win") !== -1;
    if (v7 && v8 && v7 !== "—" && v8 !== "—") {
      list.push({
        name: "?? Boost",
        value: "**" + v7 + "** ? **" + v8 + "**",
        inline: true
      });
    } else if (v11 && v7 && v7 !== "—") {
      list.push({
        name: "🏆 Rank",
        value: "**" + v7 + "**",
        inline: true
      });
    } else {
      list.push({
        name: "?? Type",
        value: v4,
        inline: true
      });
    }
    if (v9 && v9 !== "—") {
      list.push({
        name: "??— Server",
        value: v9,
        inline: true
      });
    }
    if (arg1.numGames) {
      list.push({
        name: "?? Games",
        value: "**x" + arg1.numGames + "**",
        inline: true
      });
    }
    if (arg1.deliveryEnum || arg1.delivery) {
      var opts = {
        Minute20: "? 20 min",
        Hour1: "??— 1 hour",
        Hour2: "?? 2 hours",
        Hour3: "?? 3 hours",
        Hour4: "?? 4 hours",
        Hour5: "?? 5 hours",
        Hour8: "?? 8 hours",
        Hour12: "?? 12 hours",
        Day1: "?? 1 day",
        Day2: "?? 2 days",
        Day3: "?? 3 days",
        Day7: "?? 7 days",
        Day14: "?? 14 days"
      };
      var v12 = opts[arg1.deliveryEnum || arg1.delivery] || arg1.deliveryEnum || arg1.delivery;
      list.push({
        name: "⏱ Delivery",
        value: v12,
        inline: true
      });
    }
    list.push({
      name: "??— Date",
      value: v6,
      inline: true
    });
    list.push({
      name: "?? Order ID",
      value: "`" + (arg1.id || "—").slice(0, 18) + "...`",
      inline: false
    });
    var v13 = v5 === "Paid" ? 15774761 : v5 === "Completed" ? 58998 : v5 === "Delivered" ? 5032432 : 15774761;
    var opts2 = {
      embeds: [{
        title: "??  NEW ORDER — " + v3 + " bought!",
        description: v7 && v8 && v7 !== "—" && v8 !== "—" ? "**" + v7 + "** ? **" + v8 + "**" + (v9 && v9 !== "—" ? " | **" + v9 + "**" : "") + " | **$" + v2 + "**" : v11 && v7 && v7 !== "—" ? "**Net Wins** | **" + v7 + "**" + (arg1.numGames ? " x**" + arg1.numGames + "**" : "") + (v9 && v9 !== "—" ? " | **" + v9 + "**" : "") + " | **$" + v2 + "**" : "**" + v4 + "** | **$" + v2 + "**",
        color: v13,
        fields: list,
        thumbnail: {
          url: "https://assetsdelivery.eldorado.gg/v7/_assets_/favicons/v4/efav-192.png"
        },
        footer: {
          text: "ELDOBOT v14 — Auto-Offer Engine",
          icon_url: "https://assetsdelivery.eldorado.gg/v7/_assets_/favicons/v4/efav-32.png"
        },
        timestamp: new Date().toISOString()
      }],
      content: "@everyone"
    };
    var json = JSON.stringify(opts2);
    var res = https.request({
      hostname: URL.hostname,
      path: URL.pathname + URL.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json)
      }
    }, function (res2) {
      if (res2.statusCode === 204 || res2.statusCode === 200) {
        addLog("?? Discord notified — " + v3 + " $" + v2, "success");
      } else {
        addLog("Discord webhook status: " + res2.statusCode, "warn");
      }
      res2.resume();
    });
    res.on("error", function (err) {
      addLog("Discord error: " + err.message, "warn");
    });
    res.write(json);
    res.end();
  } catch (err) {
    addLog("Discord notify error: " + err.message, "warn");
  }
}
function poll() {
  if (!botRunning) {
    return;
  }
  try {
    if (process.pkg && _licClient && !_licClient.isValid()) {
      botRunning = false;
      return;
    }
  } catch (v2) {}
  if (Date.now() < _rateLimitedUntil) {
    var v = _rateLimitedUntil - Date.now();
    if (v < 1600) {
      setTimeout(function () {
        if (botRunning) {
          poll();
        }
      }, v + 100);
    }
    return;
  }
  pollCount++;
  return fetchList().then(function (list) {
    if (list.length > 0) {
      addLog(list.length + " new request(s)", "info");
    }
    var v2 = Promise.resolve();
    list.forEach(function (item) {
      v2 = v2.then(function () {
        if (item._isActiveRequest) {
          return processActiveRequestItem(item._requestId, item._item);
        }
        var extractFromItemResult = extractFromItem(item);
        var v3 = extractFromItemResult.oid;
        if (!v3 || processed[v3]) {
          return;
        }
        processed[v3] = 1;
        var v4 = extractFromItemResult.un;
        var v5 = extractFromItemResult.catId;
        if (v5 === "3" || v5 === 3) {
          var v6 = (extractFromItemResult.sv || "").toUpperCase().trim();
          var v7 = v6 === "EU" && CONFIG.skipCustomEU || v6 === "NA" && CONFIG.skipCustomNA || v6 === "LATAM" && CONFIG.skipCustomLATAM || v6 === "AP" && CONFIG.skipCustomAP;
          if (v7) {
            addActivity({
              type: "Rejected",
              account: CONFIG.email,
              region: extractFromItemResult.sv,
              boost: "Custom",
              price: null,
              details: "Custom request skipped (" + v6 + " customs disabled)"
            });
            stats.skipped++;
            return;
          }
        }
        if (v5 === "1" || v5 === 1) {
          addActivity({
            type: "Rejected",
            account: CONFIG.email,
            region: extractFromItemResult.sv,
            boost: "Placements",
            price: null,
            details: "Placements — skipped"
          });
          stats.skipped++;
          return;
        }
        if (v5 === "2" || v5 === 2) {
          var v8 = (extractFromItemResult.sv || "").toUpperCase().trim();
          var v9 = v8 === "EU" ? CONFIG.acceptNetWinsEU : v8 === "NA" ? CONFIG.acceptNetWinsNA : v8 === "LATAM" ? CONFIG.acceptNetWinsLATAM : CONFIG.acceptNetWinsAP;
          if (!v9) {
            addActivity({
              type: "Rejected",
              account: CONFIG.email,
              region: extractFromItemResult.sv,
              boost: "Net Wins (" + extractFromItemResult.cr + ")",
              price: null,
              details: "Net Wins disabled for " + v8
            });
            stats.skipped++;
            return;
          }
          if (extractFromItemResult.method && extractFromItemResult.method.toLowerCase().indexOf("duo") !== -1) {
            var v10 = v8 === "EU" ? CONFIG.acceptEUDuo : v8 === "NA" ? CONFIG.acceptNADuo : v8 === "LATAM" ? CONFIG.acceptLATAMDuo : CONFIG.acceptAPDuo;
            if (!v10) {
              addActivity({
                type: "Rejected",
                account: CONFIG.email,
                region: extractFromItemResult.sv,
                boost: "Net Wins Duo (" + extractFromItemResult.cr + ")",
                price: null,
                details: "Duo not accepted for " + v8
              });
              stats.skipped++;
              return;
            }
          }
          return api("GET", "/api/boostingOffers/boostingRequests/" + v3).then(function (err) {
            var v11 = err.boostingRequestDetails && err.boostingRequestDetails.descriptionValues || [];
            addLog("NW dvArr (SignalR): " + JSON.stringify(v11.map(function (item2) {
              return {
                id: item2.id,
                v: item2.value,
                l: item2.label
              };
            })).slice(0, 500), "info");
            var extractNetWinsFieldsResult = extractNetWinsFields(v11);
            var v12 = extractNetWinsFieldsResult.cr;
            var v13 = extractNetWinsFieldsResult.sv;
            var v14 = extractNetWinsFieldsResult.mth;
            var v15 = extractNetWinsFieldsResult.games;
            if (v12 === "?") {
              v12 = extractFromItemResult.cr || "?";
            }
            if (v13 === "?") {
              v13 = (extractFromItemResult.sv || "").toUpperCase();
            }
            addLog("?? Net Wins: " + v12 + " | " + v13 + " | x" + v15 + " | " + v14, "info");
            if (v14.toLowerCase().indexOf("duo") !== -1) {
              var v16 = v13 === "EU" ? CONFIG.acceptEUDuo : v13 === "NA" ? CONFIG.acceptNADuo : v13 === "LATAM" ? CONFIG.acceptLATAMDuo : CONFIG.acceptAPDuo;
              if (!v16) {
                addActivity({
                  type: "Rejected",
                  account: CONFIG.email,
                  region: v13,
                  boost: "Net Wins Duo (" + v12 + ")",
                  price: null,
                  details: "Duo not accepted for " + v13
                });
                stats.skipped++;
                return;
              }
            }
            if (!isAllowedServer(v13)) {
              addActivity({
                type: "Rejected",
                account: CONFIG.email,
                region: v13,
                boost: "Net Wins (" + v12 + ")",
                price: null,
                details: "Region disabled or unsupported: " + v13
              });
              stats.skipped++;
              return;
            }
            var NWRankKey = getNWRankKey(v12);
            var v17 = v14.toLowerCase().indexOf("duo") !== -1;
            if (NWRankKey.startsWith("immortal") || NWRankKey === "radiant") {
              var flag = false;
              var v18 = v17 ? "Duo" : "";
              var v19 = v13 === "EU" ? "acceptEU" : v13 === "NA" ? "acceptNA" : v13 === "LATAM" ? "acceptLATAM" : "acceptAP";
              if (NWRankKey === "immortal_1") {
                flag = CONFIG[v19 + "Immo1" + v18];
              } else if (NWRankKey === "immortal_2") {
                flag = CONFIG[v19 + "Immo2" + v18];
              } else if (NWRankKey === "immortal_3") {
                flag = CONFIG[v19 + "Immo3" + v18];
              } else if (NWRankKey === "radiant") {
                flag = CONFIG[v19 + "Radiant" + v18];
              }
              if (!flag) {
                var v20 = NWRankKey === "immortal_1" ? "Immortal I" : NWRankKey === "immortal_2" ? "Immortal II" : NWRankKey === "immortal_3" ? "Immortal III" : "Radiant";
                addActivity({
                  type: "Immortal",
                  account: CONFIG.email,
                  region: v13,
                  boost: "Net Wins (" + v12 + ")",
                  price: null,
                  details: v20 + (v17 ? " Duo" : "") + " toggle OFF (" + v13 + ")"
                });
                return;
              }
            }
            if (NWRankKey === "ascendant") {
              var v21 = v17 ? "Duo" : "";
              var v22 = v13 === "EU" ? "acceptEU" : v13 === "NA" ? "acceptNA" : v13 === "LATAM" ? "acceptLATAM" : "acceptAP";
              var v23 = v12 && v12.endsWith("III") ? "Asc3" : v12 && v12.endsWith("II") ? "Asc2" : "Asc1";
              var v24 = CONFIG[v22 + v23 + v21];
              if (!v24) {
                addActivity({
                  type: "Rejected",
                  account: CONFIG.email,
                  region: v13,
                  boost: "Net Wins (" + v12 + ")",
                  price: null,
                  details: "Ascendant " + v23 + " NW" + (v17 ? " Duo" : "") + " toggle OFF (" + v13 + ")"
                });
                stats.skipped++;
                return;
              }
            }
            var v25 = v17 ? v13 === "EU" ? NETWIN_PRICES_DUO_EU : v13 === "NA" ? NETWIN_PRICES_DUO_NA : v13 === "LATAM" ? NETWIN_PRICES_DUO_LATAM : NETWIN_PRICES_DUO_AP : v13 === "EU" ? NETWIN_PRICES_EU : v13 === "NA" ? NETWIN_PRICES_NA : v13 === "LATAM" ? NETWIN_PRICES_LATAM : NETWIN_PRICES_AP;
            var v26 = v25[NWRankKey] || 0;
            var v27 = Math.round(v26 * v15 * 100) / 100;
            if (v27 <= 0) {
              addActivity({
                type: "Error",
                account: CONFIG.email,
                region: v13,
                boost: "Net Wins (" + v12 + ") x" + v15,
                price: null,
                details: "Price=0 — set per-game price in Net Wins tab"
              });
              return;
            }
            var v28 = NETWIN_HOURS[NWRankKey] || 1;
            var v29 = Math.round(v28 * v15 * 10) / 10;
            var str = "Day1";
            if (v29 <= 1) {
              str = "Hour1";
            } else if (v29 <= 2) {
              str = "Hour2";
            } else if (v29 <= 3) {
              str = "Hour3";
            } else if (v29 <= 5) {
              str = "Hour5";
            } else if (v29 <= 8) {
              str = "Hour8";
            } else if (v29 <= 12) {
              str = "Hour12";
            } else if (v29 <= 24) {
              str = "Day1";
            } else if (v29 <= 48) {
              str = "Day2";
            } else if (v29 <= 72) {
              str = "Day3";
            } else {
              str = "Day7";
            }
            var v30 = "Net Wins x" + v15 + " (" + v12 + ")";
            stats.seen++;
            _lastOrderAt = Date.now();
            addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "info");
            addLog("??— NW " + extractFromItemResult.un + " | " + v12 + " | " + v13 + " | x" + v15 + " | $" + v27, "success");
            var v31 = Promise.resolve();
            if (CONFIG.autoOffer) {
              v31 = v31.then(function () {
                return sleep(50).then(function () {
                  return sendOffer(v3, v27, str).then(function (res) {
                    if (res.ok) {
                      addActivity({
                        type: "Offer Sent",
                        account: CONFIG.email,
                        region: v13,
                        boost: v30,
                        price: v27,
                        details: "Auto-offer: $" + v27,
                        oid: v3,
                        un: extractFromItemResult.un
                      });
                      addLog("✅ NW OFFER $" + v27 + " ? " + extractFromItemResult.un, "success");
                      stats.offered++;
                      stats.revenue += v27;
                    } else {
                      var v32 = res.err || "";
                      if (v32.indexOf("already") !== -1 || v32.indexOf("AlreadyExists") !== -1) {
                        addActivity({
                          type: "Rejected",
                          account: CONFIG.email,
                          region: v13,
                          boost: v30,
                          price: null,
                          details: "Already offered"
                        });
                      } else {
                        addActivity({
                          type: "Error",
                          account: CONFIG.email,
                          region: v13,
                          boost: v30,
                          price: null,
                          details: "Offer failed: " + v32
                        });
                        stats.errors++;
                      }
                    }
                  });
                });
              });
            }
            if (CONFIG.autoMessage) {
              v31 = v31.then(function () {
                return sendMessage(v3, extractFromItemResult.un, v12, "Net Wins x" + v15, v13).then(function (err2) {
                  if (err2) {
                    addActivity({
                      type: "auto_message",
                      account: CONFIG.email,
                      region: v13,
                      boost: v30,
                      price: null,
                      details: "Auto-message sent"
                    });
                    stats.messaged++;
                  }
                });
              });
            }
            if (CONFIG.cooldownSeconds > 0) {
              v31 = v31.then(function () {
                return sleep(CONFIG.cooldownSeconds * 1000);
              });
            }
            return v31;
          }).catch(function (err) {
            addLog("NW detail error: " + err.message, "err");
          });
        }
        return api("GET", "/api/boostingOffers/boostingRequests/" + v3).then(function (err) {
          var v11 = extractFromItemResult.cr;
          var v12 = extractFromItemResult.dr;
          var v13 = extractFromItemResult.sv;
          var v14 = extractFromItemResult.rr;
          var num = 0;
          var v15 = v11 !== "?" && v12 !== "?" ? v11 + " ? " + v12 : "?";
          var v16 = extractFromItemResult.method || "Solo";
          var list2 = err.boostingRequestDetails && err.boostingRequestDetails.descriptionValues || [];
          for (var num2 = 0; num2 < list2.length; num2++) {
            var NumberResult = Number(list2[num2].id);
            var v17 = (list2[num2].label || "").toLowerCase();
            if (NumberResult === 63) {
              v16 = list2[num2].value || v16;
            } else if (NumberResult === 10) {
              v16 = list2[num2].value || v16;
            } else if (v17.indexOf("completion") !== -1 || v17.indexOf("method") !== -1) {
              v16 = list2[num2].value || v16;
            }
            if (v11 === "?" && NumberResult === 26) {
              v11 = list2[num2].value;
            }
            if (v12 === "?" && NumberResult === 53) {
              v12 = list2[num2].value;
            }
            if (v13 === "?" && NumberResult === 60) {
              v13 = list2[num2].value;
            }
            if (v13 === "?" && NumberResult === 9) {
              v13 = list2[num2].value;
            }
            if (NumberResult === 54) {
              num = Number(list2[num2].value) || num;
            } else if (v17.indexOf("desired rr") !== -1 || v17.indexOf("target rr") !== -1 || v17.indexOf("desired rating") !== -1) {
              num = Number(list2[num2].value) || num;
            }
          }
          v13 = (v13 || "").toUpperCase().trim();
          var v15 = v11 !== "?" && v12 !== "?" ? v11 + " ? " + v12 : "?";
          var v18 = v16 && v16.toLowerCase().indexOf("duo") !== -1;
          if (!isAllowedServer(v13)) {
            addActivity({
              type: "Rejected",
              account: CONFIG.email,
              region: v13,
              boost: v15,
              price: null,
              details: "Unsupported region: " + v13 + " (only NA and EU accepted)"
            });
            addLog("⏭ SKIP [" + v13 + "]: " + v4, "info");
            stats.skipped++;
            return;
          }
          if (v18) {
            var v19 = v13 === "EU" ? CONFIG.acceptEUDuo : v13 === "NA" ? CONFIG.acceptNADuo : v13 === "LATAM" ? CONFIG.acceptLATAMDuo : CONFIG.acceptAPDuo;
            if (!v19) {
              addActivity({
                type: "Rejected",
                account: CONFIG.email,
                region: v13,
                boost: v15,
                price: null,
                details: "Duo not accepted for " + v13
              });
              addLog("⏭ SKIP [Duo off " + v13 + "]: " + v4, "info");
              stats.skipped++;
              return;
            }
          }
          var checkDestinationToggleResult = checkDestinationToggle(v12, v13, v18);
          if (!checkDestinationToggleResult.allowed) {
            var v20 = v12 && (v12.indexOf("Immortal") !== -1 || v12 === "Radiant") ? "Immortal" : "Rejected";
            addActivity({
              type: v20,
              account: CONFIG.email,
              region: v13,
              boost: v15,
              price: null,
              details: checkDestinationToggleResult.reason
            });
            if (v20 === "Rejected") {
              stats.skipped++;
            }
            return;
          }
          var calcPriceResult = calcPrice(v11, v14, v12, v13, v18, num);
          if (calcPriceResult.price <= 0) {
            if (hasCustomRule(v11, v12, v13)) {
              addActivity({
                type: "Error",
                account: CONFIG.email,
                region: v13,
                boost: v15,
                price: null,
                details: "Custom rule found but price=0 — set a price in Custom Rules tab"
              });
              addLog("?? Custom rule price=0 for " + v11 + "?" + v12 + " — set price in dashboard", "warn");
            } else if (v11 === v12) {
              addActivity({
                type: "Rejected",
                account: CONFIG.email,
                region: v13,
                boost: v15,
                price: null,
                details: "Same rank order (" + v11 + " ? " + v12 + ") — add a Custom Rule for this in Pricing > Custom Rules"
              });
              addLog("⏭ SKIP [same rank]: " + v11 + " ? " + v12 + " " + v13 + " | " + v4 + " — add Custom Rule", "warn");
            } else if (v11 && (v11.indexOf("Immortal") !== -1 || v11 === "Radiant") || v12 && (v12.indexOf("Immortal") !== -1 || v12 === "Radiant")) {
              addActivity({
                type: "Immortal",
                account: CONFIG.email,
                region: v13,
                boost: v15,
                price: null,
                details: "Immortal/Radiant order — add a Custom Rule to handle this pair"
              });
              addLog("?? Immortal order skipped (no custom rule): " + v11 + "?" + v12 + " — add rule in Pricing > Custom Rules", "warn");
              try {
                tgNotifyImmortal({
                  buyer: v4,
                  sv: v13,
                  cr: v11,
                  dr: v12,
                  requestId: v3,
                  reason: "no custom rule for this Immortal/Radiant pair"
                });
              } catch (v24) {}
            } else {
              addActivity({
                type: "Error",
                account: CONFIG.email,
                region: v13,
                boost: v15,
                price: null,
                details: "Price calculation error: unknown rank combination"
              });
              addLog("❌ Price=0 for " + v11 + "?" + v12, "err");
            }
            stats.errors++;
            return;
          }
          stats.seen++;
          _lastOrderAt = Date.now();
          var v21 = calcPriceResult.deliveryEnum;
          var v22 = DELIVERY_OPTIONS.find(function (item2) {
            return item2.enum === v21;
          }) || {
            label: "3 days"
          };
          addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "info");
          addLog("??— " + v4 + " | " + v15 + " | " + v13 + " | $" + calcPriceResult.price + " | " + v22.label, "success");
          addActivity({
            type: "New",
            account: CONFIG.email,
            region: v13,
            boost: v15,
            price: calcPriceResult.price,
            details: "New request — $" + calcPriceResult.price + " | " + v22.label,
            oid: v3,
            un: v4
          });
          var v23 = Promise.resolve();
          if (CONFIG.autoOffer) {
            v23 = v23.then(function () {
              return sendOffer(v3, calcPriceResult.price, v21).then(function (res) {
                if (res.ok) {
                  addActivity({
                    type: "Offer Sent",
                    account: CONFIG.email,
                    region: v13,
                    boost: v15,
                    price: calcPriceResult.price,
                    details: "Auto-offer submitted: $" + calcPriceResult.price + ", delivery: " + v21
                  });
                  addLog("✅ OFFER $" + calcPriceResult.price + " ? " + v4, "success");
                  stats.offered++;
                  stats.revenue += calcPriceResult.price;
                  try {
                    tgNotifyOfferSent({
                      buyer: v4,
                      sv: v13,
                      cr: v11,
                      dr: v12,
                      price: calcPriceResult.price,
                      delivery: v21,
                      requestId: v3
                    });
                  } catch (v24) {}
                } else {
                  addActivity({
                    type: "Error",
                    account: CONFIG.email,
                    region: v13,
                    boost: v15,
                    price: null,
                    details: "Offer failed: " + res.err
                  });
                  addLog("❌ Offer failed ? " + v4, "err");
                  stats.errors++;
                }
              });
            });
          }
          if (CONFIG.autoMessage) {
            addLog("💬 autoMessage ON — queuing message for " + v4, "info");
            v23 = v23.then(function () {
              return sendMessage(v3, v4, v11, v12, v13).then(function (err2) {
                if (err2) {
                  addActivity({
                    type: "auto_message",
                    account: CONFIG.email,
                    region: v13,
                    boost: v15,
                    price: calcPriceResult.price,
                    details: "Auto-message sent to " + v4 + ": " + CONFIG.messageTemplate.replace("{username}", v4).slice(0, 60) + "..."
                  });
                  addLog("💬 MSG ? " + v4, "success");
                  stats.messaged++;
                } else {
                  addLog("❌ MSG FAILED ? " + v4, "err");
                }
              });
            });
          } else {
            addLog("💬 autoMessage is OFF — skipping message", "warn");
          }
          addLog("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "info");
          if (CONFIG.cooldownSeconds > 0) {
            v23 = v23.then(function () {
              return sleep(CONFIG.cooldownSeconds * 1000);
            });
          }
          return v23;
        }).catch(function (err) {
          addLog("Rank boost detail fetch error: " + err.message, "err");
        });
      });
    });
    return v2;
  }).catch(function (err) {
    addLog("Poll error: " + err.message, "err");
    stats.errors++;
  });
  _soldOrdersPoll++;
  if (_soldOrdersPoll >= 3) {
    _soldOrdersPoll = 0;
    checkSoldOrders(false);
  }
}
function sendDiscordMessageNotif(arg1, arg2, arg3, arg4) {
  var v = CONFIG.discordMessageWebhook || DISCORD_MSG_WEBHOOK;
  if (!v) {
    return;
  }
  try {
    var URL = new URL(v);
    var v2 = arg4 && arg4.cr && arg4.cr !== "—" ? "**" + arg4.cr + (arg4.dr && arg4.dr !== "—" ? " ? " + arg4.dr : "") + "**" + (arg4.sv ? " | " + arg4.sv : "") : "Valorant Boost";
    var list = [{
      name: "?? Buyer",
      value: "**" + arg1 + "**",
      inline: true
    }, {
      name: "?? Order",
      value: v2,
      inline: true
    }, {
      name: "?? Conv ID",
      value: "`" + arg3.slice(0, 18) + "...`",
      inline: false
    }, {
      name: "💬 Message",
      value: "```" + arg2.slice(0, 900) + "```",
      inline: false
    }];
    var opts = {
      embeds: [{
        title: "💬 New Message from " + arg1,
        color: 5793266,
        fields: list,
        footer: {
          text: "ELDOBOT v14 — Reply in Eldorado chat"
        },
        timestamp: new Date().toISOString()
      }],
      content: "📨 **" + arg1 + "** sent you a message!"
    };
    var json = JSON.stringify(opts);
    var res = require("https").request({
      hostname: URL.hostname,
      path: URL.pathname + URL.search,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(json)
      }
    }, function (err) {
      err.resume();
    });
    res.on("error", function () {});
    res.write(json);
    res.end();
    addLog("📨 Discord msg notif sent — " + arg1 + ": " + arg2.slice(0, 60), "success");
  } catch (err) {
    addLog("Discord msg error: " + err.message, "warn");
  }
}
var _talkListenerSocket = null;
var _talkListenerReconnect = null;
var _talkListenerRunning = false;
var _msgPollTimer = null;
var SELLER_ID = "953b8c1e-a2ef-4abd-8e0e-c28b1f4ee240";
function startTalkJSListener() {
  _talkListenerRunning = true;
  addLog("💬 TalkJS message poller started — checking every 30s", "info");
  _msgPollTimer = setInterval(pollConversationsForNewMsgs, 30000);
  setTimeout(pollConversationsForNewMsgs, 5000);
}
function stopTalkJSListener() {
  _talkListenerRunning = false;
  if (_msgPollTimer) {
    clearInterval(_msgPollTimer);
    _msgPollTimer = null;
  }
}
function pollConversationsForNewMsgs() {
  if (!_talkListenerRunning) {
    return;
  }
  var keys = Object.keys(_trackedConvs);
  if (keys.length === 0) {
    return;
  }
  addLog("💬 Polling " + keys.length + " conversation(s) for new messages...", "info");
  fetchTalkJSToken(getIdToken()).then(function (err) {
    keys.forEach(function (item) {
      checkConvForNewMsgs(item, err);
    });
  }).catch(function () {});
}
function checkConvForNewMsgs(arg1, arg2) {
  var v = _trackedConvs[arg1];
  if (!v) {
    return;
  }
  Promise.resolve(arg2 || null).then(function (err) {
    var opts = {
      hostname: "api.talkjs.com",
      port: 443,
      path: "/v1/49mLECOW/conversations/" + arg1 + "/messages?limit=5",
      method: "GET",
      headers: {
        Authorization: "Bearer " + err,
        "Content-Type": "application/json"
      }
    };
    var res = https.request(opts, function (emitter) {
      var str = "";
      emitter.on("data", function (chunk) {
        str += chunk;
      });
      emitter.on("end", function () {
        try {
          var parsed = JSON.parse(str);
          addLog("💬 Poll [" + arg1.slice(0, 8) + "] HTTP resp: " + JSON.stringify(parsed).slice(0, 200), "info");
          var list = parsed.data || parsed.messages || parsed || [];
          if (!Array.isArray(list)) {
            return;
          }
          if (!v.lastMsgId) {
            if (list.length > 0) {
              v.lastMsgId = list[0].id;
            }
            return;
          }
          var v2 = list.length > 0 ? list[0].id : v.lastMsgId;
          for (var num = 0; num < list.length; num++) {
            var v3 = list[num];
            if (!v3 || !v3.id) {
              continue;
            }
            if (v3.id === v.lastMsgId) {
              break;
            }
            var v4 = v3.senderId || v3.sender && v3.sender.id || v3.createdBy && v3.createdBy.id || v3.userId || "";
            if (v4 === SELLER_ID) {
              continue;
            }
            var v5 = v3.text || "";
            if (!v5 && Array.isArray(v3.content)) {
              v3.content.forEach(function (item) {
                if (item.type === "text" && Array.isArray(item.children)) {
                  v5 += item.children.join("");
                } else if (typeof item === "string") {
                  v5 += item;
                } else if (item.text && typeof item.text === "string") {
                  v5 += item.text;
                }
              });
            }
            if (!v5 || !v5.trim()) {
              continue;
            }
            if (v5.indexOf("Boosting Request chat started") !== -1) {
              continue;
            }
            if (v5.indexOf("Hey ! i can take it") !== -1) {
              continue;
            }
            if (v5.indexOf("chat started") !== -1) {
              continue;
            }
            var v6 = v.buyer || v3.sender && v3.sender.name || "Buyer";
            addLog("💬 New message from " + v6 + ": " + v5.slice(0, 80), "success");
            sendDiscordMessageNotif(v6, v5, arg1, v.orderInfo || {});
          }
          v.lastMsgId = v2;
        } catch (err2) {
          addLog("💬 Poll parse error: " + err2.message, "warn");
        }
      });
    });
    res.on("error", function () {});
    res.end();
  })(arg2);
}
function _connectTalkListener() {
  if (!_talkListenerRunning) {
    return;
  }
  var str = "953b8c1e-a2ef-4abd-8e0e-c28b1f4ee240";
  addLog("💬 TalkJS listener: fetching token...", "info");
  fetchTalkJSToken(getIdToken()).then(function (err) {
    addLog("💬 TalkJS listener token OK, connecting WS...", "info");
    _openTalkListenerWS(err, str);
  }).catch(function (err) {
    addLog("💬 TalkJS listener token error: " + err.message, "warn");
    schedTalkReconnect();
  });
}
function schedTalkReconnect() {
  if (!_talkListenerRunning) {
    return;
  }
  _talkListenerReconnect = setTimeout(_connectTalkListener, 15000);
}
function _openTalkListenerWS(arg1, arg2) {
  if (!_talkListenerRunning) {
    return;
  }
  var tls = require("tls");
  var crypto = require("crypto");
  var text = crypto.randomBytes(16).toString("base64");
  var v = "/v1/49mLECOW/realtime/" + encodeURIComponent(arg2) + "?talkjs-client-build=jssdk-release-1a273f5&talkjs-core=1.0.0&talkjs-client-id=listener-bot";
  var emitter = tls.connect({
    host: "realtime.talkjs.com",
    port: 443,
    servername: "realtime.talkjs.com"
  }, function () {
    var joined = ["GET " + v + " HTTP/1.1", "Host: realtime.talkjs.com", "Upgrade: websocket", "Connection: Upgrade", "Sec-WebSocket-Key: " + text, "Sec-WebSocket-Version: 13", "Sec-WebSocket-Protocol: ", "Origin: https://www.eldorado.gg", "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36", "", ""].join("\r\n");
    emitter.write(joined);
  });
  _talkListenerSocket = emitter;
  var list = Buffer.alloc(0);
  var flag = false;
  var flag2 = false;
  var num = 1;
  function fn(arg12) {
    var buf = Buffer.from(JSON.stringify(arg12), "utf8");
    var v2 = buf.length;
    var v3 = v2 < 126 ? Buffer.from([129, v2 | 128]) : Buffer.from([129, 254, v2 >> 8 & 255, v2 & 255]);
    var randomBytes = crypto.randomBytes(4);
    var v4 = Buffer.alloc(v2);
    for (var num2 = 0; num2 < v2; num2++) {
      v4[num2] = buf[num2] ^ randomBytes[num2 % 4];
    }
    emitter.write(Buffer.concat([v3, randomBytes, v4]));
  }
  emitter.setTimeout(0);
  emitter.on("error", function () {
    if (_talkListenerRunning) {
      schedTalkReconnect();
    }
  });
  emitter.on("close", function () {
    if (_talkListenerRunning) {
      schedTalkReconnect();
    }
  });
  emitter.on("data", function (chunk) {
    list = Buffer.concat([list, chunk]);
    if (!flag) {
      var v2 = list.indexOf("\r\n\r\n");
      if (v2 === -1) {
        return;
      }
      var text2 = list.slice(0, v2).toString();
      if (text2.indexOf("101") === -1) {
        emitter.destroy();
        schedTalkReconnect();
        return;
      }
      flag = true;
      list = list.slice(v2 + 4);
      addLog("💬 TalkJS listener connected ✅", "success");
      fn([0, "POST", "/session/renew", {
        token: arg1
      }, {}]);
    }
    while (list.length >= 2) {
      var v3 = list[0];
      var v4 = list[1];
      var v5 = (v4 & 128) !== 0;
      var v6 = v4 & 127;
      var num2 = 2;
      if (v6 === 126) {
        if (list.length < 4) {
          break;
        }
        v6 = list[2] << 8 | list[3];
        num2 = 4;
      } else if (v6 === 127) {
        if (list.length < 10) {
          break;
        }
        v6 = list.readUInt32BE(6);
        num2 = 10;
      }
      if (v5) {
        num2 += 4;
      }
      if (list.length < num2 + v6) {
        break;
      }
      var text3 = list.slice(num2, num2 + v6).toString("utf8");
      list = list.slice(num2 + v6);
      var v7 = v3 & 15;
      if (v7 === 8) {
        emitter.destroy();
        if (_talkListenerRunning) {
          schedTalkReconnect();
        }
        return;
      }
      if (v7 === 9) {
        emitter.write(Buffer.from([138, 0]));
        continue;
      }
      if (v7 !== 1 && v7 !== 2) {
        continue;
      }
      try {
        var parsed = JSON.parse(text3);
        var v8 = parsed[0];
        var v9 = parsed[1];
        var v10 = parsed[2];
        if (v8 !== 0 || !!flag2 || v9 !== 200) {
          addLog("💬 LISTENER RAW: " + text3.slice(0, 300), "info");
        }
        if (v8 === 0 && !flag2 && v9 === 200) {
          flag2 = true;
          addLog("💬 TalkJS listener authenticated ✅ — subscribing to conversations", "success");
          fn([num++, "GET", "/users/" + arg2 + "/conversations", {}, {}]);
          var setIntervalResult = setInterval(function () {
            if (!_talkListenerRunning || emitter.destroyed) {
              clearInterval(setIntervalResult);
              return;
            }
            fn([num++, "GET", "/ping", {}, {}]);
          }, 20000);
          var setIntervalResult2 = setInterval(function () {
            if (!_talkListenerRunning || emitter.destroyed) {
              clearInterval(setIntervalResult2);
              return;
            }
            fetchTalkJSToken(getIdToken()).then(function (err2) {
              if (err2) {
                fn([num++, "POST", "/session/renew", {
                  token: err2
                }, {}]);
              }
            }).catch(function () {});
          }, 600000);
          return;
        }
        if (Array.isArray(parsed) && parsed.length >= 2) {
          var err = parsed[1] || parsed[2];
          if (err && typeof err === "object") {
            var list2 = err.messages || err.data || (err.message ? [err.message] : null);
            if (!list2 && err.type === "message") {
              list2 = [err];
            }
            if (list2 && Array.isArray(list2)) {
              list2.forEach(function (item) {
                if (!item) {
                  return;
                }
                var v11 = item.senderId || item.sender && item.sender.id || item.createdBy && item.createdBy.id;
                var v12 = item.conversationId || err.conversationId || "unknown";
                var str = "";
                if (item.text) {
                  str = item.text;
                } else if (Array.isArray(item.content)) {
                  item.content.forEach(function (item2) {
                    if (item2.type === "text" && Array.isArray(item2.children)) {
                      str += item2.children.join("");
                    } else if (item2.text) {
                      str += item2.text;
                    }
                  });
                }
                if (!str || !v11) {
                  return;
                }
                if (v11 === arg2) {
                  return;
                }
                var v13 = item.senderName || item.sender && item.sender.name || v11.slice(0, 12);
                var v14 = _soldOrderDetails[v12] || {};
                addLog("💬 Incoming msg from " + v13 + ": " + str.slice(0, 80), "info");
                sendDiscordMessageNotif(v13, str, v12, v14);
              });
            }
          }
        }
      } catch (v11) {}
    }
  });
}
function startBot() {
  var IdToken = getIdToken();
  if (!IdToken && !CONFIG.cookieString) {
    addLog("❌ No cookies!", "err");
    return;
  }
  var TokenExpiry = getTokenExpiry();
  var v = Math.floor(Date.now() / 1000);
  var v2 = TokenExpiry ? Math.round((TokenExpiry - v) / 60) : 999;
  if (TokenExpiry && v2 < -30) {
    addLog("❌ Token expired.", "err");
    return;
  }
  if (botRunning) {
    addLog("Already running", "warn");
    return;
  }
  botRunning = true;
  addLog("🤖 Bot STARTED — EU:" + (CONFIG.acceptEU ? "✅" : "❌") + " NA:" + (CONFIG.acceptNA ? "✅" : "❌") + " LATAM:" + (CONFIG.acceptLATAM ? "✅" : "❌") + " AP:" + (CONFIG.acceptAP ? "✅" : "❌"), "success");
  setOnline().catch(function () {});
  checkSoldOrders(true);
  negotiateSignalR();
  startTalkJSListener();
  poll();
  pollTimer = setInterval(poll, 4000);
  onlineTimer = setInterval(function () {
    setOnline();
  }, 300000);
}
function stopBot() {
  botRunning = false;
  clearInterval(pollTimer);
  clearInterval(onlineTimer);
  _signalrConnected = false;
  if (_signalrWs) {
    try {
      _signalrWs.destroy();
    } catch (v) {}
  }
  _signalrWs = null;
  if (_signalrReconnectTimer) {
    clearTimeout(_signalrReconnectTimer);
  }
  stopTalkJSListener();
  addLog("🛑 Bot STOPPED", "warn");
}
function parseBody(emitter) {
  return new Promise(function (fn) {
    var num = 1048576;
    var str = "";
    var num2 = 0;
    var flag = false;
    function fn2(arg1) {
      if (flag) {
        return;
      }
      flag = true;
      fn(arg1);
    }
    emitter.on("data", function (list) {
      if (flag) {
        return;
      }
      num2 += list.length;
      if (num2 > num) {
        try {
          emitter.destroy();
        } catch (v) {}
        fn2({});
        return;
      }
      str += list;
    });
    emitter.on("end", function () {
      if (flag) {
        return;
      }
      try {
        fn2(JSON.parse(str));
      } catch (v) {
        fn2({});
      }
    });
    emitter.on("error", function () {
      fn2({});
    });
    emitter.on("aborted", function () {
      fn2({});
    });
  });
}
var PORT = 3000;
function _isValidDiscordWebhook(arg1) {
  if (typeof arg1 !== "string" || !arg1) {
    return false;
  }
  return /^https:\/\/(discord|discordapp)\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_\-]+\/?$/.test(arg1);
}
var server = http.createServer(function (req, res) {
  var v = (req.headers.host || "").toLowerCase();
  if (v.indexOf("[") === 0) {
    v = v.replace(/\]:\d+$/, "]");
  } else {
    v = v.replace(/:\d+$/, "");
  }
  if (v && v !== "localhost" && v !== "127.0.0.1" && v !== "[::1]") {
    res.writeHead(403, {
      "Content-Type": "text/plain"
    });
    res.end("forbidden host");
    return;
  }
  var v2 = req.headers.origin || "";
  var str = "";
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(v2)) {
    str = v2;
  } else if (/^chrome-extension:\/\//i.test(v2)) {
    str = v2;
  }
  if (str) {
    res.setHeader("Access-Control-Allow-Origin", str);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }
  var v3 = req.url;
  if (v3 === "/" || v3 === "/index.html") {
    try {
      var v4 = process.pkg ? path.dirname(process.execPath) : __dirname;
      var fileData = fs.readFileSync(path.join(v4, "dashboard.html"), "utf8");
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      res.end(fileData);
    } catch (err) {
      res.writeHead(500);
      res.end("Missing dashboard.html: " + err.message);
    }
    return;
  }
  if (v3 === "/api/extension/handshake" && req.method === "GET") {
    var now = Date.now();
    var flag = false;
    var v5 = _licenseExpiry || 0;
    try {
      if (process.pkg && _licClient) {
        flag = _licClient.isValid();
      } else {
        flag = true;
      }
    } catch (v11) {
      flag = false;
    }
    if (!flag) {
      res.writeHead(403, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        ok: false,
        error: "bot license not valid"
      }));
      return;
    }
    var crypto = require("crypto");
    var str2 = "8b2c47e51d3f0a96e7b41a08c5f3d7e2";
    var v6 = Math.floor(now / 300000);
    var slice = crypto.createHmac("sha256", str2).update(v6 + "|" + v5 + "|" + BOT_VERSION).digest("hex").slice(0, 32);
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
      ok: true,
      expiresAt: v5,
      ts: now,
      token: slice,
      product: "VAL",
      version: BOT_VERSION
    }));
    return;
  }
  if (v3 === "/api/observe" && req.method === "POST") {
    parseBody(req).then(function (req2) {
      var v11 = req2 && req2.url || "";
      if (typeof v11 !== "string" || !v11) {
        res.writeHead(400);
        res.end("{\"ok\":false,\"error\":\"missing url\"}");
        return;
      }
      var v12 = v11.indexOf("talkjs") !== -1 || v11.indexOf("/say/") !== -1;
      var list4 = [];
      var matched = v11.match(/[?&]sessionId=([a-f0-9-]{36})/i);
      if (matched) {
        if (_talkjsSessionId !== matched[1]) {
          _talkjsSessionId = matched[1];
          list4.push("sessionId=" + matched[1].slice(0, 8) + "…");
        }
      }
      var matched2 = v11.match(/\/user\/([^\/]+)\//);
      if (matched2) {
        var v13 = matched2[1];
        if (/^[a-f0-9]{20}_n$/i.test(v13) && _talkjsNymId !== v13) {
          _talkjsNymId = v13;
          list4.push("nymId=" + v13);
        }
      }
      var matched3 = v11.match(/\/say\/([a-f0-9]{20}_n)(?:[\/?#]|$)/i);
      if (matched3 && _talkjsNymId !== matched3[1]) {
        _talkjsNymId = matched3[1];
        list4.push("nymId(say)=" + matched3[1]);
      }
      var list5 = v11.match(/\/(?:chatbox|conversations|say)\/([a-f0-9]{20})(?:[\/?#&]|$)/ig) || [];
      list5.forEach(function (item) {
        var matched6 = item.match(/([a-f0-9]{20})/i);
        if (!matched6) {
          return;
        }
        var v14 = matched6[1].toLowerCase();
        _talkjsRecentShorts = [{
          short: v14,
          observedAt: Date.now()
        }].concat(_talkjsRecentShorts.filter(function (item2) {
          return item2.short !== v14;
        })).slice(0, 50);
        list4.push("convShort=" + v14);
      });
      var matched4 = v11.match(/[?&]syncPlease=([^&]+)/);
      if (matched4 && list5.length > 0) {
        try {
          var list6 = decodeURIComponent(matched4[1]).replace(/-/g, "+").replace(/_/g, "/");
          while (list6.length % 4) {
            list6 += "=";
          }
          var parsed = JSON.parse(Buffer.from(list6, "base64").toString("utf8"));
          if (parsed && parsed.externalConversationId) {
            var matched5 = list5[0].match(/([a-f0-9]{20})/i);
            if (matched5) {
              _convIdMap = _convIdMap || {};
              _convIdMap[parsed.externalConversationId.toLowerCase()] = matched5[1].toLowerCase();
              list4.push("UUID→short mapped: " + parsed.externalConversationId.slice(0, 8) + "…→" + matched5[1].slice(0, 8) + "…");
            }
          }
        } catch (v14) {}
      }
      if (list4.length > 0) {
        addLog("📥 Observed: " + list4.join(", "), "success");
        saveTalkJSState();
      } else if (v12) {
        addLog("📥 talkjs URL seen (no match): " + v11.slice(0, 120), "info");
      }
      res.writeHead(200);
      res.end("{\"ok\":true}");
    }).catch(function () {
      try {
        res.writeHead(400);
        res.end("{\"ok\":false}");
      } catch (v11) {}
    });
    return;
  }
  if (v3 === "/api/talkjs-session" && req.method === "POST") {
    parseBody(req).then(function (err) {
      var list4 = [];
      if (err.sessionId) {
        _talkjsSessionId = err.sessionId;
        list4.push("sessionId=" + err.sessionId.slice(0, 8) + "...");
      }
      if (err.nymId && /^[a-f0-9]{20}_n$/i.test(err.nymId)) {
        _talkjsNymId = err.nymId;
        list4.push("nymId=" + err.nymId);
        saveTalkJSState();
      }
      if (list4.length === 0) {
        res.writeHead(400);
        res.end(JSON.stringify({
          ok: false,
          error: "no sessionId or valid nymId"
        }));
        return;
      }
      addLog("✅ TalkJS session update: " + list4.join(", "), "success");
      res.writeHead(200);
      res.end(JSON.stringify({
        ok: true,
        sessionId: _talkjsSessionId ? _talkjsSessionId.slice(0, 8) + "..." : null,
        hasNymId: !!_talkjsNymId
      }));
    });
    return;
  }
  if (v3 === "/api/talkjs-session" && req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify({
      hasSession: !!_talkjsSessionId,
      sessionId: _talkjsSessionId ? _talkjsSessionId.slice(0, 8) + "..." : null,
      nymId: _talkjsNymId || null
    }));
    return;
  }
  if (v3 === "/api/debug-talkjs" && req.method === "GET" && !process.pkg) {
    var list = [];
    var list2 = [{
      method: "POST",
      path: "/api/talkjs/session",
      body: {}
    }, {
      method: "GET",
      path: "/api/talkjs/session"
    }, {
      method: "POST",
      path: "/api/talkjs/token",
      body: {}
    }, {
      method: "GET",
      path: "/api/talkjs/token"
    }, {
      method: "POST",
      path: "/api/chat/session",
      body: {}
    }, {
      method: "POST",
      path: "/api/chat/token",
      body: {}
    }, {
      method: "GET",
      path: "/api/notifications/talkjs"
    }, {
      method: "POST",
      path: "/api/talkjs/auth",
      body: {}
    }];
    var v7 = Promise.resolve();
    list2.forEach(function (res2) {
      v7 = v7.then(function () {
        return api(res2.method, res2.path, res2.body || null).then(function (err) {
          list.push({
            ep: res2.path,
            ok: true,
            data: err
          });
        }).catch(function (err) {
          list.push({
            ep: res2.path,
            ok: false,
            err: err.message
          });
        });
      });
    });
    v7.then(function () {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(list, null, 2));
    });
    return;
  }
  if (v3 === "/api/manual-offer" && req.method === "POST") {
    parseBody(req).then(function (err) {
      if (!err.requestId || !err.price) {
        res.writeHead(400);
        res.end(JSON.stringify({
          ok: false,
          error: "requestId and price required"
        }));
        return;
      }
      var v11 = err.deliveryEnum || shiftDelivery(getDelivery().enum);
      sendOffer(err.requestId, err.price, v11).then(function (err2) {
        res.writeHead(200);
        res.end(JSON.stringify(err2));
      }).catch(function (err2) {
        res.writeHead(200);
        res.end(JSON.stringify({
          ok: false,
          error: err2.message
        }));
      });
    });
    return;
  }
  if (v3 === "/api/test-message" && req.method === "POST") {
    parseBody(req).then(function (err) {
      var v11 = (err.requestId || "").trim();
      var v12 = err.message || null;
      if (!v11) {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        return res.end(JSON.stringify({
          ok: false,
          error: "Missing requestId — paste a real order ID from eldorado.gg/dashboard/notifications"
        }));
      }
      if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(v11)) {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        return res.end(JSON.stringify({
          ok: false,
          error: "requestId is not a valid UUID — must look like abc12345-def6-7890-abcd-ef1234567890"
        }));
      }
      if (!getIdToken()) {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        return res.end(JSON.stringify({
          ok: false,
          error: "No ID token — open eldorado.gg in Chrome, sync the extension, then retry"
        }));
      }
      delete _sentMsgRequests[v11];
      _cachedTalkToken = null;
      _cachedTalkTokenExp = 0;
      var v13 = CONFIG.messageTemplate;
      if (v12) {
        CONFIG.messageTemplate = v12;
      }
      api("POST", "/api/boostingOffers/boostingRequests/" + v11 + "/createConversationForSeller", {}).then(function (err2) {
        var v14 = err2 && (err2.talkJsConversationId || err2.talkJSConversationID || err2.conversationId);
        if (!v14) {
          if (v12) {
            CONFIG.messageTemplate = v13;
          }
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          return res.end(JSON.stringify({
            ok: false,
            error: "Eldorado returned no conversation ID — response: " + JSON.stringify(err2).slice(0, 200)
          }));
        }
        delete _sentMsgRequests[v11];
        var v15 = logs.length;
        return sendMessage(v11, "TestUser", "Gold I", "Platinum I", "EU").then(function (err3) {
          if (v12) {
            CONFIG.messageTemplate = v13;
          }
          if (err3) {
            res.writeHead(200, {
              "Content-Type": "application/json"
            });
            return res.end(JSON.stringify({
              ok: true,
              requestId: v11
            }));
          }
          var slice2 = logs.slice(v15);
          var joined = slice2.map(function (item) {
            if (item && item.msg) {
              return item.msg.replace(/[^\x20-\x7E]/g, "").trim();
            } else {
              return "";
            }
          }).filter(Boolean).join(" | ");
          if (!joined) {
            joined = "TalkJS WS rejected the message but logged nothing — likely a network/firewall block on realtime.talkjs.com:443";
          }
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          res.end(JSON.stringify({
            ok: false,
            error: "TalkJS send failed",
            detail: joined.slice(0, 800)
          }));
        });
      }).catch(function (err2) {
        if (v12) {
          CONFIG.messageTemplate = v13;
        }
        var v14 = err2 && err2.message || "unknown error";
        var v15 = v14;
        if (v14.indexOf("HTTP_404") !== -1) {
          v15 = "Eldorado says this request doesn't exist (HTTP 404). Use a REAL active order ID from eldorado.gg/dashboard/notifications";
        } else if (v14.indexOf("HTTP_403") !== -1) {
          v15 = "Eldorado says you're not the seller for this request (HTTP 403). Make sure it's an order sent TO your account";
        } else if (v14.indexOf("HTTP_401") !== -1 || v14.indexOf("UNAUTHORIZED") !== -1) {
          v15 = "Auth expired — re-sync the extension on eldorado.gg, then retry";
        } else if (v14.indexOf("HTTP_429") !== -1) {
          v15 = "Rate limited by Eldorado — wait 30s and retry";
        }
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          ok: false,
          error: v15,
          raw: v14,
          requestId: v11
        }));
      });
    });
    return;
  }
  if (v3 === "/api/state") {
    var TokenExpiry = getTokenExpiry();
    var v8 = TokenExpiry ? Math.max(0, Math.round((TokenExpiry - Date.now() / 1000) / 60)) : 0;
    var v9 = _lastOrderAt ? Math.floor((Date.now() - _lastOrderAt) / 1000) : null;
    var opts = {
      signalrConnected: !!_signalrConnected,
      talkjsConnected: !!_talkListenerRunning,
      tokenMinsLeft: v8,
      lastOrderAgoSec: v9,
      botRunning: botRunning,
      rateLimited: Date.now() < _rateLimitedUntil,
      hasCookies: !!getIdToken() || !!CONFIG.cookieString
    };
    var statsTotalsResult = statsTotals(1);
    var statsTotalsResult2 = statsTotals(7);
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
      botRunning: botRunning,
      logs: DEBUG_LOGS ? logs : [],
      activity: activity,
      stats: stats,
      health: opts,
      statsToday: statsTotalsResult,
      statsWeek: statsTotalsResult2,
      statsHistory: statsHistory,
      rankList: RANK_LIST,
      deliveryOptions: DELIVERY_OPTIONS,
      updateAvailable: updateAvailable,
      latestVersion: latestVersion,
      botVersion: BOT_VERSION,
      licenseExpiry: _licenseExpiry,
      tierPricesEU: TIER_PRICES_EU,
      tierPricesNA: TIER_PRICES_NA,
      tierPricesLATAM: TIER_PRICES_LATAM,
      tierPricesAP: TIER_PRICES_AP,
      tierPricesDuoEU: TIER_PRICES_DUO_EU,
      tierPricesDuoNA: TIER_PRICES_DUO_NA,
      tierPricesDuoLATAM: TIER_PRICES_DUO_LATAM,
      tierPricesDuoAP: TIER_PRICES_DUO_AP,
      tierHours: TIER_HOURS,
      customRules: CUSTOM_RULES,
      netwinPricesEU: NETWIN_PRICES_EU,
      netwinPricesNA: NETWIN_PRICES_NA,
      netwinPricesLATAM: NETWIN_PRICES_LATAM,
      netwinPricesAP: NETWIN_PRICES_AP,
      netwinPricesDuoEU: NETWIN_PRICES_DUO_EU,
      netwinPricesDuoNA: NETWIN_PRICES_DUO_NA,
      netwinPricesDuoLATAM: NETWIN_PRICES_DUO_LATAM,
      netwinPricesDuoAP: NETWIN_PRICES_DUO_AP,
      netwinHours: NETWIN_HOURS,
      immoRrPrices: IMMO_RR_PRICES,
      immoRrPricesDuo: IMMO_RR_PRICES_DUO,
      immoRrHours: IMMO_RR_HOURS,
      latamMultiplier: CONFIG.latamMultiplier,
      apMultiplier: CONFIG.apMultiplier,
      hasCookies: !!getIdToken() || !!CONFIG.cookieString,
      tokenMinsLeft: v8,
      config: {
        email: CONFIG.email,
        acceptNA: CONFIG.acceptNA,
        acceptEU: CONFIG.acceptEU,
        autoOffer: CONFIG.autoOffer,
        autoMessage: CONFIG.autoMessage,
        activeProfile: CONFIG.activeProfile || 1,
        naMultiplier: CONFIG.naMultiplier,
        deliveryEnumValue: CONFIG.deliveryEnumValue,
        cooldownSeconds: CONFIG.cooldownSeconds,
        messageTemplate: CONFIG.messageTemplate,
        messageImageURL: CONFIG.messageImageURL || "",
        slowMode: CONFIG.slowMode,
        acceptNetWinsEU: CONFIG.acceptNetWinsEU,
        acceptNetWinsNA: CONFIG.acceptNetWinsNA,
        acceptNetWinsLATAM: CONFIG.acceptNetWinsLATAM,
        acceptNetWinsAP: CONFIG.acceptNetWinsAP,
        acceptEUDuo: CONFIG.acceptEUDuo,
        acceptNADuo: CONFIG.acceptNADuo,
        acceptLATAMDuo: CONFIG.acceptLATAMDuo,
        acceptAPDuo: CONFIG.acceptAPDuo,
        acceptEUAsc1: CONFIG.acceptEUAsc1,
        acceptEUAsc2: CONFIG.acceptEUAsc2,
        acceptEUAsc3: CONFIG.acceptEUAsc3,
        acceptNAAsc1: CONFIG.acceptNAAsc1,
        acceptNAAsc2: CONFIG.acceptNAAsc2,
        acceptNAAsc3: CONFIG.acceptNAAsc3,
        acceptLATAMAsc1: CONFIG.acceptLATAMAsc1,
        acceptLATAMAsc2: CONFIG.acceptLATAMAsc2,
        acceptLATAMAsc3: CONFIG.acceptLATAMAsc3,
        acceptAPAsc1: CONFIG.acceptAPAsc1,
        acceptAPAsc2: CONFIG.acceptAPAsc2,
        acceptAPAsc3: CONFIG.acceptAPAsc3,
        acceptEUAsc1Duo: CONFIG.acceptEUAsc1Duo,
        acceptEUAsc2Duo: CONFIG.acceptEUAsc2Duo,
        acceptEUAsc3Duo: CONFIG.acceptEUAsc3Duo,
        acceptNAAsc1Duo: CONFIG.acceptNAAsc1Duo,
        acceptNAAsc2Duo: CONFIG.acceptNAAsc2Duo,
        acceptNAAsc3Duo: CONFIG.acceptNAAsc3Duo,
        acceptLATAMAsc1Duo: CONFIG.acceptLATAMAsc1Duo,
        acceptLATAMAsc2Duo: CONFIG.acceptLATAMAsc2Duo,
        acceptLATAMAsc3Duo: CONFIG.acceptLATAMAsc3Duo,
        acceptAPAsc1Duo: CONFIG.acceptAPAsc1Duo,
        acceptAPAsc2Duo: CONFIG.acceptAPAsc2Duo,
        acceptAPAsc3Duo: CONFIG.acceptAPAsc3Duo,
        acceptEUImmo1: CONFIG.acceptEUImmo1,
        acceptEUImmo2: CONFIG.acceptEUImmo2,
        acceptEUImmo3: CONFIG.acceptEUImmo3,
        acceptEURadiant: CONFIG.acceptEURadiant,
        acceptNAImmo1: CONFIG.acceptNAImmo1,
        acceptNAImmo2: CONFIG.acceptNAImmo2,
        acceptNAImmo3: CONFIG.acceptNAImmo3,
        acceptNARadiant: CONFIG.acceptNARadiant,
        acceptLATAMImmo1: CONFIG.acceptLATAMImmo1,
        acceptLATAMImmo2: CONFIG.acceptLATAMImmo2,
        acceptLATAMImmo3: CONFIG.acceptLATAMImmo3,
        acceptLATAMRadiant: CONFIG.acceptLATAMRadiant,
        acceptAPImmo1: CONFIG.acceptAPImmo1,
        acceptAPImmo2: CONFIG.acceptAPImmo2,
        acceptAPImmo3: CONFIG.acceptAPImmo3,
        acceptAPRadiant: CONFIG.acceptAPRadiant,
        acceptEUImmo1Duo: CONFIG.acceptEUImmo1Duo,
        acceptEUImmo2Duo: CONFIG.acceptEUImmo2Duo,
        acceptEUImmo3Duo: CONFIG.acceptEUImmo3Duo,
        acceptEURadiantDuo: CONFIG.acceptEURadiantDuo,
        acceptNAImmo1Duo: CONFIG.acceptNAImmo1Duo,
        acceptNAImmo2Duo: CONFIG.acceptNAImmo2Duo,
        acceptNAImmo3Duo: CONFIG.acceptNAImmo3Duo,
        acceptNARadiantDuo: CONFIG.acceptNARadiantDuo,
        acceptLATAMImmo1Duo: CONFIG.acceptLATAMImmo1Duo,
        acceptLATAMImmo2Duo: CONFIG.acceptLATAMImmo2Duo,
        acceptLATAMImmo3Duo: CONFIG.acceptLATAMImmo3Duo,
        acceptLATAMRadiantDuo: CONFIG.acceptLATAMRadiantDuo,
        acceptAPImmo1Duo: CONFIG.acceptAPImmo1Duo,
        acceptAPImmo2Duo: CONFIG.acceptAPImmo2Duo,
        acceptAPImmo3Duo: CONFIG.acceptAPImmo3Duo,
        acceptAPRadiantDuo: CONFIG.acceptAPRadiantDuo,
        acceptLATAM: CONFIG.acceptLATAM,
        acceptAP: CONFIG.acceptAP,
        skipCustomEU: CONFIG.skipCustomEU,
        skipCustomNA: CONFIG.skipCustomNA,
        skipCustomLATAM: CONFIG.skipCustomLATAM,
        skipCustomAP: CONFIG.skipCustomAP,
        prorateRR: !!CONFIG.prorateRR,
        talkjsNymOverride: CONFIG.talkjsNymOverride || "",
        discordWebhook: CONFIG.discordWebhook || DISCORD_WEBHOOK || "",
        telegramBotToken: CONFIG.telegramBotToken || "",
        telegramChatID: CONFIG.telegramChatID || "",
        telegramOnPaidOrder: !!CONFIG.telegramOnPaidOrder,
        telegramOnOfferSent: !!CONFIG.telegramOnOfferSent,
        telegramOnImmortal: !!CONFIG.telegramOnImmortal,
        telegramOnError: !!CONFIG.telegramOnError,
        telegramMinRank: CONFIG.telegramMinRank || "",
        telegramServerEU: CONFIG.telegramServerEU !== false,
        telegramServerNA: CONFIG.telegramServerNA !== false,
        telegramServerLATAM: CONFIG.telegramServerLATAM !== false,
        telegramServerAP: CONFIG.telegramServerAP !== false
      }
    }));
    return;
  }
  if (v3 === "/api/bot/start" && req.method === "POST") {
    startBot();
    res.writeHead(200);
    res.end("{\"ok\":true}");
    return;
  }
  if (v3 === "/api/bot/stop" && req.method === "POST") {
    stopBot();
    res.writeHead(200);
    res.end("{\"ok\":true}");
    return;
  }
  if (v3 === "/api/settings" && req.method === "POST") {
    parseBody(req).then(function (err) {
      ["acceptNA", "acceptEU", "acceptLATAM", "acceptAP", "slowMode", "autoOffer", "autoMessage", "acceptNetWinsEU", "acceptNetWinsNA", "acceptNetWinsLATAM", "acceptNetWinsAP", "acceptEUDuo", "acceptNADuo", "acceptLATAMDuo", "acceptAPDuo", "acceptEUAsc1", "acceptEUAsc2", "acceptEUAsc3", "acceptNAAsc1", "acceptNAAsc2", "acceptNAAsc3", "acceptLATAMAsc1", "acceptLATAMAsc2", "acceptLATAMAsc3", "acceptAPAsc1", "acceptAPAsc2", "acceptAPAsc3", "acceptEUAsc1Duo", "acceptEUAsc2Duo", "acceptEUAsc3Duo", "acceptNAAsc1Duo", "acceptNAAsc2Duo", "acceptNAAsc3Duo", "acceptLATAMAsc1Duo", "acceptLATAMAsc2Duo", "acceptLATAMAsc3Duo", "acceptAPAsc1Duo", "acceptAPAsc2Duo", "acceptAPAsc3Duo", "acceptEUImmo1", "acceptEUImmo2", "acceptEUImmo3", "acceptEURadiant", "acceptNAImmo1", "acceptNAImmo2", "acceptNAImmo3", "acceptNARadiant", "acceptLATAMImmo1", "acceptLATAMImmo2", "acceptLATAMImmo3", "acceptLATAMRadiant", "acceptAPImmo1", "acceptAPImmo2", "acceptAPImmo3", "acceptAPRadiant", "acceptEUImmo1Duo", "acceptEUImmo2Duo", "acceptEUImmo3Duo", "acceptEURadiantDuo", "acceptNAImmo1Duo", "acceptNAImmo2Duo", "acceptNAImmo3Duo", "acceptNARadiantDuo", "acceptLATAMImmo1Duo", "acceptLATAMImmo2Duo", "acceptLATAMImmo3Duo", "acceptLATAMRadiantDuo", "acceptAPImmo1Duo", "acceptAPImmo2Duo", "acceptAPImmo3Duo", "acceptAPRadiantDuo", "skipCustomEU", "skipCustomNA", "skipCustomLATAM", "skipCustomAP", "prorateRR"].forEach(function (item) {
        if (err[item] !== undefined) {
          CONFIG[item] = err[item];
        }
      });
      if (err.naMultiplier !== undefined) {
        CONFIG.naMultiplier = parseFloat(err.naMultiplier) || 2;
      }
      if (err.latamMultiplier !== undefined) {
        var parseFloatResult = parseFloat(err.latamMultiplier);
        if (isFinite(parseFloatResult) && parseFloatResult >= 0 && parseFloatResult <= 10) {
          CONFIG.latamMultiplier = parseFloatResult;
        }
      }
      if (err.apMultiplier !== undefined) {
        var parseFloatResult2 = parseFloat(err.apMultiplier);
        if (isFinite(parseFloatResult2) && parseFloatResult2 >= 0 && parseFloatResult2 <= 10) {
          CONFIG.apMultiplier = parseFloatResult2;
        }
      }
      if (err.deliveryEnumValue !== undefined) {
        CONFIG.deliveryEnumValue = parseInt(err.deliveryEnumValue);
      }
      if (err.cooldownSeconds !== undefined) {
        CONFIG.cooldownSeconds = parseInt(err.cooldownSeconds) || 0;
      }
      if (err.messageTemplate) {
        CONFIG.messageTemplate = err.messageTemplate;
      }
      if (err.messageImageURL !== undefined) {
        var v11 = String(err.messageImageURL || "").trim();
        if (v11 === "" || /^https:\/\//i.test(v11)) {
          CONFIG.messageImageURL = v11;
          _talkjsImgCache = {};
        } else {
          addLog("Rejected non-https image URL — must start with https://", "warn");
        }
      }
      if (err.talkjsNymOverride !== undefined) {
        var v12 = String(err.talkjsNymOverride || "").trim();
        if (v12 === "" || /^[a-f0-9]{20}_n$/i.test(v12)) {
          CONFIG.talkjsNymOverride = v12;
        } else {
          addLog("Rejected invalid TalkJS nymId override (expected <20hex>_n)", "warn");
        }
      }
      if (err.activeProfile !== undefined) {
        CONFIG.activeProfile = parseInt(err.activeProfile) || 1;
        addLog("📋 Profile switched to " + CONFIG.activeProfile, "success");
      }
      if (err.discordWebhook !== undefined) {
        if (err.discordWebhook === "" || _isValidDiscordWebhook(err.discordWebhook)) {
          CONFIG.discordWebhook = err.discordWebhook;
          DISCORD_WEBHOOK = err.discordWebhook;
        } else {
          addLog("??️ Rejected non-Discord webhook URL", "warn");
        }
      }
      if (err.discordMessageWebhook !== undefined) {
        if (err.discordMessageWebhook === "" || _isValidDiscordWebhook(err.discordMessageWebhook)) {
          CONFIG.discordMessageWebhook = err.discordMessageWebhook;
          DISCORD_MSG_WEBHOOK = err.discordMessageWebhook;
        } else {
          addLog("??️ Rejected non-Discord message webhook URL", "warn");
        }
      }
      if (err.telegramBotToken !== undefined) {
        var v13 = String(err.telegramBotToken || "").trim();
        if (v13 === "" || /^\d{5,15}:[A-Za-z0-9_\-]{20,}$/.test(v13)) {
          CONFIG.telegramBotToken = v13;
          TELEGRAM_BOT_TOKEN = v13;
        } else {
          addLog("Rejected invalid Telegram bot token format", "warn");
        }
      }
      if (err.telegramChatID !== undefined) {
        var v14 = String(err.telegramChatID || "").trim();
        if (v14 === "" || /^(\s*(-?\d+|@[A-Za-z0-9_]{3,})\s*,?)+$/.test(v14)) {
          CONFIG.telegramChatID = v14;
          TELEGRAM_CHAT_IDS = v14;
        } else {
          addLog("Rejected invalid Telegram chat ID format", "warn");
        }
      }
      if (err.telegramOnPaidOrder !== undefined) {
        CONFIG.telegramOnPaidOrder = !!err.telegramOnPaidOrder;
      }
      if (err.telegramOnOfferSent !== undefined) {
        CONFIG.telegramOnOfferSent = !!err.telegramOnOfferSent;
      }
      if (err.telegramOnImmortal !== undefined) {
        CONFIG.telegramOnImmortal = !!err.telegramOnImmortal;
      }
      if (err.telegramOnError !== undefined) {
        CONFIG.telegramOnError = !!err.telegramOnError;
      }
      if (err.telegramMinRank !== undefined) {
        CONFIG.telegramMinRank = String(err.telegramMinRank || "");
      }
      if (err.telegramServerEU !== undefined) {
        CONFIG.telegramServerEU = !!err.telegramServerEU;
      }
      if (err.telegramServerNA !== undefined) {
        CONFIG.telegramServerNA = !!err.telegramServerNA;
      }
      if (err.telegramServerLATAM !== undefined) {
        CONFIG.telegramServerLATAM = !!err.telegramServerLATAM;
      }
      if (err.telegramServerAP !== undefined) {
        CONFIG.telegramServerAP = !!err.telegramServerAP;
      }
      saveConfig();
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end("{\"ok\":true}");
    });
    return;
  }
  if (v3 === "/api/pricing" && req.method === "POST") {
    parseBody(req).then(function (err) {
      function fn(arg1) {
        if (!arg1 || typeof arg1 !== "object") {
          return {};
        }
        var opts3 = {};
        Object.keys(arg1).forEach(function (item) {
          var NumberResult3 = Number(arg1[item]);
          if (isFinite(NumberResult3) && NumberResult3 >= 0 && NumberResult3 <= 100000) {
            opts3[item] = NumberResult3;
          }
        });
        return opts3;
      }
      ["tierPricesEU", "tierPricesNA", "tierPricesLATAM", "tierPricesAP", "tierPricesDuoEU", "tierPricesDuoNA", "tierPricesDuoLATAM", "tierPricesDuoAP", "tierHours", "netwinPricesEU", "netwinPricesNA", "netwinPricesLATAM", "netwinPricesAP", "netwinPricesDuoEU", "netwinPricesDuoNA", "netwinPricesDuoLATAM", "netwinPricesDuoAP", "netwinHours"].forEach(function (item) {
        if (err[item]) {
          err[item] = fn(err[item]);
        }
      });
      if (err.tierPricesEU) {
        Object.assign(TIER_PRICES_EU, err.tierPricesEU);
      }
      if (err.tierPricesNA) {
        Object.assign(TIER_PRICES_NA, err.tierPricesNA);
      }
      if (err.tierPricesLATAM) {
        Object.assign(TIER_PRICES_LATAM, err.tierPricesLATAM);
      }
      if (err.tierPricesAP) {
        Object.assign(TIER_PRICES_AP, err.tierPricesAP);
      }
      if (err.tierPricesDuoEU) {
        Object.assign(TIER_PRICES_DUO_EU, err.tierPricesDuoEU);
      }
      if (err.tierPricesDuoNA) {
        Object.assign(TIER_PRICES_DUO_NA, err.tierPricesDuoNA);
      }
      if (err.tierPricesDuoLATAM) {
        Object.assign(TIER_PRICES_DUO_LATAM, err.tierPricesDuoLATAM);
      }
      if (err.tierPricesDuoAP) {
        Object.assign(TIER_PRICES_DUO_AP, err.tierPricesDuoAP);
      }
      if (err.tierHours) {
        Object.assign(TIER_HOURS, err.tierHours);
      }
      if (err.netwinPricesEU) {
        Object.assign(NETWIN_PRICES_EU, err.netwinPricesEU);
      }
      if (err.netwinPricesNA) {
        Object.assign(NETWIN_PRICES_NA, err.netwinPricesNA);
      }
      if (err.netwinPricesLATAM) {
        Object.assign(NETWIN_PRICES_LATAM, err.netwinPricesLATAM);
      }
      if (err.netwinPricesAP) {
        Object.assign(NETWIN_PRICES_AP, err.netwinPricesAP);
      }
      if (err.netwinPricesDuoEU) {
        Object.assign(NETWIN_PRICES_DUO_EU, err.netwinPricesDuoEU);
      }
      if (err.netwinPricesDuoNA) {
        Object.assign(NETWIN_PRICES_DUO_NA, err.netwinPricesDuoNA);
      }
      if (err.netwinPricesDuoLATAM) {
        Object.assign(NETWIN_PRICES_DUO_LATAM, err.netwinPricesDuoLATAM);
      }
      if (err.netwinPricesDuoAP) {
        Object.assign(NETWIN_PRICES_DUO_AP, err.netwinPricesDuoAP);
      }
      if (err.netwinHours) {
        Object.assign(NETWIN_HOURS, err.netwinHours);
      }
      if (err.immoRrPrices) {
        Object.assign(IMMO_RR_PRICES, fn(err.immoRrPrices));
      }
      if (err.immoRrPricesDuo) {
        Object.assign(IMMO_RR_PRICES_DUO, fn(err.immoRrPricesDuo));
      }
      if (err.immoRrHours) {
        Object.assign(IMMO_RR_HOURS, fn(err.immoRrHours));
      }
      if (err.latamMultiplier !== undefined) {
        var NumberResult = Number(err.latamMultiplier);
        if (isFinite(NumberResult) && NumberResult >= 0 && NumberResult <= 10) {
          CONFIG.latamMultiplier = NumberResult;
        }
      }
      if (err.apMultiplier !== undefined) {
        var NumberResult2 = Number(err.apMultiplier);
        if (isFinite(NumberResult2) && NumberResult2 >= 0 && NumberResult2 <= 10) {
          CONFIG.apMultiplier = NumberResult2;
        }
      }
      if (err.customRules) {
        CUSTOM_RULES = err.customRules;
      }
      saveConfig();
      res.writeHead(200);
      res.end("{\"ok\":true}");
    });
    return;
  }
  if (v3 === "/api/activity/clear" && req.method === "DELETE") {
    activity = [];
    res.writeHead(200);
    res.end("{\"ok\":true}");
    return;
  }
  if (v3 === "/api/discord-test" && req.method === "POST") {
    parseBody(req).then(function (err) {
      var v11 = err.webhookUrl || DISCORD_WEBHOOK || CONFIG.discordWebhook;
      if (!v11) {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          ok: false,
          error: "No webhook configured"
        }));
        return;
      }
      if (!_isValidDiscordWebhook(v11)) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          ok: false,
          error: "Invalid Discord webhook URL"
        }));
        return;
      }
      CONFIG.discordWebhook = v11;
      DISCORD_WEBHOOK = v11;
      saveConfig();
      sendDiscordNotification({
        buyer: "TestBuyer",
        game: "Rank Boost",
        price: "28.00",
        status: "Paid",
        date: new Date().toISOString(),
        id: "test-order-123",
        currentRank: "Iron I",
        desiredRank: "Iron III",
        server: "EU",
        deliveryEnum: "Hour8"
      });
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        ok: true
      }));
    });
    return;
  }
  if (v3 === "/api/telegram-test" && req.method === "POST") {
    parseBody(req).then(function (err) {
      var v11 = String(err.telegramBotToken || CONFIG.telegramBotToken || "").trim();
      var v12 = String(err.telegramChatID || CONFIG.telegramChatID || "").trim();
      if (!v11 || !v12) {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          ok: false,
          error: "Bot token and chat ID required"
        }));
        return;
      }
      if (!/^\d{5,15}:[A-Za-z0-9_\-]{20,}$/.test(v11)) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          ok: false,
          error: "Invalid bot token format (expected: 123456789:ABC...)"
        }));
        return;
      }
      if (!/^(\s*(-?\d+|@[A-Za-z0-9_]{3,})\s*,?)+$/.test(v12)) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          ok: false,
          error: "Invalid chat ID format"
        }));
        return;
      }
      CONFIG.telegramBotToken = v11;
      TELEGRAM_BOT_TOKEN = v11;
      CONFIG.telegramChatID = v12;
      TELEGRAM_CHAT_IDS = v12;
      saveConfig();
      var res2 = https.request({
        hostname: "api.telegram.org",
        port: 443,
        path: "/bot" + encodeURIComponent(v11) + "/getMe",
        method: "GET",
        timeout: 10000
      }, function (emitter) {
        var list4 = [];
        emitter.on("data", function (chunk) {
          list4.push(chunk);
        });
        emitter.on("end", function () {
          var flag2 = false;
          var str3 = "";
          var str4 = "";
          try {
            var parsed = JSON.parse(Buffer.concat(list4).toString("utf8"));
            if (parsed && parsed.ok) {
              flag2 = true;
              str4 = parsed.result && parsed.result.username || "";
            } else {
              str3 = parsed && parsed.description || "Telegram getMe failed";
            }
          } catch (v13) {
            str3 = "Telegram returned non-JSON";
          }
          if (!flag2) {
            res.writeHead(200, {
              "Content-Type": "application/json"
            });
            res.end(JSON.stringify({
              ok: false,
              error: str3
            }));
            return;
          }
          sendTelegram("?? <b>ELDOBOT</b>\n\nTelegram integration is working correctly!\nBot: @" + _tgEscape(str4));
          res.writeHead(200, {
            "Content-Type": "application/json"
          });
          res.end(JSON.stringify({
            ok: true,
            bot: str4
          }));
        });
      });
      res2.on("error", function (err2) {
        res.writeHead(200, {
          "Content-Type": "application/json"
        });
        res.end(JSON.stringify({
          ok: false,
          error: "Network error: " + err2.message
        }));
      });
      res2.on("timeout", function () {
        res2.destroy(new Error("timeout"));
      });
      res2.end();
    });
    return;
  }
  if (v3 === "/api/send-message" && req.method === "POST") {
    parseBody(req).then(function (err) {
      var v11 = err.conversationId || "";
      var v12 = err.message || "";
      var v13 = err.orderId || "";
      if (!v12) {
        res.writeHead(400);
        res.end("{\"ok\":false,\"error\":\"no message\"}");
        return;
      }
      if (v11) {
        queueMessage(v11, v12, null);
        addLog("📨 Discord reply queued for conv: " + v11.slice(0, 8) + "...", "success");
        res.writeHead(200);
        res.end("{\"ok\":true}");
      } else {
        res.writeHead(400);
        res.end("{\"ok\":false,\"error\":\"no conversationId\"}");
      }
    });
    return;
  }
  if (v3 === "/api/order-stats" && req.method === "GET") {
    api("GET", "/api/orders/me/statesCount?displayFilter=DisplaySellingOrders&orderGroup=Regular").then(function (err) {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify(err));
    }).catch(function (err) {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        error: err.message
      }));
    });
    return;
  }
  if (v3 === "/api/sold-orders" && req.method === "GET") {
    api("GET", "/api/orders/me/seller/orders?cursorValue=9999-99-99%2099%3A99%3A99.999999999999999-9999-9999-9999-999999999999&pageSize=50&pageDirection=Next&isAscendingDateOrder=false&ignorePendingReviewOrders=false&displayFilter=DisplaySellingOrders&orderGroup=Regular").then(function (err) {
      var mapped = (err.results || []).map(function (item) {
        return {
          game: item.orderOfferDetails && item.orderOfferDetails.gameCategoryTitle || "Valorant",
          buyer: item.buyerUsername || "Unknown",
          price: item.totalPrice && item.totalPrice.amount || 0,
          status: item.state && item.state.state || "Paid",
          date: item.createdDate || "",
          orderedDate: item.createdDate || "",
          details: "Order ID: " + (item.id || "?"),
          id: item.id
        };
      });
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        orders: mapped
      }));
    }).catch(function (err) {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(JSON.stringify({
        orders: _soldOrdersList,
        error: err.message
      }));
    });
    return;
  }
  if (v3 === "/api/cookie" && req.method === "POST") {
    parseBody(req).then(function (err) {
      var v11 = (err.cookieString || "").trim();
      if (!v11) {
        res.writeHead(400);
        res.end("{\"ok\":false}");
        return;
      }
      if (v11.startsWith("eyJ") && v11.indexOf(";") === -1) {
        CONFIG.idToken = v11;
      } else {
        CONFIG.cookieString = v11;
        var CookieVal = getCookieVal("__Host-EldoradoIdToken");
        if (CookieVal) {
          CONFIG.idToken = CookieVal;
        }
        var CookieVal2 = getCookieVal("__Host-EldoradoRefreshToken");
        if (CookieVal2) {
          CONFIG.refreshToken = CookieVal2;
        }
      }
      var EmailFromToken = getEmailFromToken();
      if (EmailFromToken) {
        CONFIG.email = EmailFromToken;
      }
      var TokenExpiry2 = getTokenExpiry();
      var v12 = TokenExpiry2 ? Math.round((TokenExpiry2 - Date.now() / 1000) / 60) : 0;
      addLog("✅ Cookies saved! " + (EmailFromToken || "?") + " | " + v12 + " min left", "success");
      saveConfig();
      res.writeHead(200);
      res.end("{\"ok\":true}");
    });
    return;
  }
  if (v3 === "/api/pending-messages" && req.method === "GET") {
    var filtered = _pendingMessages.filter(function (item) {
      return item.status === "pending";
    });
    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
      messages: filtered
    }));
    return;
  }
  if (v3 === "/api/pending-messages/ack" && req.method === "POST") {
    parseBody(req).then(function (err) {
      var v11 = err.id;
      var v12 = err.success;
      for (var num = 0; num < _pendingMessages.length; num++) {
        if (_pendingMessages[num].id === v11) {
          _pendingMessages[num].status = v12 ? "sent" : "failed";
          if (v12) {
            addLog("✅ Browser extension sent message id:" + v11, "success");
          } else {
            addLog("❌ Extension failed to send message id:" + v11 + ": " + (err.error || "unknown"), "err");
          }
          break;
        }
      }
      res.writeHead(200);
      res.end("{\"ok\":true}");
    });
    return;
  }
  if (v3 === "/api/config/export" && req.method === "GET") {
    var list3 = ["autoOffer", "autoMessage", "slowMode", "cooldownSeconds", "offerCooldown", "deliveryEnumValue", "activeProfile", "acceptEU", "acceptNA", "acceptLATAM", "acceptAP", "acceptEUDuo", "acceptNADuo", "acceptLATAMDuo", "acceptAPDuo", "skipCustomEU", "skipCustomNA", "skipCustomLATAM", "skipCustomAP", "acceptNetWinsEU", "acceptNetWinsNA", "acceptNetWinsLATAM", "acceptNetWinsAP", "acceptEUAsc1", "acceptEUAsc2", "acceptEUAsc3", "acceptEUImmo1", "acceptEUImmo2", "acceptEUImmo3", "acceptEURadiant", "acceptEUAsc1Duo", "acceptEUAsc2Duo", "acceptEUAsc3Duo", "acceptEUImmo1Duo", "acceptEUImmo2Duo", "acceptEUImmo3Duo", "acceptEURadiantDuo", "acceptNAAsc1", "acceptNAAsc2", "acceptNAAsc3", "acceptNAImmo1", "acceptNAImmo2", "acceptNAImmo3", "acceptNARadiant", "acceptNAAsc1Duo", "acceptNAAsc2Duo", "acceptNAAsc3Duo", "acceptNAImmo1Duo", "acceptNAImmo2Duo", "acceptNAImmo3Duo", "acceptNARadiantDuo", "acceptLATAMAsc1", "acceptLATAMAsc2", "acceptLATAMAsc3", "acceptLATAMImmo1", "acceptLATAMImmo2", "acceptLATAMImmo3", "acceptLATAMRadiant", "acceptLATAMAsc1Duo", "acceptLATAMAsc2Duo", "acceptLATAMAsc3Duo", "acceptLATAMImmo1Duo", "acceptLATAMImmo2Duo", "acceptLATAMImmo3Duo", "acceptLATAMRadiantDuo", "acceptAPAsc1", "acceptAPAsc2", "acceptAPAsc3", "acceptAPImmo1", "acceptAPImmo2", "acceptAPImmo3", "acceptAPRadiant", "acceptAPAsc1Duo", "acceptAPAsc2Duo", "acceptAPAsc3Duo", "acceptAPImmo1Duo", "acceptAPImmo2Duo", "acceptAPImmo3Duo", "acceptAPRadiantDuo", "messageTemplate", "discordWebhook", "discordMessageWebhook", "telegramBotToken", "telegramChatID", "telegramOnPaidOrder", "telegramOnOfferSent", "telegramOnImmortal", "telegramOnError", "telegramMinRank", "telegramServerEU", "telegramServerNA", "telegramServerLATAM", "telegramServerAP"];
    var opts2 = {
      _exportedAt: new Date().toISOString(),
      _botVersion: BOT_VERSION,
      _format: "eldobot-config-v1",
      config: {},
      tierPrices: {
        EU: TIER_PRICES_EU,
        NA: TIER_PRICES_NA,
        LATAM: TIER_PRICES_LATAM,
        AP: TIER_PRICES_AP,
        EUDuo: TIER_PRICES_DUO_EU,
        NADuo: TIER_PRICES_DUO_NA,
        LATAMDuo: TIER_PRICES_DUO_LATAM,
        APDuo: TIER_PRICES_DUO_AP
      },
      netwinPrices: {
        EU: NETWIN_PRICES_EU,
        NA: NETWIN_PRICES_NA,
        LATAM: NETWIN_PRICES_LATAM,
        AP: NETWIN_PRICES_AP,
        EUDuo: NETWIN_PRICES_DUO_EU,
        NADuo: NETWIN_PRICES_DUO_NA,
        LATAMDuo: NETWIN_PRICES_DUO_LATAM,
        APDuo: NETWIN_PRICES_DUO_AP
      },
      tierHours: TIER_HOURS,
      immoRrPrices: {
        EU: IMMO_RR_PRICES.EU,
        NA: IMMO_RR_PRICES.NA,
        LATAM: IMMO_RR_PRICES.LATAM,
        AP: IMMO_RR_PRICES.AP
      },
      immoRrPricesDuo: {
        EU: IMMO_RR_PRICES_DUO.EU,
        NA: IMMO_RR_PRICES_DUO.NA,
        LATAM: IMMO_RR_PRICES_DUO.LATAM,
        AP: IMMO_RR_PRICES_DUO.AP
      },
      customRules: CUSTOM_RULES
    };
    list3.forEach(function (item) {
      if (CONFIG.hasOwnProperty(item)) {
        opts2.config[item] = CONFIG[item];
      }
    });
    var v10 = "eldobot-config-" + new Date().toISOString().slice(0, 10) + ".json";
    res.writeHead(200, {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=\"" + v10 + "\""
    });
    res.end(JSON.stringify(opts2, null, 2));
    return;
  }
  if (v3 === "/api/config/import" && req.method === "POST") {
    parseBody(req).then(function (err) {
      try {
        if (!err || err._format !== "eldobot-config-v1") {
          res.writeHead(400);
          res.end(JSON.stringify({
            ok: false,
            error: "Invalid file format - expected eldobot-config-v1"
          }));
          return;
        }
        var num = 0;
        if (err.config && typeof err.config === "object") {
          Object.keys(err.config).forEach(function (item) {
            if (CONFIG.hasOwnProperty(item) && item !== "cookieString" && item !== "idToken" && item !== "email") {
              CONFIG[item] = err.config[item];
              num++;
            }
          });
        }
        var opts3 = {
          EU: TIER_PRICES_EU,
          NA: TIER_PRICES_NA,
          LATAM: TIER_PRICES_LATAM,
          AP: TIER_PRICES_AP,
          EUDuo: TIER_PRICES_DUO_EU,
          NADuo: TIER_PRICES_DUO_NA,
          LATAMDuo: TIER_PRICES_DUO_LATAM,
          APDuo: TIER_PRICES_DUO_AP
        };
        if (err.tierPrices && typeof err.tierPrices === "object") {
          Object.keys(err.tierPrices).forEach(function (item) {
            if (opts3[item] && err.tierPrices[item]) {
              Object.assign(opts3[item], err.tierPrices[item]);
            }
          });
        }
        var opts4 = {
          EU: NETWIN_PRICES_EU,
          NA: NETWIN_PRICES_NA,
          LATAM: NETWIN_PRICES_LATAM,
          AP: NETWIN_PRICES_AP,
          EUDuo: NETWIN_PRICES_DUO_EU,
          NADuo: NETWIN_PRICES_DUO_NA,
          LATAMDuo: NETWIN_PRICES_DUO_LATAM,
          APDuo: NETWIN_PRICES_DUO_AP
        };
        if (err.netwinPrices && typeof err.netwinPrices === "object") {
          Object.keys(err.netwinPrices).forEach(function (item) {
            if (opts4[item] && err.netwinPrices[item]) {
              Object.assign(opts4[item], err.netwinPrices[item]);
            }
          });
        }
        if (err.tierHours && typeof err.tierHours === "object") {
          Object.assign(TIER_HOURS, err.tierHours);
        }
        if (err.immoRrPrices && typeof err.immoRrPrices === "object") {
          Object.assign(IMMO_RR_PRICES, err.immoRrPrices);
        }
        if (err.immoRrPricesDuo && typeof err.immoRrPricesDuo === "object") {
          Object.assign(IMMO_RR_PRICES_DUO, err.immoRrPricesDuo);
        }
        if (Array.isArray(err.customRules)) {
          CUSTOM_RULES = err.customRules;
        }
        saveConfig();
        addLog("Config imported: " + num + " settings + pricing/rules merged", "success");
        res.writeHead(200);
        res.end(JSON.stringify({
          ok: true,
          imported: num
        }));
      } catch (err2) {
        res.writeHead(400);
        res.end(JSON.stringify({
          ok: false,
          error: err2.message
        }));
      }
    });
    return;
  }
  res.writeHead(404);
  res.end("Not found");
});
server.on("error", function (err) {
  if (err.code === "EADDRINUSE") {
    PORT++;
    setTimeout(function () {
      server.listen(PORT, "127.0.0.1", onListen);
    }, 400);
    return;
  }
  console.error("[server] HTTP server error:", err.code || "", err.message || err);
});
process.on("uncaughtException", function (err) {
  try {
    console.error("[fatal] uncaughtException:", err && err.stack || err);
  } catch (v) {}
  try {
    addLog("Internal error: " + (err && err.message ? err.message : err), "err");
  } catch (v) {}
});
process.on("unhandledRejection", function (err) {
  try {
    console.error("[fatal] unhandledRejection:", err && err.stack || err);
  } catch (v) {}
  try {
    addLog("Async error: " + (err && err.message ? err.message : err), "err");
  } catch (v) {}
});
var _shuttingDown = false;
function _gracefulExit(arg1) {
  if (_shuttingDown) {
    return;
  }
  _shuttingDown = true;
  try {
    saveConfig();
  } catch (v) {}
  try {
    saveStatsHistory();
  } catch (v) {}
  try {
    console.log("\n[shutdown] State flushed. Goodbye.");
  } catch (v) {}
  setTimeout(function () {
    process.exit(arg1 || 0);
  }, 150);
}
process.on("SIGINT", function () {
  _gracefulExit(0);
});
process.on("SIGTERM", function () {
  _gracefulExit(0);
});
if (process.platform === "win32") {
  process.on("SIGHUP", function () {
    _gracefulExit(0);
  });
  process.on("SIGBREAK", function () {
    _gracefulExit(0);
  });
}
function onListen() {
  var v = "http://localhost:" + PORT;
  var v2 = "═".repeat(38);
  var v3;
  if (_licenseExpiry) {
    var v4 = _licenseExpiry - Date.now();
    if (v4 <= 0) {
      v3 = "EXPIRED";
    } else {
      var v5 = Math.floor(v4 / 1000);
      var v6 = Math.floor(v5 / 86400);
      var v7 = Math.floor(v5 % 86400 / 3600);
      var v8 = Math.floor(v5 % 3600 / 60);
      v3 = v6 > 0 ? v6 + "d " + v7 + "h:" + ("0" + v8).slice(-2) + "m" : v7 + "h:" + ("0" + v8).slice(-2) + "m";
    }
  } else {
    v3 = "Lifetime";
  }
  if (_licenseGrace) {
    v3 += " (offline grace)";
  }
  var v9 = updateAvailable ? " [UPDATE: v" + latestVersion + " available]" : "";
  console.log("\n╔" + v2 + "╗");
  console.log("║           ELDOBOT  v" + BOT_VERSION + "               ║");
  console.log("╠" + v2 + "╣");
  console.log("║  Status  : ✅ License Active                ║");
  console.log("║  Expires : " + v3 + "                   ║");
  console.log("║  Dashboard: " + v + "         ║");
  if (updateAvailable) {
    console.log("║  ? Update available: v" + latestVersion + "              ║");
  }
  console.log("╚" + v2 + "╝\n");
  cp.exec("start " + v);
}
(function boot() {
  try {
    if (fs.existsSync("eldobot_config.json")) {
      var parsed = JSON.parse(fs.readFileSync("eldobot_config.json", "utf8"));
      if (parsed.cookieString) {
        CONFIG.cookieString = parsed.cookieString;
      }
      if (parsed.idToken) {
        CONFIG.idToken = parsed.idToken;
      }
      if (parsed.email) {
        CONFIG.email = parsed.email;
      }
      var list = ["acceptNA", "acceptEU", "acceptLATAM", "acceptAP", "slowMode", "autoOffer", "autoMessage", "acceptNetWinsEU", "acceptNetWinsNA", "acceptNetWinsLATAM", "acceptNetWinsAP", "acceptEUDuo", "acceptNADuo", "acceptLATAMDuo", "acceptAPDuo", "acceptEUAsc1", "acceptEUAsc2", "acceptEUAsc3", "acceptNAAsc1", "acceptNAAsc2", "acceptNAAsc3", "acceptLATAMAsc1", "acceptLATAMAsc2", "acceptLATAMAsc3", "acceptAPAsc1", "acceptAPAsc2", "acceptAPAsc3", "acceptEUAsc1Duo", "acceptEUAsc2Duo", "acceptEUAsc3Duo", "acceptNAAsc1Duo", "acceptNAAsc2Duo", "acceptNAAsc3Duo", "acceptLATAMAsc1Duo", "acceptLATAMAsc2Duo", "acceptLATAMAsc3Duo", "acceptAPAsc1Duo", "acceptAPAsc2Duo", "acceptAPAsc3Duo", "acceptEUImmo1", "acceptEUImmo2", "acceptEUImmo3", "acceptEURadiant", "acceptNAImmo1", "acceptNAImmo2", "acceptNAImmo3", "acceptNARadiant", "acceptLATAMImmo1", "acceptLATAMImmo2", "acceptLATAMImmo3", "acceptLATAMRadiant", "acceptAPImmo1", "acceptAPImmo2", "acceptAPImmo3", "acceptAPRadiant", "acceptEUImmo1Duo", "acceptEUImmo2Duo", "acceptEUImmo3Duo", "acceptEURadiantDuo", "acceptNAImmo1Duo", "acceptNAImmo2Duo", "acceptNAImmo3Duo", "acceptNARadiantDuo", "acceptLATAMImmo1Duo", "acceptLATAMImmo2Duo", "acceptLATAMImmo3Duo", "acceptLATAMRadiantDuo", "acceptAPImmo1Duo", "acceptAPImmo2Duo", "acceptAPImmo3Duo", "acceptAPRadiantDuo", "skipCustomEU", "skipCustomNA", "skipCustomLATAM", "skipCustomAP", "prorateRR"];
      list.forEach(function (item) {
        if (parsed[item] !== undefined) {
          CONFIG[item] = parsed[item];
        }
      });
      if (parsed.cooldownSeconds !== undefined) {
        CONFIG.cooldownSeconds = parsed.cooldownSeconds;
      }
      if (parsed.naMultiplier !== undefined) {
        CONFIG.naMultiplier = parsed.naMultiplier;
      }
      if (parsed.messageTemplate) {
        CONFIG.messageTemplate = parsed.messageTemplate;
      }
      if (parsed.messageImageURL !== undefined) {
        CONFIG.messageImageURL = String(parsed.messageImageURL || "");
      }
      if (parsed.talkjsNymOverride !== undefined) {
        CONFIG.talkjsNymOverride = String(parsed.talkjsNymOverride || "");
      }
      if (parsed.discordWebhook) {
        CONFIG.discordWebhook = parsed.discordWebhook;
        DISCORD_WEBHOOK = parsed.discordWebhook;
      }
      if (parsed.discordMessageWebhook) {
        CONFIG.discordMessageWebhook = parsed.discordMessageWebhook;
        DISCORD_MSG_WEBHOOK = parsed.discordMessageWebhook;
      }
      if (parsed.telegramBotToken !== undefined) {
        CONFIG.telegramBotToken = String(parsed.telegramBotToken || "");
        TELEGRAM_BOT_TOKEN = CONFIG.telegramBotToken;
      }
      if (parsed.telegramChatID !== undefined) {
        CONFIG.telegramChatID = String(parsed.telegramChatID || "");
        TELEGRAM_CHAT_IDS = CONFIG.telegramChatID;
      }
      if (parsed.telegramOnPaidOrder !== undefined) {
        CONFIG.telegramOnPaidOrder = !!parsed.telegramOnPaidOrder;
      }
      if (parsed.telegramOnOfferSent !== undefined) {
        CONFIG.telegramOnOfferSent = !!parsed.telegramOnOfferSent;
      }
      if (parsed.telegramOnImmortal !== undefined) {
        CONFIG.telegramOnImmortal = !!parsed.telegramOnImmortal;
      }
      if (parsed.telegramOnError !== undefined) {
        CONFIG.telegramOnError = !!parsed.telegramOnError;
      }
      if (parsed.telegramMinRank !== undefined) {
        CONFIG.telegramMinRank = String(parsed.telegramMinRank || "");
      }
      if (parsed.telegramServerEU !== undefined) {
        CONFIG.telegramServerEU = !!parsed.telegramServerEU;
      }
      if (parsed.telegramServerNA !== undefined) {
        CONFIG.telegramServerNA = !!parsed.telegramServerNA;
      }
      if (parsed.telegramServerLATAM !== undefined) {
        CONFIG.telegramServerLATAM = !!parsed.telegramServerLATAM;
      }
      if (parsed.telegramServerAP !== undefined) {
        CONFIG.telegramServerAP = !!parsed.telegramServerAP;
      }
      if (Array.isArray(parsed.customRules)) {
        CUSTOM_RULES = parsed.customRules;
      }
      if (parsed.activeProfile) {
        CONFIG.activeProfile = parsed.activeProfile;
      }
      if (parsed.tierPricesEU) {
        Object.assign(TIER_PRICES_EU, parsed.tierPricesEU);
      }
      if (parsed.tierPricesNA) {
        Object.assign(TIER_PRICES_NA, parsed.tierPricesNA);
      }
      if (parsed.tierPricesLATAM) {
        Object.assign(TIER_PRICES_LATAM, parsed.tierPricesLATAM);
      }
      if (parsed.tierPricesAP) {
        Object.assign(TIER_PRICES_AP, parsed.tierPricesAP);
      }
      if (parsed.tierPricesDuoEU) {
        Object.assign(TIER_PRICES_DUO_EU, parsed.tierPricesDuoEU);
      }
      if (parsed.tierPricesDuoNA) {
        Object.assign(TIER_PRICES_DUO_NA, parsed.tierPricesDuoNA);
      }
      if (parsed.tierPricesDuoLATAM) {
        Object.assign(TIER_PRICES_DUO_LATAM, parsed.tierPricesDuoLATAM);
      }
      if (parsed.tierPricesDuoAP) {
        Object.assign(TIER_PRICES_DUO_AP, parsed.tierPricesDuoAP);
      }
      if (parsed.tierHours) {
        Object.assign(TIER_HOURS, parsed.tierHours);
      }
      if (parsed.netwinPricesEU) {
        Object.assign(NETWIN_PRICES_EU, parsed.netwinPricesEU);
      }
      if (parsed.netwinPricesNA) {
        Object.assign(NETWIN_PRICES_NA, parsed.netwinPricesNA);
      }
      if (parsed.netwinPricesLATAM) {
        Object.assign(NETWIN_PRICES_LATAM, parsed.netwinPricesLATAM);
      }
      if (parsed.netwinPricesAP) {
        Object.assign(NETWIN_PRICES_AP, parsed.netwinPricesAP);
      }
      if (parsed.netwinPricesDuoEU) {
        Object.assign(NETWIN_PRICES_DUO_EU, parsed.netwinPricesDuoEU);
      }
      if (parsed.netwinPricesDuoNA) {
        Object.assign(NETWIN_PRICES_DUO_NA, parsed.netwinPricesDuoNA);
      }
      if (parsed.netwinPricesDuoLATAM) {
        Object.assign(NETWIN_PRICES_DUO_LATAM, parsed.netwinPricesDuoLATAM);
      }
      if (parsed.netwinPricesDuoAP) {
        Object.assign(NETWIN_PRICES_DUO_AP, parsed.netwinPricesDuoAP);
      }
      if (parsed.netwinHours) {
        Object.assign(NETWIN_HOURS, parsed.netwinHours);
      }
      if (parsed.immoRrPrices) {
        Object.assign(IMMO_RR_PRICES, parsed.immoRrPrices);
      }
      if (parsed.immoRrPricesDuo) {
        Object.assign(IMMO_RR_PRICES_DUO, parsed.immoRrPricesDuo);
      }
      if (parsed.immoRrHours) {
        Object.assign(IMMO_RR_HOURS, parsed.immoRrHours);
      }
      if (parsed.latamMultiplier !== undefined) {
        CONFIG.latamMultiplier = Number(parsed.latamMultiplier) || 1.15;
      }
      if (parsed.apMultiplier !== undefined) {
        CONFIG.apMultiplier = Number(parsed.apMultiplier) || 1.15;
      }
      addLog("✅ Config loaded: " + CUSTOM_RULES.length + " custom rules, cookies: " + (CONFIG.idToken ? "yes" : "no"), "success");
    }
  } catch (err) {
    console.log("Boot config load error:", err.message);
  }
  if (!process.pkg && process.env.ELDOBOT_SKIP_LICENSE === "1") {
    server.listen(PORT, "127.0.0.1", onListen);
    startTokenWatcher();
    return;
  }
  try {
    var licenseClient = require("./license_client");
    _licClient = licenseClient;
    licenseClient.validate().then(function (lic) {
      _licenseExpiry = lic.expiresAt || 0;
      _licenseGrace = !!lic.grace;
      if (lic.latestVersion && lic.latestVersion !== BOT_VERSION) {
        updateAvailable = true;
        latestVersion = lic.latestVersion;
      }
      server.listen(PORT, "127.0.0.1", onListen);
      startTokenWatcher();
      startTelemetry();
      licenseClient.startWatchdog(function (err) {
        console.error("\n===========================================");
        console.error("  LICENSE TERMINATED");
        console.error("  Reason: " + err);
        console.error("  Bot is shutting down.");
        console.error("===========================================\n");
        process.exit(2);
      });
    }).catch(function (err) {
      console.error("[license] startup blocked: " + (err.message || err));
      console.error("Place a valid license.key file next to the bot and restart.");
      process.exit(2);
    });
  } catch (err) {
    console.error("[license] module load error:", err.message);
    process.exit(2);
  }
})();
