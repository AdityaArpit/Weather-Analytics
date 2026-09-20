"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_http = require("http");

// server/app.ts
var import_config = require("dotenv/config");
var import_express2 = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);

// server/routes.ts
var import_express = require("express");
var import_node_crypto = require("node:crypto");
var import_multer = __toESM(require("multer"), 1);

// server/sachet.ts
var import_fast_xml_parser = require("fast-xml-parser");

// server/lib/dateFormat.ts
function formatDisasterDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
function coerceIsoDate(value) {
  if (typeof value !== "string" || !value.trim()) return void 0;
  const trimmed = value.trim();
  const date = new Date(trimmed);
  if (!Number.isNaN(date.getTime())) return date.toISOString();
  const yearMatch = trimmed.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) return (/* @__PURE__ */ new Date(`${yearMatch[0]}-01-01T00:00:00.000Z`)).toISOString();
  return void 0;
}

// server/lib/relevanceEngine.ts
function isAlertExpired(alert, now2 = /* @__PURE__ */ new Date()) {
  if (!alert.expires) return false;
  const expiryTime = new Date(alert.expires).getTime();
  return !isNaN(expiryTime) && expiryTime <= now2.getTime();
}

// server/sachet.ts
var sachetCache = {
  etag: `sachet-${Date.now()}`,
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
  data: [],
  liveSourceCount: 0
};
var xmlParser = new import_fast_xml_parser.XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  trimValues: true
});
function normalizeCategory(raw, eventName) {
  const combined = `${raw || ""} ${eventName || ""}`.toLowerCase();
  if (combined.includes("cyclon") || combined.includes("depression") || combined.includes("gale")) return "Cyclone";
  if (combined.includes("flood") || combined.includes("inundat")) {
    if (combined.includes("urban")) return "Urban Flood";
    return "Flood";
  }
  if (combined.includes("earthquake") || combined.includes("seismic") || combined.includes("tremor")) return "Earthquake";
  if (combined.includes("landslide") || combined.includes("rockfall") || combined.includes("mudslide")) return "Landslide";
  if (combined.includes("heat") || combined.includes("loo")) return "Heat Wave";
  if (combined.includes("cold") || combined.includes("frost")) return "Cold Wave";
  if (combined.includes("lightning") || combined.includes("thunderbolt")) return "Lightning";
  if (combined.includes("thunderstorm") || combined.includes("squall")) return "Thunderstorm";
  if (combined.includes("heavy rain") || combined.includes("rainfall") || combined.includes("downpour")) return "Heavy Rain";
  if (combined.includes("storm")) return "Storm";
  if (combined.includes("tsunami")) return "Tsunami";
  if (combined.includes("avalanche")) return "Avalanche";
  if (combined.includes("forest fire") || combined.includes("wildfire")) return "Forest Fire";
  if (combined.includes("drought")) return "Drought";
  if (combined.includes("air pollution") || combined.includes("smog") || combined.includes("aqi")) return "Air Pollution";
  return "General Alert";
}
var INDIA_BOUNDS = {
  minLat: 6,
  maxLat: 38.8,
  minLng: 67.5,
  maxLng: 98.8
};
var STATE_CENTROIDS = {
  "andaman and nicobar islands": [11.7401, 92.6586],
  "andhra pradesh": [15.9129, 79.74],
  "arunachal pradesh": [28.218, 94.7278],
  assam: [26.2006, 92.9376],
  bihar: [25.0961, 85.3131],
  chhattisgarh: [21.2787, 81.8661],
  goa: [15.2993, 74.124],
  gujarat: [22.2587, 71.1924],
  haryana: [29.0588, 76.0856],
  "himachal pradesh": [31.1048, 77.1734],
  jharkhand: [23.6102, 85.2799],
  karnataka: [15.3173, 75.7139],
  kerala: [10.8505, 76.2711],
  ladakh: [34.1526, 77.577],
  "madhya pradesh": [22.9734, 78.6569],
  maharashtra: [19.7515, 75.7139],
  manipur: [24.6637, 93.9063],
  meghalaya: [25.467, 91.3662],
  mizoram: [23.1645, 92.9376],
  nagaland: [26.1584, 94.5624],
  odisha: [20.9517, 85.0985],
  punjab: [31.1471, 75.3412],
  rajasthan: [27.0238, 74.2179],
  sikkim: [27.533, 88.5122],
  "tamil nadu": [11.1271, 78.6569],
  telangana: [18.1124, 79.0193],
  tripura: [23.9408, 91.9882],
  uttarakhand: [30.0668, 79.0193],
  "uttar pradesh": [26.8467, 80.9462],
  "west bengal": [22.9868, 87.855],
  delhi: [28.6139, 77.209],
  "jammu and kashmir": [33.7782, 76.5762],
  "dadra and nagar haveli and daman and diu": [20.3974, 72.8328],
  "puducherry": [11.9416, 79.8083]
};
function isWithinIndiaBounds(lat, lng) {
  return lat >= INDIA_BOUNDS.minLat && lat <= INDIA_BOUNDS.maxLat && lng >= INDIA_BOUNDS.minLng && lng <= INDIA_BOUNDS.maxLng;
}
function deriveIndicativeCentroid(...parts) {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  if (!text) return void 0;
  for (const [needle, centroid] of Object.entries(STATE_CENTROIDS)) {
    if (text.includes(needle)) {
      return centroid;
    }
  }
  if (text.includes("bhubaneswar") || text.includes("puri") || text.includes("cuttack")) return STATE_CENTROIDS.odisha;
  if (text.includes("guwahati") || text.includes("kamrup") || text.includes("dibrugarh")) return STATE_CENTROIDS.assam;
  if (text.includes("shimla") || text.includes("kullu") || text.includes("manali")) return STATE_CENTROIDS["himachal pradesh"];
  if (text.includes("srinagar") || text.includes("jammu")) return STATE_CENTROIDS["jammu and kashmir"];
  if (text.includes("mumbai") || text.includes("raigad") || text.includes("konkan")) return STATE_CENTROIDS.maharashtra;
  if (text.includes("kozhikode") || text.includes("wayanad") || text.includes("thiruvananthapuram")) return STATE_CENTROIDS.kerala;
  if (text.includes("ahmedabad") || text.includes("surat") || text.includes("kutch")) return STATE_CENTROIDS.gujarat;
  if (text.includes("kolkata") || text.includes("sundarbans")) return STATE_CENTROIDS["west bengal"];
  if (text.includes("chennai") || text.includes("madurai") || text.includes("tirunelveli")) return STATE_CENTROIDS["tamil nadu"];
  if (text.includes("jaipur") || text.includes("bikaner") || text.includes("jaisalmer")) return STATE_CENTROIDS.rajasthan;
  if (text.includes("delhi") || text.includes("ncr") || text.includes("gurugram")) return STATE_CENTROIDS.delhi;
  const districtHints = [
    ["arvalli", STATE_CENTROIDS.gujarat],
    ["chhotaudepur", STATE_CENTROIDS.gujarat],
    ["chhota udaipur", STATE_CENTROIDS.gujarat],
    ["dahod", STATE_CENTROIDS.gujarat],
    ["mahisagar", STATE_CENTROIDS.gujarat],
    ["narmada", STATE_CENTROIDS.gujarat],
    ["panch mahals", STATE_CENTROIDS.gujarat],
    ["panchmahal", STATE_CENTROIDS.gujarat],
    ["sabarkantha", STATE_CENTROIDS.gujarat],
    ["sabar kantha", STATE_CENTROIDS.gujarat],
    ["banaskantha", STATE_CENTROIDS.gujarat],
    ["balrampur", STATE_CENTROIDS["chhattisgarh"]],
    ["bastar", STATE_CENTROIDS["chhattisgarh"]],
    ["bijapur", STATE_CENTROIDS["chhattisgarh"]],
    ["dantewada", STATE_CENTROIDS["chhattisgarh"]],
    ["koriya", STATE_CENTROIDS["chhattisgarh"]],
    ["manendragarh", STATE_CENTROIDS["chhattisgarh"]],
    ["sukma", STATE_CENTROIDS["chhattisgarh"]],
    ["surajpur", STATE_CENTROIDS["chhattisgarh"]],
    ["chengalpattu", STATE_CENTROIDS["tamil nadu"]],
    ["cuddalore", STATE_CENTROIDS["tamil nadu"]],
    ["kallakurichi", STATE_CENTROIDS["tamil nadu"]],
    ["kancheepuram", STATE_CENTROIDS["tamil nadu"]],
    ["pudukkottai", STATE_CENTROIDS["tamil nadu"]],
    ["sivaganga", STATE_CENTROIDS["tamil nadu"]],
    ["thanjavur", STATE_CENTROIDS["tamil nadu"]],
    ["thiruvarur", STATE_CENTROIDS["tamil nadu"]],
    ["viluppuram", STATE_CENTROIDS["tamil nadu"]],
    ["ariyalur", STATE_CENTROIDS["tamil nadu"]],
    ["karur", STATE_CENTROIDS["tamil nadu"]],
    ["alipurduar", STATE_CENTROIDS["west bengal"]],
    ["jalpaiguri", STATE_CENTROIDS["west bengal"]],
    ["north dinajpur", STATE_CENTROIDS["west bengal"]],
    ["south dinajpur", STATE_CENTROIDS["west bengal"]],
    ["uttar dinajpur", STATE_CENTROIDS["west bengal"]],
    ["dakshin dinajpur", STATE_CENTROIDS["west bengal"]],
    ["dehradun", STATE_CENTROIDS.uttarakhand],
    ["tehri", STATE_CENTROIDS.uttarakhand],
    ["uttarkashi", STATE_CENTROIDS.uttarakhand],
    ["chamoli", STATE_CENTROIDS.uttarakhand],
    ["rudraprayag", STATE_CENTROIDS.uttarakhand],
    ["pithoragarh", STATE_CENTROIDS.uttarakhand],
    ["east garo hills", STATE_CENTROIDS.meghalaya],
    ["west garo hills", STATE_CENTROIDS.meghalaya],
    ["east khasi hills", STATE_CENTROIDS.meghalaya],
    ["west khasi hills", STATE_CENTROIDS.meghalaya],
    ["west jaintia hills", STATE_CENTROIDS.meghalaya],
    ["south west khasi hills", STATE_CENTROIDS.meghalaya],
    ["ri bhoi", STATE_CENTROIDS.meghalaya],
    ["bahraich", STATE_CENTROIDS["uttar pradesh"]],
    ["shravasti", STATE_CENTROIDS["uttar pradesh"]],
    ["saharanpur", STATE_CENTROIDS["uttar pradesh"]],
    ["sonbhadra", STATE_CENTROIDS["uttar pradesh"]],
    ["kamrup", STATE_CENTROIDS.assam],
    ["sonitpur", STATE_CENTROIDS.assam],
    ["dibrugarh", STATE_CENTROIDS.assam],
    ["goalpara", STATE_CENTROIDS.assam],
    ["barpeta", STATE_CENTROIDS.assam],
    ["raigad", STATE_CENTROIDS.maharashtra],
    ["ratnagiri", STATE_CENTROIDS.maharashtra],
    ["sindhudurg", STATE_CENTROIDS.maharashtra],
    ["wayanad", STATE_CENTROIDS.kerala],
    ["idukki", STATE_CENTROIDS.kerala],
    ["palakkad", STATE_CENTROIDS.kerala],
    ["bhadrak", STATE_CENTROIDS.odisha],
    ["balasore", STATE_CENTROIDS.odisha],
    ["khordha", STATE_CENTROIDS.odisha],
    ["kalahandi", STATE_CENTROIDS.odisha],
    ["koraput", STATE_CENTROIDS.odisha],
    ["jagatsinghpur", STATE_CENTROIDS.odisha],
    ["kendrapara", STATE_CENTROIDS.odisha],
    ["muzaffarpur", STATE_CENTROIDS.bihar],
    ["sitamarhi", STATE_CENTROIDS.bihar],
    ["madhubani", STATE_CENTROIDS.bihar],
    ["patna", STATE_CENTROIDS.bihar]
  ];
  for (const [needle, centroid] of districtHints) {
    if (text.includes(needle)) return centroid;
  }
  return void 0;
}
function isLikelyIndianEarthquake(place, lat, lng) {
  if (!isWithinIndiaBounds(lat, lng)) return false;
  const text = place.toLowerCase();
  const indianHints = [
    "india",
    "assam",
    "bihar",
    "gujarat",
    "himachal pradesh",
    "jammu and kashmir",
    "karnataka",
    "kerala",
    "maharashtra",
    "odisha",
    "rajasthan",
    "sikkim",
    "tamil nadu",
    "uttarakhand",
    "west bengal",
    "delhi",
    "manipur",
    "nagaland",
    "mizoram",
    "tripura",
    "meghalaya",
    "arunachal pradesh",
    "andhra pradesh",
    "telangana",
    "punjab"
  ];
  return indianHints.some((hint) => text.includes(hint));
}
async function fetchUSGSIndianEarthquakes() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);
    const url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.8&minlatitude=5.0&maxlatitude=38.0&minlongitude=65.0&maxlongitude=98.0&limit=15";
    const res = await fetch(url, { signal: controller.signal }).catch(() => null);
    clearTimeout(timeoutId);
    if (!res || !res.ok) return [];
    const json = await res.json();
    const features = json.features || [];
    const alerts = [];
    for (const f of features) {
      const props = f.properties || {};
      const geom = f.geometry || {};
      const [lng, lat, depth] = geom.coordinates || [0, 0, 0];
      if (!lat || !lng) continue;
      const mag = Number(props.mag || 0);
      const place = String(props.place || "Northern Indian Subcontinent");
      const timeMs = Number(props.time || Date.now());
      const sentTime = new Date(timeMs).toISOString();
      const expiryTime = new Date(timeMs + 48 * 3600 * 1e3).toISOString();
      if (!isLikelyIndianEarthquake(place, lat, lng)) {
        continue;
      }
      let severity = "Minor";
      if (mag >= 5.5) severity = "Extreme";
      else if (mag >= 4.5) severity = "Severe";
      else if (mag >= 3.5) severity = "Moderate";
      const alertId = `USGS-EQ-${f.id || Date.now()}`;
      const workingUrl = props.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${f.id}`;
      alerts.push({
        id: alertId,
        identifier: `USGS/NCS/EQ/${f.id}`,
        bulletinNo: `SEISMO-EQ-M${mag.toFixed(1)}-${f.id}`,
        sender: "National Center for Seismology (NCS) & USGS Global Seismic Network",
        sourceAgency: "National Center for Seismology (NCS) & USGS",
        helpline: "1070 (SEOC) | 1077 (DEOC) | 112 National Emergency",
        officialPortalUrl: "https://seismo.gov.in",
        liveNewsQuery: `earthquake ${place} India magnitude ${mag.toFixed(1)}`,
        feedOrigin: "NDMA_SACHET_LIVE",
        sent: sentTime,
        status: "Actual",
        msgType: "Alert",
        source: "Live USGS / National Center for Seismology (NCS) Real-Time Seismic Stream",
        scope: "Public",
        category: "Earthquake",
        rawCategory: "Geo / Seismic",
        event: `Seismic Activity (Magnitude ${mag.toFixed(1)})`,
        urgency: mag >= 4.5 ? "Immediate" : "Expected",
        severity,
        certainty: "Observed",
        headline: `M ${mag.toFixed(1)} Earthquake Recorded near ${place}`,
        description: `A magnitude ${mag.toFixed(1)} earthquake was detected at coordinates ${lat.toFixed(4)}\xB0N, ${lng.toFixed(4)}\xB0E at a depth of ${depth} km. Monitored in real-time by seismic telemetry networks.`,
        instruction: mag >= 4.5 ? "1. If indoors: DROP, COVER, and HOLD ON under sturdy furniture away from windows.\n2. If outdoors: Move to open areas away from buildings, overhead electrical wires, and steep slopes.\n3. Be prepared for potential secondary aftershocks. Check gas lines and structural cracks before re-entering buildings." : "Minor seismic tremor registered. No immediate structural damage expected. Stay calm and monitor official State Disaster Management Authority updates.",
        areaDesc: place,
        centroid: [lat, lng],
        circle: {
          center: [lat, lng],
          radiusKm: Math.max(15, mag * 18)
        },
        effective: sentTime,
        expires: expiryTime,
        isExpired: false,
        webUrl: workingUrl
      });
    }
    return alerts;
  } catch (e) {
    console.log("USGS live seismic API notice:", e.message);
    return [];
  }
}
var PUBLIC_SACHET_FEED_URL = "https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml";
function asArray(value) {
  if (value === void 0 || value === null) return [];
  return Array.isArray(value) ? value : [value];
}
function asString(value, fallback = "") {
  if (value === void 0 || value === null) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}
function normalizeSeverityValue(value) {
  const raw = asString(value).toLowerCase();
  if (raw === "extreme" || raw.includes("red")) return "Extreme";
  if (raw === "severe" || raw.includes("orange")) return "Severe";
  if (raw === "moderate" || raw.includes("yellow")) return "Moderate";
  return "Minor";
}
function normalizeUrgencyValue(value) {
  return asString(value).toLowerCase() === "immediate" ? "Immediate" : "Expected";
}
function normalizeCertaintyValue(value) {
  const raw = asString(value).toLowerCase();
  if (raw === "observed") return "Observed";
  if (raw === "likely") return "Likely";
  return "Possible";
}
function parseCapPolygon(value) {
  const raw = asString(value);
  if (!raw) return void 0;
  const points = [];
  for (const pair of raw.split(/\s+/)) {
    const [latRaw, lngRaw] = pair.split(",");
    const lat = Number(latRaw);
    const lng = Number(lngRaw);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      points.push([lat, lng]);
    }
  }
  if (points.length < 3) return void 0;
  return {
    type: "Polygon",
    coordinates: points
  };
}
function parseCapCircle(value) {
  const raw = asString(value);
  if (!raw) return void 0;
  const [latRaw, lngRaw, radiusRaw] = raw.split(",");
  const lat = Number(latRaw);
  const lng = Number(lngRaw);
  const radiusKm = Number(radiusRaw);
  if (![lat, lng, radiusKm].every(Number.isFinite)) {
    return void 0;
  }
  return {
    center: [lat, lng],
    radiusKm
  };
}
function calculateCentroid(polygon, circle) {
  if (circle) return circle.center;
  if (!polygon?.coordinates?.length) return void 0;
  const points = polygon.coordinates;
  const lat = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p[1], 0) / points.length;
  return [lat, lng];
}
function parseCapAlert(root) {
  const infos = asArray(root?.info || root?.["cap:info"]);
  if (!infos.length) return [];
  const selectedInfo = infos.find((info2) => {
    const language = asString(info2.language || info2["cap:language"]).toLowerCase();
    return language === "en" || language === "en-in" || language.startsWith("en-");
  }) || infos[0];
  const info = selectedInfo || {};
  const area = asArray(info.area || info["cap:area"])[0] || {};
  const event = asString(
    info.event || info["cap:event"],
    "Disaster Warning"
  );
  const rawCategory = asString(
    info.category || info["cap:category"],
    "Met"
  );
  const polygon = parseCapPolygon(
    area.polygon || area["cap:polygon"]
  );
  const circle = parseCapCircle(
    area.circle || area["cap:circle"]
  );
  const centroid = calculateCentroid(polygon, circle) || deriveIndicativeCentroid(
    asString(info.parameter?.state || info.parameter?.STATE),
    asString(info.parameter?.district || info.parameter?.DISTRICT),
    asString(area.areaDesc || area["cap:areaDesc"]),
    event,
    rawCategory
  );
  const sent = asString(
    root.sent,
    (/* @__PURE__ */ new Date()).toISOString()
  );
  const effective = asString(
    info.effective || info["cap:effective"],
    sent
  );
  const expires = asString(
    info.expires || info["cap:expires"],
    new Date(Date.now() + 24 * 3600 * 1e3).toISOString()
  );
  const alertObj = {
    id: asString(
      root.identifier,
      `SACHET-${Date.now()}-${Math.random().toString(36).slice(2)}`
    ),
    identifier: asString(
      root.identifier,
      `NDMA/SACHET/${Date.now()}`
    ),
    bulletinNo: asString(
      info.parameter?.value || root.identifier,
      root.identifier || "NDMA-CAP-OFFICIAL"
    ),
    sender: asString(
      root.sender,
      "NDMA / SACHET Portal"
    ),
    sourceAgency: asString(
      root.sender,
      "National Disaster Management Authority (NDMA)"
    ),
    helpline: "1070 (SEOC) | 1077 (District Control) | 112",
    officialPortalUrl: "https://sachet.ndma.gov.in",
    liveNewsQuery: `${event} ${asString(area.areaDesc || area["cap:areaDesc"])} alert India`,
    feedOrigin: "NDMA_SACHET_LIVE",
    sent,
    status: asString(root.status, "Actual"),
    msgType: asString(root.msgType, "Alert"),
    source: "NDMA SACHET Public India CAP RSS Feed",
    scope: asString(root.scope, "Public"),
    category: normalizeCategory(rawCategory, event),
    rawCategory,
    event,
    urgency: normalizeUrgencyValue(
      info.urgency || info["cap:urgency"]
    ),
    severity: normalizeSeverityValue(
      info.severity || info["cap:severity"]
    ),
    certainty: normalizeCertaintyValue(
      info.certainty || info["cap:certainty"]
    ),
    headline: asString(
      info.headline || info["cap:headline"],
      event
    ),
    description: asString(
      info.description || info["cap:description"],
      "Active alert from NDMA SACHET."
    ),
    instruction: asString(
      info.instruction || info["cap:instruction"],
      "Follow official instructions from local disaster management authorities."
    ),
    areaDesc: asString(
      area.areaDesc || area["cap:areaDesc"],
      "Designated warning zone"
    ),
    polygon,
    circle,
    centroid,
    state: asString(info.parameter?.state || info.parameter?.STATE) || void 0,
    district: asString(info.parameter?.district || info.parameter?.DISTRICT) || void 0,
    effective,
    expires,
    isExpired: false,
    webUrl: asString(
      info.web || info["cap:web"],
      "https://sachet.ndma.gov.in"
    )
  };
  if (isAlertExpired(alertObj)) return [];
  return [alertObj];
}
function parseCapPayload(rawContent) {
  try {
    if (!rawContent.trim()) return [];
    if (rawContent.trim().startsWith("{") || rawContent.trim().startsWith("[")) {
      return [];
    }
    const parsed = xmlParser.parse(rawContent);
    const roots = [];
    const directAlerts = parsed?.alert || parsed?.["cap:alert"];
    if (directAlerts) {
      roots.push(...asArray(directAlerts));
    }
    const items = asArray(
      parsed?.rss?.channel?.item
    );
    for (const item of items) {
      const nested = item?.alert || item?.["cap:alert"] || item?.Alert;
      if (nested) {
        roots.push(...asArray(nested));
      }
    }
    const results = [];
    for (const root of roots) {
      results.push(...parseCapAlert(root));
    }
    if (results.length === 0) {
      for (const item of items) {
        const title = asString(item.title);
        const description = asString(item.description);
        if (!title && !description) continue;
        const identifier = asString(
          item.guid || item.id || item.link,
          `SACHET-RSS-${Date.now()}-${Math.random().toString(36).slice(2)}`
        );
        const sent = asString(
          item.pubDate,
          (/* @__PURE__ */ new Date()).toISOString()
        );
        const fallbackAlert = {
          id: identifier,
          identifier,
          bulletinNo: identifier,
          sender: asString(
            item.source,
            "NDMA SACHET"
          ),
          sourceAgency: "National Disaster Management Authority (NDMA)",
          helpline: "1070 (SEOC) | 1077 (District Control) | 112",
          officialPortalUrl: "https://sachet.ndma.gov.in",
          liveNewsQuery: `${title || "disaster"} India alert`,
          feedOrigin: "NDMA_SACHET_LIVE",
          sent,
          status: "Actual",
          msgType: "Alert",
          source: "NDMA SACHET Public India CAP RSS Feed",
          scope: "Public",
          category: normalizeCategory(title, title),
          rawCategory: "RSS",
          event: title || "Disaster Warning",
          urgency: "Expected",
          severity: "Moderate",
          certainty: "Possible",
          headline: title || "Official SACHET Alert",
          description: description || "Official alert published through SACHET.",
          instruction: "Follow official instructions from NDMA and local authorities.",
          areaDesc: title || "Designated warning zone",
          centroid: deriveIndicativeCentroid(
            title,
            description,
            asString(item.source)
          ),
          effective: sent,
          expires: new Date(
            new Date(sent).getTime() + 24 * 3600 * 1e3
          ).toISOString(),
          isExpired: false,
          webUrl: asString(
            item.link,
            "https://sachet.ndma.gov.in"
          )
        };
        if (!isAlertExpired(fallbackAlert)) {
          results.push(fallbackAlert);
        }
      }
    }
    const seen = /* @__PURE__ */ new Set();
    return results.filter((alert) => {
      if (seen.has(alert.identifier)) return false;
      seen.add(alert.identifier);
      return true;
    });
  } catch (err) {
    console.error(
      "Error parsing public SACHET CAP/RSS payload:",
      err.message
    );
    return [];
  }
}
async function getSachetAlerts(clientEtag) {
  const now2 = /* @__PURE__ */ new Date();
  const cacheAgeMs = Date.now() - new Date(
    sachetCache.lastUpdated
  ).getTime();
  if (sachetCache.data.length > 0 && cacheAgeMs < 45e3 && clientEtag === sachetCache.etag) {
    const active = sachetCache.data.filter(
      (a) => !isAlertExpired(a, now2)
    );
    return {
      alerts: active,
      etag: sachetCache.etag,
      isModified: false,
      lastUpdated: sachetCache.lastUpdated,
      cacheStatus: "ETAG_CACHED",
      sourceUrl: sachetCache.sourceUrl
    };
  }
  let sachetLiveAlerts = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      1e4
    );
    const response = await fetch(
      PUBLIC_SACHET_FEED_URL,
      {
        method: "GET",
        headers: {
          Accept: "application/rss+xml, application/xml, text/xml, */*",
          "User-Agent": "DisasterAlertPlatform/1.0"
        },
        signal: controller.signal
      }
    ).catch(() => null);
    clearTimeout(timeoutId);
    if (response?.ok) {
      const contentType = (response.headers.get(
        "content-type"
      ) || "").toLowerCase();
      const body = await response.text();
      const looksLikeXml = body.trimStart().startsWith("<?xml") || body.trimStart().startsWith("<rss") || body.trimStart().startsWith("<feed") || body.trimStart().startsWith("<alert") || contentType.includes("xml") || contentType.includes("rss");
      if (!looksLikeXml) {
        throw new Error(
          `SACHET returned a non-XML response. HTTP ${response.status}, content-type=${contentType || "unknown"}`
        );
      }
      sachetLiveAlerts = parseCapPayload(body);
    } else {
      throw new Error(
        `SACHET public feed request failed: HTTP ${response?.status ?? "NO_RESPONSE"}`
      );
    }
  } catch (err) {
    console.error(
      "Public SACHET feed notice:",
      err.message
    );
    sachetLiveAlerts = sachetCache.data.filter(
      (a) => a.feedOrigin === "NDMA_SACHET_LIVE" && !isAlertExpired(a, now2)
    );
  }
  const usgsAlerts = await fetchUSGSIndianEarthquakes();
  const combinedAlerts = [
    ...sachetLiveAlerts,
    ...usgsAlerts
  ];
  const activeAlerts = combinedAlerts.filter(
    (a) => !isAlertExpired(a, now2)
  ).sort(
    (a, b) => new Date(
      b.sent || b.effective
    ).getTime() - new Date(
      a.sent || a.effective
    ).getTime()
  );
  const fingerprint = activeAlerts.map(
    (a) => `${a.identifier}|${a.sent}|${a.effective}|${a.expires}|${a.category}`
  ).sort().join("||");
  let hash = 2166136261;
  for (let i = 0; i < fingerprint.length; i++) {
    hash ^= fingerprint.charCodeAt(i);
    hash = Math.imul(
      hash,
      16777619
    );
  }
  const newEtag = `live-api-feed-${(hash >>> 0).toString(16)}-${activeAlerts.length}`;
  sachetCache = {
    etag: newEtag,
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    data: activeAlerts,
    sourceUrl: PUBLIC_SACHET_FEED_URL,
    liveSourceCount: sachetLiveAlerts.length + usgsAlerts.length
  };
  return {
    alerts: activeAlerts,
    etag: newEtag,
    isModified: clientEtag !== newEtag,
    lastUpdated: sachetCache.lastUpdated,
    cacheStatus: "LIVE_FETCH",
    sourceUrl: PUBLIC_SACHET_FEED_URL
  };
}

// server/googleNews.ts
var import_fast_xml_parser2 = require("fast-xml-parser");

// server/lib/evidenceUtils.ts
function validateAndCleanCitations(text, validSources) {
  if (!text) return "";
  const validIds = new Set(validSources.map((s) => s.id.toUpperCase().trim()));
  const normalizedText = text.replace(/ã€\s*(S\d+)\s*ã€‘/gi, "[$1]").replace(/【\s*(S\d+)\s*】/gi, "[$1]").replace(/［\s*(S\d+)\s*］/gi, "[$1]");
  return normalizedText.replace(/\[(S\d+)\]/gi, (match, citationId) => {
    const upperId = citationId.toUpperCase().trim();
    if (validIds.has(upperId)) {
      return `[${upperId}]`;
    }
    return "";
  });
}
function deduplicateNewsArticles(articles) {
  const seenUrls = /* @__PURE__ */ new Set();
  const seenTitles = /* @__PURE__ */ new Set();
  const results = [];
  for (const article of articles) {
    if (!article.url || !article.title) continue;
    const normUrl = article.url.toLowerCase().replace(/^https?:\/\//, "").replace(/[\?#].*$/, "").replace(/\/+$/, "");
    const normTitle = article.title.toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ").trim();
    if (seenUrls.has(normUrl) || seenTitles.has(normTitle)) {
      continue;
    }
    seenUrls.add(normUrl);
    seenTitles.add(normTitle);
    results.push(article);
  }
  return results;
}
function evaluateTemporalGate(publishedAtStr, now2 = /* @__PURE__ */ new Date(), windowHours = 72) {
  if (!publishedAtStr) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: "recency unverified",
      reason: "Missing published timestamp"
    };
  }
  const pubDate = new Date(publishedAtStr);
  const pubTime = pubDate.getTime();
  const nowTime = now2.getTime();
  if (isNaN(pubTime)) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: "recency unverified",
      reason: "Unparseable date format"
    };
  }
  if (pubTime > nowTime + 15 * 60 * 1e3) {
    return {
      isEligible: false,
      recencyVerified: false,
      relativeTime: "recency unverified",
      reason: "Timestamp is in the future"
    };
  }
  const diffHours = (nowTime - pubTime) / (1e3 * 60 * 60);
  let relativeTime;
  if (diffHours < 1) {
    const mins = Math.max(1, Math.round(diffHours * 60));
    relativeTime = `Published ${mins}m ago`;
  } else if (diffHours < 24) {
    const hrs = Math.round(diffHours);
    relativeTime = `Published ${hrs}h ago`;
  } else {
    const days = Math.round(diffHours / 24);
    relativeTime = `Published ${days}d ago`;
  }
  if (diffHours <= windowHours) {
    return {
      isEligible: true,
      recencyVerified: true,
      relativeTime
    };
  } else {
    return {
      isEligible: false,
      recencyVerified: true,
      relativeTime,
      reason: `Article is older than ${windowHours} hours (${Math.round(diffHours)}h old)`
    };
  }
}
var casualtyContextPattern = /\b(death|deaths|dead|killed|fatalit(?:y|ies)|casualt(?:y|ies)|missing|injured|injur(?:y|ies)|victims?|displaced|evacuat(?:ed|ion)|rescued?|affected)\b/i;
var numericPattern = /\b\d{1,3}(?:,\d{2,3})*(?:\.\d+)?\b/g;
function normalizeNumericClaim(raw) {
  const value = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(value) || value <= 0) return null;
  return Math.round(value);
}
function extractCasualtyNumericClaims(sources) {
  const claims = [];
  for (const source of sources) {
    const text = `${source.title || ""}. ${source.summary || ""}`;
    const matches = Array.from(text.matchAll(numericPattern));
    for (const match of matches) {
      const start = Math.max(0, (match.index || 0) - 120);
      const end = Math.min(text.length, (match.index || 0) + match[0].length + 120);
      const context = text.slice(start, end);
      if (!casualtyContextPattern.test(context)) continue;
      const value = normalizeNumericClaim(match[0]);
      if (value === null) continue;
      const lowerContext = context.toLowerCase();
      const metric = /\b(killed|dead|deaths?|fatalit)/i.test(lowerContext) ? "deaths" : /\binjur/i.test(lowerContext) ? "injured" : /\bmissing\b/i.test(lowerContext) ? "missing" : /\bdisplaced\b/i.test(lowerContext) ? "displaced" : /\bevacuat/i.test(lowerContext) ? "evacuated" : /\brescu/i.test(lowerContext) ? "rescued" : /\baffected\b/i.test(lowerContext) ? "affected" : void 0;
      const qualifier = /\bat least\b/i.test(lowerContext) ? "at least" : /\bmore than\b/i.test(lowerContext) ? "more than" : /\bover\b/i.test(lowerContext) ? "over" : /\baround\b/i.test(lowerContext) ? "around" : /\bnearly\b/i.test(lowerContext) ? "nearly" : "reported";
      claims.push({
        value,
        sourceId: source.id,
        text: context.replace(/\s+/g, " ").trim(),
        metric,
        qualifier
      });
    }
  }
  return claims;
}
function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
function reconcileNumericClaims(values) {
  const claims = values.map((value) => typeof value === "number" ? { value, text: String(value) } : value).filter((claim) => Number.isFinite(claim.value) && claim.value > 0);
  if (!claims.length) {
    return { rangeMin: 0, rangeMax: 0, outliers: [], outlierClaims: [] };
  }
  if (claims.length === 1) {
    return { rangeMin: claims[0].value, rangeMax: claims[0].value, outliers: [], outlierClaims: [] };
  }
  const valuesOnly = claims.map((claim) => claim.value);
  const med = median(valuesOnly);
  const sorted = [...valuesOnly].sort((a, b) => a - b);
  const lower = sorted.slice(0, Math.floor(sorted.length / 2));
  const upper = sorted.slice(Math.ceil(sorted.length / 2));
  const q1 = lower.length ? median(lower) : sorted[0];
  const q3 = upper.length ? median(upper) : sorted[sorted.length - 1];
  const iqr = q3 - q1;
  const outlierClaims = claims.filter((claim) => {
    if (claims.length <= 5 && med > 0 && claim.value >= med * 3) return true;
    if (iqr > 0 && (claim.value < q1 - 1.5 * iqr || claim.value > q3 + 1.5 * iqr)) return true;
    return false;
  });
  const outlierSet = new Set(outlierClaims);
  const clustered = claims.filter((claim) => !outlierSet.has(claim));
  const finalCluster = clustered.length ? clustered : claims;
  const clusterValues = finalCluster.map((claim) => claim.value);
  return {
    rangeMin: Math.min(...clusterValues),
    rangeMax: Math.max(...clusterValues),
    outliers: outlierClaims.map((claim) => claim.value),
    outlierClaims
  };
}
var incidentEvidencePattern = /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|landslide|flood(?:ed)?|cyclone|earthquake|quake|seismic|heatwave|heat wave|district|village|rainfall|warning issued)\b/i;
var hardIncidentPattern = /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|district|village|quake|earthquake)\b/i;
var techAnnouncementPattern = /\b(new\s+(?:app|model|ai|system|tech|device|drone|sensor)\s+(?:to\s+|that\s+|for\s+)?(?:predict|counter|detect|prevent|warn)|launch(?:es|ed)?|unveils?|startup|funding|raises?\s+\$|partnership|research paper|study finds)\b/i;
var passingMentionPattern = /\b(astrologer|actor|film|celebrity|arrest(?:ed)?|politic(?:al|ian)|election|court|interview|opinion|column)\b/i;
var impactFactPattern = /\b(killed|dead|deaths?|fatalit(?:y|ies)|injured|missing|evacuat(?:ed|ion)|rescued?|relief|shelter|ndrf|sdrf|damage(?:d)?|collapsed?|washed away|inundat(?:ed|ion)|district|village|houses?|roads?|bridges?|power|economic|loss|crore)\b/i;
function scoreIncidentEvidence(article) {
  const text = `${article.title || ""}. ${article.summary || ""}`;
  const matches = text.match(new RegExp(incidentEvidencePattern.source, "gi"));
  const keywordScore = matches ? Math.min(matches.length, 5) : 0;
  if (keywordScore === 0) return 0;
  let score = keywordScore;
  if (/\b(19|20)\d{2}\b/.test(text)) score += 1;
  if (techAnnouncementPattern.test(text) && !hardIncidentPattern.test(text)) return 0;
  if (passingMentionPattern.test(text) && !impactFactPattern.test(text)) return 0;
  return score;
}
function filterIncidentEvidenceArticles(articles) {
  return articles.filter((article) => scoreIncidentEvidence(article) > 0);
}
var disasterTerms = /* @__PURE__ */ new Set([
  "cyclone",
  "flood",
  "floods",
  "earthquake",
  "landslide",
  "landslides",
  "disaster",
  "storm",
  "rain",
  "heavy",
  "heat",
  "wave",
  "india",
  "indian",
  "alert",
  "warning",
  "casualties",
  "damage",
  "rescue",
  "relief"
]);
function tokenizeSpecificTerms(value) {
  return value.toLowerCase().replace(/[^\w\s]/g, " ").split(/\s+/).map((term) => term.trim()).filter((term) => term.length >= 4 && !disasterTerms.has(term));
}
function eventYear(value) {
  if (!value) return null;
  return value.match(/\b(19\d\d|20\d\d)\b/)?.[0] || null;
}
function filterSourcesForEvent(articles, context) {
  const eventName = context.eventName.trim().toLowerCase();
  const specificTerms = tokenizeSpecificTerms(context.eventName);
  const requiredYear = eventYear(context.approxDate || context.eventName);
  const state = context.state?.trim().toLowerCase();
  const disasterType = context.disasterType?.trim().toLowerCase();
  return articles.filter((article) => {
    const text = `${article.title || ""}. ${article.summary || ""}`.toLowerCase();
    if (eventName.length >= 4 && text.includes(eventName)) return true;
    const overlap = specificTerms.filter((term) => text.includes(term)).length;
    if (overlap >= 1 && requiredYear && text.includes(requiredYear)) return true;
    if (overlap >= 2) return true;
    const hasState = Boolean(state && text.includes(state));
    const hasType = Boolean(disasterType && text.includes(disasterType));
    const hasYear = Boolean(requiredYear && text.includes(requiredYear));
    return hasState && hasType && hasYear;
  });
}

// server/googleNews.ts
var xmlParser2 = new import_fast_xml_parser2.XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  parseTagValue: true,
  trimValues: true
});
var newsCache = /* @__PURE__ */ new Map();
var NEWS_CACHE_TTL_MS = 5 * 60 * 1e3;
function cleanNewsText(value) {
  return value.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#39;/g, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
function buildSearchPhrase(query, isCurrentNews) {
  const cleanQuery = query.replace(/[^\w\s]/gi, " ").replace(/\s+/g, " ").trim();
  if (!cleanQuery) return isCurrentNews ? "India disaster alert" : "India disaster";
  if (isCurrentNews) return `${cleanQuery} India disaster weather alert`;
  const hasIndia = /\bindia|indian|odisha|kerala|gujarat|bengal|uttarakhand|maharashtra|assam|bihar|tamil|karnataka|andhra|telangana|rajasthan|sikkim|kashmir|ladakh|goa|punjab|haryana|delhi\b/i.test(cleanQuery);
  return hasIndia ? cleanQuery : `${cleanQuery} India`;
}
async function searchGoogleNews(query, options = {}) {
  const { isCurrentNews = false, windowHours = 72, maxResults = 12 } = options;
  const cacheKey = JSON.stringify({
    query: query.trim().toLowerCase(),
    isCurrentNews,
    windowHours,
    maxResults
  });
  const cached = newsCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.articles.slice(0, maxResults);
  }
  const searchPhrase = buildSearchPhrase(query, isCurrentNews);
  const encodedQuery = encodeURIComponent(searchPhrase);
  const rssUrl = `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-IN&gl=IN&ceid=IN:en`;
  const articles = [];
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4e3);
    const response = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      signal: controller.signal
    }).catch(() => null);
    clearTimeout(timeoutId);
    if (response && response.ok) {
      const xmlText = await response.text();
      const parsed = xmlParser2.parse(xmlText);
      const items = parsed?.rss?.channel?.item || parsed?.feed?.entry || [];
      const itemsArray = Array.isArray(items) ? items : [items];
      const now2 = /* @__PURE__ */ new Date();
      for (let i = 0; i < itemsArray.length && articles.length < maxResults; i++) {
        const item = itemsArray[i];
        if (!item || !item.title) continue;
        const rawTitle = String(item.title || "");
        const pubDateStr = String(item.pubDate || item.published || item.updated || "");
        let title = rawTitle;
        let publisher = item.source?.["#text"] || item.source || "National News Media";
        if (typeof publisher === "object") {
          publisher = publisher["#text"] || "Media";
        }
        if (rawTitle.includes(" - ")) {
          const parts = rawTitle.split(" - ");
          if (parts.length > 1) {
            publisher = parts[parts.length - 1].trim();
            title = parts.slice(0, -1).join(" - ").trim();
          }
        }
        const rawDesc = String(item.description || item.summary || "");
        const summary = cleanNewsText(rawDesc) || cleanNewsText(title);
        const gateResult = evaluateTemporalGate(pubDateStr, now2, windowHours);
        if (isCurrentNews && !gateResult.isEligible) {
          continue;
        }
        const validNewsUrl = item.link && item.link.startsWith("http") ? item.link : `https://news.google.com/search?q=${encodeURIComponent(title)}&hl=en-IN&gl=IN&ceid=IN:en`;
        articles.push({
          id: `gn-${Math.random().toString(36).substring(2, 9)}`,
          title,
          summary: summary.length > 280 ? summary.substring(0, 277) + "..." : summary,
          url: validNewsUrl,
          publisher: String(publisher),
          publishedAt: pubDateStr || (/* @__PURE__ */ new Date()).toISOString(),
          relativeTime: gateResult.relativeTime,
          recencyVerified: gateResult.recencyVerified,
          isWithinTemporalGate: gateResult.isEligible,
          query
        });
      }
    }
  } catch (err) {
    console.log("Google News fetch notice:", err.message);
  }
  const deduped = filterIncidentEvidenceArticles(deduplicateNewsArticles(articles)).slice(0, maxResults);
  newsCache.set(cacheKey, {
    expiresAt: Date.now() + NEWS_CACHE_TTL_MS,
    articles: deduped
  });
  return deduped;
}

// server/aiGateway.ts
var evidenceBundleCache = /* @__PURE__ */ new Map();
var EVIDENCE_BUNDLE_CACHE_TTL_MS = 10 * 60 * 1e3;
var RECENT_ARCHIVE_CACHE_TTL_MS = 20 * 60 * 1e3;
var ERA_DISCOVERY_CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1e3;
var INDIAN_STATES = [
  "andaman and nicobar islands",
  "andhra pradesh",
  "arunachal pradesh",
  "assam",
  "bihar",
  "chhattisgarh",
  "goa",
  "gujarat",
  "haryana",
  "himachal pradesh",
  "jharkhand",
  "karnataka",
  "kerala",
  "ladakh",
  "madhya pradesh",
  "maharashtra",
  "manipur",
  "meghalaya",
  "mizoram",
  "nagaland",
  "odisha",
  "punjab",
  "rajasthan",
  "sikkim",
  "tamil nadu",
  "telangana",
  "tripura",
  "uttarakhand",
  "uttar pradesh",
  "west bengal",
  "delhi",
  "jammu and kashmir",
  "puducherry"
];
var NORMALIZATION_REPLACEMENTS = [
  [/\bgujrat\b/gi, "Gujarat"],
  [/\bgujarath\b/gi, "Gujarat"],
  [/\bgujrath\b/gi, "Gujarat"],
  [/\bearthqake\b/gi, "earthquake"],
  [/\bearthquak\b/gi, "earthquake"],
  [/\berthquake\b/gi, "earthquake"],
  [/\bwaynad\b/gi, "Wayanad"],
  [/\bwayanad landslides\b/gi, "Wayanad landslide"],
  [/\bamfan\b/gi, "Cyclone Amphan"],
  [/\bamphan cyclone\b/gi, "Cyclone Amphan"],
  [/\buttrakahand\b/gi, "Uttarakhand"],
  [/\buttrakhand\b/gi, "Uttarakhand"],
  [/\borrisa\b/gi, "Odisha"],
  [/\borissa\b/gi, "Odisha"],
  [/\bkutch quake\b/gi, "Bhuj earthquake"],
  [/\bbhuj quake\b/gi, "Bhuj earthquake"]
];
var KNOWN_EVENT_ALIASES = [
  {
    match: /\b(2001\s+)?(gujarat|bhuj|kutch).*(earthquake|quake)|\b(republic day earthquake)\b/i,
    event: {
      normalizedQuery: "2001 Gujarat earthquake",
      aliases: ["Bhuj earthquake", "Kutch earthquake", "Republic Day earthquake Gujarat 2001"],
      disasterType: "Earthquake",
      location: "Bhuj and Kutch",
      state: "Gujarat",
      year: 2001,
      eventDate: "2001-01-26T00:00:00.000Z",
      confidence: 0.96
    }
  },
  {
    match: /\b(amphan|amfan)\b/i,
    event: {
      normalizedQuery: "Cyclone Amphan",
      aliases: ["2020 Cyclone Amphan", "Amphan West Bengal cyclone"],
      disasterType: "Cyclone",
      location: "West Bengal and Odisha coast",
      state: "West Bengal",
      year: 2020,
      eventDate: "2020-05-20T00:00:00.000Z",
      confidence: 0.95
    }
  },
  {
    match: /\b(wayanad|waynad).*(landslide|landslides)\b/i,
    event: {
      normalizedQuery: "2024 Wayanad landslide",
      aliases: ["Wayanad landslides", "Chooralmala Mundakkai landslide"],
      disasterType: "Landslide",
      location: "Wayanad",
      state: "Kerala",
      year: 2024,
      eventDate: "2024-07-30T00:00:00.000Z",
      confidence: 0.94
    }
  },
  {
    match: /\b(1999\s+)?(odisha|orissa).*(super cyclone|cyclone)\b/i,
    event: {
      normalizedQuery: "1999 Odisha Super Cyclone",
      aliases: ["1999 Orissa cyclone", "Odisha super cyclone"],
      disasterType: "Cyclone",
      location: "Odisha coast",
      state: "Odisha",
      year: 1999,
      eventDate: "1999-10-29T00:00:00.000Z",
      confidence: 0.94
    }
  },
  {
    match: /\b(2018\s+)?kerala.*flood/i,
    event: {
      normalizedQuery: "2018 Kerala floods",
      aliases: ["Kerala floods 2018"],
      disasterType: "Flood",
      location: "Kerala",
      state: "Kerala",
      year: 2018,
      eventDate: "2018-08-15T00:00:00.000Z",
      confidence: 0.9
    }
  }
];
function getGroqBaseUrl() {
  return process.env.GROQ_BASE_URL?.trim() || "https://api.groq.com/openai/v1";
}
function getGroqChatModels() {
  return (process.env.GROQ_MODEL_FALLBACKS || process.env.GROQ_MODEL || "openai/gpt-oss-120b").split(",").map((model) => model.trim()).filter(Boolean);
}
function getGroqSttModel() {
  return process.env.GROQ_STT_MODEL?.trim() || "whisper-large-v3-turbo";
}
function getGroqTtsModel() {
  return process.env.GROQ_TTS_MODEL?.trim() || "canopylabs/orpheus-v1-english";
}
function getGroqTtsVoice() {
  return process.env.GROQ_TTS_VOICE?.trim() || "austin";
}
function isGroqConfigured() {
  keyPool.initialize();
  return keyPool.getHealth().some((entry) => !entry.disabled);
}
var GroqKeyPool = class {
  constructor() {
    this.keys = [];
    this.initialized = false;
    this.maxConcurrency = parseInt(process.env.GROQ_MAX_CONCURRENCY || "8", 10);
    this.perKeyConcurrency = parseInt(process.env.GROQ_PER_KEY_CONCURRENCY || "1", 10);
    this.maxRetries = parseInt(process.env.GROQ_MAX_RETRIES || "3", 10);
  }
  initialize() {
    if (this.initialized) return;
    this.initialized = true;
    const keySet = /* @__PURE__ */ new Set();
    const commaKeys = process.env.GROQ_API_KEYS?.split(",").map((k) => k.trim()).filter(Boolean) || [];
    for (const k of commaKeys) keySet.add(k);
    for (let i = 1; i <= 100; i++) {
      const envName = `GROQ_API_KEY_${String(i).padStart(2, "0")}`;
      const key = process.env[envName]?.trim();
      if (key) keySet.add(key);
    }
    const primary = process.env.GROQ_API_KEY?.trim();
    if (primary) keySet.add(primary);
    this.keys = Array.from(keySet).map((key) => ({
      key,
      healthy: true,
      busy: 0,
      cooldownUntil: 0,
      failures: 0,
      lastUsed: 0,
      disabled: false
    }));
  }
  getTotalBusy() {
    return this.keys.reduce((sum, k) => sum + k.busy, 0);
  }
  acquire() {
    this.initialize();
    const now2 = Date.now();
    if (this.getTotalBusy() >= this.maxConcurrency) {
      const leastBusy = this.keys.filter((k) => !k.disabled && k.healthy && k.cooldownUntil <= now2 && k.busy < this.perKeyConcurrency).sort((a, b) => a.busy - b.busy)[0];
      if (leastBusy) {
        leastBusy.busy++;
        leastBusy.lastUsed = now2;
        return leastBusy.key;
      }
    }
    const available = this.keys.filter((k) => !k.disabled && k.healthy && k.cooldownUntil <= now2 && k.busy < this.perKeyConcurrency).sort((a, b) => a.lastUsed - b.lastUsed);
    if (available.length > 0) {
      const chosen = available[0];
      chosen.busy++;
      chosen.lastUsed = now2;
      return chosen.key;
    }
    const fallback = this.keys.find((k) => !k.disabled && k.healthy);
    if (fallback) {
      fallback.busy++;
      fallback.lastUsed = now2;
      return fallback.key;
    }
    throw new Error("All Groq API keys are exhausted or disabled.");
  }
  release(key) {
    const entry = this.keys.find((k) => k.key === key);
    if (entry) entry.busy = Math.max(0, entry.busy - 1);
  }
  report429(key) {
    const entry = this.keys.find((k) => k.key === key);
    if (!entry) return;
    entry.failures++;
    const cooldownMs = Math.min(3e4, 1e3 * Math.pow(2, entry.failures)) + Math.random() * 1e3;
    entry.cooldownUntil = Date.now() + cooldownMs;
    entry.busy = Math.max(0, entry.busy - 1);
  }
  reportSuccess(key) {
    const entry = this.keys.find((k) => k.key === key);
    if (entry) {
      entry.failures = Math.max(0, entry.failures - 1);
      if (entry.cooldownUntil <= Date.now()) {
        entry.healthy = true;
      }
    }
  }
  reportFailure(key) {
    const entry = this.keys.find((k) => k.key === key);
    if (!entry) return;
    entry.failures++;
    entry.busy = Math.max(0, entry.busy - 1);
    if (entry.failures >= 5) {
      entry.disabled = true;
    }
  }
  getHealth() {
    this.initialize();
    return this.keys.map((k) => ({
      keySuffix: k.key.slice(-6),
      healthy: k.healthy,
      busy: k.busy,
      failures: k.failures,
      disabled: k.disabled
    }));
  }
};
var keyPool = new GroqKeyPool();
function getGroqKey(_scope = "default") {
  return keyPool.acquire();
}
function releaseGroqKey(key) {
  keyPool.release(key);
}
function getKeyPoolHealth() {
  return keyPool.getHealth();
}
function stripCodeFences(text) {
  return text.trim().replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
}
function stripMarkdownForSpeech(text) {
  return text.replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*\]\([^)]+\)/g, " ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\[(S\d+)\]/gi, " ").replace(/[*_`>#-]+/g, " ").replace(/\r?\n+/g, " ").replace(/\s+/g, " ").trim();
}
function sanitizeGeneratedReply(text) {
  return text.replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
function inferDisasterType(text) {
  const lower = text.toLowerCase();
  if (lower.includes("cyclone") || lower.includes("storm")) return "Cyclone";
  if (lower.includes("flood") || lower.includes("inundat") || lower.includes("waterlogging")) return "Flood";
  if (lower.includes("earthquake") || lower.includes("quake") || lower.includes("seismic") || lower.includes("tremor")) return "Earthquake";
  if (lower.includes("landslide") || lower.includes("mudslide") || lower.includes("rockfall")) return "Landslide";
  if (lower.includes("heat wave") || lower.includes("heatwave") || lower.includes("heat")) return "Heat Wave";
  if (lower.includes("thunderstorm")) return "Thunderstorm";
  if (lower.includes("lightning")) return "Lightning";
  if (lower.includes("heavy rain") || lower.includes("rain")) return "Heavy Rain";
  if (lower.includes("forest fire") || lower.includes("wildfire")) return "Forest Fire";
  if (lower.includes("drought")) return "Drought";
  if (lower.includes("avalanche")) return "Avalanche";
  return "General Alert";
}
function inferState(text) {
  const lower = text.toLowerCase();
  for (const state of INDIAN_STATES) {
    if (lower.includes(state)) {
      return state.replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }
  if (lower.includes("odisha") || lower.includes("puri") || lower.includes("bhubaneswar")) return "Odisha";
  if (lower.includes("kerala") || lower.includes("wayanad") || lower.includes("kochi")) return "Kerala";
  if (lower.includes("assam") || lower.includes("guwahati")) return "Assam";
  if (lower.includes("tamil nadu") || lower.includes("chennai")) return "Tamil Nadu";
  if (lower.includes("maharashtra") || lower.includes("mumbai")) return "Maharashtra";
  if (lower.includes("uttarakhand") || lower.includes("dehradun")) return "Uttarakhand";
  if (lower.includes("himachal") || lower.includes("shimla")) return "Himachal Pradesh";
  if (lower.includes("rajasthan") || lower.includes("jaipur")) return "Rajasthan";
  if (lower.includes("gujarat") || lower.includes("ahmedabad")) return "Gujarat";
  if (lower.includes("west bengal") || lower.includes("kolkata")) return "West Bengal";
  if (lower.includes("delhi") || lower.includes("ncr")) return "Delhi";
  return "India";
}
function inferLocation(text, fallbackState) {
  const lower = text.toLowerCase();
  const separators = [",", " - ", " near ", " in "];
  for (const sep of separators) {
    const idx = lower.indexOf(sep);
    if (idx > 0) {
      const raw = text.slice(0, idx).trim();
      if (raw.length >= 3) return raw;
    }
  }
  if (fallbackState !== "India") return fallbackState;
  return "India";
}
function formatCasualtyRange(range) {
  if (!range.rangeMin && !range.rangeMax) return null;
  const base = range.rangeMin === range.rangeMax ? `${range.rangeMin.toLocaleString("en-IN")} reported casualties/deaths in retrieved source claims.` : `${range.rangeMin.toLocaleString("en-IN")}-${range.rangeMax.toLocaleString("en-IN")} reported casualties/deaths across clustered source claims.`;
  if (!range.outliers.length) return base;
  return `${base} Outlier claim(s) ${range.outliers.map((value) => value.toLocaleString("en-IN")).join(", ")} excluded from the range.`;
}
function extractCandidateFacts(sources) {
  const patterns = {
    casualties: /\b(?:\d[\d,]*\s+(?:people\s+)?(?:dead|deaths?|killed|fatalit(?:y|ies)|injured|missing)|(?:dead|deaths?|killed|injured|missing|casualties)[^.;]{0,80}\d[\d,]*)\b/gi,
    damage: /\b(?:₹|rs\.?|inr|crore|lakh|damage(?:d)?|collapsed?|washed away|destroyed|houses?|roads?|bridges?|power|infrastructure)[^.;]{0,140}/gi,
    response: /\b(?:ndrf|sdrf|evacuat(?:ed|ion)|rescued?|relief|shelter|army|navy|air force|government|administration)[^.;]{0,140}/gi,
    location: /\b(?:district|village|state|coast|city|town|taluk|block|panchayat)[^.;]{0,120}/gi,
    dates: /\b(?:(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+(?:19|20)\d{2}|\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19|20)\d{2}|\b(?:19|20)\d{2}\b)/gi
  };
  return Object.fromEntries(Object.entries(patterns).map(([key, pattern]) => [
    key,
    sources.flatMap((source) => {
      const text = `${source.title}. ${source.summary}`;
      return Array.from(text.matchAll(pattern)).map((match) => `[${source.id}] ${match[0].replace(/\s+/g, " ").trim()}`).slice(0, 3);
    }).slice(0, 10)
  ]));
}
function sanitizeUnavailableField(value, facts, fallback) {
  if (facts.length && /information unavailable|not available|not clearly quantified|no .*details/i.test(value)) {
    return `${fallback} ${facts.slice(0, 3).join("; ")}.`;
  }
  return value;
}
function buildNumericRangeObject(range) {
  if (!range.rangeMin && !range.rangeMax) return void 0;
  return {
    min: range.rangeMin,
    max: range.rangeMax,
    outliers: range.outliers,
    outlierSources: range.outlierClaims.map((claim) => ({
      value: claim.value,
      sourceIds: claim.sourceId ? [claim.sourceId] : []
    }))
  };
}
function buildNumericConflictReports(range) {
  return range.outlierClaims.map((claim) => ({
    topic: "Casualty figure outlier",
    details: `${claim.value.toLocaleString("en-IN")} was excluded from the reported casualty range as a statistical outlier${claim.sourceId ? ` [${claim.sourceId}]` : ""}.`,
    sources: claim.sourceId ? [claim.sourceId] : []
  }));
}
function normalizeSynthesizedData(raw, fallbackQuery, sources) {
  const fallback = buildDeterministicFallbackSynthesis(fallbackQuery, sources);
  const data = raw && typeof raw === "object" ? raw : {};
  const textField = (key) => typeof data[key] === "string" && hasMeaningfulText(data[key]) ? cleanEvidenceText(data[key]) : fallback[key];
  return {
    ...fallback,
    ...data,
    eventName: typeof data.eventName === "string" && data.eventName.trim() ? data.eventName.trim() : fallback.eventName,
    disasterType: typeof data.disasterType === "string" && data.disasterType.trim() ? data.disasterType.trim() : fallback.disasterType,
    location: typeof data.location === "string" && data.location.trim() ? data.location.trim() : fallback.location,
    state: typeof data.state === "string" && data.state.trim() ? data.state.trim() : fallback.state,
    country: "India",
    dateRange: typeof data.dateRange === "string" && data.dateRange.trim() ? data.dateRange.trim() : fallback.dateRange,
    eventDate: coerceIsoDate(data.eventDate || data.approxDate || data.dateRange),
    reportedCasualties: textField("reportedCasualties"),
    reportedDamage: textField("reportedDamage"),
    whatHappened: textField("whatHappened"),
    affectedAreas: textField("affectedAreas"),
    humanImpact: textField("humanImpact"),
    infrastructureDamage: textField("infrastructureDamage"),
    economicImpact: textField("economicImpact"),
    governmentResponse: textField("governmentResponse"),
    rescueRelief: textField("rescueRelief"),
    recovery: textField("recovery"),
    sourceAssessment: textField("sourceAssessment"),
    conflictingReports: Array.isArray(data.conflictingReports) ? data.conflictingReports : [],
    timeline: Array.isArray(data.timeline) ? data.timeline : []
  };
}
function toBase64(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Buffer.from(bytes).toString("base64");
}
async function groqChatCompletion(params) {
  const models = [params.model, ...getGroqChatModels()].filter(Boolean);
  let lastError = null;
  for (let attempt = 0; attempt < keyPool["maxRetries"]; attempt++) {
    let apiKey;
    try {
      apiKey = getGroqKey(params.keyScope || "default");
    } catch (err) {
      throw err;
    }
    for (const model of models) {
      try {
        const baseUrl = getGroqBaseUrl();
        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model,
            messages: params.messages,
            temperature: params.temperature ?? 0.2,
            ...params.maxTokens ? { max_completion_tokens: params.maxTokens } : {}
          })
        });
        if (response.status === 429) {
          keyPool.report429(apiKey);
          lastError = new Error(`Rate limited on ${model}`);
          break;
        }
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          throw new Error(`Groq chat completion failed for ${model}: HTTP ${response.status} ${text}`.trim());
        }
        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;
        if (typeof content === "string" && content.trim()) {
          keyPool.reportSuccess(apiKey);
          releaseGroqKey(apiKey);
          return content.trim();
        }
        throw new Error(`Groq chat completion returned an empty response for ${model}.`);
      } catch (error) {
        lastError = error;
        keyPool.reportFailure(apiKey);
      }
    }
  }
  throw lastError || new Error("Groq chat completion failed after all retries.");
}
function mimeToExt(mime) {
  const base = mime.split(";")[0].trim().toLowerCase();
  const map = {
    "audio/webm": "webm",
    "audio/mp4": "mp4",
    "audio/mpeg": "mp3",
    "audio/ogg": "ogg",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/flac": "flac",
    "audio/m4a": "m4a"
  };
  return map[base] || "webm";
}
async function transcribeAudio(audio, mimeType = "audio/webm") {
  const apiKey = getGroqKey("stt");
  const baseUrl = getGroqBaseUrl();
  const sttModel = getGroqSttModel();
  const audioBuffer = Buffer.isBuffer(audio) ? audio : Buffer.from(audio.replace(/^data:[^;]+;base64,/, ""), "base64");
  const form = new FormData();
  const normalizedMime = mimeType.split(";")[0] || "audio/webm";
  form.append("file", new Blob([audioBuffer], { type: normalizedMime }), `audio.${mimeToExt(mimeType)}`);
  form.append("model", sttModel);
  form.append("response_format", "json");
  form.append("temperature", "0");
  form.append(
    "prompt",
    "Transcribe the spoken English disaster query accurately. Return only the transcription text."
  );
  const response = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: form
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Groq transcription failed: HTTP ${response.status} ${text}`.trim());
  }
  const data = await response.json();
  return { text: String(data?.text || "").trim() };
}
async function generateWithFallback(params) {
  try {
    return await groqChatCompletion({
      messages: [
        ...params.systemInstruction ? [{ role: "system", content: params.systemInstruction }] : [],
        { role: "user", content: params.prompt }
      ],
      temperature: params.responseMimeType === "application/json" ? 0.1 : 0.2,
      keyScope: params.keyScope
    });
  } catch (error) {
    console.warn("Groq generation failed:", error.message);
    return null;
  }
}
async function normalizeDisasterSearchQuery(query) {
  const raw = await generateWithFallback({
    keyScope: "past",
    systemInstruction: "Correct Indian disaster event search phrases. Return only the corrected search phrase, with no commentary.",
    prompt: `The user is searching for an Indian disaster event. Correct spelling or typo errors to the most likely real event/location name. If it is already correct, return the original phrase.

Query: ${query}`
  });
  const normalized = raw?.replace(/^["']|["']$/g, "").replace(/\s+/g, " ").trim();
  if (!normalized || normalized.toLowerCase() === query.toLowerCase()) return null;
  return normalized;
}
function cleanEvidenceText(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&#39;/g, "'").replace(/&quot;/gi, '"').replace(/\s+/g, " ").trim();
}
function applyDeterministicNormalization(query) {
  return NORMALIZATION_REPLACEMENTS.reduce(
    (value, [pattern, replacement]) => value.replace(pattern, replacement),
    query.replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim()
  ).replace(/\s+/g, " ").trim();
}
function normalizeHistoricalEventQuery(query) {
  const originalQuery = query.trim();
  const corrected = applyDeterministicNormalization(originalQuery);
  for (const alias of KNOWN_EVENT_ALIASES) {
    if (alias.match.test(corrected)) {
      return { originalQuery, ...alias.event };
    }
  }
  const year = corrected.match(/\b(19\d\d|20\d\d)\b/)?.[0];
  const disasterType = inferDisasterType(corrected);
  const state = inferState(corrected);
  const normalizedQuery = corrected.replace(/\bfloods\b/gi, "flood").replace(/\blandslides\b/gi, "landslide").replace(/\s+/g, " ").trim();
  return {
    originalQuery,
    normalizedQuery,
    aliases: normalizedQuery.toLowerCase() === originalQuery.toLowerCase() ? [] : [originalQuery],
    disasterType,
    location: inferLocation(normalizedQuery, state),
    state,
    year: year ? Number(year) : void 0,
    eventDate: coerceIsoDate(normalizedQuery),
    confidence: normalizedQuery === originalQuery ? 0.72 : 0.84
  };
}
function buildHistoricalResearchQueries(event, categoryFilter, stateFilter) {
  const base = event.normalizedQuery || event.originalQuery;
  const location = stateFilter || event.state || event.location || "";
  const type = categoryFilter || event.disasterType || "";
  const year = event.year ? String(event.year) : "";
  const aliases = [base, ...event.aliases].filter(Boolean);
  const dimensions = [
    "",
    "India",
    "what happened history impact",
    "casualties deaths injured missing",
    "affected districts villages towns",
    "houses damaged infrastructure roads bridges power",
    "economic loss damage estimate",
    "rescue relief evacuation government response",
    "timeline aftermath recovery reconstruction",
    "official report"
  ];
  const queries = aliases.flatMap(
    (alias) => dimensions.map((dimension) => [alias, year && !alias.includes(year) ? year : "", location, type, dimension].filter(Boolean).join(" ").replace(/\s+/g, " ").trim())
  );
  return Array.from(new Set(queries)).slice(0, 18);
}
function publisherKey(source) {
  return source.publisher.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim() || "unknown";
}
function hasMeaningfulText(value) {
  if (!value) return false;
  const normalized = cleanEvidenceText(value).toLowerCase();
  if (normalized.length < 24) return false;
  const placeholders = [
    "information unavailable",
    "no information available",
    "details were not clearly quantified",
    "details were referenced",
    "were referenced in the retrieved source coverage",
    "were summarized in the retrieved source coverage",
    "requires external archival corroboration",
    "documented in source coverage",
    "documented in cited journalism",
    "state disaster management authority and ndrf mobilization recorded",
    "shelter operations, dry food packets, and medical deployment",
    "long-term rehabilitation and infrastructure reconstruction initiatives"
  ];
  if (placeholders.some((phrase) => normalized.includes(phrase))) return false;
  return /[a-z]/i.test(normalized.replace(/\[S\d+\]/gi, ""));
}
function extractBestFact(sources, topic, fallback = "") {
  const facts = extractCandidateFacts(sources)[topic] || [];
  return facts.length ? facts.slice(0, 3).join("; ") + "." : fallback;
}
function buildEvidenceCoverage(bundle) {
  const sourceText = bundle.sources.map((s) => `${s.title} ${s.summary}`).join(" ");
  const distinctPublisherCount = new Set(bundle.sources.map(publisherKey)).size;
  const eventConfirmed = bundle.sources.some((source) => scoreIncidentEvidence(source) >= 2);
  const casualtyData = hasMeaningfulText(bundle.reportedCasualties) || /killed|dead|death|fatalit|injured|missing/i.test(sourceText);
  const infrastructureDamage = hasMeaningfulText(bundle.infrastructureDamage) || /damage|destroyed|collapsed|washed away|houses?|roads?|bridges?|power|infrastructure/i.test(sourceText);
  const economicImpact = hasMeaningfulText(bundle.economicImpact) || /(?:rs\.?|inr|crore|lakh|economic|loss|crop|agriculture)/i.test(sourceText);
  const governmentResponse = hasMeaningfulText(bundle.governmentResponse) || /\bgovernment|ndrf|sdrf|army|navy|administration|evacuat/i.test(sourceText);
  const rescueRelief = hasMeaningfulText(bundle.rescueRelief) || /\brescue|relief|shelter|food|medicine|camp/i.test(sourceText);
  const recovery = hasMeaningfulText(bundle.recovery) || /\brecovery|reconstruction|rehabilitation|restoration|aftermath/i.test(sourceText);
  const meaningfulTimelineEntries = (bundle.timeline || []).filter(
    (step) => hasMeaningfulText(step.event) && hasMeaningfulText(step.description) && !/published|article|source|headline/i.test(`${step.event} ${step.description}`)
  ).length;
  const impactDimensions = [
    casualtyData,
    infrastructureDamage,
    economicImpact,
    governmentResponse,
    rescueRelief,
    recovery,
    hasMeaningfulText(bundle.affectedAreas)
  ].filter(Boolean).length;
  const sourceRelevanceScore = bundle.sources.length ? bundle.sources.reduce((sum, source) => sum + scoreIncidentEvidence(source), 0) / bundle.sources.length : 0;
  const evidenceDepthScore = impactDimensions + meaningfulTimelineEntries + (hasMeaningfulText(bundle.whatHappened) ? 1 : 0);
  const overallQualityScore = sourceRelevanceScore + evidenceDepthScore + Math.min(distinctPublisherCount, 3);
  const qualifies = eventConfirmed && Boolean(bundle.eventDate || /\b(19\d\d|20\d\d)\b/.test(bundle.dateRange || bundle.eventName)) && bundle.location !== "India" && hasMeaningfulText(bundle.whatHappened) && impactDimensions >= 1 && meaningfulTimelineEntries >= 1 && (bundle.sources.length >= 2 || bundle.sources.length === 1 && sourceRelevanceScore >= 4 && impactDimensions >= 2);
  return {
    eventConfirmed,
    eventNameConfidence: eventConfirmed ? 0.85 : 0.25,
    relevantSourceCount: bundle.sources.length,
    distinctPublisherCount,
    overview: hasMeaningfulText(bundle.whatHappened),
    eventDate: Boolean(bundle.eventDate || /\b(19\d\d|20\d\d)\b/.test(bundle.dateRange || bundle.eventName)),
    location: bundle.location !== "India",
    affectedAreas: hasMeaningfulText(bundle.affectedAreas),
    casualtyData,
    injuryData: /\binjur/i.test(`${bundle.reportedCasualties} ${bundle.humanImpact} ${sourceText}`),
    displacementData: /\bdisplaced|evacuat/i.test(`${bundle.humanImpact} ${sourceText}`),
    infrastructureDamage,
    economicImpact,
    governmentResponse,
    rescueRelief,
    recovery,
    meaningfulTimelineEntries,
    sourceRelevanceScore,
    evidenceDepthScore,
    overallQualityScore,
    qualifies
  };
}
function evidenceStatusFromCoverage(coverage) {
  if (coverage.qualifies && coverage.relevantSourceCount >= 4 && coverage.distinctPublisherCount >= 3 && coverage.meaningfulTimelineEntries >= 2 && coverage.evidenceDepthScore >= 5) return "High Confidence";
  if (coverage.qualifies && coverage.relevantSourceCount >= 2 && coverage.distinctPublisherCount >= 2) return "Moderate Evidence";
  return "Limited Coverage";
}
function makeEvidenceTimeline(sources, eventDate) {
  const datePattern = /\b(?:\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19|20)\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+(?:19|20)\d{2}|\d{4}-\d{2}-\d{2})\b/gi;
  const steps = [];
  const seen = /* @__PURE__ */ new Set();
  for (const source of sources) {
    const text = cleanEvidenceText(`${source.title}. ${source.summary}`);
    const dates = Array.from(text.matchAll(datePattern)).map((match) => match[0]);
    const selectedDate = dates[0] || (eventDate ? formatDisasterDate(eventDate) : "");
    if (!selectedDate) continue;
    const sentence = text.split(/(?<=[.!?])\s+/).find((part) => part.includes(dates[0] || "")) || text;
    const title = sentence.slice(0, 72).replace(/\s+\S*$/, "").trim() || source.title;
    const key = `${selectedDate}|${title.toLowerCase()}`;
    if (seen.has(key) || /published|article/i.test(sentence)) continue;
    seen.add(key);
    steps.push({
      date: selectedDate,
      event: title,
      description: `${sentence} [${source.id}]`,
      citations: [source.id]
    });
  }
  if (!steps.length && eventDate && sources[0]) {
    steps.push({
      date: formatDisasterDate(eventDate),
      event: "Documented disaster occurrence",
      description: `${cleanEvidenceText(sources[0].summary || sources[0].title)} [${sources[0].id}]`,
      citations: [sources[0].id]
    });
  }
  return steps.slice(0, 6);
}
async function buildHistoricalEvidenceBundle(userQuery, categoryFilter, stateFilter) {
  const baseQuery = userQuery.trim();
  let normalizedEvent = normalizeHistoricalEventQuery(baseQuery);
  const cacheKey = JSON.stringify({
    baseQuery: baseQuery.toLowerCase(),
    normalizedQuery: normalizedEvent.normalizedQuery.toLowerCase(),
    categoryFilter: categoryFilter || "",
    stateFilter: stateFilter || ""
  });
  const cached = evidenceBundleCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.bundle;
  }
  let searchQueries = buildHistoricalResearchQueries(normalizedEvent, categoryFilter, stateFilter);
  const allArticles = [];
  for (const q of searchQueries) {
    const res = await searchGoogleNews(q, { isCurrentNews: false, maxResults: 6 });
    allArticles.push(...res);
  }
  let eventFilterQuery = normalizedEvent.normalizedQuery;
  if (allArticles.length < 2) {
    const normalizedQuery = await normalizeDisasterSearchQuery(baseQuery);
    if (normalizedQuery) {
      normalizedEvent = normalizeHistoricalEventQuery(normalizedQuery);
      eventFilterQuery = normalizedQuery;
      const expandedQueries = buildHistoricalResearchQueries(normalizedEvent, categoryFilter, stateFilter);
      searchQueries = Array.from(/* @__PURE__ */ new Set([...searchQueries, ...expandedQueries]));
      for (const q of expandedQueries) {
        const res = await searchGoogleNews(q, { isCurrentNews: false, maxResults: 6 });
        allArticles.push(...res);
      }
    }
  }
  const incidentArticles = filterIncidentEvidenceArticles(deduplicateNewsArticles(allArticles));
  let sourcesList = filterSourcesForEvent(incidentArticles, {
    eventName: eventFilterQuery,
    disasterType: categoryFilter || normalizedEvent.disasterType || inferDisasterType(baseQuery),
    state: stateFilter || normalizedEvent.state || inferState(baseQuery),
    approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || eventFilterQuery)
  }).sort((a, b) => scoreIncidentEvidence(b) - scoreIncidentEvidence(a)).slice(0, 10);
  if (!sourcesList.length) {
    const normalizedQuery = await normalizeDisasterSearchQuery(baseQuery);
    if (normalizedQuery) {
      normalizedEvent = normalizeHistoricalEventQuery(normalizedQuery);
      eventFilterQuery = normalizedEvent.normalizedQuery;
      const correctedArticles = [];
      const correctedQueries = buildHistoricalResearchQueries(normalizedEvent, categoryFilter, stateFilter);
      for (const q of correctedQueries) {
        const res = await searchGoogleNews(q, { isCurrentNews: false, maxResults: 6 });
        correctedArticles.push(...res);
      }
      searchQueries = Array.from(/* @__PURE__ */ new Set([...searchQueries, ...correctedQueries]));
      sourcesList = filterSourcesForEvent(filterIncidentEvidenceArticles(correctedArticles), {
        eventName: normalizedEvent.normalizedQuery,
        disasterType: categoryFilter || normalizedEvent.disasterType || inferDisasterType(normalizedQuery),
        state: stateFilter || normalizedEvent.state || inferState(normalizedQuery),
        approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || normalizedQuery)
      }).slice(0, 10);
    }
  }
  if (!sourcesList.length) {
    throw new Error("No live Google News sources were found for this query.");
  }
  const citedSources = sourcesList.map((art, idx) => ({
    id: `S${idx + 1}`,
    title: cleanEvidenceText(art.title),
    publisher: art.publisher,
    publishedAt: art.publishedAt,
    url: art.url,
    summary: cleanEvidenceText(art.summary),
    qualityScore: Math.max(20, 95 - idx * 4)
  }));
  const sourcesText = citedSources.map((s) => `[${s.id}] Title: ${s.title}
Publisher: ${s.publisher} (${s.publishedAt})
Summary: ${s.summary}
URL: ${s.url}`).join("\n\n");
  const casualtyReconciliation = reconcileNumericClaims(extractCasualtyNumericClaims(citedSources));
  const casualtyRangeText = formatCasualtyRange(casualtyReconciliation);
  const candidateFacts = extractCandidateFacts(citedSources);
  const factsText = Object.entries(candidateFacts).map(([topic, facts]) => `${topic}: ${facts.length ? facts.join(" | ") : "none extracted"}`).join("\n");
  const systemInstruction = `You are a Senior Disaster Intelligence Research Architect.
Synthesize the provided disaster evidence strictly using the source documents labeled [S1], [S2], etc.
ABSOLUTE RULES:
1. Every factual statement MUST cite its source using [S1], [S2], etc.
2. NEVER invent casualty numbers, dates, locations, or source IDs.
3. If information is not provided in the sources, return an empty string for that field.
4. If sources conflict on numbers/facts, prefer a compact range when the values cluster closely (for example, 23-25). If one value is a clear outlier, do not merge it into the range; report it separately in conflictingReports and explain the likely reason for the spread.
5. Do not use article publication dates as incident chronology or event dates.
6. Timeline entries must describe disaster milestones, not source publication events.
7. Return JSON matching the requested schema.`;
  const prompt = `User Query: "${baseQuery}"
Category Filter: ${categoryFilter || "None"}
State Filter: ${stateFilter || "None"}
Retrieved Sources:
${sourcesText}
Per-source candidate facts extracted before synthesis:
${factsText}
Pre-computed casualty reconciliation:
${casualtyRangeText || "No casualty/death numeric claims were confidently extracted from the source text."}

Produce a structured historical evidence synthesis in JSON format:
{
  "eventName": "Clear event name",
  "disasterType": "Cyclone | Flood | Earthquake | Landslide | Heavy Rain | Heat Wave | General Alert",
  "location": "Affected City/District",
  "state": "State name",
  "country": "India",
  "eventDate": "ISO 8601 event date if the event occurrence date is supported by the sources",
  "dateRange": "Date or range",
  "reportedCasualties": "Reported human loss with citations",
  "reportedDamage": "Summary of infrastructure and economic loss with citations",
  "whatHappened": "3-5 factual sentences synthesizing the event with citations",
  "affectedAreas": "3-5 factual sentences on districts and communities impacted with citations",
  "humanImpact": "3-5 factual sentences on displacement, casualties, injuries, and missing people with citations",
  "infrastructureDamage": "3-5 factual sentences on power, roads, telecommunications, housing, and public infrastructure with citations",
  "economicImpact": "3-5 factual sentences on agricultural, business, and monetary loss with citations",
  "governmentResponse": "3-5 factual sentences on evacuation operations, declarations, deployments, and administration with citations",
  "rescueRelief": "3-5 factual sentences on shelters, ration distribution, medical aid, and rescue operations with citations",
  "recovery": "3-5 factual sentences on reconstruction, utility restoration, rehabilitation, and longer-term rebuilding with citations",
  "sourceAssessment": "Objective assessment of source reliability and coverage completeness",
  "conflictingReports": [{"topic": "Topic", "details": "Conflict summary", "sources": ["S1", "S2"]}],
  "timeline": [{"date": "Date string", "event": "Short title", "description": "Description with citations", "citations": ["S1"]}]
}`;
  const depthInstruction = `Write substantive narrative only where the evidence supports it. Do not output one-line placeholders, generic response claims, or boilerplate when source material lacks facts for that section.`;
  let synthesizedData = null;
  try {
    const rawJson = await generateWithFallback({
      prompt,
      systemInstruction: `${systemInstruction}
${depthInstruction}`,
      responseMimeType: "application/json",
      keyScope: categoryFilter || stateFilter ? "pastFilters" : "past"
    });
    if (rawJson) {
      synthesizedData = normalizeSynthesizedData(JSON.parse(stripCodeFences(rawJson)), baseQuery, citedSources);
    }
  } catch (err) {
    console.warn("Groq synthesis parse failure:", err.message);
  }
  if (!synthesizedData) {
    synthesizedData = normalizeSynthesizedData(buildDeterministicFallbackSynthesis(baseQuery, citedSources), baseQuery, citedSources);
  }
  const whatHappened = validateAndCleanCitations(synthesizedData.whatHappened || "", citedSources);
  const affectedAreas = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.affectedAreas || "", candidateFacts.location, "Affected locations extracted from sources:"), citedSources);
  const humanImpact = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.humanImpact || "", candidateFacts.casualties, "Human-impact facts extracted from sources:"), citedSources);
  const infrastructureDamage = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.infrastructureDamage || "", candidateFacts.damage, "Damage facts extracted from sources:"), citedSources);
  const economicImpact = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.economicImpact || "", candidateFacts.damage, "Economic or damage facts extracted from sources:"), citedSources);
  const governmentResponse = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.governmentResponse || "", candidateFacts.response, "Response facts extracted from sources:"), citedSources);
  const rescueRelief = validateAndCleanCitations(sanitizeUnavailableField(synthesizedData.rescueRelief || "", candidateFacts.response, "Rescue and relief facts extracted from sources:"), citedSources);
  const recovery = validateAndCleanCitations(synthesizedData.recovery || "", citedSources);
  const reportedCasualties = validateAndCleanCitations(
    casualtyRangeText || synthesizedData.reportedCasualties || "",
    citedSources
  );
  const reportedDamage = validateAndCleanCitations(synthesizedData.reportedDamage || "", citedSources);
  const cleanTimeline = (synthesizedData.timeline || []).map((t) => ({
    date: t.date || "Recorded Period",
    event: t.event || "Incident Milestone",
    description: validateAndCleanCitations(t.description || "", citedSources),
    citations: (t.citations || []).filter((c) => citedSources.some((s) => s.id === c))
  }));
  const cleanConflicts = [
    ...buildNumericConflictReports(casualtyReconciliation),
    ...(synthesizedData.conflictingReports || []).map((c) => ({
      topic: c.topic || "Reported Figures",
      details: validateAndCleanCitations(c.details || "", citedSources),
      sources: (c.sources || []).filter((sId) => citedSources.some((s) => s.id === sId))
    }))
  ];
  const eventDate = normalizedEvent.eventDate || coerceIsoDate(synthesizedData.eventDate || synthesizedData.dateRange) || coerceIsoDate([eventFilterQuery, ...candidateFacts.dates].join(" "));
  const evidenceTimeline = makeEvidenceTimeline(citedSources, eventDate);
  const draftBundle = {
    id: `ev-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    eventName: synthesizedData.eventName || normalizedEvent.normalizedQuery || baseQuery,
    disasterType: synthesizedData.disasterType || normalizedEvent.disasterType || inferDisasterType(eventFilterQuery),
    location: synthesizedData.location || normalizedEvent.location || "India",
    state: synthesizedData.state || normalizedEvent.state || "India",
    country: "India",
    eventDate,
    dateRange: eventDate ? formatDisasterDate(eventDate) : synthesizedData.dateRange || "Documented Occurrence",
    numericCasualtiesRange: buildNumericRangeObject(casualtyReconciliation),
    reportedCasualties: reportedCasualties || "",
    reportedDamage: reportedDamage || extractBestFact(citedSources, "damage"),
    sources: citedSources,
    timeline: cleanTimeline.length > 0 ? cleanTimeline : evidenceTimeline,
    whatHappened: whatHappened || `${citedSources[0].summary} [${citedSources[0].id}]`,
    affectedAreas: affectedAreas || extractBestFact(citedSources, "location"),
    humanImpact: humanImpact || (casualtyRangeText ? `${casualtyRangeText} [${citedSources[0].id}]` : extractBestFact(citedSources, "casualties")),
    infrastructureDamage: infrastructureDamage || extractBestFact(citedSources, "damage"),
    economicImpact: economicImpact || "",
    governmentResponse: governmentResponse || "",
    rescueRelief: rescueRelief || "",
    recovery: recovery || "",
    sourceAssessment: synthesizedData.sourceAssessment || `Retrieved ${citedSources.length} relevant source${citedSources.length === 1 ? "" : "s"} from ${new Set(citedSources.map(publisherKey)).size} publisher${new Set(citedSources.map(publisherKey)).size === 1 ? "" : "s"}.`,
    conflictingReports: cleanConflicts,
    synthesizedAt: (/* @__PURE__ */ new Date()).toISOString(),
    evidenceStatus: "Limited Coverage",
    retrievalMetadata: {
      queriesExecuted: searchQueries,
      rawSourcesCount: allArticles.length,
      dedupedSourcesCount: citedSources.length
    }
  };
  const coverage = buildEvidenceCoverage(draftBundle);
  if (!coverage.qualifies) {
    throw new Error("Insufficient relevant historical evidence was retrieved to build a reliable dossier for this event.");
  }
  const bundle = {
    ...draftBundle,
    evidenceStatus: evidenceStatusFromCoverage(coverage),
    sourceAssessment: draftBundle.sourceAssessment ? `${draftBundle.sourceAssessment} Coverage: ${coverage.relevantSourceCount} relevant source(s), ${coverage.distinctPublisherCount} distinct publisher(s), ${coverage.meaningfulTimelineEntries} incident timeline milestone(s).` : ""
  };
  evidenceBundleCache.set(cacheKey, {
    expiresAt: Date.now() + EVIDENCE_BUNDLE_CACHE_TTL_MS,
    bundle
  });
  return bundle;
}
function buildDeterministicFallbackSynthesis(query, sources) {
  const qLower = query.toLowerCase();
  let type = "General Alert";
  if (qLower.includes("cyclon") || qLower.includes("fani") || qLower.includes("amphan")) type = "Cyclone";
  else if (qLower.includes("flood") || qLower.includes("kerala")) type = "Flood";
  else if (qLower.includes("earthquake") || qLower.includes("quake")) type = "Earthquake";
  else if (qLower.includes("landslide")) type = "Landslide";
  const facts = extractCandidateFacts(sources);
  const sourceSummary = sources.length ? sources.slice(0, 3).map((s) => `${cleanEvidenceText(s.summary || s.title)} [${s.id}]`).join(" ") : "";
  return {
    eventName: query,
    disasterType: type,
    location: inferLocation(query, inferState(query)),
    state: inferState(query),
    country: "India",
    dateRange: coerceIsoDate(query) ? formatDisasterDate(coerceIsoDate(query)) : "Documented Occurrence",
    eventDate: coerceIsoDate(query),
    reportedCasualties: "",
    reportedDamage: facts.damage?.slice(0, 3).join("; ") || "",
    whatHappened: sourceSummary,
    affectedAreas: facts.location?.slice(0, 3).join("; ") || "",
    humanImpact: facts.casualties?.slice(0, 3).join("; ") || "",
    infrastructureDamage: facts.damage?.slice(0, 3).join("; ") || "",
    economicImpact: "",
    governmentResponse: facts.response?.slice(0, 3).join("; ") || "",
    rescueRelief: facts.response?.slice(0, 3).join("; ") || "",
    recovery: "",
    sourceAssessment: sources.length ? `Retrieved ${sources.length} source(s); automated synthesis was unavailable, so only extracted source fragments are shown.` : "",
    conflictingReports: [],
    timeline: makeEvidenceTimeline(sources, coerceIsoDate(query))
  };
}
async function compareDisasterEvents(bundles) {
  const comparisonPoints = [
    {
      category: "Overview",
      label: "Disaster Type & Location",
      values: bundles.map((b) => ({
        eventId: b.id,
        value: `${b.disasterType} in ${b.location}, ${b.state} (${b.dateRange})`,
        citations: b.sources.slice(0, 1).map((s) => s.id)
      }))
    },
    {
      category: "Human Impact",
      label: "Casualties & Evacuation",
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.reportedCasualties || b.humanImpact.slice(0, 150),
        citations: b.sources.slice(0, 2).map((s) => s.id)
      }))
    },
    {
      category: "Damage",
      label: "Infrastructure & Economic Loss",
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.reportedDamage || b.infrastructureDamage.slice(0, 150),
        citations: b.sources.slice(0, 2).map((s) => s.id)
      }))
    },
    {
      category: "Response",
      label: "Government & Relief Response",
      values: bundles.map((b) => ({
        eventId: b.id,
        value: b.governmentResponse.slice(0, 150) || "State Disaster Management response",
        citations: b.sources.slice(0, 1).map((s) => s.id)
      }))
    }
  ];
  const prompt = `Compare the following ${bundles.length} historical disaster events based solely on their evidence:
${bundles.map(
    (b, i) => `Event ${i + 1}: ${b.eventName} (${b.disasterType}, ${b.location})
Impact: ${b.humanImpact}
Damage: ${b.infrastructureDamage}
Response: ${b.governmentResponse}
Sources: ${b.sources.map((s) => `[${s.id}] ${s.title}`).join(", ")}`
  ).join("\n\n")}

Analyze:
1. Which event had broader human/infrastructure impact?
2. How did government and rescue responses differ?
3. What key disaster preparedness lessons emerge across these events?
When sources disagree on a numeric fact, prefer a range if the values are tightly clustered and call out outliers separately.
Return JSON:
{
  "broaderImpact": "text with citations like [S1]",
  "responseDifferences": "text with citations",
  "crossEventLessons": "text with citations"
}`;
  let aiSynthesis = {
    broaderImpact: `Comparative impact analysis between ${bundles.map((b) => b.eventName).join(" and ")}.`,
    responseDifferences: `Early warning dissemination and evacuation preparedness differed based on lead time and terrain.`,
    crossEventLessons: `Key lessons include robust shelter networks, redundant communications, and staged evacuation planning.`,
    citations: bundles.flatMap((b) => b.sources.slice(0, 1).map((s) => s.id))
  };
  try {
    const raw = await generateWithFallback({
      prompt,
      responseMimeType: "application/json",
      systemInstruction: "You are an objective disaster risk comparison analyst. Reference sources like [S1], [S2].",
      keyScope: "past"
    });
    if (raw) {
      const parsed = JSON.parse(stripCodeFences(raw));
      const allSources = bundles.flatMap((b) => b.sources);
      aiSynthesis = {
        broaderImpact: validateAndCleanCitations(parsed.broaderImpact || aiSynthesis.broaderImpact, allSources),
        responseDifferences: validateAndCleanCitations(parsed.responseDifferences || aiSynthesis.responseDifferences, allSources),
        crossEventLessons: validateAndCleanCitations(parsed.crossEventLessons || aiSynthesis.crossEventLessons, allSources),
        citations: allSources.slice(0, 4).map((s) => s.id)
      };
    }
  } catch (error) {
    console.log("Groq comparison synthesis fallback:", error.message);
  }
  return { comparisonPoints, aiSynthesis };
}
async function chatResearchAssistant(params) {
  const { message, history, associatedBundle } = params;
  const englishMessage = message;
  let evidenceSources = [];
  let contextText = "";
  if (associatedBundle) {
    evidenceSources = associatedBundle.sources;
    const associatedEvent = normalizeHistoricalEventQuery(`${associatedBundle.eventName} ${associatedBundle.eventDate || associatedBundle.dateRange}`);
    const targetedQueries = buildHistoricalResearchQueries(associatedEvent, associatedBundle.disasterType, associatedBundle.state).filter((query) => {
      const q = query.toLowerCase();
      const msg = englishMessage.toLowerCase();
      if (/death|died|killed|casualt|injur|missing/.test(msg)) return /casualt|death|injur|missing/.test(q);
      if (/house|damage|loss|road|bridge|power|infrastructure|crop|economic/.test(msg)) return /damage|economic|houses|infrastructure/.test(q);
      if (/rescue|relief|evacuat|government|response|ndrf|sdrf/.test(msg)) return /rescue|relief|evacuat|government/.test(q);
      if (/timeline|when|chronolog|after|before/.test(msg)) return /timeline|aftermath|history/.test(q);
      return false;
    }).slice(0, 4);
    if (targetedQueries.length) {
      const extraArticles = [];
      for (const q of targetedQueries) {
        extraArticles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
      }
      const extraSources = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles(extraArticles)), {
        eventName: associatedEvent.normalizedQuery,
        disasterType: associatedBundle.disasterType,
        state: associatedBundle.state,
        approxDate: associatedBundle.eventDate || associatedBundle.dateRange
      }).slice(0, 4).map((art, idx) => ({
        id: `S${evidenceSources.length + idx + 1}`,
        title: cleanEvidenceText(art.title),
        publisher: art.publisher,
        publishedAt: art.publishedAt,
        url: art.url,
        summary: cleanEvidenceText(art.summary)
      }));
      evidenceSources = deduplicateNewsArticles([...evidenceSources, ...extraSources]).map((source, idx) => ({
        ...source,
        id: `S${idx + 1}`
      }));
    }
    contextText = `Associated Event: ${associatedBundle.eventName} (${associatedBundle.disasterType}, ${associatedBundle.location})
Summary: ${associatedBundle.whatHappened}
Impact: ${associatedBundle.humanImpact}
Damage: ${associatedBundle.infrastructureDamage}
Sources:
` + evidenceSources.map((s) => `[${s.id}] ${s.title} (${s.publisher}): ${s.summary}`).join("\n");
  } else {
    const normalizedEvent = normalizeHistoricalEventQuery(englishMessage);
    const chatQueries = buildHistoricalResearchQueries(normalizedEvent).slice(0, 8);
    let articles = [];
    for (const q of chatQueries) {
      articles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
    }
    articles = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles(articles)), {
      eventName: normalizedEvent.normalizedQuery,
      disasterType: normalizedEvent.disasterType,
      state: normalizedEvent.state,
      approxDate: normalizedEvent.eventDate || String(normalizedEvent.year || "")
    }).slice(0, 8);
    if (articles.length < 2) {
      const normalizedQuery = await normalizeDisasterSearchQuery(englishMessage);
      if (normalizedQuery) {
        const fallbackEvent = normalizeHistoricalEventQuery(normalizedQuery);
        const fallbackArticles = [];
        for (const q of buildHistoricalResearchQueries(fallbackEvent).slice(0, 8)) {
          fallbackArticles.push(...await searchGoogleNews(q, { isCurrentNews: false, maxResults: 4 }));
        }
        articles = filterSourcesForEvent(filterIncidentEvidenceArticles(deduplicateNewsArticles([...articles, ...fallbackArticles])), {
          eventName: fallbackEvent.normalizedQuery,
          disasterType: fallbackEvent.disasterType,
          state: fallbackEvent.state,
          approxDate: fallbackEvent.eventDate || String(fallbackEvent.year || "")
        }).slice(0, 8);
      }
    }
    evidenceSources = articles.map((art, idx) => ({
      id: `S${idx + 1}`,
      title: art.title,
      publisher: art.publisher,
      publishedAt: art.publishedAt,
      url: art.url,
      summary: art.summary
    }));
    contextText = `Retrieved Evidence Sources:
` + evidenceSources.map((s) => `[${s.id}] ${s.title} (${s.publisher}): ${s.summary}`).join("\n");
  }
  const systemInstruction = `You are the Lead Historical Disaster Intelligence Research Assistant.
Your goal is to answer queries strictly grounded in retrieved evidence.
RULES:
1. Support factual claims with citations [S1], [S2], etc.
2. If facts are not in the sources after checking titles and summaries, say exactly which detail could not be established from the retrieved evidence.
3. Check spelling and grammar before responding. Output only clean professional English.
4. Use concise Markdown: short paragraphs and bullet lists. Use tables only for truly tabular comparisons.
5. Do not emit raw HTML entities such as &nbsp;.
6. Avoid boilerplate disclaimers unless the evidence is genuinely missing.
7. Use ASCII citation brackets only, such as [S1], never fullwidth citation brackets.
8. Respond in clear, professional English.`;
  const prompt = `Conversation Context:
${history.slice(-4).map((h) => `${h.role === "user" ? "User" : "Assistant"}: ${h.content}`).join("\n")}

Evidence Documents:
${contextText}

User Question: "${message}"

Provide a professional, cited research answer:`;
  let reply = await generateWithFallback({
    prompt,
    systemInstruction,
    keyScope: "chat"
  }) || "";
  if (!reply) {
    reply = evidenceSources.length > 0 ? `## Answer

Based on retrieved historical records:

` + evidenceSources.map((s) => `* **${s.title}** (${s.publisher}): ${s.summary} [${s.id}]`).join("\n\n") : `## Answer

No sufficiently relevant historical evidence was retrieved for this query after typo and alias normalization.`;
  }
  reply = sanitizeGeneratedReply(validateAndCleanCitations(reply, evidenceSources));
  reply = sanitizeGeneratedReply(reply);
  return {
    reply,
    sources: evidenceSources
  };
}
async function generateTTSAudio(text, voiceName = getGroqTtsVoice()) {
  const apiKey = getGroqKey("tts");
  const baseUrl = getGroqBaseUrl();
  const ttsModel = getGroqTtsModel();
  const spokenText = stripMarkdownForSpeech(text).replace(/\[[Ss]\d+\]/g, "").replace(/\s+/g, " ").trim().slice(0, 200);
  if (!spokenText) return null;
  try {
    const response = await fetch(`${baseUrl}/audio/speech`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: ttsModel,
        input: spokenText,
        voice: voiceName || getGroqTtsVoice(),
        response_format: "wav"
      })
    });
    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Groq TTS failed: HTTP ${response.status} ${errText.slice(0, 200)}`.trim());
    }
    const audioBuffer = await response.arrayBuffer();
    if (!audioBuffer || audioBuffer.byteLength < 44) {
      throw new Error("Groq TTS returned an empty audio payload");
    }
    return toBase64(audioBuffer);
  } catch (error) {
    console.error("Embedding generation failed:", error.message);
    return null;
  }
}

// server/lib/moderation.ts
var BLOCKED_PATTERNS = [
  { category: "threat", pattern: /\b(?:kill|murder|rape|bomb|shoot)\s+(?:you|them|him|her|everyone)\b/i },
  { category: "threat", pattern: /\b(?:kill yourself|go die|death threat)\b/i },
  { category: "profanity", pattern: /\b(?:fuck|f+u+c+k|motherf+u+c+k|bitch|bastard|dick|cunt|slut|whore|asshole|bullshit|shithead)\b/i },
  { category: "profanity", pattern: /\b(?:chutiya|chutiy|gand+u|harami|madarchod|behenchod|bhosdi|lund|randi|lauda)\b/i },
  { category: "profanity", pattern: /(?:चूतिया|गांडू|हरामी|मादरचोद|बहनचोद|भोसड़ी|लौड़ा|रंडी)/u },
  { category: "profanity", pattern: /(?:চোদা|চোদাচুদি|হারামি|বেশ্যা)/u },
  { category: "profanity", pattern: /(?:தேவடியா|புண்டை|மயிரு|நாயே)/u },
  { category: "profanity", pattern: /(?:ಲೋಫರ್|ಸೂಳೆ|ನಾಯಿಮಗ)/u },
  { category: "profanity", pattern: /(?:లంజ|దెంగు|పూకు)/u },
  { category: "profanity", pattern: /(?:ભાડવો|રાંડ|ચૂત)/u },
  { category: "profanity", pattern: /(?:بکواس|حرامی|رنڈی)/u },
  { category: "sexual", pattern: /\b(?:porn|xxx|sexually explicit|nude|nudes|child sexual|csam)\b/i },
  { category: "abuse", pattern: /\b(?:idiot|moron|retard|stupid bastard|you are worthless)\b/i }
];
function normalizeForModeration(value) {
  return value.normalize("NFKC").replace(/[\u200B-\u200D\uFEFF]/g, "").toLowerCase().replace(/[4@]/g, "a").replace(/[3]/g, "e").replace(/[1!]/g, "i").replace(/[0]/g, "o").replace(/[5$]/g, "s").replace(/(.)\1{4,}/g, "$1$1").replace(/[^\p{L}\p{M}\p{N}\s!?'-]/gu, " ").replace(/\s+/g, " ").trim();
}
function moderateChatInput(value) {
  if (typeof value !== "string") return { allowed: false, category: "length" };
  if (value.length === 0 || value.length > 4e3) return { allowed: false, category: "length" };
  const normalized = normalizeForModeration(value);
  const match = BLOCKED_PATTERNS.find(({ pattern }) => pattern.test(normalized));
  return match ? { allowed: false, category: match.category } : { allowed: true };
}

// server/db/supabase.ts
var SUPABASE_URL = String(process.env.SUPABASE_URL || "").replace(/\/+$/, "");
var SUPABASE_PUBLISHABLE_KEY = String(process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || "");
var SUPABASE_SECRET_KEY = String(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "");
function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SECRET_KEY);
}
function getSupabaseUrl() {
  return SUPABASE_URL;
}
async function supabaseRest(path2, init = {}) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path2.replace(/^\/+/, "")}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
      Accept: "application/json",
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers || {}
    }
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase REST request failed (${response.status}): ${detail || response.statusText}`);
  }
  if (response.status === 204) return void 0;
  const text = await response.text();
  if (!text || text.trim() === "") return void 0;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Supabase REST returned non-JSON body (${response.status}): ${text.slice(0, 300)}`);
  }
}

// server/repositories/canonicalEvents.ts
var PUBLIC_VERIFICATION_STATUSES = ["OFFICIAL_VERIFIED", "CROSS_SOURCE_VERIFIED", "PROVISIONALLY_VERIFIED"];
function publicVerificationFilter() {
  return `verification_status=in.(${PUBLIC_VERIFICATION_STATUSES.join(",")})`;
}
function rowToDto(row) {
  const coordinates = row.centroid?.coordinates;
  return {
    id: row.id,
    eventKey: row.event_key,
    title: row.title,
    eventType: row.event_type,
    status: row.status,
    severity: row.severity || "Unknown",
    urgency: row.urgency || "Unknown",
    certainty: row.certainty || "Unknown",
    description: row.description || "",
    instruction: row.instruction || void 0,
    locationName: row.location_name || [row.district, row.state].filter(Boolean).join(", ") || "India",
    city: row.city || void 0,
    district: row.district || void 0,
    state: row.state || void 0,
    country: row.country || "India",
    longitude: row.longitude ?? coordinates?.[0],
    latitude: row.latitude ?? coordinates?.[1],
    startedAt: row.started_at || void 0,
    lastObservedAt: row.last_observed_at || void 0,
    lastVerifiedAt: row.last_verified_at || void 0,
    presentUntil: row.present_until || void 0,
    endedAt: row.ended_at || void 0,
    verificationStatus: row.verification_status,
    verificationScore: Number(row.verification_score || 0),
    verificationMethod: row.verification_method || "SOURCE_WEIGHTED",
    verificationReason: row.verification_reason || "Stored canonical event with source provenance.",
    locationConfidence: Number(row.location_confidence || 0),
    sourceCount: Number(row.source_count || row.citations?.length || 0),
    citations: row.citations || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
function toDtoList(rows) {
  return rows.map(rowToDto).filter((event) => {
    const materialText = `${event.title} ${event.description} ${event.instruction || ""}`;
    const letters = [...materialText].filter((char) => /\p{L}/u.test(char));
    if (letters.length < 12) return true;
    const latinLetters = letters.filter((char) => /\p{Script=Latin}/u.test(char));
    return latinLetters.length / letters.length >= 0.85;
  });
}
var VIEW_SELECT = "id,event_key,title,event_type,status,severity,urgency,certainty,description,instruction,location_name,city,district,state,country,latitude,longitude,started_at,last_observed_at,last_verified_at,present_until,ended_at,verification_status,verification_score,verification_method,verification_reason,location_confidence,source_count,citations,created_at,updated_at";
async function listActiveCanonicalEvents(limit = 200) {
  if (!isSupabaseConfigured()) {
    return { items: [], count: 0, retrievedAt: (/* @__PURE__ */ new Date()).toISOString(), cacheStatus: "SEED_FALLBACK" };
  }
  const rows = await supabaseRest(
    `active_canonical_events?select=${VIEW_SELECT}&${publicVerificationFilter()}&order=last_observed_at.desc.nullslast&limit=${limit}`
  ).catch((error) => {
    console.warn("[canonicalEvents] active listing failed:", error.message);
    return [];
  });
  const items = toDtoList(rows);
  return { items, count: items.length, retrievedAt: (/* @__PURE__ */ new Date()).toISOString(), cacheStatus: "SUPABASE" };
}
async function listArchivedCanonicalEvents(limit = 200) {
  if (!isSupabaseConfigured()) {
    return { items: [], count: 0, retrievedAt: (/* @__PURE__ */ new Date()).toISOString(), cacheStatus: "SEED_FALLBACK" };
  }
  const rows = await supabaseRest(
    `past_canonical_events?select=${VIEW_SELECT}&${publicVerificationFilter()}&order=started_at.desc.nullslast&limit=${limit}`
  ).catch((error) => {
    console.warn("[canonicalEvents] archive listing failed:", error.message);
    return [];
  });
  const items = toDtoList(rows);
  return { items, count: items.length, retrievedAt: (/* @__PURE__ */ new Date()).toISOString(), cacheStatus: "SUPABASE" };
}
async function getCanonicalEventById(id) {
  if (!isSupabaseConfigured()) return null;
  const byView = (view) => supabaseRest(
    `${view}?id=eq.${encodeURIComponent(id)}&select=${VIEW_SELECT}&${publicVerificationFilter()}&limit=1`
  ).catch(() => []);
  const [active, past] = await Promise.all([byView("active_canonical_events"), byView("past_canonical_events")]);
  const row = active[0] || past[0];
  return row ? rowToDto(row) : null;
}
async function searchCanonicalEventsLexical(query, limit = 50) {
  if (!isSupabaseConfigured()) return [];
  const encoded = encodeURIComponent(`%${query.replace(/[%_]/g, "")}%`);
  const rows = await supabaseRest(
    `past_canonical_events?select=${VIEW_SELECT}&${publicVerificationFilter()}&or=(title.ilike.${encoded},description.ilike.${encoded},state.ilike.${encoded},district.ilike.${encoded},location_name.ilike.${encoded},event_type.ilike.${encoded})&order=started_at.desc.nullslast&limit=${limit}`
  ).catch((error) => {
    console.warn("[canonicalEvents] lexical search failed:", error.message);
    return [];
  });
  return toDtoList(rows);
}
async function getEventCitations(eventId) {
  const rows = await supabaseRest(
    `event_sources?event_id=eq.${encodeURIComponent(eventId)}&select=source_id,citation_id,source_definitions(name,source_type),source_observations(id,title,source_url,publisher,published_at,retrieved_at,raw_content)`,
    { method: "GET" }
  ).catch(() => []);
  return rows.map((row, index) => ({
    id: row.citation_id || `S${index + 1}`,
    sourceId: row.source_id,
    sourceName: row.source_definitions?.name || "Unknown Source",
    sourceType: row.source_definitions?.source_type || "NEWS",
    publisher: row.source_observations?.publisher || row.source_definitions?.name || void 0,
    title: row.source_observations?.title || row.source_definitions?.name || "Source observation",
    url: row.source_observations?.source_url || void 0,
    publishedAt: row.source_observations?.published_at || void 0,
    retrievedAt: row.source_observations?.retrieved_at || void 0,
    summary: (row.source_observations?.raw_content || "").slice(0, 600) || void 0
  }));
}
async function getEventTimeline(eventId) {
  const rows = await supabaseRest(
    `event_updates?event_id=eq.${encodeURIComponent(eventId)}&select=id,status,severity,description,observed_at,created_at&order=observed_at.asc`,
    { method: "GET" }
  ).catch(() => []);
  return rows.map((row) => ({
    id: row.id,
    status: row.status,
    severity: row.severity,
    description: row.description,
    observedAt: row.observed_at,
    createdAt: row.created_at
  }));
}

// server/lib/httpError.ts
var HttpError = class extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
};
function badRequest(message, code = "BAD_REQUEST") {
  return new HttpError(400, code, message);
}
function unauthorized(message = "Authentication required") {
  return new HttpError(401, "UNAUTHENTICATED", message);
}
function forbidden(message = "You do not have permission to perform this action") {
  return new HttpError(403, "FORBIDDEN", message);
}
function notFound(message = "Resource not found") {
  return new HttpError(404, "NOT_FOUND", message);
}
function tooMany(message = "Too many requests, please slow down") {
  return new HttpError(429, "RATE_LIMITED", message);
}
function unavailable(message) {
  return new HttpError(503, "SERVICE_UNAVAILABLE", message);
}
function sendError(res, error) {
  if (error instanceof HttpError) {
    res.status(error.status).json({ success: false, error: { code: error.code, message: error.message } });
    return;
  }
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error("[api:error]", message);
  res.status(500).json({ success: false, error: { code: "INTERNAL_ERROR", message: "The request could not be completed." } });
}

// server/auth.ts
async function requireAuth(req, _res, next) {
  try {
    const token = String(req.headers.authorization || "").replace(/^Bearer\s+/i, "").trim();
    if (!token) throw unauthorized();
    if (!isSupabaseConfigured()) {
      next(new Error("Supabase Auth is not configured on the server"));
      return;
    }
    const baseUrl = getSupabaseUrl();
    const response = await fetch(`${baseUrl}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY || SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${token}`
      }
    });
    if (response.status === 401) throw unauthorized("Invalid or expired session");
    if (!response.ok) throw unauthorized("Session could not be validated");
    const user = await response.json();
    if (!user.id) throw unauthorized("Invalid authenticated user");
    let profiles = await supabaseRest(
      `profiles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`,
      { method: "GET" }
    ).catch(() => []);
    if (!profiles[0]) {
      profiles = await supabaseRest("profiles", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({ id: user.id, email: user.email || null, role: "user" })
      }).catch(() => []);
    }
    req.user = {
      id: user.id,
      email: user.email,
      // Fail closed: anything ambiguous resolves to the least-privileged role.
      role: profiles[0]?.role === "admin" ? "admin" : "user"
    };
    next();
  } catch (error) {
    next(error);
  }
}
function requireAdmin(req, _res, next) {
  if (!req.user) {
    next(unauthorized());
    return;
  }
  if (req.user.role !== "admin") {
    next(forbidden("Admin role required"));
    return;
  }
  next();
}

// server/lib/cache.ts
var CacheService = class {
  constructor() {
    this.stores = /* @__PURE__ */ new Map();
  }
  getStore(name) {
    if (!this.stores.has(name)) {
      this.stores.set(name, /* @__PURE__ */ new Map());
    }
    return this.stores.get(name);
  }
  get(store, key) {
    const s = this.getStore(store);
    const entry = s.get(key);
    if (!entry) return void 0;
    if (Date.now() > entry.expiresAt) {
      s.delete(key);
      return void 0;
    }
    return entry.value;
  }
  set(store, key, value, ttlSeconds) {
    const s = this.getStore(store);
    s.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1e3 });
  }
  invalidate(store, key) {
    if (key) {
      this.getStore(store).delete(key);
    } else {
      this.stores.delete(store);
    }
  }
  invalidatePattern(store, pattern) {
    const s = this.getStore(store);
    const regex = new RegExp(pattern);
    for (const k of s.keys()) {
      if (regex.test(k)) s.delete(k);
    }
  }
  clear(store) {
    this.stores.delete(store);
  }
  getTTL(storeName) {
    const envMap = {
      present: "CACHE_PRESENT_TTL_SECONDS",
      past: "CACHE_PAST_TTL_SECONDS",
      search: "CACHE_SEARCH_TTL_SECONDS",
      chat: "CACHE_CHAT_TTL_SECONDS",
      geocode: "GEOCODE_CACHE_TTL_SECONDS"
    };
    const envKey = envMap[storeName];
    if (envKey) {
      const val = Number(process.env[envKey]);
      if (Number.isFinite(val) && val > 0) return val;
    }
    const defaults = {
      present: 60,
      past: 300,
      search: 900,
      chat: 900,
      geocode: 86400
    };
    return defaults[storeName] || 300;
  }
};
var cache = new CacheService();

// server/lib/embedding.ts
var GeminiEmbeddingProvider = class {
  constructor() {
    this.providerName = "gemini";
    this.available = false;
    this.apiKey = process.env.GEMINI_API_KEY?.trim() || "";
    this.modelName = process.env.GEMINI_EMBEDDING_MODEL?.trim() || "gemini-embedding-2";
    this.dimensions = parseInt(process.env.GEMINI_EMBEDDING_DIMENSIONS || "1536", 10);
    this.available = Boolean(this.apiKey);
  }
  isAvailable() {
    return this.available;
  }
  async embed(text) {
    if (!this.available) throw new Error("Gemini API key not configured");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:embedContent?key=${this.apiKey}`;
    const truncatedText = text.slice(0, 8e3);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3e4);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: `models/${this.modelName}`,
          content: { parts: [{ text: truncatedText }] },
          taskType: "RETRIEVAL_DOCUMENT",
          outputDimensionality: this.dimensions
        }),
        signal: controller.signal
      });
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Gemini embedding failed: HTTP ${response.status} ${detail}`);
      }
      const data = await response.json();
      const values = data?.embedding?.values;
      if (!Array.isArray(values) || values.length === 0) {
        throw new Error("Gemini embedding returned empty vector");
      }
      if (values.length !== this.dimensions) {
        throw new Error(`Gemini embedding dimension mismatch: expected ${this.dimensions}, got ${values.length}`);
      }
      return values;
    } finally {
      clearTimeout(timeout);
    }
  }
};
var provider = null;
function getEmbeddingProvider() {
  if (!provider) {
    provider = new GeminiEmbeddingProvider();
  }
  return provider;
}
function isEmbeddingAvailable() {
  return getEmbeddingProvider().isAvailable();
}
function getEmbeddingDimensions() {
  return getEmbeddingProvider().dimensions;
}
async function generateEmbedding(text) {
  const p = getEmbeddingProvider();
  if (!p.isAvailable()) return null;
  try {
    return await p.embed(text);
  } catch (err) {
    console.warn("Embedding generation failed:", err.message);
    return null;
  }
}

// server/lib/contentHash.ts
var import_crypto = require("crypto");
function contentHash(text) {
  return (0, import_crypto.createHash)("sha256").update(text.toLowerCase().trim()).digest("hex");
}
function normalizeUrl(url) {
  try {
    const u = new URL(url);
    u.searchParams.delete("utm_source");
    u.searchParams.delete("utm_medium");
    u.searchParams.delete("utm_campaign");
    u.searchParams.delete("utm_content");
    u.searchParams.delete("utm_term");
    u.hash = "";
    return u.toString().replace(/\/+$/, "");
  } catch {
    return url.trim().toLowerCase();
  }
}
function titleSimilarity(a, b) {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter(Boolean));
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter(Boolean));
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }
  return intersection / Math.max(wordsA.size, wordsB.size);
}

// server/lib/searchRetrieval.ts
async function lexicalSearch(query, matchCount = 20) {
  try {
    return await supabaseRest("rpc/search_documents_lexical", {
      method: "POST",
      body: JSON.stringify({ p_query: query, p_match_count: matchCount })
    });
  } catch (error) {
    console.warn("Lexical search RPC failed:", error.message);
    return [];
  }
}
async function vectorDocumentSearch(query, matchCount = 10, threshold = 0.3) {
  if (!isEmbeddingAvailable()) return [];
  const embedding = await generateEmbedding(query);
  if (!embedding) return [];
  try {
    return await supabaseRest("rpc/match_documents", {
      method: "POST",
      body: JSON.stringify({
        query_embedding: embedding,
        match_count: matchCount,
        match_threshold: threshold
      })
    });
  } catch (error) {
    console.warn("Vector document search RPC failed:", error.message);
    return [];
  }
}
async function vectorEventSearch(query, matchCount = 10, threshold = 0.35) {
  if (!isEmbeddingAvailable()) return [];
  const embedding = await generateEmbedding(query);
  if (!embedding) return [];
  try {
    return await supabaseRest("rpc/match_events", {
      method: "POST",
      body: JSON.stringify({
        query_embedding: embedding,
        match_count: matchCount,
        match_threshold: threshold
      })
    });
  } catch (error) {
    console.warn("Vector event search RPC failed:", error.message);
    return [];
  }
}
async function nearbyEvents(lat, lng, radiusKm = 50) {
  const bounded = Math.max(1, Math.min(radiusKm, 500));
  try {
    return await supabaseRest("rpc/events_nearby", {
      method: "POST",
      body: JSON.stringify({
        center: `SRID=4326;POINT(${lng} ${lat})`,
        radius_meters: bounded * 1e3
      })
    });
  } catch (error) {
    console.warn("Nearby events RPC failed:", error.message);
    return [];
  }
}
async function upsertSearchDocument(input) {
  const documentHash = contentHash(`${input.title}|${input.content}`);
  try {
    const rows = await supabaseRest(
      "search_documents?on_conflict=document_hash",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          document_type: input.documentType,
          event_id: input.eventId || null,
          observation_id: input.observationId || null,
          title: input.title.slice(0, 500),
          content: input.content.slice(0, 8e3),
          source_url: input.sourceUrl || null,
          document_hash: documentHash
        })
      }
    );
    if (rows?.[0]?.id) return rows[0].id;
    const existing = await supabaseRest(
      `search_documents?document_hash=eq.${documentHash}&select=id&limit=1`,
      { method: "GET" }
    );
    return existing[0]?.id || null;
  } catch (error) {
    console.warn("Search document persistence failed:", error.message);
    return null;
  }
}
function currentEmbeddingMetadata(previousVersion) {
  const provider2 = getEmbeddingProvider();
  return {
    embedding_provider: provider2.providerName,
    embedding_model: provider2.modelName,
    embedding_dimensions: provider2.dimensions,
    embedding_version: (previousVersion ?? 0) + 1
  };
}
async function embedAndStoreEvent(eventId, text) {
  const embedding = await generateEmbedding(text.slice(0, 8e3));
  if (!embedding) return false;
  const metadata = currentEmbeddingMetadata();
  try {
    await supabaseRest("event_embeddings?on_conflict=event_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        event_id: eventId,
        embedding: JSON.stringify(embedding),
        content_text: text.slice(0, 5e3),
        ...metadata
      })
    });
    return true;
  } catch (error) {
    console.warn("Event embedding persistence failed:", error.message);
    return false;
  }
}
async function embedAndStoreSearchDocument(docId, text) {
  const embedding = await generateEmbedding(text.slice(0, 8e3));
  if (!embedding) return false;
  const metadata = currentEmbeddingMetadata();
  try {
    await supabaseRest(`search_documents?id=eq.${docId}`, {
      method: "PATCH",
      body: JSON.stringify({ embedding: JSON.stringify(embedding), ...metadata })
    });
    return true;
  } catch (error) {
    console.warn("Search document embedding persistence failed:", error.message);
    return false;
  }
}
async function embedAndStoreSourceObservation(observationId, text) {
  const embedding = await generateEmbedding(text.slice(0, 8e3));
  if (!embedding) return false;
  const metadata = currentEmbeddingMetadata();
  try {
    await supabaseRest("source_embeddings?on_conflict=observation_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify({
        observation_id: observationId,
        embedding: JSON.stringify(embedding),
        content_text: text.slice(0, 5e3),
        ...metadata
      })
    });
    return true;
  } catch (error) {
    console.warn("Source embedding persistence failed:", error.message);
    return false;
  }
}

// server/lib/rateLimit.ts
var buckets = /* @__PURE__ */ new Map();
var sweeper = setInterval(() => {
  const now2 = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now2) buckets.delete(key);
  }
}, 6e4);
sweeper.unref?.();
function rateLimit(req, scope, limit, windowMs) {
  const identity = req.user?.id || req.ip || "anonymous";
  const key = `${scope}:${identity}`;
  const now2 = Date.now();
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now2) {
    bucket = { count: 0, resetAt: now2 + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    throw tooMany(`Rate limit exceeded for ${scope}. Try again shortly.`);
  }
}

// server/lib/sourceRegistry.ts
var registryCache = /* @__PURE__ */ new Map();
var CACHE_TTL_MS = 10 * 60 * 1e3;
var SOURCE_KEY_TO_TYPE = {
  "sachet-cap": "OFFICIAL",
  imd: "OFFICIAL",
  cwc: "OFFICIAL",
  incois: "OFFICIAL",
  fsi: "OFFICIAL",
  dgre: "OFFICIAL",
  "state-disaster-authorities": "OFFICIAL",
  "google-news-rss": "NEWS",
  "national-news": "NEWS",
  "regional-news": "NEWS",
  "citizen": "CITIZEN",
  "reddit": "SOCIAL",
  "youtube": "SOCIAL",
  x: "SOCIAL",
  "data-gov": "DATASET",
  "historical-catalog": "SEED"
};
var SOURCE_KEY_NAMES = {
  "sachet-cap": "SACHET / NDMA CAP Alerts",
  imd: "India Meteorological Department",
  cwc: "Central Water Commission",
  incois: "INCOIS Ocean Alerts",
  fsi: "Forest Survey of India",
  dgre: "DGRE Snow and Avalanche Warnings",
  "state-disaster-authorities": "State Disaster Management Authorities",
  "google-news-rss": "Google News (India disaster coverage)",
  "national-news": "Major Indian National News",
  "regional-news": "Major Indian Regional News",
  "citizen": "Citizen Reports",
  "reddit": "Reddit (r/India disaster threads)",
  "youtube": "YouTube News Channels",
  x: "X / Public Social Signals",
  "data-gov": "data.gov.in Open Datasets",
  "historical-catalog": "Curated Historical Disaster Catalog"
};
var SOURCE_KEY_BASE_URLS = {
  "sachet-cap": "https://sachet.ndma.gov.in",
  imd: "https://mausam.imd.gov.in",
  cwc: "https://cwc.gov.in",
  incois: "https://incois.gov.in",
  fsi: "https://fsi.nic.in",
  dgre: "https://www.drdo.gov.in/labs-and-establishments/defence-geoinformatics-research-establishment-dgre",
  "google-news-rss": "https://news.google.com",
  "national-news": "https://news.google.com",
  "regional-news": "https://news.google.com",
  reddit: "https://www.reddit.com",
  youtube: "https://www.googleapis.com/youtube/v3",
  x: "https://developer.x.com",
  "data-gov": "https://api.data.gov.in"
};
function defaultTrustWeight(key) {
  if (SOURCE_KEY_TO_TYPE[key] === "OFFICIAL") return 0.95;
  if (key === "historical-catalog") return 0.8;
  if (key === "data-gov") return 0.75;
  if (key === "google-news-rss" || key === "national-news" || key === "regional-news") return 0.55;
  if (key === "citizen") return 0.35;
  return 0.3;
}
function defaultPriority(key) {
  if (SOURCE_KEY_TO_TYPE[key] === "OFFICIAL") return 10;
  if (key === "data-gov") return 35;
  if (SOURCE_KEY_TO_TYPE[key] === "NEWS") return 50;
  return 70;
}
async function resolveSource(key) {
  const cached = registryCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return cached.row;
  const existing = await supabaseRest(
    `source_definitions?source_key=eq.${encodeURIComponent(key)}&select=id,source_key,name,source_type,trust_weight,enabled&limit=1`,
    { method: "GET" }
  );
  let row = existing[0];
  if (!row) {
    const inserted = await supabaseRest(
      "source_definitions?on_conflict=source_key",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          source_key: key,
          name: SOURCE_KEY_NAMES[key],
          source_type: SOURCE_KEY_TO_TYPE[key],
          base_url: SOURCE_KEY_BASE_URLS[key] || null,
          enabled: true,
          trust_weight: defaultTrustWeight(key),
          priority: defaultPriority(key)
        })
      }
    );
    row = inserted[0];
  }
  if (!row) {
    throw new Error(`Failed to resolve source definition for key: ${key}`);
  }
  registryCache.set(key, { row, expiresAt: Date.now() + CACHE_TTL_MS });
  return row;
}

// server/adapters/youtube.ts
var YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3/search";
async function searchYouTube(query, options = {}) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];
  const maxResults = Math.min(Math.max(options.maxResults ?? 6, 1), 25);
  const url = new URL(YOUTUBE_API_BASE);
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(maxResults));
  url.searchParams.set("regionCode", options.regionCode || "IN");
  url.searchParams.set("relevanceLanguage", "en");
  url.searchParams.set("key", apiKey);
  const response = await fetch(url.toString(), { signal: AbortSignal.timeout(8e3) });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`YouTube API ${response.status}: ${detail.slice(0, 150)}`);
  }
  const payload = await response.json();
  const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
  return (payload.items || []).filter((item) => item.id?.videoId).map((item) => {
    const videoId = item.id.videoId;
    return {
      sourceKey: "youtube",
      sourceType: "SOCIAL",
      externalId: videoId,
      title: item.snippet?.title || `YouTube video ${videoId}`,
      content: (item.snippet?.description || "").slice(0, 2e3),
      url: `https://www.youtube.com/watch?v=${videoId}`,
      publisher: item.snippet?.channelTitle || "YouTube",
      publishedAt: item.snippet?.publishedAt || null,
      retrievedAt,
      locationText: null,
      disasterType: null,
      eventDate: item.snippet?.publishedAt || null,
      state: null,
      district: null,
      city: null,
      metadata: { thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || null },
      confidence: 0.3
    };
  });
}

// server/adapters/reddit.ts
async function getAccessToken() {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  try {
    const response = await fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "AapdaDrishti/1.0 (disaster research)"
      },
      body: "grant_type=client_credentials",
      signal: AbortSignal.timeout(8e3)
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.access_token || null;
  } catch {
    return null;
  }
}
async function searchReddit(query, options = {}) {
  const maxResults = Math.min(Math.max(options.maxResults ?? 6, 1), 25);
  const token = await getAccessToken();
  const headers = {
    "User-Agent": "AapdaDrishti/1.0 (disaster research)",
    Accept: "application/json"
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = new URL("https://www.reddit.com/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("limit", String(maxResults));
  url.searchParams.set("sort", "relevance");
  url.searchParams.set("t", "all");
  const response = await fetch(url.toString(), { headers, signal: AbortSignal.timeout(8e3) });
  if (!response.ok) {
    throw new Error(`Reddit search ${response.status}`);
  }
  const payload = await response.json();
  const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
  return (payload.data?.children || []).filter((child) => child.data?.id).map((child) => {
    const post = child.data;
    const createdAt = post.created_utc ? new Date(post.created_utc * 1e3).toISOString() : null;
    return {
      sourceKey: "reddit",
      sourceType: "SOCIAL",
      externalId: post.id,
      title: post.title || `Reddit post ${post.id}`,
      content: (post.selftext || "").slice(0, 2e3),
      url: post.permalink ? `https://www.reddit.com${post.permalink}` : null,
      publisher: post.subreddit ? `r/${post.subreddit}` : "Reddit",
      publishedAt: createdAt,
      retrievedAt,
      locationText: null,
      disasterType: null,
      eventDate: createdAt,
      state: null,
      district: null,
      city: null,
      metadata: { author: post.author || null, score: post.score ?? null },
      confidence: 0.25
    };
  });
}

// server/adapters/x.ts
async function searchX(query, options = {}) {
  const bearer = process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN;
  if (!bearer) return [];
  const maxResults = Math.min(Math.max(options.maxResults ?? 10, 10), 100);
  const url = new URL("https://api.twitter.com/2/tweets/search/recent");
  url.searchParams.set("query", `${query} lang:en -is:retweet`);
  url.searchParams.set("max_results", String(maxResults));
  url.searchParams.set("tweet.fields", "created_at,author_id,public_metrics");
  url.searchParams.set("expansions", "author_id");
  url.searchParams.set("user.fields", "username,name");
  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${bearer}` },
    signal: AbortSignal.timeout(8e3)
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`X API ${response.status}: ${detail.slice(0, 150)}`);
  }
  const payload = await response.json();
  const users = new Map((payload.includes?.users || []).map((user) => [user.id, user]));
  const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
  return (payload.data || []).map((tweet) => {
    const user = tweet.author_id ? users.get(tweet.author_id) : void 0;
    const username = user?.username;
    return {
      sourceKey: "x",
      sourceType: "SOCIAL",
      externalId: tweet.id,
      title: `X post ${tweet.id}`,
      content: (tweet.text || "").slice(0, 2e3),
      url: username ? `https://x.com/${username}/status/${tweet.id}` : `https://x.com/i/web/status/${tweet.id}`,
      publisher: username ? `@${username}` : user?.name || "X",
      publishedAt: tweet.created_at || null,
      retrievedAt,
      locationText: null,
      disasterType: null,
      eventDate: tweet.created_at || null,
      state: null,
      district: null,
      city: null,
      metadata: { authorId: tweet.author_id || null, metrics: tweet.public_metrics || {} },
      confidence: 0.25
    };
  });
}

// server/adapters/dataGov.ts
async function searchDataGov(query, options = {}) {
  const apiKey = process.env.DATA_GOV_API_KEY;
  if (!apiKey) return [];
  const maxResults = Math.min(Math.max(options.maxResults ?? 6, 1), 50);
  const url = new URL("https://api.data.gov.in/catalog");
  url.searchParams.set("api-key", apiKey);
  url.searchParams.set("format", "json");
  url.searchParams.set("filters[search]", query);
  url.searchParams.set("limit", String(maxResults));
  const response = await fetch(url.toString(), { signal: AbortSignal.timeout(1e4) });
  if (!response.ok) {
    throw new Error(`data.gov.in API ${response.status}`);
  }
  const payload = await response.json();
  const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
  return (payload.records || []).filter((record) => record.title).map((record) => {
    const resourceUrl = record.external_ws || record.target || null;
    return {
      sourceKey: "data-gov",
      sourceType: "DATASET",
      externalId: resourceUrl || `datagov:${record.title}`,
      title: record.title,
      content: (record.desc || record.field || "").slice(0, 2e3),
      url: resourceUrl,
      publisher: record.org || "data.gov.in",
      publishedAt: record.created || record.updated || null,
      retrievedAt,
      locationText: null,
      disasterType: null,
      eventDate: record.updated || record.created || null,
      state: null,
      district: null,
      city: null,
      metadata: { exponent: record.exponent ?? null, visibility: record.vis ?? null },
      confidence: 0.75
    };
  });
}

// server/lib/citizenEvidence.ts
async function searchCitizenEvidence(query, options = {}) {
  if (!isSupabaseConfigured()) return [];
  const maxResults = Math.min(Math.max(options.maxResults ?? 6, 1), 25);
  const encoded = encodeURIComponent(`%${query.replace(/[%_]/g, "")}%`);
  const rows = await supabaseRest(
    `citizen_reports?select=id,report_text,reported_category,reported_at,status,verification_score,linked_event_id,media_urls&or=(report_text.ilike.${encoded},reported_category.ilike.${encoded})&status=in.(VERIFIED,VERIFYING)&order=reported_at.desc&limit=${maxResults}`,
    { method: "GET" }
  ).catch(() => []);
  const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
  return rows.map((report) => ({
    sourceKey: "citizen",
    sourceType: "CITIZEN",
    externalId: report.id,
    title: `${report.reported_category || "Citizen report"} \u2014 ${report.reported_at.slice(0, 10)}`,
    content: report.report_text.slice(0, 2e3),
    url: null,
    publisher: "Verified citizen report",
    publishedAt: report.reported_at,
    retrievedAt,
    locationText: null,
    disasterType: report.reported_category,
    eventDate: report.reported_at,
    state: null,
    district: null,
    city: null,
    metadata: {
      reportStatus: report.status,
      verificationScore: report.verification_score,
      linkedEventId: report.linked_event_id,
      mediaCount: (report.media_urls || []).length
    },
    confidence: 0.35
  }));
}

// server/lib/verification.ts
var SEVERITY_ORDER = ["Unknown", "Minor", "Moderate", "Severe", "Extreme"];
var PUBLIC_VERIFICATION_STATUSES2 = ["OFFICIAL_VERIFIED", "CROSS_SOURCE_VERIFIED", "PROVISIONALLY_VERIFIED"];
function severityValue(severity) {
  const index = SEVERITY_ORDER.indexOf(severity || "Unknown");
  return index < 0 ? 0 : index;
}
function verificationFromSignals(signals) {
  if (signals.length === 0) return { score: 0, status: "PENDING", distinctSources: 0 };
  const official = signals.some((s) => s.source?.source_type === "OFFICIAL");
  const distinctTrusts = /* @__PURE__ */ new Set();
  let trustSum = 0;
  for (const signal of signals) {
    const key = signal.source ? `${signal.source.source_type}:${signal.source.trust_weight}` : "unknown";
    distinctTrusts.add(key);
    trustSum += signal.source?.trust_weight ?? 0.3;
  }
  const distinctSources = distinctTrusts.size;
  let score = 0.1;
  if (official) score += 0.4;
  if (distinctSources >= 2) score += 0.2;
  if (distinctSources >= 3) score += 0.1;
  score += 0.2 * Math.min(1, trustSum / Math.max(1, signals.length) / 0.9);
  const times = signals.map((s) => s.publishedAt ? new Date(s.publishedAt).getTime() : NaN).filter(Number.isFinite);
  if (times.length >= 2) {
    const spread = (Math.max(...times) - Math.min(...times)) / 36e5;
    if (spread <= 48) score += 0.1;
  }
  score = Math.min(1, Math.round(score * 100) / 100);
  let status;
  if (official && distinctSources >= 2) status = "OFFICIAL_VERIFIED";
  else if (official) status = "OFFICIAL_VERIFIED";
  else if (distinctSources >= 2 && score >= 0.5) status = "CROSS_SOURCE_VERIFIED";
  else if (score >= 0.3) status = "PROVISIONALLY_VERIFIED";
  else status = "PENDING";
  return { score, status, distinctSources };
}
function citizenReportVerification(input) {
  const reasons = [];
  let score = 0.25;
  if (input.nearbyVerifiedEventCount > 0) {
    score += Math.min(0.35, 0.2 + 0.05 * (input.nearbyVerifiedEventCount - 1));
    reasons.push(`Corroborated by ${input.nearbyVerifiedEventCount} verified active event(s) within reporting radius.`);
  } else {
    reasons.push("No verified canonical event corroborates this report yet.");
  }
  if (input.duplicateReportCount >= 2) {
    score += 0.15;
    reasons.push(`${input.duplicateReportCount} independent citizen reports in the same area.`);
  }
  if (input.reportText.trim().length >= 80) {
    score += 0.05;
  }
  score = Math.min(1, Math.round(score * 100) / 100);
  if (input.duplicateReportCount >= 3 && input.nearbyVerifiedEventCount === 0) {
    return { score, status: "DUPLICATE", reason: `Duplicate cluster without corroboration. ${reasons.join(" ")}` };
  }
  if (score >= 0.55) return { score, status: "VERIFIED", reason: reasons.join(" ") };
  if (score >= 0.35) return { score, status: "VERIFYING", reason: reasons.join(" ") };
  return { score, status: "REJECTED", reason: `Insufficient corroboration. ${reasons.join(" ")}` };
}

// server/lib/researchOrchestrator.ts
var youtubeEnabled = () => Boolean(process.env.YOUTUBE_API_KEY);
var redditEnabled = () => Boolean(process.env.REDDIT_CLIENT_ID && process.env.REDDIT_CLIENT_SECRET);
var xEnabled = () => Boolean(process.env.X_BEARER_TOKEN || process.env.TWITTER_BEARER_TOKEN);
var dataGovEnabled = () => Boolean(process.env.DATA_GOV_API_KEY);
var PROVIDER_REGISTRY = [
  {
    sourceKey: "sachet-cap",
    sourceType: "OFFICIAL",
    enabled: () => true,
    supportsCurrent: true,
    // SACHET exposes current CAP alerts only; there is no public historical
    // archive/search endpoint, so historical research never queries it.
    supportsHistorical: false,
    supportsSearch: false,
    trustWeight: 0.95,
    search: async () => []
  },
  {
    sourceKey: "google-news-rss",
    sourceType: "NEWS",
    enabled: () => true,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.55,
    search: async (query, { historical, maxResults }) => {
      const articles = await searchGoogleNews(query, {
        isCurrentNews: !historical,
        maxResults
      });
      return articles.map((article) => ({
        sourceKey: "google-news-rss",
        sourceType: "NEWS",
        externalId: normalizeUrl(article.url) || article.url,
        title: article.title,
        content: article.summary,
        url: article.url,
        publisher: article.publisher,
        publishedAt: article.publishedAt || null,
        retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
        locationText: null,
        disasterType: null,
        eventDate: article.publishedAt || null,
        state: null,
        district: null,
        city: null,
        metadata: { queryUsed: query },
        confidence: 0.55
      }));
    }
  },
  {
    sourceKey: "national-news",
    sourceType: "NEWS",
    enabled: () => true,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.55,
    search: async (query, { historical, maxResults }) => {
      const articles = await searchGoogleNews(`${query} site:thehindu.com OR site:indianexpress.com OR site:hindustantimes.com`, {
        isCurrentNews: !historical,
        maxResults
      });
      return articles.map((article) => ({
        sourceKey: "national-news",
        sourceType: "NEWS",
        externalId: normalizeUrl(article.url) || article.url,
        title: article.title,
        content: article.summary,
        url: article.url,
        publisher: article.publisher,
        publishedAt: article.publishedAt || null,
        retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
        locationText: null,
        disasterType: null,
        eventDate: article.publishedAt || null,
        state: null,
        district: null,
        city: null,
        metadata: { queryUsed: query },
        confidence: 0.55
      }));
    }
  },
  {
    sourceKey: "regional-news",
    sourceType: "NEWS",
    enabled: () => true,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.55,
    search: async (query, { historical, maxResults }) => {
      const articles = await searchGoogleNews(`${query} Indian regional news`, {
        isCurrentNews: !historical,
        maxResults
      });
      return articles.map((article) => ({
        sourceKey: "regional-news",
        sourceType: "NEWS",
        externalId: normalizeUrl(article.url) || article.url,
        title: article.title,
        content: article.summary,
        url: article.url,
        publisher: article.publisher,
        publishedAt: article.publishedAt || null,
        retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
        locationText: null,
        disasterType: null,
        eventDate: article.publishedAt || null,
        state: null,
        district: null,
        city: null,
        metadata: { queryUsed: query },
        confidence: 0.55
      }));
    }
  },
  {
    sourceKey: "youtube",
    sourceType: "SOCIAL",
    enabled: youtubeEnabled,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.3,
    search: async (query, { maxResults }) => searchYouTube(query, { regionCode: "IN", maxResults })
  },
  {
    sourceKey: "reddit",
    sourceType: "SOCIAL",
    enabled: redditEnabled,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.25,
    search: async (query, { maxResults }) => searchReddit(query, { maxResults })
  },
  {
    sourceKey: "x",
    sourceType: "SOCIAL",
    enabled: xEnabled,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.25,
    search: async (query, { maxResults }) => searchX(query, { maxResults })
  },
  {
    sourceKey: "data-gov",
    sourceType: "DATASET",
    enabled: dataGovEnabled,
    supportsCurrent: false,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.75,
    search: async (query, { maxResults }) => searchDataGov(query, { maxResults })
  },
  {
    sourceKey: "citizen",
    sourceType: "CITIZEN",
    enabled: () => true,
    supportsCurrent: true,
    supportsHistorical: true,
    supportsSearch: true,
    trustWeight: 0.35,
    search: async (query, { maxResults }) => searchCitizenEvidence(query, { maxResults })
  }
];
var KNOWN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh"
];
var DISASTER_TYPES = [
  "Flood",
  "Cyclone",
  "Earthquake",
  "Landslide",
  "Heavy Rain",
  "Heat Wave",
  "Cold Wave",
  "Avalanche",
  "Forest Fire",
  "Thunderstorm",
  "Lightning",
  "Drought"
];
function normalizeHistoricalQuery(raw) {
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  const yearMatch = lower.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? Number(yearMatch[0]) : null;
  const disasterType = DISASTER_TYPES.find((type) => lower.includes(type.toLowerCase())) || null;
  const state = KNOWN_STATES.find((candidate) => lower.includes(candidate.toLowerCase())) || // Common short forms.
  (lower.includes("odisha") ? "Odisha" : null) || (lower.includes("orissa") ? "Odisha" : null) || (lower.includes("pondicherry") ? "Puducherry" : null);
  const normalized = trimmed.replace(/\b(what happened|tell me about|information about|details of|history of)\b/gi, "").replace(/\s+/g, " ").trim();
  return { raw: trimmed, normalized, year, disasterType, state };
}
function dedupeEvidence(items) {
  const byIdentity = /* @__PURE__ */ new Map();
  for (const item of items) {
    const identity = `${item.sourceKey}::${item.externalId.toLowerCase()}`;
    if (!byIdentity.has(identity)) byIdentity.set(identity, item);
  }
  const byTitle = /* @__PURE__ */ new Map();
  const result = [];
  for (const item of byIdentity.values()) {
    const titleKey = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().slice(0, 120);
    const existingIdentity = byTitle.get(titleKey);
    if (existingIdentity) {
      const existing = byIdentity.get(existingIdentity);
      if (existing && item.confidence > existing.confidence) {
        result.splice(result.indexOf(existing), 1, item);
        byTitle.set(titleKey, identityKey(item));
      }
      continue;
    }
    byTitle.set(titleKey, identityKey(item));
    result.push(item);
  }
  return result;
}
function identityKey(item) {
  return `${item.sourceKey}::${item.externalId.toLowerCase()}`;
}
var TYPE_RANK = {
  OFFICIAL: 5,
  DATASET: 4,
  NEWS: 3,
  CITIZEN: 2,
  SOCIAL: 1
};
function rankEvidence(items) {
  return [...items].sort((a, b) => {
    const typeDiff = TYPE_RANK[b.sourceType] - TYPE_RANK[a.sourceType];
    if (typeDiff !== 0) return typeDiff;
    return b.confidence - a.confidence;
  });
}
function decideVerification(evidence) {
  const distinctSources = new Set(evidence.map((item) => item.sourceKey));
  const signals = evidence.map((item) => ({
    source: { source_type: item.sourceType, trust_weight: item.confidence },
    publishedAt: item.publishedAt
  }));
  const scored = verificationFromSignals(signals);
  const official = evidence.some((item) => item.sourceType === "OFFICIAL");
  const nonCorroborating = evidence.every(
    (item) => item.sourceType === "SOCIAL" || item.sourceType === "CITIZEN"
  );
  if (nonCorroborating) {
    return {
      status: "PENDING",
      score: Math.min(scored.score, 0.4),
      method: "EVIDENCE_WEIGHTED",
      reason: "Only social/citizen evidence available; corroboration from news, dataset, or official sources is required."
    };
  }
  if (official && distinctSources.has("sachet-cap")) {
    return {
      status: "OFFICIAL_VERIFIED",
      score: 1,
      method: "OFFICIAL_SOURCE",
      reason: "Authoritative government alert present; technical validation passed."
    };
  }
  const trustedIndependentSources = new Set(
    evidence.filter((item) => item.sourceType === "NEWS" || item.sourceType === "DATASET" || item.sourceType === "OFFICIAL").map((item) => item.sourceKey)
  );
  if (trustedIndependentSources.size >= 2) {
    const score = Math.max(scored.score, trustedIndependentSources.size >= 3 ? 0.72 : 0.58);
    return {
      status: trustedIndependentSources.size >= 3 ? "CROSS_SOURCE_VERIFIED" : "PROVISIONALLY_VERIFIED",
      score,
      method: "CROSS_SOURCE_CORROBORATION",
      reason: `Corroborated by ${trustedIndependentSources.size} independent trusted source providers.`
    };
  }
  return {
    status: scored.status,
    score: scored.score,
    method: "EVIDENCE_WEIGHTED",
    reason: `Distinct evidence sources: ${scored.distinctSources}.`
  };
}
function deterministicEventKey(nq) {
  const slug2 = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
  const parts = [
    nq.disasterType || "disaster",
    nq.state || "india",
    nq.year ? String(nq.year) : "unknown-year",
    slug2(nq.normalized).slice(0, 40) || "event"
  ];
  return parts.join("-");
}
function meaningfulTokens(value) {
  const stop = /* @__PURE__ */ new Set(["what", "happened", "during", "tell", "about", "india", "indian", "the", "and", "with", "for"]);
  return new Set(
    value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !stop.has(token))
  );
}
function isRelevantDatabaseHit(nq, hit) {
  const queryTokens = meaningfulTokens(nq.normalized);
  const hitText = `${hit.title || ""} ${hit.event_type || ""} ${hit.state || ""} ${hit.location_name || ""}`;
  const hitTokens = meaningfulTokens(hitText);
  const overlap = [...queryTokens].filter((token) => hitTokens.has(token));
  const typeOk = !nq.disasterType || (hit.event_type || "").toLowerCase().includes(nq.disasterType.toLowerCase());
  const stateOk = !nq.state || hitText.toLowerCase().includes(nq.state.toLowerCase());
  const namedQueryTokens = [...queryTokens].filter((token) => token !== (nq.disasterType || "").toLowerCase());
  const namedOk = namedQueryTokens.length === 0 || namedQueryTokens.some((token) => hitTokens.has(token));
  return typeOk && stateOk && namedOk && overlap.length > 0;
}
async function persistResearchResult(nq, evidence, verification) {
  const out = {
    eventId: null,
    eventKey: null,
    verification,
    observationsPersisted: 0,
    documentsPersisted: 0,
    embedded: false,
    errors: []
  };
  if (!isSupabaseConfigured() || evidence.length === 0) {
    out.errors.push("Persistence skipped: database unavailable or no evidence.");
    return out;
  }
  const eventKey = deterministicEventKey(nq);
  try {
    const upserted = await supabaseRest(
      "canonical_events?on_conflict=event_key",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          event_key: eventKey,
          title: nq.normalized,
          event_type: nq.disasterType || "General Alert",
          status: "ENDED",
          severity: "Unknown",
          description: evidence[0]?.content?.slice(0, 2e3) || null,
          location_name: nq.state || "India",
          state: nq.state,
          started_at: nq.year ? `${nq.year}-01-01T00:00:00Z` : evidence[0]?.eventDate || null,
          verification_status: verification.status,
          verification_score: verification.score,
          verification_method: verification.method,
          verification_reason: verification.reason
        })
      }
    );
    let eventId = upserted?.[0]?.id || null;
    if (!eventId) {
      const existing = await supabaseRest(
        `canonical_events?event_key=eq.${encodeURIComponent(eventKey)}&select=id&limit=1`,
        { method: "GET" }
      );
      eventId = existing[0]?.id || null;
    }
    if (!eventId) throw new Error("Canonical event upsert returned no id");
    out.eventId = eventId;
    out.eventKey = eventKey;
    for (const item of evidence) {
      try {
        const source = await resolveSource(item.sourceKey);
        const hash = contentHash(`${item.title}|${item.content}|${item.url || ""}`);
        const inserted = await supabaseRest(
          "source_observations?on_conflict=source_id,content_hash",
          {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=representation" },
            body: JSON.stringify({
              source_id: source.id,
              external_id: item.externalId,
              content_hash: hash,
              title: item.title.slice(0, 500),
              raw_content: item.content.slice(0, 8e3),
              raw_payload: item.metadata || {},
              source_url: item.url,
              publisher: item.publisher,
              published_at: item.publishedAt,
              retrieved_at: item.retrievedAt,
              location_text: item.locationText,
              event_category: item.disasterType
            })
          }
        );
        let observationId = inserted[0]?.id || null;
        if (!observationId) {
          const existing = await supabaseRest(
            `source_observations?and=(source_id.eq.${source.id},content_hash.eq.${hash})&select=id&limit=1`,
            { method: "GET" }
          ).catch(() => []);
          observationId = existing[0]?.id || null;
        }
        if (!observationId) {
          out.errors.push(`Observation upsert returned no id for ${item.sourceKey}`);
          continue;
        }
        out.observationsPersisted += 1;
        await supabaseRest("event_sources?on_conflict=event_id,source_id,source_observation_id", {
          method: "POST",
          headers: { Prefer: "resolution=ignore-duplicates" },
          body: JSON.stringify({
            event_id: eventId,
            source_id: source.id,
            source_observation_id: observationId
          })
        });
        await supabaseRest("event_observations?on_conflict=event_id,observation_id", {
          method: "POST",
          headers: { Prefer: "resolution=ignore-duplicates" },
          body: JSON.stringify({
            event_id: eventId,
            observation_id: observationId
          })
        }).catch(() => void 0);
      } catch (error) {
        out.errors.push(`${item.sourceKey}: ${error.message.slice(0, 200)}`);
      }
    }
    const docId = await upsertSearchDocument({
      documentType: "canonical_event",
      eventId,
      title: nq.normalized,
      content: evidence.slice(0, 5).map((item) => `${item.title}. ${item.content}`).join(" ").slice(0, 4e3),
      sourceUrl: evidence.find((item) => item.url)?.url || null
    });
    if (docId) {
      out.documentsPersisted += 1;
      out.embedded = await embedAndStoreSearchDocument(docId, nq.normalized);
    }
  } catch (error) {
    out.errors.push(error.message.slice(0, 300));
  }
  return out;
}
async function searchDatabaseFirst(nq) {
  if (!isSupabaseConfigured()) return null;
  const lexical = await searchCanonicalEventsLexical(nq.normalized, 5);
  const best = lexical.find((event) => isRelevantDatabaseHit(nq, {
    title: event.title,
    event_type: event.eventType,
    state: event.state || null,
    location_name: event.locationName
  })) || null;
  if (best) {
    return {
      event: {
        id: best.id,
        eventKey: best.eventKey,
        title: best.title,
        verificationStatus: best.verificationStatus,
        verificationScore: best.verificationScore
      },
      citations: (best.citations || []).map((citation, index) => ({
        citationId: citation.id || `S${index + 1}`,
        sourceKey: "google-news-rss",
        sourceType: citation.sourceType || "NEWS",
        publisher: citation.publisher || null,
        title: citation.title,
        url: citation.url || null,
        publishedAt: citation.publishedAt || null,
        retrievedAt: citation.retrievedAt || (/* @__PURE__ */ new Date()).toISOString(),
        summary: citation.summary || ""
      }))
    };
  }
  const vectorHits = (await vectorEventSearch(nq.normalized, 5, 0.55)).filter((hit) => isRelevantDatabaseHit(nq, hit));
  if (vectorHits.length > 0) {
    const rows = await supabaseRest(
      `canonical_events?id=in.(${vectorHits.map((hit) => hit.event_id).join(",")})&select=id,event_key,title,verification_status,verification_score&limit=1`,
      { method: "GET" }
    ).catch(() => []);
    const row = rows[0];
    const statusText = row ? String(row.verification_status) : "";
    if (row && PUBLIC_VERIFICATION_STATUSES2.includes(statusText)) {
      return {
        event: {
          id: String(row.id),
          eventKey: String(row.event_key || ""),
          title: String(row.title),
          verificationStatus: String(row.verification_status),
          verificationScore: Number(row.verification_score || 0)
        },
        citations: []
      };
    }
  }
  return null;
}
async function researchHistoricalDisaster(query, options = {}) {
  const { historical = true, forceResearch = false, sources, maxResultsPerSource = 6 } = options;
  const nq = normalizeHistoricalQuery(query);
  const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
  const retrieval = {
    dbSearched: false,
    dbMatch: false,
    sourcesQueried: [],
    sourcesSucceeded: [],
    sourcesFailed: [],
    evidenceCount: 0,
    retrievedAt
  };
  if (!forceResearch) {
    const dbHit = await searchDatabaseFirst(nq);
    retrieval.dbSearched = true;
    if (dbHit) {
      retrieval.dbMatch = true;
      return {
        query,
        source: "database",
        event: dbHit.event,
        citations: dbHit.citations,
        evidence: [],
        verification: null,
        retrieval,
        persistence: null
      };
    }
  }
  const providers = PROVIDER_REGISTRY.filter((provider2) => {
    if (!provider2.enabled() || !provider2.supportsSearch) return false;
    if (historical && !provider2.supportsHistorical) return false;
    if (sources && sources.length > 0 && !sources.includes(provider2.sourceKey)) return false;
    return true;
  });
  const settled = await Promise.allSettled(
    providers.map(async (provider2) => {
      const items = await provider2.search(nq.normalized, { historical, maxResults: maxResultsPerSource });
      return { provider: provider2, items };
    })
  );
  const evidence = [];
  for (let i = 0; i < settled.length; i += 1) {
    const provider2 = providers[i];
    retrieval.sourcesQueried.push(provider2.sourceKey);
    const outcome = settled[i];
    if (outcome.status === "fulfilled") {
      evidence.push(...outcome.value.items);
      retrieval.sourcesSucceeded.push(provider2.sourceKey);
    } else {
      retrieval.sourcesFailed.push({
        source: provider2.sourceKey,
        error: outcome.reason?.message?.slice(0, 200) || "Unknown provider failure"
      });
    }
  }
  retrieval.evidenceCount = evidence.length;
  const deduped = rankEvidence(dedupeEvidence(evidence));
  const verification = decideVerification(deduped);
  const citations = deduped.slice(0, 10).map((item, index) => ({
    citationId: `S${index + 1}`,
    sourceKey: item.sourceKey,
    sourceType: item.sourceType,
    publisher: item.publisher,
    title: item.title,
    url: item.url,
    publishedAt: item.publishedAt,
    retrievedAt: item.retrievedAt,
    summary: item.content.slice(0, 300)
  }));
  if (deduped.length === 0) {
    return {
      query,
      source: "none",
      event: null,
      citations: [],
      evidence: [],
      verification: {
        status: "PENDING",
        score: 0,
        method: "NO_EVIDENCE",
        reason: "No sufficiently reliable external evidence was available."
      },
      retrieval,
      persistence: null
    };
  }
  const persistence = await persistResearchResult(nq, deduped, verification);
  return {
    query,
    source: "multi_source_research",
    event: persistence.eventId ? {
      id: persistence.eventId,
      eventKey: persistence.eventKey,
      title: nq.normalized,
      verificationStatus: verification.status,
      verificationScore: verification.score
    } : null,
    citations,
    evidence: deduped,
    verification,
    retrieval,
    persistence
  };
}

// server/lib/reportRisk.ts
var INDIA_BOUNDS2 = { latMin: 6, latMax: 37.5, lngMin: 67, lngMax: 98.5 };
var QUARANTINE_THRESHOLD = 0.6;
function spamPatterns(text) {
  const factors = [];
  const urlCount = (text.match(/https?:\/\//g) || []).length;
  if (urlCount >= 2) factors.push("multiple_links");
  if (/(.)\1{9,}/.test(text)) factors.push("repeated_characters");
  const letters = text.replace(/[^A-Za-z]/g, "");
  if (letters.length > 30 && letters === letters.toUpperCase()) factors.push("all_caps_flood");
  if (/(.)\b\1\b(.)?\b\1\b/i.test(text) && text.split(/\s+/).length > 4 && new Set(text.toLowerCase().split(/\s+/)).size < 4) {
    factors.push("word_flood");
  }
  return factors;
}
function scoreReportRisk(input) {
  const factors = [];
  let score = 0;
  if (input.honeypot && input.honeypot.trim().length > 0) {
    factors.push("honeypot_filled");
    score += 0.6;
  }
  if (typeof input.elapsedMs === "number" && input.elapsedMs >= 0 && input.elapsedMs < 2e3) {
    factors.push("implausible_timing");
    score += 0.25;
  }
  const recent = input.userRecentReports || [];
  const windowStart = Date.now() - 10 * 6e4;
  const burst = recent.filter((r) => new Date(r.reportedAt).getTime() >= windowStart).length;
  if (burst >= 5) {
    factors.push("burst_submission");
    score += 0.3;
  }
  const normalize = (t) => t.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
  const currentText = normalize(input.reportText);
  if (currentText.length > 10 && recent.some((r) => normalize(r.reportText) === currentText)) {
    factors.push("repeated_text");
    score += 0.3;
  }
  if (input.latitude != null && input.longitude != null) {
    const { latitude: lat, longitude: lng } = input;
    const exactZero = lat === 0 && lng === 0;
    const outsideIndia = lat < INDIA_BOUNDS2.latMin || lat > INDIA_BOUNDS2.latMax || lng < INDIA_BOUNDS2.lngMin || lng > INDIA_BOUNDS2.lngMax;
    if (exactZero) {
      factors.push("null_island_coordinates");
      score += 0.75;
    } else if (outsideIndia) {
      factors.push("outside_india_bounds");
      score += 0.75;
    }
  }
  if (typeof input.accuracyMeters === "number" && input.accuracyMeters > 0 && input.accuracyMeters < 1) {
    factors.push("impossible_accuracy");
    score += 0.2;
  }
  factors.push(...spamPatterns(input.reportText));
  score += factors.filter((f) => ["multiple_links", "repeated_characters", "all_caps_flood", "word_flood"].includes(f)).length * 0.15;
  const riskScore = Math.min(1, Math.round(score * 100) / 100);
  return { riskScore, riskFactors: factors, quarantine: riskScore >= QUARANTINE_THRESHOLD };
}

// server/lib/insights.ts
var EMPTY = {
  overview: {
    totalEvents: 0,
    activeEvents: 0,
    severeOrExtreme: 0,
    officialVerified: 0,
    crossSourceVerified: 0,
    provisional: 0,
    avgSourcesPerEvent: 0,
    last30dCount: 0,
    prior30dCount: 0,
    monthOverMonthPct: null
  },
  trend30d: [],
  byType: [],
  byState: [],
  seasonal: [],
  riskHotspots: [],
  generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
  cacheStatus: "UNAVAILABLE"
};
var PUBLIC_STATUSES = "OFFICIAL_VERIFIED,CROSS_SOURCE_VERIFIED,PROVISIONALLY_VERIFIED";
function dayBucket(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
}
function monthOf(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.getUTCMonth() + 1;
}
async function computeInsights() {
  if (!isSupabaseConfigured()) return { ...EMPTY };
  try {
    const select = "id,event_type,status,severity,state,started_at,verification_status,source_count";
    const [activeRows, pastRows] = await Promise.all([
      supabaseRest(
        `active_canonical_events?select=${select}&verification_status=in.(${PUBLIC_STATUSES})&order=started_at.desc.nullslast&limit=1000`,
        { method: "GET" }
      ),
      supabaseRest(
        `past_canonical_events?select=${select}&verification_status=in.(${PUBLIC_STATUSES})&order=started_at.desc.nullslast&limit=1000`,
        { method: "GET" }
      )
    ]);
    const rows = [...activeRows, ...pastRows].filter(
      (row, index, all) => all.findIndex((candidate) => candidate.id === row.id) === index
    );
    if (rows.length === 0) return { ...EMPTY, cacheStatus: "MISS" };
    const now2 = Date.now();
    const day30 = now2 - 30 * 864e5;
    const day60 = now2 - 60 * 864e5;
    const overview = {
      totalEvents: rows.length,
      activeEvents: rows.filter((r) => ["DEVELOPING", "ACTIVE", "UPDATING", "ENDING"].includes(r.status)).length,
      severeOrExtreme: rows.filter((r) => r.severity === "Severe" || r.severity === "Extreme").length,
      officialVerified: rows.filter((r) => r.verification_status === "OFFICIAL_VERIFIED").length,
      crossSourceVerified: rows.filter((r) => r.verification_status === "CROSS_SOURCE_VERIFIED").length,
      provisional: rows.filter((r) => r.verification_status === "PROVISIONALLY_VERIFIED").length,
      avgSourcesPerEvent: Math.round(rows.reduce((sum, r) => sum + Number(r.source_count || 0), 0) / rows.length * 10) / 10,
      last30dCount: 0,
      prior30dCount: 0,
      monthOverMonthPct: null
    };
    const trendMap = /* @__PURE__ */ new Map();
    for (let i = 29; i >= 0; i -= 1) {
      trendMap.set(new Date(now2 - i * 864e5).toISOString().slice(0, 10), 0);
    }
    const seasonalCounts = /* @__PURE__ */ new Map();
    for (const row of rows) {
      const started = row.started_at ? new Date(row.started_at).getTime() : null;
      if (started != null && Number.isFinite(started)) {
        if (started >= day30) {
          overview.last30dCount += 1;
          const bucket = dayBucket(row.started_at);
          if (bucket && trendMap.has(bucket)) trendMap.set(bucket, (trendMap.get(bucket) || 0) + 1);
        } else if (started >= day60) {
          overview.prior30dCount += 1;
        }
        const month = monthOf(row.started_at);
        if (month) seasonalCounts.set(month, (seasonalCounts.get(month) || 0) + 1);
      }
    }
    if (overview.prior30dCount > 0) {
      overview.monthOverMonthPct = Math.round((overview.last30dCount - overview.prior30dCount) / overview.prior30dCount * 100);
    }
    const byTypeMap = /* @__PURE__ */ new Map();
    const byStateMap = /* @__PURE__ */ new Map();
    for (const row of rows) {
      const type = byTypeMap.get(row.event_type) || { eventType: row.event_type, count: 0, severeCount: 0 };
      type.count += 1;
      if (row.severity === "Severe" || row.severity === "Extreme") type.severeCount += 1;
      byTypeMap.set(row.event_type, type);
      if (row.state) {
        const state = byStateMap.get(row.state) || { state: row.state, count: 0, severeCount: 0 };
        state.count += 1;
        if (row.severity === "Severe" || row.severity === "Extreme") state.severeCount += 1;
        byStateMap.set(row.state, state);
      }
    }
    const riskHotspots = [...byStateMap.values()].map((state) => {
      const activeRows2 = rows.filter((r) => r.state === state.state && ["DEVELOPING", "ACTIVE", "UPDATING", "ENDING"].includes(r.status));
      const activeSevere = activeRows2.filter((r) => r.severity === "Severe" || r.severity === "Extreme").length;
      const riskScore = Math.min(100, Math.round(activeSevere * 40 + activeRows2.length * 15));
      return { state: state.state, activeSevere, activeTotal: activeRows2.length, riskScore };
    }).filter((h) => h.activeTotal > 0).sort((a, b) => b.riskScore - a.riskScore).slice(0, 8);
    return {
      overview,
      trend30d: [...trendMap.entries()].map(([bucket, count]) => ({ bucket, count })),
      byType: [...byTypeMap.values()].sort((a, b) => b.count - a.count),
      byState: [...byStateMap.values()].sort((a, b) => b.count - a.count).slice(0, 12),
      seasonal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => ({ month, count: seasonalCounts.get(month) || 0 })),
      riskHotspots,
      generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
      cacheStatus: "MISS"
    };
  } catch (error) {
    console.warn("[insights] computation failed (fail-soft):", error.message);
    return { ...EMPTY };
  }
}

// server/ingestion/sourceAdapters.ts
function isMostlyEnglishText(text) {
  const letters = [...text].filter((char) => /\p{L}/u.test(char));
  if (letters.length < 12) return true;
  const latinLetters = letters.filter((char) => /\p{Script=Latin}/u.test(char));
  return latinLetters.length / letters.length >= 0.85;
}
var SachetCapAdapter = class {
  constructor() {
    this.sourceKey = "sachet-cap";
    this.type = "OFFICIAL";
  }
  async fetchRecent() {
    if (process.env.SOURCE_SACHET_ENABLED === "false") return [];
    const result = await getSachetAlerts();
    return result.alerts.filter((alert) => isMostlyEnglishText([
      alert.headline,
      alert.event,
      alert.description,
      alert.instruction,
      alert.areaDesc
    ].filter(Boolean).join(" "))).map((alert) => ({
      sourceKey: this.sourceKey,
      sourceType: this.type,
      externalId: alert.identifier,
      title: alert.headline || alert.event,
      rawContent: [alert.description, alert.instruction, alert.areaDesc].filter(Boolean).join("\n\n"),
      rawPayload: alert,
      sourceUrl: alert.webUrl || alert.officialPortalUrl,
      publisher: alert.sourceAgency || alert.sender || "SACHET/CAP",
      publishedAt: alert.sent || alert.effective,
      retrievedAt: result.lastUpdated,
      locationText: alert.areaDesc,
      eventCategory: alert.category,
      instruction: alert.instruction,
      metadata: { etag: result.etag, cacheStatus: result.cacheStatus }
    }));
  }
  async healthCheck() {
    if (process.env.SOURCE_SACHET_ENABLED === "false") {
      return { sourceKey: this.sourceKey, status: "DISABLED", checkedAt: (/* @__PURE__ */ new Date()).toISOString() };
    }
    return { sourceKey: this.sourceKey, status: "OK", checkedAt: (/* @__PURE__ */ new Date()).toISOString() };
  }
};
var GoogleNewsAdapter = class {
  constructor(sourceKey = "google-news-rss", query = "India disaster weather alert") {
    this.query = query;
    this.type = "NEWS";
    this.sourceKey = sourceKey;
  }
  async fetchRecent() {
    if (process.env.SOURCE_GOOGLE_NEWS_ENABLED === "false") return [];
    const articles = await searchGoogleNews(this.query, { isCurrentNews: true, windowHours: 72, maxResults: 20 });
    const retrievedAt = (/* @__PURE__ */ new Date()).toISOString();
    return articles.map((article) => ({
      sourceKey: this.sourceKey,
      sourceType: this.type,
      externalId: article.id,
      title: article.title,
      rawContent: article.summary,
      rawPayload: article,
      sourceUrl: article.url,
      publisher: article.publisher,
      publishedAt: article.publishedAt,
      retrievedAt,
      eventCategory: void 0,
      metadata: { query: article.query || this.query, recencyVerified: article.recencyVerified }
    }));
  }
  async healthCheck() {
    if (process.env.SOURCE_GOOGLE_NEWS_ENABLED === "false") {
      return { sourceKey: this.sourceKey, status: "DISABLED", checkedAt: (/* @__PURE__ */ new Date()).toISOString() };
    }
    return { sourceKey: this.sourceKey, status: "OK", checkedAt: (/* @__PURE__ */ new Date()).toISOString() };
  }
};
function getConfiguredSourceAdapters() {
  return [
    new SachetCapAdapter(),
    new GoogleNewsAdapter("google-news-rss", "India disaster weather alert"),
    new GoogleNewsAdapter("national-news", "site:thehindu.com OR site:indianexpress.com OR site:hindustantimes.com India flood cyclone earthquake landslide weather alert"),
    new GoogleNewsAdapter("regional-news", "India state regional news flood cyclone heavy rain landslide alert")
  ];
}

// server/lib/geocoding.ts
var GEOCODE_CACHE_TTL = 86400;
var INDIAN_STATE_CENTROIDS = {
  "andhra pradesh": { lat: 15.9129, lng: 79.74 },
  "arunachal pradesh": { lat: 28.218, lng: 97.133 },
  "assam": { lat: 26.2006, lng: 92.9376 },
  "bihar": { lat: 25.0961, lng: 85.3131 },
  "chhattisgarh": { lat: 21.2787, lng: 81.8661 },
  "goa": { lat: 15.2993, lng: 74.124 },
  "gujarat": { lat: 22.2587, lng: 71.1924 },
  "haryana": { lat: 29.0588, lng: 76.0856 },
  "himachal pradesh": { lat: 31.1048, lng: 77.1734 },
  "jharkhand": { lat: 23.6102, lng: 85.2799 },
  "karnataka": { lat: 15.3173, lng: 75.7139 },
  "kerala": { lat: 10.8505, lng: 76.2711 },
  "madhya pradesh": { lat: 22.9734, lng: 78.6569 },
  "maharashtra": { lat: 19.7515, lng: 75.7139 },
  "manipur": { lat: 24.6637, lng: 93.9063 },
  "meghalaya": { lat: 25.467, lng: 91.3662 },
  "mizoram": { lat: 23.1643, lng: 92.9376 },
  "nagaland": { lat: 26.1584, lng: 94.5624 },
  "odisha": { lat: 20.9517, lng: 85.0985 },
  "punjab": { lat: 31.1471, lng: 75.3412 },
  "rajasthan": { lat: 27.0238, lng: 74.2179 },
  "sikkim": { lat: 27.533, lng: 88.5122 },
  "tamil nadu": { lat: 11.1271, lng: 78.6569 },
  "telangana": { lat: 18.1124, lng: 79.0193 },
  "tripura": { lat: 23.9408, lng: 91.9882 },
  "uttar pradesh": { lat: 26.8467, lng: 80.9462 },
  "uttarakhand": { lat: 30.0668, lng: 79.0193 },
  "west bengal": { lat: 22.9868, lng: 87.855 },
  "delhi": { lat: 28.7041, lng: 77.1025 },
  "jammu and kashmir": { lat: 33.7782, lng: 76.5762 },
  "ladakh": { lat: 34.1526, lng: 77.5771 }
};
function extractLocationsFromText(text) {
  const lower = text.toLowerCase();
  let state;
  let city;
  let district;
  for (const [stateName] of Object.entries(INDIAN_STATE_CENTROIDS)) {
    if (lower.includes(stateName)) {
      state = stateName.replace(/\b\w/g, (c) => c.toUpperCase());
      break;
    }
  }
  const cityPatterns = [
    /(?:in|near|from|at|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:district|city|town|village)/gi
  ];
  for (const pattern of cityPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const candidate = match[1] || match[0];
      if (candidate.length >= 3 && candidate.length <= 40) {
        city = candidate.trim();
        break;
      }
    }
    if (city) break;
  }
  const districtMatch = text.match(/(\w+(?:\s+\w+)?)\s+district/i);
  if (districtMatch) {
    district = districtMatch[1].trim();
  }
  return { city, state, district };
}
async function geocodeLocation(locationText) {
  const cacheKey = `geo:${locationText.toLowerCase().trim()}`;
  const cached = cache.get("geocode", cacheKey);
  if (cached) return cached;
  const { city, state, district } = extractLocationsFromText(locationText);
  try {
    const query = encodeURIComponent(locationText);
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&addressdetails=1&q=${query}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AapdaDrishti/1.0 (disaster-intelligence)",
        Accept: "application/json"
      }
    });
    if (response.ok) {
      const results = await response.json();
      if (Array.isArray(results) && results.length > 0) {
        const item = results[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          const result = {
            lat,
            lng,
            confidence: 0.85,
            resolvedName: item.display_name || locationText,
            city: city || item.address?.city || item.address?.town || void 0,
            district: district || item.address?.county || item.address?.district || void 0,
            state: state || item.address?.state || void 0,
            country: item.address?.country || "India"
          };
          cache.set("geocode", cacheKey, result, GEOCODE_CACHE_TTL);
          return result;
        }
      }
    }
  } catch {
  }
  if (state) {
    const stateKey = state.toLowerCase();
    const centroid = INDIAN_STATE_CENTROIDS[stateKey];
    if (centroid) {
      const result = {
        lat: centroid.lat,
        lng: centroid.lng,
        confidence: 0.4,
        resolvedName: `${state}, India (approximate centroid)`,
        state,
        country: "India"
      };
      cache.set("geocode", cacheKey, result, GEOCODE_CACHE_TTL);
      return result;
    }
  }
  return null;
}

// server/lib/correlation.ts
var CORRELATION_MATCH_THRESHOLD = 0.62;
function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function temporalOverlapDays(candidate, observedAt) {
  const ref = new Date(observedAt).getTime();
  const anchor = new Date(candidate.last_observed_at || candidate.started_at || observedAt).getTime();
  if (!Number.isFinite(ref) || !Number.isFinite(anchor)) return Number.POSITIVE_INFINITY;
  return Math.abs(ref - anchor) / 864e5;
}
function correlationScore(candidate, input) {
  let score = 0;
  if (candidate.event_type && input.eventType && candidate.event_type === input.eventType) score += 0.3;
  if (candidate.state && input.state) {
    const a = candidate.state.toLowerCase().trim();
    const b = input.state.toLowerCase().trim();
    if (a && b && (a === b || a.includes(b) || b.includes(a))) score += 0.2;
  }
  if (candidate.district && input.district) {
    const a = candidate.district.toLowerCase().trim();
    const b = input.district.toLowerCase().trim();
    if (a && b && (a === b || a.includes(b) || b.includes(a))) score += 0.1;
  }
  if (candidate.latitude != null && candidate.longitude != null && input.lat != null && input.lng != null) {
    const km = haversineKm(candidate.latitude, candidate.longitude, input.lat, input.lng);
    const geo = Math.max(0, 1 - km / 300);
    score += 0.25 * geo;
  }
  const days = temporalOverlapDays(candidate, input.observedAt);
  if (Number.isFinite(days)) {
    const temporal = Math.max(0, 1 - days / 14);
    score += 0.1 * temporal;
  }
  score += 0.05 * titleSimilarity(candidate.title || "", input.title || "");
  return Math.min(1, Math.round(score * 1e3) / 1e3);
}
function findBestCorrelation(candidates, input) {
  let best = null;
  for (const candidate of candidates) {
    const score = correlationScore(candidate, input);
    if (score >= CORRELATION_MATCH_THRESHOLD && (!best || score > best.score)) {
      best = { id: candidate.id, score };
    }
  }
  return best;
}

// server/jobs/jobRunner.ts
async function startJobRun(jobType) {
  try {
    const rows = await supabaseRest("job_runs", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        job_type: jobType,
        status: "RUNNING",
        started_at: (/* @__PURE__ */ new Date()).toISOString()
      })
    });
    return rows[0]?.id || null;
  } catch (err) {
    console.warn(`Failed to start job run for ${jobType}:`, err.message);
    return null;
  }
}
async function finishJobRun(runId, result, metadata) {
  try {
    await supabaseRest(`job_runs?id=eq.${runId}`, {
      method: "PATCH",
      body: JSON.stringify({
        status: result.status,
        finished_at: (/* @__PURE__ */ new Date()).toISOString(),
        records_processed: result.recordsProcessed,
        records_created: result.recordsCreated,
        records_updated: result.recordsUpdated,
        records_rejected: result.recordsRejected,
        error_message: result.errorMessage || null,
        ...metadata ? { metadata } : {}
      })
    });
  } catch (err) {
    console.warn(`Failed to finish job run ${runId}:`, err.message);
  }
}
async function recordSourceHealth(sourceKey, params) {
  try {
    const definitions = await supabaseRest(
      `source_definitions?source_key=eq.${encodeURIComponent(sourceKey)}&select=id&limit=1`,
      { method: "GET" }
    );
    const sourceId = definitions[0]?.id;
    if (!sourceId) return;
    const payload = {
      source_id: sourceId,
      last_run: (/* @__PURE__ */ new Date()).toISOString(),
      status: params.status
    };
    if (params.lastSuccessAt) payload.last_success = params.lastSuccessAt;
    if (params.lastFailureAt) payload.last_failure = params.lastFailureAt;
    if (params.latencyMs !== void 0) payload.latency_ms = Math.round(params.latencyMs);
    if (params.recordsReceived !== void 0) payload.records_received = params.recordsReceived;
    if (params.recordsAccepted !== void 0) payload.records_accepted = params.recordsAccepted;
    if (params.recordsRejected !== void 0) payload.records_rejected = params.recordsRejected;
    if (params.errorMessage) payload.message = params.errorMessage.slice(0, 1e3);
    await supabaseRest("source_health?on_conflict=source_id", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(payload)
    });
    await supabaseRest(`source_definitions?id=eq.${sourceId}`, {
      method: "PATCH",
      body: JSON.stringify({
        health_status: params.status,
        ...params.lastSuccessAt ? { last_success_at: params.lastSuccessAt } : {},
        ...params.lastFailureAt ? { last_failure_at: params.lastFailureAt } : {}
      })
    }).catch(() => void 0);
  } catch (err) {
    console.warn(`Failed to record source health for ${sourceKey}:`, err.message);
  }
}

// server/jobs/ingestionJob.ts
function inferEventType(text) {
  const lower = text.toLowerCase();
  if (lower.includes("cyclone") || lower.includes("typhoon")) return "Cyclone";
  if (lower.includes("urban flood") || lower.includes("waterlogging")) return "Urban Flood";
  if (lower.includes("flood") || lower.includes("inundat")) return "Flood";
  if (lower.includes("earthquake") || lower.includes("quake") || lower.includes("seismic")) return "Earthquake";
  if (lower.includes("landslide") || lower.includes("mudslide")) return "Landslide";
  if (lower.includes("heat wave") || lower.includes("heatwave")) return "Heat Wave";
  if (lower.includes("cold wave") || lower.includes("coldwave") || lower.includes("frost")) return "Cold Wave";
  if (lower.includes("thunderstorm")) return "Thunderstorm";
  if (lower.includes("lightning")) return "Lightning";
  if (lower.includes("heavy rain") || lower.includes("torrential") || lower.includes("downpour")) return "Heavy Rain";
  if (lower.includes("forest fire") || lower.includes("wildfire")) return "Forest Fire";
  if (lower.includes("drought")) return "Drought";
  if (lower.includes("avalanche")) return "Avalanche";
  if (lower.includes("tsunami")) return "Tsunami";
  if (lower.includes("air quality") || lower.includes("pollution") || lower.includes("smog")) return "Air Pollution";
  if (lower.includes("storm") || lower.includes("gale") || lower.includes("squall")) return "Storm";
  return "General Alert";
}
function inferSeverity(text, sourceType) {
  const lower = text.toLowerCase();
  if (lower.includes("extreme") || lower.includes("catastrophic") || lower.includes("super cyclone")) return "Extreme";
  if (lower.includes("severe") || lower.includes("dangerous") || lower.includes("critical") || lower.includes("red alert")) return "Severe";
  if (lower.includes("moderate") || lower.includes("orange alert") || lower.includes("warning")) return "Moderate";
  if (lower.includes("minor") || lower.includes("advisory") || lower.includes("yellow alert")) return "Minor";
  if (sourceType === "OFFICIAL") return "Moderate";
  return "Unknown";
}
function buildEventKey(eventType, location, dateStr) {
  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${normalize(eventType)}-${normalize(location)}-${dateStr}`.slice(0, 120);
}
async function normalizeObservation(raw, source) {
  const title = raw.title || "Untitled";
  const description = raw.rawContent || "";
  const locationText = raw.locationText || description.slice(0, 400);
  const { city, district, state } = extractLocationsFromText(locationText);
  const eventType = raw.eventCategory && raw.eventCategory !== "Met" && raw.eventCategory !== "Safety" ? raw.eventCategory : inferEventType(`${title} ${description}`);
  const severity = inferSeverity(`${title} ${description}`, source.sourceType);
  const hash = contentHash(`${title}
${description}`);
  let lat;
  let lng;
  if (raw.metadata && typeof raw.metadata === "object") {
    const md = raw.metadata;
    if (typeof md.lat === "number" && typeof md.lng === "number") {
      lat = md.lat;
      lng = md.lng;
    }
  }
  if (lat === void 0 || lng === void 0) {
    const geocoded = await geocodeLocation(locationText);
    if (geocoded) {
      lat = geocoded.lat;
      lng = geocoded.lng;
    }
  }
  return {
    rawPayloadJson: raw.rawPayload,
    sourceKey: raw.sourceKey,
    sourceId: source.id,
    sourceType: source.sourceType,
    trustWeight: source.trustWeight,
    externalId: raw.externalId,
    title,
    description,
    sourceUrl: raw.sourceUrl || "",
    publisher: raw.publisher || raw.sourceKey,
    publishedAt: raw.publishedAt || (/* @__PURE__ */ new Date()).toISOString(),
    retrievedAt: raw.retrievedAt,
    locationText,
    eventType,
    severity,
    instruction: raw.instruction || null,
    contentHash: hash,
    lat,
    lng,
    city,
    district,
    state
  };
}
async function isDuplicateObservation(obs) {
  const bySourceHash = await supabaseRest(
    `source_observations?and=(source_id.eq.${obs.sourceId},content_hash.eq.${obs.contentHash})&select=id&limit=1`,
    { method: "GET" }
  ).catch(() => []);
  if (bySourceHash.length > 0) return true;
  const byExternal = await supabaseRest(
    `source_observations?and=(source_id.eq.${obs.sourceId},external_id.eq.${encodeURIComponent(obs.externalId)})&select=id&limit=1`,
    { method: "GET" }
  ).catch(() => []);
  if (byExternal.length > 0) return true;
  return false;
}
async function loadCorrelationCandidates() {
  return supabaseRest(
    `active_canonical_events?select=id,title,event_type,state,district,latitude,longitude,last_observed_at,started_at&limit=100`,
    { method: "GET" }
  ).catch(() => []);
}
async function storeObservation(obs) {
  const geometryWkt = obs.lat !== void 0 && obs.lng !== void 0 ? `SRID=4326;POINT(${obs.lng} ${obs.lat})` : null;
  try {
    const rows = await supabaseRest(
      "source_observations?on_conflict=source_id,content_hash",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          source_id: obs.sourceId,
          external_id: obs.externalId,
          title: obs.title.slice(0, 500),
          raw_content: obs.description.slice(0, 8e3),
          raw_payload: obs.rawPayloadJson ?? {},
          source_url: obs.sourceUrl.slice(0, 2e3) || null,
          publisher: obs.publisher.slice(0, 200),
          published_at: obs.publishedAt,
          retrieved_at: obs.retrievedAt,
          location_text: obs.locationText.slice(0, 500) || null,
          geometry: geometryWkt,
          event_category: obs.eventType,
          content_hash: obs.contentHash
        })
      }
    );
    if (rows[0]?.id) return rows[0].id;
    const existing = await supabaseRest(
      `source_observations?and=(source_id.eq.${obs.sourceId},content_hash.eq.${obs.contentHash})&select=id&limit=1`,
      { method: "GET" }
    ).catch(() => []);
    return existing[0]?.id || null;
  } catch (err) {
    console.warn("Failed to store observation:", err.message);
    return null;
  }
}
async function linkEventToObservation(eventId, observationId, sourceId, matchScore, relationship, citationId) {
  await supabaseRest("event_observations?on_conflict=event_id,observation_id", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates" },
    body: JSON.stringify({ event_id: eventId, observation_id: observationId, match_score: matchScore, relationship })
  }).catch((err) => console.warn("event_observations link failed:", err.message));
  await supabaseRest("event_sources?on_conflict=event_id,source_id,source_observation_id", {
    method: "POST",
    headers: { Prefer: "resolution=ignore-duplicates" },
    body: JSON.stringify({ event_id: eventId, source_id: sourceId, source_observation_id: observationId, citation_id: citationId })
  }).catch((err) => console.warn("event_sources link failed:", err.message));
}
async function createCanonicalEvent(obs, observationId) {
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  const dateStr = new Date(obs.publishedAt).toISOString().split("T")[0] || now2.split("T")[0];
  const eventKey = buildEventKey(obs.eventType, obs.state || obs.city || "india", dateStr);
  const geometryWkt = obs.lat !== void 0 && obs.lng !== void 0 ? `SRID=4326;POINT(${obs.lng} ${obs.lat})` : null;
  const verification = verificationFromSignals([
    { source: { source_type: obs.sourceType, trust_weight: obs.trustWeight }, observationId, publishedAt: obs.publishedAt }
  ]);
  try {
    const rows = await supabaseRest(
      "canonical_events?on_conflict=event_key",
      {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          event_key: eventKey,
          title: obs.title.slice(0, 500),
          event_type: obs.eventType,
          status: "DEVELOPING",
          severity: obs.severity,
          urgency: obs.sourceType === "OFFICIAL" ? "Immediate" : "Expected",
          certainty: "Observed",
          description: obs.description.slice(0, 5e3) || obs.title.slice(0, 500),
          instruction: obs.instruction,
          location_name: [obs.city, obs.district, obs.state].filter(Boolean).join(", ").slice(0, 500) || obs.locationText.slice(0, 500) || "India",
          city: obs.city || null,
          district: obs.district || null,
          state: obs.state || null,
          country: "India",
          geometry: geometryWkt,
          centroid: geometryWkt,
          started_at: obs.publishedAt,
          last_observed_at: now2,
          last_verified_at: now2,
          present_until: new Date(Date.now() + 36 * 3600 * 1e3).toISOString(),
          verification_status: verification.status,
          verification_score: verification.score,
          verification_method: "SOURCE_WEIGHTED",
          verification_reason: `Initial observation from ${obs.publisher} (${obs.sourceType}).`,
          location_confidence: obs.lat !== void 0 ? 0.8 : 0.4
        })
      }
    );
    const eventId = rows[0]?.id;
    if (!eventId) return null;
    await linkEventToObservation(eventId, observationId, obs.sourceId, 1, "CREATE_NEW", `S1-${observationId.slice(0, 8)}`);
    return eventId;
  } catch (err) {
    console.warn("Failed to upsert canonical event:", err.message);
    return null;
  }
}
async function attachToEvent(obs, observationId, eventId, matchScore) {
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  await supabaseRest(`canonical_events?id=eq.${eventId}`, {
    method: "PATCH",
    body: JSON.stringify({ last_observed_at: now2, present_until: new Date(Date.now() + 36 * 3600 * 1e3).toISOString() })
  }).catch((err) => console.warn("event refresh failed:", err.message));
  await linkEventToObservation(eventId, observationId, obs.sourceId, matchScore, "ATTACH_EXISTING", `S-${observationId.slice(0, 8)}`);
  const linked = await supabaseRest(
    `event_sources?event_id=eq.${eventId}&select=source_id`,
    { method: "GET" }
  ).catch(() => []);
  const definitions = await supabaseRest(
    linked.length ? `source_definitions?id=in.(${linked.map((l) => l.source_id).join(",")})&select=id,source_type,trust_weight` : "source_definitions?id=eq.00000000-0000-0000-0000-000000000000&select=id,source_type,trust_weight",
    { method: "GET" }
  ).catch(() => []);
  const verification = verificationFromSignals(
    definitions.map((d) => ({ source: { source_type: d.source_type, trust_weight: d.trust_weight }, publishedAt: obs.publishedAt }))
  );
  await supabaseRest(`canonical_events?id=eq.${eventId}`, {
    method: "PATCH",
    body: JSON.stringify({
      verification_status: verification.status,
      verification_score: verification.score,
      last_verified_at: now2
    })
  }).catch((err) => console.warn("verification update failed:", err.message));
}
async function persistEventSearchDocument(eventId, obs) {
  const docId = await upsertSearchDocument({
    documentType: "canonical_event",
    eventId,
    title: obs.title,
    content: `${obs.eventType}. ${obs.locationText}. ${obs.description}`.slice(0, 4e3),
    sourceUrl: obs.sourceUrl || null
  });
  if (docId) await embedAndStoreSearchDocument(docId, `${obs.title}. ${obs.description}`);
  await embedAndStoreEvent(eventId, `${obs.title}. ${obs.eventType}. ${obs.locationText}. ${obs.description}`);
}
async function runIngestionJob() {
  const runId = await startJobRun("ingestion");
  const result = {
    jobType: "ingestion",
    status: "COMPLETED",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0
  };
  if (!isSupabaseConfigured()) {
    result.status = "FAILED";
    result.errorMessage = "Supabase is not configured";
    if (runId) await finishJobRun(runId, result);
    return result;
  }
  const adapters = getConfiguredSourceAdapters();
  let sawFailure = false;
  for (const adapter of adapters) {
    const startTime = Date.now();
    let observations = [];
    try {
      observations = await adapter.fetchRecent();
    } catch (err) {
      sawFailure = true;
      await recordSourceHealth(adapter.sourceKey, {
        status: "DOWN",
        lastFailureAt: (/* @__PURE__ */ new Date()).toISOString(),
        errorMessage: err.message
      });
      continue;
    }
    const latency = Date.now() - startTime;
    const source = await resolveSource(adapter.sourceKey);
    let accepted = 0;
    let rejected = 0;
    for (const raw of observations) {
      result.recordsProcessed++;
      const normalized = await normalizeObservation(raw, {
        id: source.id,
        sourceType: source.source_type,
        trustWeight: Number(source.trust_weight)
      });
      if (await isDuplicateObservation(normalized)) {
        rejected++;
        result.recordsRejected++;
        continue;
      }
      const observationId = await storeObservation(normalized);
      if (!observationId) {
        rejected++;
        result.recordsRejected++;
        continue;
      }
      const candidates = await loadCorrelationCandidates();
      const match = findBestCorrelation(candidates, {
        eventType: normalized.eventType,
        state: normalized.state,
        district: normalized.district,
        lat: normalized.lat ?? null,
        lng: normalized.lng ?? null,
        observedAt: normalized.publishedAt,
        title: normalized.title
      });
      let eventId = null;
      if (match) {
        await attachToEvent(normalized, observationId, match.id, match.score);
        eventId = match.id;
        result.recordsUpdated++;
      } else {
        eventId = await createCanonicalEvent(normalized, observationId);
        if (eventId) result.recordsCreated++;
      }
      if (eventId) {
        accepted++;
        await persistEventSearchDocument(eventId, normalized);
        await embedAndStoreSourceObservation(observationId, `${normalized.title}. ${normalized.description}`);
      } else {
        rejected++;
        result.recordsRejected++;
      }
    }
    await recordSourceHealth(adapter.sourceKey, {
      status: accepted > 0 ? "UP" : rejected > 0 ? "DEGRADED" : "UP",
      lastSuccessAt: (/* @__PURE__ */ new Date()).toISOString(),
      latencyMs: latency,
      recordsReceived: observations.length,
      recordsAccepted: accepted,
      recordsRejected: rejected
    });
  }
  result.status = sawFailure ? "PARTIAL" : "COMPLETED";
  if (runId) await finishJobRun(runId, result);
  return result;
}

// server/jobs/reconciliationJob.ts
async function runReconciliationJob() {
  const runId = await startJobRun("reconciliation");
  const result = {
    jobType: "reconciliation",
    status: "COMPLETED",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0
  };
  if (!isSupabaseConfigured()) {
    result.status = "FAILED";
    result.errorMessage = "Supabase is not configured";
    if (runId) await finishJobRun(runId, result);
    return result;
  }
  try {
    const events = await supabaseRest(
      "canonical_events?status=in.(DEVELOPING,ACTIVE,UPDATING)&select=id,severity,verification_status,verification_score&limit=200",
      { method: "GET" }
    );
    for (const event of events) {
      result.recordsProcessed++;
      const links = await supabaseRest(
        `event_sources?event_id=eq.${event.id}&select=source_id`,
        { method: "GET" }
      ).catch(() => []);
      if (links.length === 0) continue;
      const definitions = await supabaseRest(
        `source_definitions?id=in.(${links.map((l) => l.source_id).join(",")})&select=source_type,trust_weight`,
        { method: "GET" }
      ).catch(() => []);
      if (definitions.length === 0) continue;
      const verification = verificationFromSignals(
        definitions.map((d) => ({ source: { source_type: d.source_type, trust_weight: Number(d.trust_weight) } }))
      );
      const severityClaims = await supabaseRest(
        `event_observations?event_id=eq.${event.id}&select=observation_id`,
        { method: "GET" }
      ).catch(() => []);
      const observationIds = severityClaims.map((row) => row.observation_id);
      let resolvedSeverity = null;
      if (observationIds.length) {
        const observations = await supabaseRest(
          `source_observations?id=in.(${observationIds.filter(Boolean).join(",")})&select=event_category,raw_content`,
          { method: "GET" }
        ).catch(() => []);
        const severities = observations.map((o) => /extreme|catastrophic/i.test(o.raw_content || "") ? "Extreme" : /severe|red alert/i.test(o.raw_content || "") ? "Severe" : /moderate|orange alert|warning/i.test(o.raw_content || "") ? "Moderate" : /minor|advisory|yellow/i.test(o.raw_content || "") ? "Minor" : null).filter((s) => typeof s === "string");
        if (severities.length) {
          resolvedSeverity = severities.reduce((best, s) => severityValue(s) > severityValue(best) ? s : best, "Unknown");
        }
      }
      const now2 = (/* @__PURE__ */ new Date()).toISOString();
      const patch = {
        verification_status: verification.status,
        verification_score: verification.score,
        last_verified_at: now2
      };
      if (resolvedSeverity && resolvedSeverity !== event.severity) patch.severity = resolvedSeverity;
      const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
        method: "PATCH",
        body: JSON.stringify(patch)
      }).catch(() => null);
      if (updated === null) {
        result.recordsRejected++;
      } else {
        result.recordsUpdated++;
      }
    }
  } catch (err) {
    result.status = "FAILED";
    result.errorMessage = err.message;
  }
  if (runId) await finishJobRun(runId, result);
  return result;
}

// server/jobs/lifecycleJob.ts
var HOUR_MS = 36e5;
async function persistTransition(eventId, from, to, reason) {
  await supabaseRest("event_updates", {
    method: "POST",
    body: JSON.stringify({
      event_id: eventId,
      status: to,
      description: `Lifecycle: ${from} -> ${to}. ${reason}`,
      observed_at: (/* @__PURE__ */ new Date()).toISOString()
    })
  }).catch((err) => console.warn("event_updates persist failed:", err.message));
}
async function runLifecycleJob() {
  const runId = await startJobRun("lifecycle");
  const result = {
    jobType: "lifecycle",
    status: "COMPLETED",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0
  };
  if (!isSupabaseConfigured()) {
    result.status = "FAILED";
    result.errorMessage = "Supabase is not configured";
    if (runId) await finishJobRun(runId, result);
    return result;
  }
  const now2 = Date.now();
  const nowIso = new Date(now2).toISOString();
  try {
    const developing = await supabaseRest(
      "canonical_events?status=eq.DEVELOPING&select=id,verification_status,last_observed_at&limit=200",
      { method: "GET" }
    ).catch(() => []);
    for (const event of developing) {
      result.recordsProcessed++;
      const verified = event.verification_status === "OFFICIAL_VERIFIED" || event.verification_status === "CROSS_SOURCE_VERIFIED";
      const staleMs = now2 - new Date(event.last_observed_at || nowIso).getTime();
      if (verified || staleMs > 6 * HOUR_MS) {
        const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "ACTIVE" })
        }).catch(() => null);
        if (updated !== null) {
          result.recordsUpdated++;
          await persistTransition(event.id, "DEVELOPING", "ACTIVE", verified ? "Verification reached official/cross-source threshold." : "Observation window matured without contradiction.");
        } else {
          result.recordsRejected++;
        }
      }
    }
    const active = await supabaseRest(
      "canonical_events?status=eq.ACTIVE&select=id,last_observed_at,present_until,verification_status&limit=200",
      { method: "GET" }
    ).catch(() => []);
    for (const event of active) {
      result.recordsProcessed++;
      const lastObserved = new Date(event.last_observed_at || 0).getTime();
      const staleFor = now2 - lastObserved;
      const pastPresentUntil = event.present_until ? new Date(event.present_until).getTime() < now2 : false;
      if (staleFor > 48 * HOUR_MS || pastPresentUntil && event.verification_status !== "OFFICIAL_VERIFIED") {
        const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "ENDING" })
        }).catch(() => null);
        if (updated !== null) {
          result.recordsUpdated++;
          await persistTransition(event.id, "ACTIVE", "ENDING", pastPresentUntil ? "Present window elapsed." : "No fresh observations for 48 hours.");
        } else {
          result.recordsRejected++;
        }
      }
    }
    const ending = await supabaseRest(
      "canonical_events?status=eq.ENDING&select=id,last_observed_at&limit=200",
      { method: "GET" }
    ).catch(() => []);
    for (const event of ending) {
      result.recordsProcessed++;
      const staleFor = now2 - new Date(event.last_observed_at || 0).getTime();
      if (staleFor > 72 * HOUR_MS) {
        const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "ENDED", ended_at: nowIso })
        }).catch(() => null);
        if (updated !== null) {
          result.recordsUpdated++;
          await persistTransition(event.id, "ENDING", "ENDED", "No further observations after 72 hours.");
        } else {
          result.recordsRejected++;
        }
      }
    }
    const ended = await supabaseRest(
      "canonical_events?status=eq.ENDED&select=id,ended_at&limit=100",
      { method: "GET" }
    ).catch(() => []);
    for (const event of ended) {
      result.recordsProcessed++;
      const endedAt = new Date(event.ended_at || nowIso).getTime();
      if (now2 - endedAt > 30 * 24 * HOUR_MS) {
        const updated = await supabaseRest(`canonical_events?id=eq.${event.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "ARCHIVED", archived_at: nowIso })
        }).catch(() => null);
        if (updated !== null) {
          result.recordsUpdated++;
          await persistTransition(event.id, "ENDED", "ARCHIVED", "Moved to the historical archive after 30 days.");
        } else {
          result.recordsRejected++;
        }
      }
    }
  } catch (err) {
    result.status = "FAILED";
    result.errorMessage = err.message;
  }
  if (runId) await finishJobRun(runId, result);
  return result;
}

// server/jobs/embeddingJob.ts
var BATCH_SIZE = 8;
var MAX_RETRIES = 2;
function needsEmbedding(row, provider2, model, dimensions) {
  if (!row) return true;
  return row.embedding_provider !== provider2 || row.embedding_model !== model || Number(row.embedding_dimensions) !== dimensions;
}
async function generateWithRetry(text) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const embedding = await generateEmbedding(text);
    if (embedding) return embedding;
    if (attempt < MAX_RETRIES) await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  return null;
}
async function runEmbeddingJob() {
  const runId = await startJobRun("embedding");
  const result = {
    jobType: "embedding",
    status: "COMPLETED",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0
  };
  if (!isSupabaseConfigured()) {
    result.status = "FAILED";
    result.errorMessage = "Supabase is not configured";
    if (runId) await finishJobRun(runId, result);
    return result;
  }
  if (!isEmbeddingAvailable()) {
    result.status = "FAILED";
    result.errorMessage = "GEMINI_API_KEY is not configured; embeddings are unavailable";
    if (runId) await finishJobRun(runId, result);
    return result;
  }
  const provider2 = getEmbeddingProvider();
  try {
    const events = await supabaseRest(
      "canonical_events?select=id,title,description,event_type,updated_at&order=updated_at.desc&limit=300",
      { method: "GET" }
    );
    const existingEventEmbeddings = await supabaseRest(
      "event_embeddings?select=event_id,embedding_provider,embedding_model,embedding_dimensions",
      { method: "GET" }
    ).catch(() => []);
    const eventMap = new Map(existingEventEmbeddings.map((row) => [row.event_id, row]));
    for (let i = 0; i < events.length; i += BATCH_SIZE) {
      const batch = events.slice(i, i + BATCH_SIZE);
      for (const event of batch) {
        result.recordsProcessed++;
        if (!needsEmbedding(eventMap.get(event.id), provider2.providerName, provider2.modelName, provider2.dimensions)) continue;
        const text = `${event.title}. ${event.description || ""}. Type: ${event.event_type}`.trim();
        const embedding = await generateWithRetry(text);
        if (!embedding) {
          result.recordsRejected++;
          continue;
        }
        try {
          await supabaseRest("event_embeddings?on_conflict=event_id", {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=representation" },
            body: JSON.stringify({
              event_id: event.id,
              embedding: JSON.stringify(embedding),
              content_text: text.slice(0, 5e3),
              embedding_provider: provider2.providerName,
              embedding_model: provider2.modelName,
              embedding_dimensions: provider2.dimensions
            })
          });
          result.recordsCreated++;
        } catch {
          result.recordsRejected++;
        }
      }
    }
    const observations = await supabaseRest(
      "source_observations?select=id,title,raw_content&order=retrieved_at.desc&limit=300",
      { method: "GET" }
    ).catch(() => []);
    const existingObservationEmbeddings = await supabaseRest(
      "source_embeddings?select=observation_id,embedding_provider,embedding_model,embedding_dimensions",
      { method: "GET" }
    ).catch(() => []);
    const observationMap = new Map(existingObservationEmbeddings.map((row) => [row.observation_id, row]));
    for (let i = 0; i < observations.length; i += BATCH_SIZE) {
      const batch = observations.slice(i, i + BATCH_SIZE);
      for (const observation of batch) {
        result.recordsProcessed++;
        if (!needsEmbedding(observationMap.get(observation.id), provider2.providerName, provider2.modelName, provider2.dimensions)) continue;
        const text = `${observation.title}. ${observation.raw_content || ""}`.trim();
        const embedding = await generateWithRetry(text);
        if (!embedding) {
          result.recordsRejected++;
          continue;
        }
        try {
          await supabaseRest("source_embeddings?on_conflict=observation_id", {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=representation" },
            body: JSON.stringify({
              observation_id: observation.id,
              embedding: JSON.stringify(embedding),
              content_text: text.slice(0, 5e3),
              embedding_provider: provider2.providerName,
              embedding_model: provider2.modelName,
              embedding_dimensions: provider2.dimensions
            })
          });
          result.recordsCreated++;
        } catch {
          result.recordsRejected++;
        }
      }
    }
    const documents = await supabaseRest(
      "search_documents?select=id,title,content,embedding_provider,embedding_model,embedding_dimensions&order=updated_at.desc&limit=300",
      { method: "GET" }
    ).catch(() => []);
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      for (const doc of batch) {
        result.recordsProcessed++;
        if (!needsEmbedding(doc, provider2.providerName, provider2.modelName, provider2.dimensions)) continue;
        const text = `${doc.title}. ${doc.content}`.trim();
        const embedding = await generateWithRetry(text);
        if (!embedding) {
          result.recordsRejected++;
          continue;
        }
        try {
          await supabaseRest(`search_documents?id=eq.${doc.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              embedding: JSON.stringify(embedding),
              embedding_provider: provider2.providerName,
              embedding_model: provider2.modelName,
              embedding_dimensions: provider2.dimensions
            })
          });
          result.recordsUpdated++;
        } catch {
          result.recordsRejected++;
        }
      }
    }
    if (result.recordsRejected > 0 && result.recordsCreated + result.recordsUpdated === 0) {
      result.status = "FAILED";
      result.errorMessage = "All embedding writes failed";
    } else if (result.recordsRejected > 0) {
      result.status = "PARTIAL";
    }
  } catch (err) {
    result.status = "FAILED";
    result.errorMessage = err.message;
  }
  if (runId) await finishJobRun(runId, result);
  return result;
}

// server/jobs/citizenVerificationJob.ts
var REPORT_RADIUS_KM = 25;
async function runCitizenVerificationJob() {
  const runId = await startJobRun("citizen_verification");
  const result = {
    jobType: "citizen_verification",
    status: "COMPLETED",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0
  };
  if (!isSupabaseConfigured()) {
    result.status = "FAILED";
    result.errorMessage = "Supabase is not configured";
    if (runId) await finishJobRun(runId, result);
    return result;
  }
  try {
    const pendingReports = await supabaseRest(
      "citizen_reports?status=in.(PENDING,VERIFYING)&select=id,user_id,report_text,reported_category,geometry,reported_at,risk_score,risk_factors&order=reported_at.asc&limit=50",
      { method: "GET" }
    );
    for (const report of pendingReports) {
      result.recordsProcessed++;
      const riskScore = Number(report.risk_score || 0);
      if (riskScore >= 0.6) {
        const factors = report.risk_factors || [];
        await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "REJECTED",
            verification_score: 0,
            verification_reason: `Quarantined by anti-abuse pipeline (risk ${riskScore}): ${factors.join(", ") || "heuristics"}`.slice(0, 500)
          })
        });
        result.recordsRejected++;
        continue;
      }
      const coords = report.geometry?.coordinates;
      const lat = coords ? coords[1] : null;
      const lng = coords ? coords[0] : null;
      let nearbyVerifiedCount = 0;
      let linkedEventId = null;
      if (lat != null && lng != null) {
        const nearby = await nearbyEvents(lat, lng, REPORT_RADIUS_KM);
        nearbyVerifiedCount = nearby.length;
        if (nearby.length > 0) {
          const matching = nearby.find(
            (hit) => report.reported_category && hit.event_type === report.reported_category
          );
          linkedEventId = (matching || nearby[0]).event_id;
        }
      }
      let duplicateCount = 0;
      if (lat != null && lng != null) {
        const geometryWkt = `SRID=4326;POINT(${lng} ${lat})`;
        const duplicates = await supabaseRest(
          `citizen_reports?geometry=eq.${encodeURIComponent(geometryWkt)}&select=id&limit=50`,
          { method: "GET" }
        ).catch(() => []);
        const nearbyReports = await supabaseRest(
          "citizen_reports?reported_at=gte." + encodeURIComponent(new Date(new Date(report.reported_at).getTime() - 24 * 3600 * 1e3).toISOString()) + "&select=id,geometry&limit=200",
          { method: "GET" }
        ).catch(() => []);
        const seen = new Set(duplicates.map((d) => d.id));
        for (const other of nearbyReports) {
          if (other.id === report.id || seen.has(other.id)) continue;
          const otherCoords = other.geometry?.coordinates;
          if (!otherCoords) continue;
          const dLat = (otherCoords[1] - lat) * 111.32;
          const dLng = (otherCoords[0] - lng) * 111.32 * Math.cos(lat * Math.PI / 180);
          if (Math.sqrt(dLat * dLat + dLng * dLng) <= 2) {
            seen.add(other.id);
            duplicateCount++;
          }
        }
        duplicateCount += duplicates.filter((d) => d.id !== report.id).length;
      }
      const decision = citizenReportVerification({
        reportText: report.report_text,
        category: report.reported_category,
        coords: lat != null && lng != null ? [lat, lng] : null,
        nearbyVerifiedEventCount: nearbyVerifiedCount,
        duplicateReportCount: duplicateCount
      });
      const now2 = (/* @__PURE__ */ new Date()).toISOString();
      if (decision.status === "VERIFIED" && linkedEventId) {
        await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "VERIFIED",
            verification_score: decision.score,
            verification_reason: decision.reason,
            linked_event_id: linkedEventId,
            updated_at: now2
          })
        }).catch((err) => console.warn("report update failed:", err.message));
        result.recordsUpdated++;
        continue;
      }
      if (decision.status === "DUPLICATE") {
        await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            status: "DUPLICATE",
            verification_score: decision.score,
            verification_reason: decision.reason,
            linked_event_id: linkedEventId,
            updated_at: now2
          })
        }).catch((err) => console.warn("report update failed:", err.message));
        result.recordsRejected++;
        continue;
      }
      if (decision.status === "VERIFIED" && !linkedEventId && lat != null && lng != null) {
        const geometryWkt = `SRID=4326;POINT(${lng} ${lat})`;
        const eventType = report.reported_category || "General Alert";
        const dateStr = new Date(report.reported_at).toISOString().split("T")[0];
        try {
          const rows = await supabaseRest("canonical_events", {
            method: "POST",
            headers: { Prefer: "resolution=merge-duplicates,return=representation" },
            body: JSON.stringify({
              event_key: `citizen-${eventType.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${dateStr}`,
              title: `Citizen-reported ${eventType}`,
              event_type: eventType,
              status: "DEVELOPING",
              severity: "Unknown",
              urgency: "Expected",
              certainty: "Observed",
              description: report.report_text.slice(0, 5e3),
              location_name: "Citizen reported location",
              country: "India",
              geometry: geometryWkt,
              centroid: geometryWkt,
              started_at: report.reported_at,
              last_observed_at: now2,
              last_verified_at: now2,
              present_until: new Date(Date.now() + 24 * 3600 * 1e3).toISOString(),
              verification_status: "PENDING",
              verification_score: decision.score,
              verification_method: "CITIZEN_REPORT",
              verification_reason: decision.reason,
              location_confidence: 0.6
            })
          });
          if (rows[0]?.id) {
            linkedEventId = rows[0].id;
            result.recordsCreated++;
          }
        } catch (err) {
          console.warn("citizen canonical event creation failed:", err.message);
        }
      }
      await supabaseRest(`citizen_reports?id=eq.${report.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: decision.status,
          verification_score: decision.score,
          verification_reason: decision.reason,
          linked_event_id: linkedEventId,
          updated_at: now2
        })
      }).catch((err) => console.warn("report update failed:", err.message));
      if (decision.status === "VERIFIED") result.recordsUpdated++;
      else result.recordsRejected++;
    }
  } catch (err) {
    result.status = "FAILED";
    result.errorMessage = err.message;
  }
  if (runId) await finishJobRun(runId, result);
  return result;
}

// server/providers/notifications.ts
var ResendEmailProvider = class {
  constructor(apiKey, from) {
    this.apiKey = apiKey;
    this.from = from;
  }
  async send(params) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: this.from,
          to: params.to,
          subject: params.subject,
          html: params.html
        })
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        return { success: false, error: `Resend HTTP ${response.status}: ${text.slice(0, 300)}` };
      }
      const data = await response.json();
      return { success: true, messageId: data.id };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
var TwilioSmsProvider = class {
  constructor(accountSid, authToken, fromNumber) {
    this.accountSid = accountSid;
    this.authToken = authToken;
    this.fromNumber = fromNumber;
  }
  async send(params) {
    try {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const body = new URLSearchParams({
        To: params.to,
        From: this.fromNumber,
        Body: params.body
      });
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        return { success: false, error: `Twilio HTTP ${response.status}: ${text.slice(0, 300)}` };
      }
      const data = await response.json();
      return { success: true, messageId: data.sid };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
var Fast2SmsProvider = class {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }
  async send(params) {
    try {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: { authorization: this.apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          route: "q",
          // quick transactional route (free credits work here)
          message: params.body,
          language: "english",
          flash: 0,
          numbers: params.to.replace(/^\+91/, "").replace(/\D/g, "")
        })
      });
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
      }
      if (!response.ok || data.return === false) {
        return { success: false, error: `Fast2SMS HTTP ${response.status}: ${text.slice(0, 300)}` };
      }
      return { success: true, messageId: String(data.message || "fast2sms") };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
var Msg91Provider = class {
  constructor(authKey, senderId) {
    this.authKey = authKey;
    this.senderId = senderId;
  }
  async send(params) {
    try {
      const response = await fetch("https://api.msg91.com/api/v5/flow/", {
        method: "POST",
        headers: { authkey: this.authKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: this.senderId || "AAPDAS",
          mobiles: `91${params.to.replace(/^\+91/, "").replace(/\D/g, "")}`,
          MESSAGE: params.body
        })
      });
      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {
      }
      if (!response.ok || data.type === "error") {
        return { success: false, error: `MSG91 HTTP ${response.status}: ${text.slice(0, 300)}` };
      }
      return { success: true, messageId: data.message || "msg91" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
};
var DevSmsProvider = class {
  async send(params) {
    console.log(`[DEV SMS MODE] to=${params.to} body=${params.body.slice(0, 300)}`);
    return { success: true, messageId: "dev-mode" };
  }
};
var emailProvider = null;
var smsProvider = null;
function getEmailProvider() {
  if (emailProvider) return emailProvider;
  const providerType = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  const apiKey = process.env.EMAIL_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (providerType === "resend" && apiKey && from) {
    emailProvider = new ResendEmailProvider(apiKey, from);
    return emailProvider;
  }
  return null;
}
function getSmsProvider() {
  if (smsProvider) return smsProvider;
  const providerType = process.env.SMS_PROVIDER?.trim().toLowerCase();
  const authToken = process.env.SMS_API_KEY?.trim();
  const accountSid = process.env.SMS_ACCOUNT_SID?.trim();
  const devMode = process.env.DEV_OTP_MODE === "true";
  switch (providerType) {
    case "twilio":
      if (authToken && accountSid) {
        smsProvider = new TwilioSmsProvider(accountSid, authToken, process.env.SMS_FROM_NUMBER?.trim() || "");
      }
      break;
    case "fast2sms":
      if (authToken) {
        smsProvider = new Fast2SmsProvider(authToken);
      }
      break;
    case "msg91":
      if (authToken) {
        smsProvider = new Msg91Provider(authToken, process.env.SMS_SENDER_ID?.trim() || "AAPDAS");
      }
      break;
    case "dev":
      smsProvider = new DevSmsProvider();
      break;
    default:
      if (devMode) smsProvider = new DevSmsProvider();
      break;
  }
  return smsProvider;
}
function isEmailConfigured() {
  return getEmailProvider() !== null;
}
function isSmsConfigured() {
  return getSmsProvider() !== null;
}
async function sendNotificationEmail(params) {
  const provider2 = getEmailProvider();
  if (!provider2) return { success: false, error: "Email provider is not configured" };
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0F1B29;">Aapda Drishti Alert</h2>
      <div style="background: ${params.severity === "Extreme" ? "#FEE2E2" : "#FEF3C7"}; padding: 16px; border-radius: 8px; margin: 16px 0;">
        <strong style="color: #0F1B29;">${params.eventType}</strong>
        <span style="color: #747F8D;"> - ${params.severity}</span>
        <p style="color: #46515E; margin: 8px 0 0;">${params.location}</p>
      </div>
      <p style="color: #46515E;">${params.description}</p>
      ${params.sourceUrls.length ? `<p style="color: #747F8D; font-size: 14px;">${params.sourceUrls.map((url) => `<a href="${url}">Source</a>`).join(" | ")}</p>` : ""}
      <hr style="border: none; border-top: 1px solid #DDDDDD; margin: 16px 0;">
      <p style="color: #747F8D; font-size: 12px;">You received this because you have alerts enabled for your area. <a href="${params.platformUrl}">Manage settings</a></p>
    </div>`;
  return provider2.send({
    to: params.to,
    subject: `[Aapda Drishti] ${params.severity} ${params.eventType} - ${params.location}`,
    html
  });
}
async function sendNotificationSms(params) {
  const provider2 = getSmsProvider();
  if (!provider2) return { success: false, error: "SMS provider is not configured" };
  const body = `Aapda Drishti: ${params.severity} ${params.eventType} reported near ${params.location}. Check the platform for verified details.`;
  return provider2.send({ to: params.to, body });
}
async function recordNotification(params) {
  try {
    const existing = await supabaseRest(
      `notifications?dedupe_key=eq.${encodeURIComponent(params.dedupeKey)}&select=id,status&limit=1`,
      { method: "GET" }
    );
    if (existing[0]) {
      if (existing[0].status === "FAILED" && params.send) {
        await supabaseRest(`notifications?id=eq.${existing[0].id}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "SENDING" })
        });
        try {
          await params.send();
          await supabaseRest(`notifications?id=eq.${existing[0].id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "SENT", sent_at: (/* @__PURE__ */ new Date()).toISOString(), error_message: null })
          });
          return "created";
        } catch (err) {
          await supabaseRest(`notifications?id=eq.${existing[0].id}`, {
            method: "PATCH",
            body: JSON.stringify({ status: "FAILED", error_message: err.message.slice(0, 500) })
          });
          return "failed";
        }
      }
      await supabaseRest(`notifications?id=eq.${existing[0].id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "DEDUPLICATED" })
      }).catch(() => void 0);
      return "deduplicated";
    }
    const rows = await supabaseRest("notifications?on_conflict=dedupe_key", {
      method: "POST",
      headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
      body: JSON.stringify({
        user_id: params.userId,
        event_id: params.eventId,
        channel: params.channel,
        status: params.send ? "QUEUED" : "SENT",
        reason: params.reason.slice(0, 500),
        dedupe_key: params.dedupeKey,
        sent_at: params.send ? null : (/* @__PURE__ */ new Date()).toISOString()
      })
    });
    const rowId = rows[0]?.id;
    if (!rowId) {
      const raced = await supabaseRest(
        `notifications?dedupe_key=eq.${encodeURIComponent(params.dedupeKey)}&select=id,status&limit=1`,
        { method: "GET" }
      );
      return raced[0] ? "deduplicated" : "failed";
    }
    if (params.send && rowId) {
      await supabaseRest(`notifications?id=eq.${rowId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "SENDING" })
      }).catch(() => void 0);
      try {
        await params.send();
        await supabaseRest(`notifications?id=eq.${rowId}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "SENT", sent_at: (/* @__PURE__ */ new Date()).toISOString() })
        });
        return "created";
      } catch (err) {
        await supabaseRest(`notifications?id=eq.${rowId}`, {
          method: "PATCH",
          body: JSON.stringify({ status: "FAILED", error_message: err.message.slice(0, 500) })
        });
        return "failed";
      }
    }
    return "created";
  } catch (err) {
    console.warn("recordNotification failed:", err.message);
    return "failed";
  }
}

// server/jobs/notificationJob.ts
async function runNotificationJob() {
  const runId = await startJobRun("notification");
  const result = {
    jobType: "notification",
    status: "COMPLETED",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0
  };
  if (!isSupabaseConfigured()) {
    result.status = "FAILED";
    result.errorMessage = "Supabase is not configured";
    if (runId) await finishJobRun(runId, result);
    return result;
  }
  try {
    const events = await supabaseRest(
      `canonical_events?status=in.(DEVELOPING,ACTIVE,UPDATING)&verification_status=in.(${PUBLIC_VERIFICATION_STATUSES2.join(",")})&select=id,title,event_type,severity,location_name,description&limit=50`,
      { method: "GET" }
    );
    const subscriptions = await supabaseRest(
      "subscriptions?select=user_id,nearby_radius_km,severity_threshold,email_enabled,sms_enabled,push_enabled&limit=1000",
      { method: "GET" }
    ).catch(() => []);
    const profiles = await supabaseRest(
      "profiles?select=id,email,name&limit=500",
      { method: "GET" }
    ).catch(() => []);
    const profileMap = new Map(profiles.map((p) => [p.id, p]));
    const phoneRows = await supabaseRest(
      "phone_numbers?verified=eq.true&select=user_id,phone_number,verified&limit=500",
      { method: "GET" }
    ).catch(() => []);
    const phoneMap = /* @__PURE__ */ new Map();
    for (const row of phoneRows) {
      if (!phoneMap.has(row.user_id)) phoneMap.set(row.user_id, row.phone_number);
    }
    for (const event of events) {
      if (severityValue(event.severity) < severityValue("Moderate")) continue;
      result.recordsProcessed++;
      for (const sub of subscriptions) {
        const radiusKm = Math.max(1, Math.min(Number(sub.nearby_radius_km) || 50, 500));
        const userLocations = await supabaseRest(
          "rpc/user_locations_geo",
          {
            method: "POST",
            body: JSON.stringify({ p_user_id: sub.user_id }),
            headers: { select: "id,latitude,longitude" }
          }
        ).catch(() => []);
        for (const loc of userLocations) {
          if (loc.latitude == null || loc.longitude == null) continue;
          const nearby = await nearbyEvents(loc.latitude, loc.longitude, radiusKm);
          const hit = nearby.find((n) => n.event_id === event.id);
          if (!hit) continue;
          if (severityValue(event.severity) < severityValue(sub.severity_threshold)) continue;
          const distanceKm = Math.round(hit.distance_meters / 100) / 10;
          const location = hit.location_name || "your area";
          const reason = `${event.event_type} (${event.severity}) ${distanceKm} km from ${loc.id ? "a saved location" : "you"} near ${location}`;
          const inAppKey = `${sub.user_id}:${event.id}:IN_APP:v1`;
          const inApp = await recordNotification({
            userId: sub.user_id,
            eventId: event.id,
            channel: "IN_APP",
            reason,
            dedupeKey: inAppKey
          });
          if (inApp === "created") result.recordsCreated++;
          else if (inApp === "failed") result.recordsRejected++;
          if (sub.email_enabled && isEmailConfigured()) {
            const email = profileMap.get(sub.user_id)?.email || "";
            if (email) {
              const emailKey = `${sub.user_id}:${event.id}:EMAIL:v1`;
              const outcome = await recordNotification({
                userId: sub.user_id,
                eventId: event.id,
                channel: "EMAIL",
                reason,
                dedupeKey: emailKey,
                send: async () => {
                  const sent = await sendNotificationEmail({
                    to: email,
                    eventType: event.event_type,
                    severity: event.severity,
                    location,
                    description: event.description || event.title,
                    sourceSummary: "",
                    sourceUrls: [],
                    platformUrl: process.env.FRONTEND_URL || "http://localhost:5173"
                  });
                  if (!sent.success) throw new Error(sent.error || "Email provider failed");
                }
              });
              if (outcome === "created") result.recordsCreated++;
              else if (outcome === "failed") result.recordsRejected++;
            }
          }
          if (sub.sms_enabled && isSmsConfigured()) {
            const phone = phoneMap.get(sub.user_id);
            if (phone) {
              const smsKey = `${sub.user_id}:${event.id}:SMS:v1`;
              const outcome = await recordNotification({
                userId: sub.user_id,
                eventId: event.id,
                channel: "SMS",
                reason,
                dedupeKey: smsKey,
                send: async () => {
                  const sent = await sendNotificationSms({
                    to: phone,
                    eventType: event.event_type,
                    severity: event.severity,
                    location
                  });
                  if (!sent.success) throw new Error(sent.error || "SMS provider failed");
                }
              });
              if (outcome === "created") result.recordsCreated++;
              else if (outcome === "failed") result.recordsRejected++;
            }
          }
          if (sub.push_enabled) {
            const realtimeKey = `${sub.user_id}:${event.id}:IN_APP_RT:v1`;
            const outcome = await recordNotification({
              userId: sub.user_id,
              eventId: event.id,
              channel: "IN_APP",
              reason: `${reason} (realtime)`,
              dedupeKey: realtimeKey
            });
            if (outcome === "created") result.recordsCreated++;
            else if (outcome === "failed") result.recordsRejected++;
          }
        }
      }
    }
  } catch (err) {
    result.status = "FAILED";
    result.errorMessage = err.message;
  }
  if (runId) await finishJobRun(runId, result);
  return result;
}

// server/data/historicalDisasters.ts
var now = (/* @__PURE__ */ new Date()).toISOString();
var HISTORICAL_DISASTERS_CATALOG = [
  {
    id: "seed-1999-odisha-cyclone",
    eventName: "1999 Odisha Super Cyclone",
    disasterType: "Cyclone",
    location: "Odisha coast",
    state: "Odisha",
    country: "India",
    eventDate: "1999-10-29T00:00:00.000Z",
    dateRange: "29 October 1999",
    reportedCasualties: "Approximately 10,000 deaths reported across coastal Odisha.",
    reportedDamage: "Widespread destruction of housing, infrastructure, and agriculture across 12 districts.",
    sources: [
      { id: "S1", title: "1999 Odisha Super Cyclone overview", publisher: "India Meteorological Department", publishedAt: "1999-11-01", url: "https://mausam.imd.gov.in", summary: "The 1999 Odisha super cyclone was one of the most intense tropical cyclones recorded in the North Indian Ocean, causing catastrophic damage along the coast of Odisha." },
      { id: "S2", title: "Super cyclone hits India", publisher: "BBC News", publishedAt: "1999-10-30", url: "https://www.bbc.co.uk", summary: "A massive super cyclone struck the coast of Orissa (now Odisha) with wind speeds exceeding 260 km/h, causing widespread devastation." }
    ],
    timeline: [
      { date: "29 October 1999", event: "Cyclone makes landfall", description: "Super cyclone made landfall near Paradip with sustained winds of 260+ km/h [S1].", citations: ["S1"] },
      { date: "30 October 1999", event: "Widespread flooding", description: "Storm surge of 6-10 meters inundated coastal areas, affecting millions [S2].", citations: ["S2"] }
    ],
    whatHappened: "The 1999 Odisha super cyclone was one of the deadliest cyclones in Indian history, making landfall on 29 October 1999 with sustained winds exceeding 260 km/h [S1]. A catastrophic storm surge of 6-10 meters inundated vast coastal areas [S2].",
    affectedAreas: "The cyclone affected 12 districts in coastal Odisha including Cuttack, Puri, Jagatsinghpur, and Kendrapara [S1].",
    humanImpact: "Approximately 10,000 people were killed, millions displaced, and entire villages were wiped out [S1][S2].",
    infrastructureDamage: "Extensive destruction of housing, roads, bridges, power infrastructure, and telecommunications across the affected region [S1].",
    economicImpact: "Massive agricultural losses and infrastructure damage estimated in thousands of crores [S1].",
    governmentResponse: "The Indian government launched a massive relief and rehabilitation operation with NDRF and military deployment [S2].",
    rescueRelief: "Emergency shelters, food distribution, and medical aid were deployed across the affected coastal regions [S1].",
    recovery: "Long-term reconstruction and coastal shelterbelt plantation programs were initiated over the following decade.",
    sourceAssessment: "Sources include official meteorological records and contemporary news coverage from multiple international and national outlets.",
    conflictingReports: [],
    synthesizedAt: now,
    evidenceStatus: "High Confidence",
    retrievalMetadata: { queriesExecuted: ["seed"], rawSourcesCount: 2, dedupedSourcesCount: 2 },
    year: 1999,
    numericCasualties: 1e4,
    decade: "1990s"
  },
  {
    id: "seed-2001-gujarat-earthquake",
    eventName: "2001 Gujarat Earthquake",
    disasterType: "Earthquake",
    location: "Bhuj and Kutch",
    state: "Gujarat",
    country: "India",
    eventDate: "2001-01-26T00:00:00.000Z",
    dateRange: "26 January 2001",
    reportedCasualties: "Approximately 20,000 deaths reported.",
    reportedDamage: "Massive destruction of buildings, infrastructure, and heritage sites across Kutch district.",
    sources: [
      { id: "S1", title: "2001 Gujarat earthquake", publisher: "USGS", publishedAt: "2001-01-26", url: "https://earthquake.usgs.gov", summary: "A magnitude 7.7 earthquake struck Gujarat, India on Republic Day, causing widespread destruction in the Kutch region." }
    ],
    timeline: [
      { date: "26 January 2001", event: "Earthquake strikes", description: "A magnitude 7.7 earthquake struck at 8:46 AM IST on Republic Day [S1].", citations: ["S1"] }
    ],
    whatHappened: "On 26 January 2001, a magnitude 7.7 earthquake struck Gujarat on Republic Day, devastating the Kutch district [S1]. The earthquake caused massive destruction to buildings, infrastructure, and cultural heritage sites.",
    affectedAreas: "The earthquake primarily affected Kutch, Rajkot, Jamnagar, and Surat districts in Gujarat [S1].",
    humanImpact: "Approximately 20,000 people were killed and over 160,000 injured, with millions left homeless [S1].",
    infrastructureDamage: "Over 400,000 buildings collapsed and 1.2 million were damaged, including historic structures and temples [S1].",
    economicImpact: "Estimated economic losses exceeded \u20B921,000 crore (approximately $4.6 billion USD) [S1].",
    governmentResponse: "The Indian government launched a massive relief operation and established the Kutch Earthquake Reconstruction Authority [S1].",
    rescueRelief: "NDRF, military, and international rescue teams were deployed for search and rescue operations.",
    recovery: "Extensive reconstruction programs were undertaken over the following years, transforming Bhuj into a modern city.",
    sourceAssessment: "Official USGS seismic data and contemporary news coverage provide high-confidence evidence.",
    conflictingReports: [],
    synthesizedAt: now,
    evidenceStatus: "High Confidence",
    retrievalMetadata: { queriesExecuted: ["seed"], rawSourcesCount: 1, dedupedSourcesCount: 1 },
    year: 2001,
    numericCasualties: 2e4,
    decade: "2000s"
  },
  {
    id: "seed-2004-tsunami",
    eventName: "2004 Indian Ocean Tsunami",
    disasterType: "Tsunami",
    location: "Tamil Nadu coast",
    state: "Tamil Nadu",
    country: "India",
    eventDate: "2004-12-26T00:00:00.000Z",
    dateRange: "26 December 2004",
    reportedCasualties: "Approximately 10,700 deaths in India.",
    reportedDamage: "Devastating tsunami waves hit the coast of Tamil Nadu, Andaman Islands, and other coastal areas.",
    sources: [
      { id: "S1", title: "2004 Indian Ocean tsunami", publisher: "BBC News", publishedAt: "2004-12-27", url: "https://www.bbc.co.uk", summary: "A massive undersea earthquake triggered tsunami waves across the Indian Ocean, devastating coastal communities in India, Sri Lanka, Thailand, and Indonesia." }
    ],
    timeline: [
      { date: "26 December 2004", event: "Tsunami strikes coast", description: "Tsunami waves up to 10 meters high struck the coast of Tamil Nadu and other Indian coastal areas [S1].", citations: ["S1"] }
    ],
    whatHappened: "On 26 December 2004, a magnitude 9.1 undersea earthquake triggered a massive tsunami that struck coastal India [S1]. Waves up to 10 meters high devastated Tamil Nadu, the Andaman and Nicobar Islands, and other coastal areas.",
    affectedAreas: "Tamil Nadu coast (Chennai, Nagapattinam, Cuddalore), Andaman and Nicobar Islands, Kerala, and Andhra Pradesh were affected [S1].",
    humanImpact: "Approximately 10,700 people died in India, with hundreds of thousands displaced [S1].",
    infrastructureDamage: "Coastal infrastructure including fishing villages, ports, roads, and buildings were destroyed [S1].",
    economicImpact: "Massive losses to the fishing industry, tourism, and coastal communities.",
    governmentResponse: "The Indian government launched a major relief and reconstruction effort, and established early warning systems.",
    rescueRelief: "Massive search and rescue operations with NDRF, military, and international aid organizations.",
    recovery: "Long-term reconstruction of coastal communities and development of tsunami early warning systems.",
    sourceAssessment: "Contemporary international news coverage and official reports provide comprehensive evidence.",
    conflictingReports: [],
    synthesizedAt: now,
    evidenceStatus: "High Confidence",
    retrievalMetadata: { queriesExecuted: ["seed"], rawSourcesCount: 1, dedupedSourcesCount: 1 },
    year: 2004,
    numericCasualties: 10700,
    decade: "2000s"
  },
  {
    id: "seed-2013-uttarakhand-floods",
    eventName: "2013 Uttarakhand Floods",
    disasterType: "Flood",
    location: "Kedarnath and Garhwal",
    state: "Uttarakhand",
    country: "India",
    eventDate: "2013-06-16T00:00:00.000Z",
    dateRange: "16-17 June 2013",
    reportedCasualties: "Approximately 5,700 deaths reported.",
    reportedDamage: "Catastrophic flash floods and landslides destroyed the Kedarnath temple complex and surrounding areas.",
    sources: [
      { id: "S1", title: "2013 Uttarakhand floods", publisher: "The Hindu", publishedAt: "2013-06-18", url: "https://www.thehindu.com", summary: "Catastrophic flash floods and landslides devastated the Kedarnath valley in Uttarakhand, killing thousands of pilgrims and residents." }
    ],
    timeline: [
      { date: "16 June 2013", event: "Cloudburst and flooding", description: "Heavy rainfall and glacial lake outburst triggered catastrophic flooding in the Kedarnath valley [S1].", citations: ["S1"] }
    ],
    whatHappened: "In June 2013, unprecedented rainfall and glacial lake outburst flooding devastated the Kedarnath region of Uttarakhand [S1]. Flash floods and landslides destroyed the Kedarnath temple and killed thousands of pilgrims and residents.",
    affectedAreas: "Kedarnath, Rudraprayag, Chamoli, and other Garhwal districts in Uttarakhand were severely affected [S1].",
    humanImpact: "Approximately 5,700 people were killed and thousands went missing [S1].",
    infrastructureDamage: "The Kedarnath temple complex, bridges, roads, and entire villages were destroyed by flash floods and landslides [S1].",
    economicImpact: "Extensive damage to pilgrimage tourism infrastructure and local economy.",
    governmentResponse: "Massive military-led rescue operation (Operation Rahat) evacuated thousands of stranded pilgrims.",
    rescueRelief: "NDRF, Indian Air Force, and army conducted helicopter-based rescue operations.",
    recovery: "Long-term reconstruction of the Kedarnath corridor and disaster-resilient infrastructure.",
    sourceAssessment: "Multiple national news sources and official reports provide comprehensive coverage.",
    conflictingReports: [],
    synthesizedAt: now,
    evidenceStatus: "High Confidence",
    retrievalMetadata: { queriesExecuted: ["seed"], rawSourcesCount: 1, dedupedSourcesCount: 1 },
    year: 2013,
    numericCasualties: 5700,
    decade: "2010s"
  },
  {
    id: "seed-2018-kerala-floods",
    eventName: "2018 Kerala Floods",
    disasterType: "Flood",
    location: "Kerala",
    state: "Kerala",
    country: "India",
    eventDate: "2018-08-15T00:00:00.000Z",
    dateRange: "August 2018",
    reportedCasualties: "483 deaths reported.",
    reportedDamage: "Worst floods in Kerala in nearly a century, affecting 13 of 14 districts.",
    sources: [
      { id: "S1", title: "2018 Kerala floods", publisher: "NDMA India", publishedAt: "2018-08-20", url: "https://ndma.gov.in", summary: "Severe monsoon flooding affected 13 of 14 districts in Kerala, causing widespread destruction and displacement." }
    ],
    timeline: [
      { date: "15 August 2018", event: "Flooding begins", description: "Extremely heavy rainfall and dam discharges caused catastrophic flooding across Kerala [S1].", citations: ["S1"] }
    ],
    whatHappened: "The 2018 Kerala floods were the worst in nearly a century, affecting 13 of 14 districts [S1]. Excessive rainfall and dam overflows caused catastrophic flooding, landslides, and widespread destruction.",
    affectedAreas: "All districts of Kerala except Kasaragod were affected, with Idukki, Ernakulam, Thrissur, and Wayanad being the worst hit [S1].",
    humanImpact: "483 people died and over a million were displaced to relief camps [S1].",
    infrastructureDamage: "Thousands of houses destroyed, roads and bridges washed away, and massive damage to public infrastructure [S1].",
    economicImpact: "Estimated losses exceeded \u20B920,000 crore across agriculture, industry, and infrastructure.",
    governmentResponse: "The Kerala government coordinated a massive rescue operation, widely praised as a model disaster response.",
    rescueRelief: "Over 4,000 rescue operations were conducted, evacuating hundreds of thousands of people.",
    recovery: "Extensive reconstruction and rehabilitation programs including the Kerala Flood Reconstruction Fund.",
    sourceAssessment: "Official NDMA reports and extensive media coverage provide high-confidence evidence.",
    conflictingReports: [],
    synthesizedAt: now,
    evidenceStatus: "High Confidence",
    retrievalMetadata: { queriesExecuted: ["seed"], rawSourcesCount: 1, dedupedSourcesCount: 1 },
    year: 2018,
    numericCasualties: 483,
    decade: "2010s"
  },
  {
    id: "seed-2020-amphan",
    eventName: "2020 Cyclone Amphan",
    disasterType: "Cyclone",
    location: "West Bengal and Odisha coast",
    state: "West Bengal",
    country: "India",
    eventDate: "2020-05-20T00:00:00.000Z",
    dateRange: "20 May 2020",
    reportedCasualties: "98 deaths in India.",
    reportedDamage: "Super cyclone caused extensive damage in Kolkata and coastal districts of West Bengal.",
    sources: [
      { id: "S1", title: "Cyclone Amphan", publisher: "IMD", publishedAt: "2020-05-20", url: "https://mausam.imd.gov.in", summary: "Extremely severe cyclonic storm Amphan made landfall near the India-Bangladesh border, causing widespread destruction in West Bengal." }
    ],
    timeline: [
      { date: "20 May 2020", event: "Amphan makes landfall", description: "Super cyclonic storm Amphan made landfall with sustained winds of 155-165 km/h [S1].", citations: ["S1"] }
    ],
    whatHappened: "Cyclone Amphan, classified as a super cyclonic storm, made landfall on 20 May 2020 near the India-Bangladesh border [S1]. It was the strongest tropical cyclone to form in the Bay of Bengal since the 1999 Odisha cyclone.",
    affectedAreas: "West Bengal (Kolkata, South 24 Parganas, North 24 Parganas, Howrah) and Odisha coastal districts [S1].",
    humanImpact: "98 deaths were reported in India, with millions affected by the storm.",
    infrastructureDamage: "Extensive damage to housing, power infrastructure, and urban areas including Kolkata [S1].",
    economicImpact: "Estimated losses of \u20B91 lakh crore across West Bengal.",
    governmentResponse: "Large-scale pre-emptive evacuation of over 600,000 people from coastal areas.",
    rescueRelief: "NDRF teams, military, and state disaster response forces deployed for rescue operations.",
    recovery: "Post-cyclone reconstruction and strengthened coastal disaster preparedness.",
    sourceAssessment: "Official IMD data and contemporary news coverage provide high-confidence evidence.",
    conflictingReports: [],
    synthesizedAt: now,
    evidenceStatus: "High Confidence",
    retrievalMetadata: { queriesExecuted: ["seed"], rawSourcesCount: 1, dedupedSourcesCount: 1 },
    year: 2020,
    numericCasualties: 98,
    decade: "2020s"
  },
  {
    id: "seed-2024-wayanad-landslide",
    eventName: "2024 Wayanad Landslides",
    disasterType: "Landslide",
    location: "Wayanad",
    state: "Kerala",
    country: "India",
    eventDate: "2024-07-30T00:00:00.000Z",
    dateRange: "30 July 2024",
    reportedCasualties: "Over 400 deaths reported.",
    reportedDamage: "Massive landslides buried entire villages in Chooralmala and Mundakkai areas.",
    sources: [
      { id: "S1", title: "Wayanad landslides", publisher: "The Indian Express", publishedAt: "2024-07-30", url: "https://indianexpress.com", summary: "Catastrophic landslides struck Wayanad district in Kerala, burying entire villages and killing hundreds." }
    ],
    timeline: [
      { date: "30 July 2024", event: "Landslides strike", description: "Pre-dawn landslides buried Chooralmala and Mundakkai villages in Wayanad [S1].", citations: ["S1"] }
    ],
    whatHappened: "On 30 July 2024, massive pre-dawn landslides struck the Chooralmala and Mundakkai areas of Wayanad district in Kerala [S1]. Entire villages were buried under debris, making it one of the deadliest landslide disasters in Indian history.",
    affectedAreas: "Chooralmala, Mundakkai, and surrounding villages in Wayanad district, Kerala [S1].",
    humanImpact: "Over 400 people were killed and many remained missing for days.",
    infrastructureDamage: "Houses, bridges, roads, and a school were completely buried or destroyed by landslide debris [S1].",
    economicImpact: "Massive destruction of agricultural land, rubber and spice plantations.",
    governmentResponse: "Immediate deployment of NDRF, military, and state disaster response forces.",
    rescueRelief: "Extensive search and rescue operations with heavy machinery and canine units.",
    recovery: "Ongoing rehabilitation and resettlement of displaced communities.",
    sourceAssessment: "Multiple national news outlets and official reports provide comprehensive coverage.",
    conflictingReports: [],
    synthesizedAt: now,
    evidenceStatus: "High Confidence",
    retrievalMetadata: { queriesExecuted: ["seed"], rawSourcesCount: 1, dedupedSourcesCount: 1 },
    year: 2024,
    numericCasualties: 400,
    decade: "2020s"
  },
  {
    id: "seed-2014-kashmir-floods",
    eventName: "2014 Kashmir Floods",
    disasterType: "Flood",
    location: "Jammu and Kashmir",
    state: "Jammu and Kashmir",
    country: "India",
    eventDate: "2014-09-05T00:00:00.000Z",
    dateRange: "September 2014",
    reportedCasualties: "277 deaths reported.",
    reportedDamage: "Severe flooding in the Kashmir Valley, particularly in Srinagar.",
    sources: [
      { id: "S1", title: "2014 Kashmir floods", publisher: "NDMA India", publishedAt: "2014-09-07", url: "https://ndma.gov.in", summary: "Devastating floods hit the Kashmir Valley after heavy monsoon rains caused the Jhelum River to overflow." }
    ],
    timeline: [
      { date: "5 September 2014", event: "Flooding begins", description: "Heavy rains caused the Jhelum River to breach its banks, flooding the Kashmir Valley [S1].", citations: ["S1"] }
    ],
    whatHappened: "In September 2014, devastating floods hit the Kashmir Valley after heavy monsoon rains caused the Jhelum River to overflow [S1]. Large parts of Srinagar and surrounding areas were submerged.",
    affectedAreas: "Srinagar, Anantnag, Budgam, and other districts in the Kashmir Valley [S1].",
    humanImpact: "277 people died and hundreds of thousands were displaced.",
    infrastructureDamage: "Extensive damage to housing, roads, bridges, and public infrastructure in Srinagar and surrounding areas [S1].",
    economicImpact: "Massive losses to agriculture, horticulture, and the tourism industry.",
    governmentResponse: "Large-scale military and NDRF rescue operations were conducted.",
    rescueRelief: "Helicopter-based evacuation and relief distribution in flooded areas.",
    recovery: "Long-term reconstruction and flood protection infrastructure development.",
    sourceAssessment: "Official NDMA reports and news coverage provide reliable evidence.",
    conflictingReports: [],
    synthesizedAt: now,
    evidenceStatus: "Moderate Evidence",
    retrievalMetadata: { queriesExecuted: ["seed"], rawSourcesCount: 1, dedupedSourcesCount: 1 },
    year: 2014,
    numericCasualties: 277,
    decade: "2010s"
  }
];

// server/jobs/historicalBackfillJob.ts
var jobLocks = /* @__PURE__ */ new Set();
function acquireLock(key) {
  if (jobLocks.has(key)) return false;
  jobLocks.add(key);
  return true;
}
function releaseLock(key) {
  jobLocks.delete(key);
}
function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
}
async function seedHistoricalCatalog() {
  const result = {
    jobType: "backfill",
    status: "COMPLETED",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0
  };
  const source = await resolveSource("historical-catalog");
  for (const item of HISTORICAL_DISASTERS_CATALOG) {
    result.recordsProcessed++;
    try {
      const year = item.eventDate ? new Date(item.eventDate).getUTCFullYear() : item.year;
      const eventKey = `${slug(item.disasterType)}-${slug(item.state || item.location || "india")}-${year}-${slug(item.eventName)}`;
      const upserted = await supabaseRest("canonical_events?on_conflict=event_key", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          event_key: eventKey,
          title: item.eventName,
          event_type: item.disasterType,
          status: "ARCHIVED",
          severity: item.evidenceStatus === "High Confidence" ? "Severe" : "Moderate",
          urgency: "Past",
          certainty: "Observed",
          description: item.whatHappened,
          instruction: item.rescueRelief || null,
          location_name: item.location,
          state: item.state,
          country: item.country || "India",
          started_at: item.eventDate,
          ended_at: item.eventDate,
          archived_at: (/* @__PURE__ */ new Date()).toISOString(),
          verification_status: "PROVISIONALLY_VERIFIED",
          verification_score: item.evidenceStatus === "High Confidence" ? 0.82 : 0.65,
          verification_method: "CURATED_HISTORICAL_CATALOG",
          verification_reason: item.sourceAssessment,
          location_confidence: 0.7
        })
      });
      const eventId = upserted[0]?.id;
      if (!eventId) {
        result.recordsRejected++;
        continue;
      }
      let observationCount = 0;
      for (const citation of item.sources) {
        const hash = contentHash(`${item.id}|${citation.id}|${citation.title}|${citation.url}`);
        const observations = await supabaseRest("source_observations?on_conflict=source_id,content_hash", {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=representation" },
          body: JSON.stringify({
            source_id: source.id,
            external_id: `${item.id}-${citation.id}`,
            title: citation.title.slice(0, 500),
            raw_content: citation.summary || item.whatHappened,
            raw_payload: { catalogId: item.id, citation },
            source_url: citation.url || null,
            publisher: citation.publisher || "Curated Historical Catalog",
            published_at: citation.publishedAt || item.eventDate,
            retrieved_at: (/* @__PURE__ */ new Date()).toISOString(),
            location_text: item.location,
            event_category: item.disasterType,
            content_hash: hash
          })
        });
        const observationId = observations[0]?.id;
        if (!observationId) continue;
        observationCount++;
        await supabaseRest("event_sources?on_conflict=event_id,source_id,source_observation_id", {
          method: "POST",
          headers: { Prefer: "resolution=ignore-duplicates" },
          body: JSON.stringify({
            event_id: eventId,
            source_id: source.id,
            source_observation_id: observationId,
            citation_id: citation.id
          })
        });
        await supabaseRest("event_observations?on_conflict=event_id,observation_id", {
          method: "POST",
          headers: { Prefer: "resolution=ignore-duplicates" },
          body: JSON.stringify({
            event_id: eventId,
            observation_id: observationId,
            match_score: 1,
            relationship: "CURATED_HISTORICAL_SOURCE"
          })
        }).catch(() => void 0);
      }
      const docId = await upsertSearchDocument({
        documentType: "canonical_event",
        eventId,
        title: item.eventName,
        content: [
          item.whatHappened,
          item.affectedAreas,
          item.humanImpact,
          item.infrastructureDamage,
          item.governmentResponse,
          item.sourceAssessment
        ].filter(Boolean).join("\n\n"),
        sourceUrl: item.sources[0]?.url || null
      });
      if (docId) await embedAndStoreSearchDocument(docId, `${item.eventName}. ${item.whatHappened}`);
      if (observationCount > 0) result.recordsCreated++;
      else result.recordsUpdated++;
    } catch (error) {
      result.recordsRejected++;
      result.errorMessage = error.message;
    }
  }
  if (result.recordsRejected > 0 && result.recordsCreated + result.recordsUpdated === 0) result.status = "FAILED";
  else if (result.recordsRejected > 0) result.status = "PARTIAL";
  return result;
}
async function runHistoricalBackfillJob() {
  if (!acquireLock("backfill")) {
    return {
      jobType: "backfill",
      status: "PARTIAL",
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsRejected: 0,
      errorMessage: "A backfill run is already in progress"
    };
  }
  const runId = await startJobRun("backfill");
  const result = {
    jobType: "backfill",
    status: "COMPLETED",
    recordsProcessed: 0,
    recordsCreated: 0,
    recordsUpdated: 0,
    recordsRejected: 0
  };
  try {
    if (!isSupabaseConfigured()) {
      result.status = "FAILED";
      result.errorMessage = "Supabase is not configured";
      return result;
    }
    const phases = [
      { name: "historical_catalog", run: seedHistoricalCatalog },
      { name: "ingestion", run: runIngestionJob },
      { name: "reconciliation", run: runReconciliationJob },
      { name: "citizen_verification", run: runCitizenVerificationJob },
      { name: "lifecycle", run: runLifecycleJob },
      { name: "notification", run: runNotificationJob },
      { name: "embedding", run: runEmbeddingJob }
    ];
    const phaseMeta = {};
    for (const phase of phases) {
      const phaseResult = await phase.run();
      phaseMeta[phase.name] = {
        status: phaseResult.status,
        processed: phaseResult.recordsProcessed,
        created: phaseResult.recordsCreated,
        updated: phaseResult.recordsUpdated,
        rejected: phaseResult.recordsRejected
      };
      result.recordsProcessed += phaseResult.recordsProcessed;
      result.recordsCreated += phaseResult.recordsCreated;
      result.recordsUpdated += phaseResult.recordsUpdated;
      result.recordsRejected += phaseResult.recordsRejected;
      if (phaseResult.status === "FAILED") result.errorMessage = `${phase.name}: ${phaseResult.errorMessage || "failed"}`;
    }
    const failedPhases = Object.entries(phaseMeta).filter(([, meta]) => meta.status === "FAILED");
    if (failedPhases.length === phases.length) result.status = "FAILED";
    else if (failedPhases.length > 0 || result.errorMessage) result.status = "PARTIAL";
  } catch (err) {
    result.status = "FAILED";
    result.errorMessage = err.message;
  } finally {
    releaseLock("backfill");
  }
  if (runId) await finishJobRun(runId, result, { phases: "see metadata" });
  return result;
}

// server/routes.ts
var router = (0, import_express.Router)();
var upload = (0, import_multer.default)({ storage: import_multer.default.memoryStorage(), limits: { fileSize: 15 * 1024 * 1024 } });
function readNumber(value) {
  const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(parsed) ? parsed : void 0;
}
function pointWkt(longitude, latitude) {
  return `SRID=4326;POINT(${longitude} ${latitude})`;
}
function canonicalEventToEvidenceBundle(event) {
  const sources = event.citations.map((citation, index) => ({
    id: citation.id || `S${index + 1}`,
    title: citation.title,
    publisher: citation.publisher || citation.sourceName,
    publishedAt: citation.publishedAt || citation.retrievedAt || event.updatedAt,
    url: citation.url || "",
    summary: citation.summary || `${citation.sourceName} reported this event.`,
    qualityScore: Math.round(event.verificationScore * 100)
  }));
  const year = event.startedAt ? new Date(event.startedAt).getFullYear() : new Date(event.updatedAt).getFullYear();
  return {
    id: event.id,
    eventName: event.title,
    disasterType: event.eventType,
    location: event.locationName,
    state: event.state || "India",
    country: event.country,
    eventDate: event.startedAt,
    dateRange: event.startedAt ? new Date(event.startedAt).toLocaleDateString("en-IN") : "Date unavailable",
    reportedCasualties: "Impact figures were not quantified in the verified database record; refer to source citations.",
    reportedDamage: "Impact figures were not quantified in the verified database record; refer to source citations.",
    sources,
    timeline: [
      {
        date: event.lastObservedAt || event.updatedAt,
        event: event.status,
        description: event.description,
        citations: sources.slice(0, 2).map((source) => source.id)
      }
    ],
    whatHappened: event.description,
    affectedAreas: event.locationName,
    humanImpact: "Refer to source citations for confirmed public impact details.",
    infrastructureDamage: "Refer to source citations for confirmed infrastructure impact details.",
    economicImpact: "",
    governmentResponse: event.verificationReason,
    rescueRelief: event.instruction || "No verified instruction was attached to this record.",
    recovery: event.status === "ARCHIVED" || event.status === "ENDED" ? "Event is available in the historical archive." : "Event remains active or developing.",
    sourceAssessment: `${event.verificationStatus} via ${event.verificationMethod}. Verification score ${Math.round(event.verificationScore * 100)}%.`,
    conflictingReports: [],
    synthesizedAt: event.updatedAt,
    evidenceStatus: event.verificationScore >= 0.8 ? "High Confidence" : event.verificationScore >= 0.55 ? "Moderate Evidence" : "Limited Coverage",
    retrievalMetadata: {
      queriesExecuted: ["canonical_events"],
      rawSourcesCount: event.sourceCount,
      dedupedSourcesCount: event.sourceCount
    }
  };
}
function queryMatchesBundle(query, bundle) {
  const lower = query.toLowerCase();
  const text = `${bundle.eventName} ${bundle.disasterType} ${bundle.location} ${bundle.state}`.toLowerCase();
  const disasterTypes = ["cyclone", "flood", "earthquake", "landslide", "tsunami", "lightning", "thunderstorm", "heat"];
  const requestedType = disasterTypes.find((type) => lower.includes(type));
  if (requestedType && !text.includes(requestedType)) return false;
  const stop = /* @__PURE__ */ new Set(["what", "happened", "during", "tell", "about", "india", "indian", "disaster"]);
  const important = lower.split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !stop.has(token) && token !== requestedType);
  return important.length === 0 || important.some((token) => text.includes(token));
}
router.get("/events/active", async (_req, res) => {
  try {
    const result = await listActiveCanonicalEvents();
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json(result);
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/events/nearby", async (req, res) => {
  try {
    const lat = readNumber(req.query.lat);
    const lng = readNumber(req.query.lng);
    const radiusKm = readNumber(req.query.radiusKm) ?? 50;
    if (lat === void 0 || lng === void 0) {
      throw badRequest("lat and lng query parameters are required");
    }
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw badRequest("lat and lng must be valid WGS84 coordinates");
    }
    if (!isSupabaseConfigured()) throw unavailable("Database not configured");
    const events = await nearbyEvents(lat, lng, radiusKm);
    res.setHeader("Cache-Control", "public, max-age=30");
    res.json({ events, count: events.length });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/events/:id", async (req, res) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable("Database not configured");
    const event = await getCanonicalEventById(req.params.id);
    if (!event) throw notFound("Event not found or not publicly visible");
    const citations = await getEventCitations(req.params.id);
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({ event, citations });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/events/:id/sources", async (req, res) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable("Database not configured");
    const citations = await getEventCitations(req.params.id);
    res.json({ sources: citations });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/events/:id/timeline", async (req, res) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable("Database not configured");
    const timeline = await getEventTimeline(req.params.id);
    res.json({ timeline });
  } catch (error) {
    sendError(res, error);
  }
});
function normalizeSearchQuery(query) {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}
function persistenceSucceeded(p) {
  return Boolean(p && p.eventId && p.observationsPersisted > 0 && p.errors.length === 0);
}
var RICH_BUNDLE_DOCUMENT_TITLE = "__AAPDA_RICH_EVIDENCE_BUNDLE__";
async function persistRichEvidenceBundle(eventId, bundle) {
  if (!eventId || !isSupabaseConfigured()) return;
  const storedBundle = { ...bundle, id: eventId };
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  const documentHash = contentHash(`rich-evidence-bundle|${eventId}`);
  await supabaseRest("search_documents?on_conflict=document_hash", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify({
      document_type: "external_research",
      event_id: eventId,
      title: RICH_BUNDLE_DOCUMENT_TITLE,
      content: JSON.stringify(storedBundle),
      source_url: storedBundle.sources?.[0]?.url || null,
      document_hash: documentHash,
      indexed_at: now2
    })
  });
}
async function getPersistedEvidenceBundle(eventId) {
  if (!isSupabaseConfigured()) return null;
  const rows = await supabaseRest(
    `search_documents?event_id=eq.${eventId}&document_type=eq.external_research&title=eq.${encodeURIComponent(RICH_BUNDLE_DOCUMENT_TITLE)}&select=content&limit=1`,
    { method: "GET" }
  ).catch(() => []);
  const raw = rows[0]?.content;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.eventName || !Array.isArray(parsed.sources)) return null;
    return { ...parsed, id: eventId };
  } catch {
    return null;
  }
}
async function bundleForCanonicalEvent(event) {
  const stored = await getPersistedEvidenceBundle(event.id);
  return stored || canonicalEventToEvidenceBundle(event);
}
async function persistExternalResearch(query, bundle) {
  if (!isSupabaseConfigured()) return;
  const locations = bundle.location || "India";
  const now2 = (/* @__PURE__ */ new Date()).toISOString();
  const eventKey = `research-${contentHash(`${bundle.eventName}|${locations}|${bundle.eventDate || ""}`).slice(0, 32)}`;
  try {
    const existing = await supabaseRest(
      `canonical_events?event_key=eq.${eventKey}&select=id&limit=1`,
      { method: "GET" }
    );
    let eventId = existing[0]?.id;
    if (!eventId) {
      const rows = await supabaseRest("canonical_events", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify({
          event_key: eventKey,
          title: (bundle.eventName || query).slice(0, 500),
          event_type: bundle.disasterType || "General Alert",
          status: "ARCHIVED",
          severity: "Unknown",
          urgency: "Past",
          certainty: "Observed",
          description: (bundle.whatHappened || "").slice(0, 5e3),
          location_name: locations.slice(0, 500),
          state: bundle.state || null,
          country: "India",
          started_at: bundle.eventDate || null,
          last_observed_at: bundle.eventDate || null,
          verification_status: "PROVISIONALLY_VERIFIED",
          verification_score: 0.6,
          verification_method: "EXTERNAL_RESEARCH_PERSIST",
          verification_reason: "Persisted from the universal search external research pipeline with validated citations.",
          location_confidence: 0.5
        })
      });
      eventId = rows[0]?.id;
    }
    if (!eventId) return;
    const newsSource = await resolveSource("google-news-rss");
    for (const source of bundle.sources.slice(0, 5)) {
      const observationHash = contentHash(`${source.title}
${source.summary}`);
      const existingObs = await supabaseRest(
        `source_observations?and=(source_id.eq.${newsSource.id},content_hash.eq.${observationHash})&select=id&limit=1`,
        { method: "GET" }
      ).catch(() => []);
      let observationId = existingObs[0]?.id;
      if (!observationId) {
        const observationRows = await supabaseRest("source_observations", {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            source_id: newsSource.id,
            external_id: `research-${observationHash.slice(0, 40)}`,
            title: (source.title || "").slice(0, 500),
            raw_content: (source.summary || "").slice(0, 8e3),
            source_url: (source.url || "").slice(0, 2e3) || null,
            publisher: (source.publisher || "Unknown").slice(0, 200),
            published_at: source.publishedAt || now2,
            retrieved_at: now2,
            event_category: bundle.disasterType || "General Alert",
            content_hash: observationHash
          })
        }).catch(() => []);
        observationId = observationRows[0]?.id;
      }
      if (observationId) {
        await supabaseRest("event_sources", {
          method: "POST",
          headers: { Prefer: "resolution=ignore-duplicates" },
          body: JSON.stringify({ event_id: eventId, source_id: newsSource.id, source_observation_id: observationId })
        }).catch(() => void 0);
        await upsertSearchDocument({
          documentType: "external_research",
          eventId,
          observationId,
          title: source.title || query,
          content: source.summary || "",
          sourceUrl: source.url || null
        });
      }
    }
    const eventDocId = await upsertSearchDocument({
      documentType: "canonical_event",
      eventId,
      title: bundle.eventName || query,
      content: `${bundle.disasterType}. ${locations}. ${bundle.whatHappened}`.slice(0, 4e3),
      sourceUrl: bundle.sources[0]?.url || null
    });
    if (eventDocId) {
      await embedAndStoreSearchDocument(eventDocId, `${bundle.eventName}. ${bundle.whatHappened}`);
    }
    await persistRichEvidenceBundle(eventId, bundle);
  } catch (error) {
    console.error("[search:persist] external research persistence failed:", error.message);
  }
}
router.post("/search", async (req, res) => {
  try {
    const query = typeof req.body?.query === "string" ? req.body.query.trim() : "";
    if (!query) throw badRequest("Query is required");
    if (query.length > 300) throw badRequest("Query is too long (max 300 characters)");
    rateLimit(req, "search", 30, 6e4);
    const normalizedQuery = normalizeSearchQuery(query);
    const cacheKey = `search:${normalizedQuery}`;
    const cached = cache.get("search", cacheKey);
    if (cached) {
      res.setHeader("Cache-Control", "private, max-age=60");
      res.json(cached);
      return;
    }
    const [lexicalDocs, canonicalMatches] = await Promise.all([
      lexicalSearch(query, 12),
      searchCanonicalEventsLexical(query, 20)
    ]);
    if (canonicalMatches.length > 0) {
      const results = await Promise.all(canonicalMatches.slice(0, 10).map(bundleForCanonicalEvent));
      const response2 = {
        results,
        source: "database",
        provenance: "lexical"
      };
      cache.set("search", cacheKey, response2, cache.getTTL("search"));
      res.json(response2);
      return;
    }
    if (lexicalDocs.length > 0) {
      const eventIds = Array.from(new Set(lexicalDocs.map((doc) => doc.event_id).filter((id) => Boolean(id))));
      if (eventIds.length > 0) {
        const rows = await supabaseRest(
          `past_canonical_events?id=in.(${eventIds.join(",")})&select=*&verification_status=in.(OFFICIAL_VERIFIED,CROSS_SOURCE_VERIFIED,PROVISIONALLY_VERIFIED)&limit=10`,
          { method: "GET" }
        ).catch(() => []);
        if (rows.length > 0) {
          const response2 = { results: await Promise.all(rows.map(bundleForCanonicalEvent)), source: "database", provenance: "lexical_documents" };
          cache.set("search", cacheKey, response2, cache.getTTL("search"));
          res.json(response2);
          return;
        }
      }
    }
    if (isEmbeddingAvailable()) {
      const vectorHits = await vectorEventSearch(query, 10, 0.35);
      if (vectorHits.length > 0) {
        const ids = vectorHits.map((hit) => hit.event_id);
        const rows = await supabaseRest(
          `past_canonical_events?id=in.(${ids.join(",")})&select=*&verification_status=in.(OFFICIAL_VERIFIED,CROSS_SOURCE_VERIFIED,PROVISIONALLY_VERIFIED)&limit=10`,
          { method: "GET" }
        ).catch(() => []);
        if (rows.length > 0) {
          const response2 = { results: await Promise.all(rows.map(bundleForCanonicalEvent)), source: "database", provenance: "vector" };
          cache.set("search", cacheKey, response2, cache.getTTL("search"));
          res.json(response2);
          return;
        }
        const docHits = await vectorDocumentSearch(query, 8, 0.35);
        if (docHits.length > 0) {
          const response2 = {
            results: docHits.slice(0, 5).map((doc) => ({
              id: doc.doc_id,
              eventName: doc.title,
              disasterType: "General Alert",
              location: "India",
              state: "India",
              country: "India",
              dateRange: "Retrieved document",
              reportedCasualties: "",
              reportedDamage: "",
              sources: [{
                id: "S1",
                title: doc.title,
                publisher: "Aapda Drishti Search Corpus",
                publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
                url: doc.source_url || "",
                summary: (doc.content || "").slice(0, 400)
              }],
              timeline: [],
              whatHappened: (doc.content || "").slice(0, 1200),
              affectedAreas: "",
              humanImpact: "",
              infrastructureDamage: "",
              economicImpact: "",
              governmentResponse: "",
              rescueRelief: "",
              recovery: "",
              sourceAssessment: `Vector similarity ${(doc.similarity * 100).toFixed(0)}% from the search document corpus.`,
              conflictingReports: [],
              synthesizedAt: (/* @__PURE__ */ new Date()).toISOString(),
              evidenceStatus: "Limited Coverage",
              retrievalMetadata: { queriesExecuted: ["match_documents"], rawSourcesCount: docHits.length, dedupedSourcesCount: docHits.length }
            })),
            source: "database",
            provenance: "vector_documents"
          };
          cache.set("search", cacheKey, response2, cache.getTTL("search"));
          res.json(response2);
          return;
        }
      }
    }
    const bundle = await buildHistoricalEvidenceBundle(query);
    await persistExternalResearch(query, bundle);
    const response = { results: [bundle], source: "external_research", provenance: "external" };
    cache.set("search", cacheKey, response, cache.getTTL("search"));
    res.json(response);
  } catch (error) {
    if (error instanceof Error && /no live google news sources|insufficient relevant historical evidence/i.test(error.message)) {
      res.json({ results: [], source: "none", provenance: "none", message: "No verified information was found for this query." });
      return;
    }
    sendError(res, error);
  }
});
router.get("/past/archive", async (req, res) => {
  try {
    if (!isSupabaseConfigured()) throw unavailable("Database not configured");
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
    const archive = await listArchivedCanonicalEvents(limit);
    const items = await Promise.all(archive.items.map(bundleForCanonicalEvent));
    const category = typeof req.query.category === "string" && !/^all/i.test(req.query.category) ? req.query.category : void 0;
    const state = typeof req.query.state === "string" && !/^all/i.test(req.query.state) ? req.query.state : void 0;
    const decade = typeof req.query.decade === "string" && !/^all/i.test(req.query.decade) ? req.query.decade : void 0;
    let filtered = items;
    if (category) filtered = filtered.filter((item) => item.disasterType === category);
    if (state) filtered = filtered.filter((item) => item.state.toLowerCase() === state.toLowerCase());
    if (decade) {
      filtered = filtered.filter((item) => {
        const year = item.eventDate ? new Date(item.eventDate).getFullYear() : NaN;
        const itemDecade = Number.isFinite(year) ? `${String(Math.floor(year / 10) * 10)}s` : "";
        return itemDecade === decade;
      });
    }
    res.setHeader("Cache-Control", "public, max-age=300");
    res.json({ items: filtered, count: filtered.length, retrievedAt: archive.retrievedAt, cacheStatus: archive.cacheStatus });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/past/search", async (req, res) => {
  try {
    const query = typeof req.body?.query === "string" ? req.body.query.trim() : "";
    if (!query) throw badRequest("Query parameter is required");
    rateLimit(req, "past-search", 20, 6e4);
    const forceResearch = req.body?.forceResearch === true;
    const research = await researchHistoricalDisaster(query, { historical: true, forceResearch });
    if (research.source === "database" && research.event?.id) {
      const dto = await getCanonicalEventById(research.event.id);
      if (dto) {
        const bundle = await bundleForCanonicalEvent(dto);
        if (queryMatchesBundle(query, bundle)) {
          res.setHeader("Cache-Control", "private, max-age=900");
          res.json({ bundle, source: "database", retrieval: research.retrieval });
          return;
        }
      }
    }
    if (research.source === "none") {
      res.json({
        bundle: null,
        noResults: true,
        error: null,
        details: "No sufficiently reliable evidence was available from the database or external sources.",
        retrieval: research.retrieval
      });
      return;
    }
    const evidenceBundle = await buildHistoricalEvidenceBundle(query);
    const eventId = research.persistence?.eventId || research.event?.id || null;
    if (eventId) await persistRichEvidenceBundle(eventId, evidenceBundle).catch((error) => {
      console.error("[past:search] rich dossier persistence failed:", error.message);
    });
    res.json({
      bundle: eventId ? { ...evidenceBundle, id: eventId } : evidenceBundle,
      source: "multi_source_research",
      event: research.event,
      citations: research.citations,
      verification: research.verification,
      retrieval: research.retrieval,
      persistence: {
        succeeded: persistenceSucceeded(research.persistence),
        eventId: research.persistence?.eventId || null,
        observationsPersisted: research.persistence?.observationsPersisted || 0,
        embedded: research.persistence?.embedded || false,
        errors: research.persistence?.errors || []
      }
    });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/past/compare", async (req, res) => {
  try {
    const bundles = req.body?.bundles;
    if (!Array.isArray(bundles) || bundles.length < 2 || bundles.length > 4) {
      throw badRequest("Select between 2 and 4 events to compare");
    }
    res.json(await compareDisasterEvents(bundles));
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/past/chat", async (req, res) => {
  try {
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) throw badRequest("Message is required");
    if (message.length > 2e3) throw badRequest("Message is too long (max 2000 characters)");
    rateLimit(req, "chat", 20, 6e4);
    const moderation = moderateChatInput(message);
    if (!moderation.allowed) {
      res.status(422).json({
        success: false,
        error: { code: "CHAT_INPUT_BLOCKED", message: "Please rephrase your message using respectful disaster-related wording." }
      });
      return;
    }
    const history = Array.isArray(req.body?.history) ? req.body.history : [];
    const associatedBundle = req.body?.associatedBundle || null;
    let groundingBundle = associatedBundle;
    let groundingSource = "conversation";
    if (!groundingBundle) {
      const research = await researchHistoricalDisaster(message, { historical: true });
      if (research.source === "database" && research.event?.id) {
        const dto = await getCanonicalEventById(research.event.id);
        if (dto) {
          groundingBundle = await bundleForCanonicalEvent(dto);
          groundingSource = "database";
        }
      } else if (research.source === "multi_source_research" && research.evidence.length > 0) {
        try {
          const builtBundle = await buildHistoricalEvidenceBundle(message);
          const eventId = research.persistence?.eventId || research.event?.id || null;
          if (eventId) await persistRichEvidenceBundle(eventId, builtBundle).catch(() => void 0);
          groundingBundle = eventId ? { ...builtBundle, id: eventId } : builtBundle;
          groundingSource = "multi_source_research";
        } catch {
          groundingBundle = null;
        }
      }
    }
    const chatResponse = await chatResearchAssistant({ message, history, associatedBundle: groundingBundle });
    if (groundingBundle) chatResponse.groundingSource = groundingSource;
    res.json(chatResponse);
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/alerts", async (req, res) => {
  try {
    const clientEtag = req.headers["if-none-match"];
    const result = await getSachetAlerts(typeof clientEtag === "string" ? clientEtag : void 0);
    res.setHeader("ETag", result.etag);
    res.setHeader("Cache-Control", "public, max-age=15");
    if (!result.isModified && clientEtag) {
      res.status(304).end();
      return;
    }
    const categories = Array.from(new Set(result.alerts.map((a) => a.category)));
    res.json({
      alerts: result.alerts,
      activeCount: result.alerts.length,
      categoriesCount: categories.length,
      categories,
      lastUpdated: result.lastUpdated,
      cacheStatus: result.cacheStatus,
      etag: result.etag
    });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/alerts/:id/news", async (req, res) => {
  try {
    const query = req.query.q || `${req.params.id} India disaster`;
    const windowHours = parseInt(req.query.window || "72", 10);
    const news = await searchGoogleNews(query, { isCurrentNews: true, windowHours, maxResults: 6 });
    res.setHeader("Cache-Control", "public, max-age=60");
    res.json({
      alertId: req.params.id,
      query,
      windowHours,
      articles: news,
      count: news.length,
      retrievedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/geocode", async (req, res) => {
  try {
    const query = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!query) throw badRequest("Location query is required");
    const cacheKey = `geocode:${query.toLowerCase()}`;
    const cached = cache.get("geocode", cacheKey);
    if (cached) {
      res.setHeader("Cache-Control", "public, max-age=600");
      res.json(cached);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&addressdetails=1&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { "User-Agent": "AapdaDrishti/2.0 (geocoding)", Accept: "application/json" }
    });
    if (!response.ok) throw unavailable("Geocoding service unavailable");
    const results = await response.json();
    const places = (Array.isArray(results) ? results : []).map((item) => {
      const address = item.address || {};
      return {
        name: String(item.display_name || item.name || query),
        lat: Number(item.lat),
        lng: Number(item.lon),
        state: address.state || address.state_district || address.county || void 0,
        district: address.county || address.city_district || address.district || void 0,
        country: address.country || "India"
      };
    }).filter((place) => Number.isFinite(place.lat) && Number.isFinite(place.lng));
    const payload = { query, count: places.length, places, timestamp: (/* @__PURE__ */ new Date()).toISOString() };
    cache.set("geocode", cacheKey, payload, cache.getTTL("geocode"));
    res.setHeader("Cache-Control", "public, max-age=600");
    res.json(payload);
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/transcribe", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!isGroqConfigured()) throw unavailable("Groq is not configured on the server (set GROQ_API_KEY)");
    rateLimit(req, "stt", 20, 6e4);
    const audioBase64 = typeof req.body?.audioBase64 === "string" ? req.body.audioBase64 : void 0;
    const mimeType = typeof req.body?.mimeType === "string" ? req.body.mimeType : req.file?.mimetype;
    if (!req.file?.buffer && !audioBase64) throw badRequest("Audio data is required for transcription");
    const transcription = await transcribeAudio(req.file?.buffer || audioBase64, mimeType || "audio/webm");
    res.json({ text: transcription.text, sourceText: transcription.text, success: true });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/tts", requireAuth, async (req, res) => {
  try {
    if (!isGroqConfigured()) throw unavailable("Groq is not configured on the server (set GROQ_API_KEY)");
    rateLimit(req, "tts", 30, 6e4);
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text) throw badRequest("Text is required for TTS");
    if (text.length > 2e3) throw badRequest("Text is too long for a single TTS request (max 2000 characters)");
    const audioBase64 = await generateTTSAudio(text, typeof req.body?.voiceName === "string" ? req.body.voiceName : void 0);
    if (!audioBase64) throw unavailable("TTS synthesis failed on the provider");
    res.json({ audioBase64 });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/profile", requireAuth, async (req, res) => {
  try {
    const [profiles, locations, subscriptions, phoneNumbers] = await Promise.all([
      supabaseRest(
        `profiles?id=eq.${encodeURIComponent(req.user.id)}&select=id,name,email,role,created_at,updated_at&limit=1`,
        { method: "GET" }
      ),
      // user_locations stores geography; the RPC projects computed lat/lng.
      supabaseRest(
        "rpc/user_locations_geo",
        {
          method: "POST",
          body: JSON.stringify({ p_user_id: req.user.id }),
          headers: {
            select: "id,location_type,label,city,district,state,country,accuracy_meters,latitude,longitude,created_at,updated_at"
          }
        }
      ),
      supabaseRest(
        `subscriptions?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,email_enabled,sms_enabled,push_enabled,nearby_radius_km,severity_threshold,created_at,updated_at&limit=1`,
        { method: "GET" }
      ),
      supabaseRest(
        `phone_numbers?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,phone_number,verified,created_at&order=created_at.desc`,
        { method: "GET" }
      )
    ]);
    res.json({
      profile: profiles[0] || null,
      locations,
      subscription: subscriptions[0] || null,
      phoneNumbers
    });
  } catch (error) {
    sendError(res, error);
  }
});
router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    if (!name) throw badRequest("Name is required");
    if (name.length > 120) throw badRequest("Name is too long");
    const updated = await supabaseRest(
      `profiles?id=eq.${encodeURIComponent(req.user.id)}&select=id,name,email,role,updated_at`,
      { method: "PATCH", body: JSON.stringify({ name }) }
    );
    res.json({ profile: updated[0] || null });
  } catch (error) {
    sendError(res, error);
  }
});
router.put("/profile/home-location", requireAuth, async (req, res) => {
  try {
    const latitude = readNumber(req.body?.latitude);
    const longitude = readNumber(req.body?.longitude);
    if (latitude === void 0 || longitude === void 0) {
      throw badRequest("Coordinates are required for a saved home location");
    }
    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      throw badRequest("Coordinates must be valid WGS84 values");
    }
    const existing = await supabaseRest(
      `user_locations?user_id=eq.${encodeURIComponent(req.user.id)}&location_type=eq.HOME&select=id&limit=1`,
      { method: "GET" }
    );
    const payload = {
      location_type: "HOME",
      label: typeof req.body?.label === "string" && req.body.label.trim() ? req.body.label.trim().slice(0, 120) : "Home",
      geometry: pointWkt(longitude, latitude),
      city: typeof req.body?.city === "string" ? req.body.city.slice(0, 120) : null,
      district: typeof req.body?.district === "string" ? req.body.district.slice(0, 120) : null,
      state: typeof req.body?.state === "string" ? req.body.state.slice(0, 120) : null,
      country: "India",
      accuracy_meters: readNumber(req.body?.accuracyMeters) ?? null
    };
    const rows = existing[0] ? await supabaseRest(
      `user_locations?id=eq.${existing[0].id}&select=id,location_type,label,city,district,state,latitude,longitude,updated_at`,
      { method: "PATCH", body: JSON.stringify(payload) }
    ) : await supabaseRest(
      "user_locations",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ user_id: req.user.id, ...payload })
      }
    );
    res.json({ location: rows[0] || null });
  } catch (error) {
    sendError(res, error);
  }
});
router.delete("/profile/home-location", requireAuth, async (req, res) => {
  try {
    await supabaseRest(
      `user_locations?user_id=eq.${encodeURIComponent(req.user.id)}&location_type=eq.HOME`,
      { method: "DELETE" }
    );
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});
router.patch("/subscriptions", requireAuth, async (req, res) => {
  try {
    const radius = readNumber(req.body?.nearbyRadiusKm);
    const payload = {
      email_enabled: Boolean(req.body?.emailEnabled),
      sms_enabled: Boolean(req.body?.smsEnabled),
      push_enabled: Boolean(req.body?.pushEnabled),
      nearby_radius_km: radius !== void 0 ? Math.max(1, Math.min(radius, 500)) : 50,
      severity_threshold: typeof req.body?.severityThreshold === "string" && ["Unknown", "Minor", "Moderate", "Severe", "Extreme"].includes(req.body.severityThreshold) ? req.body.severityThreshold : "Moderate"
    };
    const rows = await supabaseRest(
      `subscriptions?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,email_enabled,sms_enabled,push_enabled,nearby_radius_km,severity_threshold,updated_at`,
      { method: "PATCH", body: JSON.stringify(payload) }
    );
    if (rows.length === 0) {
      const created = await supabaseRest(
        "subscriptions",
        {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({ user_id: req.user.id, ...payload })
        }
      );
      res.json({ subscription: created[0] || null });
      return;
    }
    res.json({ subscription: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/phone-numbers", requireAuth, async (req, res) => {
  try {
    const phone = typeof req.body?.phoneNumber === "string" ? req.body.phoneNumber.trim() : "";
    if (!/^\+?[0-9]{10,15}$/.test(phone)) throw badRequest("A valid phone number (10-15 digits) is required");
    const rows = await supabaseRest(
      "phone_numbers",
      {
        method: "POST",
        headers: { Prefer: "return=representation" },
        body: JSON.stringify({ user_id: req.user.id, phone_number: phone, verified: false })
      }
    );
    res.status(201).json({ phoneNumber: rows[0] || null });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/phone-numbers/:id/send-otp", requireAuth, async (req, res) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest("A valid phone number id is required");
    const rows = await supabaseRest(
      `phone_numbers?id=eq.${req.params.id}&user_id=eq.${encodeURIComponent(req.user.id)}&select=id,phone_number,verified&limit=1`,
      { method: "GET" }
    );
    const record = rows[0];
    if (!record) throw notFound("Phone number not found");
    if (record.verified) throw badRequest("This number is already verified");
    if (!isSmsConfigured()) throw unavailable("SMS provider is not configured on the server");
    rateLimit(req, `otp-send:${req.user.id}`, 5, 15 * 6e4);
    const code = String(Math.floor(1e5 + Math.random() * 9e5));
    const codeHash = (0, import_node_crypto.createHash)("sha256").update(`${record.id}:${code}`).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 6e4).toISOString();
    await supabaseRest(`phone_numbers?id=eq.${record.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        verification_code_hash: codeHash,
        verification_expires_at: expiresAt,
        verification_attempts: 0
      })
    });
    const sent = await sendNotificationSms({
      to: record.phone_number,
      eventType: "verification",
      severity: "Info",
      location: "phone verification"
    }).catch((error) => ({ success: false, error: error.message }));
    const otpSent = sent.success ? sent : await (async () => {
      const provider2 = getSmsProvider();
      if (!provider2) return { success: false, error: "SMS provider unavailable" };
      return provider2.send({
        to: record.phone_number,
        body: `Aapda Drishti verification code: ${code}. Expires in 10 minutes. Do not share this code.`
      });
    })();
    if (!otpSent.success) {
      await supabaseRest(`phone_numbers?id=eq.${record.id}`, {
        method: "PATCH",
        body: JSON.stringify({ verification_code_hash: null, verification_expires_at: null })
      });
      throw new Error(otpSent.error || "SMS delivery failed");
    }
    res.json({ success: true, expiresAt });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/phone-numbers/:id/verify-otp", requireAuth, async (req, res) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest("A valid phone number id is required");
    const code = typeof req.body?.code === "string" ? req.body.code.trim() : "";
    if (!/^\d{6}$/.test(code)) throw badRequest("A 6-digit verification code is required");
    const rows = await supabaseRest(
      `phone_numbers?id=eq.${req.params.id}&user_id=eq.${encodeURIComponent(req.user.id)}&select=id,verification_code_hash,verification_expires_at,verification_attempts,verified&limit=1`,
      { method: "GET" }
    );
    const record = rows[0];
    if (!record) throw notFound("Phone number not found");
    if (record.verified) {
      res.json({ success: true, verified: true });
      return;
    }
    if (!record.verification_code_hash || !record.verification_expires_at) {
      throw badRequest("No verification code was sent. Request a new code.");
    }
    if (new Date(record.verification_expires_at).getTime() < Date.now()) {
      throw badRequest("The verification code has expired. Request a new one.", "OTP_EXPIRED");
    }
    if (record.verification_attempts >= 5) {
      throw badRequest("Too many attempts. Request a new code.", "OTP_LOCKED");
    }
    const codeHash = (0, import_node_crypto.createHash)("sha256").update(`${record.id}:${code}`).digest("hex");
    if (codeHash !== record.verification_code_hash) {
      await supabaseRest(`phone_numbers?id=eq.${record.id}`, {
        method: "PATCH",
        body: JSON.stringify({ verification_attempts: record.verification_attempts + 1 })
      });
      throw badRequest("Incorrect verification code.", "OTP_INVALID");
    }
    await supabaseRest(`phone_numbers?id=eq.${record.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        verified: true,
        verified_at: (/* @__PURE__ */ new Date()).toISOString(),
        verification_code_hash: null,
        verification_expires_at: null,
        verification_attempts: 0
      })
    });
    res.json({ success: true, verified: true });
  } catch (error) {
    sendError(res, error);
  }
});
router.delete("/phone-numbers/:id", requireAuth, async (req, res) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest("A valid phone number id is required");
    await supabaseRest(
      `phone_numbers?id=eq.${req.params.id}&user_id=eq.${encodeURIComponent(req.user.id)}`,
      { method: "DELETE" }
    );
    res.json({ success: true });
  } catch (error) {
    sendError(res, error);
  }
});
var MEDIA_ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov"
};
var MEDIA_MAX_BYTES = 10 * 1024 * 1024;
var MEDIA_MAX_COUNT = 3;
var mediaUpload = (0, import_multer.default)({
  storage: import_multer.default.memoryStorage(),
  limits: { fileSize: MEDIA_MAX_BYTES, files: MEDIA_MAX_COUNT }
});
router.post("/reports/media", requireAuth, mediaUpload.array("files", MEDIA_MAX_COUNT), async (req, res) => {
  try {
    const files = req.files || [];
    if (files.length === 0) throw badRequest("At least one media file is required");
    if (!isSupabaseConfigured()) throw unavailable("Storage is not configured");
    const objectUrls = [];
    for (const file of files) {
      const ext = MEDIA_ALLOWED_TYPES[file.mimetype];
      if (!ext) throw badRequest(`Unsupported media type: ${file.mimetype}. Allowed: images (jpeg/png/webp/heic) and videos (mp4/mov).`, "MEDIA_TYPE");
      if (file.size > MEDIA_MAX_BYTES) throw badRequest(`File exceeds the ${MEDIA_MAX_BYTES / (1024 * 1024)} MB limit`, "MEDIA_SIZE");
      const objectPath = `${req.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
      const response = await fetch(
        `${getSupabaseUrl()}/storage/v1/object/report-media/${objectPath}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
            "Content-Type": file.mimetype,
            "x-upsert": "false"
          },
          body: new Uint8Array(file.buffer),
          signal: AbortSignal.timeout(3e4)
        }
      );
      if (!response.ok) {
        const detail = await response.text().catch(() => "");
        throw new Error(`Storage upload failed (${response.status}): ${detail.slice(0, 200)}`);
      }
      objectUrls.push(objectPath);
    }
    res.status(201).json({ objects: objectUrls });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/reports/media/signed-urls", requireAuth, async (req, res) => {
  try {
    const objects = Array.isArray(req.body?.objects) ? req.body.objects.filter((o) => typeof o === "string" && o.startsWith(`${req.user.id}/`)).slice(0, MEDIA_MAX_COUNT) : [];
    if (objects.length === 0) throw badRequest("Valid media object paths are required");
    if (!isSupabaseConfigured()) throw unavailable("Storage is not configured");
    const signed = [];
    for (const object of objects) {
      const response = await fetch(`${getSupabaseUrl()}/storage/v1/object/sign/report-media/${object}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ expiresIn: 300 }),
        signal: AbortSignal.timeout(15e3)
      });
      if (!response.ok) {
        signed.push({ object, signedUrl: null });
        continue;
      }
      const payload = await response.json();
      signed.push({
        object,
        signedUrl: payload.signedURL ? `${getSupabaseUrl()}${payload.signedURL}` : null
      });
    }
    res.json({ signed });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/reports", requireAuth, async (req, res) => {
  try {
    const reportText = typeof req.body?.reportText === "string" ? req.body.reportText.trim() : "";
    const latitude = readNumber(req.body?.latitude);
    const longitude = readNumber(req.body?.longitude);
    const accuracyMeters = readNumber(req.body?.accuracyMeters);
    const maxAccuracy = Number(process.env.REPORT_MAX_ACCURACY_METERS || 150);
    const validCategories = ["Flood", "Cyclone", "Heavy Rain", "Thunderstorm", "Lightning", "Heat Wave", "Cold Wave", "Landslide", "Earthquake", "Avalanche", "Forest Fire", "Urban Flood", "Air Pollution", "Storm", "General Alert"];
    if (!reportText) throw badRequest("Report text is required");
    if (reportText.length > 4e3) throw badRequest("Report text is too long (max 4000 characters)");
    if (latitude === void 0 || longitude === void 0 || accuracyMeters === void 0) {
      throw badRequest("Current browser coordinates and accuracy are required");
    }
    if (accuracyMeters > maxAccuracy) {
      throw badRequest(`Location accuracy must be ${maxAccuracy} meters or better`, "LOCATION_ACCURACY");
    }
    const category = typeof req.body?.category === "string" && validCategories.includes(req.body.category) ? req.body.category : "General Alert";
    const moderation = moderateChatInput(reportText);
    if (!moderation.allowed) {
      res.status(422).json({
        success: false,
        error: { code: "REPORT_CONTENT_BLOCKED", message: "Please rephrase the report using respectful language." }
      });
      return;
    }
    const userHistory = await supabaseRest(
      `citizen_reports?user_id=eq.${encodeURIComponent(req.user.id)}&select=report_text,reported_at&order=reported_at.desc&limit=20`,
      { method: "GET" }
    ).catch(() => []);
    const risk = scoreReportRisk({
      reportText,
      honeypot: typeof req.body?.honeypot === "string" ? req.body.honeypot : null,
      elapsedMs: readNumber(req.body?.elapsedMs) ?? null,
      accuracyMeters,
      latitude,
      longitude,
      userRecentReports: userHistory.map((r) => ({ reportText: r.report_text, reportedAt: r.reported_at }))
    });
    const mediaUrls = Array.isArray(req.body?.mediaUrls) ? req.body.mediaUrls.filter((path2) => typeof path2 === "string" && path2.startsWith(`${req.user.id}/`) && !path2.includes("..")).slice(0, 3) : [];
    const rows = await supabaseRest("citizen_reports", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        user_id: req.user.id,
        report_text: reportText,
        geometry: pointWkt(longitude, latitude),
        accuracy_meters: accuracyMeters,
        media_urls: mediaUrls,
        reported_category: category,
        status: "PENDING",
        verification_score: 0,
        verification_reason: "Awaiting cross-source verification.",
        risk_score: risk.riskScore,
        risk_factors: risk.riskFactors
      })
    });
    res.status(201).json({ report: rows[0] || null, riskScore: risk.riskScore });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/reports/mine", requireAuth, async (req, res) => {
  try {
    const reports = await supabaseRest(
      `citizen_reports?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,report_text,accuracy_meters,media_urls,reported_category,reported_at,status,verification_score,verification_reason,linked_event_id,created_at&order=reported_at.desc&limit=50`,
      { method: "GET" }
    );
    res.json({ reports });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/notifications", requireAuth, async (req, res) => {
  try {
    const notifications = await supabaseRest(
      `notifications?user_id=eq.${encodeURIComponent(req.user.id)}&select=id,event_id,channel,status,reason,sent_at,error_message,created_at&order=created_at.desc&limit=50`,
      { method: "GET" }
    );
    res.json({ notifications });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/insights", async (_req, res) => {
  try {
    const cached = cache.get("insights", "global");
    if (cached) {
      res.setHeader("Cache-Control", "public, max-age=600");
      res.json(cached);
      return;
    }
    const insights = await computeInsights();
    if (insights.cacheStatus === "MISS") {
      cache.set("insights", "global", insights, 600);
    }
    res.setHeader("Cache-Control", "public, max-age=600");
    res.json(insights);
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/overview", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const countOf = async (resource) => {
      try {
        const response = await fetch(`${getSupabaseUrl()}/rest/v1/${resource}&limit=1`, {
          method: "GET",
          headers: {
            apikey: SUPABASE_SECRET_KEY,
            Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
            Prefer: "count=exact",
            Accept: "application/json"
          }
        });
        const range = response.headers.get("content-range");
        if (!range) return 0;
        const total = range.split("/")[1];
        return total === "*" ? 0 : Number(total) || 0;
      } catch {
        return 0;
      }
    };
    const [activeEvents, archivedEvents, totalReports, pendingReports, recentJobs, failedJobs] = await Promise.all([
      countOf("canonical_events?status=in.(DEVELOPING,ACTIVE,UPDATING,ENDING)"),
      countOf("canonical_events?status=in.(ENDED,ARCHIVED)"),
      countOf("citizen_reports?select=id"),
      countOf("citizen_reports?status=in.(PENDING,VERIFYING)&select=id"),
      countOf(`job_runs?started_at=gte.${encodeURIComponent(new Date(Date.now() - 24 * 3600 * 1e3).toISOString())}&select=id`),
      countOf("job_runs?status=eq.FAILED&select=id")
    ]);
    let lastJobAt = null;
    try {
      const last = await supabaseRest(
        "job_runs?select=started_at&order=started_at.desc&limit=1",
        { method: "GET" }
      );
      lastJobAt = last[0]?.started_at || null;
    } catch {
      lastJobAt = null;
    }
    res.json({
      activeEvents,
      archivedEvents,
      totalReports,
      pendingReports,
      recentJobs,
      failedJobs,
      lastJobAt,
      database: isSupabaseConfigured(),
      groq: isGroqConfigured(),
      embeddings: isEmbeddingAvailable(),
      email: isEmailConfigured(),
      sms: isSmsConfigured()
    });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/events", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const events = await supabaseRest(
      "canonical_events?select=id,title,event_type,status,severity,verification_status,verification_score,state,last_observed_at,updated_at&order=updated_at.desc&limit=100",
      { method: "GET" }
    );
    res.json({ events });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/reports", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const reports = await supabaseRest(
      "citizen_reports?select=id,user_id,report_text,reported_category,status,verification_score,verification_reason,linked_event_id,reported_at&order=reported_at.desc&limit=100",
      { method: "GET" }
    );
    res.json({ reports });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/sources", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const sources = await supabaseRest(
      "source_definitions?select=id,source_key,name,source_type,enabled,priority,trust_weight,last_success_at,last_failure_at,health_status,source_health(status,last_run,records_received,records_accepted,records_rejected,message)&order=name.asc",
      { method: "GET" }
    );
    res.json({ sources });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/jobs", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const jobs = await supabaseRest(
      "job_runs?select=id,job_type,started_at,finished_at,status,records_processed,records_created,records_updated,records_rejected,error_message,metadata&order=started_at.desc&limit=100",
      { method: "GET" }
    );
    res.json({ jobs });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/embeddings-health", requireAuth, requireAdmin, async (_req, res) => {
  try {
    const [events, eventEmbeddings, observations, sourceEmbeddings, documents, docEmbeddings] = await Promise.all([
      supabaseRest("canonical_events?select=id", { method: "GET" }).catch(() => []),
      supabaseRest("event_embeddings?select=event_id,embedding_model,embedding_dimensions", { method: "GET" }).catch(() => []),
      supabaseRest("source_observations?select=id", { method: "GET" }).catch(() => []),
      supabaseRest("source_embeddings?select=observation_id", { method: "GET" }).catch(() => []),
      supabaseRest("search_documents?select=id", { method: "GET" }).catch(() => []),
      supabaseRest("search_documents?embedding=not.is.null&select=id,embedding_provider,embedding_model", { method: "GET" }).catch(() => [])
    ]);
    const models = /* @__PURE__ */ new Set([
      ...eventEmbeddings.map((e) => `${e.embedding_model}@${e.embedding_dimensions}`),
      ...docEmbeddings.map((d) => d.embedding_model)
    ]);
    res.json({
      provider: isEmbeddingAvailable() ? "gemini" : "unconfigured",
      available: isEmbeddingAvailable(),
      model: process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2",
      dimensions: getEmbeddingDimensions(),
      modelsInUse: Array.from(models),
      canonicalEvents: events.length,
      eventsEmbedded: eventEmbeddings.length,
      sourceObservations: observations.length,
      observationsEmbedded: sourceEmbeddings.length,
      searchDocuments: documents.length,
      documentsEmbedded: docEmbeddings.length
    });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/ai-health", requireAuth, requireAdmin, async (_req, res) => {
  try {
    res.json({
      groq: {
        configured: isGroqConfigured(),
        model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        fallbacks: process.env.GROQ_MODEL_FALLBACKS || "none",
        sttModel: process.env.GROQ_STT_MODEL || "whisper-large-v3-turbo",
        ttsModel: process.env.GROQ_TTS_MODEL || "canopylabs/orpheus-v1-english",
        keyPool: getKeyPoolHealth()
      },
      embedding: {
        available: isEmbeddingAvailable(),
        provider: "gemini",
        model: process.env.GEMINI_EMBEDDING_MODEL || "gemini-embedding-2",
        dimensions: getEmbeddingDimensions()
      },
      notifications: { email: isEmailConfigured(), sms: isSmsConfigured() },
      database: { configured: isSupabaseConfigured() }
    });
  } catch (error) {
    sendError(res, error);
  }
});
var ADMIN_JOB_MAP = {
  ingest: runIngestionJob,
  reconcile: runReconciliationJob,
  lifecycle: runLifecycleJob,
  embeddings: runEmbeddingJob,
  "verify-reports": runCitizenVerificationJob,
  notifications: runNotificationJob,
  backfill: runHistoricalBackfillJob
};
router.post("/admin/jobs/:job", requireAuth, requireAdmin, async (req, res) => {
  try {
    const job = ADMIN_JOB_MAP[req.params.job];
    if (!job) throw notFound(`Unknown job: ${req.params.job}`);
    const result = await job();
    res.json({ success: true, result });
  } catch (error) {
    sendError(res, error);
  }
});
var REPORT_ACTIONS = {
  verify: { action: "verify", status: "VERIFIED", score: 0.7, reasonTemplate: "Verified by admin moderation" },
  reject: { action: "reject", status: "REJECTED", score: 0, reasonTemplate: "Rejected by admin moderation" },
  duplicate: { action: "duplicate", status: "DUPLICATE", score: 0, reasonTemplate: "Marked duplicate by admin moderation" }
};
router.patch("/admin/reports/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest("A valid report id is required");
    const actionKey = typeof req.body?.action === "string" ? req.body.action : "";
    const action = REPORT_ACTIONS[actionKey];
    if (!action) {
      throw badRequest(`action must be one of: ${Object.keys(REPORT_ACTIONS).join(", ")}`);
    }
    const reason = typeof req.body?.reason === "string" && req.body.reason.trim() ? req.body.reason.trim().slice(0, 500) : action.reasonTemplate;
    const patch = {
      status: action.status,
      verification_score: action.score,
      verification_reason: reason
    };
    if (typeof req.body?.linkedEventId === "string" && /^[0-9a-f-]{36}$/i.test(req.body.linkedEventId)) {
      patch.linked_event_id = req.body.linkedEventId;
    } else if (req.body?.linkedEventId === null) {
      patch.linked_event_id = null;
    }
    const rows = await supabaseRest(
      `citizen_reports?id=eq.${req.params.id}&select=id,status,verification_score,verification_reason,linked_event_id`,
      { method: "PATCH", body: JSON.stringify(patch) }
    );
    if (rows.length === 0) throw notFound("Report not found");
    res.json({ report: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});
var EVENT_STATUSES = ["DEVELOPING", "ACTIVE", "UPDATING", "ENDING", "ENDED", "ARCHIVED", "REJECTED"];
router.patch("/admin/events/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest("A valid event id is required");
    const patch = {};
    if (typeof req.body?.status === "string") {
      if (!EVENT_STATUSES.includes(req.body.status)) {
        throw badRequest(`status must be one of: ${EVENT_STATUSES.join(", ")}`);
      }
      patch.status = req.body.status;
    }
    if (typeof req.body?.severity === "string" && ["Unknown", "Minor", "Moderate", "Severe", "Extreme"].includes(req.body.severity)) {
      patch.severity = req.body.severity;
    }
    if (typeof req.body?.verificationReason === "string" && req.body.verificationReason.trim()) {
      patch.verification_reason = req.body.verificationReason.trim().slice(0, 500);
    }
    if (req.body?.reject === true) {
      patch.verification_status = "REJECTED";
      patch.verification_reason = typeof req.body?.verificationReason === "string" && req.body.verificationReason.trim() ? req.body.verificationReason.trim().slice(0, 500) : "Rejected by admin review";
      patch.status = "REJECTED";
    }
    if (Object.keys(patch).length === 0) throw badRequest("No valid fields to update were provided");
    const rows = await supabaseRest(
      `canonical_events?id=eq.${req.params.id}&select=id,title,status,severity,verification_status,verification_reason`,
      { method: "PATCH", body: JSON.stringify(patch) }
    );
    if (rows.length === 0) throw notFound("Event not found");
    res.json({ event: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/events/:id/sources", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest("A valid event id is required");
    const sources = await supabaseRest(
      `event_sources?event_id=eq.${req.params.id}&select=source_id,citation_id,source_definitions(name,source_type,trust_weight),source_observations(id,title,source_url,publisher,published_at,retrieved_at)&order=created_at.asc`,
      { method: "GET" }
    );
    res.json({ sources });
  } catch (error) {
    sendError(res, error);
  }
});
router.patch("/admin/sources/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest("A valid source id is required");
    const patch = {};
    if (typeof req.body?.enabled === "boolean") patch.enabled = req.body.enabled;
    if (typeof req.body?.priority === "number") {
      patch.priority = Math.max(1, Math.min(Math.round(req.body.priority), 1e3));
    }
    if (typeof req.body?.trustWeight === "number") {
      patch.trust_weight = Math.max(0, Math.min(req.body.trustWeight, 1));
    }
    if (Object.keys(patch).length === 0) throw badRequest("No valid fields to update were provided");
    const rows = await supabaseRest(
      `source_definitions?id=eq.${req.params.id}&select=id,source_key,name,enabled,priority,trust_weight`,
      { method: "PATCH", body: JSON.stringify(patch) }
    );
    if (rows.length === 0) throw notFound("Source not found");
    res.json({ source: rows[0] });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/admin/sources/:id/observations", requireAuth, requireAdmin, async (req, res) => {
  try {
    if (!/^[0-9a-f-]{36}$/i.test(req.params.id)) throw badRequest("A valid source id is required");
    const observations = await supabaseRest(
      `source_observations?source_id=eq.${req.params.id}&select=id,title,source_url,publisher,published_at,retrieved_at,content_hash&order=retrieved_at.desc&limit=50`,
      { method: "GET" }
    );
    res.json({ observations });
  } catch (error) {
    sendError(res, error);
  }
});
router.post("/admin/research/historical", requireAuth, requireAdmin, async (req, res) => {
  try {
    const rawQueries = Array.isArray(req.body?.queries) ? req.body.queries : [req.body?.query];
    const queries = Array.from(new Set(rawQueries.filter((value) => typeof value === "string").map((value) => value.trim()).filter((value) => Boolean(value))));
    if (queries.length === 0) throw badRequest("Query is required");
    if (queries.length > 12) throw badRequest("Run at most 12 research queries in one shift");
    if (queries.some((query) => query.length > 300)) throw badRequest("Each query must be 300 characters or less");
    rateLimit(req, `admin-research:${req.user.id}`, 10, 6e4);
    const forceResearch = req.body?.forceResearch === true;
    const allowedResearchSources = [
      "sachet-cap",
      "imd",
      "cwc",
      "incois",
      "fsi",
      "dgre",
      "state-disaster-authorities",
      "google-news-rss",
      "national-news",
      "regional-news",
      "citizen",
      "reddit",
      "youtube",
      "x",
      "data-gov"
    ];
    const requestedSources = Array.isArray(req.body?.sources) ? req.body.sources.filter((s) => typeof s === "string" && allowedResearchSources.includes(s)) : void 0;
    const runOne = async (query) => {
      const research = await researchHistoricalDisaster(query, {
        historical: true,
        forceResearch,
        sources: requestedSources
      });
      let bundle = null;
      if (research.source === "database" && research.event?.id) {
        const dto = await getCanonicalEventById(research.event.id);
        bundle = dto ? await bundleForCanonicalEvent(dto) : null;
      } else if (research.source === "multi_source_research") {
        bundle = await buildHistoricalEvidenceBundle(query).catch(() => null);
        const eventId = research.persistence?.eventId || research.event?.id || null;
        if (bundle && eventId) {
          await persistRichEvidenceBundle(eventId, bundle).catch((error) => {
            console.error("[admin:research] rich dossier persistence failed:", error.message);
          });
          bundle = { ...bundle, id: eventId };
        }
      }
      return {
        query: research.query,
        source: research.source,
        event: research.event,
        bundle,
        citations: research.citations,
        verification: research.verification,
        retrieval: research.retrieval,
        persistence: {
          succeeded: persistenceSucceeded(research.persistence),
          eventId: research.persistence?.eventId || null,
          eventKey: research.persistence?.eventKey || null,
          observationsPersisted: research.persistence?.observationsPersisted || 0,
          documentsPersisted: research.persistence?.documentsPersisted || 0,
          embedded: research.persistence?.embedded || false,
          errors: research.persistence?.errors || []
        }
      };
    };
    const results = [];
    for (const query of queries) {
      results.push(await runOne(query));
    }
    res.json(queries.length === 1 ? results[0] : { batch: true, count: results.length, results });
  } catch (error) {
    sendError(res, error);
  }
});
function requireCronSecret(req, res, next) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    sendError(res, unavailable("Job scheduling not configured (set CRON_SECRET)"));
    return;
  }
  const provided = req.headers["x-cron-secret"] || req.body?.cronSecret;
  if (provided !== secret) {
    sendError(res, unauthorized("Invalid cron secret"));
    return;
  }
  next();
}
router.post("/jobs/:job", requireCronSecret, async (req, res) => {
  try {
    const job = ADMIN_JOB_MAP[req.params.job];
    if (!job) throw notFound(`Unknown job: ${req.params.job}`);
    const result = await job();
    res.json({ success: true, result });
  } catch (error) {
    sendError(res, error);
  }
});
router.get("/health", async (_req, res) => {
  const checks = {};
  if (isSupabaseConfigured()) {
    try {
      await supabaseRest("profiles?select=id&limit=1", { method: "GET" });
      checks.database = { status: "operational" };
    } catch (error) {
      checks.database = { status: "degraded", detail: error.message.slice(0, 120) };
    }
  } else {
    checks.database = { status: "not_configured" };
  }
  checks.groqAI = { status: isGroqConfigured() ? "configured" : "not_configured" };
  checks.embedding = { status: isEmbeddingAvailable() ? "configured" : "not_configured" };
  checks.sachet = { status: process.env.SOURCE_SACHET_ENABLED === "false" ? "disabled" : "operational" };
  checks.googleNews = { status: process.env.SOURCE_GOOGLE_NEWS_ENABLED === "false" ? "disabled" : "operational" };
  checks.email = { status: isEmailConfigured() ? "configured" : "not_configured" };
  checks.sms = { status: isSmsConfigured() ? "configured" : "not_configured" };
  const operational = Object.values(checks).filter((c) => c.status === "operational" || c.status === "configured").length;
  res.json({
    status: checks.database?.status === "degraded" ? "degraded" : "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    checks,
    operationalCount: operational,
    version: "2.1.0"
  });
});
var routes_default = router;

// server/app.ts
function getAllowedOrigins() {
  const isProd = process.env.NODE_ENV === "production";
  const raw = [
    process.env.CORS_ORIGINS,
    process.env.FRONTEND_URL,
    process.env.APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "",
    // Localhost defaults exist ONLY in development; production fails closed and
    // requires explicitly configured origins.
    ...isProd ? [] : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]
  ].filter((value) => Boolean(value)).flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean);
  return new Set(raw);
}
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else if (origin) {
    if (req.method === "OPTIONS") {
      res.status(403).end();
      return;
    }
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    req.headers["access-control-request-headers"]?.toString() || "Content-Type, Authorization, If-None-Match, X-Requested-With"
  );
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
}
function createApp(options = {}) {
  const app = (0, import_express2.default)();
  const mode = options.mode || (process.env.VERCEL ? "vercel" : process.env.NODE_ENV === "production" ? "production" : "dev");
  const serveStatic = options.serveStatic ?? mode !== "vercel";
  app.use(corsMiddleware);
  app.use(import_express2.default.json({ limit: "10mb" }));
  app.use(import_express2.default.urlencoded({ extended: true }));
  app.use("/api", routes_default);
  if (serveStatic) {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express2.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  return app;
}

// server.ts
async function startServer() {
  const app = createApp({ mode: "dev", serveStatic: false });
  const portFromEnv = Number(process.env.PORT);
  const port = Number.isFinite(portFromEnv) && portFromEnv > 0 ? portFromEnv : 5e3;
  const server = (0, import_http.createServer)(app);
  server.listen(port, "0.0.0.0", () => {
    console.log(`Disaster Intelligence Platform API listening on port ${port}`);
  });
}
startServer().catch((error) => {
  console.error("Failed to start backend server:", error);
  process.exit(1);
});
//# sourceMappingURL=server.cjs.map
